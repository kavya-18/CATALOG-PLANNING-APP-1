import React, { useEffect, useState } from "react";
import "../styles/modal.css";
import { startSpeechRecognition } from "../utils/speechToText";

const STATUS_OPTIONS = ["Idea", "Pending", "Started", "Completed"];

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

  const handleDeleteExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a name.");
      return;
    }

    onSubmit({
      name: name.trim(),
      notes: notes.trim(),
      link: link.trim(),
      status,
      files,
      existingImages,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* NAME */}
          <label className="form-label">Name</label>
          <div className="input-with-mic">
            <input
              className="form-input"
              type="text"
              value={name}
              placeholder="Say or type the name…"
              onChange={(e) => setName(e.target.value)}
            />
            <button
              className={`mic-btn ${
                listeningField === "name" ? "listening" : ""
              }`}
              type="button"
              onClick={() => handleMic("name")}
            >
              🎤
            </button>
          </div>

          {listeningField === "name" && (
            <div className="listening-text">Listening for name…</div>
          )}

          {/* NOTES */}
          <label className="form-label">Notes</label>
          <div className="input-with-mic">
            <textarea
              className="form-textarea"
              rows={3}
              value={notes}
              placeholder="Notes about this category/item…"
              onChange={(e) => setNotes(e.target.value)}
            />
            <button
              className={`mic-btn ${
                listeningField === "notes" ? "listening" : ""
              }`}
              type="button"
              onClick={() => handleMic("notes")}
            >
              🎤
            </button>
          </div>

          {listeningField === "notes" && (
            <div className="listening-text">Listening for notes…</div>
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
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* EXISTING IMAGES */}
          {existingImages.length > 0 && (
            <>
              <label className="form-label">Existing Images</label>
              <div className="image-preview-row">
                {existingImages.map((url, idx) => (
                  <div key={idx} className="image-thumb-wrapper">
                    <img src={url} className="uploaded-image" alt="" />
                    <button
                      type="button"
                      className="delete-image-btn"
                      onClick={() => handleDeleteExistingImage(idx)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* NEW IMAGES */}
          <label className="form-label">Upload New Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
        </div>

        <div className="modal-footer">
          <button className="btn secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" type="button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
