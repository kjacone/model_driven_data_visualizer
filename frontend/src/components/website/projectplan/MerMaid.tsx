import React, { useEffect } from 'react';
import mermaid from 'mermaid';

const Mermaid = ({ chart }) => {
    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'dark',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis',
            },
            themeVariables: {
                darkMode: true,
                background: '#1a1a1a',
                primaryColor: '#3498db',
                primaryTextColor: '#fff',
                primaryBorderColor: '#2980b9',
                lineColor: '#666',
                secondaryColor: '#2ecc71',
                tertiaryColor: '#e74c3c'
            }
        });
    }, []);

    useEffect(() => {
        mermaid.contentLoaded();
    }, [chart]);

    return (
        <div className="w-full overflow-x-auto">
            <div className="mermaid text-center">
                {chart}
            </div>
        </div>
    );
};

export default Mermaid;