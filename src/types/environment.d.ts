export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_INITDB_DATABASE: string;
      MONGO_INITDB_ROOT_USERNAME: string;
      MONGO_INITDB_ROOT_PASSWORD: string;
      MONGO_URI_DEV: string;
      MONGO_URI_PROD: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_CALLBACK_URL: string;
      FACEBOOK_APP_ID: string;
      FACEBOOK_SECRET: string;
      FACEBOOK_CALLBACK_URL: string;
      JWT_SECRET_DEV: string;
      JWT_SECRET_PROD: string;
      SERVER_URL_DEV: string;
      SERVER_URL_PROD: string;
      PORT?: string;
    }
  }
}
