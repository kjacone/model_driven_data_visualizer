import React, { useState } from "react";
import {
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import {
  useDashboardData,
} from "@/hooks/use-dashboard-data";
import CopilotChatInterface from "../chat/CopilotChat";
import AppContainer from "./HomeView";
import UserFlowComponent from "./projectplan/UserFlow";

const TechRequirementsGatherer = () => {
  const { data, error, isLoading } = useDashboardData();



  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-2 text-emerald-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading your profile...</span>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Failed to load profile data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { user } = data;




  return (
    <div >
      <div >
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={100}>
            <AppContainer user={user} />
            {/* <UserFlowComponent /> */}
          </ResizablePanel>
          <ResizableHandle className="bg-gray-800" />
          {/* <ResizablePanel defaultSize={25}>
            <CopilotChatInterface user={user} />
          </ResizablePanel> */}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default TechRequirementsGatherer;
