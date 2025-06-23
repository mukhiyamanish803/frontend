import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { validateEducation } from "@/utils/validation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RiAddLine,
  RiFileLine,
  RiCloseLine,
  RiDownloadLine,
} from "react-icons/ri";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AddOrUpdateEducationCard = ({
  isEditing,
  currentEducation,
  handleSubmit,
  isSubmitting,
  handleGradeTypeChange,
  handleGradeValueChange,
  handleInstituteAddressChange,
  handleFileChange,
  downloadDocument,
  removeDocument,
  resetForm,
  handleInputChange,
  formatDate,
}) => {
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  // Validate form before submission
  const validateForm = () => {
    const validationErrors = validateEducation(currentEducation);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Enhanced file change handler with validation
  const handleEnhancedFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type) || file.size > 10 * 1024 * 1024
    );

    if (invalidFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        documents:
          "Some files are invalid. Please use PDF or DOC files under 10MB",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, documents: null }));
    handleFileChange(e);
  };

  // Enhanced submit handler with validation
  const handleEnhancedSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    await handleSubmit(e);
  };

  // Field change handler with validation
  const handleFieldChange = (field, value) => {
    handleInputChange(field, value);
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSkillsChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);
    if (value.endsWith(",")) {
      const newSkill = value.slice(0, -1).trim();
      if (newSkill && !currentEducation.skills.includes(newSkill)) {
        handleInputChange("skills", [...currentEducation.skills, newSkill]);
      }
      setSkillInput("");
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (newSkill && !currentEducation.skills.includes(newSkill)) {
        handleInputChange("skills", [...currentEducation.skills, newSkill]);
        setSkillInput("");
      }
    } else if (e.key === "Backspace" && !skillInput) {
      handleInputChange("skills", currentEducation.skills.slice(0, -1));
    }
  };

  const removeSkill = (skillToRemove) => {
    handleInputChange(
      "skills",
      currentEducation.skills.filter((skill) => skill !== skillToRemove)
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit" : "Add"} Education</CardTitle>
        <CardDescription>
          Add your educational background and qualifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEnhancedSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Institute Name *
              </label>
              <Input
                type="text"
                value={currentEducation.instituteName}
                onChange={(e) =>
                  handleFieldChange("instituteName", e.target.value)
                }
                className={errors.instituteName ? "border-red-500" : ""}
              />
              {errors.instituteName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.instituteName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Degree *</label>
              <Input
                type="text"
                value={currentEducation.degree}
                onChange={(e) => handleFieldChange("degree", e.target.value)}
                className={errors.degree ? "border-red-500" : ""}
              />
              {errors.degree && (
                <p className="text-red-500 text-sm mt-1">{errors.degree}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Field of Study *
              </label>
              <Input
                type="text"
                value={currentEducation.fieldOfStudy}
                onChange={(e) =>
                  handleFieldChange("fieldOfStudy", e.target.value)
                }
                className={errors.fieldOfStudy ? "border-red-500" : ""}
                placeholder="e.g., Computer Science, Business Administration"
              />
              {errors.fieldOfStudy && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fieldOfStudy}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Specialization
              </label>
              <Input
                type="text"
                value={currentEducation.specialization}
                onChange={(e) =>
                  handleFieldChange("specialization", e.target.value)
                }
                className={errors.specialization ? "border-red-500" : ""}
                placeholder="e.g., Software Engineering, Marketing"
              />
              {errors.specialization && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.specialization}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date *
              </label>
              <Input
                type="date"
                value={currentEducation.startDate}
                onChange={(e) => handleFieldChange("startDate", e.target.value)}
                className={errors.startDate ? "border-red-500" : ""}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input
                type="date"
                value={currentEducation.endDate}
                onChange={(e) => handleFieldChange("endDate", e.target.value)}
                className={errors.endDate ? "border-red-500" : ""}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Grade Type
              </label>
              <Select
                value={currentEducation.gradeType}
                onValueChange={handleGradeTypeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="cgpa">CGPA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Grade Value
              </label>
              <Input
                type="text"
                value={currentEducation.gradeValue}
                onChange={(e) => handleGradeValueChange(e.target.value)}
                className={errors.gradeValue ? "border-red-500" : ""}
              />
              {errors.gradeValue && (
                <p className="text-red-500 text-sm mt-1">{errors.gradeValue}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <textarea
              className="w-full min-h-[100px] p-3 border rounded-md"
              placeholder="Description"
              value={currentEducation.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          {/* Institute Address */}
          <div className="col-span-2">
            <h3 className="text-sm font-medium mb-2">Institute Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Street"
                value={currentEducation.address?.street || ""}
                onChange={(e) => handleInstituteAddressChange(e, "street")}
              />
              <Input
                placeholder="City"
                value={currentEducation.address?.city || ""}
                onChange={(e) => handleInstituteAddressChange(e, "city")}
              />
              <Input
                placeholder="State"
                value={currentEducation.address?.state || ""}
                onChange={(e) => handleInstituteAddressChange(e, "state")}
              />
              <Input
                placeholder="Country"
                value={currentEducation.address?.country || ""}
                onChange={(e) => handleInstituteAddressChange(e, "country")}
              />
              <Input
                placeholder="Zip Code"
                value={currentEducation.address?.zipCode || ""}
                onChange={(e) => handleInstituteAddressChange(e, "zipCode")}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="col-span-2 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Skills Acquired</h3>
              <div className="border rounded-lg p-3 space-y-3">
                {currentEducation.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {currentEducation.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-destructive focus:outline-none"
                        >
                          <RiCloseLine className="h-4 w-4" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <Input
                  placeholder="Type a skill and press Enter or comma to add"
                  value={skillInput}
                  onChange={handleSkillsChange}
                  onKeyDown={handleSkillKeyDown}
                  className="border-0 focus-visible:ring-0 p-0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Press Enter or type comma (,) to add a skill
              </p>
            </div>
          </div>

          {/* Documents */}
          <div className="col-span-2 space-y-4">
            <h3 className="text-sm font-medium">Documents</h3>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
              <div className="flex flex-col items-center justify-center gap-2">
                <Input
                  type="file"
                  multiple
                  onChange={handleEnhancedFileChange}
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="flex flex-col items-center justify-center w-full h-32 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <RiAddLine className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Click to upload documents
                  </span>
                  <span className="text-xs text-gray-400">
                    PDF, DOC, DOCX up to 10MB
                  </span>
                </label>
              </div>
            </div>

            {currentEducation.documents?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {currentEducation.documents.map((doc, index) => (
                  <div
                    key={doc._id || doc.id || `document-${index}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <RiFileLine className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-gray-600 truncate max-w-[200px]">
                        {doc.fileName || doc.name || "Untitled"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => downloadDocument(doc)}
                        className="p-1 hover:bg-white rounded"
                      >
                        <RiDownloadLine className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.fileUrl || doc.url)}
                        className="p-1 hover:bg-white rounded"
                      >
                        <RiCloseLine className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                `${isEditing ? "Update" : "Add"} Education`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddOrUpdateEducationCard;
