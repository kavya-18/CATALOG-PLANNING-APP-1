import { useParams, useNavigate } from "react-router-dom";
import FormSection from "../components/FormSection";

export default function AddItem() {
  const { nodeId, subId } = useParams();   // category + subcategory ID
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    console.log("Item saved under:", { nodeId, subId });
    console.log("Item Data:", data);

    // Later: save to Firebase or backend
    navigate(`/item-list/${nodeId}/${subId}`);
  };

  return (
    <div className="page-container">
      <button className="btn" onClick={() => navigate(-1)}>← Back</button>

      <FormSection
        title="Add New Item"
        buttonLabel="Save Item"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
