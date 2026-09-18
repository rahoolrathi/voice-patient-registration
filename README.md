# Voice AI Agent — Patient Registration System

A voice-based AI agent that answers real phone calls, conversationally collects
patient demographic information, saves it to a persistent database, and exposes
it through a REST API.

**Live API base URL:** `https://voice-patient-registration-production-173b.up.railway.app`
**Phone number to call:** `+1 (774) 247-8060`

---

## Architecture

```
Phone Call (Caller)
        │
        ▼
   Vapi (Telephony + STT/TTS + LLM orchestration)
        │  system prompt + 3 tool definitions
        ▼
POST /vapi/tool-call  ─────────────┐
        │                          │
        ▼                          ▼
Express API (Node.js) ──────► Neon PostgreSQL (persistent)
        │
        ▼
REST endpoints: GET/POST/PUT/DELETE /patients
```

- **Telephony + Voice AI:** [Vapi](https://vapi.ai) — handles the phone number,
  speech-to-text, text-to-speech, and turn-taking. The conversation logic lives
  in a system prompt + three function ("tool") definitions that Vapi calls
  during the conversation.
- **LLM:** GPT-4.1 (configured inside the Vapi assistant)
- **Backend:** Node.js + Express
- **ORM:** Sequelize (model, migration, and seeder files — no raw SQL)
- **Database:** Neon (serverless PostgreSQL) — persists across restarts
- **Hosting:** Railway

## Why this stack

- **Vapi over raw Twilio+STT/TTS:** abstracts the hardest parts of a voice
  agent (natural turn-taking, interruption handling, streaming STT/TTS) into
  configuration rather than custom code, which was the fastest path to a
  *working, natural-sounding* agent within the time constraint.
- **Neon over local Postgres/SQLite:** serverless, free, and already
  accessible over the internet — no extra step needed to make the database
  reachable from Railway.
- **Sequelize over raw `pg`:** gives real migration files (version-controlled
  schema changes) and a model definition that documents the schema in one
  place, plus built-in soft-delete ("paranoid" mode) instead of hand-rolling
  `deleted_at` filtering everywhere.
- **Railway over ngrok:** ngrok tunnels aren't stable/persistent — Vapi needs
  a permanent public HTTPS URL for its tool calls, so a real deploy was
  necessary rather than just a dev tunnel.

## Project structure

```
├── config/
│   ├── config.js        # DB config used by the Sequelize CLI (migrations)
│   └── database.js       # DB connection used by the running app
├── enums/
│   └── patient.enums.js  # allowed "sex" values
├── models/
│   └── patient.model.js  # the patients table schema, in Sequelize form
├── migrations/            # versioned schema changes (run via `npm run migrate`)
├── seeders/                # optional demo data (run via `npm run seed`)
├── repositories/
│   └── patient.repository.js  # all Sequelize queries live here
├── controllers/
│   ├── patient.controller.js  # the 5 REST endpoint handlers
│   └── vapi.controller.js      # handles Vapi's tool-call webhook
├── routes/
│   ├── patients.js
│   └── vapi.js
├── utils/
│   ├── response.js       # { data, error } response envelope
│   └── validation.js     # server-side field validation
└── server.js
```

## Setup instructions

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your own Neon connection string:
   ```
   DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
   PORT=3000
   ```
3. Run the migration to create the `patients` table:
   ```bash
   npm run migrate
   ```
4. (Optional) Seed two sample patients:
   ```bash
   npm run seed
   ```
5. Start the server:
   ```bash
   npm start
   ```
6. Confirm it's running:
   ```
   GET http://localhost:3000/health
   → { "data": { "status": "ok" }, "error": null }
   ```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Neon Postgres connection string (SSL required) |
| `PORT` | No | Defaults to 3000 |

No API keys are hardcoded anywhere in the source — the LLM key used by the
voice agent lives inside Vapi's own dashboard configuration, not in this repo.

## REST API

All responses use the envelope `{ "data": ..., "error": ... }`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/patients` | List patients. Supports `?last_name=`, `?date_of_birth=`, `?phone_number=` |
| GET | `/patients/:id` | Get one patient by UUID |
| POST | `/patients` | Create a patient |
| PUT | `/patients/:id` | Partially update a patient |
| DELETE | `/patients/:id` | Soft-delete a patient (`deleted_at` is set, row is kept) |

A Postman collection covering all endpoints (plus example Vapi tool-call
payloads) is included in this repo for manual testing.

## Voice agent design

The Vapi assistant's system prompt instructs it to:
1. Ask for the caller's phone number and call `find_patient_by_phone` to check
   for an existing record (bonus: duplicate detection).
2. Collect all required demographic fields conversationally (not as a rigid
   script), then offer the optional fields (insurance, emergency contact,
   preferred language) as an opt-in.
3. Read back everything collected and ask the caller to confirm or correct it
   before saving.
4. Call `create_patient` (new patient) or `update_patient` (returning
   patient) once confirmed.
5. Re-prompt for a single field if the caller gives invalid input (e.g. a
   future date of birth), rather than restarting the whole conversation.

The full system prompt is included in this repo as `vapi-system-prompt.txt`.

### Tools

| Tool | Purpose |
|---|---|
| `find_patient_by_phone` | Looks up a patient by phone number (duplicate detection) |
| `create_patient` | Creates a new patient record |
| `update_patient` | Updates an existing patient's record |

All three tools point at the same webhook: `POST /vapi/tool-call`, which
dispatches to the matching database operation and returns the result back to
Vapi in the format it expects.

## Known limitations / trade-offs

- **`update_patient` path has an intermittent issue.** During testing, a
  returning-caller flow (`find_patient_by_phone` → `update_patient`)
  surfaced an error where the update did not complete successfully. The
  `create_patient` flow (new patient registration) was tested repeatedly and
  works reliably end-to-end, including over the live phone number. Given time
  constraints, this was deprioritized since duplicate detection/update is
  listed as a bonus feature in the assessment, not a core requirement.
- **Outbound self-testing of the live number was limited** by Vapi's free-tier
  daily outbound call cap — inbound calling (the actual requirement, since
  the reviewer calls in) is unaffected by this limit. The full conversational
  flow was validated repeatedly using Vapi's in-browser test-call feature,
  which exercises the identical assistant, prompt, and tools as the live
  phone number.
- **No automated tests** were written for the API layer, due to time
  constraints.
- **No appointment scheduling, multi-language support, call transcripts, or
  dashboard UI** were implemented — these were bonus items not required for
  the core submission.

