import React from "react";
// import baby from '../../assets/images/baby.png';
const baby =
  "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; // Dental/child image

const FeaturedService = () => {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <img
              src={baby}
              className="w-full rounded-2xl shadow-2xl border border-gray-700"
              alt="Dental Care"
            />
          </div>
          <div className="md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Exceptional Dental Care, on your Term
            </h1>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
              efacere amet aperiam non odio. Temporibus, nemo quasi quisquam
              ipsa distinctio saepe sed veniam incidunt, tempora mollitia,
              dignissimos repellendus expedita. Obcaecati minima, reiciendis
              optio aspernatur autem pariatur soluta illum velit, eligendi
              dolorem consequuntur sapiente rerum accusamus aut nulla
              praesentium! Neque autem animi, voluptatem magnam nesciunt officia
              nemo nam, delectus minima velit beatae iste praesentium ad
              repudiandae, similique excepturi sapiente.
            </p>
            <button className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-2 px-6 rounded shadow hover:shadow-cyan-500/50 transition duration-300 transform hover:-translate-y-1">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedService;
