# State.py
from typing import Dict, List, TypedDict, Optional
from dataclasses import dataclass, field


@dataclass
class TechStackState(TypedDict):
    """State management for the technical stack workflow."""

    user_input: Optional[str] = None
    use_cases: List[str] = field(default_factory=list)
    tech_stack: List[str] = field(default_factory=list)
    architecture: str = ""
    readme_content: str = ""
    current_node: str = "input_analysis"
    feedback: str = ""
    use_cases_summary: str = ""
    tech_stack_summary: str = ""
    should_continue: bool = True
