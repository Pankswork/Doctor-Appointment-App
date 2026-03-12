import React from "react";

import { motion } from "framer-motion";

const ServiceDetail = ({ service }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-cyan-500/20 transition-all duration-300"
    >
      <div className="mb-6 flex justify-center">
        <img
          src={service.img}
          alt={service.name}
          className="h-20 w-20 object-contain drop-shadow-lg"
        />
      </div>
      <h5 className="text-xl font-bold text-white mb-4 tracking-wide">
        {service.name}
      </h5>
      <p className="text-gray-300 text-sm leading-relaxed">{service.desc}</p>
    </motion.div>
  );
};

export default ServiceDetail;
