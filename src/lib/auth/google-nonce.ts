import { createHash, randomBytes } from "crypto";

export function generateGoogleNonce(): [plain: string, hashed: string] {
  const plain = randomBytes(32).toString("base64url");
  const hashed = createHash("sha256").update(plain).digest("hex");
  return [plain, hashed];
}
