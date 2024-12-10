'use client';

import { useEffect, useRef, useState } from 'react';
import { reloadPreview, WebContainer } from '@webcontainer/api';
import { toast } from 'sonner';
import {
  Code2,
  Layout,
  Terminal as TerminalIcon,
  Loader2,
  Download,
  Upload,
  ArrowLeft,
  Globe,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable';
import { FileExplorer } from './file-explorer';
import { MonacoEditor } from './monaco-editor';
import { BufferedTerminal } from './terminal';
import SideMenu from '../side/side';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebContainer } from "@/lib/webcontainer";
import { handleProcess } from '@/utils/process-handler';
import { cn } from '@/lib/utils';
import JSZip from 'jszip';
import debounce from 'lodash/debounce';
import { error } from 'console';
import FileManager from './file-manager';
import { FileManagerProvider, useFileManager } from '../providers/FileManagerProvider';
import ProjectManager from '../side/side';

// Types
interface CodeEditorProps {
  onNavigateToProjects: () => void;
}

interface FileState {
  path: string;
  content: string;
}

interface ServerState {
  isReady: boolean;
  url: string;
  port: number;
}

interface TerminalRef {
  appendOutput: (content: string, type: 'output' | 'error') => void;
  executeCommand: (command: string) => Promise<void>;
  clearBuffer: () => void;
}

