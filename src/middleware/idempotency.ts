import { Request, Response, NextFunction } from "express";

const idempotencyStore = new Map<string, any>();

export default function idempotency(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const key = req.header("X-Idempotency-Key");
  const method = req.method;

  if (!key) {
    res
      .status(400)
      .json({
        success: false,
        message: "For Post request idempontency key is required ",
        error: "Idempontency key required",
      });
    return;
  }

  if (idempotencyStore.has(key)) {
    const cached = idempotencyStore.get(key);
    return res.status(cached.status).set(cached.headers).json(cached.body);
  }

  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    idempotencyStore.set(key, {
      status: res.statusCode,
      headers: res.getHeaders(),
      body,
    });
    return originalJson(body);
  };

  next();
}
