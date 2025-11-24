import React, { useState, useEffect } from "react";
import "../styles/modal.css";

const STATUSES = ["Idea", "Pending", "Started", "Completed"];

export default function StatusModal({ open, initialStatus, onSave, onClose }) {
  const [status, setStatus] = useState("Idea");

  useEffect(() => {
    setStatus(initialStatus || "Idea");
  }, [initialStatus, open]);

  if (!open) return null;

  const handleSave = () => {
    onSave(status);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">Update Status</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="status-pill-row">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                className={`status-pill status-pill-${s.toLowerCase()} ${
                  status === s ? "active" : ""
                }`}
                onClick={() => setStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
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
