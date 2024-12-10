import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, ChevronDown, ChevronRight, Edit2, Save, Trash2, PlusCircle, X, BriefcaseIcon, Settings, Users } from 'lucide-react';
import { TechStackState } from '@/lib/types';
import { useCoAgent } from '@copilotkit/react-core';

const FlowsDisplay = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isAddFlowOpen, setIsAddFlowOpen] = useState(false);
    const [isAddStepOpen, setIsAddStepOpen] = useState(false);
    const [activeFlow, setActiveFlow] = useState(null);
    const [newFlow, setNewFlow] = useState({ name: '', icon: 'Users' });
    const [newStep, setNewStep] = useState({ step: '', description: '' });
    const [flows, setFlows] = useState({});

    const agent = useCoAgent<TechStackState>({
        name: "gather_info"
    });

    useEffect(() => {
        // Initialize flows from agent state
        if (agent.state?.use_cases?.user_flows) {
            setFlows(agent.state.use_cases.user_flows);
        }
    }, [agent.state?.use_cases?.user_flows]);



    // Handle flow deletion
    const deleteFlow = (flowKey) => {
        const updatedFlows = { ...flows };
        delete updatedFlows[flowKey];
        setFlows(updatedFlows);
    };

    // Handle step deletion
    const deleteStep = (flowKey, stepIndex) => {
        const updatedFlows = { ...flows };
        updatedFlows[flowKey] = updatedFlows[flowKey].filter((_, index) => index !== stepIndex);
        setFlows(updatedFlows);
    };

    // Handle adding new flow
    const addFlow = () => {
        if (!newFlow.name.trim()) return;

        const flowKey = newFlow.name.toLowerCase().replace(/\s+/g, '_');
        setFlows(prev => ({
            ...prev,
            [flowKey]: []
        }));

        setNewFlow({ name: '', icon: 'Users' });
        setIsAddFlowOpen(false);
    };

    // Handle adding new step
    const addStep = () => {
        if (!activeFlow || !newStep.step.trim()) return;

        setFlows(prev => ({
            ...prev,
            [activeFlow]: [
                ...(prev[activeFlow] || []),
                {
                    step: newStep.step,
                    description: newStep.description
                }
            ]
        }));

        setNewStep({ step: '', description: '' });
        setIsAddStepOpen(false);
    };

    return (
        <div className="h-screen bg-gray-900 overflow-hidden flex flex-col">
            <div className="container mx-auto p-4 flex-1 overflow-hidden flex flex-col">
                {/* Project Overview Card - Fixed width */}
                <div className="w-full max-w-5xl mx-auto mb-4">
                    <Card className="bg-gray-800 border-gray-700 shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-700">
                            <CardTitle className="text-2xl font-bold text-gray-100">{agent.state.use_cases?.title || ''}  Project Overview</CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsEditing(!isEditing)}
                                className="hover:bg-gray-700 text-gray-300"
                            >
                                {isEditing ? <Save className="h-5 w-5" /> : <Edit2 className="h-5 w-5" />}
                            </Button>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-6 pt-6">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-200">Product Description</h3>
                                {isEditing ? (
                                    <Textarea
                                        value={agent.state.use_cases?.product_description || ''}
                                        className="bg-gray-700 border-gray-600 text-gray-100 h-32"
                                    />
                                ) : (
                                    <p className="text-gray-300">{agent.state.use_cases?.product_description}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-200">Target Audience</h3>
                                {isEditing ? (
                                    <Textarea
                                        value={agent.state.use_cases?.target_audience || ''}
                                        className="bg-gray-700 border-gray-600 text-gray-100 h-32"
                                    />
                                ) : (
                                    <ul className="list-disc pl-6 space-y-1">
                                        {agent.state.use_cases?.target_audience.map((item, index) => (
                                            <li key={index} className="text-gray-300 ">{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                        </CardContent>
                    </Card>
                </div>

                {/* Flows Section - Scrollable with same width as Project Overview */}
                <div className="w-full max-w-5xl mx-auto flex-1 overflow-hidden flex flex-col">
                    <div className="flex justify-end mb-4">
                        <Button
                            onClick={() => setIsAddFlowOpen(true)}
                            className="bg-gray-700 hover:bg-gray-600"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Flow
                        </Button>
                    </div>

                    <div className="overflow-y-auto flex-1 pr-2">
                        <div className="grid gap-8">
                            {Object.entries(flows).map(([flowKey, steps]) => (
                                <div key={flowKey} className="bg-gray-800 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                                            <h2 className="text-lg font-semibold text-blue-600 capitalize">
                                                {flowKey.replace('_', ' ')} Flow
                                            </h2>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => {
                                                    setActiveFlow(flowKey);
                                                    setIsAddStepOpen(true);
                                                }}
                                                size="sm"
                                                className="bg-gray-700 hover:bg-gray-600"
                                            >
                                                <PlusCircle className="w-4 h-4 mr-2" />
                                                Add Step
                                            </Button>
                                            <Button
                                                onClick={() => deleteFlow(flowKey)}
                                                size="sm"
                                                variant="destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid gap-3">
                                        {Array.isArray(steps) && steps.map((step, index) => (
                                            <div
                                                key={index}
                                                className="relative pl-6 group"
                                            >
                                                {index !== steps.length - 1 && (
                                                    <div
                                                        className="absolute left-2.5 top-6 w-px h-full bg-gray-700"
                                                        style={{ height: 'calc(100% + 0.75rem)' }}
                                                    />
                                                )}

                                                <div className="flex items-start gap-3 bg-gray-850 p-3 rounded border border-gray-700 hover:border-gray-600 transition-all">
                                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                                                        {index + 1}
                                                    </span>

                                                    <div className="min-w-0 flex-grow">
                                                        <h3 className="text-sm font-medium text-white mb-1">
                                                            {step.step}
                                                        </h3>
                                                        <p className="text-xs text-gray-400 line-clamp-2">
                                                            {step.description}
                                                        </p>

                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            {step.inner_steps.map((step, stepIndex) => (
                                                                <div key={stepIndex} className="flex items-center gap-2 text-gray-300 text-sm">
                                                                    {stepIndex > 0 && <ChevronRight className="w-4 h-4 text-gray-500" />}
                                                                    <span className="bg-gray-700 px-3 py-1 rounded">{step}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <Button
                                                        onClick={() => deleteStep(flowKey, index)}
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-gray-400 hover:text-red-400"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Flow Dialog */}
            <Dialog open={isAddFlowOpen} onOpenChange={setIsAddFlowOpen}>
                <DialogContent className="bg-gray-800 text-gray-100">
                    <DialogHeader>
                        <DialogTitle>Add New Flow</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="Enter flow title"
                        value={newFlow.name}
                        onChange={e => setNewFlow({ ...newFlow, name: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                    />
                    <DialogFooter>
                        <Button onClick={() => setIsAddFlowOpen(false)} variant="ghost" className="text-gray-300">
                            Cancel
                        </Button>
                        <Button onClick={addFlow} className="bg-blue-600 hover:bg-blue-700">
                            Add Flow
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Step Dialog */}
            <Dialog open={isAddStepOpen} onOpenChange={setIsAddStepOpen}>
                <DialogContent className="bg-gray-800 text-gray-100">
                    <DialogHeader>
                        <DialogTitle>Add New Step</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Step title"
                            value={newStep.step}
                            onChange={e => setNewStep({ ...newStep, step: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-gray-100"
                        />
                        <Textarea
                            placeholder="Step description"
                            value={newStep.description}
                            onChange={e => setNewStep({ ...newStep, description: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-gray-100"
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsAddStepOpen(false)} variant="ghost" className="text-gray-300">
                            Cancel
                        </Button>
                        <Button onClick={addStep} className="bg-blue-600 hover:bg-blue-700">
                            Add Step
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FlowsDisplay;