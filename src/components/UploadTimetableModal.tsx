import React, { useState } from 'react';
import { AlertTriangle, Check, FileImage, LoaderCircle, Upload, X } from 'lucide-react';
import { ParsedTimetable, ParsedTimetableSession } from '../types';

interface UploadTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (timetable: ParsedTimetable) => void;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_FILE_SIZE = 8 * 1024 * 1024;

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Unable to read the selected file.'));
        return;
      }
      resolve(result.split(',')[1] || '');
    };
    reader.onerror = () => reject(new Error('Unable to read the selected file.'));
    reader.readAsDataURL(file);
  });

export const UploadTimetableModal: React.FC<UploadTimetableModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState<ParsedTimetable | null>(null);

  if (!isOpen) return null;

  const reset = () => {
    setDragActive(false);
    setFileName('');
    setIsProcessing(false);
    setError('');
    setDraft(null);
  };

  const close = () => {
    reset();
    onClose();
  };

  const processFile = async (file: File) => {
    setError('');
    setDraft(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Upload a PNG, JPEG, WebP, or PDF timetable.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('The timetable must be smaller than 8 MB.');
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    try {
      const data = await fileToBase64(file);
      const response = await fetch('/api/timetable/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, mimeType: file.type }),
      });
      const body = await response.json() as { timetable?: ParsedTimetable; error?: string };
      if (!response.ok || !body.timetable) throw new Error(body.error || 'The timetable could not be parsed.');
      setDraft(body.timetable);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The timetable could not be parsed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateSession = (
    sessionId: string,
    field: keyof Pick<ParsedTimetableSession, 'day' | 'startTime' | 'endTime' | 'subjectName' | 'roomCode' | 'floorId'>,
    value: string
  ) => {
    if (!draft) return;
    setDraft({
      ...draft,
      sessions: draft.sessions.map((session) => session.id === sessionId
        ? { ...session, [field]: field === 'floorId' ? value || null : value }
        : session),
    });
  };

  const confirm = () => {
    if (!draft) return;
    onSuccess(draft);
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]/55 p-3 md:p-6">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-hidden bg-[#F2F0E9] border border-[#121212] shadow-2xl flex flex-col">
        <header className="p-4 md:p-5 border-b border-[#121212] flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono text-[#153E90] uppercase tracking-widest mb-1">Gemini timetable extraction</div>
            <h2 className="text-lg font-mono font-bold text-[#121212] uppercase tracking-tight">
              {draft ? 'Review extracted schedule' : 'Upload timetable'}
            </h2>
            <p className="text-xs text-[#696861] mt-1">
              {draft ? 'Correct uncertain fields before this schedule controls your campus view.' : 'Upload the official timetable image or PDF. Nothing is saved until you confirm it.'}
            </p>
          </div>
          <button type="button" onClick={close} aria-label="Close timetable importer" className="text-[#696861] hover:text-[#121212]"><X className="w-5 h-5" /></button>
        </header>

        <div className="overflow-y-auto p-4 md:p-5">
          {!draft && (
            <div
              onDragOver={(event) => { event.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(event) => { event.preventDefault(); setDragActive(false); const file = event.dataTransfer.files[0]; if (file) void processFile(file); }}
              className={`border-2 border-dashed min-h-64 flex flex-col items-center justify-center p-8 text-center transition-colors ${dragActive ? 'border-[#153E90] bg-[#E8EEF8]' : 'border-[#9A978F] bg-[#FFFFFF]'}`}
            >
              {isProcessing ? (
                <>
                  <LoaderCircle className="w-8 h-8 text-[#153E90] animate-spin mb-4" />
                  <div className="font-mono text-sm font-bold">READING {fileName.toUpperCase()}</div>
                  <div className="font-mono text-[11px] text-[#696861] mt-2">Extracting periods, subjects, rooms and faculty…</div>
                </>
              ) : (
                <>
                  <FileImage className="w-8 h-8 text-[#153E90] mb-4" />
                  <div className="font-mono text-sm font-bold uppercase">Drop timetable here</div>
                  <div className="font-mono text-[11px] text-[#696861] mt-2">PNG, JPEG, WEBP OR PDF · MAX 8 MB</div>
                  <label className="mt-5 px-4 py-2 bg-[#121212] text-[#FFFFFF] text-xs font-mono uppercase tracking-wider cursor-pointer hover:bg-[#153E90] flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" /> Select file
                    <input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void processFile(file); event.currentTarget.value = ''; }} />
                  </label>
                </>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 border border-[#F04B23] bg-[#F04B23]/5 text-xs text-[#9F2A10] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /><span>{error}</span>
            </div>
          )}

          {draft && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 border border-[#C9C6BC] bg-[#FFFFFF] mb-4">
                {[
                  ['COURSE', draft.course], ['DEPARTMENT', draft.department], ['SEMESTER', draft.semester],
                  ['SECTION', draft.section], ['DEFAULT ROOM', draft.defaultRoom || 'NOT FOUND'],
                ].map(([label, value]) => (
                  <div key={label} className="p-3 border-r border-b md:border-b-0 border-[#C9C6BC] last:border-r-0">
                    <div className="text-[9px] font-mono text-[#696861] tracking-wider">{label}</div>
                    <div className="text-xs font-semibold mt-1 truncate" title={value}>{value || '—'}</div>
                  </div>
                ))}
              </div>

              {draft.warnings.length > 0 && (
                <div className="mb-4 p-3 border border-[#D58A13] bg-[#FFF8E8] text-xs">
                  <div className="font-mono font-bold text-[#8A5608] mb-1">CHECK THESE ITEMS</div>
                  <ul className="list-disc pl-4 text-[#6A4A18] space-y-1">{draft.warnings.map((warning, index) => <li key={`${warning}-${index}`}>{warning}</li>)}</ul>
                </div>
              )}

              <div className="border border-[#121212] overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse bg-[#FFFFFF] text-xs">
                  <thead className="bg-[#121212] text-[#FFFFFF] font-mono text-[10px] uppercase tracking-wider">
                    <tr>{['Day', 'Start', 'End', 'Subject', 'Room', 'Floor'].map((heading) => <th key={heading} className="p-2 text-left">{heading}</th>)}</tr>
                  </thead>
                  <tbody>
                    {draft.sessions.map((session) => (
                      <tr key={session.id} className="border-b border-[#C9C6BC] last:border-b-0">
                        <td className="p-1.5"><select value={session.day} onChange={(e) => updateSession(session.id, 'day', e.target.value)} className="w-full border border-[#C9C6BC] p-1.5 bg-white font-mono">{['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].map((day) => <option key={day}>{day}</option>)}</select></td>
                        <td className="p-1.5"><input type="time" value={session.startTime} onChange={(e) => updateSession(session.id, 'startTime', e.target.value)} className="w-full border border-[#C9C6BC] p-1.5 font-mono" /></td>
                        <td className="p-1.5"><input type="time" value={session.endTime} onChange={(e) => updateSession(session.id, 'endTime', e.target.value)} className="w-full border border-[#C9C6BC] p-1.5 font-mono" /></td>
                        <td className="p-1.5"><input value={session.subjectName} onChange={(e) => updateSession(session.id, 'subjectName', e.target.value)} className="w-full min-w-48 border border-[#C9C6BC] p-1.5" /></td>
                        <td className="p-1.5"><input value={session.roomCode} onChange={(e) => updateSession(session.id, 'roomCode', e.target.value.toUpperCase())} className="w-full border border-[#C9C6BC] p-1.5 font-mono" /></td>
                        <td className="p-1.5"><select value={session.floorId ?? ''} onChange={(e) => updateSession(session.id, 'floorId', e.target.value)} className="w-full border border-[#C9C6BC] p-1.5 bg-white font-mono"><option value="">UNKNOWN</option>{['00', '01', '02', '03', '04', '05'].map((floor) => <option key={floor}>{floor}</option>)}</select></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {draft && (
          <footer className="p-4 border-t border-[#121212] flex items-center justify-between gap-3 bg-[#E8E5DC]">
            <button type="button" onClick={() => { setDraft(null); setError(''); }} className="px-3 py-2 border border-[#121212] text-xs font-mono uppercase hover:bg-white">Upload another</button>
            <button type="button" onClick={confirm} className="px-4 py-2 bg-[#153E90] text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2 hover:bg-[#121212]"><Check className="w-4 h-4" />Use {draft.sessions.length} sessions</button>
          </footer>
        )}
      </div>
    </div>
  );
};
