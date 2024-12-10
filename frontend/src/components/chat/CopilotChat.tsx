import {
    CopilotKitCSSProperties,
    CopilotSidebar,
    ResponseButtonProps,
    useCopilotChatSuggestions,
} from "@copilotkit/react-ui";

interface Labels {
    title: string;
    initial: string;
}
function CopilotChatInterface({ user }: { user: any }) {
    useCopilotChatSuggestions({
        instructions:
            "Suggest the most relevant next actions. e.g build me a website, build me a dashboard",
        minSuggestions: 1,
        maxSuggestions: 2,
    });

    function CustomResponseButton({ onClick, inProgress }: ResponseButtonProps) {
        return (
            <div
                style={{
                    display: "flex",
                    marginTop: "10px",
                }}
            >
                <button
                    style={{
                        flex: 1,
                        border: "1px solid #eee",
                        borderRadius: "4px",
                        marginRight: "5px",
                    }}
                >
                    👍
                </button>
                <button
                    style={{
                        flex: 1,
                        border: "1px solid #eee",
                        borderRadius: "4px",
                    }}
                >
                    👎
                </button>
            </div>
        );
    }

    return (
        <div
            style={
                {
                    "--copilot-kit-background-color": "#1f2937",
                    "--copilot-kit-primary-color": "#000000",
                    "--copilot-kit-contrast-color": "#ffffff"
                } as CopilotKitCSSProperties
            }
        >
            <CopilotSidebar defaultOpen={true} clickOutsideToClose={false}
                children={user.name}
                labels={
                    {
                        title: "Your Infomation Gatherer Assistant",
                        initial: "Hi! 👋 What are We developing Today?",
                    } as Labels
                }
                ResponseButton={CustomResponseButton}

            />
        </div>
    );
}

export default CopilotChatInterface;
