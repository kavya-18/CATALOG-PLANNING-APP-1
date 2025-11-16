import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";

// MOCK DATA — replace later with Firebase
const mockData = {
  "1": [
    { id: "pattu-sarees", name: "Pattu Sarees", image: "" },
    { id: "soft-silk", name: "Soft Silk", image: "" },
    { id: "organza", name: "Organza", image: "" },
  ],
  "2": [
    { id: "necklaces", name: "Necklaces", image: "" },
    { id: "earrings", name: "Earrings", image: "" },
    { id: "bangles", name: "Bangles", image: "" },
  ],
  "3": [
    { id: "stage-decor", name: "Stage Decoration", image: "" },
    { id: "entrance", name: "Entrance Setup", image: "" },
  ],
  "4": [
    { id: "haldi-bowl", name: "Haldi Bowl", image: "" },
    { id: "turmeric-decor", name: "Turmeric Decorations", image: "" },
  ],
};

export default function NodePage() {
  const { nodeId } = useParams();
  const navigate = useNavigate();

  const children = mockData[nodeId] || [];

  return (
    <div className="page-container">

      {/* Back Button */}
      <button className="btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1 className="page-title">Subcategories</h1>

      {/* Add Subcategory */}
      <button
        className="btn"
        style={{ marginBottom: "20px" }}
        onClick={() => navigate(`/add-subcategory/${nodeId}`)}
      >
        + Add Subcategory
      </button>

      {/* Subcategory Grid */}
      <div className="grid-container">
        {children.length === 0 ? (
          <p>No subcategories yet.</p>
        ) : (
          children.map((item, index) => (
            <CategoryCard
              key={index}
              name={item.name}
              image={item.image}
              onClick={() =>
                navigate(`/item/${nodeId}/${index}/${item.id}`)
              }
            />
          ))
        )}
      </div>

      {/* Add Item Button */}
      <button
        className="btn"
        style={{ marginTop: "30px" }}
        onClick={() => navigate(`/item/${nodeId}/0/new/add`)}
      >
        + Add Item
      </button>

    </div>
  );
}
