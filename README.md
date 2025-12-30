# Meal Planner MVP

A weekly meal planning application powered by AI. Plan your dinners, get recipe suggestions based on time constraints, and generate an aggregated shopping list automatically.

## Features

- Plan dinners for any day of the week
- Set time constraints for each meal (e.g., "30 minutes or less")
- Option for leftovers (doubles the recipe for lunch the next day)
- AI-powered recipe search using Tavily
- Smart shopping list that aggregates ingredients across all meals
- Fresh ingredient optimization to minimize food waste

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **OpenAI API key** - Get one at https://platform.openai.com
- **Tavily API key** - Get one at https://tavily.com

## Setup

### 1. Backend Setup

```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -e .

# Create .env file with your API keys
cp .env.example .env
# Edit .env and add your keys:
#   OPENAI_API_KEY=your_openai_key_here
#   TAVILY_API_KEY=your_tavily_key_here
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional - defaults work for local development)
cp .env.example .env
```

## Running the Application

### 1. Start the Backend (LangGraph Server)

```bash
cd backend

# Activate virtual environment if not already active
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Start the LangGraph development server
langgraph dev
```

The API will be available at `http://localhost:2024`

### 2. Start the Frontend

In a new terminal:

```bash
cd frontend

# Start the Vite development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

1. Open the app in your browser at `http://localhost:5173`
2. For each day you want to cook dinner:
   - Check "Want to cook dinner"
   - Optionally check "Want leftovers for lunch tomorrow" (doubles the recipe)
   - Set your time limit in minutes
3. Click "Generate Meal Plan"
4. Watch as meals are generated day by day
5. Review your shopping list at the bottom

## Project Structure

```
meal-planner/
├── backend/
│   ├── meal_agent/
│   │   ├── __init__.py
│   │   ├── agent.py          # LangGraph graph definition
│   │   ├── state.py          # State schema
│   │   ├── tools.py          # Tavily search tool
│   │   └── constants.py      # Pantry staples, etc.
│   ├── langgraph.json        # LangGraph config
│   ├── pyproject.toml        # Python dependencies
│   └── .env.example          # API key template
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom hooks
│   │   ├── types/            # TypeScript types
│   │   └── App.tsx           # Main app component
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS (via Vite)
- **Backend**: LangGraph + Python + OpenAI GPT-4 + Tavily Search
- **Communication**: Server-Sent Events (SSE) for streaming updates

## How It Works

1. User selects which days they want dinner and their constraints
2. Frontend sends the configuration to the LangGraph backend
3. For each day (sequentially):
   - Agent searches for recipes matching time constraints
   - LLM parses and structures the recipe
   - Ingredients are scaled based on leftover preference
   - Shopping list is updated (aggregating quantities)
4. Results stream back to the frontend in real-time
5. Shopping list excludes common pantry staples (salt, pepper, oil, etc.)

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key for GPT-4 |
| `TAVILY_API_KEY` | Your Tavily API key for recipe search |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | LangGraph API URL | `http://localhost:2024` |

## Troubleshooting

### Backend won't start

- Make sure you've activated the virtual environment
- Verify your API keys are set correctly in `.env`
- Try `pip install -e .` again to ensure dependencies are installed

### Frontend shows connection errors

- Make sure the backend is running on port 2024
- Check the browser console for CORS errors
- Verify `VITE_API_URL` in your `.env` file

### Meals aren't generating

- Check the backend terminal for error messages
- Verify your OpenAI and Tavily API keys are valid
- Ensure you have sufficient API credits
