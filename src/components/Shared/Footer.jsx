import React from "react";
import { Link } from "react-router-dom";

const FooterColumn = ({ title, items, children }) => (
  <div className="w-full md:w-1/4 px-4 mb-8 md:mb-0">
    <h6 className="text-cyan-400 text-lg font-semibold mb-4">{title}</h6>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index}>
          {item.link.startsWith("http") ? (
            <a
              href={item.link}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              {item.name}
            </a>
          ) : (
            <Link
              to={item.link}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              {item.name}
            </Link>
          )}
        </li>
      ))}
    </ul>
    {children}
  </div>
);

const Footer = () => {
  const noNamed = [
    { name: "Emergency Dental Care", link: "/emergency" },
    { name: "Check Up", link: "/checkup" },
    { name: "Treatment of Personal Diseases", link: "/personal-treatment" },
    { name: "Tooth Extraction", link: "/tooth-extract" },
    { name: "Check Up", link: "/checkup" },
  ];
  const ourAddress = [
    { name: "New York - 101010 Hudson", link: "https://google.com/map" },
    { name: "Yards", link: "https://google.com/map" },
  ];
  const oralHealth = [
    { name: "Emergency Dental Care", link: "/emergency" },
    { name: "Check Up", link: "/checkup" },
    { name: "Treatment of Personal Diseases", link: "/personal-treatment" },
    { name: "Tooth Extraction", link: "/tooth-extract" },
    { name: "Check Up", link: "/checkup" },
    { name: "Check Up", link: "/checkup" },
    { name: "Check Up", link: "/checkup" },
  ];
  const services = [
    { name: "Emergency Dental Care", link: "/emergency" },
    { name: "Check Up", link: "/checkup" },
    { name: "Treatment of Personal Diseases", link: "/personal-treatment" },
    { name: "Tooth Extraction", link: "/tooth-extract" },
    { name: "Check Up", link: "/checkup" },
    { name: "Check Up", link: "/checkup" },
    { name: "Check Up", link: "/checkup" },
  ];

  return (
    <footer className="bg-gray-900 pt-16 pb-8 border-t border-white/10 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap -mx-4">
          {/* Placeholder column or first column */}
          <FooterColumn title="." items={noNamed} />
          <FooterColumn title="Services" items={services} />
          <FooterColumn title="Oral Health" items={oralHealth} />
          <FooterColumn title="Our Address" items={ourAddress}>
            <div className="mt-6">
              <h6 className="text-gray-300 font-medium mb-2">Call now</h6>
              <button className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2 rounded hover:shadow-lg transition-all">
                +2025550295
              </button>
            </div>
          </FooterColumn>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500">
            Made with ❤️ by Sudipta
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
