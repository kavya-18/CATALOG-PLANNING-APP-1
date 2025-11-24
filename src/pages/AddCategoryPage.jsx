// src/pages/AddCategoryPage.jsx
import { useNavigate } from "react-router-dom";
import ModalForm from "../components/ModalForm";
import { createNode } from "../services/firestoreService";
import { uploadImages } from "../services/storageService";

export default function AddCategoryPage({ rootId }) {
  const navigate = useNavigate();

  const handleSubmit = async ({ name, link, files, existingImages }) => {
    try {
      // 1) upload any new files to a folder for root’s children
      const uploadedUrls =
        files && files.length
          ? await uploadImages(files, `nodes/${rootId}`)
          : [];

      // 2) combine existing + newly uploaded
      const images = [...(existingImages || []), ...uploadedUrls];

      // 3) create a child node of root
      await createNode({
        parentId: rootId,
        name,
        link: link || "",
        images,
      });

      navigate("/");
    } catch (err) {
      console.error("AddCategoryPage handleSubmit error:", err);
      alert("Something went wrong while saving. Please try again.");
    }
  };

  return (
    <ModalForm
      open={true}
      title="Add New Category"
      onSubmit={handleSubmit}
      onClose={() => navigate(-1)}
    />
  );
}
