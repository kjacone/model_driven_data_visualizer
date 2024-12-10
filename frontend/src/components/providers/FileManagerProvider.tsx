import React, { createContext, useContext, useState, useCallback } from 'react';
import { useWebContainer } from '@/lib/webcontainer'

interface ExpandedFolders {
    [path: string]: boolean;
}

interface FileManagerContextType {
    currentFile: string | null;
    fileTree: Record<string, any>;
    readFile: (path: string) => Promise<string | null>;
    writeFile: (path: string, content: string) => Promise<boolean>;
    createDirectory: (path: string) => Promise<boolean>;
    deleteFile: (path: string) => Promise<boolean>;
    setCurrentFile: (file: string | null) => void;
    setFileTree: (tree: Record<string, any>) => void;
    handleFileChange: (file: string) => void;
    selectedFile: string;
    fileContent: string;
    expandedFolders: ExpandedFolders;
    setExpandedFolders: React.Dispatch<React.SetStateAction<ExpandedFolders>>;
}

const FileManagerContext = createContext<FileManagerContextType | null>(null);




export function FileManagerProvider({ children }: { children: React.ReactNode }) {
    const { instance } = useWebContainer();
    const [currentFile, setCurrentFile] = useState<string | null>(null);
    const [fileTree, setFileTree] = useState<Record<string, any>>({});
    const [selectedFile, setSelectedFile] = useState<string>('');
    const [fileContent, setFileContent] = useState<string>('');

    const [expandedFolders, setExpandedFolders] = useState({});

    const handleFileChange = useCallback((file: string) => {
        setSelectedFile(file);
        readFile(file).then(content => {
            if (content) setFileContent(content);
        });
    }, []);

    const readFile = useCallback(async (path: string) => {
        if (!instance) return null;
        try {
            const content = await instance.fs.readFile(path, 'utf-8');
            return content;
        } catch (error) {
            console.error('Error reading file:', error);
            return null;
        }
    }, [instance]);

    const writeFile = useCallback(async (path: string, content: string) => {
        if (!instance) return false;
        try {
            await instance.fs.writeFile(path, content);
            return true;
        } catch (error) {
            console.error('Error writing file:', error);
            return false;
        }
    }, [instance]);

    const createDirectory = useCallback(async (path: string) => {
        if (!instance) return false;
        try {
            await instance.fs.mkdir(path, { recursive: true });
            return true;
        } catch (error) {
            console.error('Error creating directory:', error);
            return false;
        }
    }, [instance]);

    const deleteFile = useCallback(async (path: string) => {
        if (!instance) return false;
        try {
            await instance.fs.rm(path, { recursive: true });
            return true;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }, [instance]);

    const value = {
        currentFile,
        fileTree,
        readFile,
        writeFile,
        createDirectory,
        deleteFile,
        setCurrentFile,
        setFileTree,
        handleFileChange,
        selectedFile,
        fileContent,
        expandedFolders,
        setExpandedFolders,
    };

    return (
        <FileManagerContext.Provider value={value}>
            {children}
        </FileManagerContext.Provider>
    );
}

export function useFileManager() {
    const context = useContext(FileManagerContext);
    if (!context) {
        throw new Error('useFileManager must be used within a FileManagerProvider');
    }
    return context;
}