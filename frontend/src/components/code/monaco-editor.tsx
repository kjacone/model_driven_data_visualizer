'use client';

import { useEffect, useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Skeleton } from '../ui/skeleton';
import { useFileManager } from '../providers/FileManagerProvider';
import { debounce } from 'lodash';

type MonacoEditorProps = {
  code: string;
  filePath: string;
  onChange: (value: string) => void;
}

const LANGUAGE_MAP: Record<string, string> = {
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

export function MonacoEditor({ code, filePath, onChange }: MonacoEditorProps) {
  const [mounted, setMounted] = useState(false);
  const { writeFile } = useFileManager();

  const debouncedSave = useCallback(
    debounce((content: string) => {
      writeFile(filePath, content);
      onChange(content);
    }, 500),
    [filePath, writeFile, onChange]
  );

  useEffect(() => {
    setMounted(true);
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  const getLanguage = (path: string): string => {
    if (path.toLowerCase() === 'dockerfile') return 'dockerfile';
    const ext = path.split('.').pop()?.toLowerCase() || '';
    return LANGUAGE_MAP[ext] || 'plaintext';
  };

  const handleConfigureLanguage = (monaco: any, language: string) => {
    if (['typescript', 'javascript'].includes(language)) {
      const jsDefaults = monaco.languages.typescript.javascriptDefaults;
      const tsDefaults = monaco.languages.typescript.typescriptDefaults;
      
      jsDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false
      });

      tsDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: 'React',
        allowJs: true,
        typeRoots: ['node_modules/@types']
      });
    }
  };

  if (!mounted) return <Skeleton className="w-full h-full" />;

  return (
    <div className="h-full border rounded-lg overflow-hidden">
      <Editor
        height="100%"
        language={getLanguage(filePath)}
        theme="vs-dark"
        value={code}
        onChange={value => debouncedSave(value || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          wrappingStrategy: 'advanced',
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: true,
          formatOnPaste: true,
          formatOnType: true
        }}
        loading={<Skeleton className="w-full h-full" />}
        onMount={(editor, monaco) => handleConfigureLanguage(monaco, getLanguage(filePath))}
      />
    </div>
  );
}