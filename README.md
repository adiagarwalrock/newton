# Professional Profile Management System

A full-stack application to manage professional profiles from multiple sources.

## Tech Stack

- **Frontend**: React 19 + Vite 7 + Tailwind CSS 4 + Shadcn/UI
- **Backend**: Django 5.2 + Django REST Framework 3.16

## Project Structure

```
newton/
├── backend/                 # Django backend API
│   ├── config/              # Django project settings
│   ├── professionals/       # Main app (models, views, serializers)
│   └── pyproject.toml
└── frontend/                # React frontend application
    ├── src/
    │   ├── components/      # UI components
    │   └── lib/             # Utilities and API client
    └── package.json
```

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

   Backend runs at http://localhost:8000

2. **Frontend**:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Frontend runs at http://localhost:5173

## API Endpoints

| Method | Endpoint                   | Description                              |
|--------|----------------------------|------------------------------------------|
| GET    | `/api/professionals/`      | List all (supports `?source=` filter)    |
| GET    | `/api/professionals/:id/`  | Get single professional                  |
| POST   | `/api/professionals/`      | Create single professional               |
| PUT    | `/api/professionals/:id/`  | Update professional                      |
| DELETE | `/api/professionals/:id/`  | Delete professional                      |
| POST   | `/api/professionals/bulk/` | Bulk create/update                       |

## Data Model

**Professional**:

| Field          | Type         | Notes                           |
|----------------|--------------|--------------------------------|
| `full_name`    | CharField    | Required                        |
| `email`        | EmailField   | Nullable, unique                |
| `company_name` | CharField    | Required                        |
| `job_title`    | CharField    | Required                        |
| `phone`        | CharField    | Nullable, unique                |
| `source`       | ChoiceField  | `direct`, `partner`, `internal` |
| `created_at`   | DateTimeField| Auto-generated                  |
| `updated_at`   | DateTimeField| Auto-updated                    |

**Validation Rules**:
- At least one of `email` or `phone` must be provided
- Email and phone must be unique when non-null

## Design Decisions

### Email Optionality & Bulk Upsert

- **Validation**: Email OR Phone is required. This allows for profiles where only one contact method is known.
- **Uniqueness**: Both Email and Phone are unique if present.
- **Bulk Match Logic**: When upserting (Bulk API), we match an existing record by **Email** first. If not found, we try to match by **Phone**.

### Bulk Response Format

Returns a structured JSON response to clearly indicate partial successes:

```json
{
  "created": [...],
  "updated": [...],
  "errors": [{"index": 2, "reason": "..."}]
}
```

## Extensions

### PDF Upload Logic (Proposed)

To handle PDF uploads (e.g. resumes) and parse them:

1. **Storage**: Use `django-storages` with S3/GCP to store the raw PDF file.
2. **Model**: Add `resume = FileField()` to `Professional`.
3. **Parsing**:
   - Use a background task (Celery/RQ) triggered on upload.
   - Use a library like `pdfplumber` or an LLM API to extract text.
   - Parse fields (Name, Email, etc.) and update the record.
   - **Frontend**: Add a File Upload zone in the Form.

## Seed Data Example (for Bulk API)

```json
[
  {
    "full_name": "Alice Smith",
    "email": "alice@example.com",
    "company_name": "Tech Corp",
    "job_title": "Engineer",
    "source": "direct"
  },
  {
    "full_name": "Bob Jones",
    "phone": "1234567890",
    "company_name": "Biz Inc",
    "job_title": "Manager",
    "source": "partner"
  }
]
```

## Testing

### Backend

```bash
cd backend
uv run python manage.py test
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```
