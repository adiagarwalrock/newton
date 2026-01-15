# NewtonX Engineer Take Home Challenge - 2026.01

Full-stack application to manage professional profiles.

## Structure

- `backend/`: Django + DRF + uv
- `frontend/`: React + Vite + Shadcn UI

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- `uv` (Python package manager)

### Quick Start

1. **Backend**:

   ```bash
   cd backend
   uv sync
   uv run python manage.py migrate
   uv run python manage.py runserver
   ```

2. **Frontend**:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```
