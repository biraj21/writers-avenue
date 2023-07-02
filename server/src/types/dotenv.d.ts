declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: string;

      SERVER_URL: string;

      DB_HOST: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;

      JWT_SECRET: string;

      GOOGLE_OAUTH_CLIENT_ID: string;
      GOOGLE_OAUTH_CLIENT_SECRET: string;
      GOOGLE_OAUTH_REDIRECT: string;
    }
  }
}

export {};
