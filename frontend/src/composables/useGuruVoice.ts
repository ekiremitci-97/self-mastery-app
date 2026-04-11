import { ref, onUnmounted } from 'vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useGuruVoice() {
  const isSpeaking = ref(false);
  const isLoadingAudio = ref(false);
  const audioLevel = ref(0);

  let audioElement: HTMLAudioElement | null = null;
  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let animationId: number | null = null;
  let sourceNode: MediaElementAudioSourceNode | null = null;

  function updateAudioLevel() {
    if (!analyser || !isSpeaking.value) {
      audioLevel.value = 0;
      return;
    }

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    // Average of frequency bins, normalized to 0-1
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length / 255;
    audioLevel.value = avg;

    animationId = requestAnimationFrame(updateAudioLevel);
  }

  async function speak(text: string) {
    stop();

    isLoadingAudio.value = true;

    try {
      const res = await fetch(`${API_URL}/api/guru/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error('TTS request failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      audioElement = new Audio(url);

      // Set up AudioContext for level analysis
      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Resume context (required for iOS after user gesture)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      sourceNode = audioContext.createMediaElementSource(audioElement);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      sourceNode.connect(analyser);
      analyser.connect(audioContext.destination);

      audioElement.onplay = () => {
        isSpeaking.value = true;
        isLoadingAudio.value = false;
        updateAudioLevel();
      };

      audioElement.onended = () => {
        isSpeaking.value = false;
        audioLevel.value = 0;
        if (animationId) cancelAnimationFrame(animationId);
        URL.revokeObjectURL(url);
        cleanup();
      };

      audioElement.onerror = () => {
        isSpeaking.value = false;
        isLoadingAudio.value = false;
        audioLevel.value = 0;
        URL.revokeObjectURL(url);
        cleanup();
      };

      await audioElement.play();
    } catch {
      isLoadingAudio.value = false;
      isSpeaking.value = false;
    }
  }

  function cleanup() {
    if (sourceNode) {
      sourceNode.disconnect();
      sourceNode = null;
    }
    if (analyser) {
      analyser.disconnect();
      analyser = null;
    }
    audioElement = null;
  }

  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    isSpeaking.value = false;
    isLoadingAudio.value = false;
    audioLevel.value = 0;
    cleanup();
  }

  onUnmounted(() => {
    stop();
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
  });

  return {
    isSpeaking,
    isLoadingAudio,
    audioLevel,
    speak,
    stop,
  };
}
