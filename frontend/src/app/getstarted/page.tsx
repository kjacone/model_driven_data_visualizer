import { redirect } from 'next/navigation'
import { auth } from "../auth";
import GetStartedClient from "./GetStartedClient";


export default async function GetStartedPage() {

  const session = await auth()
  
  if (!session?.user) {
    redirect("/")
    
  }

  // Pass initial session user data to client component
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-16">
  <GetStartedClient initialUser={session.user} />
    </div>
  );
}