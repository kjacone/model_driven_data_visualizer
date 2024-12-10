# WorkflowManager.py
# pylint: disable=line-too-long, unused-import
from swe.State import ImplementationState, RequirementsState, TopLevelState
from langgraph.graph import StateGraph, END, START
from swe.UIAgent import UIAgent
from langgraph.checkpoint.memory import MemorySaver


class WorkflowManager:
    def __init__(self):
        self.ui_agent = UIAgent()
        self.memory = MemorySaver()

    def requirements_graph(self) -> RequirementsState:
        """Build the Requirements Team Graph."""
        requirements_builder = StateGraph(RequirementsState)
        requirements_builder.add_node(
            "requirements_analyzer", self.ui_agent.requirements_analyzer
        )
        requirements_builder.add_node("flow_generator", self.ui_agent.flow_generator)
        requirements_builder.add_node("tech_advisor", self.ui_agent.tech_advisor)

        requirements_builder.add_edge(START, "requirements_analyzer")
        requirements_builder.add_conditional_edges(
            "requirements_analyzer", lambda x: x["next"]
        )
        requirements_builder.add_conditional_edges(
            "flow_generator", lambda x: x["next"]
        )
        requirements_builder.add_conditional_edges("tech_advisor", lambda x: x["next"])
        return requirements_builder.compile()

    def implementation_graph(self) -> ImplementationState:
        """Build the Implementation Team Graph."""

        # Build Implementation Team Graph
        implementation_builder = StateGraph(ImplementationState)
        implementation_builder.add_node("step_planner", self.ui_agent.step_planner)
        implementation_builder.add_node("code_writer", self.ui_agent.code_writer)
        implementation_builder.add_node("test_runner", self.ui_agent.test_runner)

        implementation_builder.add_edge(START, "step_planner")
        implementation_builder.add_conditional_edges(
            "step_planner", lambda x: x["next"]
        )
        implementation_builder.add_conditional_edges("code_writer", lambda x: x["next"])
        implementation_builder.add_conditional_edges("test_runner", lambda x: x["next"])

        return implementation_builder.compile()

    # pylint: disable=line-too-long, unused-import
    def create_workflow(self) -> TopLevelState:
        """Create and configure the workflow graph."""

        # Build Top-level Graph
        builder = StateGraph(TopLevelState)
        builder.add_node("top_level_supervisor", self.ui_agent.top_level_supervisor)
        builder.add_node("requirements_team", self.requirements_graph)
        builder.add_node("implementation_team", self.implementation_graph)

        builder.add_edge(START, "top_level_supervisor")
        builder.add_conditional_edges("top_level_supervisor", lambda x: x["next"])
        builder.add_edge("requirements_team", "top_level_supervisor")
        builder.add_edge("implementation_team", "top_level_supervisor")

        return builder

    def returnGraph(self):
        return self.create_workflow().compile(checkpointer=self.memory)
