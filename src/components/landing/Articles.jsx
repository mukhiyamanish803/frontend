import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const articles = [
  {
    id: 1,
    title: "How To Apply Your Dream Jobs In Digital Marketing, Easy Solution.",
    category: "Marketing",
    image:
      "https://jobes-nextjs.vercel.app/assets/images/blog/blog-img-31.png",
    author: {
      name: "Roland Khelcy",
      role: "Admin",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
  },
  {
    id: 2,
    title: "To Be Continue Redesign & Build Up Your Career Opportunity.",
    category: "Design",
    image:
      "https://jobes-nextjs.vercel.app/assets/images/blog/blog-img-32.png",
    author: {
      name: "Mrs. Rudhela Saley",
      role: "Admin",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
  },
  {
    id: 3,
    title: "If You Are A talented People, Make Sure Your Technology Part.",
    category: "Technology",
    image:
      "https://jobes-nextjs.vercel.app/assets/images/blog/blog-img-33.png",
    author: {
      name: "Martoniey Sekh",
      role: "Admin",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  },
];

export default function Articles() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
      <div className="text-center space-y-4 mb-12">
        <motion.h2
          className="text-3xl md:text-4xl font-medium"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Our Recent <span className="text-primary">Article</span>
        </motion.h2>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          To much valuable feed from our trusted users in world-wide.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, idx) => (
          <motion.article
            key={article.id}
            className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden border dark:border-slate-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="object-cover w-full h-full transition-transform hover:scale-110"
              />
            </div>

            <div className="p-6 space-y-4">
              <Badge variant="secondary" className="rounded-full">
                {article.category}
              </Badge>

              <h4 className="text-xl font-semibold line-clamp-2 hover:text-primary">
                <a href="/blog-details">{article.title}</a>
              </h4>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={article.author.avatar} />
                    <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h6 className="text-sm font-medium">
                      {article.author.name}
                    </h6>
                    <span className="text-xs text-muted-foreground">
                      {article.author.role}
                    </span>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="group" asChild>
                  <a href="/blog-details" className="flex items-center gap-2">
                    View Details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
