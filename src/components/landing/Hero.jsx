import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";
import publicApi from "@/api/publicApi";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const [openKeywords, setOpenKeywords] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const popularSearches = [
    "Software Engineer",
    "Data Scientist",
    "Product Manager",
    "UX Designer",
    "Marketing",
  ];

  const companies = [
    {
      id: 1,
      name: "Google",
      logo: "https://res.cloudinary.com/dhopew3ev/image/upload/v1747916075/google_ih3po3.svg",
    },
    {
      id: 2,
      name: "Microsoft",
      logo: "https://res.cloudinary.com/dhopew3ev/image/upload/v1747917082/microsoft_sjxgmk.svg",
    },
    {
      id: 3,
      name: "Apple",
      logo: "https://res.cloudinary.com/dhopew3ev/image/upload/v1747917189/apple_n3oofu.svg",
    },
    {
      id: 4,
      name: "Meta",
      logo: "https://res.cloudinary.com/dhopew3ev/image/upload/v1747916614/facebook_kyi4dk.svg",
    },
    {
      id: 5,
      name: "Amazon",
      logo: "https://res.cloudinary.com/dhopew3ev/image/upload/v1749043344/amazon-icon_h0e5tt.svg",
    },
    {
      id: 6,
      name: "Netflix",
      logo: "https://res.cloudinary.com/dhopew3ev/image/upload/v1749043424/netflix-icon_ohoqre.svg",
    },
    {
      id: 7,
      name: "Tesla",
      logo: "https://res.cloudinary.com/dhopew3ev/image/upload/v1749043469/tesla-icon_u0xq1m.svg",
    },
    {
      id: 8,
      name: "Uber",
      logo: "https://res.cloudinary.com/dhopew3ev/image/upload/v1749043530/uber-icon_va7b8s.svg",
    },
    {
      id: 9,
      name: "Airbnb",
      logo: "https://res.cloudinary.com/dhopew3ev/image/upload/v1749043580/airbnb-icon_vtt3gc.svg",
    },
    {
      id: 10,
      name: "Twitter",
      logo: "https://res.cloudinary.com/dhopew3ev/image/upload/v1749044190/x-social-media-logo-icon_wmscit.svg",
    },
  ];

  const handleSearch = () => {
    if (selectedKeyword) {
      // Navigate to the job search page with the selected category as a query param
      navigate(`/jobs?category=${encodeURIComponent(selectedKeyword.category)}`);
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await publicApi.get("/categories");
        setKeywords(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setKeywords([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);
  return (
    <section data-component="Hero" data-page="Landing" className="max-w-7xl mx-auto px-2 min-[1300px]:px-0 max-[1280px]:py-16">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col h-full w-full justify-center gap-12">
          <motion.h1
            className="text-5xl font-medium md:text-6xl lg:text-7xl max-[1024px]:text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Find Your Dream Job or Hire Top Talent
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Each month, more than 3 million job seekers turn to website in their
            search for work, making over 140,000 applications every single day
          </motion.p>

          <motion.div
            className="hidden max-[1024px]:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <img
              src="https://res.cloudinary.com/dhopew3ev/image/upload/v1749298895/HeroImage_csmksl.svg"
              alt="Job Search"
              className="w-full h-auto object-contain min-[700px]:px-16"
            />
          </motion.div>

          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <Popover open={openKeywords} onOpenChange={setOpenKeywords}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openKeywords}
                    className="w-full sm:w-[350px] justify-between bg-transparent hover:bg-gray-100"
                  >
                    {selectedKeyword
                      ? selectedKeyword.category
                      : "Search jobs..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search job titles, skills..." />
                    <CommandEmpty>No matching keywords.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-auto">
                      {isLoading ? (
                        <CommandItem>Loading categories...</CommandItem>
                      ) : keywords.length === 0 ? (
                        <CommandItem>No categories found</CommandItem>
                      ) : (
                        keywords.map((keyword) => (
                          <CommandItem
                            key={keyword.category}
                            value={keyword.category}
                            onSelect={(value) => {
                              setSelectedKeyword(
                                value === selectedKeyword?.category
                                  ? null
                                  : keyword
                              );
                              setOpenKeywords(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedKeyword?.category === keyword.category
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {keyword.category}
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <Button onClick={handleSearch} className="w-full sm:w-auto px-8">Search</Button>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap gap-2 items-center text-sm mt-2">
              <span className="font-medium">Popular Searches:</span>
              {popularSearches.map((term, index) => (
                <a
                  key={index}
                  href={`/search?q=${term.toLowerCase()}`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {term}
                  {index !== popularSearches.length - 1 ? "," : ""}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hidden min-[1024px]:block"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src="https://res.cloudinary.com/dhopew3ev/image/upload/v1749298895/HeroImage_csmksl.svg"
            alt="Job Search"
            className="w-full h-auto object-contain"
          />
        </motion.div>
      </div>

      {/* Company Logos Grid */}
      <motion.div
        className="mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-6 justify-center">
          {companies.map((company) => (
            <div
              key={company.id}
              className="size-12 bg-white dark:bg-slate-900 shadow-sm shadow-gray-200 dark:shadow-gray-700 flex justify-center items-center rounded-md mx-auto p-3 hover:shadow-md transition-shadow"
            >
              <img
                src={company.logo}
                alt={company.name}
                className="h-7 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
