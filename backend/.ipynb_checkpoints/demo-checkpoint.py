"""Demo"""

import os
from pprint import pprint


# pylint: disable=wrong-import-position
from fastapi import FastAPI
import uvicorn
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitSDK, LangGraphAgent
from swe.main import graph
from gather_info.main import graph as graph3

app = FastAPI()


sdk2 = CopilotKitSDK(
    agents=[
        # LangGraphAgent(
        #     name="my_agent",
        #     description="Visualisation agent.",
        #     agent=graph2,
        # ),
        LangGraphAgent(
            name="gather_info",
            description="Info Gatherer agent.",
            agent=graph3,
        ),
        LangGraphAgent(
            name="swe",
            description="SWE agent.",
            agent=graph,
        ),
    ],
)


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
