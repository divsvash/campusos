import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import { normalizeParsedTimetable } from './src/lib/timetable';

const app = express();
const port = Number(process.env.PORT || 3000);
const rootDir = path.dirname(fileURLToPath(import.meta.url));
const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

app.use(express.json({ limit: '15mb' }));

app.post('/api/timetable/parse', async (request, response) => {
  try {
    const { data, mimeType } = request.body as { data?: unknown; mimeType?: unknown };

    if (typeof data !== 'string' || typeof mimeType !== 'string') {
      response.status(400).json({ error: 'A timetable file and MIME type are required.' });
      return;
    }

    if (!allowedMimeTypes.has(mimeType)) {
      response.status(415).json({ error: 'Upload a PNG, JPEG, WebP, or PDF timetable.' });
      return;
    }

    if (!/^[A-Za-z0-9+/=]+$/.test(data) || data.length > 14_000_000) {
      response.status(413).json({ error: 'The uploaded file is invalid or too large.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      response.status(503).json({ error: 'Gemini is not configured on this server.' });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { data, mimeType } },
          {
            text: `Extract this university class timetable faithfully.

Rules:
- Read the timetable grid, subject legend, faculty names, course, department, semester, section, and default classroom.
- Produce one session per actual class block. If a lab spans two periods, return one session covering the full time range.
- Use 24-hour HH:MM times.
- Expand MON/TUE/WED/THU/FRI/SAT to full uppercase weekday names.
- Resolve subject names and faculty from the legend wherever possible.
- If a class cell has no explicit room, use the timetable's default classroom.
- Never invent a room, floor, faculty member, or subject name.
- floorId may only be 00, 01, 02, 03, 04, 05, or null. Infer it only from an unambiguous room number such as LH 406 -> 04 or Lab 003 -> 00. Ambiguous codes such as C-13 must use null.
- Put uncertainty, illegible cells, and conflicting information in warnings.
- Ignore BREAK and LUNCH cells.
- Return JSON only.`,
          },
        ],
      }],
      config: {
        temperature: 0,
        responseMimeType: 'application/json',
        responseJsonSchema: {
          type: 'object',
          additionalProperties: false,
          required: ['course', 'department', 'semester', 'section', 'defaultRoom', 'subjects', 'sessions', 'warnings'],
          properties: {
            course: { type: 'string' },
            department: { type: 'string' },
            semester: { type: 'string' },
            section: { type: 'string' },
            defaultRoom: { type: 'string' },
            subjects: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['code', 'name', 'faculty'],
                properties: {
                  code: { type: 'string' },
                  name: { type: 'string' },
                  faculty: { type: 'array', items: { type: 'string' } },
                },
              },
            },
            sessions: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['id', 'day', 'startTime', 'endTime', 'subjectCode', 'subjectName', 'faculty', 'roomCode', 'floorId', 'sessionType'],
                properties: {
                  id: { type: 'string' },
                  day: { type: 'string', enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] },
                  startTime: { type: 'string' },
                  endTime: { type: 'string' },
                  subjectCode: { type: 'string' },
                  subjectName: { type: 'string' },
                  faculty: { type: 'array', items: { type: 'string' } },
                  roomCode: { type: 'string' },
                  floorId: { anyOf: [{ type: 'string', enum: ['00', '01', '02', '03', '04', '05'] }, { type: 'null' }] },
                  sessionType: { type: 'string', enum: ['LECTURE', 'LAB', 'TRAINING', 'OTHER'] },
                },
              },
            },
            warnings: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    });

    if (!result.text) throw new Error('Gemini returned an empty response.');
    const timetable = normalizeParsedTimetable(JSON.parse(result.text));
    response.json({ timetable });
  } catch (error) {
    console.error('Timetable parsing failed:', error);
    response.status(502).json({
      error: error instanceof Error ? error.message : 'Unable to parse the timetable.',
    });
  }
});

async function start() {
  const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('--production');
  if (isProduction) {
    app.use(express.static(path.join(rootDir, 'dist')));
    app.get('*', (_request, response) => {
      response.sendFile(path.join(rootDir, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: rootDir,
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CampusOS running on http://localhost:${port}`);
  });
}

void start();
