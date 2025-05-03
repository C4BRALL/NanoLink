export interface JwtInterface {
  sign<T extends object>(payload: T): string;

  verify<T extends object>(token: string): T;
}
