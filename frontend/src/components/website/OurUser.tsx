import { auth } from "@/app/auth"
import { getAuthSession } from "@/lib/session";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export default async function OurUser() {
  const session = await getAuthSession();
  if (!session) return null

  return (
    <div className="flex items-center gap-2">

      <span className="truncate">{session.user.name || session.user.email}</span>
    </div>
  );
}