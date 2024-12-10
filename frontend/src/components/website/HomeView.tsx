import React, { useEffect, useState } from "react";
import { CornerDownLeftIcon, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import ArchitectureDisplay from "./projectplan/ArchitectureDisplay";
import { useCoAgent } from "@copilotkit/react-core";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import { TechStackState } from "@/lib/types";
import NodeTasks from "./NodeTasks";
import { Switch } from '@/components/ui/switch';
import { CodeEditor } from "../code/code-editor";








const MAX_INPUT_LENGTH = 2000;

const languages = [
    { id: "1", name: "React/Express/Postgres", color: "from-yellow-500 to-yellow-600" },
    { id: "2", name: "Next.js/Express/MySQL", color: "from-blue-500 to-blue-600" },
    { id: "3", name: "Vue/NestJS/Postgres", color: "from-green-400 to-green-500" },
    { id: "4", name: "Angular/Spring Boot/OracleDB", color: "from-red-500 to-red-600" },
    { id: "5", name: "Svelte/FastAPI/MongoDB", color: "from-cyan-500 to-cyan-600" },
    { id: "6", name: "React/Laravel/MySQL", color: "from-purple-500 to-purple-600" },
    { id: "7", name: "Next.js/Django/SQLite", color: "from-blue-400 to-blue-500" },
    { id: "8", name: "Flutter/Firebase/Firestore", color: "from-orange-500 to-orange-600" },
    { id: "9", name: "ASP.NET Core/Blazor/SQL Server", color: "from-indigo-500 to-indigo-600" },
    { id: "10", name: "Nuxt.js/Express/MongoDB", color: "from-green-500 to-green-600" },
    { id: "11", name: "Ruby on Rails/Postgres", color: "from-red-400 to-red-500" },
    { id: "12", name: "Express/GraphQL/Redis", color: "from-gray-500 to-gray-600" },
    { id: "13", name: "Electron/Node.js/MySQL", color: "from-teal-500 to-teal-600" },
    { id: "14", name: "Swift/Vapor/Postgres", color: "from-pink-500 to-pink-600" },
    { id: "15", name: "Kotlin/Spring Boot/MongoDB", color: "from-blue-600 to-blue-700" }
];


const examples = [
    {
        "category": "Enterprise Solutions",
        "items": [
            { "title": "HR Management", "description": "Employee profiles, leave tracking, performance reviews, onboarding workflows, and employee self-service portals" },
            { "title": "Inventory System", "description": "Barcode scanning, stock alerts, supplier management, demand forecasting, and reorder automation" },
            { "title": "Document Management", "description": "Version control, OCR, collaboration, access permissions, and cloud storage integration" },
            { "title": "Asset Tracker", "description": "Equipment tracking, maintenance schedules, depreciation reports, and asset tagging" },
            { "title": "Meeting Scheduler", "description": "Room booking, calendar sync, notifications, meeting agenda templates, and attendee tracking" },
            { "title": "Expense Manager", "description": "Receipt scanning, approvals, reports, spending insights, and integration with accounting software" }
        ]
    },
    {
        "category": "Financial Tech",
        "items": [
            { "title": "Investment Portfolio", "description": "Stock tracking, analytics, alerts, portfolio optimization, and risk assessment" },
            { "title": "Crypto Exchange", "description": "Wallet integration, trading, charts, staking options, and compliance monitoring" },
            { "title": "Budget Planner", "description": "Bank sync, categorization, forecasting, savings goals, and expense tracking" },
            { "title": "Payment Gateway", "description": "Multiple providers, fraud detection, cross-border transactions, and custom checkout flows" },
            { "title": "Billing System", "description": "Invoicing, recurring payments, tax calculation, reminders, and payment reconciliation" },
            { "title": "Loan Manager", "description": "Applications, credit scoring, disbursement, repayment tracking, and delinquency alerts" }
        ]
    },
    {
        "category": "E-commerce & Retail",
        "items": [
            { "title": "Fashion Store", "description": "Size guide, wishlists, reviews, AI styling assistant, and personalized recommendations" },
            { "title": "Grocery Delivery", "description": "Fresh food, time slots, subscription, seasonal discounts, and order tracking" },
            { "title": "Auto Parts Store", "description": "Fitment search, diagrams, quotes, inventory tracking, and warranty integration" },
            { "title": "NFT Marketplace", "description": "Minting, auctions, galleries, royalties management, and smart contract integration" },
            { "title": "Restaurant POS", "description": "Table management, kitchen display, splits, menu customization, and billing integration" },
            { "title": "Rental Platform", "description": "Bookings, damage reports, deposits, rental agreements, and user reviews" }
        ]
    },
    {
        "category": "Healthcare",
        "items": [
            { "title": "Patient Portal", "description": "Appointments, records, prescriptions, test results, and doctor-patient messaging" },
            { "title": "Telemedicine App", "description": "Video calls, e-prescriptions, notes, appointment history, and integrated payment system" },
            { "title": "Lab Management", "description": "Test tracking, results, reporting, inventory management, and billing integration" },
            { "title": "Mental Health", "description": "Mood tracking, exercises, therapist chat, crisis support, and community forums" },
            { "title": "Fitness Platform", "description": "Workout plans, progress tracking, nutrition, wearables integration, and community challenges" },
            { "title": "Pharmacy System", "description": "Inventory, prescriptions, insurance, delivery management, and supplier tracking" }
        ]
    },
    {
        "category": "Education & Learning",
        "items": [
            { "title": "Virtual Classroom", "description": "Live sessions, assignments, grades, attendance tracking, and group activities" },
            { "title": "Language Learning", "description": "Lessons, flashcards, speech recognition, gamified quizzes, and progress milestones" },
            { "title": "Coding Platform", "description": "IDE, assessments, code review, live debugging, and pair programming features" },
            { "title": "Study Group App", "description": "Discussion, file sharing, scheduling, shared task lists, and real-time polls" },
            { "title": "Library System", "description": "Cataloging, reservations, digital loans, overdue notifications, and book reviews" },
            { "title": "Quiz Platform", "description": "Question banks, analytics, certificates, timed quizzes, and leaderboard functionality" }
        ]
    },
    {
        "category": "Media & Entertainment",
        "items": [
            { "title": "Video Streaming", "description": "Recommendations, continue watching, favorites, parental controls, and subtitles" },
            { "title": "Podcast Platform", "description": "Episodes, subscriptions, downloads, playlists, and user-generated content" },
            { "title": "Music Studio", "description": "Recording, effects, collaboration, mixing tools, and sound libraries" },
            { "title": "Photo Editor", "description": "Filters, layers, sharing, AI-based retouching, and batch processing" },
            { "title": "Game Platform", "description": "Achievements, leaderboards, multiplayer, game streaming, and cross-platform play" },
            { "title": "Event Manager", "description": "Ticket sales, seating, check-in, attendee analytics, and vendor management" }
        ]
    },
    {
        "category": "AI & Analytics",
        "items": [
            { "title": "AI Content Writer", "description": "Templates, SEO analysis, editing, tone adjustments, and content summaries" },
            { "title": "Data Dashboard", "description": "Visualizations, reports, exports, KPI tracking, and anomaly detection" },
            { "title": "Chat Assistant", "description": "NLP, knowledge base, integrations, multilingual support, and conversational analytics" },
            { "title": "Image Recognition", "description": "Object detection, classification, training, custom models, and real-time analytics" },
            { "title": "Text Analytics", "description": "Sentiment, topics, trends, keyword extraction, and summarization" },
            { "title": "Predictive Analytics", "description": "Forecasting, patterns, alerts, real-time data feeds, and recommendation engines" }
        ]
    }
];

export function SolutionHub({ createProject }) {
    const [projectInput, setProjectInput] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]); // Set default language
    const [isAdvancedMode, setIsAdvancedMode] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);

    const {
        run: agentrun,
        state: coagent,
        stop,
        setState,
        nodeName,
        running,
    } = useCoAgent({
        name: "gather_info",
        initialState: {
            user_input: "",
        },
    });

    const handleGatherInfo = (query) => {
        // agentrun(() => {
        //     return new TextMessage({
        //         role: MessageRole.User,
        //         content: "added user query",
        //     });
        // });

        createProject();
    };

    const handleExampleClick = (title, description) => {
        const query = isAdvancedMode
            ? `Language: ${selectedLanguage.name}\n\nProject: ${title}\nFeatures:\n- ${description.split(", ").join("\n- ")}`
            : `Language: ${languages[0].name} \n\nProject: ${title}\nFeatures:\n- ${description.split(", ").join("\n- ")}`;
        setProjectInput(query);
        setState({ ...coagent, user_input: query });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-7xl mx-auto space-y-8"
            >
                {/* Header Section */}
                <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-4xl font-bold text-white">Build Your Dream Project</h1>
                    <p className="text-emerald-400">Explore industry-specific solutions tailored to your needs</p>

                    {/* Advanced Mode Toggle */}
                    <div className="flex items-center justify-center gap-2">
                        <Switch
                            checked={isAdvancedMode}
                            onCheckedChange={setIsAdvancedMode}
                            className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-600 "
                        />
                        <span className="text-sm text-gray-400">
                            Advanced Mode
                        </span>
                    </div>
                </motion.div>

                {/* Language Selection - Only visible in advanced mode */}
                <AnimatePresence>
                    {isAdvancedMode && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="flex flex-wrap gap-3 justify-center mb-8">
                                {languages.map((lang) => (
                                    <motion.button
                                        key={lang.id}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedLanguage(lang)}
                                        disabled={running}
                                        className={`px-4 py-2 rounded-full font-medium transition-all duration-300 
                                            ${selectedLanguage?.id === lang.id
                                                ? `bg-gradient-to-r ${lang.color} text-white`
                                                : 'bg-gray-800 text-gray-400 hover:text-white'} 
                                            ${running ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {lang.name}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Project Input Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-800/50 backdrop-blur-lg rounded-lg border border-gray-700 p-4 mb-8"
                >
                    <Textarea
                        value={projectInput}
                        onChange={(e) => {
                            setProjectInput(e.target.value)
                            setState({ ...coagent, user_input: e.target.value });
                        }}
                        disabled={running}
                        placeholder={isAdvancedMode
                            ? "Select a template below or describe your project requirements with specific technical details..."
                            : "Select a template below or describe what you want to build..."}
                        className={cn(
                            "bg-transparent border-0 text-white placeholder:text-gray-500 min-h-[200px] mb-4 focus-visible:ring-0",
                            running ? "opacity-50" : ""
                        )}
                    />
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">
                            {projectInput.length} / {MAX_INPUT_LENGTH}
                        </span>
                        {projectInput && (
                            <Button
                                onClick={() => handleGatherInfo(projectInput)}
                                disabled={running}
                                size="sm"
                                className={cn(
                                    "bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white transition-all duration-300",
                                    {
                                        "opacity-0 pointer-events-none": !projectInput,
                                        "opacity-100": projectInput,
                                        "opacity-50 cursor-not-allowed": running
                                    }
                                )}
                            >
                                {running ? (
                                    <>
                                        Processing
                                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        Generate Project
                                        <CornerDownLeftIcon className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Examples Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {examples.map((category, categoryIndex) => (
                        <motion.div
                            key={category.category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: categoryIndex * 0.1 }}
                            className="bg-gray-800/30 rounded-lg p-4"
                        >
                            <h3 className="text-white font-medium mb-3 flex items-center gap-2 pb-2 border-b border-gray-700">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                {category.category}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {category.items.map((item, index) => (
                                    <motion.button
                                        key={item.title}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            transition: { delay: (categoryIndex * 0.1) + (index * 0.05) }
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleExampleClick(item.title, item.description)}
                                        disabled={running}
                                        className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200
                                            ${!running
                                                ? 'bg-gray-700/50 text-emerald-400 hover:bg-gray-600/50 cursor-pointer'
                                                : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'}`}
                                        title={item.description}
                                    >
                                        {item.title}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <NodeTasks nodeName={nodeName} />
            </motion.div>
        </div>
    );
}




function AppContainer(user) {
    const [currentView, setCurrentView] = useState('solutions');

    const agent = useCoAgent<TechStackState>({
        name: "gather_info",
        initialState: {
            user_input: "",
        },

    });

    useEffect(() => {
        if (agent.state?.use_cases) {
            setCurrentView('scopeProject');
            // console.log(agent.state.use_cases)
        }
    }, [agent.state]);

    return (
        <AnimatePresence mode="wait">
            {(() => {
                switch (currentView) {

                    case 'solutions':
                        return (
                            <SolutionHub key="solutions" createProject={() => setCurrentView("coding")} />
                        );
                    case 'scopeProject':
                        return (
                            <ArchitectureDisplay key="scopeProject"
                                onNavigateToProjects={() => setCurrentView('solutions')}
                                createProject={() => setCurrentView("coding")}


                            />
                        );
                    case 'coding':
                        return (
                            < CodeEditor key="coding"
                                onNavigateToProjects={() => setCurrentView('solutions')}
                            />
                        );
                    default:
                        return null;
                }
            })()}
        </AnimatePresence>
    );
}


export default AppContainer;