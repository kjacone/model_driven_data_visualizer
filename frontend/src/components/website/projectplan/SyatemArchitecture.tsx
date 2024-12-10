import React, { useEffect, useState } from 'react';
import {
    Users,
    Monitor,
    Server,
    Database,
    Cloud,
    Shield,
    Lock,
    Globe,
    Zap,
    Settings,
    MessageSquare,
    AlertTriangle,
    Mail,
    Search,
    BarChart,
    HardDrive,
    Cpu,
    Box,
    Info,
    X,
    Eye,
    EyeOff,
    Edit2,
    Plus,
    Save
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import Mermaid from './MerMaid';

const ArchitectureComponent = ({ icon: Icon, title, description, type, onClick, isActive }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div
                        className={`
                            relative p-4 rounded-lg border-2 
                            ${isActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-800'} 
                            hover:border-blue-400 transition-all cursor-pointer
                        `}
                        onClick={onClick}
                    >
                        <div className="flex flex-col items-center gap-2 text-center">
                            <Icon className={`w-8 h-8 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                            <span className="text-sm font-medium text-gray-200">{title}</span>
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                    <div className="p-2">
                        <h4 className="font-semibold text-sm mb-1">{title}</h4>
                        <p className="text-xs text-gray-400">{description}</p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};



const SystemArchitecture = () => {
    const [activeComponent, setActiveComponent] = useState(null);
    const [showDetails, setShowDetails] = useState(true);
    const [showMermaidDiagram, setShowMermaidDiagram] = useState(false);
    const [componentDetails, setComponentDetails] = useState({});
    const [diagramKey, setDiagramKey] = useState(0);


    useEffect(() => {
        if (showMermaidDiagram) {
            setDiagramKey(prev => prev + 1);
        }
    }, [activeComponent, showMermaidDiagram]);


    const handleComponentClick = (component) => {
        setActiveComponent(component);
        if (!showMermaidDiagram) {
            setShowMermaidDiagram(true);
        }
    };


    const generateSystemDiagram = (component) => {
        let diagram = 'flowchart TB\n';

        // Base styling
        diagram += `
        classDef client fill:#3b82f6,stroke:#1d4ed8,color:#fff
        classDef api fill:#10b981,stroke:#059669,color:#fff
        classDef service fill:#8b5cf6,stroke:#6d28d9,color:#fff
        classDef infrastructure fill:#ef4444,stroke:#dc2626,color:#fff\n`;

        // Generate component-specific diagrams
        switch (component) {
            case 'web':
                diagram += `
        subgraph Client ["Web Application Flow"]
            A["Browser"] --> B["CDN/Assets"]
            B --> C["React App"]
            C --> D["State Management"]
            D --> E["API Calls"]
            E --> F["Cache Layer"]
        end
        class A,B,C,D,E,F client`;
                break;

            case 'gateway':
                diagram += `
        subgraph API ["API Gateway Flow"]
            A["Client Request"] --> B["API Gateway"]
            B --> C["Rate Limiter"]
            C --> D{"Auth Check"}
            D -->|"Valid"| E["Route Handler"]
            D -->|"Invalid"| F["Error Response"]
            E --> G["Service Router"]
            G --> H["Load Balancer"]
        end
        class A,B,C,D,E,F,G,H api`;
                break;

            case 'auth':
                diagram += `
        subgraph Auth ["Authentication Flow"]
            A["Login Request"] --> B["Auth Service"]
            B --> C{"Validate"}
            C -->|"Valid"| D["Generate JWT"]
            C -->|"Invalid"| E["Error"]
            D --> F["Redis Cache"]
            D --> G["Return Token"]
        end
        class A,B,C,D,E,F,G api`;
                break;

            case 'users':
                diagram += `
        subgraph Users ["User Service Flow"]
            A["Request"] --> B["User Service"]
            B --> C["Cache Check"]
            C -->|"Cache Miss"| D["Database"]
            D --> E["Update Cache"]
            C -->|"Cache Hit"| F["Response"]
            E --> F
        end
        class A,B,C,D,E,F service`;
                break;

            case 'database':
                diagram += `
        subgraph DB ["Database Architecture"]
            A["Primary DB"] --> B["Read Replica 1"]
            A --> C["Read Replica 2"]
            D["Write Operations"] --> A
            E["Read Operations"] --> B
            E --> C
            F["Backup Service"] --> A
        end
        class A,B,C,D,E,F infrastructure`;
                break;

            case 'cache':
                diagram += `
        subgraph Cache ["Cache Layer"]
            A["Request"] --> B{"Cache Check"}
            B -->|"Miss"| C["Get from DB"]
            C --> D["Update Cache"]
            D --> E["Response"]
            B -->|"Hit"| E
        end
        class A,B,C,D,E infrastructure`;
                break;

            case 'monitoring':
                diagram += `
        subgraph Monitoring ["Monitoring System"]
            A["Metrics Collection"] --> B["Processing"]
            B --> C["Time Series DB"]
            C --> D["Alerting"]
            C --> E["Dashboards"]
            D --> F["Notifications"]
        end
        class A,B,C,D,E,F infrastructure`;
                break;

            default:
                // Default system overview
                diagram += `
        subgraph CL ["Client Layer"]
            Web["Web App"]
            Mobile["Mobile App"]
        end
    
        subgraph AL ["API Layer"]
            Gateway["API Gateway"]
            Auth["Auth Service"]
        end
    
        subgraph SL ["Service Layer"]
            Users["User Service"]
            Notifications["Notification Service"]
            Search["Search Service"]
        end
    
        subgraph IL ["Infrastructure"]
            DB[(Database)]
            Cache[(Cache)]
            Storage[(Storage)]
        end
    
        Web & Mobile --> Gateway
        Gateway --> Auth
        Gateway --> Users & Notifications & Search
        Users & Notifications & Search --> DB
        Users & Search --> Cache
        Notifications --> Storage
    
        class Web,Mobile client
        class Gateway,Auth api
        class Users,Notifications,Search service
        class DB,Cache,Storage infrastructure`;
        }

        return diagram;
    };

    const handleUpdateDetails = (component, newDetails) => {
        setComponentDetails(prev => ({
            ...prev,
            [component]: newDetails
        }));
    };





    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setShowMermaidDiagram(!showMermaidDiagram)}
                        className="flex items-center gap-2 bg-gray-800 border-gray-700 hover:bg-gray-700"
                    >
                        {showMermaidDiagram ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showMermaidDiagram ? 'Hide System Diagram' : 'Show System Diagram'}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center gap-2 bg-gray-800 border-gray-700 hover:bg-gray-700"
                    >
                        <Info className="w-4 h-4" />
                        {showDetails ? 'Hide Details' : 'Show Details'}
                    </Button>
                </div>
            </div>

            {/* Mermaid Diagram Card */}
            {showMermaidDiagram && (
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-blue-400">
                            {activeComponent ? `${activeComponent.charAt(0).toUpperCase() + activeComponent.slice(1)} Flow` : 'System Overview'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gray-900 p-4 rounded-lg">

                            <Mermaid key={diagramKey} chart={generateSystemDiagram(activeComponent)} />

                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Interactive Architecture Components */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold text-blue-400 flex items-center gap-2">
                        <Box className="w-6 h-6" />
                        Interactive System Architecture
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        {/* Architecture Grid */}
                        <div className="grid grid-cols-4 gap-8 mb-6">
                            {/* Client Layer */}
                            <div className="space-y-4">
                                <Alert className="bg-blue-500/10 border border-blue-500/20">
                                    <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                                        <Monitor className="w-4 h-4" />
                                        Client Layer
                                    </h3>
                                    <AlertDescription className="text-xs text-gray-400 mt-1">
                                        User-facing applications and interfaces
                                    </AlertDescription>
                                </Alert>
                                <div className="space-y-4">
                                    <ArchitectureComponent
                                        icon={Monitor}
                                        title="Web Application"
                                        description="React-based SPA with TypeScript and Tailwind CSS"
                                        type="client"
                                        isActive={activeComponent === 'web'}
                                        onClick={() => handleComponentClick('web')}
                                    />
                                    <ArchitectureComponent
                                        icon={Globe}
                                        title="Mobile Apps"
                                        description="React Native apps for iOS and Android"
                                        type="client"
                                        isActive={activeComponent === 'mobile'}
                                        onClick={() => handleComponentClick('mobile')}
                                    />
                                </div>
                            </div>

                            {/* API Layer */}
                            <div className="space-y-4">
                                <Alert className="bg-green-500/10 border border-green-500/20">
                                    <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        API Layer
                                    </h3>
                                    <AlertDescription className="text-xs text-gray-400 mt-1">
                                        Gateway and communication interfaces
                                    </AlertDescription>
                                </Alert>
                                <div className="space-y-4">
                                    <ArchitectureComponent
                                        icon={Shield}
                                        title="API Gateway"
                                        description="AWS API Gateway with rate limiting and authentication"
                                        type="api"
                                        isActive={activeComponent === 'gateway'}
                                        onClick={() => handleComponentClick('gateway')}
                                    />
                                    <ArchitectureComponent
                                        icon={Lock}
                                        title="Auth Service"
                                        description="OAuth2/JWT-based authentication and authorization"
                                        type="api"
                                        isActive={activeComponent === 'auth'}
                                        onClick={() => handleComponentClick('auth')}
                                    />
                                    <ArchitectureComponent
                                        icon={Zap}
                                        title="GraphQL API"
                                        description="Apollo Server with type-safe schema"
                                        type="api"
                                        isActive={activeComponent === 'graphql'}
                                        onClick={() => handleComponentClick('graphql')}
                                    />
                                </div>
                            </div>

                            {/* Service Layer */}
                            <div className="space-y-4">
                                <Alert className="bg-purple-500/10 border border-purple-500/20">
                                    <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                                        <Server className="w-4 h-4" />
                                        Service Layer
                                    </h3>
                                    <AlertDescription className="text-xs text-gray-400 mt-1">
                                        Core business logic and functionality
                                    </AlertDescription>
                                </Alert>
                                <div className="space-y-4">
                                    <ArchitectureComponent
                                        icon={Users}
                                        title="User Service"
                                        description="User management and profiles"
                                        type="service"
                                        isActive={activeComponent === 'users'}
                                        onClick={() => handleComponentClick('users')}
                                    />
                                    <ArchitectureComponent
                                        icon={MessageSquare}
                                        title="Notification Service"
                                        description="Push notifications and email delivery"
                                        type="service"
                                        isActive={activeComponent === 'notifications'}
                                        onClick={() => handleComponentClick('notifications')}
                                    />
                                    <ArchitectureComponent
                                        icon={Search}
                                        title="Search Service"
                                        description="Elasticsearch-based search functionality"
                                        type="service"
                                        isActive={activeComponent === 'search'}
                                        onClick={() => handleComponentClick('search')}
                                    />
                                    <ArchitectureComponent
                                        icon={BarChart}
                                        title="Analytics Service"
                                        description="User behavior and system metrics analysis"
                                        type="service"
                                        isActive={activeComponent === 'analytics'}
                                        onClick={() => handleComponentClick('analytics')}
                                    />
                                </div>
                            </div>

                            {/* Infrastructure Layer */}
                            <div className="space-y-4">
                                <Alert className="bg-red-500/10 border border-red-500/20">
                                    <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider flex items-center gap-2">
                                        <Database className="w-4 h-4" />
                                        Infrastructure
                                    </h3>
                                    <AlertDescription className="text-xs text-gray-400 mt-1">
                                        Data storage and system resources
                                    </AlertDescription>
                                </Alert>
                                <div className="space-y-4">
                                    <ArchitectureComponent
                                        icon={Database}
                                        title="Primary Database"
                                        description="PostgreSQL with read replicas"
                                        type="infrastructure"
                                        isActive={activeComponent === 'database'}
                                        onClick={() => handleComponentClick('database')}
                                    />
                                    <ArchitectureComponent
                                        icon={Cpu}
                                        title="Cache Layer"
                                        description="Redis for caching and session management"
                                        type="infrastructure"
                                        isActive={activeComponent === 'cache'}
                                        onClick={() => handleComponentClick('cache')}
                                    />
                                    <ArchitectureComponent
                                        icon={HardDrive}
                                        title="File Storage"
                                        description="S3 buckets for file storage and CDN"
                                        type="infrastructure"
                                        isActive={activeComponent === 'storage'}
                                        onClick={() => handleComponentClick('storage')}
                                    />
                                    <ArchitectureComponent
                                        icon={AlertTriangle}
                                        title="Monitoring"
                                        description="ELK Stack for logging and monitoring"
                                        type="infrastructure"
                                        isActive={activeComponent === 'monitoring'}
                                        onClick={() => handleComponentClick('monitoring')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Component Details Panel */}
                        {showDetails && activeComponent && (
                            <Card className="mt-6 bg-gray-700/50 border-gray-600">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg font-semibold text-blue-400">Component Details</CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setActiveComponent(null);
                                            setDiagramKey(prev => prev + 1); // Refresh when closing details
                                        }}
                                        className="text-gray-400"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <ComponentDetails
                                        component={activeComponent}
                                        onUpdate={handleUpdateDetails}
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};


const ComponentDetails = ({ component, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableDetails, setEditableDetails] = useState({});

    const details = {
        web: {
            title: "Web Application",
            technologies: ["React", "TypeScript", "Tailwind CSS", "Redux Toolkit"],
            features: ["Server-side rendering", "Progressive Web App", "Responsive Design"],
            security: ["CSP Headers", "HTTPS Only", "XSS Protection"],
            scalability: ["CDN Integration", "Code Splitting", "Asset Optimization"]
        },
        mobile: {
            title: "Mobile Apps",
            technologies: ["React Native", "TypeScript", "Native Modules"],
            features: ["Offline Support", "Push Notifications", "Native Performance"],
            security: ["Biometric Authentication", "Secure Storage", "Certificate Pinning"],
            scalability: ["Code Sharing", "Dynamic Updates", "Performance Monitoring"]
        }
        // ... other components
    };

    useEffect(() => {
        setEditableDetails(details[component] || {
            title: "Select a component",
            technologies: [],
            features: [],
            security: [],
            scalability: []
        });
    }, [component]);

    const handleEdit = (category, index, value) => {
        setEditableDetails(prev => ({
            ...prev,
            [category]: prev[category].map((item, i) => i === index ? value : item)
        }));
    };

    const handleAdd = (category) => {
        setEditableDetails(prev => ({
            ...prev,
            [category]: [...prev[category], "New Item"]
        }));
    };

    const handleRemove = (category, index) => {
        setEditableDetails(prev => ({
            ...prev,
            [category]: prev[category].filter((_, i) => i !== index)
        }));
    };

    const saveChanges = () => {
        onUpdate?.(component, editableDetails);
        setIsEditing(false);
    };

    const renderEditableList = (title, category, items) => (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-400">{title}</h4>
                {isEditing && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAdd(category)}
                        className="text-green-400 hover:text-green-300"
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                )}
            </div>
            <ul className="mt-1 space-y-2">
                {items?.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        {isEditing ? (
                            <div className="flex-1 flex items-center gap-2">
                                <Input
                                    value={item}
                                    onChange={(e) => handleEdit(category, index, e.target.value)}
                                    className="flex-1 h-7 text-sm bg-gray-800 text-gray-200"
                                />
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemove(category, index)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ) : (
                            <span className="text-sm text-gray-300">{item}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-400">{editableDetails.title}</h3>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={saveChanges}
                                className="text-green-400 hover:text-green-300"
                            >
                                <Save className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setIsEditing(false)}
                                className="text-gray-400 hover:text-gray-300"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsEditing(true)}
                            className="text-gray-400 hover:text-gray-300"
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    {renderEditableList("Technologies", "technologies", editableDetails.technologies)}
                    {renderEditableList("Features", "features", editableDetails.features)}
                </div>
                <div className="space-y-4">
                    {renderEditableList("Security", "security", editableDetails.security)}
                    {renderEditableList("Scalability", "scalability", editableDetails.scalability)}
                </div>
            </div>
        </div>
    );
};



export default SystemArchitecture;