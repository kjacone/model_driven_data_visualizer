'use client';

import React, { useEffect, useState } from 'react';
import { FileIcon, FolderIcon, ChevronRightIcon, ChevronDownIcon } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { WebContainer } from '@webcontainer/api';
import { getProjectStructure } from '@/utils/CreateFolderStructure';

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileNode[];
}

interface FileExplorerProps {
  container: WebContainer;
  onFileSelect: (path: string, content: string) => void;
}

export function FileExplorer({ container, onFileSelect }: FileExplorerProps) {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedPath, setSelectedPath] = useState<string>('index.html');

  useEffect(() => {
    const loadProjectStructure = async () => {
      try {
        const structure = await getProjectStructure(container);
        setFiles(structure);
      } catch (error) {
        console.error('Error loading project structure:', error);
      }
    };

    loadProjectStructure();
  }, [container]);

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleFileClick = async (path: string) => {
    try {
      const content = await container.fs.readFile(path, 'utf-8');
      setSelectedPath(path);
      onFileSelect(path, content);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const renderNode = (node: FileNode, path: string = '', depth = 0) => {
    const fullPath = path ? `${path}/${node.name}` : node.name;
    const isFolder = node.type === 'directory';
    const isExpanded = expandedFolders.has(fullPath);
    const Icon = isFolder ? FolderIcon : FileIcon;
    const ChevronIcon = isExpanded ? ChevronDownIcon : ChevronRightIcon;

    return (
      <div key={fullPath}>
        <div 
          className={`flex items-center gap-2 px-2 py-1 hover:border-emerald-500/30 hover:bg-gray-800/50 cursor-pointer text-sm
            ${selectedPath === fullPath ? 'bg-emerald-900' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => isFolder ? toggleFolder(fullPath) : handleFileClick(fullPath)}
        >
          <div className="w-4 flex justify-center">
            {isFolder && <ChevronIcon className="h-4 w-4" />}
          </div>
          <Icon className="h-4 w-4" />
          <span>{node.name}</span>
        </div>
        {isFolder && isExpanded && node.children?.map((child) => 
          renderNode(child, fullPath, depth + 1)
        )}
      </div>
    );
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-2 font-small text-emerald-400">
        {files.map((node) => renderNode(node))}
      </div>
    </ScrollArea>
  );
}