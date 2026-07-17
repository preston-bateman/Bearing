export type FirebaseRuntimeConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

type FirebaseEnvKey =
  | 'EXPO_PUBLIC_FIREBASE_API_KEY'
  | 'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'
  | 'EXPO_PUBLIC_FIREBASE_PROJECT_ID'
  | 'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'
  | 'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'
  | 'EXPO_PUBLIC_FIREBASE_APP_ID';

const REQUIRED_FIREBASE_ENV_KEYS: FirebaseEnvKey[] = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
];

function getRuntimeEnv(): Record<string, string | undefined> {
  const maybeProcess = globalThis as {
    process?: {
      env?: Record<string, string | undefined>;
    };
  };

  return maybeProcess.process?.env ?? {};
}

export function getFirebaseRuntimeConfig(): FirebaseRuntimeConfig {
  const env = getRuntimeEnv();

  const missing = REQUIRED_FIREBASE_ENV_KEYS.filter((envKey) => {
    const value = env[envKey];
    return typeof value !== 'string' || value.trim().length === 0;
  });

  if (missing.length > 0) {
    throw new Error(
      [
        'Firebase configuration is incomplete.',
        `Missing environment values: ${missing.join(', ')}`,
        'Set these values in your local .env file or shell before running Expo.',
      ].join(' '),
    );
  }

  return {
    apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY!,
    authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: env.EXPO_PUBLIC_FIREBASE_APP_ID!,
  };
}
