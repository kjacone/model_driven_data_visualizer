// webcontainer.ts
import { WebContainer } from "@webcontainer/api";
import { WORK_DIR_NAME } from "@/utils/constants";
import { useState, useEffect } from "react";

interface WebContainerContext {
  loaded: boolean;
  error: Error | null;
  instance: WebContainer | null;
}

// Create a more detailed context
const webcontainerContext: WebContainerContext = {
  loaded: false,
  error: null,
  instance: null,
};

// Create a proper singleton instance
let webcontainerPromise: Promise<WebContainer> | null = null;

const checkCrossOriginIsolation = () => {
  if (!crossOriginIsolated) {
    throw new Error(
      "Cross-Origin Isolation is not enabled. Please ensure the following headers are set:\n" +
        "- Cross-Origin-Embedder-Policy: require-corp\n" +
        "- Cross-Origin-Opener-Policy: same-origin"
    );
  }
};

// Function to initialize WebContainer
const initializeWebContainer = async (): Promise<WebContainer> => {
  try {
    if (typeof window === "undefined") {
      throw new Error(
        "WebContainer can only be initialized in browser environment"
      );
    }

    // Check for cross-origin isolation before proceeding
    checkCrossOriginIsolation();

    if (!webcontainerPromise) {
      webcontainerPromise = WebContainer.boot({
        workdirName: WORK_DIR_NAME,
        options: {
          // Ensure proper CORS handling for resources
          headers: {
            "Cross-Origin-Embedder-Policy": "require-corp",
            "Cross-Origin-Opener-Policy": "same-origin",
          },
        },
      });

      const instance = await webcontainerPromise;

      // Add error handling for CORS issues
      instance.on("error", (error) => {
        if (
          error.message.includes("SharedArrayBuffer") ||
          error.message.includes("postMessage")
        ) {
          console.error("CORS or Cross-Origin Isolation error:", error);
          console.log("Please ensure proper security headers are set.");
        }
      });

      return instance;
    }

    return webcontainerPromise;
  } catch (error) {
    console.error("Failed to initialize WebContainer:", error);
    if (error instanceof Error && error.message.includes("SharedArrayBuffer")) {
      console.log("Cross-Origin Isolation is not properly configured.");
    }
    throw error;
  }
};

// Create a hook for using WebContainer in components
const useWebContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [instance, setInstance] = useState<WebContainer | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const webcontainer = await initializeWebContainer();
        if (mounted) {
          setInstance(webcontainer);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  return { instance, isLoading, error };
};

// Export everything we need
export {
  webcontainerContext,
  initializeWebContainer,
  useWebContainer,
  type WebContainerContext,
};
