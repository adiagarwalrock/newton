# Backend - NewtonX Challenge

This is the Django backend for the Professional Profile Management system.

## Setup

1. **Install uv**: `curl -LsSf https://astral.sh/uv/install.sh | sh` (or `pip install uv`)
2. **Install dependencies**:

    ```bash
    uv sync
    ```

3. **Run Migrations**:

    ```bash
    uv run python manage.py migrate
    ```

4. **Run Server**:

    ```bash
    uv run python manage.py runserver
    ```

## API Endpoints

- `GET /api/professionals/`: List professionals. Supports `?source=<source>` filtering.
- `POST /api/professionals/`: Create a single professional.
- `POST /api/professionals/bulk/`: Bulk upsert professionals.

### Bulk API Behavior

- **Strategy**: Tries to match by Email first, then Phone.
- **Response**: `{ created: [], updated: [], errors: [] }` keys containing lists of results/errors.
