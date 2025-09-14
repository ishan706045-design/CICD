import { z } from "zod";
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("8080"),
  ENV: z.enum(["dev", "prod", "test"]),
  GCP_REGION: z.string().min(1, "GCP_REGION is required"),
  PROJECT_ID: z.string().min(1, "PROJECT_ID is required"),
  HMAC_MASTER_SECRET:z.string()
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const tree = z.treeifyError(result.error);
  console.error("❌ Invalid environment variables:\n", JSON.stringify(tree, null, 2));
  process.exit(1);
}

export const env = result.data;
