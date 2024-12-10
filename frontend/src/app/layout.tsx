"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { SessionProvider } from 'next-auth/react';
import "@copilotkit/react-ui/styles.css";
import "./globals.css";

// Components
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import OurHeader from "@/components/website/OurHeader";
import { OurFooter } from "@/components/website/OurFooter";
import { Progress } from "@/components/Progress";

// Copilot imports
import {
  CopilotKit,
  useCoAgent,
  useCoAgentStateRender,
} from "@copilotkit/react-core";
import { CopilotChat, useCopilotChatSuggestions } from "@copilotkit/react-ui";
import { headers } from "next/headers";
import { Providers } from "./providers";
// Types
import { AgentVisualization } from "@/lib/types";

// Font definitions
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const metadata: Metadata = {
  title: "BoilerPlate - Bug Tracking Made Simple",
  description: "Modern bug tracking and project management platform",
};

interface RootLayoutProps {
  children: React.ReactNode;
  session: any; // Replace 'any' with your session type
}

export default function RootLayout({ children, session }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers >
          <CopilotKit
            runtimeUrl="/api/visualisation"
            showDevConsole={true}

            transcribeAudioUrl="/api/transcribe"
            textToSpeechUrl="/api/tts"

          >
            <TooltipProvider>
              <SidebarProvider>
                <SidebarInset>
                  <div
                    className="flex flex-1 border"
                    style={{ height: "calc(100vh - 60px)" }}
                  >
                    <div className="flex-1 overflow-hidden">
                      <div className="min-h-screen bg-black text-white">
                        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(0,0,0,1))] opacity-70" />
                        <div className="relative">
                          <OurHeader />
                          {children}
                          {/* <OurFooter /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </SidebarInset>
              </SidebarProvider>
            </TooltipProvider>
          </CopilotKit>
        </Providers>
      </body>
    </html>
  );
}
