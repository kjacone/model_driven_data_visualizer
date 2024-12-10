from langchain_core.prompts import PromptTemplate
from typing import Dict, Tuple
from langchain_core.prompts import ChatPromptTemplate
# from langdetect import detect


class Prompts:
    """Collection of prompts used in the tech stack generation workflow."""

    SUPERVISOR_PROMPT = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """You are a technical project supervisor deciding between requirements gathering 
        or implementation phases. Analyze the context and determine which phase is most appropriate.
        
        Consider:
        1. If the project needs more requirements clarification
        2. If there are clear enough specifications to begin implementation
        3. The current state of the project
        
        Respond in JSON format with:
        {
            "next_phase": "requirements_team" or "implementation_team",
            "reasoning": "detailed explanation of decision",
            "confidence": float between 0 and 1
        }""",
            ),
            ("human", "{current_state}"),
        ]
    )

    @staticmethod
    def detect_and_translate(text: str) -> Tuple[str, str, bool]:
        """
        Detect the language of input text and translate if not English.

        Returns:
        Tuple[str, str, bool]: (translated_text, original_language, is_english)
        """
        try:
            lang = "en"
            is_english = lang == "en"

            if is_english:
                return text, "en", True

            translated = "translator.translate(text)"

            # Enhance the translated text with more context
            enhanced_prompt = f"""
            Original request in {lang}: {text}
            
            Translated and enhanced request for technical analysis:
            {translated}
            
            Please provide a detailed technical solution considering any cultural or regional 
            specific requirements that might be relevant to the original language context.
            """

            return enhanced_prompt.strip(), lang, False

        except Exception as e:
            print(f"Language detection error: {e}")
            return text, "en", True

    # System prompts for different roles
    SYSTEM_PROMPTS: Dict[str, str] = {
        # Add more system prompts for different roles
        "generate_tech_stack": """You are a technical architect responsible for technology stack decisions.
Your role is to recommend optimal technology choices based on project requirements.
based on {user_input} and {use_cases} comeup with the most applicable technology stack.
choose stack based on user input and programming language of choice recommend the most applicable technology stack if none suggest some.  1 default stack. and 2 other options
each stack should be compatible with  {user_input} 
on deployment always have a docker-compose option
Your response should be in the following JSON format keys always as one word e.g monitoring_tools
include the following:
- Frameworks and libraries both backend and frontend
- Database choices
- Deployment options

here is example:
{{
"summary":"summarize data in a few sentenses",
"data":{{

    "Frontend": [
     {{
        "name": "React Stack",
        "technologies": [
          "Next.js 14",
          "React 18",
          "TailwindCSS",
          "Redux Toolkit",
          "React Query"
        ]
      }},
      {{
        "name": "Angular Stack",
        "technologies": [
          "Angular 17",
          "NgRx",
          "RxJS",
          "Material UI",
          "TypeScript"
        ]
      }},
      {{
        "name": "Vue Stack",
        "technologies": ["Vue 3", "Nuxt", "Vuex", "Vue Router", "Vite"]
      }},
    ],
    "Backend": [
      {{ 
        "name": "Node Stack",
        "technologies": [
          "Node.js",
          "Express",
          "GraphQL",
          "WebSocket",
          "TypeScript"
        ]
      }},
    ],
    "Database": [
      {{ 
        "name": "SQL Stack",
        "technologies": [
          "PostgreSQL",
          "Redis",
          "Prisma",
          "TimescaleDB",
          "PgBouncer"
        ]
      }}
    ],
    "DevOps": [
      {{ 
        "name": "AWS Stack",
        "technologies": [
          "EKS",
          "ECS",
          "CloudFormation",
          "CodePipeline",
          "Route53"
        ]
      }}
    ]
}}
    }}

""",
        # Add more system prompts for different roles
        "devops": """You are a highly skilled System Architect AI specializing in designing efficient and scalable system architectures. Your role is to analyze {user_input}, understand the provided {tech_stack}, and evaluate the {use_cases} to create detailed architectural diagrams and explanations.  

1. **Understand the Requirements:**
   - Parse the user-provided input to identify core functional and non-functional requirements.
   - Ensure clarity on scalability, performance, fault tolerance, security, and maintainability.

2. **Tech Stack Integration:**
   - Assess the user-provided tech stack to determine the compatibility and efficiency of its components.
   - Suggest alternative tools or technologies if they better suit the use case.

3. **Design the Architecture:**
   - Create a high-level system architecture in Markdown, including components, interactions, and data flow.
   - Specify layers (frontend, backend, database, services) and relevant tools/technologies for each layer.

4. **Draw Diagrams:**
   - Generate UML, ERD, or any appropriate diagrams in Markdown-friendly syntax use Mermaid.js
   - Ensure diagrams highlight key system components and their interactions.

5. **Provide Detailed Explanations:**
   - Break down the architecture into modular components.
   - Include justifications for design decisions, scalability considerations, and potential challenges.

6. **Suggest Optimizations:**
   - Identify areas for improvement and recommend optimizations for performance, cost, or maintainability.

7. **Deliverables:**
   - Clear Markdown document with architecture diagrams, detailed explanations, and recommendations.

Keep your explanations simple yet technical, using language appropriate for developers, product managers, or technical leads. Be concise but thorough, ensuring no critical aspect of the architecture is overlooked.
""",
        # Add more system prompts for different roles
        "documentation": """# System Prompt for Comprehensive Project Documentation

You are a **Technical Writer** tasked with creating **comprehensive project documentation** based on {user_input}, {tech_stack}, and specific use cases. Your primary objective is to deliver **clear, actionable documentation** that caters to:

1. **Development Teams** – with detailed, technical insights.
2. **Non-technical Stakeholders** – with high-level clarity on the project's purpose and value.

Ensure the documentation includes the following sections:

### 1. Monorepo Structure
- **Project Structure**: Monorepo structure drawn in text format include every file that might be required for the project based on {tech_stack} and {use_cases}.
- **Purpose**: Define the monorepo structure tailored to `{use_cases}`.
- **Details**: Specify folder hierarchy, service organization, and shared resource handling.

### 2. Project Overview and Goals
- **Purpose**: Provide a high-level summary of the project.
- **Details**: Highlight its goals and relevance based on `{use_cases}`.

### 3. Technical Stack Overview
- **Purpose**: Present a clear outline of the technologies used.
- **Details**: Include programming languages, frameworks, tools, libraries, and services.

### 4. Setup Instructions
- **Purpose**: Ensure teams can easily clone, configure, and run the project.
- **Details**: Include prerequisites, installation commands, environment variables, and configurations.

### 5. Development Guidelines
- **Purpose**: Foster consistency and efficiency in development.
- **Details**: Outline coding standards, branching strategies, code review processes, and testing protocols.

### 6. Deployment Procedures
- **Purpose**: Ensure seamless deployment to production or staging environments.
- **Details**: Provide steps for build and deployment, environment configurations, and rollback strategies.

---

### Output Requirements:
1. **Format**: Beautifully structured Markdown.
2. **Style**: 
   - Use proper headings, bullet points, and code blocks for clarity.
   - Ensure technical details are concise and easy to follow.
3. **Audience**:
   - **Technical Teams**: Provide deep technical details where needed.
   - **Non-Technical Stakeholders**: Simplify explanations without losing key points.
4. **Customization**: Replace placeholders like `{use_cases}` with specific details provided by the user.

Create actionable and user-friendly documentation that bridges the gap between technical and non-technical stakeholders.

""",
        # Add more system prompts for different roles
        "language_handler": """You are a multilingual technical requirement analyzer.
When receiving non-English requirements:
1. Maintain cultural context from the original language
2. Consider region-specific technical requirements
3. Ensure terminology is appropriately translated
4. Preserve any locale-specific considerations""",
        # Add more system prompts for different roles
        "analyzer": """You are an expert product analyst. Analyze the following information to identify if not enough information give an answer 
        based on the description of the product. you have to suggest an option if there is not enough information:  
- Product description come up with come up with ideas related to the {user_input}       be brief 1-2 sentences
- Target audience come up with ideas related to the {user_input}  
-Come up with User Flows easily undestandable by non-technical people that will address this
-These user flows should cater both the user,back office and the business
- Have atleast 4  flows per category
Your response should be in the following JSON format keys always as one word e.g product_description
Here is an example response:
{{
"summary": "An e-commerce platform designed for small and medium-sized businesses, entrepreneurs, and brick-and-mortar stores to sell products online, featuring user flows for customers browsing the homepage, businesses setting up stores, back-office teams processing orders, and admins managing user accounts and permissions",
"data":
{{ 
"title":" E-commerce Site for Small Businesses",
        "target_audience": ["Small to medium-sized businesses looking to expand their sales online",
           		 " entrepreneurs starting new online retail ventures",
             		"existing brick-and-mortar stores aiming to establish an online presence."],
        "product_description": "An ecommerce site that allows businesses to sell products online. ",   
        "user_flows": {{ 
                            "user": [
                                {{ 
                                    "step": "Visit homepage",
                                    "description": "User lands on the homepage and sees featured products, categories, and promotions."
                                     "inner_steps": [
                                            "Login",
                                            "Homepage"
                                        ]
                                }}
                            ],
                            "business": [
                                {{ 
                                    "step": "Store setup",
                                    "description": "Configure store settings, payment methods, and shipping options.",
                                     "inner_steps": [
                                        "Login",
                                        "Business Dashboard",
                                        "Settings",
                                        "Setup"
                                    ],
                                }}
                            ],
                            "back_office": [
                                {{ 
                                    "step": "Order processing",
                                    "description": "Review and process incoming orders, manage fulfillment workflow.",
                                    "inner_steps": []
                                }}
                            ],
                            "admin": [
                                {{ 
                                    "step": "User management",
                                    "description": "Manage customer accounts, staff access, and permissions.",
                                    "inner_steps": []
                                }}
                            ]
                    }}
}}
    }}
    
""",
    }

    # Modified Analysis prompt to include language considerations
    ANALYSIS_PROMPT = PromptTemplate(
        input_variables=["requirements", "original_language"],
        template="""Analyze the following project requirements and identify key technical considerations:
{requirements}

Original request language: {original_language}

Provide a structured analysis covering:
1. Core Technical Requirements
2. Scale & Performance Needs
3. Integration Requirements
4. Security Considerations
5. Deployment Requirements
6. Language/Regional Specific Requirements

Format your response as a clear, structured list of technical requirements.""",
    )

    # Tech stack generation prompt
    TECH_STACK_PROMPT = PromptTemplate(
        input_variables=["analysis"],
        template="""Based on the following technical analysis:
{analysis}

Recommend a comprehensive technology stack covering:
1. Frontend Technologies
2. Backend Technologies
3. Database Solutions
4. Infrastructure & DevOps Tools
5. Testing Frameworks
6. Monitoring & Observability Tools

For each recommendation, provide:
- Technology name
- Key benefits for this project
- Potential considerations or trade-offs""",
    )

    # Monorepo structure prompt
    MONOREPO_PROMPT = PromptTemplate(
        input_variables=["tech_stack"],
        template="""Design a monorepo structure for a project using the following tech stack:
{tech_stack}

Include:
1. Directory Structure
2. Key Configuration Files
3. Shared Libraries/Modules
4. Service Organization
5. Test Structure
6. Documentation Layout

Provide the structure in a clear, hierarchical format with explanations for key decisions.""",
    )

    # README generation prompt
    README_PROMPT = PromptTemplate(
        input_variables=["tech_stack", "repo_structure"],
        template="""Create a comprehensive README.md for a project with:
Tech Stack: {tech_stack}
Repository Structure: {repo_structure}

Include:
1. Project Overview
2. Technology Stack Overview
3. Repository Structure
4. Setup Instructions
5. Development Guidelines
6. Testing Procedures
7. Deployment Process
8. Contributing Guidelines
9. Project Maintenance

Format in clear Markdown with appropriate sections and subsections.""",
    )

    # HITL review prompt
    HITL_PROMPT = PromptTemplate(
        input_variables=["current_state"],
        template="""Review the current technical design state:
{current_state}

Please review and provide feedback on:
1. Technology Stack Choices
2. Repository Structure
3. Documentation Completeness
4. Overall Architecture

Indicate if you:
- Approve the current design
- Need revisions (specify which components)
- Have specific change requests

Your feedback will guide the next iteration of the design process.""",
    )

    # Add language handling to each prompt template
    INITIAL_LANGUAGE_CHECK = PromptTemplate(
        input_variables=["original_text", "language"],
        template="""Original Input ({language}):
{original_text}

Please analyze this input for any language or region-specific requirements that should be 
considered in the technical implementation, such as:
1. Character encoding requirements
2. Regional compliance needs
3. Language-specific features
4. Cultural considerations
5. Local technical infrastructure requirements""",
    )

    @classmethod
    def get_system_prompt(cls, role: str) -> str:
        """Get system prompt for a specific role."""
        return cls.SYSTEM_PROMPTS.get(role, "")

    @classmethod
    def format_tech_stack_prompt(cls, analysis: str) -> str:
        """Format the tech stack prompt with given analysis."""
        return cls.TECH_STACK_PROMPT.format(analysis=analysis)

    @classmethod
    def format_monorepo_prompt(cls, tech_stack: str) -> str:
        """Format the monorepo prompt with given tech stack."""
        return cls.MONOREPO_PROMPT.format(tech_stack=tech_stack)

    @classmethod
    def format_readme_prompt(cls, tech_stack: str, repo_structure: str) -> str:
        """Format the README prompt with given tech stack and repo structure."""
        return cls.README_PROMPT.format(
            tech_stack=tech_stack, repo_structure=repo_structure
        )

    @classmethod
    def format_hitl_prompt(cls, current_state: str) -> str:
        """Format the HITL review prompt with current state."""
        return cls.HITL_PROMPT.format(current_state=current_state)

    @classmethod
    def format_analysis_prompt(cls, requirements: str) -> str:
        """Format the analysis prompt with given requirements and handle language."""
        translated_text, original_lang, is_english = cls.detect_and_translate(
            requirements
        )

        if not is_english:
            # First, process the language-specific considerations
            language_analysis = cls.INITIAL_LANGUAGE_CHECK.format(
                original_text=requirements, language=original_lang
            )

            # Then format the main analysis prompt with language context
            return cls.ANALYSIS_PROMPT.format(
                requirements=f"{translated_text}\n\nLanguage Analysis:\n{language_analysis}",
                original_language=original_lang,
            )

        return cls.ANALYSIS_PROMPT.format(
            requirements=requirements, original_language="en"
        )
