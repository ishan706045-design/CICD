// src/services/estimateService.ts
import { tenants, plans, estimates } from "../db/jsonDb";
import { stripHtml } from "string-strip-html";

export interface EstimateInput {
  content: any;
  targets: string[];
  options: any;
  apiKey: string;
}

export interface EstimateResult {
  plan: string;
  words_estimate: number;
  per_lang: Record<string, number>;
  credits_required: number;
  allowance_remaining: number | "unlimited";
  over_quota: boolean;
  fallback_rate: number | null;
}

export function calculateEstimate({ content, targets, options, apiKey }: EstimateInput): EstimateResult {
  // 🔑 Identify tenant by API key
  const tenant = tenants.get(apiKey);
  if (!tenant) throw new Error("Invalid API key");

    console.log("Plan Config:", tenant);
  // 🔑 Get plan configuration
  const planConfig = plans.get(tenant.plan);
  if (!planConfig) throw new Error("Invalid plan configuration");


  console.log("Plan Config:", planConfig);
  console.log("Plan targets:", targets);
  // ✅ Check max number of target languages
  if (planConfig.languages !== "unlimited" && targets.length > planConfig.languages) {
    throw new Error(`${planConfig.name} plan supports only ${planConfig.languages} target language(s)`);
  }

  // Prepare text for word count
  const title = content?.title || "";
  const body = content?.body || "";
  const excerpt = content?.excerpt || "";
  const images = content?.images || [];

  let textParts: string[] = [title, body, excerpt];
  if (options.include_seo && Array.isArray(images)) {
    textParts.push(...images.map((img: any) => img?.alt || "").filter(Boolean));
  }

  const combinedText = textParts.join(" ");
  const cleanText = stripHtml(combinedText).result;
  const wordsEstimate = cleanText.split(/\s+/).filter(Boolean).length;

  // Calculate credits required
  const wordsPerCredit = planConfig.words_per_credit || 100;
  const creditsRequired = Math.ceil(wordsEstimate / wordsPerCredit);

  // Calculate allowance remaining
  let allowanceRemaining =
    planConfig.words === "unlimited"
      ? Infinity
      : Math.max(planConfig.words - tenant.usedWords, 0);

  let overQuota = planConfig.words !== "unlimited" && wordsEstimate > allowanceRemaining;

  // Words per language
  const perLang = targets.reduce<Record<string, number>>((acc, lang) => {
    acc[lang] = Math.ceil(wordsEstimate / (targets.length || 1));
    return acc;
  }, {});

  // Save estimate for audit
  estimates.add({
    apiKey,
    tenant: tenant.name,
    plan: tenant.plan,
    wordsEstimate,
    targets,
    creditsRequired,
    overQuota,
    timestamp: new Date().toISOString(),
  });

  return {
    plan: planConfig.name,
    words_estimate: wordsEstimate,
    per_lang: perLang,
    credits_required: creditsRequired,
    allowance_remaining: planConfig.words === "unlimited" ? "unlimited" : allowanceRemaining,
    over_quota: overQuota,
    fallback_rate: overQuota ? planConfig.fallback_rate : null,
  };
}
