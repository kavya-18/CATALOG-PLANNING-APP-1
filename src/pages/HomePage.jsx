// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";

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

/* -----------------------------
   Small wrapper for sortable card
------------------------------*/
function SortableCategoryWrapper({ item, children }) {
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

/* -----------------------------
   HomePage Component
------------------------------*/
export default function HomePage({ tree, saveTree }) {
  const navigate = useNavigate();

  if (!tree) {
    return <div className="page-container">Loading…</div>;
  }

  const children = Array.isArray(tree.children) ? tree.children : [];

  // Sensors: how drag starts
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // small move before drag
      },
    })
  );

  // DELETE a root category
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category and everything inside it?")) {
      return;
    }

    const updated = {
      ...tree,
      children: children.filter((c) => c.id !== id),
    };

    await saveTree(updated);
  };

  // EDIT a root category
  const handleEdit = (node) => {
    navigate(`/node/${node.id}?edit=1`);
  };

  const goToAdd = () => navigate("/add-category");

  // Handle drag end for root categories
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = children.findIndex((c) => c.id === active.id);
    const newIndex = children.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(children, oldIndex, newIndex);

    const updated = {
      ...tree,
      children: reordered,
    };

    await saveTree(updated);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Wedding Categories</h1>

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
            {/* Sortable root categories */}
            {children.map((cat) => (
              <SortableCategoryWrapper key={cat.id} item={cat}>
                <CategoryCard
                  name={cat.name}
                  image={cat.images}
                  status={cat.status}
                  link={cat.link}
                  onClick={() => navigate(`/node/${cat.id}`)}
                  onEdit={() => handleEdit(cat)}
                  onDelete={() => handleDelete(cat.id)}
                />
              </SortableCategoryWrapper>
            ))}

            {/* Non-sortable +Add card always at end */}
            <CategoryCard isAddCard name="Add New" onClick={goToAdd} />
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
