import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import CategoryCard from "../components/CategoryCard";
import AddEditItemModal from "../components/AddEditItemModal";
import "../styles/layout.css";

const NodePage = () => {
  const { nodeId } = useParams();
  const navigate = useNavigate();
  const [nodeData, setNodeData] = useState(null);
  const [children, setChildren] = useState([]);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    const unsub1 = onSnapshot(doc(db, "nodes", nodeId), (snapshot) => {
      setNodeData(snapshot.data());
    });

    const unsub2 = onSnapshot(
      collection(db, "nodes", nodeId, "children"),
      (snapshot) => {
        const arr = [];
        snapshot.forEach((doc) => arr.push({ id: doc.id, ...doc.data() }));
        setChildren(arr);
      }
    );

    return () => {
      unsub1();
      unsub2();
    };
  }, [nodeId]);

  return (
    <div className="page-container">
      <button className="btn back-btn" onClick={() => navigate(-1)}>← Back</button>

      <h1 className="page-title">{nodeData?.title}</h1>

      <div className="toolbar-row">
        <button className="btn" onClick={() => setAddOpen(true)}>
          + Add Subcategory / Item
        </button>
      </div>

      <div className="grid-container">
        {children.map((child) => (
          <CategoryCard
            key={child.id}
            title={child.title}
            images={child.images}
            notes={child.notes}
            status={child.status}
            onClick={() => navigate(`/node/${child.id}`)}
            onEdit={() =>
              navigate(`/edit/${nodeId}/${child.id}`, { state: child })
            }
            onDelete={() => console.log("Delete clicked")}
          />
        ))}

        {/* ADD NEW CARD → WORKING NOW */}
        <CategoryCard isAddCard onAdd={() => setAddOpen(true)} />
      </div>

      {addOpen && (
        <AddEditItemModal
          parentId={nodeId}
          closeModal={() => setAddOpen(false)}
        />
      )}
    </div>
  );
};

export default NodePage;
