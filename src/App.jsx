import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import NodePage from "./pages/NodePage";
import AddCategoryPage from "./pages/AddCategoryPage";
import AddSubcategoryPage from "./pages/AddSubcategoryPage";
import AddItem from "./pages/AddItem";
import ItemPage from "./pages/ItemPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Category/Subcategory Explorer */}
        <Route path="/node/:nodeId" element={<NodePage />} />

        {/* Add new root-level category */}
        <Route path="/add-category" element={<AddCategoryPage />} />

        {/* Add subcategory under a main category */}
        <Route path="/add-subcategory/:nodeId" element={<AddSubcategoryPage />} />

        {/* Add item inside a subcategory */}
        <Route path="/item/:nodeId/:subId/:itemId/add" element={<AddItem />} />

        {/* Full item detail page (notes, files, status, etc.) */}
        <Route path="/item/:nodeId/:subId/:itemId" element={<ItemPage />} />

      </Routes>
    </BrowserRouter>
  );
}
