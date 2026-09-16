import React, { useState } from 'react';
import { X, Upload, Check, FileText } from 'lucide-react';

interface UploadTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadTimetableModal: React.FC<UploadTimetableModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const handleSimulatedUpload = (name: string) => {
    setUploadedFileName(name);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCompleted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setCompleted(false);
        setUploadedFileName(null);
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]/40 backdrop-blur-[2px] p-4 select-none">
      <div className="w-full max-w-md bg-[#F2F0E9] border border-[#121212] shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#696861] hover:text-[#121212] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="text-[10px] font-mono text-[#696861] uppercase tracking-widest mb-1">
            ACADEMIC REGISTRY INTEGRATION
          </div>
          <h2 className="text-lg font-mono font-bold text-[#121212] uppercase tracking-tight">
            IMPORT TIMETABLE MATRIX
          </h2>
          <p className="text-xs text-[#696861] mt-1 leading-relaxed">
            Upload your university timetable (.ICS, .CSV, or EVARS export) to synchronize room wayfinding vectors.
          </p>
        </div>

        {/* Upload Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleSimulatedUpload(e.dataTransfer.files[0].name);
            }
          }}
          className={`border-2 border-dashed p-6 text-center transition-colors ${
            dragActive
              ? 'border-[#153E90] bg-[#E8EEF8]'
              : 'border-[#C9C6BC] hover:border-[#121212] bg-[#FFFFFF]'
          }`}
        >
          <Upload className="w-6 h-6 text-[#153E90] mx-auto mb-2" />
          <div className="text-xs font-mono font-bold text-[#121212] uppercase">
            DROP FILE HERE OR BROWSE
          </div>
          <div className="text-[11px] font-mono text-[#696861] mt-1">
            SRM Academia CSV, iCalendar (.ics) or JSON
          </div>

          <label className="inline-block mt-3 px-3 py-1.5 bg-[#121212] text-[#FFFFFF] text-xs font-mono uppercase tracking-wider cursor-pointer hover:bg-[#153E90] transition-colors">
            SELECT LOCAL FILE
            <input
              type="file"
              accept=".csv,.ics,.json"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleSimulatedUpload(e.target.files[0].name);
                }
              }}
            />
          </label>
        </div>

        {/* Quick Sample Timetable Buttons */}
        <div className="mt-4 pt-4 border-t border-[#C9C6BC]">
          <div className="text-[10px] font-mono text-[#696861] uppercase tracking-wider mb-2">
            PRECONFIGURED PRESETS
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSimulatedUpload('CSE_SEM6_SEC_A.csv')}
              className="px-2.5 py-1.5 bg-[#FFFFFF] hover:bg-[#E8E5DC] border border-[#C9C6BC] text-left transition-colors cursor-pointer text-xs"
            >
              <div className="font-mono text-[11px] font-bold text-[#121212]">
                CSE SEM 6 (SEC A)
              </div>
              <div className="text-[10px] text-[#696861]">5 Sessions Today</div>
            </button>
            <button
              type="button"
              onClick={() => handleSimulatedUpload('ECE_SEM4_HONORS.csv')}
              className="px-2.5 py-1.5 bg-[#FFFFFF] hover:bg-[#E8E5DC] border border-[#C9C6BC] text-left transition-colors cursor-pointer text-xs"
            >
              <div className="font-mono text-[11px] font-bold text-[#121212]">
                ECE SEM 4 (HONORS)
              </div>
              <div className="text-[10px] text-[#696861]">4 Sessions Today</div>
            </button>
          </div>
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="mt-4 p-3 bg-[#E8EEF8] border border-[#153E90] text-xs font-mono text-[#153E90] flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-[#153E90] border-t-transparent animate-spin" />
            <span>PARSING TIMETABLE VECTORS: {uploadedFileName}...</span>
          </div>
        )}

        {completed && (
          <div className="mt-4 p-3 bg-[#257A55]/10 border border-[#257A55] text-xs font-mono text-[#257A55] flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>WAYFINDING MATRIX SYNCHRONIZED SUCCESSFULLY.</span>
          </div>
        )}
      </div>
    </div>
  );
};
