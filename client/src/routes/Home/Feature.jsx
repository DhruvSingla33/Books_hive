import React from "react";
import "./Feature.css";
import { motion } from "framer-motion";
import Feature1 from '../../assets/feature01.png'
import Feature3 from '../../assets/feature03.png'
const features = [
  {
    title: "Communications",
    description:
      "Pretium lectus quam id leo in vitae turpis. Mattis pellentesque id nibh tortor id.",
    image: Feature1,
  },
  {
    title: "Inspired Design",
    description:
      "Nunc consequat interdum varius sit amet mattis vulputate enim nulla. Risus feugiat.",
    image: "/images/design.png",
  },
  {
    title: "Happy Customers",
    description:
      "Nisl purus in mollis nunc sed id semper. Rhoncus aenean vel elit scelerisque mauris.",
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
        Our Features & Services.
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

