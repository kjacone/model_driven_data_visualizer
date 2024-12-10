import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ChevronRight, Menu,
    Target, Users, Box, Factory, GitBranch, DollarSign, Shield,
    Pencil,
    Wand2,
    Download,
    FileText,
    Ticket
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Separator } from '@radix-ui/react-dropdown-menu';
import BusinessGoalsDashboard from './BusinessGoalsCard';
import UserNeedsDashboard from './UserNeeds';
import FeaturesDashboard from './FeaturesDahsboard';
import UserFlowComponent from './UserFlow';
import ProjectRoadmap from './ProjectRoadmap';
import BudgetResources from './BudgetResources';
import ChallengesMitigation from './ChallengeMitigations';
import SystemArchitecture from './SyatemArchitecture';

const ProjectScopePage = ({ onNavigateToProjects }) => {
    const [activeSection, setActiveSection] = useState('all');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    // Sections and icons remain the same as your original code...
    const sections = {
        all: 'All Sections',
        businessGoals: 'Business Goals',
        userNeeds: 'User Needs',
        featuresAndFunctionality: 'Features',
        systemArchitecture: 'System Architecture',
        userFlows: 'User Flows',
        projectRoadmap: 'Project Roadmap',
        budgetAndResources: 'Budget & Resources',
        challengesAndMitigation: 'Challenges'
    };

    const sectionIcons = {
        businessGoals: Target,
        userNeeds: Users,
        featuresAndFunctionality: Box,
        systemArchitecture: Pencil,
        userFlows: Factory,
        projectRoadmap: GitBranch,
        budgetAndResources: DollarSign,
        challengesAndMitigation: Shield,
        all: Menu
    };

    const SideNavigation = ({ className = "" }) => (
        <div className={`bg-gradient-to-b from-gray-900 via-gray-900 to-emerald-950 text-gray-100 ${className}`}>
            <div className="p-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                            Project Scope
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">Define your project details</p>
                    </div>


                </div>

                <nav className="space-y-2">
                    {Object.entries(sections).map(([key, label]) => {
                        const IconComponent = sectionIcons[key] || Menu;
                        return (
                            <Button
                                key={key}
                                variant={activeSection === key ? "secondary" : "ghost"}
                                className={`w-full justify-start transition-all duration-200 group ${activeSection === key
                                    ? 'bg-emerald-950 text-emerald-200'
                                    : 'hover:bg-black/90 hover:text-emerald-300'
                                    }`}
                                onClick={() => {
                                    setActiveSection(key);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <IconComponent className={`h-4 w-4 mr-2 transition-colors ${activeSection === key
                                    ? 'text-emerald-400'
                                    : 'text-gray-400 group-hover:text-emerald-400'
                                    }`} />
                                {label}
                            </Button>
                        );
                    })}
                </nav>

                <Separator className="my-6 bg-emerald-800/30" />

                <div className="space-y-3">
                    <Button
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 hover:bg-black text-white transition-all duration-200"
                    >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Project
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full text-black border-emerald-800 hover:bg-black hover:text-emerald-300 transition-colors"
                    >
                        <Ticket className="h-4 w-4 mr-2" />
                        Create Tickets
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full text-black border-emerald-800 hover:bg-black hover:text-emerald-300 transition-colors"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Export Document
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-900 border-emerald-800">
                            <DropdownMenuItem className="hover:bg-black cursor-pointer group">
                                <FileText className="h-4 w-4 mr-2 group-hover:text-emerald-400" />
                                <span className="group-hover:text-emerald-300">Export as PDF</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-black cursor-pointer group">
                                <Box className="h-4 w-4 mr-2 group-hover:text-emerald-400" />
                                <span className="group-hover:text-emerald-300">Export as PPT</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );

    const renderSection = (section) => {
        if (activeSection !== 'all' && activeSection !== section) return null;

        switch (section) {
            case 'businessGoals':
                return (
                    <BusinessGoalsDashboard

                    />
                );

            case 'userNeeds':
                return (
                    <UserNeedsDashboard />
                );

            case 'featuresAndFunctionality':
                return (
                    <FeaturesDashboard />
                );

            case 'systemArchitecture':
                return (
                    <SystemArchitecture />
                );

            case 'userFlows':
                return (
                    <UserFlowComponent />
                );

            case 'projectRoadmap':
                return (
                    <ProjectRoadmap />
                );

            case 'budgetAndResources':
                return (
                    <BudgetResources />
                );

            case 'challengesAndMitigation':
                return (
                    <ChallengesMitigation />
                );

            default:
                return null;
        }
    };


    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        className="lg:hidden fixed top-4 left-4 z-50"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-gray-900 border-gray-800">
                    <SideNavigation />
                </SheetContent>
            </Sheet>

            <div className="flex">
                {/* Desktop Side Navigation */}
                <SideNavigation className="hidden lg:block w-64 min-h-screen sticky top-0" />

                {/* Main Content */}
                <div className="flex-1">
                    {/* Top Navigation Bar */}


                    {/* Breadcrumbs */}
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center text-sm text-gray-400">
                            <span>Project Scope</span>
                            {activeSection !== 'all' && (
                                <>
                                    <ChevronRight className="h-4 w-4 mx-2" />
                                    <span>{sections[activeSection]}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="container mx-auto px-4 py-6">
                        <ScrollArea className="h-[calc(100vh-12rem)]">
                            <div className="space-y-6" >
                                {Object.keys(sections)
                                    .filter(section => section !== 'all')
                                    .map((section, index) => (
                                        <div key={index} className="space-y-6" >
                                            {renderSection(section)}
                                        </div>
                                    ))
                                }
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectScopePage;