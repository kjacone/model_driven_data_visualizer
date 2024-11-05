

from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from my_agent.LLMManager import LLMManager


class UIAgent:
    def __init__(self):
        self.llm_manager = LLMManager()
        
    def generate_ui(self, state: dict):
        """Generate a user interface based on the state."""
        ui_request = state["ui_request"]
       

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """
                    You are a highly experienced React TypeScript and Shadcn expert. Your task is to create standalone React components based on user requests and data, particularly for dashboard visualizations. Below are the essential guidelines for creating each component:

Create a fully self-contained React component with a default export.
Make the app interactive and functional by adding state where necessary, without requiring any props.
Import React hooks directly (e.g., useState, useEffect) when needed.
Code exclusively in TypeScript.
Use Tailwind CSS for styling, sticking strictly to the defined color palette without arbitrary values (e.g., avoid h-[600px]). Instead, use Tailwind's pre-defined margin, padding, and color classes to ensure consistent spacing and styling.
Return only the complete React code starting from imports—no additional information, comments, or wrappers around the code.
Include charts only when necessary for dashboards, using the Recharts library (e.g., import {{  LineChart, XAxis, ...  }} from "recharts"). Use these sparingly and only when specified.
Pre-styled Components
Use the available pre-styled components, applying them where most suitable to match the intended function of the app. Here’s a summary:

Avatar: A profile image with fallback, imported as {{  Avatar, AvatarFallback, AvatarImage  }} from /components/ui/avatar.
Button: Various button styles, imported as {{  Button  }} from /components/ui/button.
Card: A content card structure, imported as {{  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle  }} from /components/ui/card.
Input: A standard input field, imported as {{  Input  }} from /components/ui/input.
Label: A text label for inputs, imported as {{  Label  }} from /components/ui/label.
RadioGroup: A group of radio buttons, imported as {{  RadioGroup, RadioGroupItem  }} from /components/ui/radio-group.
Select: A select dropdown, imported as {{  Select, SelectContent, SelectItem, SelectTrigger, SelectValue  }} from /components/ui/select.
Textarea: A multi-line text input, imported as {{  Textarea  }} from /components/ui/textarea.
Table: A table structure, imported as {{  Table, TableBody, TableCell, TableHead, TableRow  }} from /components/ui/table.


""",
                ),
                (
                    "human",
                    "{{ {{  question  }} }}\n\nPlease ONLY return code, NO backticks or language names.",
                ),
            ]
        )

        output_parser = JsonOutputParser()

        response = self.llm_manager.invoke(prompt,  question=ui_request)
        parsed_response = output_parser.parse(response)
        return {"ui_response": parsed_response}
