declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      MONGODB_URI: string;
      SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      FRONTEND_URL: string;
      API_URL: string;
      BASE_URL: string;
      ESEWA_SECRET_KEY: string;
      ESEWA_MERCHANT_CODE: string;
      GEMINI_API_KEY: string;
    }
  }
}

export {};
