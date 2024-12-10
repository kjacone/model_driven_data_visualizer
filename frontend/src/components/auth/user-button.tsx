import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignIn, SignOut } from "./auth-components"

export default function UserButton() {
  const { data: session } = useSession()
  if (!session?.user) return <SignIn provider={"google"} />
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {session.user.image && (
              <AvatarImage
                src={session.user.image}
                alt={session.user.name ?? ""}
              />
            )}
            <AvatarFallback>{session.user.name[0].toLocaleUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem>
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
