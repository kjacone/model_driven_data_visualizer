from my_agent.GenerateDashboardAgent import GenerateDashboardAgent
from langgraph.graph import StateGraph
from my_agent.State import SchemaState
from my_agent.SQLAgent import SQLAgent
from my_agent.DataFormatter import DataFormatter
from langgraph.graph import END
from langgraph.checkpoint.memory import MemorySaver

class SchemaWorkflowManager:
    def __init__(self):
        self.dashboard_agent = GenerateDashboardAgent()
        self.data_formatter = DataFormatter()
        self.memory = MemorySaver()
        

    def create_workflow(self) -> StateGraph:
        """Create and configure the workflow graph."""
        workflow = StateGraph(SchemaState)

        # Add nodes to the graph
        workflow.add_node("component_suggestion", self.dashboard_agent.component_suggestion)
       
       
        # Define edges
       
        workflow.add_edge("component_suggestion", END)
        workflow.set_entry_point("component_suggestion")

        return workflow
    
    def returnGraph(self):
        return self.create_workflow().compile(checkpointer=self.memory)

    