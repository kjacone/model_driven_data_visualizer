# WorkflowManager.py
# pylint: disable=line-too-long, unused-import
from langgraph.graph import StateGraph, END
from gather_info.State import TechStackState
from gather_info.UIAgent import UIAgent
from langgraph.checkpoint.memory import MemorySaver


class WorkflowManager:
    def __init__(self):
        self.ui_agent = UIAgent()
        self.memory = MemorySaver()

    def create_workflow(self) -> StateGraph:
        workflow = StateGraph(TechStackState)

        # Add nodes
        workflow.add_node("analyze_input", self.ui_agent.analyze_input)
        workflow.add_node("generate_tech_stack", self.ui_agent.generate_tech_stack)
        workflow.add_node("generate_achitecture", self.ui_agent.generate_achitecture)
        workflow.add_node("generate_readme", self.ui_agent.generate_readme)
        # workflow.add_node("hitl_review", self.ui_agent.hitl_review)

        # Define edges
        workflow.add_edge("analyze_input", "generate_tech_stack")
        workflow.add_edge("generate_tech_stack", "generate_achitecture")
        workflow.add_edge("generate_achitecture", "generate_readme")
        workflow.add_edge("generate_readme", END)
        # workflow.add_edge("generate_readme", "hitl_review")

        # # Add conditional edges from HITL
        # workflow.add_conditional_edges(
        #     "hitl_review",
        #     self.ui_agent.check_completion,
        #     {
        #         "generate_tech_stack": "generate_tech_stack",
        #         "generate_monorepo": "generate_monorepo",
        #         "generate_readme": "generate_readme",
        #         "end": END,
        #     },
        # )
        workflow.set_entry_point("analyze_input")

        return workflow

    def returnGraph(self):
        return self.create_workflow().compile(checkpointer=self.memory)
