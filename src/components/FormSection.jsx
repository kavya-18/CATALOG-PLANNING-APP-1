import React, { useState } from "react";

export default function FormSection({ 
  title = "Add Item", 
  buttonLabel = "Save", 
  onSubmit 
}) {

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [link, setLink] = useState("");
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("Idea");

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = () => {
    onSubmit({
      name,
      notes,
      link,
      images,
      status,
    });
  };

  return (
    <div className="form-container">

      <h1 className="page-title">{title}</h1>

      {/* Name */}
      <label className="form-label">Item Name</label>
      <input
        className="form-input"
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Notes */}
      <label className="form-label">Notes</label>
      <textarea
        className="form-textarea"
        placeholder="Write your notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      ></textarea>

      {/* Link */}
      <label className="form-label">Reference Link (Optional)</label>
      <input
        className="form-input"
        type="url"
        placeholder="https://example.com"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      {/* Image Upload */}
      <label className="form-label">Upload Images</label>
      <input
        type="file"
        multiple
        accept="image/*"
        capture="environment"
        onChange={handleImageChange}
      />

      {/* Status */}
      <label className="form-label">Status</label>
      <select
        className="form-input"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option>Idea</option>
        <option>Pending</option>
        <option>Review</option>
        <option>Completed</option>
      </select>

      {/* Save */}
      <button className="btn" onClick={handleSubmit}>
        {buttonLabel}
      </button>

    </div>
  );
}
