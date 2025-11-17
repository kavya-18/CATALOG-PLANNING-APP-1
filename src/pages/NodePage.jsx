// src/pages/NodePage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import CategoryCard from "../components/CategoryCard";
import ModalForm from "../components/ModalForm";

export default function NodePage({ tree, saveTree }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ------------------------------------------------------------
  // Current path segments after "/node/"
  // ex: /node/sarees/pattu → ["sarees","pattu"]
  // ------------------------------------------------------------
  const path = location.pathname.replace("/node/", "").split("/").filter(Boolean);

  // ------------------------------------------------------------
  // Find the node in the tree using path
  // ------------------------------------------------------------
  const findNode = (root, segments) => {
    let node = root;
    for (let id of segments) {
      node = node.children.find((c) => c.id === id);
      if (!node) return null;
    }
    return node;
  };

  const currentNode = findNode(tree, path);

  // If node doesn't exist
  if (!currentNode) {
    return (
      <div className="page-container">
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
        <h2>Category not found</h2>
      </div>
    );
  }

  // ------------------------------------------------------------
  // Modal States
  // ------------------------------------------------------------
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // ------------------------------------------------------------
  // Add New Subcategory
  // ------------------------------------------------------------
  const handleAdd = (form) => {
    const newId = form.name.toLowerCase().replace(/\s+/g, "-");

    saveTree((prev) => {
      const clone = structuredClone(prev);
      const target = findNode(clone, path);

      target.children.push({
        id: newId,
        name: form.name,
        notes: form.notes,
        link: form.link,
        images: form.files?.map(f => URL.createObjectURL(f)) ?? [],
        status: form.status,
        children: [],
      });

      return clone;
    });

    setAddOpen(false);
  };

  // ------------------------------------------------------------
  // Edit current node
  // ------------------------------------------------------------
  const handleEdit = (form) => {
    saveTree((prev) => {
      const clone = structuredClone(prev);
      const target = findNode(clone, path);

      target.name = form.name;
      target.notes = form.notes;
      target.link = form.link;
      target.status = form.status;

      // Images: existingImages + newly uploaded files
      const newImages = [
        ...(form.existingImages ?? []),
        ...(form.files?.map(f => URL.createObjectURL(f)) ?? [])
      ];

      target.images = newImages;

      return clone;
    });

    setEditOpen(false);
  };

  // ------------------------------------------------------------
  // Delete child node
  // ------------------------------------------------------------
  const deleteChild = (childId) => {
    saveTree((prev) => {
      const clone = structuredClone(prev);
      const target = findNode(clone, path);

      target.children = target.children.filter((c) => c.id !== childId);

      return clone;
    });
  };

  // ------------------------------------------------------------
  // Navigation to child
  // ------------------------------------------------------------
  const openChild = (childId) => {
    navigate(`/node/${[...path, childId].join("/")}`);
  };

  return (
    <div className="page-container">

      {/* Back Button */}
      <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>

      {/* Page Title */}
      <h1 className="page-title">{currentNode.name}</h1>

      {/* Buttons Row */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button className="btn" onClick={() => setAddOpen(true)}>
          + Add Subcategory
        </button>
        <button
          className="btn edit-page-btn"
          onClick={() => {
            setEditData(currentNode);
            setEditOpen(true);
          }}
        >
          ✏ Edit
        </button>
      </div>

      {/* CHILDREN GRID */}
      <div className="grid-container">
        {currentNode.children.map((child) => (
          <CategoryCard
            key={child.id}
            name={child.name}
            image={child.images?.[0]}
            link={child.link}
            status={child.status}
            onClick={() => openChild(child.id)}
            onEdit={() => {
              setEditData(child);
              setEditOpen(true);
            }}
            onDelete={() => deleteChild(child.id)}
          />
        ))}

        {/* ADD CARD */}
        <CategoryCard isAddCard name="Add" onClick={() => setAddOpen(true)} />
      </div>

      {/* Add Modal */}
      <ModalForm
        open={addOpen}
        title="Add Subcategory"
        onSubmit={handleAdd}
        onClose={() => setAddOpen(false)}
      />

      {/* Edit Modal */}
      <ModalForm
        open={editOpen}
        title="Edit"
        initialData={editData}
        onSubmit={handleEdit}
        onClose={() => setEditOpen(false)}
      />
    </div>
  );
}
