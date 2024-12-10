# UIAgent.py
# pylint: disable=line-too-long, unused-import
from typing import Dict, List
from swe.Templates import CI_TEMPLATES, CLOUD_TEMPLATES, DOCKER_TEMPLATES, TEMPLATES
from swe.State import (
    ImplementationState,
    RequirementsState,
    SupervisorConfig,
    SupervisorResponse,
    TopLevelState,
)
from swe.prompts import Prompts
from swe.LLMManager import LLMManager
from langchain_core.output_parsers import JsonOutputParser
from langchain.schema import HumanMessage, AIMessage
from langchain_core.runnables import RunnableConfig


class UIAgent:
    def __init__(self):
        self.llm = LLMManager()
        self.output_parser = JsonOutputParser()

    def requirements_analyzer(self, state: RequirementsState):
        # Analyze raw requirements from user input
        prompt = f"Analyze the following requirements and generate use cases:\n{state['messages'][-1].content}"
        response = self.llm.invoke([HumanMessage(content=prompt)])
        return {
            "messages": [AIMessage(content=response.content)],
            "next": "flow_generator",
        }

    def flow_generator(self, state: RequirementsState):
        """Generate user flows based on use cases."""
        prompt = f"Generate user flows based on these use cases:\n{state['messages'][-1].content}"
        response = self.llm.invoke([HumanMessage(content=prompt)])
        return {
            "messages": [AIMessage(content=response.content)],
            "next": "tech_advisor",
        }

    def tech_advisor(self, state: RequirementsState):
        # Recommend tech stack and monorepo structure
        prompt = f"Recommend tech stack and monorepo structure for:\n{state['messages'][-1].content}"
        response = self.llm.invoke([HumanMessage(content=prompt)])
        return {"messages": [AIMessage(content=response.content)], "next": "__end__"}

    # Implementation Team
    def step_planner(self, state: ImplementationState):
        # Plan implementation steps based on requirements
        prompt = f"Create implementation steps for:\n{state['messages'][-1].content}"
        response = self.llm.invoke([HumanMessage(content=prompt)])
        return {
            "messages": [AIMessage(content=response.content)],
            "next": "code_writer",
        }

    def code_writer(self, state: ImplementationState):
        """Generate code based on planned steps."""
        prompt = f"Write code for this step:\n{state.messages[-1].content}"
        response = self.llm.invoke([HumanMessage(content=prompt)])
        return {
            "messages": [AIMessage(content=response.content)],
            "next": "test_runner",
        }

    def test_runner(self, state: ImplementationState):
        """Run tests on generated code."""
        prompt = f"Generate and run tests for:\n{state.messages[-1].content}"
        response = self.llm.invoke([HumanMessage(content=prompt)])
        return {"messages": [AIMessage(content=response.content)], "next": "__end__"}

    # Top-level Supervisor
    def top_level_supervisor(
        self,
        state: TopLevelState,
        *,
        config: RunnableConfig,
    ) -> Dict[str, str]:
        """
        Analyzes the project state and determines the next phase.

        Args:
            state: Current state of the project including message history
            config: Configuration including model settings

        Returns:
            Dictionary containing the next phase to execute and updated messages
        """
        # Extract the current state from messages
        current_state = self._format_current_state(state["messages"])

        # Get decision from LLM
        response_str = self.llm.invoke(
            Prompts.SUPERVISOR_PROMPT, current_state=current_state
        )

        # Parse the response into structured format
        try:
            response = self._parse_response(response_str)
        except Exception:
            # Fallback to requirements team if parsing fails
            response = SupervisorResponse(
                next_phase="requirements_team",
                reasoning="Error parsing response, defaulting to requirements phase",
                confidence=0.5,
            )

        # Create decision message
        decision_message = AIMessage(
            content=(
                f"Decision: {response.next_phase}\n"
                f"Reasoning: {response.reasoning}\n"
                f"Confidence: {response.confidence:.2f}"
            )
        )

        return {
            "messages": state["messages"] + [decision_message],
            "next": response.next_phase,
        }
