import { compare } from "bcryptjs";

export async function verifyCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminUsername || !adminPasswordHash) {
    throw new Error(
      "ADMIN_USERNAME or ADMIN_PASSWORD_HASH environment variable is not set",
    );
  }

  const usernameMatches = username === adminUsername;
  const passwordMatches = await compare(password, adminPasswordHash);
  return usernameMatches && passwordMatches;
}
