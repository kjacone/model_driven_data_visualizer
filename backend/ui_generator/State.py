from typing import List, Any, Annotated, Dict, Optional
from typing_extensions import TypedDict
import operator

class InputState(TypedDict):
    ui_request: str
    ui_response: Dict[str, Any]
    

class OutputState(TypedDict):
    ui_response: Dict[str, Any]
    ui_desc: Dict[str, Any]
    ui_code: Dict[str, Any]