import { seedTenants } from "./tenant.seed";

export async function runAllSeeds() {
  try {
    console.log("🚀 Starting all migrations...");

    // Run seeds sequentially
    await seedTenants();
    // await seedOtherCollection();

    console.log("🎉 All migrations completed successfully!");
    process.exit(0);
  } catch (error: any) {
    console.error(
      "❌ Migration failed:",
      error.errors || error.message || error
    );
    process.exit(1);
  }
}