// Animation variants
const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  slideIn: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export function CodeEditor({ onNavigateToProjects }: CodeEditorProps) {
  // State management
  const [currentFile, setCurrentFile] = useState<FileState>({ path: '', content: '' });
  const [activeTab, setActiveTab] = useState('preview-manager');
  const [loading, setLoading] = useState(true);
  // const [webContainer, setWebContainer] = useState<WebContainer | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [serverState, setServerState] = useState<ServerState>({
    isReady: false,
    url: '',
    port: 0
  });
  const [showProjects, setShowProjects] = useState(false);
  const { instance: webContainer, isLoading, error } = useWebContainer();
  // Refs
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const terminalRef = useRef<TerminalRef>(null);

  // Project export functionality
  const createProjectZip = async () => {
    if (!webContainer) return null;

    try {
      const projectFiles = await webContainer.fs.readdir('/', { recursive: true });
      const zip = new JSZip();

      for (const filePath of projectFiles) {
        if (filePath.endsWith('/')) continue;
        const content = await webContainer.fs.readFile(filePath, 'utf-8');
        zip.file(filePath, content);
      }

      return zip;
    } catch (error) {
      console.error('Error creating ZIP:', error);
      return null;
    }
  };

  // File operations
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const zip = await createProjectZip();
      if (!zip) throw new Error('Failed to create project ZIP');

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Project downloaded successfully');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download project');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const zip = await createProjectZip();
      if (!zip) throw new Error('Failed to create project ZIP');

      const blob = await zip.generateAsync({ type: 'blob' });
      const formData = new FormData();
      formData.append('project', blob, 'project.zip');

      const response = await fetch('/api/deploy', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Deployment failed');

      const { deploymentUrl } = await response.json();
      toast.success(
        <div className="flex flex-col gap-2">
          <p>Deployment successful!</p>
          <a
            href={deploymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            View deployment
          </a>
        </div>
      );
    } catch (error) {
      console.error('Deployment failed:', error);
      toast.error('Failed to deploy project');
    } finally {
      setIsDeploying(false);
    }
  };

  // Preview management
  const refreshPreview = async () => {
    if (!iframeRef.current || !webContainer) return;
    try {
      await reloadPreview(iframeRef.current, 500);
    } catch (error) {
      console.error('Failed to reload preview:', error);
      toast.error('Failed to reload preview');
    }
  };

  // File handling
  const handleFileSelect = async (path: string, content: string) => {
    setCurrentFile({ path, content });
  };

  const handleCodeChange = async (value: string | undefined) => {
    if (!webContainer || value === undefined) {
      if (!webContainer) toast.error('WebContainer not initialized');
      return;
    }

    try {
      setCurrentFile(prev => ({ ...prev, content: value }));
      await webContainer.fs.writeFile(currentFile.path, value);
      await handleRun(webContainer, true);

      webContainer.on('server-ready', (port, url) => {
        const webContainerUrl = url.replace('localhost', window.location.hostname);
        setServerState({
          isReady: true,
          url: webContainerUrl,
          port
        });
      });

      refreshPreview();
    } catch (error) {
      console.error('Failed to save changes:', error);
      toast.error('Failed to save changes');
      setLoading(false);
    }
  };

  const debouncedHandleCodeChange = debounce(handleCodeChange, 1000);

  // Process management
  async function handleRun(container: WebContainer, restart: boolean) {
    if (!container || !terminalRef.current) {
      toast.error('WebContainer not initialized');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      terminalRef.current?.clearBuffer();

      await handleProcess(container, {
        processName: 'Application',
        installCommand: 'install',
        startCommand: 'start',
        onOutput: (data) => {
          console.log('Process output:', data);
          terminalRef.current?.appendOutput(data, 'output');
        },
        onError: (data) => {
          console.error('Process error:', data);
          terminalRef.current?.appendOutput(data, 'error');
        },
        onExit: (code) => {
          if (code === 0) {
            toast.success('Server stopped successfully');
          } else if (code !== null) {
            toast.error(`Server stopped with code ${code}`);
          }
          setLoading(false);
        },
        timeout: 60000,
        cwd: '/',
        restart
      });
    } catch (error) {
      console.error('Failed to run code:', error);
      toast.error('Failed to run code');
      setLoading(false);
    }
  }

  const renderWebContainerStatus = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading WebContainer...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span>Failed to load WebContainer</span>
        </div>
      );
    }

    if (webContainer) {
      return (
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle className="h-4 w-4" />
          <span>WebContainer Ready</span>
        </div>
      );
    }

    return null;
  };

  // Update existing initialization effect
  useEffect(() => {
    if (webContainer) {
      // Set up your event listeners and initial configuration here
      webContainer.on('server-ready', (port, url) => {
        const webContainerUrl = url.replace('localhost', window.location.hostname);
        setServerState({
          isReady: true,
          url: webContainerUrl,
          port
        });
      });

      // Initial setup
      handleRun(webContainer, false).catch(console.error);
    }
  }, [webContainer]);

  // Effects
  useEffect(() => {
    if (webContainer) {
      // Set up your event listeners and initial configuration here
      webContainer.on('server-ready', (port, url) => {
        const webContainerUrl = url.replace('localhost', window.location.hostname);
        setServerState({
          isReady: true,
          url: webContainerUrl,
          port
        });
      });

      // Initial setup
      handleRun(webContainer, false).catch(console.error);
    }
  }, [webContainer]);



  const initialProject = {
    name: "HR Management System",
    files: {
      "backend": {
        "src": {
          "api": {
            "routes": {
              "auth.routes.js": "",
              "employee.routes.js": "",
              "leave.routes.js": "",
              "performance.routes.js": ""
            },
            "controllers": {
              "auth.controller.js": "",
              "employee.controller.js": "",
              "leave.controller.js": "",
              "performance.controller.js": ""
            }
          }
        },
        "package.json": JSON.stringify({
          "name": "hr-backend",
          "version": "1.0.0",
          "dependencies": {
            "express": "^4.17.1"
          }
        }, null, 2)
      },
      "frontend": {
        "src": {
          "components": {
            "EmployeeProfile.js": "",
            "LeaveRequestForm.js": "",
            "PerformanceReviewForm.js": ""
          },
          "pages": {
            "LoginPage.js": "",
            "EmployeeDashboard.js": "",
            "ManagerDashboard.js": ""
          }
        },
        "package.json": JSON.stringify({
          "name": "hr-frontend",
          "version": "1.0.0",
          "dependencies": {
            "react": "^18.2.0"
          }
        }, null, 2)
      },
      "README.md": "# HR Management System\nA comprehensive HR management solution."
    }
  };
  // Render UI
  return (
    <FileManagerProvider>
      <div className="min-h-screen w-full flex flex-col gap-y-4 p-6 lg:p-8">
        <motion.div {...animations.slideIn}>

          <Button
            onClick={onNavigateToProjects}
            variant="ghost"
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project Scope
          </Button>
        </motion.div>
        <div className="flex items-center justify-between p-2 border-b border-gray-700">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex items-center justify-center w-full">
              <TabsList className="bg-gray-800 border border-gray-700">
                <TabsTrigger
                  value="preview-manager"
                  className="px-6 py-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white transition-all duration-200"
                >
                  Preview Manager
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="px-6 py-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white transition-all duration-200"
                >
                  Preview
                </TabsTrigger>
              </TabsList>
              <div className='ml-4 '>
                {renderWebContainerStatus()}
              </div>


            </div>

            <TabsContent
              value="preview-manager"
              className="h-full p-0 m-0 bg-gray-900"
            >
              <ProjectManager
                defaultSize={20}
                minSize={8}
                initialProject={initialProject}
              />
            </TabsContent>

            <TabsContent
              value="preview"
              className="h-[calc(100vh-8rem)] p-0 m-0"
            >
              <div className="h-full bg-gray-900">
                <iframe
                  className="w-full h-full border-0 bg-white rounded-lg shadow-lg"
                  src={serverState?.url || 'about:blank'}
                  ref={iframeRef}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>


      </div>
    </FileManagerProvider>
  );
}
