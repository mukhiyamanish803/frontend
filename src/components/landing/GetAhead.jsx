import { motion } from "framer-motion";
import { MessageCircle, Briefcase, Building2, DollarSign } from "lucide-react";

const valueProps = [
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "Join your work community",
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "Find and apply to jobs",
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Search company reviews",
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: "Compare salaries",
  },
];

export default function GetAhead() {
  return (
    <section className="max-w-7xl mx-auto py-16 lg:py-24">
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-medium">
          Get ahead with Employara
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're serving up trusted insights and anonymous conversation, so
          you'll have the goods you need to succeed.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
        {valueProps.map((prop, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="w-16 h-16 rounded-full border border-black flex items-center justify-center">
              {prop.icon}
            </div>
            <p className="font-medium">{prop.title}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
