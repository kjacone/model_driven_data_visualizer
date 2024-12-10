import { WebContainer } from '@webcontainer/api';
import { toast } from 'sonner';

interface ProcessOptions {
  processName: string;
  installCommand?: string;
  startCommand: string;
  port?: number;
  onOutput?: (data: string) => void;
  onError?: (data: string) => void;
  onExit?: (code: number | null) => void;
  timeout?: number;
  cwd?: string;
}

interface ProcessInfo {
  process: any; // WebContainer process type
  isRunning: boolean;
}

const runningProcesses = new Map<string, ProcessInfo>();

async function killProcess(processName: string): Promise<void> {
  const processInfo = runningProcesses.get(processName);
  if (processInfo && processInfo.isRunning) {
    try {
      await processInfo.process.kill();
      processInfo.isRunning = false;
      console.log(`Killed existing ${processName} process`);
    } catch (error) {
      console.error(`Error killing ${processName} process:`, error);
    }
  }
}

async function checkPort(webcontainerInstance: WebContainer, port: number): Promise<boolean> {
  try {
    const checkProcess = await webcontainerInstance.spawn('lsof', [`-i:${port}`]);
    const exitCode = await checkProcess.exit;
    return exitCode === 0; // Port is in use if exit code is 0
  } catch {
    return false; // If lsof fails, assume port is free
  }
}

export async function handleProcess(
  webcontainerInstance: WebContainer,
  options: ProcessOptions
): Promise<{ restart: () => Promise<void>; stop: () => Promise<void> }> {
  const {
    processName,
    installCommand,
    startCommand,
    port,
    onOutput,
    onError,
    onExit,
    timeout = 30000,
    cwd = '/'
  } = options;

  async function startProcess(): Promise<void> {
    try {
      // Kill existing process if running
      await killProcess(processName);

      // Check if port is in use (if port is specified)
      if (port) {
        const isPortInUse = await checkPort(webcontainerInstance, port);
        if (isPortInUse) {
          throw new Error(`Port ${port} is already in use`);
        }
      }

      // Change to specified working directory
      if (cwd !== '/') {
        await webcontainerInstance.spawn('cd', [cwd]).exit;
      }

      // Install dependencies if an install command is provided
      if (installCommand) {
        console.log(`Installing dependencies for ${processName}...`);
        toast.info(`Installing dependencies for ${processName}...`);

        const installProcess = await webcontainerInstance.spawn('npm', ['install']);
        
        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              const text = data.toString();
              onOutput?.(text);
              console.log(`[${processName} Install]:`, text);
            },
          })
        );

        const installExitCode = await installProcess.exit;
        
        if (installExitCode !== 0) {
          throw new Error(`${processName} dependency installation failed with code ${installExitCode}`);
        }

        console.log(`${processName} dependencies installed successfully`);
        toast.success(`${processName} dependencies installed`);
      }

      // Start the application
      console.log(`Starting ${processName}...`);
      toast.info(`Starting ${processName}...`);

      const startProcess = await webcontainerInstance.spawn('npm', ['run', startCommand]);

      // Store process information
      runningProcesses.set(processName, {
        process: startProcess,
        isRunning: true
      });

      let started = false;
      const startTimeout = setTimeout(() => {
        if (!started) {
          startProcess.kill();
          throw new Error(`${processName} start timed out after ${timeout}ms`);
        }
      }, timeout);

      startProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            const text = data.toString();
            started = true;
            onOutput?.(text);
            console.log(`[${processName}]:`, text);

            if (
              text.includes('localhost:') ||
              text.includes('127.0.0.1:') ||
              text.includes('0.0.0.0:') ||
              text.includes('Development Server is running')
            ) {
              clearTimeout(startTimeout);
              toast.success(`${processName} started successfully`);
            }
          },
        })
      );

      startProcess.stderr.pipeTo(
        new WritableStream({
          write(data) {
            const text = data.toString();
            onError?.(text);
            console.error(`[${processName} Error]:`, text);

            // Check for common port-in-use error messages
            if (
              text.includes('EADDRINUSE') ||
              text.includes('address already in use') ||
              text.includes('port is already in use')
            ) {
              toast.error(`Port ${port} is already in use`);
            }
          },
        })
      );

      startProcess.exit.then((code) => {
        clearTimeout(startTimeout);
        const processInfo = runningProcesses.get(processName);
        if (processInfo) {
          processInfo.isRunning = false;
        }
        onExit?.(code);
        
        if (code !== 0 && code !== null) {
          console.error(`${processName} exited with code ${code}`);
          toast.error(`${processName} failed with exit code ${code}`);
        }
      });

    } catch (error) {
      console.error(`Error in ${processName} process:`, error);
      toast.error(`Failed to ${installCommand ? 'install/start' : 'start'} ${processName}`);
      throw error;
    }
  }

  // Initial start
  await startProcess();

  // Return control functions
  return {
    restart: async () => {
      console.log(`Restarting ${processName}...`);
      toast.info(`Restarting ${processName}...`);
      await startProcess();
    },
    stop: async () => {
      await killProcess(processName);
      toast.success(`${processName} stopped`);
    }
  };
}