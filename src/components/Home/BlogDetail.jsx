import React from "react";

const BlogDetail = ({ blog }) => {
  const { title, description, author, authorImg, date } = blog;
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 shadow-xl rounded-2xl hover:shadow-cyan-500/20 transition-all duration-300 group">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={authorImg}
          alt={author}
          className="w-12 h-12 rounded-full border-2 border-cyan-400"
        />
        <div>
          <h6 className="text-cyan-400 font-bold">{author}</h6>
          <p className="text-gray-400 text-sm">{date}</p>
        </div>
      </div>
      <h5 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
        {title}
      </h5>
      <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
        {description}
      </p>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        href="#"
        className="text-cyan-400 hover:text-cyan-300 font-semibold uppercase relative inline-block"
      >
        Read More
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
      </a>
    </div>
  );
};

export default BlogDetail;
