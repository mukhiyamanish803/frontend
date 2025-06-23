import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import jobseekerApi from "@/api/JobseekerApi";

const AddOrUpdateProject = ({ project, onSubmit, onCancel }) => {
  const fileInputRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [technologies, setTechnologies] = useState(project?.technologies || []);
  const [features, setFeatures] = useState(project?.features || []);
  const [screenshots, setScreenshots] = useState(project?.screenshots || []);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [deletedScreenshots, setDeletedScreenshots] = useState([]);

  const handleKeyDown = (e, type) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const newValue = e.target.value.trim();
      if (type === "tech" && !technologies.includes(newValue)) {
        setTechnologies((prev) => [...prev, newValue]);
      } else if (type === "feature" && !features.includes(newValue)) {
        setFeatures((prev) => [...prev, newValue]);
      }
      e.target.value = "";
    }
  };

  const removeTag = (value, type) => {
    if (type === "tech") {
      setTechnologies((prev) => prev.filter((tech) => tech !== value));
    } else if (type === "feature") {
      setFeatures((prev) => prev.filter((feature) => feature !== value));
    }
  };
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(
      (file) =>
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png"
    );

    if (validFiles.length !== files.length) {
      toast.error("Only JPG, JPEG, and PNG files are allowed");
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();

      // Get form data from form fields
      const formFields = Object.fromEntries(new FormData(e.target));

      // Create project data object
      const projectData = {
        ...formFields,
        technologies,
        features,
        id: project?.id, // Add ID if updating
      };

      // Add project data as JSON string
      formData.append("data", JSON.stringify(projectData));

      // Add new screenshots if available
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("screenshots", file);
        });
      }

      // Add deleted screenshot URLs if any
      if (deletedScreenshots.length > 0) {
        formData.append(
          "deletedScreenshots",
          JSON.stringify(deletedScreenshots)
        );
      }

      const response = await jobseekerApi.post("save-project", formData);

      toast.success(
        project?.id
          ? "Project has been updated successfully"
          : "Project has been added successfully"
      );

      if (onSubmit) {
        onSubmit(response.data.project);
      }
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error(
        error.response?.data?.message ||
          (project?.id
            ? "Failed to update project. Please try again"
            : "Failed to add project. Please try again")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const removeScreenshot = (screenshot) => {
    if (screenshot.fileUrl) {
      // If it's an existing screenshot
      setDeletedScreenshots((prev) => [...prev, screenshot.fileUrl]);
      setScreenshots((prev) =>
        prev.filter((s) => s.fileUrl !== screenshot.fileUrl)
      );
    } else {
      // If it's a newly selected file
      setSelectedFiles((prev) => prev.filter((f) => f !== screenshot));
    }
  };

  const renderScreenshotPreviews = () => {
    return (
      <div className="mt-4 space-y-4">
        <Label>Screenshots</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Existing screenshots */}
          {screenshots.map((screenshot, index) => (
            <div key={index} className="relative group">
              <img
                src={screenshot.fileUrl}
                alt={`Project screenshot ${index + 1}`}
                className="rounded-lg h-40 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeScreenshot(screenshot)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* New file previews */}
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`New screenshot ${index + 1}`}
                className="rounded-lg h-40 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeScreenshot(file)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* Upload button */}
          <button
            type="button"
            onClick={triggerFileInput}
            className="h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
          >
            <div className="text-center">
              <div className="mt-2 text-sm text-gray-600">
                Click to add screenshot
              </div>
            </div>
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/jpg,image/png"
          multiple
          className="hidden"
        />
      </div>
    );
  };

  return (
    <Card className="p-6 shadow-none bg-transparent border-none">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="block text-sm font-medium mb-1">
            Project Title*
          </Label>
          <Input
            type="text"
            name="title"
            defaultValue={project?.title || ""}
            placeholder="e.g. E-commerce Website"
            required
          />
        </div>
        <div>
          <Label className="block text-sm font-medium mb-1">GitHub URL</Label>
          <Input
            type="url"
            name="githubUrl"
            defaultValue={project?.githubUrl || ""}
            placeholder="https://github.com/username/project"
          />
        </div>{" "}
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-1">
              Live Demo URL
            </Label>
            <Input
              type="url"
              name="liveUrl"
              defaultValue={project?.liveUrl || ""}
              placeholder="https://project-demo.com"
            />
          </div>{" "}
          <div>
            <Label className="block text-sm font-medium mb-1">
              Project Screenshots
              <span className="text-gray-500 text-sm ml-2">
                (Recommended if no live demo URL)
              </span>
            </Label>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Existing screenshots */}
                {screenshots.map((screenshot, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={screenshot.fileUrl}
                      alt={`Project screenshot ${index + 1}`}
                      className="rounded-lg h-40 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeScreenshot(screenshot)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* New file previews */}
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New screenshot ${index + 1}`}
                      className="rounded-lg h-40 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeScreenshot(file)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Upload button */}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-sm text-gray-600">
                      Click to add screenshot
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedFiles.length > 0
                        ? `${selectedFiles.length} file(s) selected`
                        : project?.screenshots?.length > 0
                        ? `${project.screenshots.length} screenshot(s) uploaded`
                        : "JPG, JPEG, PNG"}
                    </div>
                  </div>
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/jpg,image/png"
                multiple
                className="hidden"
              />
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
              onKeyDown={(e) => handleKeyDown(e, "tech")}
            />
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-1">
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTag(tech, "tech")}
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
          <Label className="block text-sm font-medium mb-1">Key Features</Label>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Type a feature and press Enter"
              onKeyDown={(e) => handleKeyDown(e, "feature")}
            />
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-1">
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeTag(feature, "feature")}
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
            defaultValue={project?.description || ""}
            placeholder="Describe your project, its goals, and your role..."
            rows="4"
          />{" "}
        </div>
        <div className="flex justify-end space-x-2">
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
              `${project ? "Update" : "Add"} Project`
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AddOrUpdateProject;
