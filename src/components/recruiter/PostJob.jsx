import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Check, ChevronsUpDown } from "lucide-react";
import publicApi from "@/api/publicApi";
import recruiterApi from "@/api/recruiterApi";
import { useAuth } from "@/context/AuthContex";
import { cn } from "@/lib/utils";

const descriptionHint = `• Overview of the role and its importance
• Day-to-day responsibilities
• Team structure and reporting relationships
• Growth opportunities
• Work environment and culture`;

const requirementsHint = `• Years of experience in specific areas
• Technical skills required
• Soft skills needed
• Certifications required
• Language proficiency`;

const educationHint = `• Minimum qualification required
• Preferred field of study
• Additional certifications
• Equivalent experience considerations`;

const skillsHint = `Languages: JavaScript, Python, Java
Frameworks: React, Django, Spring Boot
Databases: MongoDB, PostgreSQL
Tools: Git, Docker, AWS
Soft Skills: Communication, Problem Solving, Team Leadership

Note: Format as categories with colon (:) followed by comma-separated skills`;

const benefitsHint = `Healthcare:
• Medical insurance
• Dental coverage
• Vision care

Time Off:
• 20 days paid vacation
• Flexible working hours
• Sick leave

Professional Development:
• Training budget
• Conference attendance
• Certification support

Other:
• 401(k) matching
• Remote work options
• Gym membership

Note: Format as categories followed by bullet points`;

const responsibilitiesHint = `• Lead the development of frontend features
• Collaborate with cross-functional teams
• Mentor junior developers
• Participate in code reviews
• Optimize application performance
• Troubleshoot and debug issues

Note: Use bullet points for clear organization`;

const niceToHaveHint = `• Experience with specific technologies
• Additional certifications
• Industry-specific knowledge
• Foreign language proficiency
• Open source contributions
• Leadership experience

Note: List preferred but not required qualifications`;

const PostJob = () => {
  const navigate = useNavigate();
  const { categories } = useAuth();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    jobType: "",
    category: "",
    experienceLevel: "",
    salaryRange: "",
    jobDescription: "",
    requirements: "",
    responsibilities: "", // Add new field
    niceToHave: "", // Add new field
    deadline: "",
    requiredSkills: "",
    benefitsAndPerks: "",
    educationRequirement: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (categories?.length > 0) {
      setIsLoading(false);
    }
  }, [categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        ...formData,
        id: null,
      };

      const response = await recruiterApi.post("/save-job", dataToSend);
      navigate("/recruiter/jobs");
    } catch (error) {
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card className="max-w-3xl mx-auto p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Post a New Job
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                placeholder="e.g. Senior Frontend Developer"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicationDeadline">Application Deadline</Label>
              <Input
                type="date"
                id="applicationDeadline"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deadline: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, jobType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                      disabled={isLoading}
                    >
                      {formData.category
                        ? categories?.find(
                            (cat) => cat.category === formData.category
                          )?.category
                        : isLoading
                        ? "Loading categories..."
                        : "Select category..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search category..." />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories?.map((cat) => (
                          <CommandItem
                            key={cat.id}
                            value={cat.category}
                            onSelect={(currentValue) => {
                              setFormData({
                                ...formData,
                                category: currentValue,
                              });
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.category === cat.category
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {cat.category}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, experienceLevel: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">
                      Entry Level (0-2 years)
                    </SelectItem>
                    <SelectItem value="intermediate">
                      Intermediate (2-5 years)
                    </SelectItem>
                    <SelectItem value="senior">Senior (5-8 years)</SelectItem>
                    <SelectItem value="expert">Expert (8+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  placeholder="e.g. $50,000 - $70,000"
                  value={formData.salaryRange}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryRange: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. New York, NY (Remote Available)"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                placeholder={descriptionHint}
                rows={6}
                value={formData.jobDescription}
                onChange={(e) =>
                  setFormData({ ...formData, jobDescription: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibilities">Key Responsibilities</Label>
              <Textarea
                id="responsibilities"
                placeholder={responsibilitiesHint}
                rows={4}
                value={formData.responsibilities}
                onChange={(e) =>
                  setFormData({ ...formData, responsibilities: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                placeholder={requirementsHint}
                rows={4}
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="niceToHave">Nice to Have</Label>
              <Textarea
                id="niceToHave"
                placeholder={niceToHaveHint}
                rows={4}
                value={formData.niceToHave}
                onChange={(e) =>
                  setFormData({ ...formData, niceToHave: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education">Education Requirements</Label>
                <Textarea
                  id="education"
                  placeholder={educationHint}
                  rows={2}
                  value={formData.educationRequirement}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      educationRequirement: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills</Label>
              <Textarea
                id="skills"
                placeholder={skillsHint}
                rows={3}
                value={formData.requiredSkills}
                onChange={(e) =>
                  setFormData({ ...formData, requiredSkills: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits & Perks</Label>
              <Textarea
                id="benefits"
                placeholder={benefitsHint}
                rows={3}
                value={formData.benefitsAndPerks}
                onChange={(e) =>
                  setFormData({ ...formData, benefitsAndPerks: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              type="button"
            >
              Cancel
            </Button>
            <Button className="w-full sm:w-auto" type="submit">
              Post Job
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PostJob;
