export interface AuthTokenInterface {
  validateToken(token: string): Promise<{ userId: string }>;
  extractTokenFromCookie(cookies: Record<string, string>): string | null;
}

export namespace AuthTokenInterface {
  export type TokenPayload = {
    userId: string;
  };
}
