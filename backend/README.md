# Backend

Django REST Framework backend for Professional Profile Management.

## Tech Stack

Django 5.2 + DRF 3.16 + Python 3.11+ + SQLite

## Setup

```bash
uv sync
uv run python manage.py migrate
uv run python manage.py runserver  # http://localhost:8000
```

## Commands

| Command | Description |
|---------|-------------|
| `uv run python manage.py runserver` | Dev server |
| `uv run python manage.py migrate` | Apply migrations |
| `uv run python manage.py test` | Run tests |
| `uv run python manage.py load_sample_data` | Load sample data |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/professionals/` | List (supports `?source=` filter) |
| POST | `/api/professionals/` | Create |
| GET/PUT/PATCH/DELETE | `/api/professionals/:id/` | Single resource |
| POST | `/api/professionals/bulk/` | Bulk upsert |

## Bulk API

- Matches by email first, then phone
- Returns: `{ created: [], updated: [], errors: [{ index, reason }] }`

## Model

**Professional**: `full_name`, `email` (unique, nullable), `company_name`, `job_title`, `phone` (unique, nullable), `source`, `created_at`, `updated_at`

Validation: At least one of `email` or `phone` required.
