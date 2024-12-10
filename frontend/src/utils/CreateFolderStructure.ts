import type { WebContainer, FileSystemAPI } from '@webcontainer/api';

interface FileStructure {
  [key: string]: string | FileStructure;
}

interface CreateFolderStructureOptions {
  /**
   * Whether to overwrite existing files and folders
   * @default false
   */
  overwrite?: boolean;
  /**
   * Base directory to create the structure in
   * @default ''
   */
  baseDir?: string;
}

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileNode[];
}

/**
 * Creates a folder structure in a WebContainer instance
 */
async function createFolderStructure(
  webcontainerInstance: WebContainer,
  structure: FileStructure,
  options: CreateFolderStructureOptions = {}
) {
  const { overwrite = false, baseDir = '' } = options;

  async function processEntry(
    currentPath: string,
    entry: string | FileStructure
  ): Promise<void> {
    const fullPath = baseDir ? `${baseDir}/${currentPath}` : currentPath;

    if (typeof entry === 'string') {
      // This is a file
      const directoryPath = fullPath.split('/').slice(0, -1).join('/');
      
      if (directoryPath) {
        try {
          await webcontainerInstance.fs.mkdir(directoryPath, { recursive: true });
        } catch (error) {
          if (!(error instanceof Error && error.message.includes('EEXIST'))) {
            throw error;
          }
        }
      }

      try {
        await webcontainerInstance.fs.writeFile(fullPath, entry, 'utf-8');
      } catch (error) {
        console.error(`Error writing file ${fullPath}:`, error);
        throw error;
      }
    } else {
      // This is a directory
      try {
        await webcontainerInstance.fs.mkdir(fullPath, { recursive: true });
      } catch (error) {
        if (!(error instanceof Error && error.message.includes('EEXIST'))) {
          throw error;
        }
      }
      
      // Process all entries in the directory
      for (const [key, value] of Object.entries(entry)) {
        await processEntry(`${fullPath}/${key}`, value);
      }
    }
  }

  // Process each top-level entry
  for (const [key, value] of Object.entries(structure)) {
    await processEntry(key, value);
  }
}

/**
 * Gets the complete project structure from a WebContainer instance
 * @param webcontainerInstance The WebContainer instance
 * @param path The starting path to get the structure from
 * @returns A tree structure representing the file system
 */
async function getProjectStructure(
  webcontainerInstance: WebContainer,
  path: string = '/'
): Promise<FileNode[]> {
  const structure: FileNode[] = [];

  try {
    const entries = await webcontainerInstance.fs.readdir(path, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path === '/' ? `/${entry.name}` : `${path}/${entry.name}`;
      
      if (entry.isDirectory()) {
        const children = await getProjectStructure(webcontainerInstance, fullPath);
        structure.push({
          name: entry.name,
          type: 'directory',
          children
        });
      } else {
        try {
          const content = await webcontainerInstance.fs.readFile(fullPath, 'utf-8');
          structure.push({
            name: entry.name,
            type: 'file',
            content
          });
        } catch (error) {
          console.error(`Error reading file ${fullPath}:`, error);
          structure.push({
            name: entry.name,
            type: 'file',
            content: 'Error reading file'
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${path}:`, error);
  }

  return structure.sort((a, b) => {
    // Directories first, then files
    if (a.type === 'directory' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'directory') return 1;
    // Alphabetical order within same type
    return a.name.localeCompare(b.name);
  });
}

/**
 * Converts the file structure tree to a pretty-printed string
 */
function printProjectStructure(structure: FileNode[], level: number = 0): string {
  let output = '';
  const indent = '  '.repeat(level);

  for (const node of structure) {
    if (node.type === 'directory') {
      output += `${indent}📁 ${node.name}/\n`;
      if (node.children) {
        output += printProjectStructure(node.children, level + 1);
      }
    } else {
      output += `${indent}📄 ${node.name}\n`;
    }
  }

  return output;
}

/**
 * Gets a specific file's content from the project structure
 */
async function getFileContent(
  webcontainerInstance: WebContainer,
  filePath: string
): Promise<string | null> {
  try {
    const content = await webcontainerInstance.fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

export { 
  createFolderStructure, 
  getProjectStructure,
  getFileContent,
  printProjectStructure,
  type FileStructure, 
  type CreateFolderStructureOptions,
  type FileNode 
};