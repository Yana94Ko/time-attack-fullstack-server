declare global {
  namespace Express {
    export interface Request {
      user: {
        profile: {
          nickname: string;
        };
      } & User;
    }
  }
}
