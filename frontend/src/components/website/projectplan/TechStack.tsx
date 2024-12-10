import React, { useEffect, useState } from "react";
import {
  Globe,
  Server,
  Database,
  Cloud,
  Check,
  Plus,
  X,
} from "lucide-react";
import { TechStackState } from "@/lib/types";
import { useCoAgent } from "@copilotkit/react-core";

const TechStack = () => {
  // Initialize with default empty structure
  const [stackSuggestions, setSuggestions] = useState({
    Frontend: [{ name: "Default", technologies: [] }],
    Backend: [{ name: "Default", technologies: [] }],
    Database: [{ name: "Default", technologies: [] }],
    DevOps: [{ name: "Default", technologies: [] }],
  });

  const agent = useCoAgent<TechStackState>({
    name: "gather_info"
  });

  useEffect(() => {
    // Only update if agent state contains valid tech_stack data
    if (agent.state?.tech_stack && Object.keys(agent.state.tech_stack).length > 0) {
      setSuggestions(agent.state.tech_stack);
    }
  }, [agent.state?.tech_stack]);

  const [techLayers, setTechLayers] = useState([
    {
      title: "Frontend",
      icon: Globe,
      color: "from-blue-500 to-blue-700",
      borderColor: "border-blue-400",
      shadowColor: "shadow-blue-500/20",
      currentStack: "",
      technologies: [],
    },
    {
      title: "Backend",
      icon: Server,
      color: "from-emerald-500 to-emerald-700",
      borderColor: "border-emerald-400",
      shadowColor: "shadow-emerald-500/20",
      currentStack: "",
      technologies: [],
    },
    {
      title: "Database",
      icon: Database,
      color: "from-purple-500 to-purple-700",
      borderColor: "border-purple-400",
      shadowColor: "shadow-purple-500/20",
      currentStack: "",
      technologies: [],
    },
    {
      title: "DevOps",
      icon: Cloud,
      color: "from-orange-500 to-orange-700",
      borderColor: "border-orange-400",
      shadowColor: "shadow-orange-500/20",
      currentStack: "",
      technologies: [],
    },
  ]);

  // Update techLayers when stackSuggestions changes
  useEffect(() => {
    setTechLayers(prevLayers => prevLayers.map(layer => ({
      ...layer,
      currentStack: stackSuggestions[layer.title]?.[0]?.name || "",
      technologies: stackSuggestions[layer.title]?.[0]?.technologies || [],
    })));
  }, [stackSuggestions]);

  const [newTech, setNewTech] = useState("");

  const switchStack = (layerIndex, newStack) => {
    const updatedLayers = [...techLayers];
    const layer = updatedLayers[layerIndex];
    const suggestions = stackSuggestions[layer.title] || [];
    const newStackData = suggestions.find((s) => s.name === newStack);

    if (newStackData) {
      layer.currentStack = newStack;
      layer.technologies = [...newStackData.technologies];
      setTechLayers(updatedLayers);
    }
  };

  const removeTechnology = (layerIndex, techIndex) => {
    setTechLayers(prevLayers => {
      const updatedLayers = [...prevLayers];
      const technologies = [...updatedLayers[layerIndex].technologies];
      technologies.splice(techIndex, 1);
      updatedLayers[layerIndex] = {
        ...updatedLayers[layerIndex],
        technologies,
      };
      return updatedLayers;
    });
  };

  const addTechnology = (layerIndex) => {
    if (!newTech.trim()) return;

    setTechLayers(prevLayers => {
      const updatedLayers = [...prevLayers];
      updatedLayers[layerIndex] = {
        ...updatedLayers[layerIndex],
        technologies: [...updatedLayers[layerIndex].technologies, newTech.trim()],
      };
      return updatedLayers;
    });
    setNewTech("");
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="w-full">
        <h1 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">
          Technology Stack
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {techLayers.map((layer, layerIndex) => {
            const Icon = layer.icon;
            const allStacks = stackSuggestions[layer.title] || [];

            return (
              <div key={layerIndex} className="relative group">
                <div
                  className={`
                    p-6 rounded-xl
                    bg-gradient-to-r ${layer.color}
                    border ${layer.borderColor} border-opacity-20
                    shadow-lg ${layer.shadowColor}
                    transition-all duration-300
                    hover:shadow-xl
                  `}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-black bg-opacity-30 rounded-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        {layer.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add technology..."
                        value={newTech}
                        onChange={(e) => setNewTech(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTechnology(layerIndex)}
                        className="px-3 py-1.5 rounded-lg bg-black bg-opacity-30 
                            border border-white border-opacity-10 text-sm text-white
                            placeholder-gray-400 focus:outline-none focus:ring-2 
                            focus:ring-white focus:ring-opacity-20"
                      />
                      <button
                        onClick={() => addTechnology(layerIndex)}
                        className="p-1.5 rounded-lg bg-black bg-opacity-30 
                            hover:bg-opacity-40 transition-colors text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-6">
                    {allStacks.map((stack, idx) => (
                      <button
                        key={idx}
                        onClick={() => switchStack(layerIndex, stack.name)}
                        className={`
                            relative flex-1 px-4 py-2 rounded-lg text-white
                            transition-all duration-200 
                            ${stack.name === layer.currentStack
                            ? `bg-white bg-opacity-20 border-2 ${layer.borderColor}`
                            : "bg-black bg-opacity-30 hover:bg-opacity-40 border-2 border-transparent"
                          }
                          `}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {stack.name}
                          </span>
                          {stack.name === layer.currentStack && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {layer.technologies.map((tech, techIndex) => (
                      <div
                        key={techIndex}
                        className={`
                            px-3 py-1.5 rounded-full
                            bg-black bg-opacity-30
                            flex items-center gap-2
                            group/tech text-white
                            hover:bg-opacity-40 transition-all duration-200
                            border border-white border-opacity-5
                          `}
                      >
                        <span className="text-sm font-medium">{tech}</span>
                        <button
                          onClick={() => removeTechnology(layerIndex, techIndex)}
                          className="opacity-60 hover:opacity-100 
                              transition-opacity duration-200 hover:text-red-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TechStack;