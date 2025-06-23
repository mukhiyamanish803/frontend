import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import jobseekerApi from "@/api/JobseekerApi";

const AddOrUpdateExperience = ({ experience, onSubmit, onCancel }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [technologies, setTechnologies] = useState(experience?.skills || []);
  const [certificateType, setCertificateType] = useState(
    experience?.certificateLink ? "link" : "file"
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const newTech = e.target.value.trim();
      if (!technologies.includes(newTech)) {
        setTechnologies((prev) => [...prev, newTech]);
      }
      e.target.value = "";
    }
  };

  const removeTag = (tagToRemove) => {
    setTechnologies((prev) => prev.filter((tech) => tech !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }

      const formDataObj = Object.fromEntries(new FormData(e.target));
      // Cleanup certificateLink based on certificateType
      if (certificateType === "file") {
        delete formDataObj.certificateLink;
      }

      formDataObj.skills = technologies;
      formDataObj.current = formDataObj.current === "on";

      // Include the ID if we're updating an existing experience
      if (experience?.id) {
        formDataObj.id = experience.id;
        // Keep existing certificate info if no new file is uploaded
        if (!file && experience.certificateFile) {
          formDataObj.certificateFile = experience.certificateFile;
        }
      }

      formData.append("data", JSON.stringify(formDataObj));
      const response = await jobseekerApi.post("save-experience", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        experience?.id
          ? "Experience has been updated successfully"
          : "Experience has been added successfully"
      );

      if (onSubmit) {
        onSubmit(response.data.experience);
      }
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error(
        error.response?.data?.message ||
          (experience?.id
            ? "Failed to update experience. Please try again"
            : "Failed to add experience. Please try again")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-6 shadow-none bg-transparent border-none">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="block text-sm font-medium mb-1">Job Title</Label>
          <Input
            type="text"
            name="jobTitle"
            defaultValue={experience?.jobTitle || ""}
            placeholder="e.g. Software Engineer"
            required
          />
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">Company</Label>
          <Input
            type="text"
            name="companyName"
            defaultValue={experience?.companyName || ""}
            placeholder="e.g. ABC Corp"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium mb-1">
              Company Website
            </Label>
            <Input
              type="url"
              name="companyUrl"
              defaultValue={experience?.companyUrl || ""}
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium mb-1">Start Date</Label>
            <Input
              type="date"
              name="startDate"
              defaultValue={
                experience?.startDate || new Date().toISOString().split("T")[0]
              }
              required
            />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-1">End Date</Label>
            <Input
              type="date"
              name="endDate"
              defaultValue={experience?.endDate || ""}
            />
          </div>
        </div>

        <div>
          <Label className="flex items-center gap-2">
            <Checkbox
              name="current"
              defaultChecked={experience?.current || false}
            />
            <span>I currently work here</span>
          </Label>
        </div>

        <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
          <Label className="text-lg font-medium">Certificate</Label>{" "}
          <RadioGroup
            className="flex space-x-4"
            name="certificateType"
            defaultValue={certificateType}
            onValueChange={setCertificateType}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="link" id="link" />
              <Label htmlFor="link">Certificate Link</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="file" id="file" />
              <Label htmlFor="file">Certificate File</Label>
            </div>
          </RadioGroup>{" "}
          <div
            className="space-y-2"
            style={{ display: certificateType === "link" ? "block" : "none" }}
          >
            <Input
              type="url"
              name="certificateLink"
              defaultValue={experience?.certificateLink || ""}
              placeholder="https://certificate-url.com"
            />
          </div>
          <div
            className="space-y-2"
            style={{ display: certificateType === "file" ? "block" : "none" }}
          >
            <Label>Upload Certificate</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
              >
                Choose File
              </Button>
              <span className="text-sm text-gray-600">
                {file ? file.name : "No file chosen"}
              </span>
            </div>
          </div>
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">
            Technologies Used
          </Label>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Type a technology and press Enter"
              onKeyDown={handleKeyDown}
            />
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-1">
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTag(tech)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">Description</Label>
          <Textarea
            name="description"
            defaultValue={experience?.description || ""}
            rows="4"
          />
        </div>

        <div className="space-y-4 border rounded-lg p-4">
          <Label className="text-lg font-medium">Company Location</Label>
          <div className="space-y-2">
            <Input
              type="text"
              name="companyLocation"
              defaultValue={experience?.companyLocation || ""}
              placeholder="e.g. 123 Main St, Springfield, IL, USA, 62704"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          {" "}
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              `${experience ? "Update" : "Add"} Experience`
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AddOrUpdateExperience;
