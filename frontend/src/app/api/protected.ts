// import { auth } from "../../auth"
// import { getSession } from "next-auth/react"
import { NextApiRequest, NextApiResponse } from "next"
import { auth } from "../auth"
import { NextResponse } from "next/server"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const session = await auth(req, res)
  // const session = await getSession(req, res)
  const url = `${req.headers["x-forwarded-proto"]}://${req.headers.host}/api/auth/session`

  // TODO: Test while working on other methods
  const sessionRes = await fetch(url)
  const session = await sessionRes.json()

  if (session) {
    return res.json({ data: "Protected data" })
  }

  return res.status(401).json({ message: "Not authenticated" })
}

export const GET = auth(function GET(req) {
  if (req.auth) return NextResponse.json(req.auth)
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
})
