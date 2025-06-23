import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FileText, Upload, Plus } from "lucide-react";

const AddOrUpdateCertificateCard = ({ initialData, onSubmit, onCancel }) => {
  const [file, setFile] = useState(null); // Changed from files array to single file
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: initialData?.title || "",
    organization: initialData?.organization || "",
    organizationLink: initialData?.organizationLink || "",
    certificateLink: initialData?.certificateLink || "",
    description: initialData?.description || "",
    skillsAcquired: initialData?.skillsAcquired || [],
    dateIssued: initialData?.dateIssued
      ? new Date(initialData.dateIssued)
      : new Date(),
    dateExpire: initialData?.dateExpire
      ? new Date(initialData.dateExpire)
      : undefined,
    address: {
      street: initialData?.address?.street || "",
      city: initialData?.address?.city || "",
      state: initialData?.address?.state || "",
      country: initialData?.address?.country || "",
      zipCode: initialData?.address?.zipCode || "",
    },
    documents: initialData?.documents || {
      fileName: "",
      fileUrl: "",
      fileType: "",
      uploadDate: new Date(),
    },
  });

  const [skillInput, setSkillInput] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleAddSkill = (skill) => {
    if (skill && !form.skillsAcquired.includes(skill)) {
      setForm((prev) => ({
        ...prev,
        skillsAcquired: [...prev.skillsAcquired, skill],
      }));
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      skillsAcquired: prev.skillsAcquired.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const isValidUrl = (urlString) => {
    try {
      new URL(urlString);
      return true;
    } catch (error) {
      return false;
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!form.title) errors.push("Title is required");
    if (!form.organization) errors.push("Organization is required");
    if (!form.dateIssued) errors.push("Issue date is required");
    if (form.organizationLink && !isValidUrl(form.organizationLink)) {
      errors.push("Invalid organization URL");
    }
    if (form.certificateLink && !isValidUrl(form.certificateLink)) {
      errors.push("Invalid certificate URL");
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    if (!file && !form.documents.fileUrl?.trim()) {
      toast.error("Either certificate file or certificate link is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Create certificate data object with proper null handling
      const certificateData = {
        title: form.title.trim(),
        organization: form.organization.trim(),
        organizationLink: form.organizationLink?.trim() || null,
        certificateLink: form.certificateLink?.trim() || null,
        description: form.description?.trim() || null,
        skillsAcquired: form.skillsAcquired || [],
        dateIssued: form.dateIssued.toISOString().split("T")[0],
        dateExpire: form.dateExpire
          ? form.dateExpire.toISOString().split("T")[0]
          : null,
        address: {
          street: form.address.street?.trim() || null,
          city: form.address.city?.trim() || null,
          state: form.address.state?.trim() || null,
          country: form.address.country?.trim() || null,
          zipCode: form.address.zipCode?.trim() || null,
        },
      };

      console.log("Submitting certificate data:", certificateData);
      formData.append("data", JSON.stringify(certificateData));

      if (file) {
        console.log("Attaching file:", file.name);
        formData.append("documents", file);
      }

      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        "Failed to save certificate";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]); // Only take the first file
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]); // Only take the first file
    }
  };

  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  const addSkill = () => {
    if (skillInput.trim() && !form.skillsAcquired.includes(skillInput.trim())) {
      handleAddSkill(skillInput.trim());
      setSkillInput("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? "Update Certificate" : "Add Certificate"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title field */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Certificate Title*
            </label>
            <Input
              name="title"
              value={form.title}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Organization field */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Issuing Organization*
            </label>
            <Input
              name="organization"
              value={form.organization}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Organization Link field */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Organization Website
            </label>
            <Input
              type="url"
              placeholder="https://"
              name="organizationLink"
              value={form.organizationLink}
              onChange={handleInputChange}
            />
          </div>

          {/* Certificate Link field */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Certificate URL
            </label>
            <Input
              type="url"
              placeholder="https://"
              name="certificateLink"
              value={form.certificateLink}
              onChange={handleInputChange}
            />
          </div>

          {/* Description field */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Description
            </label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
            />
          </div>

          {/* Skills field */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Skills Acquired</label>
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex flex-wrap gap-2">
                {form.skillsAcquired.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      className="ml-2 hover:text-destructive"
                      onClick={() => handleRemoveSkill(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={handleSkillInputChange}
                  placeholder="Enter a skill"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addSkill}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Date fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Date Issued*
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dayjs(form.dateIssued)}
                  onChange={(newValue) =>
                    setForm((prev) => ({
                      ...prev,
                      dateIssued: newValue?.toDate(),
                    }))
                  }
                  maxDate={dayjs()}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Expiry Date
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={form.dateExpire ? dayjs(form.dateExpire) : null}
                  onChange={(newValue) =>
                    setForm((prev) => ({
                      ...prev,
                      dateExpire: newValue?.toDate(),
                    }))
                  }
                  minDate={dayjs()}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>

          {/* Address fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address (Optional)</h3>
            {["street", "city", "state", "country", "zipCode"].map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {field}
                </label>
                <Input
                  name={field}
                  value={form.address[field]}
                  onChange={handleAddressChange}
                />
              </div>
            ))}
          </div>

          {/* Documents upload field */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Upload Certificate Document
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-border"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-3">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  Drag & drop your certificate here, or click to select
                </p>
                <Input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("file-upload").click()}
                >
                  Choose File
                </Button>
              </div>
            </div>

            {/* Single File display */}
            {file && (
              <div className="mt-4">
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : initialData ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddOrUpdateCertificateCard;
