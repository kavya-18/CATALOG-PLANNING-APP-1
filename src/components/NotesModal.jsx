import React, { useEffect, useState } from "react";
import "../styles/modal.css";

export default function NotesModal({ open, initialNotes, onSave, onClose }) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setNotes(initialNotes || "");
  }, [initialNotes, open]);

  if (!open) return null;

  const handleSave = () => {
    onSave(notes);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">Notes</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <textarea
            className="form-textarea"
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your notes here…"
          />
        </div>

        <div className="modal-footer">
          <button className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
