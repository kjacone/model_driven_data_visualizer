"""Define a simple chatbot agent.

This agent returns a predefined response without using an actual LLM.
"""

from typing import Any, Dict
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph
from my_agent.DataFormatter import DataFormatter
from langgraph.graph import END
from tryme.configuration import Configuration
from tryme.state import RequirementsState





def input_city(state: RequirementsState) -> RequirementsState:
    """
    Ask the user for the city they want to visit and update the state accordingly.

    The user is prompted to enter the city name, and the given state is updated with the city and the user's input message.
    """
    print("Please enter the city you want to visit for your day trip:")
    user_message = input("Your input: ")
    return {
        **state,
        "city": user_message,
        "messages": state['messages'] + [HumanMessage(content=user_message)],
    }

def input_interests(state: RequirementsState) -> RequirementsState:
    """
    Ask the user for their interests for the trip to the given city, and modify the given state accordingly.

    The user is prompted to enter their interests as a comma-separated list, and the given state is updated with the stripped
    interest strings and the user's input message.
    """
    print(f"Please enter your interests for the trip to {state['city']} (comma-separated):")
    user_message = input("Your input: ")
    return {
        **state,
        "interests": [interest.strip() for interest in user_message.split(',')],
        "messages": state['messages'] + [HumanMessage(content=user_message)],
    }

def create_itinerary(state: RequirementsState) -> RequirementsState:
    """
    Create an itinerary for the given city and interests.

    This function will print to the console and modify the given state.
    """
    print(f"Creating an itinerary for {state['city']} based on interests: {', '.join(state['interests'])}...")
    response = llm.invoke(itinerary_prompt.format_messages(city=state['city'], interests=", ".join(state['interests'])))
    print("\nFinal Itinerary:")
    print(response.content)
    return {
        **state,
        "messages": state['messages'] + [AIMessage(content=response.content)],
        "itinerary": response.content,
    }











workflow = StateGraph(RequirementsState)

workflow.add_node("input_city", input_city)
workflow.add_node("input_interests", input_interests)
workflow.add_node("create_itinerary", create_itinerary)

workflow.set_entry_point("input_city")

workflow.add_edge("input_city", "input_interests")
workflow.add_edge("input_interests", "create_itinerary")
workflow.add_edge("create_itinerary", END)

app = workflow.compile()

# Compile the workflow into an executable graph
graph = workflow.compile()
graph.name = "New Graph"  # This defines the custom name in LangSmith