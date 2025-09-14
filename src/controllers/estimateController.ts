import { Request, Response } from "express";
import { calculateEstimate } from "../services/estimateService";

export async function estimateController(req: Request, res: Response) {
  try {
    const apiKey = req.header("X-Api-Key");
    if (!apiKey) return res.status(400).json({ error: "Missing API key" });

    const { content, targets = [], options = {} } = req.body;
    const result = calculateEstimate({ content, targets, options, apiKey });

    // Set headers
    res.set({
      "X-Usage-This-Request": result.credits_required.toString(),
      "X-Credits-Remaining":
        result.allowance_remaining === "unlimited" ? "unlimited" : result.allowance_remaining.toString(),
      "X-Plan": result.plan,
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
