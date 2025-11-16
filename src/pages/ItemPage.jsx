import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormSection from "../components/FormSection";

export default function ItemPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    console.log("Saved Item:", formData);

    alert("Item saved successfully!");

    // For future: save to Firebase
    // await setDoc(doc(db, "items", itemId), formData);

    navigate(-1); // go back after saving
  };

  return (
    <div className="page-container">

      {/* Back Button */}
      <button className="btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Reusable form */}
      <FormSection 
        title={`Edit / Add Item: ${itemId}`}
        buttonLabel="Save Item"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
