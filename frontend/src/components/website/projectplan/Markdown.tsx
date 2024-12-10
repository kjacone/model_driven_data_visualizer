import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

const DiagramRenderer = ({ content, type = 'default' }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        const mermaid = (await import('mermaid')).default;

        // Configure Mermaid with modern theme and settings
        mermaid.initialize({
          startOnLoad: true,
          theme: 'dark',
          securityLevel: 'loose',
          themeVariables: {
            primaryColor: '#3b82f6',
            lineColor: '#64748b',
            textColor: '#e2e8f0',
            mainBkg: '#1e293b',
            nodeBorder: '#475569',
            clusterBkg: '#1e293b',
            clusterBorder: '#475569',
            labelColor: '#e2e8f0',
            relationLabelColor: '#e2e8f0'
          },
          flowchart: {
            curve: 'basis',
            padding: 15
          },
          er: {
            useMaxWidth: true,
            padding: 20
          },
          sequence: {
            mirrorActors: false,
            bottomMarginAdj: 10,
            useMaxWidth: true
          }
        });

        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, content);
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error('Failed to render diagram:', err);
        setError(`Failed to render diagram: ${err.message}`);
      }
    };

    renderDiagram();
  }, [content, type]);

  if (error) {
    return (
      <div className="p-4 my-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svg }}
      className="flex justify-center my-6 p-4 bg-slate-800/50 rounded-lg overflow-x-auto"
    />
  );
};

const MarkdownWithDiagrams = ({ content }) => {
  const components = {
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const code = String(children).replace(/\n$/, '');

      // Handle inline code
      if (inline) {
        return (
          <code className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded" {...props}>
            {children}
          </code>
        );
      }

      // Handle Mermaid diagrams
      if (language === 'mermaid') {
        return <DiagramRenderer content={code} type={language} />;
      }

      // Regular code blocks
      return (
        <pre className="p-4 my-4 bg-slate-800 text-slate-200 rounded-lg overflow-x-auto">
          <code className={className} {...props}>
            {code}
          </code>
        </pre>
      );
    },
    // Style other Markdown elements
    h1: ({ ...props }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 text-slate-100" {...props} />
    ),
    h2: ({ ...props }) => (
      <h2 className="text-2xl font-semibold mt-6 mb-3 text-slate-200" {...props} />
    ),
    h3: ({ ...props }) => (
      <h3 className="text-xl font-medium mt-4 mb-2 text-slate-300" {...props} />
    ),
    p: ({ ...props }) => (
      <p className="my-3 leading-7 text-slate-300" {...props} />
    ),
    ul: ({ ...props }) => (
      <ul className="my-4 ml-6 list-disc space-y-2 text-slate-300" {...props} />
    ),
    ol: ({ ...props }) => (
      <ol className="my-4 ml-6 list-decimal space-y-2 text-slate-300" {...props} />
    ),
    li: ({ ...props }) => (
      <li className="leading-7" {...props} />
    ),
    blockquote: ({ ...props }) => (
      <blockquote className="pl-4 my-4 border-l-4 border-slate-600 text-slate-400 italic" {...props} />
    )
  };

  return (
    <Card className="p-6 bg-slate-900 border-slate-700">
      <ReactMarkdown
        components={components}
        className="prose prose-invert max-w-none"
      >
        {content}
      </ReactMarkdown>
    </Card>
  );
};

export default MarkdownWithDiagrams;