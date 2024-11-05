import DashboardPage from "@/components/dashboard/page";
import { useModelSelectorContext } from "@/lib/model-selector-provider";
import { AgentVisualization } from "@/lib/types";
import { useCoAgent } from "@copilotkit/react-core";
import { CopilotChat, useCopilotChatSuggestions } from "@copilotkit/react-ui";
import { Home, Package, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

export default function Main() {
  const { model } = useModelSelectorContext();
  const { state, setState } = useCoAgent<AgentVisualization>({
    name: "my_agent",

    initialState: {
      question: "",
      uuid: "",
      parsed_question: [],
      unique_nouns: [],
      sql_query: "",
      results: [],
      visualization: "",
      logs: []
    },
  });


  const sections = [
    { id: 1, name: 'Dashboard', icon: <Home />, href: '#' },
    { id: 2, name: 'Orders', icon: <ShoppingCart />, href: '#' },
    { id: 3, name: 'Products', icon: <Package />, href: '#' },

  ]

  const onSelectSection = (sectionId: number) => {
    // console.log(`Selected section: ${sectionId}`)
    // Ensure no state updates are causing re-renders here
  }

  const [databaseInfo, setDatabaseInfo] = useState<{ name: string; uuid: string | null }>({ name: "", uuid: "cfecacb4-2a74-44d0-be5c-1015ee2780bb" });

  useEffect(() => {
    if (databaseInfo.uuid && databaseInfo.uuid !== state.uuid) {
      setState({ ...state, uuid: databaseInfo.uuid });
    }
  }, [databaseInfo.uuid, setState, state]);


  useCopilotChatSuggestions(
    {
      instructions: "Suggest the most relevant next actions.",
    }
  );

  return (
    <>


    
        <div
          className="flex flex-1 border"
          style={{ height: "calc(100vh - 60px)" }}
        >
          <div className="flex-1 overflow-hidden">
           
                <DashboardPage />
              


          </div>
          <div
            className="w-[400px] h-full flex-shrink-0"
            style={
              {
                "--copilot-kit-background-color": "#E0E9FD",
                "--copilot-kit-secondary-color": "#6766FC",
                "--copilot-kit-secondary-contrast-color": "#FFFFFF",
                "--copilot-kit-primary-color": "#FFFFFF",
                "--copilot-kit-contrast-color": "#000000",
              } as any
            }
          >


            <CopilotChat
              className="h-full"
              onSubmitMessage={async (message) => {
                // clear the logs before starting the new research
                setState({ ...state, logs: [], question: message, });
                await new Promise((resolve) => setTimeout(resolve, 30));
              }}
              labels={{
                title: "Upeo Assistant",
                initial: "Hi! 👋 How can I assist you today?",
              }}
            />
          </div>


        </div>





















    </>
  );
}
