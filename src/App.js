import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Public
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Diseases from "./pages/Diseases";
import DiseaseDetails from "./pages/DiseaseDetails";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin";
import SupplementsAdmin from "./pages/admin/SupplementsAdmin";
import DiseasesAdmin from "./pages/admin/DiseasesAdmin";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/diseases" element={<Diseases />} />
        <Route path="/diseases/:id" element={<DiseaseDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="supplements" element={<SupplementsAdmin />} />
          <Route path="diseases" element={<DiseasesAdmin />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
