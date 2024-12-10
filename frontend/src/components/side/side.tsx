import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  Folder, File, ChevronDown, Terminal as TerminalIcon
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import { useWebContainer } from '@/lib/webcontainer';
import { cn } from '@/lib/utils';
import { debounce } from '@/utils/debounce';
import { useFileManager } from '../providers/FileManagerProvider';
import { Skeleton } from '../ui/skeleton';
import { BufferedTerminal } from '@/components/code/terminal';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from "@/components/ui/scroll-area";

// Language mapping for file extensions
const LANGUAGE_MAP = {
  html: 'html', htm: 'html', css: 'css',
  js: 'javascript', jsx: 'javascript',
  ts: 'typescript', tsx: 'typescript',
  json: 'json', py: 'python', java: 'java',
  cpp: 'cpp', c: 'c', cs: 'csharp',
  go: 'go', rs: 'rust', php: 'php',
  md: 'markdown', yml: 'yaml', yaml: 'yaml',
  xml: 'xml', svg: 'xml', sh: 'shell',
  bash: 'shell', sql: 'sql', graphql: 'graphql',
  dockerfile: 'dockerfile'
};

// Status indicator component
const StatusIndicator = ({ status, loading }) => (
  <div className="px-4 py-2 border-b border-gray-800">
    <div className="flex items-center gap-2">
      <div className={cn(
        "w-2 h-2 rounded-full",
        {
          "bg-yellow-500": status === 'initializing' || loading,
          "bg-red-500": status === 'error',
          "bg-green-500": status === 'ready' && !loading,
          "bg-gray-500": status === 'offline'
        }
      )} />
      <span className="text-xs text-gray-400">
        {loading ? 'Loading Project...' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  </div>
);



// File Tree Node component
const FileTreeNode = ({ name, content, path, selectedFile, onFileSelect, expandedFolders, setExpandedFolders }) => {
  const isDirectory = typeof content === 'object';

  const toggleExpand = (e) => {
    e.stopPropagation();
    if (isDirectory) {
      setExpandedFolders(prev => ({
        ...prev,
        [path]: !prev[path]
      }));
    } else {
      onFileSelect(path, content);
    }
  };

  return (
    <div className="pl-2">
      <div
        onClick={toggleExpand}
        className={cn(
          "flex items-center gap-2 p-2 rounded-md cursor-pointer",
          "hover:bg-gray-800/50 group transition-all duration-200",
          isDirectory && "hover:bg-gray-800/80",
          path === selectedFile && "bg-emerald-500/20"
        )}
      >
        <div className="flex items-center gap-2">
          {isDirectory && (
            <ChevronDown
              className={cn(
                "w-4 h-4 text-gray-400 transition-transform duration-200",
                expandedFolders[path] ? "transform rotate-0" : "transform -rotate-90"
              )}
            />
          )}
          {isDirectory ?
            <Folder className="w-4 h-4 text-emerald-400" /> :
            <File className="w-4 h-4 text-gray-400 ml-6" />
          }
          <span className="text-sm text-gray-300 group-hover:text-emerald-400">
            {name}
          </span>
        </div>
      </div>

      {isDirectory && expandedFolders[path] && (
        <div className="ml-4 border-l border-gray-800">
          {Object.entries(content).map(([childName, childContent]) => (
            <FileTreeNode
              key={`${path}/${childName}`}
              name={childName}
              content={childContent}
              path={`${path}/${childName}`}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              expandedFolders={expandedFolders}
              setExpandedFolders={setExpandedFolders}
            />
          ))}
        </div>
      )}
    </div>
  );
};



// Project Header component
const ProjectHeader = ({ currentProject }) => (
  <div className="px-4 py-2 border-b border-gray-800 bg-gray-900/80">
    <div className="flex items-center gap-2">
      <Folder className="w-4 h-4 text-emerald-400" />
      <span className="text-sm font-medium text-gray-300">
        {currentProject?.name || 'No Project Selected'}
      </span>
    </div>
    {currentProject && (
      <div className="mt-1 text-xs text-gray-500">
        Last edited: {currentProject.lastEdited}
      </div>
    )}
  </div>
);

// Content Editor component
const ContentEditor = ({ selectedFile, fileContent, onContentChange }) => {
  const getLanguage = (path) => {
    if (!path) return 'plaintext';
    const ext = path.split('.').pop()?.toLowerCase();
    return LANGUAGE_MAP[ext] || 'plaintext';
  };

  if (!selectedFile) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a file to edit
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 bg-gray-800 border-b border-gray-700">
        <span className="text-sm text-gray-300">
          {selectedFile}
        </span>
      </div>

      {selectedFile.toLowerCase().endsWith('.md') ? (
        <ScrollArea className="h-full p-6 bg-gray-900">
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{fileContent}</ReactMarkdown>
          </div>
        </ScrollArea>
      ) : (
        <Editor
          height="100%"
          language={getLanguage(selectedFile)}
          theme="vs-dark"
          value={fileContent}
          onChange={onContentChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on'
          }}
          loading={<Skeleton className="w-full h-full" />}
        />
      )}
    </div>
  );
};

