import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2, Check, X } from 'lucide-react';

const UserNeedsDashboard = () => {
    const [sections, setSections] = useState({
        targetAudience: {
            title: 'Target Audience',
            items: [
                {
                    id: 1,
                    category: 'Demographics',
                    content: 'Millennials and Gen Z, aged 18–45, with disposable income and a tech-savvy lifestyle',
                    isEditing: false
                },
                {
                    id: 2,
                    category: 'Shopping Behaviors',
                    content: 'Prefer fast and intuitive shopping experiences',
                    isEditing: false
                },
                {
                    id: 3,
                    category: 'Shopping Behaviors',
                    content: 'Expect transparency in pricing and product reviews',
                    isEditing: false
                },
                {
                    id: 4,
                    category: 'Shopping Behaviors',
                    content: 'Value convenience in delivery options',
                    isEditing: false
                }
            ]
        },
        painPoints: {
            title: 'Pain Points',
            items: [
                {
                    id: 5,
                    category: 'Slow Loading',
                    content: 'Users abandon slow websites',
                    isEditing: false
                },
                {
                    id: 6,
                    category: 'Limited Search Options',
                    content: 'Frustration arises when products are hard to find',
                    isEditing: false
                },
                {
                    id: 7,
                    category: 'Lack of Trust',
                    content: 'Unclear return policies and no reviews deter purchases',
                    isEditing: false
                },
                {
                    id: 8,
                    category: 'Complex Checkout',
                    content: 'Users want a seamless checkout process with multiple payment options',
                    isEditing: false
                }
            ]
        }
    });

    const [newItems, setNewItems] = useState({
        targetAudience: { category: '', content: '', isAdding: false },
        painPoints: { category: '', content: '', isAdding: false }
    });

    const handleEdit = (sectionKey, itemId) => {
        setSections(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                items: prev[sectionKey].items.map(item =>
                    item.id === itemId ? { ...item, isEditing: true } : item
                )
            }
        }));
    };

    const handleSave = (sectionKey, itemId, updatedContent, updatedCategory) => {
        setSections(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                items: prev[sectionKey].items.map(item =>
                    item.id === itemId
                        ? { ...item, content: updatedContent, category: updatedCategory, isEditing: false }
                        : item
                )
            }
        }));
    };

    const handleDelete = (sectionKey, itemId) => {
        setSections(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                items: prev[sectionKey].items.filter(item => item.id !== itemId)
            }
        }));
    };

    const toggleAddForm = (sectionKey) => {
        setNewItems(prev => ({
            ...prev,
            [sectionKey]: { ...prev[sectionKey], isAdding: !prev[sectionKey].isAdding }
        }));
    };

    const handleAdd = (sectionKey) => {
        const { category, content } = newItems[sectionKey];
        if (category && content) {
            setSections(prev => ({
                ...prev,
                [sectionKey]: {
                    ...prev[sectionKey],
                    items: [...prev[sectionKey].items, {
                        id: Date.now(),
                        category,
                        content,
                        isEditing: false
                    }]
                }
            }));
            setNewItems(prev => ({
                ...prev,
                [sectionKey]: { category: '', content: '', isAdding: false }
            }));
        }
    };

    const EditableItem = ({ sectionKey, item }) => {
        const [editedContent, setEditedContent] = useState(item.content);
        const [editedCategory, setEditedCategory] = useState(item.category);

        return item.isEditing ? (
            <div className="flex flex-col space-y-2 p-4 bg-gray-800 rounded-lg">
                <input
                    type="text"
                    value={editedCategory}
                    onChange={(e) => setEditedCategory(e.target.value)}
                    className="bg-gray-700 text-gray-100 p-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                    placeholder="Category"
                />
                <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="bg-gray-700 text-gray-100 p-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 min-h-[80px]"
                    placeholder="Content"
                />
                <div className="flex gap-2">
                    <button
                        onClick={() => handleSave(sectionKey, item.id, editedContent, editedCategory)}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded flex items-center gap-1"
                    >
                        <Check className="w-4 h-4" /> Save
                    </button>
                    <button
                        onClick={() => handleEdit(sectionKey, item.id)}
                        className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded flex items-center gap-1"
                    >
                        <X className="w-4 h-4" /> Cancel
                    </button>
                </div>
            </div>
        ) : (
            <div className="flex justify-between items-start p-4 bg-gray-800 rounded-lg">
                <div>
                    <h4 className="font-medium text-blue-400 mb-1">{item.category}</h4>
                    <p className="text-gray-300">{item.content}</p>
                </div>
                <div className="flex gap-2 ml-4">
                    <button
                        onClick={() => handleEdit(sectionKey, item.id)}
                        className="text-blue-400 hover:text-blue-300"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleDelete(sectionKey, item.id)}
                        className="text-red-400 hover:text-red-300"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">User Needs Dashboard</h1>

                <div className="space-y-8">
                    {Object.entries(sections).map(([sectionKey, section]) => (
                        <div key={sectionKey} className="bg-gray-800 p-6 rounded-lg">
                            <div className="flex flex-col space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold">{section.title}</h2>
                                    <button
                                        onClick={() => toggleAddForm(sectionKey)}
                                        className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 hover:bg-black text-white transition-all duration-200 px-3 py-1 rounded flex items-center gap-1"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Add Item
                                    </button>
                                </div>

                                {newItems[sectionKey].isAdding && (
                                    <div className="flex gap-4 items-start bg-gray-700 p-4 rounded-lg">
                                        <input
                                            type="text"
                                            placeholder="Category"
                                            value={newItems[sectionKey].category}
                                            onChange={(e) => setNewItems(prev => ({
                                                ...prev,
                                                [sectionKey]: { ...prev[sectionKey], category: e.target.value }
                                            }))}
                                            className="flex-1 bg-gray-600 text-gray-100 p-2 rounded border border-gray-500 focus:outline-none focus:border-blue-500"
                                        />
                                        <textarea
                                            placeholder="Content"
                                            value={newItems[sectionKey].content}
                                            onChange={(e) => setNewItems(prev => ({
                                                ...prev,
                                                [sectionKey]: { ...prev[sectionKey], content: e.target.value }
                                            }))}
                                            className="flex-2 bg-gray-600 text-gray-100 p-2 rounded border border-gray-500 focus:outline-none focus:border-blue-500 min-h-[40px]"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAdd(sectionKey)}
                                                className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 hover:bg-black text-white transition-all duration-200 px-3 py-1 rounded flex items-center gap-1"
                                            >
                                                <Check className="w-4 h-4" />
                                                Add
                                            </button>
                                            <button
                                                onClick={() => toggleAddForm(sectionKey)}
                                                className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded flex items-center gap-1"
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {section.items.map(item => (
                                        <EditableItem
                                            key={item.id}
                                            sectionKey={sectionKey}
                                            item={item}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserNeedsDashboard;