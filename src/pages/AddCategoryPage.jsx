import FormSection from "../components/FormSection";
import { useNavigate } from "react-router-dom";

export default function AddCategory() {
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    console.log("Category Saved:", data);
    navigate("/");
  };

  return (
    <div className="page-container">
      <button className="btn" onClick={() => navigate(-1)}>← Back</button>

      <FormSection 
        title="Add New Category"
        buttonLabel="Create Category"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
