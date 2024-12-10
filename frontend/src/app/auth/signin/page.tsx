import { SignInButton } from "@/components/auth/signin-button";

export default function SignIn() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-4 rounded-lg border p-6 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>
        <div className="space-y-4">
          <SignInButton />
        </div>
      </div>
    </div>
  )
}