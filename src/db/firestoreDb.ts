import { db } from "./firestore";

// 🔑 Tenants
export const tenants = {
  async get(apiKey: string) {
    const doc = await db.collection("tenants").doc(apiKey).get();
    return doc.exists ? doc.data() : null;
  },
  async getAll() {
    const snapshot = await db.collection("tenants").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
};

// 📦 Plans
export const plans = {
  async get(planId: string) {
    const doc = await db.collection("plans").doc(planId).get();
    return doc.exists ? doc.data() : null;
  },
  async getAll() {
    const snapshot = await db.collection("plans").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
};

// 📝 Estimates
export const estimates = {
  async add(data: any) {
    const ref = await db.collection("estimates").add({
      ...data,
      createdAt: new Date().toISOString(),
    });
    return { id: ref.id, ...data };
  },
  async getAll() {
    const snapshot = await db.collection("estimates").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
};
