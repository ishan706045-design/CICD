import * as admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const projectId = process.env.GOOGLE_CLOUD_PROJECT || "textuned-mvp-backend";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId,
  });
}

export const db = admin.firestore();

console.log(
  `Firestore initialized for project: ${projectId || "(from gcloud ADC)"}`
);
