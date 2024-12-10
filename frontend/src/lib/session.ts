import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getAuthSession() {
  try {
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}