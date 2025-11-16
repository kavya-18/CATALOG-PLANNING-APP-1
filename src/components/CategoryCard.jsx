import React from "react";
import "../styles/card.css";

export default function CategoryCard({ name, image, onClick }) {
  return (
    <div className="card category-card" onClick={onClick}>
      <div className="card-image-wrapper">
        <img
          src={image || "https://via.placeholder.com/300x200?text=No+Image"}
          alt={name}
          className="card-image"
        />
      </div>

      <div className="card-title">{name}</div>
    </div>
  );
}
