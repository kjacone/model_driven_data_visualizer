# Model-Driven Data Visualizer for SQL Data using LLMs

The **Model-Driven Data Visualizer** is an AI-powered tool that enables intuitive data analysis and visualization of SQL data by leveraging Large Language Models (LLMs) and dynamic, generative UI. This tool allows users to interact with complex data through natural language, simplifying SQL query creation, enhancing data visualization, and summarizing insights interactively.

## Features

- **Natural Language Querying:** Users can pose questions or data requirements in natural language. The LLM translates these prompts into SQL queries, allowing easy access to SQL data without technical expertise.
- **Automated Visualizations:** LLMs interpret SQL query results and suggest optimal visualizations (e.g., bar charts, heatmaps) based on data patterns and context.
- **Interactive Data Exploration:** Supports filtering, drill-downs, and real-time data updates for an immersive experience.
- **Data Summarization:** LLMs generate concise insights from complex data, summarizing trends, outliers, and key findings.
- **Explainable AI:** Offers query explanations and data storytelling to help users understand how insights are derived.

---

## Project Structure

This project includes a **Frontend** with Generative UI built in TypeScript and **Backend** workflows managed by Python agents that connect multiple small LLMs for specialized tasks. It also uses **SQLite** for data storage and includes sample data from **ChinookDB**.

### 1. Frontend (Generative UI with LLM-REAct)

The frontend is built using **Generative UI** combined with LLMs to drive an REAct agent, enabling users to interact with data through natural language and customizable visual elements. The interface adapts visualizations based on user queries and context, making data exploration more accessible and engaging.

#### Frontend Setup

- **Package Manager:** The frontend uses **pnpm** for package management.
- **Commands:** To install and run the frontend, use the following commands:

```bash


# Start the frontend server
pnpm run dev
```
For more information, please refer to the [README](./frontend/README.md).

###  2. Backend (Python Agents with Specialized LLMs)
The backend is developed in Python, connecting multiple agentic workflows that rely on smaller LLMs for specific data tasks **(e.g., SQL query generation, visualization suggestions, insight summarization).** The backend handles all data-processing tasks, allowing efficient, context-aware interactions between the database and frontend.

### Backend Setup

- **Package Manager:** Use **pip** to manage backend dependencies.
- **Commands:** To set up and run the backend, follow these steps:
```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

```
For more information, please refer to the [README](./backend/readme.md).
### 3: Database Service

This service provides essential features for managing and interacting with SQL databases.


#### Features

- **File Upload Support:** Supports uploading `.sqlite` and `.csv` files for database interaction.
- **Automatic File Deletion:** Automatically deletes files older than 4 hours to manage storage efficiently.
- **SQL Querying:** Allows users to query the database using SQL commands.
- **Schema Retrieval:** Provides the schema of the database for easy reference and understanding of its structure.

For more information, please refer to the [README](./sqlite_server/README.md).


### 4. Database (SQLite + ChinookDB Sample Data)

We use **SQLite** for the database, which is lightweight and efficient for SQL-based data interactions. For demonstration purposes, the project includes sample data from **ChinookDB**, a popular SQL database containing information about artists, albums, and tracks.

- **Database Setup:** Ensure that the ChinookDB file (`Chinook_Sqlite.sqlite`) is located in the `sqlite/` folder. You will upload the database using our frontend

---

## Contributing

We welcome contributions! Please refer to the [Contributing Guidelines](./docs/contributing.md) for more information on how to get involved.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

## Acknowledgments

- Thank you to all contributors and collaborators who made this project possible.
- Special thanks to the open-source community for their invaluable resources and support.