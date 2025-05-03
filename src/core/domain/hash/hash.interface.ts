export interface HashInterface {
  hash(plain: string): Promise<string>;
}
