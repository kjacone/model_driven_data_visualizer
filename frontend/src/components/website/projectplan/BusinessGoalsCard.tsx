import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2, Plus, Wand2, X, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const BusinessGoalsDashboard = () => {
    const [goals, setGoals] = useState([{
        id: '1',
        mainStatement: "Deliver exceptional service to build lasting customer relationships while driving sustainable growth through innovation and market expansion.",
        strategies: [
            { id: '1', text: "Customer Service Enhancement", isEditing: false },
            { id: '2', text: "Loyalty Programs", isEditing: false },
            { id: '3', text: "Market Expansion", isEditing: false },
            { id: '4', text: "Digital Transformation", isEditing: false },
            { id: '5', text: "Product Innovation", isEditing: false },
            { id: '6', text: "Sustainable Growth", isEditing: false }
        ],
        isEditing: false
    }]);

    const [showAddGoal, setShowAddGoal] = useState(false);
    const [newStrategy, setNewStrategy] = useState('');
    const [editingStrategy, setEditingStrategy] = useState({ id: '', text: '' });
    const [editingGoal, setEditingGoal] = useState({ id: '', mainStatement: '' });
    const [newGoal, setNewGoal] = useState({
        mainStatement: '',
        strategies: []
    });

    const addStrategy = (event, isNewGoal = false) => {
        event.preventDefault();
        if (newStrategy.trim()) {
            const newItem = { id: Date.now().toString(), text: newStrategy.trim(), isEditing: false };
            if (isNewGoal) {
                setNewGoal(prev => ({
                    ...prev,
                    strategies: [...prev.strategies, newItem]
                }));
            } else {
                setGoals(prev => prev.map((goal, idx) =>
                    idx === 0 ? { ...goal, strategies: [...goal.strategies, newItem] } : goal
                ));
            }
            setNewStrategy('');
        }
    };

    const removeStrategy = (id, isNewGoal = false) => {
        if (isNewGoal) {
            setNewGoal(prev => ({
                ...prev,
                strategies: prev.strategies.filter(strategy => strategy.id !== id)
            }));
        } else {
            setGoals(prev => prev.map((goal, idx) =>
                idx === 0 ? {
                    ...goal,
                    strategies: goal.strategies.filter(strategy => strategy.id !== id)
                } : goal
            ));
        }
    };

    const startEditingStrategy = (strategy) => {
        setEditingStrategy({ id: strategy.id, text: strategy.text });
        setGoals(prev => prev.map(goal => ({
            ...goal,
            strategies: goal.strategies.map(s => ({
                ...s,
                isEditing: s.id === strategy.id
            }))
        })));
    };

    const saveEditedStrategy = (id) => {
        setGoals(prev => prev.map(goal => ({
            ...goal,
            strategies: goal.strategies.map(strategy =>
                strategy.id === id
                    ? { ...strategy, text: editingStrategy.text, isEditing: false }
                    : strategy
            )
        })));
        setEditingStrategy({ id: '', text: '' });
    };

    const handleAddGoal = () => {
        if (newGoal.mainStatement.trim()) {
            setGoals(prev => [...prev, {
                id: Date.now().toString(),
                mainStatement: newGoal.mainStatement,
                strategies: newGoal.strategies,
                isEditing: false
            }]);
            setNewGoal({ mainStatement: '', strategies: [] });
            setShowAddGoal(false);
        }
    };

    const startEditingGoal = (goalId) => {
        setGoals(prev => prev.map(goal => ({
            ...goal,
            isEditing: goal.id === goalId
        })));
        const goalToEdit = goals.find(goal => goal.id === goalId);
        setEditingGoal({
            id: goalId,
            mainStatement: goalToEdit.mainStatement
        });
    };

    const saveEditedGoal = (goalId) => {
        setGoals(prev => prev.map(goal =>
            goal.id === goalId
                ? { ...goal, mainStatement: editingGoal.mainStatement, isEditing: false }
                : goal
        ));
        setEditingGoal({ id: '', mainStatement: '' });
    };

    const removeGoal = (goalId) => {
        setGoals(prev => prev.filter(goal => goal.id !== goalId));
    };

    return (
        <div className="p-6 space-y-8 bg-slate-950 min-h-screen text-slate-50">
            {/* Dashboard Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-50">Business Development Requirements</h2>
                <Button
                    onClick={() => setShowAddGoal(true)}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 hover:bg-black text-white transition-all duration-200"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                </Button>
            </div>

            {/* Add New Goal Card */}
            {showAddGoal && (
                <Card className="border-slate-800 bg-slate-900">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg font-semibold text-slate-50">Add New Goal</CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowAddGoal(false)}
                                className="text-slate-400 hover:text-slate-100"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-200">Goal Statement</label>
                                <div className="relative mt-2">
                                    <Textarea
                                        value={newGoal.mainStatement}
                                        onChange={(e) => setNewGoal(prev => ({ ...prev, mainStatement: e.target.value }))}
                                        placeholder="Enter your goal statement..."
                                        className="pr-24 bg-slate-800 border-slate-700"
                                    />
                                    <Button
                                        onClick={() => console.log('Generating AI content...')}
                                        className="absolute right-2 top-2 bg-purple-600 hover:bg-purple-700 text-white"
                                        size="sm"
                                    >
                                        <Wand2 className="h-4 w-4 mr-2" />
                                        Generate
                                    </Button>
                                </div>
                            </div>
                            <Separator className="bg-slate-800" />
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-slate-200">Add Strategies</label>
                                <form onSubmit={(e) => addStrategy(e, true)} className="flex gap-2">
                                    <Input
                                        value={newStrategy}
                                        onChange={(e) => setNewStrategy(e.target.value)}
                                        placeholder="Enter a new strategy..."
                                        className="flex-1 bg-slate-800 border-slate-700"
                                    />
                                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </form>
                                <div className="flex flex-wrap gap-2">
                                    {newGoal.strategies.map((strategy) => (
                                        <Badge
                                            key={strategy.id}
                                            variant="secondary"
                                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 transition-colors text-slate-200 flex items-center gap-2"
                                        >
                                            {strategy.text}
                                            <div className="flex gap-1 ml-2">
                                                <X
                                                    className="h-3 w-3 hover:text-red-400 cursor-pointer"
                                                    onClick={() => removeStrategy(strategy.id, true)}
                                                />
                                            </div>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={handleAddGoal}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Add Goal
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="border-slate-800 bg-slate-900">
                <CardHeader className="flex-none">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-semibold text-slate-50">
                                "Primary Purpose"
                            </CardTitle>
                            <p className="text-sm text-slate-400">Define your business purpose</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Existing Goals */}
                    {goals.map((goal, goalIndex) => (
                        <React.Fragment key={goalIndex}>
                            <Separator className="bg-slate-800" />
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => startEditingGoal(goal.id)}
                                            className="text-slate-400 hover:text-slate-100"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeGoal(goal.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="border-l-4 border-l-slate-600 p-3">
                                    {goal.isEditing ? (
                                        <div className="space-y-4">
                                            <Textarea
                                                value={editingGoal.mainStatement}
                                                onChange={(e) => setEditingGoal(prev => ({ ...prev, mainStatement: e.target.value }))}
                                                className="w-full bg-slate-800 border-slate-700"
                                            />
                                            <Button
                                                onClick={() => saveEditedGoal(goal.id)}
                                                className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 hover:bg-black text-white transition-all duration-200"
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    ) : (
                                        <p className="text-lg text-slate-300 leading-relaxed">{goal.mainStatement}</p>
                                    )}
                                    <div className="space-y-4 mt-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold text-slate-50">Key Strategies</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {goal.strategies.map((strategy) => (
                                                <Badge
                                                    key={strategy.id}
                                                    variant="secondary"
                                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 transition-colors text-slate-200 flex items-center gap-2"
                                                >
                                                    {strategy.isEditing ? (
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                value={editingStrategy.text}
                                                                onChange={(e) => setEditingStrategy(prev => ({ ...prev, text: e.target.value }))}
                                                                className="h-6 w-40 bg-slate-700 border-slate-600"
                                                            />
                                                            <Check
                                                                className="h-3 w-3 hover:text-green-400 cursor-pointer"
                                                                onClick={() => saveEditedStrategy(strategy.id)}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {strategy.text}
                                                            <div className="flex gap-1 ml-2">
                                                                <Pencil
                                                                    className="h-3 w-3 hover:text-blue-400 cursor-pointer"
                                                                    onClick={() => startEditingStrategy(strategy)}
                                                                />
                                                                <X
                                                                    className="h-3 w-3 hover:text-red-400 cursor-pointer"
                                                                    onClick={() => removeStrategy(strategy.id)}
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                </Badge>
                                            ))}
                                            <form onSubmit={addStrategy} className="relative">
                                                <Input
                                                    value={newStrategy}
                                                    onChange={(e) => setNewStrategy(e.target.value)}
                                                    placeholder="Add strategy..."
                                                    className="pr-12 bg-slate-800 border-slate-700"
                                                />
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 hover:bg-black text-white transition-all duration-200"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default BusinessGoalsDashboard;