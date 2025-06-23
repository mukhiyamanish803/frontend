import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useAuth } from "@/context/AuthContex";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import publicApi, { searchJobs } from "@/api/publicApi";

const SearchHeader = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const category = queryParams.get("category");

  const { categories, setJobs, setSelectedJob } = useAuth();
  const [jobType, setJobType] = React.useState("");
  const [experienceLevel, setExperienceLevel] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState(
    category || null
  );
  const [openCategory, setOpenCategory] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Detect if current URL is internship page
  const isInternshipPage =
    window.location.href === "http://localhost:5173/internship";

  // Update jobTypes array to match exactly with creation form values
  const jobTypes = [
    { label: "Full Time", value: "full-time" },
    { label: "Part Time", value: "part-time" },
    { label: "Contract", value: "contract" },
    { label: "Freelance", value: "freelance" },
    { label: "Internship", value: "internship" },
    { label: "Remote", value: "remote" },
    { label: "Temporary", value: "temporary" },
    { label: "Volunteer", value: "volunteer" },
  ];
  // Update experienceLevels to match the recruiter's form values
  const experienceLevels = [
    { label: "Entry Level (0-2 years)", value: "entry" },
    { label: "Intermediate (2-5 years)", value: "intermediate" },
    { label: "Senior (5-8 years)", value: "senior" },
    { label: "Expert (8+ years)", value: "expert" },
  ];

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const searchParams = {
        category: selectedCategory || "",
        jobType: jobType || "",
        experienceLevel: experienceLevel || "",
      };

      const response = await searchJobs(searchParams);
      if (response.data) {
        setJobs(response.data);
        if (response.data.length > 0) {
          setSelectedJob(response.data[0]);
        } else {
          setSelectedJob(null);
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const clearCategory = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCategory("");
    setOpenCategory(false);
  };

  const clearJobType = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setJobType("");
    setOpen(false);
  };

  // Modify the clearExperience function
  const clearExperience = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setExperienceLevel("");
    // Force the select to close if it's open
    const activeElement = document.activeElement;
    if (activeElement) {
      activeElement.blur();
    }
  };

  useEffect(() => {
    const fetchCategoryJobs = async () => {
      if (category) {
        try {
          const response = await publicApi.get(
            `/find-jobs-by-category/${category}`
          );
          if (response.data && response.data.length > 0) {
            setJobs(response.data);
            setSelectedJob(response.data[0]);
          }
        } catch (error) {
        }
      }
    };

    fetchCategoryJobs();
  }, [category]);

  return (
    <div
      data-component="SearchHeader"
      data-page="ApplyForJobPage"
      className="w-full border-b"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center gap-6">
          <div className="w-full max-w-4xl flex flex-wrap items-center gap-2">
            {/* Categories Dropdown */}
            <div className="relative flex-1 min-w-[200px]">
              <Popover open={openCategory} onOpenChange={setOpenCategory}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCategory}
                    className="relative w-full justify-between bg-transparent hover:bg-gray-100"
                  >
                    <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                    <span className="ml-8">
                      {selectedCategory ? selectedCategory : "Select category"}
                    </span>
                    {selectedCategory && (
                      <div
                        onClick={clearCategory}
                        className="absolute right-8 cursor-pointer"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </div>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {categories && categories.length > 0 ? (
                        categories.map((cat, index) => (
                          <CommandItem
                            key={index}
                            value={cat.category}
                            onSelect={(currentValue) => {
                              setSelectedCategory(
                                currentValue === selectedCategory
                                  ? ""
                                  : currentValue
                              );
                              setOpenCategory(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCategory === cat.category
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {cat.category}
                          </CommandItem>
                        ))
                      ) : (
                        <CommandItem>No categories available</CommandItem>
                      )}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Job Type Dropdown */}
            {!isInternshipPage && (
              <div className="relative min-w-[200px]">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between bg-transparent hover:bg-gray-100"
                    >
                      {jobType
                        ? jobTypes.find((t) => t.value === jobType)?.label
                        : "Job Type"}
                      {jobType && (
                        <div
                          onClick={clearJobType}
                          className="absolute right-8 cursor-pointer"
                        >
                          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </div>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search job type..." />
                      <CommandEmpty>No job type found.</CommandEmpty>
                      <CommandGroup>
                        {jobTypes.map((type) => (
                          <CommandItem
                            key={type.value}
                            value={type.value}
                            onSelect={(currentValue) => {
                              setJobType(
                                currentValue === jobType ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                jobType === type.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {type.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Experience Level Dropdown */}
            {!isInternshipPage && (
              <div className="relative min-w-[200px]">
                <div className="relative">
                  <Select
                    onValueChange={setExperienceLevel}
                    value={experienceLevel}
                  >
                    <SelectTrigger className="min-w-[250px] relative">
                      <div className="flex-1 text-left">
                        <SelectValue placeholder="Select experience" />
                      </div>
                      {experienceLevel && (
                        <div
                          className="absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer z-10"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            clearExperience(e);
                          }}
                        >
                          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </div>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Search Button */}
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
