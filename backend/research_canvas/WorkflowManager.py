
from typing import cast

from langchain_core.messages import AIMessage, ToolMessage
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from research_canvas.state import AgentState
from research_canvas.download import download_node
from research_canvas.chat import chat_node
from research_canvas.search import search_node
from research_canvas.delete import delete_node, perform_delete_node

class WorkflowManager:
    
    def __init__(self):
        self.memory = MemorySaver()
        
   
    def create_workflow(self) -> StateGraph:
        """Create and configure the workflow graph."""
        # Define a new graph
        workflow = StateGraph(input=AgentState, output=AgentState)
        workflow.add_node("download", download_node)
        workflow.add_node("chat_node", chat_node)
        workflow.add_node("search_node", search_node)
        workflow.add_node("delete_node", delete_node)
        workflow.add_node("perform_delete_node", perform_delete_node)

        def route(state):
            """Route after the chat node."""

            messages = state.get("messages", [])
            if messages and isinstance(messages[-1], AIMessage):
                ai_message = cast(AIMessage, messages[-1])

                if ai_message.tool_calls and ai_message.tool_calls[0]["name"] == "Search":
                    return "search_node"
                if ai_message.tool_calls and ai_message.tool_calls[0]["name"] == "DeleteResources":
                    return "delete_node"
            if messages and isinstance(messages[-1], ToolMessage):
                return "chat_node"

            return END


        
        workflow.set_entry_point("download")
        workflow.add_edge("download", "chat_node")
        workflow.add_conditional_edges("chat_node", route, ["search_node", "chat_node", "delete_node", END])
        workflow.add_edge("delete_node", "perform_delete_node")
        workflow.add_edge("perform_delete_node", "chat_node")
        workflow.add_edge("search_node", "download")

        return workflow
    
    def returnGraph(self):
        memory = MemorySaver()
        return self.create_workflow().compile(checkpointer=memory, interrupt_after=["delete_node"])

