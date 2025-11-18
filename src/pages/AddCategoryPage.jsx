// src/pages/AddCategoryPage.jsx
import ModalForm from "../components/ModalForm";
import { useNavigate } from "react-router-dom";

export default function AddCategoryPage({ tree, saveTree }) {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    const { name, notes, link, status } = data;

    const newCat = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      notes,
      link,
      status,
      images: [],      // image URLs later when we wire Storage
      children: [],
    };

    const updated = {
      ...tree,
      children: [...(tree.children || []), newCat],
    };

    await saveTree(updated);
    navigate("/");
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
