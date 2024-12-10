# UIAgent.py
# pylint: disable=line-too-long, unused-import
from typing import Dict, List
from langchain_core.prompts import ChatPromptTemplate
from gather_info.prompts import Prompts
from gather_info.LLMManager import LLMManager
from gather_info.State import TechStackState
from langchain_core.output_parsers import JsonOutputParser


class UIAgent:
    def __init__(self):
        self.llm = LLMManager()
        self.output_parser = JsonOutputParser()

    def analyze_input(self, state: TechStackState) -> TechStackState:
        """Analyze initial input requirements with language handling."""
        # # First, detect language and translate if necessary
        # translated_text, original_lang, is_english = Prompts.detect_and_translate(
        #     state["user_input"]
        # )

        # # Store original language in state for future reference
        # state["original_language"] = original_lang

        # # If not English, use the language handler system prompt first
        # if not is_english:
        #     prompt = ChatPromptTemplate.from_messages(
        #         [
        #             ("system", Prompts.get_system_prompt("analyzer")),
        #             ("human", translated_text),
        #         ]
        #     )

        #     response = self.llm.invoke(prompt, user_input=translated_text)
        #     formatted_response = output_parser.parse(response)
        #     state["use_cases"] = formatted_response

        # Proceed with regular analysis
        request_query = state["user_input"]
        prompt1 = ChatPromptTemplate.from_messages(
            [
                ("system", Prompts.get_system_prompt("analyzer")),
                ("human", request_query),
            ]
        )

        response = self.llm.invoke(prompt1, user_input=request_query)
        print("response:\n", response)
        formatted_response = self.output_parser.parse(response)
        state["use_cases"] = formatted_response["data"]
        state["use_cases_summary"] = formatted_response["summary"]
        print(formatted_response)

        return {
            **state,
            "use_cases": formatted_response["data"],
            "use_cases_summary": formatted_response["summary"],
        }

    def generate_tech_stack(self, state: TechStackState) -> TechStackState:
        """Generate technology stack recommendations."""
        request_query = state["user_input"]
        use_cases = state["use_cases_summary"]
        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", Prompts.get_system_prompt("generate_tech_stack")),
                ("human", request_query),
            ]
        )

        response = self.llm.invoke(
            prompt, user_input=request_query, use_cases=use_cases
        )
        formatted_response = self.output_parser.parse(response)
        state["tech_stack"] = formatted_response["data"]
        state["tech_stack_summary"] = formatted_response["summary"]

        return {
            **state,
            "tech_stack": formatted_response["data"],
            "tech_stack_summary": formatted_response["summary"],
        }

    def generate_achitecture(self, state: TechStackState) -> TechStackState:
        """Generate monorepo structure."""
        request_query = state["user_input"]
        tech_stack = state["tech_stack_summary"]
        use_cases = state["use_cases_summary"]
        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", Prompts.get_system_prompt("devops")),
                ("human", request_query),
            ]
        )

        response = self.llm.invoke(
            prompt, user_input=request_query, tech_stack=tech_stack, use_cases=use_cases
        )
        # formatted_response = self.output_parser.parse(response)
        state["architecture"] = response
        print("architecture response:\n", response)
        return {**state, "architecture": response}

    def generate_readme(self, state: TechStackState) -> TechStackState:
        """Generate README documentation."""
        request_query = state["user_input"]
        tech_stack = state["tech_stack_summary"]
        use_cases = state["use_cases_summary"]
        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", Prompts.get_system_prompt("documentation")),
                ("human", request_query),
            ]
        )

        response = self.llm.invoke(
            prompt, user_input=request_query, tech_stack=tech_stack, use_cases=use_cases
        )
        # formatted_response = self.output_parser.parse(response)
        state["readme_content"] = response
        print("readme response:\n", response)
        return {**state, "readme_content": response}

    def hitl_review(self, state: TechStackState) -> TechStackState:
        """Human in the loop review."""
        # Present the HITL prompt for review
        review_prompt = Prompts.format_hitl_prompt(
            current_state=f"""
            Tech Stack: {state.tech_stack}
            Monorepo Structure: {state.monorepo_structure}
            README: {state.readme_content}
            """
        )
        # In a real implementation, this would show the prompt to a human reviewer
        feedback = self._get_human_feedback()
        state.feedback = feedback["message"]
        state.should_continue = not feedback["approved"]
        state.current_node = (
            feedback["next_node"] if not feedback["approved"] else "end"
        )
        return state

    def check_completion(self, state: TechStackState) -> str:
        """Determine next node based on HITL feedback."""
        if not state.should_continue:
            return "end"
        return state.current_node

    def _get_human_feedback(self) -> Dict:
        # Simulate human feedback
        return {
            "approved": False,
            "message": "Needs revision",
            "next_node": "generate_tech_stack",
        }
