"use client";

import React from 'react';
import { redirect, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { 
  User, 
  Calendar, 
  GitBranch, 
  Clock, 
  Activity,
  Mail,
  History,
  Globe,
  Terminal as TerminalIcon,
  Code2,
  Plus,
  Coins,
  Loader2
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Alert, AlertDescription } from "@/components/ui/alert";
import UserData, { formatDate } from '../../components/website/projectplan/UserData';
import { useDashboardData } from '@/hooks/use-dashboard-data';



export interface DashboardClientProps {
    initialUser: any // Replace with proper type
  }

function UserProfileDashboard({ initialUser }: DashboardClientProps) {


  const router = useRouter();
 const { data, error, isLoading } = useDashboardData();



  const getStatusColor = (status: string) => {
    const colors = {
      RUNNING: "text-emerald-500",
      STOPPED: "text-red-500",
      BUILDING: "text-yellow-500",
      DRAFT: "text-gray-400",
      FAILED: "text-red-700"
    };
    return colors[status as keyof typeof colors] || "text-gray-400";
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/coding?project=${projectId}`);
  };

  const handleCreateProject = () => {
    router.push('/coding');
  };

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Failed to load dashboard data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-2 text-emerald-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const { user } = data;

  return (
    <div className="w-full min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <ResizablePanelGroup direction="horizontal" className="min-h-screen">
          {/* Left Sidebar */}
          <ResizablePanel defaultSize={25} minSize={20} className="bg-gray-900/50 border-r border-gray-800">

           <UserData user={user} />
          </ResizablePanel>

          <ResizableHandle className="bg-gray-800" />

          {/* Main Content */}
          <ResizablePanel defaultSize={75}>
            <div className="h-full bg-gray-900/50">
              <Tabs defaultValue="projects" className="h-full">
                {/* Tab Header */}
                <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur">
                  <div className="px-6 py-4 flex justify-between items-center">
                    <TabsList className="bg-gray-800">
                      <TabsTrigger 
                        value="projects" 
                        className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                      >
                        <Code2 className="w-4 h-4 mr-2" />
                        Projects
                      </TabsTrigger>
                      <TabsTrigger 
                        value="activity"
                        className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                      >
                        <Activity className="w-4 h-4 mr-2" />
                        Activity
                      </TabsTrigger>
                      <TabsTrigger 
                        value="history"
                        className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                      >
                        <History className="w-4 h-4 mr-2" />
                        History
                      </TabsTrigger>
                    </TabsList>
                    <Button 
                      onClick={handleCreateProject}
                      className="bg-emerald-500 text-white hover:bg-emerald-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Project
                    </Button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {/* Projects Tab */}
                  <TabsContent value="projects">
                    <div className="grid grid-cols-2 gap-6">
                      {user.projects.map((project: any) => (
                        <Card 
                          key={project.id} 
                          className="bg-gray-800/50 border-gray-700 cursor-pointer hover:bg-gray-800/70 transition-colors"
                          onClick={() => handleProjectClick(project.id)}
                        >
                          <CardHeader>
                            <CardTitle className="flex justify-between items-center text-white">
                              <div className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-emerald-500" />
                                {project.name}
                              </div>
                              <span className={`text-sm ${getStatusColor(project.status)}`}>
                                {project.status}
                              </span>
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              Created {formatDate(project.createdAt)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-gray-300">
                                <TerminalIcon className="w-4 h-4 text-emerald-500" />
                                <span>Runtime: {project.runtime} {project.version}</span>
                              </div>
                              {project.lastDeployed && (
                                <div className="flex items-center gap-2 text-gray-300">
                                  <Clock className="w-4 h-4 text-emerald-500" />
                                  <span>Last deployed: {formatDate(project.lastDeployed)}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Activity Tab */}
                  <TabsContent value="activity">
                    <div className="space-y-4">
                      {user.projects.flatMap((project: any) => 
                        project.actions.map((action: any) => (
                          <Card key={action.id} className="bg-gray-800/50 border-gray-700">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                  <Activity className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div>
                                  <p className="text-gray-200">{action.description}</p>
                                  <p className="text-sm text-gray-400">
                                    Project: {project.name}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatDate(action.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  {/* History Tab */}
                  <TabsContent value="history">
                    <div className="space-y-4">
                      {user.projects.flatMap((project: any) => 
                        project.history.map((event: any) => (
                          <Card key={event.id} className="bg-gray-800/50 border-gray-700">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                  <History className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-gray-200">{event.event}</p>
                                  <p className="text-sm text-gray-400">
                                    Project: {project.name}
                                  </p>
                                  {event.metadata && (
                                    <pre className="mt-2 p-2 rounded bg-gray-900/50 text-xs text-gray-300 overflow-x-auto">
                                      {JSON.stringify(event.metadata, null, 2)}
                                    </pre>
                                  )}
                                  <p className="text-xs text-gray-500 mt-2">
                                    {formatDate(event.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default UserProfileDashboard;