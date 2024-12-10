import React, { useState } from 'react';
import {
    DollarSign,
    Users,
    PenTool,
    Plus,
    Edit2,
    Save,
    Trash2,
    X,
    Eye,
    EyeOff,
    Code,
    Database,
    Cloud,
    Laptop,
    Mail,
    Layout,
    LineChart,
    MessageSquare,
    Server,
    Settings,
    Shield,
    Smartphone,
    Terminal,
    TestTube,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const initialData = {
    budget: {
        totalBudget: "$500,000",
        spent: "$150,000",
        remaining: "$350,000",
        quarterlyAllocation: "$125,000"
    },
    resources: {
        team: [
            {
                id: 1,
                role: "Project Manager (1)",
                emails: ["john.doe@company.com"]
            },
            {
                id: 2,
                role: "Senior Developers (3)",
                emails: ["alice.smith@company.com", "bob.jones@company.com", "carol.white@company.com"]
            },
            {
                id: 3,
                role: "UX Designer (1)",
                emails: ["david.brown@company.com"]
            },
            {
                id: 4,
                role: "QA Engineers (2)",
                emails: ["emma.wilson@company.com", "frank.miller@company.com"]
            }
        ]
    },
    techStack: {
        frontend: [
            { id: 1, text: "React" },
            { id: 2, text: "TypeScript" },
            { id: 3, text: "Tailwind CSS" },
            { id: 4, text: "Next.js" },
            { id: 5, text: "Redux" }
        ],
        backend: [
            { id: 6, text: "Node.js" },
            { id: 7, text: "Python" },
            { id: 8, text: "Java" },
            { id: 9, text: "GraphQL" },
            { id: 10, text: "REST APIs" }
        ],
        database: [
            { id: 11, text: "PostgreSQL" },
            { id: 12, text: "MongoDB" },
            { id: 13, text: "Redis" },
            { id: 14, text: "Elasticsearch" }
        ],
        devops: [
            { id: 15, text: "Docker" },
            { id: 16, text: "Kubernetes" },
            { id: 17, text: "Jenkins" },
            { id: 18, text: "GitHub Actions" }
        ],
        cloud: [
            { id: 19, text: "AWS" },
            { id: 20, text: "Azure" },
            { id: 21, text: "GCP" },
            { id: 22, text: "Terraform" }
        ],
        testing: [
            { id: 23, text: "Jest" },
            { id: 24, text: "Cypress" },
            { id: 25, text: "Selenium" },
            { id: 26, text: "JUnit" }
        ],
        security: [
            { id: 27, text: "OAuth" },
            { id: 28, text: "JWT" },
            { id: 29, text: "SSL/TLS" },
            { id: 30, text: "WAF" }
        ],
        monitoring: [
            { id: 31, text: "Grafana" },
            { id: 32, text: "Prometheus" },
            { id: 33, text: "ELK Stack" },
            { id: 34, text: "New Relic" }
        ],
        mobile: [
            { id: 35, text: "React Native" },
            { id: 36, text: "Flutter" },
            { id: 37, text: "iOS" },
            { id: 38, text: "Android" }
        ],
        analytics: [
            { id: 39, text: "Google Analytics" },
            { id: 40, text: "Mixpanel" },
            { id: 41, text: "Amplitude" },
            { id: 42, text: "Segment" }
        ],
        communication: [
            { id: 43, text: "Slack" },
            { id: 44, text: "Microsoft Teams" },
            { id: 45, text: "Zoom" },
            { id: 46, text: "Email Systems" }
        ],
        projectManagement: [
            { id: 47, text: "Jira" },
            { id: 48, text: "Trello" },
            { id: 49, text: "Asana" },
            { id: 50, text: "Confluence" }
        ],
        supportTools: [
            { id: 51, text: "Zendesk" },
            { id: 52, text: "Intercom" },
            { id: 53, text: "Freshdesk" },
            { id: 54, text: "Help Scout" }
        ],
        documentation: [
            { id: 55, text: "Swagger" },
            { id: 56, text: "Postman" },
            { id: 57, text: "GitBook" },
            { id: 58, text: "README.md" }
        ]
    }

};

const EmailBadges = ({ emails, onAddEmail, onRemoveEmail }) => {
    const [newEmail, setNewEmail] = useState('');
    const [showInput, setShowInput] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newEmail.trim() && newEmail.includes('@')) {
            onAddEmail(newEmail.trim());
            setNewEmail('');
            setShowInput(false);
        }
    };

    return (
        <div className="ml-4 mt-2">
            <div className="flex flex-wrap gap-2 items-center">
                {emails.map((email, index) => (
                    <Badge
                        key={index}
                        variant="outline"
                        className="px-2 py-1 bg-gray-700 text-gray-200 flex items-center gap-2"
                    >
                        <Mail className="h-3 w-3 from-emerald-600 to-emerald-800" />
                        {email}
                        <X
                            className="h-3 w-3 hover:text-red-400 cursor-pointer"
                            onClick={() => onRemoveEmail(email)}
                        />
                    </Badge>
                ))}

                <form onSubmit={handleSubmit} className="relative">
                    <Input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Enter email address..."
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
    );
};


const CollapsibleSection = ({ title, icon: Icon, children, defaultExpanded = false }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 from-emerald-600 to-emerald-800" />
                    <h4 className="text-md font-semibold text-gray-200">{title}</h4>
                </div>
                {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
            </button>
            {isExpanded && <div className="p-4 bg-gray-800/50">{children}</div>}
        </div>
    );
};

