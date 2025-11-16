import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NodeForm() {
  const navigate = useNavigate();

  // ---------- FORM STATES ----------
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("idea");
  const [files, setFiles] = useState(null);

  // ---------- SUBMIT ----------
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Saved:", {
      name,
      notes,
      link,
      status,
      files,
    });

    alert("Saved (mock)!");
  };

  return (
    <div className="page-container">

      {/* Back Button */}
      <button className="btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1 className="page-title">Add New Category</h1>

      {/* ---------- FORM UI ---------- */}
      <form className="form-container" onSubmit={handleSubmit}>

        {/* NAME */}
        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* NOTES */}
        <div className="form-group">
          <label>Notes</label>
          <textarea
            placeholder="Write your notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
          ></textarea>
        </div>

        {/* LINK */}
        <div className="form-group">
          <label>Reference Link (Optional)</label>
          <input
            type="text"
            placeholder="https://example.com"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        {/* FILE UPLOAD */}
        <div className="form-group">
          <label>Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>

        {/* STATUS */}
        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="idea">Idea</option>
            <option value="pending">Pending</option>
            <option value="review">Review</option>
            <option value="complete">Complete</option>
          </select>
        </div>

        {/* SAVE BUTTON */}
        <button type="submit" className="save-btn">
          Save
        </button>
      </form>
    </div>
  );
}
