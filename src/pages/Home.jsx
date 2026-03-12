import React from "react";
import HeaderTop from "../components/Home/HeaderTop";
import BusinessInfo from "../components/Home/BusinessInfo";
import Services from "../components/Home/Services";
import FeaturedService from "../components/Home/FeaturedService";
import HomeAppointment from "../components/Home/HomeAppointment";
import Testimonial from "../components/Home/Testimonial";
import Blog from "../components/Home/Blog";
import Doctor from "../components/Home/Doctor";
import Contact from "../components/Home/Contact";

const Home = () => {
  return (
    <div className="bg-gray-900 min-h-screen relative text-white">
      {/* Global Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        <HeaderTop />
        <BusinessInfo />
        <Services />
        <FeaturedService />
        <HomeAppointment />
        <Testimonial />
        <Blog />
        <Doctor />
        <Contact />
      </div>
    </div>
  );
};

export default Home;
