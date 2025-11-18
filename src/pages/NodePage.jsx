// src/pages/NodePage.jsx

import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import CategoryCard from "../components/CategoryCard";
import ModalForm from "../components/ModalForm";

// dnd-kit imports
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ---------------------------------
   Helper: find node by path
----------------------------------*/
function findNodeByPath(tree, segments) {
  let node = tree;
  for (const seg of segments) {
    if (!node.children) return null;
    node = node.children.find((c) => c.id === seg);
    if (!node) return null;
  }
  return node;
}

/* ---------------------------------
   Helper: immutably update children
   at a specific path
----------------------------------*/
function updateChildrenAtPath(node, segments, newChildren) {
  if (segments.length === 0) {
    return {
      ...node,
      children: newChildren,
    };
  }

  const [head, ...tail] = segments;

  return {
    ...node,
    children: (node.children || []).map((child) =>
      child.id === head ? updateChildrenAtPath(child, tail, newChildren) : child
    ),
  };
}

/* ---------------------------------
   Sortable wrapper for child cards
----------------------------------*/
function SortableChildWrapper({ item, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

/* ---------------------------------
   NodePage
----------------------------------*/
export default function NodePage({ tree, saveTree }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Path segments after /node/
  const pathSegments = useMemo(
    () =>
      location.pathname
        .replace("/node/", "")
        .split("/")
        .filter(Boolean),
    [location.pathname]
  );

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editNodeData, setEditNodeData] = useState(null);

  // dnd sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // find current node
  const currentNode = useMemo(
    () => (tree ? findNodeByPath(tree, pathSegments) : null),
    [tree, pathSegments]
  );

  // If "?edit=1" in URL -> open edit on load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("edit") === "1" && currentNode) {
      setEditNodeData(currentNode);
      setEditOpen(true);
    }
  }, [location.search, currentNode]);

  if (!tree || !currentNode) {
    return (
      <div className="page-container">
        <button className="btn back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2>Not Found</h2>
      </div>
    );
  }

  const children = Array.isArray(currentNode.children)
    ? currentNode.children
    : [];

  /* --------- ADD child (subcategory / item) ---------- */
  const handleAdd = async (formData) => {
    const newId = formData.name.toLowerCase().replace(/\s+/g, "-");

    const newChild = {
      id: newId,
      name: formData.name,
      notes: formData.notes || "",
      link: formData.link || "",
      status: formData.status || "Idea",
      images: formData.existingImages || [],
      children: [],
    };

    const newChildren = [...children, newChild];
    const updatedTree = updateChildrenAtPath(tree, pathSegments, newChildren);
    await saveTree(updatedTree);
    setAddOpen(false);
  };

  /* --------- EDIT current node ---------- */
  const handleEdit = async (formData) => {
    // we need to update *this* node’s fields inside the full tree

    function updateNodeFields(node, segments) {
      if (segments.length === 0) {
        return {
          ...node,
          name: formData.name,
          notes: formData.notes || "",
          link: formData.link || "",
          status: formData.status || "Idea",
          images: formData.existingImages || [],
        };
      }

      const [head, ...tail] = segments;

      return {
        ...node,
        children: (node.children || []).map((child) =>
          child.id === head ? updateNodeFields(child, tail) : child
        ),
      };
    }

    const updatedTree = updateNodeFields(tree, pathSegments);
    await saveTree(updatedTree);
    setEditOpen(false);
  };

  /* --------- DELETE child ---------- */
  const deleteChild = async (childId) => {
    if (!window.confirm("Delete this item and all its children?")) return;

    const newChildren = children.filter((c) => c.id !== childId);
    const updatedTree = updateChildrenAtPath(tree, pathSegments, newChildren);
    await saveTree(updatedTree);
  };

  /* --------- Navigate to child ---------- */
  const goToChild = (childId) => {
    navigate(`${location.pathname}/${childId}`);
  };

  /* --------- Drag end: reorder only inside this node ---------- */
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = children.findIndex((c) => c.id === active.id);
    const newIndex = children.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(children, oldIndex, newIndex);
    const updatedTree = updateChildrenAtPath(tree, pathSegments, reordered);
    await saveTree(updatedTree);
  };

  return (
    <div className="page-container">
      {/* Back button */}
      <button className="btn back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Title */}
      <h1 className="page-title">{currentNode.name}</h1>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", justifyContent: "center" }}>
        <button className="btn" onClick={() => setAddOpen(true)}>
          + Add Subcategory / Item
        </button>

        <button
          className="btn"
          style={{ background: "#6c5ce7" }}
          onClick={() => {
            setEditNodeData(currentNode);
            setEditOpen(true);
          }}
        >
          ✏ Edit This
        </button>
      </div>

      {/* Children grid with drag–drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={children.map((c) => c.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid-container">
            {children.length === 0 && (
              <p style={{ opacity: 0.7 }}>No items yet. Add one!</p>
            )}

            {children.map((child) => (
              <SortableChildWrapper key={child.id} item={child}>
                <CategoryCard
                  name={child.name}
                  image={child.images}
                  status={child.status}
                  link={child.link}
                  onClick={() => goToChild(child.id)}
                  onEdit={() => {
                    setEditNodeData(child);
                    setEditOpen(true);
                  }}
                  onDelete={() => deleteChild(child.id)}
                />
              </SortableChildWrapper>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* ADD MODAL */}
      <ModalForm
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        title="Add Subcategory / Item"
      />

      {/* EDIT MODAL */}
      <ModalForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEdit}
        initialData={editNodeData}
        title="Edit Category / Item"
      />
    </div>
  );
}
