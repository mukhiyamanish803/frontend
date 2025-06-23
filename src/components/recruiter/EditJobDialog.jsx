import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import recruiterApi from "@/api/recruiterApi";
import publicApi from "@/api/publicApi";
import { useAuth } from "@/context/AuthContex";

const descriptionHint = `• Overview of the role and its importance...`;
const requirementsHint = `• Years of experience in specific areas...`;
const educationHint = `• Minimum qualification required...`;
const skillsHint = `Languages: JavaScript, Python, Java...`;
const benefitsHint = `Healthcare:\n• Medical insurance...`;
const responsibilitiesHint = `• Lead the development of frontend features
• Collaborate with cross-functional teams
• Mentor junior developers
• Participate in code reviews
• Optimize application performance
• Troubleshoot and debug issues`;
const niceToHaveHint = `• Experience with specific technologies
• Additional certifications
• Industry-specific knowledge
• Foreign language proficiency
• Open source contributions
• Leadership experience`;

const EditJobDialog = ({ job, onClose, onUpdate }) => {
  const { categories } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: job.jobTitle,
    location: job.location,
    jobType: job.jobType,
    category: job.category,
    experienceLevel: job.experienceLevel,
    salaryRange: job.salaryRange,
    jobDescription: job.jobDescription,
    requirements: job.requirements,
    responsibilities: job.responsibilities || "",
    niceToHave: job.niceToHave || "",
    deadline: job.deadline,
    requiredSkills: job.requiredSkills,
    benefitsAndPerks: job.benefitsAndPerks,
    educationRequirement: job.educationRequirement,
    status: job.status,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Log the request details
      console.log("Submitting job update:", {
        jobId: job.id,
        endpoint: `/save-job?id=${job.id}`,
        formData,
      });

      const response = await recruiterApi.post(
        `/save-job?id=${job.id}`,
        formData
      );
      console.log("Update response:", response.data);
      onUpdate(response.data);
    } catch (error) {
      console.error("Error updating job:", error.response?.data || error);
    }
  };

  useEffect(() => {
    console.log("Form data:", formData);
    console.log("Available categories:", categories);
  }, [formData, categories]);

  return (
    <Dialog open={true} onOpenChange={onClose} className="max-w-5xl">
      <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job Posting</DialogTitle>
          <DialogDescription>
            Make changes to your job posting. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  value={formData.salaryRange}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryRange: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Select
                  id="jobType"
                  value={formData.jobType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, jobType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
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
                    >
                      {formData.category || "Select category..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search category..." />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {Array.isArray(categories) &&
                          categories.map((cat) => (
                            <CommandItem
                              key={cat.category}
                              value={cat.category}
                              onSelect={(currentValue) => {
                                setFormData({
                                  ...formData,
                                  category:
                                    currentValue === formData.category
                                      ? ""
                                      : currentValue,
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select
                  value={formData.experienceLevel}
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
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                placeholder="Describe the job responsibilities and requirements..."
                value={formData.jobDescription}
                onChange={(e) =>
                  setFormData({ ...formData, jobDescription: e.target.value })
                }
                hint={descriptionHint}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibilities">Key Responsibilities</Label>
              <Textarea
                id="responsibilities"
                placeholder="List the key responsibilities for this position..."
                value={formData.responsibilities}
                onChange={(e) =>
                  setFormData({ ...formData, responsibilities: e.target.value })
                }
                hint={responsibilitiesHint}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="List the required qualifications and skills..."
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
                hint={requirementsHint}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="educationRequirement">
                Education Requirement
              </Label>
              <Textarea
                id="educationRequirement"
                placeholder="Specify the education qualifications needed..."
                value={formData.educationRequirement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    educationRequirement: e.target.value,
                  })
                }
                hint={educationHint}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredSkills">Required Skills</Label>
              <Textarea
                id="requiredSkills"
                placeholder="List the essential skills for this job..."
                value={formData.requiredSkills}
                onChange={(e) =>
                  setFormData({ ...formData, requiredSkills: e.target.value })
                }
                hint={skillsHint}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="niceToHave">Nice to Have</Label>
              <Textarea
                id="niceToHave"
                placeholder="List preferred but not required qualifications..."
                value={formData.niceToHave}
                onChange={(e) =>
                  setFormData({ ...formData, niceToHave: e.target.value })
                }
                hint={niceToHaveHint}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefitsAndPerks">Benefits and Perks</Label>
              <Textarea
                id="benefitsAndPerks"
                placeholder="Describe the benefits and perks offered..."
                value={formData.benefitsAndPerks}
                onChange={(e) =>
                  setFormData({ ...formData, benefitsAndPerks: e.target.value })
                }
                hint={benefitsHint}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditJobDialog;
