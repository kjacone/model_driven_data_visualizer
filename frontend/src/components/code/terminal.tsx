'use client';

import React, { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebContainer } from '@webcontainer/api';
import '@xterm/xterm/css/xterm.css';

interface BufferedTerminalProps {
  webContainer: WebContainer | null;
}

export const BufferedTerminal = forwardRef<{
  appendOutput: (content: string, type: 'output' | 'error') => void;
  executeCommand: (command: string) => Promise<void>;
  clearBuffer: () => void;
}, BufferedTerminalProps>(({ webContainer }, ref) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const shellProcessRef = useRef<any>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm.js
    const terminal = new Terminal({
      convertEol: true,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
      },
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    
    terminal.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = terminal;
    fitAddonRef.current = fitAddon;

    // Handle terminal resize
    const handleResize = () => {
      fitAddon.fit();
      if (shellProcessRef.current && xtermRef.current) {
        const { cols, rows } = xtermRef.current;
        if (cols && rows) {
          shellProcessRef.current.resize({ cols, rows });
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // Initialize shell if webContainer is available
    if (webContainer) {
      initializeShell(terminal);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      terminal.dispose();
    };
  }, [webContainer]);

  const initializeShell = async (terminal: Terminal) => {
    if (!webContainer) return;

    try {
      const shellProcess = await webContainer.spawn('jsh', {
        terminal: {
          cols: terminal.cols,
          rows: terminal.rows,
        },
      });

      shellProcessRef.current = shellProcess;

      // Pipe shell output to terminal
      shellProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          },
        })
      );

      // Pipe terminal input to shell
      const input = shellProcess.input.getWriter();
      terminal.onData((data) => {
        input.write(data);
      });

    } catch (error) {
      console.error('Failed to initialize shell:', error);
      terminal.write('\r\nFailed to initialize shell\r\n');
    }
  };

  useImperativeHandle(ref, () => ({
    appendOutput: (content: string, type: 'output' | 'error') => {
      if (xtermRef.current) {
        const formattedContent = content.endsWith('\n') ? content : content + '\n';
        xtermRef.current.write(formattedContent);
      }
    },
    executeCommand: async (command: string) => {
      if (xtermRef.current && shellProcessRef.current) {
        const input = shellProcessRef.current.input.getWriter();
        input.write(command + '\n');
      }
    },
    clearBuffer: () => {
      if (xtermRef.current) {
        xtermRef.current.clear();
      }
    },
  }));

  return (
    <div 
      ref={terminalRef} 
      className="h-full bg-[#1e1e1e] overflow-hidden"
      style={{ padding: '8px' }}
    />
  );
});

BufferedTerminal.displayName = 'BufferedTerminal';