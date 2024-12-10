from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from my_agent.DatabaseManager import DatabaseManager
from my_agent.LLMManager import LLMManager
from langchain_core.runnables import RunnableConfig
from copilotkit.langchain import copilotkit_emit_state, copilotkit_customize_config,copilotkit_emit_message


async def dont_emit_state(config: RunnableConfig, state: dict) -> None:
    """Customize the config and emit the state."""
    modifiedConfig = copilotkit_customize_config(
        config,
        emit_messages=False,
    )
    await copilotkit_emit_state(modifiedConfig, state)


async def log_message(state: dict, message: str, done: bool = False) -> None:
    """Log a message to the state with a done status."""
    state["logs"] = state.get("logs", [])
    state["logs"].append({
        "message": message,
        "done": done
    })

class GenerateDashboardAgent:
    def __init__(self):
        self.db_manager = DatabaseManager()
        self.llm_manager = LLMManager()



    async def component_suggestion(self, state: dict, config: RunnableConfig) -> dict:
        await dont_emit_state(config, state)

        # log_index = await self.log_message(state, "Getting Schema and Suggesting Components", done=False)
        # await copilotkit_emit_state(config, state)
        
        schema = self.db_manager.get_schema(state['uuid'])

        prompt = ChatPromptTemplate.from_messages([
            ("system", '''
You are an experienced data analyst and user interface (UI) designer with a deep understanding of how to interpret database schemas and generate relevant dashboard and side menu layouts for data visualization.

Given the following database schema: {schema}, follow these instructions:

Side Menu Data and Queries:

Identify logical groupings or main categories from the schema to create meaningful side menu items.
For each menu item, suggest relevant columns to retrieve the data, table to retrieve data and 2 suggestions for next query.on icon generate svg icon based on title.
        example: {{    
        "title": "Sales Overview",
        "icon":{{
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 24 24",
        "fill": "none",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "2",
        "className": "h-4 w-4 text-muted-foreground",
        "path": {
            "d": "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
        }
    }},
                "dataFields": ["Total", "Invoice ID", "Rating"],
                "tables":["SALES"]
                "suggestions":["what are the total sales, what are the total sales in the past month" ]
                }}
        
Dashboard Data and Components:

Suggest dashboard components based on the schema, such as tables, charts (e.g., bar, line, pie charts), graphs, or summary cards, depending on data type and usage.
Indicate which tables or fields would populate each component. 3 cards,2 charts,1 table,2 graphs on icon generate svg icon based on component

example: {{
            
    "component": "Sales Summary Cards",
    "type":"card",
    "value": {{
            "Total Sales": "",
        "Total Transactions": 0,
        "Average Rating": 0.0
            }},
                "change":"",
                "icon":{{
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 24 24",
        "fill": "none",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "2",
        "className": "h-4 w-4 text-muted-foreground",
        "path": {
            "d": "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
        }
    }},
    "dataFields": ["Total", "Invoice ID", "Rating"],
    "tables":["sales"],
    "dataPoints":["Total Sales","Total Transactions", "Average Rating":] }}
Commonly Asked Questions:
Based on the schema structure, anticipate common questions a user might ask about this data. Include questions that would provide insights, comparisons, summaries, or trends.
example: {{
            "CommonlyAskedQuestions": [
    "What is the total sales revenue for each branch?",
    "How do sales compare between different customer types and genders?",
    "Which product line generates the most revenue?",
    "What is the most popular payment method among customers?",
    "How do sales trends vary over time?",
    "What is the average customer rating for each branch?"] }}

    ==Group everything in one json object return only the json object

'''),
            ("human", "===Database schema:\n{schema}\n")
        ])

        output_parser = JsonOutputParser()
        
        response = self.llm_manager.invoke(prompt, schema=schema)
        parsed_response = output_parser.parse(response)

        # state["logs"][log_index]["done"] = True
        # await copilotkit_emit_state(config, state)
    
        return { "response": parsed_response, "schema":schema }


    async def log_message(self, state: dict, message: str, done: bool = False) -> None:
        """Log a message to the state with a done status."""
        log_index = len(state["logs"])
        state["logs"] = state.get("logs", [])
        state["logs"].append({
            "message": message,
            "done": done
        })
        return log_index  # Return the log index for further use
