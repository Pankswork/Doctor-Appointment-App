import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow ${isHomePage ? "" : "pt-16"}`}>
        {/* pt-16 is only needed for non-home pages to account for fixed navbar. 
            Home page handles this with its own Hero section styling. */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
