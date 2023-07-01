declare global {
  namespace Express {
    export interface Request {
      userId?: number;
    }
  }
}

export {};
