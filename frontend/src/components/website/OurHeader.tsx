"use client";

import { FC, useEffect, useState } from "react";
import { BugIcon, LogOut, User, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { signIn, signOut, useSession } from "next-auth/react";
import OurUser from "./OurUser";
import { getAuthSession } from "@/lib/session";
import UserButton from "../auth/user-button";

const OurHeader: FC = () => {
  const [loading, setLoading] = useState(false);
  // const { data: session, status } = useSession();
  const { toast } = useToast();
  const [session, setSession] = useState(null);
  // var status = session ? 'authenticated' : 'loading';

  // const session = await getAuthSession();
  // if (!session) return null

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <BugIcon className="text-green-500" size={32} />
            <span className="text-2xl font-bold text-emerald-500">BoilerPlate</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/contact">
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-emerald-500/10 text-emerald-500"
              >
                <Mail size={18} />
                <span className="hidden sm:inline">Contact Us</span>
              </Button>
            </Link>

            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default OurHeader;
