"use client";

import { CopilotKit } from "@copilotkit/react-core";
import Main from "./Main";
import { ModelSelectorProvider } from "@/lib/model-selector-provider";
import { ModelSelector } from "@/components/ModelSelector";
import DashboardLayout from "@/components/custom/DashboardLayout";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import Link from "next/link";
import Sidebar from "@/components/custom/SideBar";
import { TooltipProvider } from "@/registry/default/ui/tooltip";

export default function Home() {

  return (
 
    <ModelSelectorProvider>
      <CopilotKit
        runtimeUrl="/api/visualisation"
        showDevConsole={false}
        agent="my_agent"
      >
        <Main />
     
      </CopilotKit>
      <ModelSelector />
    </ModelSelectorProvider>
  
  );
}
