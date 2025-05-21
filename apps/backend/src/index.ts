import { trpcExpress } from "@repo/trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import "dotenv/config";
import type { Application } from "express";
import express from "express";


const app: Application = express();

// Enable CORS for all routes
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// Health check endpoint
app.use("/health", (_, res) => {
  return res.json({ status: "OK" });
});

app.use('/trpc', trpcExpress)

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

export default app;