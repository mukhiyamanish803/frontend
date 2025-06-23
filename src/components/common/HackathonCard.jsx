import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

// Accept organizerLogo as prop (URL or component)
const HackathonCard = ({
  title = "AI Innovation Hackathon",
  date = "July 20-22, 2025",
  location = "Remote",
  tags = ["AI", "Innovation", "Team"],
  description = "Join the brightest minds to build next-gen AI solutions. Win prizes, network, and learn from industry leaders.",
  organizerLogo = "https://placehold.co/40x40?text=Org", // Placeholder logo
  deadline = "2025-07-18", // ISO date string
  totalPrize = "$10,000", // Add default prize prop
  registered = 120, // Add default registered prop
  onRegister,
  onClick,
}) => {
  // Calculate days left
  const getDaysLeft = (deadlineStr) => {
    const today = new Date();
    const deadlineDate = new Date(deadlineStr);
    const diffTime =
      deadlineDate.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const daysLeft = getDaysLeft(deadline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
      className="w-full mx-auto"
    >
      <Card className="border border-border shadow-sm rounded-2xl transition-colors duration-300 hover:border-primary/60 dark:bg-muted">
        <CardHeader className="pb-0 flex flex-row items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img
              src={organizerLogo}
              alt="Organizer Logo"
              className="w-10 h-10 rounded-full object-cover border border-border bg-muted flex-shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {title}
              </h3>
              <div className="mt-0.5">
                <span className="inline-block text-xs text-primary/80 bg-primary/10 rounded px-2 py-0.5 font-medium">
                  Deadline:{" "}
                  {daysLeft > 0
                    ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`
                    : daysLeft === 0
                    ? "Today"
                    : "Closed"}
                </span>
              </div>
            </div>
          </div>
          {/* Register Button */}
          <Button
            variant="default"
            size="sm"
            className="rounded-full px-4 font-medium shadow"
            onClick={onRegister}
          >
            Register
          </Button>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {/* Removed calendar and date */}
          {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FaRegCalendarAlt className="text-primary/80" />
            <span>{date}</span>
          </div> */}
          {/* Title moved to header */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FaMapMarkerAlt className="text-primary/70" />
            <span>{location}</span>
          </div>
          <p className="text-base text-muted-foreground line-clamp-3">
            {description}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </Badge>
            ))}
          </div>
          {/* Total Prize below tags */}
          <div className="mt-1">
            <span className="inline-block text-sm font-medium text-foreground bg-yellow-100 dark:bg-yellow-900/30 rounded px-2 py-0.5">
              Total Prize: {totalPrize}
            </span>
          </div>
          {/* Registered below total prize */}
          <div className="mt-1">
            <span className="inline-block text-xs font-medium text-muted-foreground bg-muted rounded px-2 py-0.5">
              Registered: {registered}
            </span>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          {/* ...existing code... */}
          <Button
            variant="outline"
            className="w-full group transition-all"
            onClick={onClick}
            asChild
          >
            <span className="flex items-center justify-center gap-2">
              View Details
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default HackathonCard;
