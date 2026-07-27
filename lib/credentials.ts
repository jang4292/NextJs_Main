import { compare } from "bcryptjs";
import { getAdminCredentialsConfig } from "@/lib/env";

export async function verifyCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const { username: adminUsername, passwordHash: adminPasswordHash } =
    getAdminCredentialsConfig();

  const usernameMatches = username === adminUsername;
  const passwordMatches = await compare(password, adminPasswordHash);
  return usernameMatches && passwordMatches;
}
