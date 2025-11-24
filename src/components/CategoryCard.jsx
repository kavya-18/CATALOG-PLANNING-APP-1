import React from "react";
import "../styles/card.css";

const CategoryCard = ({
  title,
  images = [],
  notes,
  status,
  onEdit,
  onDelete,
  onClick,
  isAddCard = false,
  onAdd
}) => {
  if (isAddCard) {
    return (
      <div className="category-card add-card" onClick={onAdd}>
        <div className="add-card-plus">+</div>
        <div className="add-card-text">Add New</div>
      </div>
    );
  }

  return (
    <div className="category-card" onClick={onClick}>
      {/* Status Badge */}
      {status && (
        <div className={`status-badge status-${status.toLowerCase()}`}>
          {status}
        </div>
      )}

      {/* Card Actions (edit/delete) */}
      <div className="card-actions" onClick={(e) => e.stopPropagation()}>
        <button className="icon-button edit-btn" onClick={onEdit}>✎</button>
        <button className="icon-button delete-btn" onClick={onDelete}>✕</button>
      </div>

      {/* Image */}
      <div className="card-image-wrapper">
        {images.length > 0 ? (
          <img src={images[0]} className="card-image" />
        ) : (
          <div className="card-image placeholder">No Image</div>
        )}
      </div>

      <div className="card-title">{title}</div>
      <div className="card-link">Notes:</div>
      <div className="notes-preview">{notes ? notes : "No notes yet"}</div>
    </div>
  );
};

export default CategoryCard;
