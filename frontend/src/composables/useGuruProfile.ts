import { ref } from 'vue';

const PROFILE_KEY = 'self-mastery-guru-profile';

export interface GuruProfile {
  name: string;
  avatar: string;
}

const GURU_AVATARS = [
  { id: 'sage', label: 'Sage' },
  { id: 'grandmother', label: 'Grandmother' },
  { id: 'samurai', label: 'Samurai' },
  { id: 'stoic', label: 'Stoic' },
  { id: 'muse', label: 'Muse' },
  { id: 'elder', label: 'Elder' },
  { id: 'priestess', label: 'Priestess' },
  { id: 'monk', label: 'Monk' },
  { id: 'novice', label: 'Novice' },
  { id: 'philosopher', label: 'Philosopher' },
] as const;

export type GuruAvatarId = (typeof GURU_AVATARS)[number]['id'];

function loadProfile(): GuruProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GuruProfile;
    if (!parsed.name || !parsed.avatar) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveProfile(profile: GuruProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

const profile = ref<GuruProfile | null>(loadProfile());

export function useGuruProfile() {
  const isSetUp = ref(!!profile.value);

  function setUp(name: string, avatar: string) {
    const p: GuruProfile = { name: name.trim(), avatar };
    saveProfile(p);
    profile.value = p;
    isSetUp.value = true;
  }

  function getAvatarId(): string {
    if (!profile.value) return GURU_AVATARS[0].id;
    const found = GURU_AVATARS.find(a => a.id === profile.value!.avatar);
    return found ? found.id : GURU_AVATARS[0].id;
  }

  function getAvatarSrc(): string {
    return `/avatars/${getAvatarId()}.png`;
  }

  function getName(): string {
    return profile.value?.name || 'Guru';
  }

  return {
    profile,
    isSetUp,
    setUp,
    getAvatarId,
    getAvatarSrc,
    getName,
    avatarOptions: GURU_AVATARS,
  };
}
