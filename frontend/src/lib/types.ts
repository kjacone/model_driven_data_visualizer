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
}

export type AgentVisualization = {
  question: string;
  uuid: string;
  parsed_question: any[],
  unique_nouns: any[],
  sql_query: string,
  results: any[],
  visualization: string,
  logs:any[]
}

