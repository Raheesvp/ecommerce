// layouts/MainLayout.jsx

import { Outlet } from "react-router-dom";
import Navbar from "../Component/Navbar"

const MainLayout = () => {
  return (
    <>
      <Navbar/>
      <Outlet />
    </>
  );
};

export default MainLayout;
