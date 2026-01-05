import "dotenv/config";

import { app } from "./app";
import { connectToDatabase } from "./config/db";

const PORT = Number(process.env.PORT || 5050);

const bootstrap = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});