import { useNavigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";

export default function HomePage() {
  const navigate = useNavigate();

  const mockData = [
    { name: "Sarees", image: "" },
    { name: "Jewelry", image: "" },
    { name: "Decorations", image: "" },
    { name: "Haldi Setup", image: "" },
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">Wedding Categories</h1>

      {/* ➕ Add Category Button */}
      <button
        className="btn"
        style={{ marginBottom: "20px" }}
        onClick={() => navigate("/add-category")}
      >
        + Add New Category
      </button>

      {/* Category Grid */}
      <div className="grid-container">
        {mockData.map((item, index) => (
          <CategoryCard
            key={index}
            name={item.name}
            image={item.image}
            onClick={() => navigate(`/node/${index + 1}`)}
          />
        ))}
      </div>
    </div>
  );
}
