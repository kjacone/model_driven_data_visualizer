import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Bot, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  Plus,
  Sparkles,
  Layers
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ProjectPlanComponent = ({ 
  showRequirements,
  requirementOptions,
  requirements,
  setRequirements,
  expandedSections,
  toggleSection,
  onGenerateTechnical,
  onBack 
}) => {
  const [customInput, setCustomInput] = useState('');

  const handleAddCustomRequirement = (e) => {
    e.preventDefault();
    // Add custom requirement handling logic here
  };

  if (!showRequirements) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700 max-w-2xl">
          <CardContent className="p-8 text-center">
            <Bot className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-xl text-gray-100 mb-2">
              Tell me what you want to build!
            </h2>
            <p className="text-gray-400">
              I'll help break down your project into simple, manageable
              pieces. Try the suggestions in the chat or type your own idea!
              💡
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-100">
            Your Project Plan
          </CardTitle>
          <CardDescription className="text-gray-300">
            I've outlined what you'll need based on your requirements. Click
            each section to explore! 🎯
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(requirementOptions).map(
            ([category, { icon, title, description, options }]) => (
              <Card key={category} className="bg-gray-800/50 border-gray-700">
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-700/50"
                  onClick={() => toggleSection(category)}
                >
                  <div className="flex items-center gap-3">
                    {icon}
                    <div>
                      <h3 className="font-semibold text-gray-100">{title}</h3>
                      <p className="text-sm text-gray-400">{description}</p>
                    </div>
                  </div>
                  {expandedSections[category] ? (
                    <ChevronDown className="text-gray-400" />
                  ) : (
                    <ChevronRight className="text-gray-400" />
                  )}
                </div>

                {expandedSections[category] && (
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {options.map((option) => (
                        <TooltipProvider key={option.name}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                className={`cursor-pointer ${
                                  requirements[category]?.includes(option.name)
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : "bg-gray-700/50 text-gray-300"
                                }`}
                                onClick={() => {
                                  setRequirements((prev) => ({
                                    ...prev,
                                    [category]: prev[category]?.includes(
                                      option.name
                                    )
                                      ? prev[category].filter(
                                          (item) => item !== option.name
                                        )
                                      : [...(prev[category] || []), option.name],
                                  }));
                                }}
                              >
                                {option.name}
                                {option.level && (
                                  <span className="ml-2 text-xs opacity-70">
                                    • {option.level}
                                  </span>
                                )}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{option.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </CardContent>
                )}

                {expandedSections[category] === "customRequirements" && (
                  <form onSubmit={handleAddCustomRequirement} className="mb-4">
                    <div className="flex gap-2">
                      <Input
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Add your own requirement..."
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                      <Button
                        type="submit"
                        className="bg-pink-500 hover:bg-pink-600"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            )
          )}

          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-700">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-900 hover:bg-gray-700"
              onClick={onBack}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>

            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={onGenerateTechnical}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Technical Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TechnicalDetailsComponent = ({ 
  techOptions,
  requirements,
  setRequirements,
  expandedSections,
  toggleSection,
  onBack 
}) => {
  return (
    <div className="flex-1 p-6 overflow-auto">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-100">
            Technical Details
          </CardTitle>
          <CardDescription className="text-gray-300">
            Recommended technical setup for your project 🛠️
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(techOptions).map(
            ([category, { icon, title, description, options }]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  {icon}
                  <div>
                    <h4 className="font-medium text-gray-100">{title}</h4>
                    <p className="text-sm text-gray-400">{description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {options.map((option) => (
                    <TooltipProvider key={option.name}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            className={`cursor-pointer ${
                              requirements.technical[category]?.includes(
                                option.name
                              )
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-gray-700/50 text-gray-300"
                            }`}
                            onClick={() => {
                              setRequirements((prev) => ({
                                ...prev,
                                technical: {
                                  ...prev.technical,
                                  [category]: prev.technical[
                                    category
                                  ]?.includes(option.name)
                                    ? prev.technical[category].filter(
                                        (item) => item !== option.name
                                      )
                                    : [
                                        ...(prev.technical[category] || []),
                                        option.name,
                                      ],
                                },
                              }));
                            }}
                          >
                            {option.name}
                            <span className="ml-2 text-xs opacity-70">
                              • {option.level}
                            </span>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{option.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            )
          )}

          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-700">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-900 hover:bg-gray-700"
              onClick={onBack}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Project Plan
            </Button>

            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={() => {
                console.log("Final requirements:", requirements);
                // Add your final generation logic here
              }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ProjectPlanComponent, TechnicalDetailsComponent };