import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import estimateRoutes from "./routes/estimate";
import dotenv from "dotenv";
import { corsConfig } from "./config/cors.config";
import { hmacMiddleware } from "./middleware/hmac.middleware";
import { GoogleAuth } from "google-auth-library";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const auth = new GoogleAuth();

app.use(helmet());

app.use(cors(corsConfig));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", hmacMiddleware);

/** Api to Test Hmac Middleware  */
app.post("/v1/hmac", (_, res) => {
  res.json({ status: "ok", message: "hmac verified" });
});

app.use("/v1/estimate", estimateRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/whoami", async (req, res) => {
  try {
    const client = await auth.getClient();
    const creds = await auth.getCredentials();

    console.log(creds);

    res.json({
      accountEmail:
        creds.client_email || "Using default service account (Cloud Run)",
      note: "This is Application Default Credentials in action.",
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/lee", (_, res) => {
  res.json({ status: "ok", uptime: "LEeeeee chala deya" });
});

/** Just to test seeds in prod env as we do not have permission in local */
// app.get("/seeds",async (req:Request,res:Response)=>{
//   try {
//     await runAllSeeds();
//     res.json({success:true,message:"Seed Run Successfully"})
//   } catch (error) {
//     res.json({success:true,message:"failed to run seeds"})
//   }
// })

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
