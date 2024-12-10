"""Define the state structures for the agent."""
import os
from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.runnables.graph import MermaidDrawMethod
from IPython.display import display, Image
from dotenv import load_dotenv
import os
load_dotenv()



class State:
    """Defines the input state for the agent, representing a narrower interface to the outside world.

    This class is used to define the initial state and structure of incoming data.
    See: https://langchain-ai.github.io/langgraph/concepts/low_level/#state
    for more information.
    """

    changeme: str = "example"
    
class RequirementsState(TypedDict):
    """Defines the state structure for requirements.

    This class represents the state of the requirements, including messages, city, interests, and itinerary.
    """
    messages: Annotated[List[HumanMessage | AIMessage], "The messages in the conversation"]
    city: str
    interests: List[str]
    itinerary: str