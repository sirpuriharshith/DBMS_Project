# Rentora Backend Setup

1. Create/activate a Python 3.13 virtual environment.
2. Install `requirements.txt`.
3. Create `backend/.env` from `.env.example` and set `DATABASE_URL` to your PostgreSQL password.
4. Keep `ADMIN_SECOND_PASSWORD` as the private admin password for the demo, or replace it with your own value.
5. Start the API with `python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000`.
6. Open `http://127.0.0.1:8000/docs` to inspect the API.

Admin demo login uses:
- Email: `admin@rentora.com`
- Primary password: `123456`
- Second password: `Rentora@Admin2026`

The second password is kept outside the users table and is checked by the backend before an admin JWT is issued.
