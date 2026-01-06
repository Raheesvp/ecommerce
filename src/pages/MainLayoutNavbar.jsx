import { Outlet } from "react-router-dom";
import Navbar from "../Component/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />  {/* Navbar is permanent here */}
      <div className="content">
        <Outlet /> {/* The specific page (Home, Cart, etc.) renders here */}
      </div>
    </>
  );
};

export default MainLayout;