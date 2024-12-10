import React, { useState, useCallback } from 'react';
import { useWebContainer } from '@/lib/webcontainer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FileManager = ({ initialFiles }) => {
    const { instance, isLoading, error } = useWebContainer();
    const [mounted, setMounted] = useState(false);
    const [mountError, setMountError] = useState(null);

    // Function to recursively create files and directories
    const createFileStructure = useCallback(async (files, currentPath = '') => {
        for (const [name, content] of Object.entries(files)) {
            const fullPath = `${currentPath}${name}`;

            if (typeof content === 'object' && !content.hasOwnProperty('file')) {
                // It's a directory
                await instance.fs.mkdir(fullPath, { recursive: true });
                if (Object.keys(content).length > 0) {
                    await createFileStructure(content, `${fullPath}/`);
                }
            } else {
                // It's a file
                const fileContent = typeof content === 'string' ? content : '';
                await instance.fs.writeFile(fullPath, fileContent);
            }
        }
    }, [instance]);

    // Initial mount of files
    const mountFiles = useCallback(async () => {
        if (!instance || mounted) return;

        try {
            await createFileStructure(initialFiles);
            setMounted(true);
            setMountError(null);
        } catch (err) {
            setMountError(err.message);
            console.error('Error mounting files:', err);
        }
    }, [instance, initialFiles, mounted, createFileStructure]);

    // Function to mount additional files
    const mountAdditionalFiles = useCallback(async (newFiles, path = '') => {
        if (!instance) return;

        try {
            await createFileStructure(newFiles, path);
            setMountError(null);
        } catch (err) {
            setMountError(err.message);
            console.error('Error mounting additional files:', err);
        }
    }, [instance, createFileStructure]);

    // Helper function to list current files
    const listFiles = useCallback(async (path = '/') => {
        if (!instance) return [];
        try {
            const files = await instance.fs.readdir(path, { withFileTypes: true });
            return files;
        } catch (err) {
            console.error('Error listing files:', err);
            return [];
        }
    }, [instance]);

    // Mount initial files when container is ready
    React.useEffect(() => {
        if (instance && !mounted) {
            mountFiles();
        }
    }, [instance, mounted, mountFiles]);

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardContent className="p-4">
                    <p>Loading WebContainer...</p>
                </CardContent>
            </Card>
        );
    }

    if (error || mountError) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    {error?.message || mountError}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>WebContainer File Manager</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <Button
                            onClick={() => mountAdditionalFiles({
                                'new-directory': {
                                    'example.txt': 'This is a new file'
                                }
                            })}
                            disabled={!mounted}
                        >
                            Mount Sample Files
                        </Button>
                        <Button
                            onClick={() => listFiles().then(files => console.log('Current files:', files))}
                            disabled={!mounted}
                        >
                            List Files
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FileManager;