import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2, Check, X, ChevronDown, ChevronRight, Info, FactoryIcon, Eye, EyeOff } from 'lucide-react';
import Mermaid from '@/components/website/projectplan/MerMaid';

// ... [Previous diagram generation functions remain the same] ...

const UserFlowComponent = () => {
    const [activeTab, setActiveTab] = useState('overview');





    const [flows, setFlows] = useState([
        {
            id: 1,
            flow: "Browsing and Searching",
            steps: [
                "Homepage",
                "Categories/Promotions",
                "Product Search/Filter",
                "Product Details Page"
            ],
            goal: "Help users quickly find desired products.",
            showDiagram: false
        },
        {
            id: 2,
            flow: "Adding to Cart",
            steps: [
                "Product Details Page",
                "Add to Cart Button",
                "Cart Page",
                "Proceed to Checkout"
            ],
            goal: "Provide a clear and easy process for users to add items.",
            showDiagram: false
        },
        {
            id: 3,
            flow: "Checkout",
            steps: [
                "Cart Page",
                "Login/Guest Checkout",
                "Enter Shipping Information",
                "Select Payment Method",
                "Confirm Order"
            ],
            goal: "Minimize steps and reduce friction.",
            showDiagram: false
        }
    ]);

    const [showOverviewDiagram, setShowOverviewDiagram] = useState(false);

    const generateOverviewDiagram = (flows) => {
        let diagram = 'flowchart TB\n';
        diagram += '    classDef default fill:#2563eb,stroke:#1d4ed8,color:white\n';
        diagram += '    classDef highlight fill:#059669,stroke:#047857,color:white\n\n';

        flows.forEach((flow, index) => {
            diagram += `    subgraph ${flow.flow.replace(/\s+/g, '')} ["${flow.flow}"]\n`;
            flow.steps.forEach((step, stepIndex) => {
                const stepId = `${flow.flow.replace(/\s+/g, '')}${stepIndex}`;
                diagram += `        ${stepId}["${step}"]\n`;
                if (stepIndex < flow.steps.length - 1) {
                    diagram += `        ${stepId} --> ${flow.flow.replace(/\s+/g, '')}${stepIndex + 1}\n`;
                }
            });
            diagram += '    end\n';

            if (index < flows.length - 1) {
                const currentLastStep = `${flow.flow.replace(/\s+/g, '')}${flow.steps.length - 1}`;
                const nextFirstStep = `${flows[index + 1].flow.replace(/\s+/g, '')}0`;
                diagram += `    ${currentLastStep} --> ${nextFirstStep}\n`;
            }
        });

        return diagram;
    };

    const generateDetailedDiagram = (flow) => {
        let diagram = 'flowchart TB\n';
        diagram += '    classDef default fill:#2563eb,stroke:#1d4ed8,color:white\n';

        // Example diagrams for different flows
        if (flow.flow === "Browsing and Searching") {
            diagram += `
    Home["Homepage"] --> Categories["Categories"]
    Home --> Search["Search Products"]
    Categories --> Results["Search Results"]
    Search --> Results
    Results --> Details["Product Details"]
    Details --> |"Back to Search"| Search
    Details --> |"Continue Shopping"| Categories`;
        }
        else if (flow.flow === "Adding to Cart") {
            diagram += `
    Product["Product Page"] --> AddCart["Add to Cart"]
    AddCart --> CartView["Cart Summary"]
    CartView --> |"Update Quantity"| CartView
    CartView --> |"Continue Shopping"| Product
    CartView --> Checkout["Proceed to Checkout"]`;
        }
        else if (flow.flow === "Checkout") {
            diagram += `
    Cart["Cart Page"] --> Auth{"Login/Guest?"}
    Auth --> |"Guest"| Guest["Guest Checkout"]
    Auth --> |"Login"| Login["User Login"]
    Guest --> Shipping["Shipping Info"]
    Login --> Shipping
    Shipping --> Payment["Payment Method"]
    Payment --> Review["Review Order"]
    Review --> Confirm["Place Order"]`;
        }

        return diagram;
    };

    const toggleDiagram = (id) => {
        setFlows(flows.map(flow =>
            flow.id === id ? { ...flow, showDiagram: !flow.showDiagram } : flow
        ));
    };

    const handleEdit = (id) => {
        setFlows(flows.map(flow =>
            flow.id === id ? { ...flow, isEditing: !flow.isEditing } : flow
        ));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this flow?')) {
            setFlows(flows.filter(flow => flow.id !== id));
        }
    };

    const handleSave = (id, updatedFlow) => {
        setFlows(flows.map(flow =>
            flow.id === id ? { ...updatedFlow, isEditing: false } : flow
        ));
    };

    const SystemOverview = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <FactoryIcon className="w-6 h-6 text-blue-400" />
                        <h2 className="text-xl font-bold text-blue-400">System Overview</h2>
                    </div>
                    <button
                        onClick={() => setShowOverviewDiagram(!showOverviewDiagram)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                        {showOverviewDiagram ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showOverviewDiagram ? 'Hide Diagram' : 'Show Diagram'}
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-6">
                    {flows.map((flow, index) => (
                        <div key={flow.id} className="bg-gray-700/50 p-4 rounded-lg">
                            <div className="flex items-start gap-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                                    {index + 1}
                                </span>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-200">{flow.flow}</h3>
                                    <p className="text-gray-400 text-sm mt-1">{flow.goal}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {flow.steps.map((step, stepIndex) => (
                                            <div key={stepIndex} className="flex items-center gap-2 text-gray-300 text-sm">
                                                {stepIndex > 0 && <ChevronRight className="w-4 h-4 text-gray-500" />}
                                                <span className="bg-gray-800 px-3 py-1 rounded">{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {showOverviewDiagram && (
                    <div className="bg-gray-900 rounded-lg p-4 shadow-inner overflow-x-auto">
                        <Mermaid chart={generateOverviewDiagram(flows)} />
                    </div>
                )}
            </div>
        </div>
    );

    const FlowItem = ({ flow }) => {
        const [isExpanded, setIsExpanded] = useState(true);
        const [editedFlow, setEditedFlow] = useState({ ...flow });

        return (
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-gray-400 hover:text-gray-300"
                            >
                                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </button>
                            <div>
                                <h3 className="text-xl font-bold text-blue-400">{flow.flow}</h3>
                                <div className="flex items-center gap-2 text-gray-400 mt-1">
                                    <Info className="w-4 h-4" />
                                    <p>{flow.goal}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleEdit(flow.id)}
                                className="p-2  bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 hover:bg-black text-white transition-all duration-200"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(flow.id)}
                                className="p-2 hover:bg-gray-700 rounded-full text-red-400 hover:text-red-300 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => toggleDiagram(flow.id)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm ml-2"
                            >
                                {flow.showDiagram ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                {flow.showDiagram ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    {flow.isEditing ? (
                        <div className="space-y-4 mt-4">
                            <input
                                type="text"
                                value={editedFlow.flow}
                                onChange={(e) => setEditedFlow({ ...editedFlow, flow: e.target.value })}
                                className="w-full bg-gray-700 text-gray-100 p-2 rounded"
                                placeholder="Flow Name"
                            />
                            <textarea
                                value={editedFlow.steps.join('\n')}
                                onChange={(e) => setEditedFlow({
                                    ...editedFlow,
                                    steps: e.target.value.split('\n').filter(step => step.trim())
                                })}
                                className="w-full bg-gray-700 text-gray-100 p-2 rounded min-h-[100px]"
                                placeholder="Steps (one per line)"
                            />
                            <input
                                type="text"
                                value={editedFlow.goal}
                                onChange={(e) => setEditedFlow({ ...editedFlow, goal: e.target.value })}
                                className="w-full bg-gray-700 text-gray-100 p-2 rounded"
                                placeholder="Goal"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSave(flow.id, editedFlow)}
                                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    Save
                                </button>
                                <button
                                    onClick={() => handleEdit(flow.id)}
                                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        isExpanded && (
                            <div className="mt-6">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Steps</h4>
                                        <ul className="space-y-3">
                                            {flow.steps.map((step, index) => (
                                                <li key={index} className="flex items-center gap-3 text-gray-300">
                                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm">
                                                        {index + 1}
                                                    </span>
                                                    {step}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {flow.showDiagram && (
                                        <div className="bg-gray-900 rounded-lg p-4 shadow-inner">
                                            <Mermaid chart={generateDetailedDiagram(flow)} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">User Flow Documentation</h1>
                    <button
                        onClick={() => {/* Add new flow handler */ }}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 hover:bg-black text-white transition-all duration-200 px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Add Flow
                    </button>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-700">
                        <nav className="flex gap-4">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`px-4 py-2 font-medium text-sm relative ${activeTab === 'overview'
                                    ? 'text-blue-400 border-b-2 border-blue-400'
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                System Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('flows')}
                                className={`px-4 py-2 font-medium text-sm relative ${activeTab === 'flows'
                                    ? 'text-blue-400 border-b-2 border-blue-400'
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                Individual Flows
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    {activeTab === 'overview' ? (
                        <SystemOverview />
                    ) : (
                        <div className="grid grid-cols-1 gap-8">
                            {flows.map(flow => (
                                <FlowItem key={flow.id} flow={flow} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserFlowComponent;