import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import FadeIn from "../Shared/FadeIn";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Sending message...");

    try {
      await axios.post("/api/v1/contacts", formData);
      toast.success("Message sent successfully!", { id: toastId });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 text-white relative" id="ContactPage">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <FadeIn>
            <h5 className="text-cyan-400 font-bold uppercase tracking-wide">
              Contact Us
            </h5>
            <h1 className="text-3xl md:text-4xl font-bold">
              Always Connect With Us
            </h1>
          </FadeIn>
        </div>

        <div className="max-w-3xl mx-auto">
          <FadeIn delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="w-full p-4 rounded-lg bg-white/10 backdrop-blur border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all font-light"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full p-4 rounded-lg bg-white/10 backdrop-blur border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all font-light"
              />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Enter your subject"
                className="w-full p-4 rounded-lg bg-white/10 backdrop-blur border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all font-light"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Enter your message"
                className="w-full p-4 rounded-lg bg-white/10 backdrop-blur border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all font-light"
              ></textarea>

              <div className="text-center mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-3 px-12 rounded shadow hover:shadow-lg transition duration-300 uppercase tracking-wider disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default Contact;
