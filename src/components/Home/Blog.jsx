import React from "react";
import BlogDetail from "./BlogDetail";

// Placeholders
const ema = "https://randomuser.me/api/portraits/women/10.jpg";
const john = "https://randomuser.me/api/portraits/men/11.jpg";
const watson = "https://randomuser.me/api/portraits/women/12.jpg";

const blogData = [
  {
    title: "Check at least a doctor in a year for your teeth",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea, placeat totam laborum maiores, esse assumenda porro error natus sit ipsam.",
    author: "Dr. Cudi",
    authorImg: ema,
    date: "23 April 2019",
  },
  {
    title: "Two time brush in a day can keep you healthy",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea, placeat totam laborum maiores, esse assumenda porro error natus sit ipsam.",
    author: "Dr. Sinthia",
    authorImg: watson,
    date: "23 April 2019",
  },
  {
    title: "The tooth cancer is taking a challenge",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea, placeat totam laborum maiores, esse assumenda porro error natus sit ipsam.",
    author: "Dr. Cudi",
    authorImg: john,
    date: "23 April 2019",
  },
];

import FadeIn from "../Shared/FadeIn";

const Blog = () => {
  return (
    <section className="py-20 container mx-auto px-4" id="BlogContaint">
      <div className="text-center mb-16">
        <FadeIn>
          <h5 className="text-cyan-400 font-bold uppercase tracking-wide">
            Our Blogs
          </h5>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            From Our Blog News
          </h1>
        </FadeIn>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogData.map((blog, index) => (
          <FadeIn key={index} delay={index * 0.2}>
            <BlogDetail blog={blog} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

export default Blog;
