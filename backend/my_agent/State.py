from typing import List, Any, Annotated, Dict, Optional
from typing_extensions import TypedDict
import operator

class Log(TypedDict):
    """
    Represents a log of an action performed by the agent.
    """
    message: str
    done: bool
    is_error: bool

class InputState(TypedDict):
    question: str
    uuid: str
    parsed_question: Dict[str, Any]
    unique_nouns: List[str]
    sql_query: str
    results: List[Any]
    answer: Annotated[str, operator.add]
    visualization: str
    visualization_reason: str
    formatted_data_for_visualization: Dict[str, Any]
    error: str
    logs: List[Log]


class SchemaState(TypedDict):
    uuid: str
    schema: str
    response: str
    logs: List[Annotated[Log, operator.add]]

