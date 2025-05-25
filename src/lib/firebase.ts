
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

// Log missing environment variables
let missingCriticalVarsMessages: string[] = [];
const criticalEnvVars: (keyof typeof ENV_VAR_KEYS)[] = ['apiKey', 'authDomain', 'projectId'];

for (const key of criticalEnvVars) {
  const envVarName = ENV_VAR_KEYS[key];
  if (!firebaseConfigValues[key]) {
    const message = `CRITICAL Firebase Config: Environment variable ${envVarName} for '${key}' is missing or empty.`;
    console.error(message);
    missingCriticalVarsMessages.push(`- ${envVarName}`);
  }
}

// Check for other non-critical but potentially important vars
const otherEnvVars: (keyof typeof ENV_VAR_KEYS)[] = ['storageBucket', 'messagingSenderId', 'appId'];
for (const key of otherEnvVars) {
    if (!firebaseConfigValues[key]) {
        const envVarName = ENV_VAR_KEYS[key];
        console.warn(
            `Firebase Config: Environment variable ${envVarName} for '${key}' is missing or empty. ` +
            "This might affect certain Firebase services."
        );
    }
}

if (missingCriticalVarsMessages.length > 0) {
  const fullMessage = "ERROR: Critical Firebase environment variables are missing. Firebase initialization cannot proceed. " +
                      "Please ensure the following are correctly set in your .env.local file or environment configuration:\n" +
                      missingCriticalVarsMessages.join("\n");
  console.error(fullMessage);
  // Throw an error to prevent the application from attempting to initialize Firebase with incomplete critical config.
  throw new Error(fullMessage);
}

// If we reach here, all CRITICAL env vars should be present as strings.
// The issue might be that they are present but their VALUES are INCORRECT.
const firebaseConfig = {
  apiKey: firebaseConfigValues.apiKey!, // Non-null assertion: presence checked above
  authDomain: firebaseConfigValues.authDomain!, // Non-null assertion
  projectId: firebaseConfigValues.projectId!, // Non-null assertion
  storageBucket: firebaseConfigValues.storageBucket, // These can be undefined if not set, Firebase handles defaults or they might not be used
  messagingSenderId: firebaseConfigValues.messagingSenderId,
  appId: firebaseConfigValues.appId,
};

let app: FirebaseApp;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (e: any) { // Catch specific FirebaseError or generic error
    let detailedMessage: string;
    if (e.code === "auth/invalid-api-key" || (e.message && String(e.message).includes("invalid-api-key"))) {
        detailedMessage = `Firebase initialization failed with an "invalid-api-key" error. ` +
                          `This usually means the NEXT_PUBLIC_FIREBASE_API_KEY environment variable has an incorrect value or is not properly configured for your Firebase project. ` +
                          `Please double-check its value in your .env.local file (or environment configuration) and ensure it matches the Web API Key from your Firebase project settings (Project settings > General > Your apps > Web apps > SDK setup and configuration). ` +
                          `Original error: ${e.message}`;
    } else {
        detailedMessage = `Firebase initialization failed. This could be due to incorrect or missing Firebase environment variables (those starting with NEXT_PUBLIC_FIREBASE_*). ` +
                          `Please verify all Firebase configuration values in your .env.local file or environment configuration. Original error: ${e.message}`;
    }
    console.error(detailedMessage, e); // Log the error object itself for more details if needed
    throw new Error(detailedMessage);
  }
} else {
  app = getApps()[0];
}

// These will fail if 'app' isn't initialized correctly.
// The try-catch above for initializeApp should prevent these from running if app init fails.
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
