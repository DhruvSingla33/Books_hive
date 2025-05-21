import React from "react";
import "./Feature.css";
import { motion } from "framer-motion";
import Feature1 from '../../assets/feature01.png'
import Feature2 from '../../assets/feature02.png'
import Feature3 from '../../assets/feature03.png'
const features = [
  {
    title: "💬 Real-time Chat",
    description:
      "Socket.IO-based chat between teachers and students for smooth communication.",
    image: Feature1,
  },
  {
    title: "🧠 Hybrid Recommendation System",
    description:
      "Combines content-based and collaborative filtering to suggest personalized books.",
    image: Feature2,
  },
  {
    title: "📬 Email Notifications",
    description:
      "Nodemailer integration to send book issue confirmation emails to users.",
    image:  Feature3,
  },
];

export function Features()  {
  return (
    <section className="features-section">
      <motion.h4
        className="features-subtitle"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        FEATURES
      </motion.h4>
      <motion.h2
        className="features-title"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Top Features & Services.
      </motion.h2>

      <div className="features-container">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="feature-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index, duration: 0.6 }}
          >
            <img src={feature.image} alt={feature.title} />
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            {/* <button>More</button> */}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

