from ui_generator.UIAgent import UIAgent
from langgraph.graph import StateGraph
from ui_generator.State import InputState, OutputState
from my_agent.DataFormatter import DataFormatter
from langgraph.graph import END

class WorkflowManager:
    def __init__(self):
        self.ui_agent = UIAgent()
        self.data_formatter = DataFormatter()
        
   
    def create_workflow(self) -> StateGraph:
        """Create and configure the workflow graph."""
        workflow = StateGraph(input=InputState, output=OutputState)

        # Add nodes to the graph
        workflow.add_node("generate_ui", self.ui_agent.generate_ui)
       
        workflow.add_edge("generate_ui", END)
        workflow.set_entry_point("generate_ui")

        return workflow
    
    def returnGraph(self):
        return self.create_workflow().compile()

    def run_ui_agent(self, question: str) -> dict:
        """Run the SQL agent workflow and return the formatted answer and visualization recommendation."""
        app = self.create_workflow().compile()
        result = app.invoke({"question": question})
        return {
            "ui_desc": result['ui_desc'],
            "ui_code": result['ui_code'],
        }