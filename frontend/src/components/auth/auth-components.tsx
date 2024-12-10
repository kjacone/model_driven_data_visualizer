import { signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

type SignInProps = {
  provider: "google" | "github"
} & React.ComponentPropsWithRef<typeof Button>

export function SignIn({ provider, ...props }: SignInProps) {
  return (
    <Button 
      onClick={() => signIn(provider, { callbackUrl: "/getstarted" })} 
      {...props}
    >
      Sign In with {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </Button>
  )
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/" })}
      variant="ghost"
      className="w-full p-0"
      {...props}
    >
      Sign Out
    </Button>
  )
}