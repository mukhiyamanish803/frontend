import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "UI Designer",
    company: "Google",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    content:
      "Using this platform has been incredible. I found my dream job within weeks of signing up. The interface is intuitive and the job matches are spot-on.",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Engineer",
    company: "Microsoft",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    content:
      "The quality of job listings and the ease of application process make this platform stand out. I've recommended it to all my colleagues.",
    rating: 3.7,
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Product Manager",
    company: "Amazon",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    content:
      "What sets this platform apart is its focus on quality matches. The recommendations are always relevant to my experience and career goals.",
    rating: 5,
  },
];

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex justify-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className="h-5 w-5 text-yellow-400" />
          <div className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={`empty-${i}`} className="h-5 w-5 text-yellow-400" />
      ))}
    </div>
  );
};

export default function TestimonialSlider() {
  return (
    <section className="max-w-7xl mx-auto py-16 lg:py-0 px-4">
      <div className="text-center space-y-4 mb-12">
        <motion.h2
          className="text-3xl md:text-4xl font-medium"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          What Our Users Say
        </motion.h2>
        <motion.p
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Discover how our platform has helped professionals find their perfect
          career match
        </motion.p>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {testimonials.map((testimonial) => (
            <CarouselItem
              key={testimonial.id}
              className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <Card className="h-full p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={testimonial.image} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <RatingStars rating={testimonial.rating} />
                    <p className="text-lg">{testimonial.content}</p>
                    <div className="space-y-1">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-4 mt-8">
          <CarouselPrevious className="static" />
          <CarouselNext className="static" />
        </div>
      </Carousel>
    </section>
  );
}
