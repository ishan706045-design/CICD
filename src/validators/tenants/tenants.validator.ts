// src/validators/tenants/tenants.validator.ts
import { z } from "zod";

const tenantSchema = z.object({
  apiSecret: z.string().min(1, "API secret is required"),
  name: z.string().min(1, "Tenant name is required"),
  plan: z.string().min(1, "Plan is required"),
  usedWords: z.number().min(0),
  domain: z.string().min(1, "Domain is required"),
});


const tenantsSchema = z.record(z.string(), tenantSchema);

type TenantData = z.infer<typeof tenantsSchema>;

export { tenantSchema, tenantsSchema, TenantData };
