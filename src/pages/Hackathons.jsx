import React from "react";
import { motion } from "framer-motion";
import HackathonCard from "@/components/common/HackathonCard";

const hackathons = [
  {
    title: "AI Innovation Hackathon",
    date: "July 20-22, 2025",
    location: "Remote",
    tags: ["AI", "Innovation", "Team"],
    description:
      "Join the brightest minds to build next-gen AI solutions. Win prizes, network, and learn from industry leaders.",
  },
  {
    title: "Web3 Builders Sprint",
    date: "August 10-12, 2025",
    location: "San Francisco, CA",
    tags: ["Web3", "Blockchain", "Crypto"],
    description:
      "Build decentralized apps and compete for top prizes. Collaborate with blockchain experts and investors.",
  },
  // ...add more hackathons as needed
];

const Hackathons = () => {
  return (
    <section className="py-8 px-4 md:px-8 bg-background min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground text-center">
          Upcoming Hackathons
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          {hackathons.map((hack, idx) => (
            <HackathonCard key={idx} {...hack} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Hackathons;
