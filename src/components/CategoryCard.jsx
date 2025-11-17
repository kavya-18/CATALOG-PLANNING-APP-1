// src/components/CategoryCard.jsx
import "../styles/card.css";

export default function CategoryCard({
  name,
  image,
  status,
  link,
  onClick,
  onEdit,
  onDelete,
  isAddCard = false,
}) {
  return (
    <div className="card-wrapper">

      {/* ADD NEW CARD LOOK */}
      {isAddCard ? (
        <div className="add-card" onClick={onClick}>
          <div className="add-symbol">＋</div>
          <div className="card-title">Add New</div>
        </div>
      ) : (
        <div className="category-card" onClick={onClick}>
          
          {/* STATUS BADGE */}
          {status && (
            <div className={`status-badge status-${status.toLowerCase()}`}>
              {status}
            </div>
          )}

          {/* Edit & Delete Icons */}
          <div className="card-actions">
            <span
              className="edit-icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit();
              }}
            >
              ✎
            </span>

            <span
              className="delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete();
              }}
            >
              ✕
            </span>
          </div>

          {/* IMAGE */}
          <div className="card-image-wrapper">
            <img
              src={
                image
                  ? image
                  : "https://via.placeholder.com/400x260?text=No+Image"
              }
              alt={name}
              className="card-image"
            />
          </div>

          {/* NAME */}
          <div className="card-title">{name}</div>

          {/* LINK BUTTON IF PRESENT */}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="card-link-btn"
              onClick={(e) => e.stopPropagation()}
            >
              View Link ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}
