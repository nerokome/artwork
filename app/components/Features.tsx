import React from "react";
import { FaCamera } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { IoShareSocialSharp } from "react-icons/io5";
import { FaUsers, FaPalette, FaShieldAlt } from "react-icons/fa";

const Features = () => {
  const features = [
    {
      title: "Upload & Organize",
      description: "Easily upload your work and keep everything structured in one place.",
      icon: <FaCamera size={35} color="#67E8F9" />,
    },
    {
      title: "Analytics & Insights",
      description: "Track views, engagement, and growth with powerful analytics tools.",
      icon: <FaChartSimple size={35} color="#67E8F9" />,
    },
    {
      title: "Share & Connect",
      description: "Showcase your portfolio and connect with a global creative community.",
      icon: <IoShareSocialSharp size={35} color="#67E8F9" />,
    },
    
    {
      title: "Customization",
      description: "Personalize your portfolio with themes, layouts, and unique branding.",
      icon: <FaPalette size={35} color="#67E8F9" />,
    },
    {
      title: "Privacy & Security",
      description: "Your work is safe with advanced privacy controls and secure storae.",
      icon: <FaShieldAlt size={35} color="#67E8F9" />,
    },
  ];

  return (
    <section className="mx-auto mt-20 max-w-6xl ">
      {/* Section Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Powerful Features for Creators
        </h2>
        <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
          Everything you need to showcase, grow, and protect your creative journey.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-8 text-center hover:border-cyan-400 hover:scale-105 transition transform duration-300"
          >
            <div className="flex items-center justify-center text-3xl mb-4">
              {f.icon}
            </div>
            <h3 className="font-semibold text-sm sm:text-lg text-white">{f.title}</h3>
            <p className="mt-2 text-sm text-gray-300">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;