// Main ProjectManager component
const ProjectManager = ({ initialProject = null }) => {
  // State management
  const [projects, setProjects] = useState(() => {
    if (initialProject) {
      return [{
        name: initialProject.name || "Default Project",
        lastEdited: "Just now",
        tags: initialProject.tags || ["Default"],
        icon: <Folder className="w-4 h-4 text-emerald-400" />,
        files: initialProject.files || {}
      }];
    }
    return [];
  });
  const [currentProject, setCurrentProject] = useState(null);
  const [projectFiles, setProjectFiles] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [containerStatus, setContainerStatus] = useState('offline');
  const [loading, setLoading] = useState(false);

  // Refs and hooks
  const terminalRef = useRef(null);
  const { instance: webContainer, isLoading, error } = useWebContainer();
  const { writeFile, expandedFolders, setExpandedFolders } = useFileManager();

  // Initialize project when webContainer is ready
  useEffect(() => {
    if (initialProject && webContainer && !currentProject) {
      const project = projects[0];
      setCurrentProject(project);
      mountProject(initialProject.files);
    }
  }, [webContainer, initialProject, projects, currentProject]);

  // File handling
  const handleSave = useCallback(
    debounce((content) => {
      if (selectedFile) {
        writeFile(selectedFile, content);
        setHasUnsavedChanges(false);
      }
    }, 500),
    [selectedFile, writeFile]
  );

  // WebContainer status monitoring
  useEffect(() => {
    if (isLoading) {
      setContainerStatus('initializing');
    } else if (error) {
      setContainerStatus('error');
    } else if (webContainer) {
      setContainerStatus('ready');
    } else {
      setContainerStatus('offline');
    }
  }, [isLoading, error, webContainer]);

  // File system operations
  const listFiles = useCallback(async (path = '/project') => {
    if (!webContainer) return;
    try {
      const entries = await webContainer.fs.readdir(path, { withFileTypes: true });
      const files = {};

      for (const entry of entries) {
        const fullPath = `${path}/${entry.name}`;
        if (entry.isDirectory()) {
          files[entry.name] = await listFiles(fullPath);
        } else {
          const content = await webContainer.fs.readFile(fullPath, 'utf-8');
          files[entry.name] = content;
        }
      }

      setProjectFiles(files);
      return files;
    } catch (err) {
      console.error('Error listing files:', err);
      return {};
    }
  }, [webContainer]);

  const mountProject = useCallback(async (files) => {
    if (!webContainer) return;
    setLoading(true);
    try {
      await webContainer.fs.mkdir('/project', { recursive: true });

      const createFiles = async (structure, basePath = '/project') => {
        for (const [name, content] of Object.entries(structure)) {
          const path = `${basePath}/${name}`;
          if (typeof content === 'object' && !content.hasOwnProperty('file')) {
            await webContainer.fs.mkdir(path, { recursive: true });
            await createFiles(content, path);
          } else {
            await webContainer.fs.writeFile(path, String(content) || '');
          }
        }
      };

      await createFiles(files);
      await listFiles('/project');
    } catch (err) {
      console.error('Error mounting project:', err);
    } finally {
      setLoading(false);
    }
  }, [webContainer, listFiles]);

  const handleFileSelect = useCallback((path, content) => {
    setSelectedFile(path);
    setFileContent(content);
    setHasUnsavedChanges(false);
  }, []);


  return (
    <div className="h-screen bg-gray-900 text-gray-100">
      <div className="grid grid-cols-[300px_1fr] h-full">
        {/* File Explorer */}
        <div className="border-r border-gray-800 bg-gray-900/50 flex flex-col">
          <StatusIndicator status={containerStatus} loading={loading} />
          <ProjectHeader currentProject={currentProject} />
          <ScrollArea className="flex-1">
            <div className="p-4">
              {Object.entries(projectFiles).map(([name, content]) => (
                <FileTreeNode
                  key={name}
                  name={name}
                  content={content}
                  path={name}
                  selectedFile={selectedFile}
                  onFileSelect={handleFileSelect}
                  expandedFolders={expandedFolders}
                  setExpandedFolders={setExpandedFolders}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Editor and Terminal */}
        <div className="flex flex-col h-full">
          <div className="flex-1 bg-gray-900">
            <ContentEditor
              selectedFile={selectedFile}
              fileContent={fileContent}
              onContentChange={(value) => {
                setFileContent(value || '');
                setHasUnsavedChanges(true);
                handleSave(value);
              }}
            />
          </div>

          <div className="h-1/4 overflow-hidden">
            <div className="flex items-center gap-2 p-2 border-t border-gray-800 bg-gray-900/80">
              <TerminalIcon className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-white">Terminal</span>
            </div>
            <div className="h-full">
              <BufferedTerminal
                ref={terminalRef}
                webContainer={webContainer}
                dimensions={{ cols: 80, rows: 24 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;