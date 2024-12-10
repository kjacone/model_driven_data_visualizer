import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@radix-ui/react-progress";
import { Coins, Mail, User, Calendar } from "lucide-react";

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function UserData({ user }: { user: any }) {



  return (
    <div className="p-6">
      {/* User Profile Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500/20">
          <img
            src={user.avatar || '/default-avatar.png'}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user.name}</h2>
          <p className="text-gray-400 text-sm">Developer</p>
        </div>
      </div>

      {/* Token Usage */}
      <Card className="bg-gray-800/50 border-gray-700 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-emerald-500 flex items-center">
            <Coins className="w-4 h-4 mr-2" />
            Token Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress
            value={(user.tokenUsage?.used / user.tokenUsage?.total) * 100}
            className="h-2 mb-2"
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">
              {user.tokenUsage?.used.toLocaleString()} / {user.tokenUsage?.total.toLocaleString()}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
            >
              Recharge
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Info */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-gray-300">
          <Mail className="w-4 h-4" />
          <span className="text-sm">{user.email}</span>
        </div>
        {user.githubId && (
          <div className="flex items-center space-x-3 text-gray-300">
            <User className="w-4 h-4" />
            <span className="text-sm">{user.githubId}</span>
          </div>
        )}
        <div className="flex items-center space-x-3 text-gray-300">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Joined {formatDate(user.createdAt)}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-emerald-500 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-white mb-1">
              {user.projects?.length}
            </div>
            <div className="text-sm text-gray-400">Active Projects</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-white mb-1">
              {user.projects?.reduce((acc: number, proj: any) => acc + proj.actions.length, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Actions</div>
          </div>
        </div>
      </div>
    </div>
  );
}
