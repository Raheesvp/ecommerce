import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, ShoppingCart, Edit, Plus } from "lucide-react";

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-lg">
      <nav className="p-4 space-y-2">
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
        <NavLink to="/admin/products">Edit Products</NavLink>
        <NavLink to="/admin/products/new">Add Product</NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
