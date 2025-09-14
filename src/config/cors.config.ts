export const corsConfig = {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    methods: ["GET", "POST"],
    allowedHeaders: [
      "Content-Type",
      "X-Api-Key",
      "X-Signature",
      "X-Idempotency-Key",
      "X-Site-Domain"
    ]
}