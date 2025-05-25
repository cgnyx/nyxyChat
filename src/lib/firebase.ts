
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Define keys for environment variables to ensure consistency and help catch typos
const ENV_VAR_KEYS = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
};

const firebaseConfigValues = {
  apiKey: process.env[ENV_VAR_KEYS.apiKey],
  authDomain: process.env[ENV_VAR_KEYS.authDomain],
  projectId: process.env[ENV_VAR_KEYS.projectId],
  storageBucket: process.env[ENV_VAR_KEYS.storageBucket],
  messagingSenderId: process.env[ENV_VAR_KEYS.messagingSenderId],
  appId: process.env[ENV_VAR_KEYS.appId],
};

// Check for missing critical environment variables
let missingCriticalVarsMessages: string[] = [];
const criticalEnvVars: (keyof typeof ENV_VAR_KEYS)[] = ['apiKey', 'authDomain', 'projectId'];

for (const key of criticalEnvVars) {
  const envVarName = ENV_VAR_KEYS[key];
  if (!firebaseConfigValues[key]) {
    // Removed individual console.error here; the main throw below will cover it.
    missingCriticalVarsMessages.push(`- ${envVarName} (for ${key})`);
  }
}

// Check for other non-critical but potentially important vars
const otherEnvVars: (keyof typeof ENV_VAR_KEYS)[] = ['storageBucket', 'messagingSenderId', 'appId'];
for (const key of otherEnvVars) {
    if (!firebaseConfigValues[key]) {
        const envVarName = ENV_VAR_KEYS[key];
        console.warn(
            `Firebase Config: Optional environment variable ${envVarName} for '${key}' is missing or empty. ` +
            "This might affect certain Firebase services if they are used."
        );
    }
}

if (missingCriticalVarsMessages.length > 0) {
  const detailedInstructions =
    "CRITICAL CONFIGURATION ERROR: Firebase initialization failed because essential environment variables are missing.\n\n" +
    "Please take the following steps:\n" +
    "1. Ensure a file named '.env.local' exists in the root directory of your project.\n" +
    "   If not, you can copy '.env.local.example' to '.env.local'.\n" +
    "2. Open '.env.local' and verify that all `NEXT_PUBLIC_FIREBASE_*` variables are present.\n" +
    "3. Replace placeholder values (e.g., 'YOUR_API_KEY_HERE') with your actual Firebase project credentials.\n" +
    "   You can find these in your Firebase console: Project settings > General > Your apps > (select your web app) > SDK setup and configuration.\n" +
    "4. IMPORTANT: After creating or modifying the '.env.local' file, YOU MUST RESTART your Next.js development server for the changes to take effect.\n\n" +
    "The following critical Firebase environment variables are missing or empty:\n" +
    missingCriticalVarsMessages.join("\n");

  console.error(detailedInstructions); // Log detailed instructions to console as well.
  throw new Error(detailedInstructions); // This will be caught by Next.js and shown on the error page.
}

// If we reach here, all CRITICAL env vars should be present as strings.
const firebaseConfig = {
  apiKey: firebaseConfigValues.apiKey!,
  authDomain: firebaseConfigValues.authDomain!,
  projectId: firebaseConfigValues.projectId!,
  storageBucket: firebaseConfigValues.storageBucket,
  messagingSenderId: firebaseConfigValues.messagingSenderId,
  appId: firebaseConfigValues.appId,
};

let app: FirebaseApp;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (e: any) {
    let detailedMessage: string;
    if (e.code === "auth/invalid-api-key" || (e.message && String(e.message).includes("invalid-api-key"))) {
        detailedMessage = `Firebase initialization failed with an "invalid-api-key" error. ` +
                          `This usually means the NEXT_PUBLIC_FIREBASE_API_KEY environment variable has an incorrect value or is not properly configured for your Firebase project. ` +
                          `Please double-check its value in your .env.local file (or environment configuration) and ensure it matches the Web API Key from your Firebase project settings. ` +
                          `Original error: ${e.message}`;
    } else {
        detailedMessage = `Firebase initialization failed. This could be due to incorrect Firebase configuration values in your .env.local file. ` +
                          `Please verify all NEXT_PUBLIC_FIREBASE_* values. Original error: ${e.message}`;
    }
    console.error(detailedMessage, e);
    throw new Error(detailedMessage);
  }
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
