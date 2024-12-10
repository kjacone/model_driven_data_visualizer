import React, { useState } from 'react';
import {
    AlertTriangle,
    Shield,
    ChevronRight,
    Plus,
    Edit2,
    Save,
    Trash2,
    X
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const initialData = {
    challengesAndMitigation: {
        challenges: [
            "Scope Creep: Stick to MVP for the first phase",
            "Technical Risks: Use reliable tools and third-party APIs with strong documentation",
            "User Adoption: Address through tutorials, FAQs, and excellent customer support"
        ],
        mitigation: [
            "Weekly team reviews to address scope and progress",
            "Beta testing with actual users before launch",
            "Active customer feedback channels post-launch"
        ]
    }
};

const ChallengesMitigation = () => {
    const [data, setData] = useState(initialData.challengesAndMitigation);
    const [newChallenge, setNewChallenge] = useState('');
    const [newMitigation, setNewMitigation] = useState('');
    const [editingIndex, setEditingIndex] = useState({ type: null, index: null });
    const [editValue, setEditValue] = useState('');

    const handleAdd = (type) => {
        const value = type === 'challenges' ? newChallenge : newMitigation;
        if (value.trim()) {
            setData(prev => ({
                ...prev,
                [type]: [...prev[type], value]
            }));
            if (type === 'challenges') {
                setNewChallenge('');
            } else {
                setNewMitigation('');
            }
        }
    };

    const handleDelete = (type, index) => {
        setData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    const startEditing = (type, index, value) => {
        setEditingIndex({ type, index });
        setEditValue(value);
    };

    const handleSave = () => {
        if (editValue.trim()) {
            setData(prev => ({
                ...prev,
                [editingIndex.type]: prev[editingIndex.type].map((item, i) =>
                    i === editingIndex.index ? editValue : item
                )
            }));
        }
        setEditingIndex({ type: null, index: null });
        setEditValue('');
    };

    return (
        <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-bold text-blue-400 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6" />
                        Project Challenges & Mitigation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Challenges Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                Challenges
                            </h3>
                            <div className="space-y-3">
                                {data.challenges.map((challenge, index) => (
                                    <div
                                        key={index}
                                        className="group flex items-start gap-2 bg-gray-700/50 p-3 rounded-lg"
                                    >
                                        {editingIndex.type === 'challenges' && editingIndex.index === index ? (
                                            <div className="flex-1 flex items-center gap-2">
                                                <Input
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="flex-1 bg-gray-800 text-gray-200"
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={handleSave}
                                                    className="text-green-400"
                                                >
                                                    <Save className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => setEditingIndex({ type: null, index: null })}
                                                    className="text-gray-400"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <ChevronRight className="w-5 h-5 text-yellow-500 mt-0.5" />
                                                <span className="flex-1 text-gray-200">{challenge}</span>
                                                <div className="hidden group-hover:flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => startEditing('challenges', index, challenge)}
                                                        className="text-gray-400 hover:text-gray-200"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDelete('challenges', index)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="Add new challenge..."
                                        value={newChallenge}
                                        onChange={(e) => setNewChallenge(e.target.value)}
                                        className="bg-gray-700 text-gray-200"
                                        onKeyPress={(e) => e.key === 'Enter' && handleAdd('challenges')}
                                    />
                                    <Button
                                        onClick={() => handleAdd('challenges')}
                                        className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 hover:bg-black text-white transition-all duration-200"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Mitigation Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-green-500" />
                                Mitigation Strategies
                            </h3>
                            <div className="space-y-3">
                                {data.mitigation.map((strategy, index) => (
                                    <div
                                        key={index}
                                        className="group flex items-start gap-2 bg-gray-700/50 p-3 rounded-lg"
                                    >
                                        {editingIndex.type === 'mitigation' && editingIndex.index === index ? (
                                            <div className="flex-1 flex items-center gap-2">
                                                <Input
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="flex-1 bg-gray-800 text-gray-200"
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={handleSave}
                                                    className="text-green-400"
                                                >
                                                    <Save className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => setEditingIndex({ type: null, index: null })}
                                                    className="text-gray-400"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                                                <span className="flex-1 text-gray-200">{strategy}</span>
                                                <div className="hidden group-hover:flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => startEditing('mitigation', index, strategy)}
                                                        className="text-gray-400 hover:text-gray-200"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDelete('mitigation', index)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="Add new mitigation strategy..."
                                        value={newMitigation}
                                        onChange={(e) => setNewMitigation(e.target.value)}
                                        className="bg-gray-700 text-gray-200"
                                        onKeyPress={(e) => e.key === 'Enter' && handleAdd('mitigation')}
                                    />
                                    <Button
                                        onClick={() => handleAdd('mitigation')}
                                        className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 hover:bg-black text-white transition-all duration-200"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChallengesMitigation;