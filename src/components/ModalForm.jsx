// src/components/ModalForm.jsx
import React, { useEffect, useState } from "react";
import "../styles/modal.css";
import { startSpeechRecognition } from "../utils/speechToText";

export default function ModalForm({
  open,
  title = "Add Item",
  initialData = null,
  onSubmit,
  onClose,
}) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("Idea");

  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Which field is currently being voice-recorded
  const [listeningField, setListeningField] = useState(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setNotes(initialData.notes || "");
      setLink(initialData.link || "");
      setStatus(initialData.status || "Idea");
      setExistingImages(initialData.images || []);
      setFiles([]);
    } else {
      setName("");
      setNotes("");
      setLink("");
      setStatus("Idea");
      setExistingImages([]);
      setFiles([]);
    }
  }, [initialData, open]);

  if (!open) return null;

  // 🎤 Universal mic handler
  const handleMic = (field) => {
    setListeningField(field);

    startSpeechRecognition({
      onStart: () => setListeningField(field),
      onResult: (text) => {
        if (field === "name") setName(text);
        if (field === "notes") setNotes(text);
      },
      onEnd: () => setListeningField(null),
    });
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a name.");
      return;
    }

    onSubmit({
      name,
      notes,
      link,
      status,
      files,
      existingImages,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        {/* HEADER */}
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          {/* NAME + MIC */}
          <label className="form-label">Name</label>
          <div className="input-with-mic">
            <input
              className="form-input"
              type="text"
              value={name}
              placeholder="Say the name…"
              onChange={(e) => setName(e.target.value)}
            />

            <button
              className={`mic-btn ${listeningField === "name" ? "listening" : ""}`}
              onClick={() => handleMic("name")}
            >
              🎤
            </button>
          </div>

          {listeningField === "name" && (
            <div className="listening-text">Listening…</div>
          )}

          {/* NOTES + MIC */}
          <label className="form-label">Notes</label>
          <div className="input-with-mic">
            <textarea
              className="form-textarea"
              rows={3}
              value={notes}
              placeholder="Speak notes…"
              onChange={(e) => setNotes(e.target.value)}
            />
            <button
              className={`mic-btn ${listeningField === "notes" ? "listening" : ""}`}
              onClick={() => handleMic("notes")}
            >
              🎤
            </button>
          </div>

          {listeningField === "notes" && (
            <div className="listening-text">Listening…</div>
          )}

          {/* LINK */}
          <label className="form-label">Reference Link</label>
          <input
            className="form-input"
            type="url"
            value={link}
            placeholder="https://example.com"
            onChange={(e) => setLink(e.target.value)}
          />

          {/* STATUS */}
          <label className="form-label">Status</label>
          <select
            className="form-input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Idea">Idea</option>
            <option value="Pending">Pending</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>

          {/* EXISTING IMAGES */}
          {existingImages.length > 0 && (
            <>
              <label className="form-label">Existing Images</label>
              <div className="image-preview-row">
                {existingImages.map((url, idx) => (
                  <img key={idx} src={url} className="uploaded-image" />
                ))}
              </div>
            </>
          )}

          {/* NEW UPLOAD */}
          <label className="form-label">Upload New Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />

        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="btn secondary" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={handleSave}>Save</button>
        </div>

      </div>
    </div>
  );
}
