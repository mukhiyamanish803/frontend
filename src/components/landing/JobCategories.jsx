import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { title: "Human Resource", jobs: 90 },
  { title: "It & Networking", jobs: 90 },
  { title: "Sales & Marketing", jobs: 90 },
  { title: "Accounting", jobs: 90 },
  { title: "Delivery Boy", jobs: 90 },
  { title: "Data Science", jobs: 90 },
  { title: "Project Manager", jobs: 90 },
  { title: "Engineering", jobs: 90 },
  { title: "Help Center", jobs: 90 },
  { title: "Full Stack Developer", jobs: 90 },
];

export default function JobCategories() {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-8 md:pb-16 lg:pb-24">
      <div className="grid md:grid-cols-12 grid-cols-1 pb-8 items-end">
        <div className="lg:col-span-8 md:col-span-6 text-center md:text-left">
          <motion.h3
            className="text-2xl md:text-[26px] font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Browse by Categories
          </motion.h3>
          <motion.p
            className="text-muted-foreground max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Search your career opportunity with our categories
          </motion.p>
        </div>

        <div className="lg:col-span-4 md:col-span-6 md:text-right hidden md:block">
          <a
            href="/categories"
            className="inline-flex items-center font-semibold text-muted-foreground hover:text-primary relative after:absolute after:w-0 hover:after:w-full after:h-px after:bottom-0 after:left-0 after:bg-primary after:transition-all after:duration-500"
          >
            All Categories <ArrowRight className="h-4 w-4 ml-1" />
          </a>
        </div>
      </div>

      <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[30px] mt-8">
        {categories.map((category, idx) => (
          <motion.div
            key={category.title}
            className="group p-4 rounded-md shadow-sm bg-slate-50 dark:bg-slate-800 hover:bg-primary dark:hover:bg-primary transition-all duration-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <h5 className="text-lg font-semibold group-hover:text-white">
              {category.title}
            </h5>
            <span className="block text-muted-foreground group-hover:text-white/50 text-sm mt-1">
              {category.jobs} Jobs Available
            </span>
            <div className="mt-2">
              <a
                href={`/jobs/${category.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="text-primary dark:text-white/80 group-hover:text-white font-medium inline-flex items-center"
              >
                Explore Jobs
                <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
