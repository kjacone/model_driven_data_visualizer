
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react"
import { toast } from '@/hooks/use-toast'

export const useAuth = () => {
  const { data: session, status } = useSession()
  
  const signIn = async () => {
    try {
      await nextAuthSignIn('google');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message || "Please try again later",
      });
    }
  };

  const signOut = async () => {
    try {
      await nextAuthSignOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message || "Please try again later",
      });
    }
  };

  return {
    user: session?.user,
    loading: status === "loading",
    signIn,
    signOut
  };
};
