import React, { useState } from "react";
import "../styles/card.css";

export default function CategoryCard({
  name,
  image,
  status,
  link,
  notes,             // ✅ We now accept notes safely
  isAddCard = false,
  onClick,
  onEdit,
  onDelete,
}) {
  // Special Add New card
  if (isAddCard) {
    return (
      <button className="category-card add-card" onClick={onClick}>
        <div className="add-card-plus">+</div>
        <div className="add-card-text">Add New</div>
      </button>
    );
  }

  // Convert images to array
  const imagesArray = Array.isArray(image) ? image : image ? [image] : [];

  // Image slider state
  const [currentIndex, setCurrentIndex] = useState(0);

  const showPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i === 0 ? imagesArray.length - 1 : i - 1));
  };

  const showNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((i) =>
      i === imagesArray.length - 1 ? 0 : i + 1
    );
  };

  // Notes popup
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div className="category-card" onClick={onClick}>
      
      {/* Status Badge */}
      {status && (
        <span className={`status-badge status-${status.toLowerCase()}`}>
          {status}
        </span>
      )}

      {/* Edit/Delete */}
      <div className="card-actions" onClick={(e) => e.stopPropagation()}>
        {onEdit && (
          <button className="icon-button edit-btn" onClick={onEdit}>✎</button>
        )}
        {onDelete && (
          <button className="icon-button delete-btn" onClick={onDelete}>✕</button>
        )}
      </div>

      {/* Image Viewer */}
      <div className="image-viewer">
        {imagesArray.length > 0 ? (
          <>
            <img
              src={imagesArray[currentIndex]}
              alt={name}
              className="viewer-img"
            />

            {/* Left Arrow */}
            {imagesArray.length > 1 && (
              <button className="nav-arrow left-arrow" onClick={showPrev}>
                ‹
              </button>
            )}

            {/* Right Arrow */}
            {imagesArray.length > 1 && (
              <button className="nav-arrow right-arrow" onClick={showNext}>
                ›
              </button>
            )}
          </>
        ) : (
          <div className="card-image placeholder">No Image</div>
        )}
      </div>

      {/* Title */}
      <div className="card-title">{name}</div>

      {/* Visit + Notes buttons */}
      <div className="card-links">
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="card-link"
          >
            🔗 Visit
          </a>
        )}

        {notes && notes.trim() !== "" && (
          <button
            className="card-link notes-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowNotes(true);
            }}
          >
            📝 Notes
          </button>
        )}
      </div>

      {/* Notes Modal */}
      {showNotes && (
        <div className="notes-modal-overlay" onClick={() => setShowNotes(false)}>
          <div
            className="notes-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setShowNotes(false)}>
              ✕
            </button>

            <h3 className="notes-title">Notes</h3>
            <p className="notes-content">{notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
