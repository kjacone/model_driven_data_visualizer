from enum import Enum
from typing import Literal, List, Dict, Any, Optional
from dataclasses import dataclass
from langgraph.graph import MessagesState

from pydantic import BaseModel
from typing import Dict


# Base State Definitions
@dataclass
class ProjectRequirements:
    use_cases: List[str]
    user_flows: List[str]
    project_name: str
    monorepo_structure: Dict[str, Any]
    tech_stack: List[str]


@dataclass
class ProjectSteps:
    implementation_steps: List[str]
    test_cases: List[str]


# State Schemas for Different Teams
class RequirementsState(MessagesState):
    next: Literal["requirements_analyzer", "flow_generator", "tech_advisor", "__end__"]
    requirements: Optional[ProjectRequirements] = None


class ImplementationState(MessagesState):
    next: Literal["step_planner", "code_writer", "test_runner", "__end__"]
    steps: Optional[ProjectSteps] = None
    current_code: Optional[Dict[str, str]] = None
    test_results: Optional[Dict[str, bool]] = None


class TopLevelState(MessagesState):
    next: Literal["requirements_team", "implementation_team", "__end__"]


class ProjectType(str, Enum):
    FASTAPI = "fastapi"
    FASTAPI_AUTH = "fastapi_auth"
    DJANGO = "django"
    REACT = "react"
    REACT_AUTH = "react_auth"
    NEXT = "next"
    FLUTTER = "flutter"
    GENERIC = "generic"


class ProjectTemplate(BaseModel):
    name: str
    type: "ProjectType"
    files: Dict[str, str]
    dependencies: Dict[str, str]
    dev_dependencies: Dict[str, str]


@dataclass
class SupervisorResponse:
    """Structured output for the supervisor's decision."""

    next_phase: Literal["requirements_team", "implementation_team", "__end__"]
    reasoning: str
    confidence: float




@dataclass
class SupervisorConfig:
    """Configuration for the supervisor."""

    system_prompt: str = """You are a technical project supervisor deciding between requirements gathering 
    or implementation phases. Analyze the context and decide which phase is most appropriate."""

    model_name: str = "gpt-3.5-turbo"
    temperature: float = 0.2
