export type Resource = {
  url: string;
  title: string;
  description: string;
};

export type AgentState = {
  model: string;
  research_question: string;
  report: string;
  resources: any[];
  logs: any[];
};

export type ReasearchAgentState = {
  model: string;
  research_question: string;
  report: string;
  resources: any[];
  logs: any[];
};

export type AgentVisualization = {
  question: string;
  uuid: string;
  parsed_question: any[];
  unique_nouns: any[];
  sql_query: string;
  results: any[];
  visualization: string;
  visualization_reason: string;
  logs: any[];
};

export type TechStackState = {
  target_audience: string;
  product_description: string;
  user_input: string;
  use_cases: any[];
  tech_stack: any[];
  architecture: string;
  readme_content: string;
  current_node: string;
  steps: any[];
  feedback: string;
  should_continue: boolean;
};
