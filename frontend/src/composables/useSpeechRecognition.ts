import { ref, onUnmounted } from 'vue';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

const isSupported = typeof window !== 'undefined' && (
  'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
);

export function useSpeechRecognition() {
  const isRecording = ref(false);
  const transcript = ref('');
  const speechError = ref<string | null>(null);

  let recognition: any = null;

  function createRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let final = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      transcript.value = final || interim;
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== 'aborted') {
        speechError.value = event.error;
      }
      isRecording.value = false;
    };

    rec.onend = () => {
      isRecording.value = false;
    };

    return rec;
  }

  function toggle() {
    if (!isSupported) return;

    if (isRecording.value) {
      recognition?.stop();
      isRecording.value = false;
      return;
    }

    speechError.value = null;
    transcript.value = '';
    recognition = createRecognition();
    if (!recognition) return;

    recognition.start();
    isRecording.value = true;
  }

  onUnmounted(() => {
    if (recognition && isRecording.value) {
      recognition.stop();
    }
  });

  return {
    isRecording,
    transcript,
    speechError,
    isSupported,
    toggle,
  };
}
