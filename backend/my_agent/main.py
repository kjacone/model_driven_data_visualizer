

from my_agent.WorkflowManager import WorkflowManager
from my_agent.SchemaWorkflowManager import SchemaWorkflowManager

# for deployment on langgraph cloud
graph = WorkflowManager().returnGraph()

schema_graph = SchemaWorkflowManager().returnGraph()
    
    