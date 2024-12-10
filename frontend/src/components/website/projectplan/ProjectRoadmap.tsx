import React, { useState } from 'react';
import {
    Calendar,
    ChevronRight,
    Clock,
    Edit2,
    Eye,
    EyeOff,
    Plus,
    Save,
    Trash2,
    X,
    CheckCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const initialData = {
    phases: [
        {
            id: 1,
            phase: "Planning & Research",
            duration: "Q1 2024",
            status: "completed",
            tasks: [
                { id: 1, task: "Market Research", completed: true },
                { id: 2, task: "Requirements Gathering", completed: true },
                { id: 3, task: "Stakeholder Interviews", completed: true }
            ]
        },
        {
            id: 2,
            phase: "Design & Development",
            duration: "Q2 2024",
            status: "in-progress",
            tasks: [
                { id: 4, task: "UI/UX Design", completed: false },
                { id: 5, task: "Frontend Development", completed: false },
                { id: 6, task: "Backend Implementation", completed: false }
            ]
        },
        {
            id: 3,
            phase: "Testing & Launch",
            duration: "Q3 2024",
            status: "planned",
            tasks: [
                { id: 7, task: "Quality Assurance", completed: false },
                { id: 8, task: "User Acceptance Testing", completed: false },
                { id: 9, task: "Production Deployment", completed: false }
            ]
        }
    ],
    milestones: [
        { id: 1, title: "Project Kickoff", date: "Jan 2024", completed: true },
        { id: 2, title: "Design Approval", date: "Apr 2024", completed: false },
        { id: 3, title: "Beta Release", date: "Jul 2024", completed: false },
        { id: 4, title: "Public Launch", date: "Sep 2024", completed: false }
    ]
};

const AddPhaseDialog = ({ onAdd }) => {
    const [newPhase, setNewPhase] = useState({ phase: '', duration: '', status: 'planned' });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full mt-4 bg-gray-700/50 hover:bg-gray-600 text-gray-200">
                    <Plus className="h-4 w-4 mr-2" /> Add New Phase
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-gray-200">
                <DialogHeader>
                    <DialogTitle>Add New Phase</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Input
                            placeholder="Phase Name"
                            value={newPhase.phase}
                            onChange={(e) => setNewPhase({ ...newPhase, phase: e.target.value })}
                            className="bg-gray-700 text-gray-200"
                        />
                        <Input
                            placeholder="Duration (e.g., Q1 2024)"
                            value={newPhase.duration}
                            onChange={(e) => setNewPhase({ ...newPhase, duration: e.target.value })}
                            className="bg-gray-700 text-gray-200"
                        />
                    </div>
                    <Button
                        onClick={() => {
                            onAdd(newPhase);
                            setNewPhase({ phase: '', duration: '', status: 'planned' });
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Add Phase
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const ProjectRoadmap = () => {
    const [data, setData] = useState(initialData);
    const [editingState, setEditingState] = useState({ type: null, id: null, field: null });
    const [editValue, setEditValue] = useState('');
    const [newTaskText, setNewTaskText] = useState('');
    const [showDiagram, setShowDiagram] = useState(true);

    // CRUD Operations
    const addPhase = (newPhase) => {
        const newId = Math.max(...data.phases.map(p => p.id)) + 1;
        setData(prev => ({
            ...prev,
            phases: [...prev.phases, { ...newPhase, id: newId, tasks: [] }]
        }));
    };

    const deletePhase = (phaseId) => {
        setData(prev => ({
            ...prev,
            phases: prev.phases.filter(phase => phase.id !== phaseId)
        }));
    };
    const startEditing = (type, id, field, value) => {
        setEditingState({ type, id, field });
        setEditValue(value);
    };

    const addTask = (phaseId) => {
        if (!newTaskText.trim()) return;
        const newTask = {
            id: Math.max(...data.phases.flatMap(p => p.tasks.map(t => t.id)), 0) + 1,
            task: newTaskText,
            completed: false
        };
        setData(prev => ({
            ...prev,
            phases: prev.phases.map(phase =>
                phase.id === phaseId
                    ? { ...phase, tasks: [...phase.tasks, newTask] }
                    : phase
            )
        }));
        setNewTaskText('');
    };

    const deleteTask = (phaseId, taskId) => {
        setData(prev => ({
            ...prev,
            phases: prev.phases.map(phase =>
                phase.id === phaseId
                    ? { ...phase, tasks: phase.tasks.filter(task => task.id !== taskId) }
                    : phase
            )
        }));
    };

    const toggleTaskCompletion = (phaseId, taskId) => {
        setData(prev => ({
            ...prev,
            phases: prev.phases.map(phase =>
                phase.id === phaseId ? {
                    ...phase,
                    tasks: phase.tasks.map(task =>
                        task.id === taskId ? { ...task, completed: !task.completed } : task
                    )
                } : phase
            )
        }));
    };

    return (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-blue-400" />
                        <h2 className="text-xl font-bold text-blue-400">Project Roadmap</h2>
                    </div>
                    <button
                        onClick={() => setShowDiagram(!showDiagram)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-200"
                    >
                        {showDiagram ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showDiagram ? 'Hide Roadmap' : 'Show Roadmap'}
                    </button>
                </div>

                {showDiagram && (
                    <div className="space-y-6">
                        {data.phases.map((phase, index) => (
                            <div key={phase.id} className="bg-gray-700/50 p-4 rounded-lg">
                                <div className="flex items-start gap-4">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-200">{phase.phase}</h3>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => startEditing('phase', phase.id, 'phase', phase.phase)}
                                                    className="text-gray-400 hover:text-gray-200"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deletePhase(phase.id)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            {phase.tasks.map((task, taskIndex) => (
                                                <div key={task.id} className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => toggleTaskCompletion(phase.id, task.id)}
                                                            className={task.completed ? 'text-green-500' : 'text-gray-500'}
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                        <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                                                            {task.task}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteTask(phase.id, task.id)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}

                                            <div className="flex items-center gap-2">
                                                <Input
                                                    placeholder="Add new task..."
                                                    value={newTaskText}
                                                    onChange={(e) => setNewTaskText(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && addTask(phase.id)}
                                                    className="bg-gray-800 text-gray-200"
                                                />
                                                <Button
                                                    onClick={() => addTask(phase.id)}
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <AddPhaseDialog onAdd={addPhase} />
                    </div>
                )}
            </div>

            {/* Milestones Section */}
            <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Clock className="w-6 h-6 text-blue-400" />
                        <h2 className="text-xl font-bold text-blue-400">Key Milestones</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.milestones.map((milestone) => (
                        <div key={milestone.id} className="bg-gray-700/50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-200">{milestone.title}</span>
                                </div>
                                <span className="text-gray-400 text-sm">{milestone.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectRoadmap;