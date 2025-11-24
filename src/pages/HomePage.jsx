// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import NotesModal from "../components/NotesModal";
import StatusModal from "../components/StatusModal";
import ModalForm from "../components/ModalForm";

import {
  getChildren,
  updateNode,
  deleteNodeAndDescendants,
  reorderChildren,
} from "../services/firestoreService";
import { uploadImages } from "../services/storageService";

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

function SortableCategoryWrapper({ item, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

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

export default function HomePage({ rootId }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [cats, setCats] = useState([]);

  const [notesNode, setNotesNode] = useState(null);
  const [statusNode, setStatusNode] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editingNode, setEditingNode] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const children = await getChildren(rootId);
        setCats(children);
      } catch (err) {
        console.error("loadCategories error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [rootId]);

  const refreshChildren = async () => {
    const children = await getChildren(rootId);
    setCats(children);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category and everything inside it?")) {
      return;
    }
    await deleteNodeAndDescendants(id);
    await refreshChildren();
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = cats.findIndex((c) => c.id === active.id);
    const newIndex = cats.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(cats, oldIndex, newIndex);
    setCats(reordered);

    const newChildIds = reordered.map((c) => c.id);
    await reorderChildren(rootId, newChildIds);
  };

  const goToAdd = () => navigate("/add-category");

  // ---- Notes & Status ----
  const saveNotes = async (newNotes) => {
    if (!notesNode) return;
    await updateNode(notesNode.id, { notes: newNotes || "" });
    setNotesNode(null);
    await refreshChildren();
  };

  const saveStatus = async (newStatus) => {
    if (!statusNode) return;
    await updateNode(statusNode.id, { status: newStatus || "Idea" });
    setStatusNode(null);
    await refreshChildren();
  };

  // ---- EDIT from home page ----
  const handleEditSubmit = async ({ name, link, files, existingImages }) => {
    if (!editingNode) return;

    try {
      const uploaded =
        files && files.length
          ? await uploadImages(files, `nodes/${editingNode.id}`)
          : [];

      const baseImages = existingImages ?? editingNode.images ?? [];
      const images = [...baseImages, ...uploaded];

      await updateNode(editingNode.id, {
        name,
        link: link || "",
        images,
      });

      setEditOpen(false);
      setEditingNode(null);
      await refreshChildren();
    } catch (err) {
      console.error("HomePage handleEditSubmit error:", err);
      alert("Could not update. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="page-title">Wedding Categories</h1>
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Wedding Categories</h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={cats.map((c) => c.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid-container">
            {cats.map((cat) => (
              <SortableCategoryWrapper key={cat.id} item={cat}>
                <CategoryCard
                  name={cat.name}
                  image={cat.images}
                  status={cat.status}
                  link={cat.link}
                  onClick={() => navigate(`/node/${cat.id}`)}
                  onEdit={() => {
                    setEditingNode(cat);
                    setEditOpen(true);
                  }}
                  onDelete={() => handleDelete(cat.id)}
                  onNotes={() => setNotesNode(cat)}
                  onStatusClick={() => setStatusNode(cat)}
                />
              </SortableCategoryWrapper>
            ))}

            {/* + Add card */}
            <CategoryCard isAddCard name="Add New" onClick={goToAdd} />
          </div>
        </SortableContext>
      </DndContext>

      {/* NOTES modal */}
      <NotesModal
        open={!!notesNode}
        initialNotes={notesNode?.notes || ""}
        onSave={saveNotes}
        onClose={() => setNotesNode(null)}
      />

      {/* STATUS modal */}
      <StatusModal
        open={!!statusNode}
        initialStatus={statusNode?.status || "Idea"}
        onSave={saveStatus}
        onClose={() => setStatusNode(null)}
      />

      {/* EDIT modal */}
      <ModalForm
        open={editOpen}
        initialData={editingNode}
        title="Edit Category"
        onSubmit={handleEditSubmit}
        onClose={() => {
          setEditOpen(false);
          setEditingNode(null);
        }}
      />
    </div>
  );
}
