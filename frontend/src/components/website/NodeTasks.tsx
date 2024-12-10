import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NodeTasks = ({ nodeName = '__start__' }) => {
    const [completedTasks, setCompletedTasks] = useState(new Set());
    const [currentTask, setCurrentTask] = useState('');
    const [previousNode, setPreviousNode] = useState(nodeName);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Handle visibility
        if (nodeName === '__start__') {
            setIsVisible(false);
        }
        if (nodeName === '__end__') {
            setIsVisible(false);
        }

        // Handle task completion
        if (previousNode !== nodeName && currentTask) {
            setCompletedTasks(prev => new Set([...prev, currentTask]));
        }
        setPreviousNode(nodeName);
    }, [nodeName, currentTask, previousNode]);

    useEffect(() => {
        const getCurrentTask = () => {
            switch (nodeName) {

                case 'analyze_input':
                    setIsVisible(true);
                    setCurrentTask('Analyzing Flows');
                    break;
                case 'generate_tech_stack':
                    setIsVisible(true);
                    setCurrentTask('Processing Stack');
                    break;
                case 'generate_achitecture':
                    setIsVisible(true);
                    setCurrentTask('Building Architecture');
                    break;
                case 'generate_readme':
                    setIsVisible(true);
                    setCurrentTask('Creating Docs');
                    break;
                case '__end__':
                    setIsVisible(false);
                    setCurrentTask('');
                    break;
                default:
                    setCurrentTask('');
            }
        };

        getCurrentTask();
    }, [nodeName]);

    const tasks = [
        { title: "Analyzing Flows", description: "Generating user interactions..." },
        { title: "Processing Stack", description: "Evaluating technologies..." },
        { title: "Building Architecture", description: "Designing system components..." },
        { title: "Creating Docs", description: "Preparing documentation..." }
    ];

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Card className="w-80 bg-zinc-900 border-zinc-800 shadow-lg shadow-zinc-900/50">
                <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium text-zinc-200">
                        Progress Tracker
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                    <div className="space-y-2">
                        {tasks.map((task) => (
                            <div key={task.title} className="flex items-start space-x-2 text-xs">
                                {completedTasks.has(task.title) ? (
                                    <CheckCircle className="text-emerald-500 w-4 h-4 mt-0.5" />
                                ) : task.title === currentTask ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-blue-400 mt-0.5" />
                                ) : (
                                    <Circle className="w-4 h-4 text-zinc-700 mt-0.5" />
                                )}
                                <div className="flex-1">
                                    <div className={`${completedTasks.has(task.title)
                                        ? 'text-zinc-500'
                                        : task.title === currentTask
                                            ? 'text-zinc-200'
                                            : 'text-zinc-400'
                                        }`}>
                                        {task.title}
                                    </div>
                                    <div className="text-zinc-500 text-xs">
                                        {task.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default NodeTasks;