import { useCoAgent, useCoAgentStateRender } from "@copilotkit/react-core";
import {
  Message,
  MessageRole,
  TextMessage,
} from "@copilotkit/runtime-client-gql";
import { useState } from "react";
import { AnswerMarkdown } from "./projectplan/Markdown";

export type AgentState = {
  city: string;
  interests: string[];
  messages: Message[];
  itinerary: string;
};

function Tryme() {
  const {
    run: agentrun,
    state: coagent,
    stop,
    setState,
    nodeName,
    running,
  } = useCoAgent<AgentState>({
    name: "gather_info",
    initialState: {
      city: "",
      interests: [],
      messages: [],
      itinerary: "",
    },
  });
  const isLoading = !coagent?.itinerary;

  useCoAgentStateRender({
    name: "gather_info",
    render: ({ state, nodeName, status }) => {
      return (
        <p>
          {nodeName} is {status}
        </p>
      );
    },
  });

  const [cityInput, setCityInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  const handleSetCity = async () => {
    await agentrun(() => {
      return new TextMessage({
        role: MessageRole.User,
        content: `City Added  `,
      });
    });
  };

  const handleAddInterest = async () => {
    try {
      await agentrun(() => {
        return new TextMessage({
          role: MessageRole.User,
          content: ` My interests included `,
        });
      });
    } catch (error) {
      console.error("Error running agent:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Node Name: {nodeName}</h2>

      {running ? (
        <div className="mb-4">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4"
            onClick={stop}
          >
            Stop
          </button>
          <div className="mt-2">
            <p>Loading...</p>
            <progress className="w-full" />
          </div>
        </div>
      ) : (
        <p className="mb-4">Not Running</p>
      )}

      <div className="space-y-4">
        {nodeName === "enter_city" ? (
          <div>
            {/* Set city div */}

            <div className="flex flex-col items-center gap-2">
              <label className="flex-1">
                <span className="block text-sm font-medium text-gray-700">
                  City:
                </span>
                <input
                  type="text"
                  value={coagent.city || ""}
                  onChange={(e) =>
                    setState({ ...coagent, city: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                />
              </label>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSetCity}
              >
                Set City
              </button>
            </div>
          </div>
        ) : nodeName === "input_city" ? (
          <div>
            {/* Enter interest div */}

            <div className="flex flex-col items-center gap-2">
              <label className="flex-1">
                <span className="block text-sm font-medium text-gray-700">
                  Interest:
                </span>
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                />
              </label>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  setState({
                    ...coagent,
                    interests: [...coagent.interests, interestInput],
                  });
                  setInterestInput("");
                }}
              >
                Add Interest
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleAddInterest}
              >
                Add Interest to Agent
              </button>
            </div>
          </div>
        ) : nodeName === "create_itinerary" ? (
          <div>
            {/* Display state.messages in markdown */}

            <div className="text-slate-500 font-light">
              <AnswerMarkdown markdown={coagent.itinerary || "NOt set"} />
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <p className="font-medium">
          City: <span className="font-normal">{coagent.city || "Not Set"}</span>
        </p>
        <p className="font-medium">
          Interests:{" "}
          <span className="font-normal">
            {coagent?.interests?.join(", ") || "Not Set"}
          </span>
        </p>

        <div className="text-slate-500 font-light">
          <AnswerMarkdown markdown={coagent?.itinerary || "NOt set"} />
        </div>
      </div>
    </div>
  );
}

export default Tryme;
