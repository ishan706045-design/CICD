import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { env } from "../config/env.config";
import { buildErrorResponse } from "../utils/build-error-response";

const usedNonces = new Set<string>();
const TIMESTAMP_TOLERANCE = 180;

export function hmacMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const secret = env.HMAC_MASTER_SECRET;

    const signature = req.header("x-signature");
    const timestamp = req.header("x-timestamp");
    const nonce = req.header("x-nonce");

    if (!signature || !timestamp || !nonce) {
      return res
        .status(401)
        .json(buildErrorResponse("Unauthorized", "Missing authentication headers"));
    }

    const now = Math.floor(Date.now() / 1000);
    const reqTs = parseInt(timestamp, 10);
    if (isNaN(reqTs) || Math.abs(now - reqTs) > TIMESTAMP_TOLERANCE) {
      return res
        .status(401)
        .json(buildErrorResponse("Unauthorized", "Timestamp expired or invalid"));
    }

    if (usedNonces.has(nonce)) {
      return res
        .status(401)
        .json(buildErrorResponse("Unauthorized", "Nonce already used"));
    }
    usedNonces.add(nonce);
    setTimeout(() => usedNonces.delete(nonce), TIMESTAMP_TOLERANCE * 1000);

    const body =
      req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : "";
    const base64Body = Buffer.from(body).toString("base64");

    const data = timestamp + nonce + base64Body;

    const computedSig = crypto
      .createHmac("sha256", secret)
      .update(data)
      .digest("hex");

    if (computedSig !== signature) {
      return res
        .status(401)
        .json(buildErrorResponse("Unauthorized", "Invalid signature"));
    }

    next();
  } catch (err) {
    console.error("HMAC verification error:", err);
    return res
      .status(500)
      .json(buildErrorResponse("Internal error", "HMAC verification failed", 500));
  }
}
