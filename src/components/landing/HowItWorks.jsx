import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  UserRound,
  ClockIcon,
  CameraIcon,
} from "lucide-react";
import { MdAccountCircle } from "react-icons/md";

const steps = [
  {
    icon: <UserRound className="h-6 w-6" />,
    title: "Create Account",
    description:
      "The phrasal sequence of the is now so that many campaign and benefit",
  },
  {
    icon: <ClockIcon className="h-6 w-6" />,
    title: "Complete Your Profile",
    description:
      "The phrasal sequence of the is now so that many campaign and benefit",
  },
  {
    icon: <CameraIcon className="h-6 w-6" />,
    title: "Apply Job or Hire",
    description:
      "The phrasal sequence of the is now so that many campaign and benefit",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto py-16">
      <motion.div
        className="grid grid-cols-1 pb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="mb-4 text-3xl md:text-4xl font-medium">
          How it's Work?
        </h3>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Search all the open positions on the web. Get your own personalized
          salary estimate. Read reviews on over 30000+ companies worldwide.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-2xl text-center hover:shadow-lg transition duration-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="size-14 bg-primary/5 text-primary rounded-xl text-2xl flex items-center justify-center mx-auto">
              {step.icon}
            </div>

            <div className="mt-7">
              <h4 className="text-lg font-semibold hover:text-primary transition-colors">
                {step.title}
              </h4>
              <p className="mt-3 text-muted-foreground">{step.description}</p>
              <div className="mt-5">
                <a
                  href="#"
                  className="inline-flex items-center text-primary font-semibold group"
                >
                  Read More
                  <ArrowRightIcon className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
