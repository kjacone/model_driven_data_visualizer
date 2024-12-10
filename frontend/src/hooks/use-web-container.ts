'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { WebContainer } from '@webcontainer/api';
import { toast } from 'sonner';
import { WebContainerService } from '@/components/code/webcontainer';

const files = {
  'index.html': {
    file: {
      contents: '',
    },
  },
  'package.json': {
    file: {
      contents: `{
        "name": "webcode-project",
        "type": "module",
        "dependencies": {
          "serve": "latest"
        },
        "scripts": {
          "start": "serve"
        }
      }`,
    },
  },
};

export function useWebContainer(code: string) {
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [serverReady, setServerReady] = useState(false);
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null);
  const serverRef = useRef<any>(null);

  const handleRun = useCallback(async (container: WebContainer) => {
    try {
      if (serverRef.current) {
        await serverRef.current.kill();
      }

   

      // Start the server
      serverRef.current = await container.spawn('npx', ['serve']);
      console.log('Server process started');

    } catch (error) {
      console.error('Failed to run code:', error);
      toast.error('Failed to run code');
    }
  }, [code]);

  // Initialize WebContainer
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        setLoading(true);
        const container = await WebContainerService.getInstance();
        
        if (!mounted) return;

        // Set up server ready listener
        container.on('server-ready', (port, url) => {
          console.log('Server ready at:', url);
          const webContainerUrl = url;
          setPreview(webContainerUrl);
          setServerReady(true);
        });

        // Mount files and install dependencies
        await container.mount(files);
        const installProcess = await container.spawn('npm', ['install']);
        const installExit = await installProcess.exit;

        if (installExit !== 0) {
          throw new Error('Installation failed');
        }

        setWebContainer(container);
        
        // Initial run
        await handleRun(container);

      } catch (error) {
        console.error('Failed to initialize WebContainer:', error);
        toast.error('Failed to initialize WebContainer');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      if (serverRef.current) {
        serverRef.current.kill();
      }
    };
  }, []);

  // Handle code updates
  const updateCode = useCallback(async () => {
    if (!webContainer) return;

    try {
      setLoading(true);
      await handleRun(webContainer);
    } catch (error) {
      console.error('Failed to update code:', error);
      toast.error('Failed to update code');
    } finally {
      setLoading(false);
    }
  }, [webContainer, handleRun]);

  // Update code when it changes
  useEffect(() => {
    if (serverReady) {
      updateCode();
    }
  }, [code, serverReady, updateCode]);

  return {
    preview,
    loading,
    serverReady,
    updateCode
  };
}