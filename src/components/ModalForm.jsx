// src/components/ModalForm.jsx

import React, { useEffect, useState } from "react";
import "../styles/modal.css";

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

  const [existingImages, setExistingImages] = useState([]);
  const [files, setFiles] = useState([]);

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

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
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
      existingImages,
      files, // NEW uploaded files
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="modal-body">

          {/* NAME */}
          <label className="form-label">Name</label>
          <input
            className="form-input"
            type="text"
            value={name}
            placeholder="Enter name"
            onChange={(e) => setName(e.target.value)}
          />

          {/* NOTES */}
          <label className="form-label">Notes</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={notes}
            placeholder="Write your notes..."
            onChange={(e) => setNotes(e.target.value)}
          />

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
                {existingImages.map((img, i) => (
                  <img key={i} src={img} className="uploaded-image" alt="preview" />
                ))}
              </div>
            </>
          )}

          {/* NEW IMAGE UPLOAD */}
          <label className="form-label">Add New Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={handleFileChange}
          />

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn secondary" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={handleSave}>Save</button>
        </div>

      </div>
    </div>
  );
}