const TechStackSection = ({ title, icon: Icon, stack, onAdd, onRemove }) => {
    const [newTech, setNewTech] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTech.trim()) {
            onAdd(title.toLowerCase().replace(/\s+/g, ''), newTech);
            setNewTech('');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-blue-400" />
                <label className="text-sm font-medium text-gray-200">{title}</label>
            </div>

            <div className="flex flex-wrap gap-2">
                {stack.map((tech) => (
                    <Badge
                        key={tech.id}
                        variant="secondary"
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 transition-colors text-gray-200 flex items-center gap-2"
                    >
                        {tech.text}
                        <div className="flex gap-1 ml-2">
                            <X
                                className="h-3 w-3 hover:text-red-400 cursor-pointer"
                                onClick={() => onRemove(title.toLowerCase().replace(/\s+/g, ''), tech.id)}
                            />
                        </div>
                    </Badge>
                ))}

                <form onSubmit={handleSubmit} className="relative">
                    <Input
                        value={newTech}
                        onChange={(e) => setNewTech(e.target.value)}
                        placeholder={`Add ${title} technology...`}
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
    );
};


const BudgetResources = () => {
    const [data, setData] = useState(initialData);
    const [editingState, setEditingState] = useState({ type: null, key: null });
    const [editValue, setEditValue] = useState('');
    const [showContent, setShowContent] = useState(true);
    const [newItemText, setNewItemText] = useState('');
    const addTechItem = (category, text) => {
        const newId = Math.max(...Object.values(data.techStack).flatMap(items => items.map(item => item.id)), 0) + 1;
        setData(prev => ({
            ...prev,
            techStack: {
                ...prev.techStack,
                [category]: [...prev.techStack[category], { id: newId, text }]
            }
        }));
    };

    const removeTechItem = (category, id) => {
        setData(prev => ({
            ...prev,
            techStack: {
                ...prev.techStack,
                [category]: prev.techStack[category].filter(item => item.id !== id)
            }
        }));
    };

    const handleEdit = (type, key, value) => {
        if (type === 'budget') {
            setData(prev => ({
                ...prev,
                budget: { ...prev.budget, [key]: value }
            }));
        }
    };

    const addResource = () => {
        if (!newItemText.trim()) return;
        const newId = Math.max(...data.resources.team.map(item => item.id), 0) + 1;
        setData(prev => ({
            ...prev,
            resources: {
                ...prev.resources,
                team: [...prev.resources.team, { id: newId, role: newItemText, emails: [] }]
            }
        }));
        setNewItemText('');
    };

    const deleteResource = (id) => {
        setData(prev => ({
            ...prev,
            resources: {
                ...prev.resources,
                team: prev.resources.team.filter(item => item.id !== id)
            }
        }));
    };

    const startEditing = (type, key, value) => {
        setEditingState({ type, key });
        setEditValue(value);
    };

    const saveEdit = () => {
        const { type, key } = editingState;
        handleEdit(type, key, editValue);
        setEditingState({ type: null, key: null });
        setEditValue('');
    };



    const addEmail = (resourceId, email) => {
        setData(prev => ({
            ...prev,
            resources: {
                ...prev.resources,
                team: prev.resources.team.map(item =>
                    item.id === resourceId
                        ? { ...item, emails: [...item.emails, email] }
                        : item
                )
            }
        }));
    };

    const removeEmail = (resourceId, email) => {
        setData(prev => ({
            ...prev,
            resources: {
                ...prev.resources,
                team: prev.resources.team.map(item =>
                    item.id === resourceId
                        ? { ...item, emails: item.emails.filter(e => e !== email) }
                        : item
                )
            }
        }));
    };

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-emerald-600 to-emerald-800" />
                    <h2 className="text-xl font-bold  bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Budget & Resources</h2>
                </div>
                <button
                    onClick={() => setShowContent(!showContent)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-200"
                >
                    {showContent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showContent ? 'Hide Details' : 'Show Details'}
                </button>
            </div>

            {showContent && (
                <div className="space-y-6">
                    {/* Budget Section */}
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Budget Overview</h3>
                        <div className="grid gap-4">
                            {Object.entries(data.budget).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                                    <span className="text-gray-300 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                    {editingState.type === 'budget' && editingState.key === key ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="w-32 bg-gray-700 text-gray-200"
                                            />
                                            <Button size="sm" variant="ghost" onClick={saveEdit} className="text-green-400">
                                                <Save className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setEditingState({ type: null, key: null })}
                                                className="text-gray-400"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-400 font-semibold">{value}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => startEditing('budget', key, value)}
                                                className="text-gray-400 hover:text-gray-200"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Team Resources Section */}
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="w-5 h-5 text-emerald-600" />
                            <h3 className="text-lg font-semibold  bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Team Resources</h3>
                        </div>
                        <div className="space-y-4">
                            {data.resources.team.map((resource) => (
                                <div key={resource.id} className="bg-gray-800 p-3 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">{resource.role}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteResource(resource.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <EmailBadges
                                        emails={resource.emails}
                                        onAddEmail={(email) => addEmail(resource.id, email)}
                                        onRemoveEmail={(email) => removeEmail(resource.id, email)}
                                    />
                                </div>
                            ))}
                            <div className="flex items-center gap-2 mt-4">
                                <Input
                                    placeholder="Add team role..."
                                    value={newItemText}
                                    onChange={(e) => setNewItemText(e.target.value)}
                                    className="bg-gray-800 text-gray-200"
                                    onKeyPress={(e) => e.key === 'Enter' && addResource()}
                                />
                                <Button
                                    onClick={addResource}
                                    className="bg-gradient-to-r  from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 hover:bg-black text-white transition-all duration-200"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Tech Stack Section */}

                </div>
            )}
        </div>
    );
};

export default BudgetResources;