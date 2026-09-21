# CampusOS

CampusOS is an interactive SRM campus wayfinding application. It combines a 3D campus model with timetable-aware navigation so students can move from their daily schedule to the correct building, floor, and room.

## Local setup

Requirements: Node.js 20 or newer.

```bash
npm install
cp .env.example .env
npm run dev
```

Add a Google AI Studio Gemini API key to `.env`:

```dotenv
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

The key is used only by the Express server. It is never included in the browser bundle.

## Commands

```bash
npm run dev      # Express API + Vite development middleware
npm run lint     # TypeScript validation
npm run build    # Production client build
npm run start    # Serve the production build and API
```

## Timetable import

The timetable importer accepts PNG, JPEG, WebP, and PDF files up to 8 MB. Gemini extracts the timetable into structured data, which is validated on the server and shown to the student for confirmation before it changes the active schedule.

Ambiguous floor information is deliberately left unconfirmed. For example, `LH 406` maps to level `04`, while a code such as `C-13` remains unknown until the student confirms it.
