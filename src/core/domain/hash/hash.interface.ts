export interface HashInterface {
  hash(plain: string): Promise<string>;
  compare(plain: string, hashString: string): Promise<boolean>;
}
