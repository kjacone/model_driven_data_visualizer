import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, Code, Layers, FolderTree, Download, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import FlowsDisplay from './FlowDisplay';
import TechStack from './TechStack';
import { TechStackState } from '@/lib/types';
import { useCoAgent } from '@copilotkit/react-core';
import NodeTasks from '../NodeTasks';
import MarkdownWithDiagrams from './Markdown';

// Create separate components for architecture and readme content
const ArchitectureContent = ({ content }) => (
    <Card className="hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
        <CardContent className="p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <MarkdownWithDiagrams
                    key="architecture"
                    content={content}
                />
            </motion.div>
        </CardContent>
    </Card>
);

const ReadmeContent = ({ content }) => (
    <Card className="hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
        <CardContent className="p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-900 rounded-lg p-6"
            >
                <MarkdownWithDiagrams
                    key="readme"
                    content={content}
                />
            </motion.div>
        </CardContent>
    </Card>
);


const ArchitectureDisplay = ({ onNavigateToProjects, createProject }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [architecture, setArchitecture] = useState('');
    const [readme, setReadme] = useState('');
    const [loadingStates, setLoadingStates] = useState({
        flows: true,
        tech: true,
        architecture: true,
        monorepo: true
    });

    const {
        run: agentrun,
        state: coagent,
        stop,
        setState,
        nodeName,
        running,
    } = useCoAgent<TechStackState>({
        name: "gather_info"
    });

    useEffect(() => {
        if (nodeName === 'generate_tech_stack') {
            setLoadingStates(prev => ({ ...prev, flows: false }));
        }
        if (nodeName === 'generate_achitecture') {
            setArchitecture(coagent.architecture);
            setLoadingStates(prev => ({ ...prev, tech: false }));
        }
        if (nodeName === 'generate_readme') {
            setReadme(coagent.readme_content);
            setLoadingStates(prev => ({ ...prev, architecture: false }));
        }
        if (nodeName === '__end__') {
            setLoadingStates(prev => ({ ...prev, monorepo: false }));
        }
    }, [coagent?.tech_stack]);

    const TabTriggerWithLoader = ({ value, icon: Icon, label }) => (
        <TabsTrigger
            value={value}
            className="data-[state=active]:bg-gray-700 relative"

        >
            <div className="flex items-center">
                <Icon className="w-4 h-4 mr-2" />
                {label}
                {loadingStates[value] && (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                )}
            </div>
        </TabsTrigger>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen w-full flex flex-col gap-y-4 p-6 lg:p-8 max-w-7xl mx-auto"
            >
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center"
                >
                    <Button
                        onClick={onNavigateToProjects}
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Hub
                    </Button>
                </motion.div>

                <motion.div
                    className="flex justify-between items-center text-center"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h1 className="text-2xl font-bold text-white">
                        Project Overview
                    </h1>

                    <Button
                        onClick={createProject}
                        className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-full px-8 py-6 transition-all duration-300"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Generate Project
                    </Button>
                </motion.div>

                <Tabs defaultValue="flows" className="w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                            <TabTriggerWithLoader value="flows" icon={Users} label="User Flows" />
                            <TabTriggerWithLoader value="tech" icon={Code} label="Tech Stack" />
                            <TabTriggerWithLoader value="architecture" icon={Layers} label="Architecture" />
                            <TabTriggerWithLoader value="monorepo" icon={FolderTree} label="README.md" />
                        </TabsList>
                    </motion.div>

                    <TabsContent value="flows" className="mt-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <FlowsDisplay />
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="tech" className="mt-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <TechStack />
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="architecture" className="mt-6">
                        <ArchitectureContent content={architecture} />
                    </TabsContent>

                    <TabsContent value="monorepo" className="mt-6">
                        <ReadmeContent content={readme} />
                    </TabsContent>
                </Tabs>
            </motion.div>
            <NodeTasks nodeName={nodeName} />
        </div>
    );
};

export default ArchitectureDisplay;