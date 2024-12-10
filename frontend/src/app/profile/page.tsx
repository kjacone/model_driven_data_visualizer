// app/dashboard/page.tsx

import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'
import { auth } from '../auth'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/")
  }

  // Pass initial session user data to client component
  return <DashboardClient initialUser={session.user} />
}