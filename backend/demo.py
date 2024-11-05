"""Demo"""

import os
from pprint import pprint


# pylint: disable=wrong-import-position
from fastapi import FastAPI
import uvicorn
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitSDK, LangGraphAgent
from research_canvas.main import graph 
from my_agent.main import graph as graph2

app = FastAPI()
sdk = CopilotKitSDK(
    agents=[
        LangGraphAgent(
            name="research_agent",
            description="Research agent.",
            agent=graph,
        )
    ],
)

sdk2 = CopilotKitSDK(
    agents=[
        LangGraphAgent(
            name="my_agent",
            description="Visualisation agent.",
            agent=graph2,
        )
    ],
)

add_fastapi_endpoint(app, sdk, "/copilotkit")

add_fastapi_endpoint(app, sdk2, "/visualisation")

# add new route for health check
@app.get("/health")
def health():
    """Health check."""
    status = {"status": "ok"}
    pprint(status)
    return status


def main():
    """Run the uvicorn server."""
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("demo:app", host="0.0.0.0", port=port, reload=True)
