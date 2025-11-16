import { useParams, useNavigate } from "react-router-dom";
import FormSection from "../components/FormSection";

export default function AddSubcategory() {
  const { nodeId } = useParams();       // which category this subcategory belongs to
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    console.log("Subcategory saved under Category:", nodeId);
    console.log("Saved Data:", data);

    // Later we will save to backend or Firebase
    navigate(`/node/${nodeId}`);
  };

  return (
    <div className="page-container">
      <button className="btn" onClick={() => navigate(-1)}>← Back</button>

      <FormSection
        title="Add Subcategory"
        buttonLabel="Create Subcategory"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
