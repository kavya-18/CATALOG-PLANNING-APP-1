// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";

export default function HomePage({ tree, saveTree }) {
  const navigate = useNavigate();

  const categories = tree.children || [];

  // ---------------------------------------------
  // DELETE a top-level category
  // ---------------------------------------------
  const deleteCategory = (id) => {
    saveTree((prev) => ({
      ...prev,
      children: prev.children.filter((c) => c.id !== id),
    }));
  };

  // ---------------------------------------------
  // EDIT a root category (use NodePage modal)
  // ---------------------------------------------
  const editCategory = (node) => {
    navigate(`/node/${node.id}?edit=1`);
  };

  // ---------------------------------------------
  // Navigate to Node (subcategory view)
  // ---------------------------------------------
  const openCategory = (id) => {
    navigate(`/node/${id}`);
  };

  // ---------------------------------------------
  // Add new top-level category
  // ---------------------------------------------
  const goToAdd = () => {
    navigate("/add-category");
  };

  return (
    <div className="page-container">

      <h1 className="page-title">Wedding Categories</h1>

      <div className="grid-container">

        {/* ----------------------------------------
            Render All Categories
        ---------------------------------------- */}
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            name={cat.name}
            image={cat.images?.[0]}
            status={cat.status}
            link={cat.link}
            onClick={() => openCategory(cat.id)}
            onEdit={() => editCategory(cat)}
            onDelete={() => deleteCategory(cat.id)}
          />
        ))}

        {/* ----------------------------------------
            Add Category Card (last card)
        ---------------------------------------- */}
        <CategoryCard
          isAddCard
          name="Add Category"
          onClick={goToAdd}
        />

      </div>
    </div>
  );
}
