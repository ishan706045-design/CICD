import { TenantData, tenantsSchema } from "../../../../validators/tenants/tenants.validator";
import tenantsData from "../../../../data/tenants.json";
import FireStoreDb from "../fire-store.config";


export async function seedTenants() {
  try {
    // Validate the JSON data
    const parsedData: TenantData = tenantsSchema.parse(tenantsData);

    const batch = FireStoreDb.batch();
    const tenantsCollection = FireStoreDb.collection("tenants");

    // Add all tenants
    for (const [apiKey, tenant] of Object.entries(parsedData)) {
      const docRef = tenantsCollection.doc(apiKey);
      batch.set(docRef, tenant, { merge: true }); // merge:true ensures idempotency
    }

    await batch.commit();

    console.log("✅ Tenants seeded successfully:", Object.keys(parsedData));
    process.exit(0);
  } catch (error: any) {
    console.log(error)
    console.error("❌ Failed to seed tenants:", error.errors || error.message || error);
    process.exit(1);
  }
}

