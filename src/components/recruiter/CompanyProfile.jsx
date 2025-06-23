import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  HiOfficeBuilding,
  HiGlobe,
  HiMail,
  HiPhone,
  HiLocationMarker,
} from "react-icons/hi";
import { FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { HiUpload, HiTrash } from "react-icons/hi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import publicApi from "@/api/publicApi";
import recruiterApi from "@/api/recruiterApi";
import { toast } from "sonner";

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Always start with editing disabled
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoError, setLogoError] = useState("");
  const [dialCodes, setDialCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [logo, setLogo] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    industryType: "",
    description: "",
    website: "",
    businessEmail: "",
    address: "", // Changed from object to string
    socialMedia: {
      linkedin: "",
      twitter: "",
      instagram: "",
    },
    dialCode: {
      countryCode: "US",
      dialCode: "+1",
      countryName: "United States",
    },
    phoneNumber: "",
    logo: {
      fileUrl: "",
      fileName: "",
      fileType: "",
      uploadDate: null,
    },
  });

  // Add local state for address fields
  const [addressFields, setAddressFields] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  // Memoize fetch function
  const fetchCompanyData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await recruiterApi.get("/my-company");
      const data = response.data;

      // Parse address string into fields
      const addressParts = (data.address || "")
        .split(",")
        .map((part) => part.trim());
      const addressFields = {
        street: addressParts[0] || "",
        city: addressParts[1] || "",
        state: addressParts[2] || "",
        country: addressParts[3] || "",
        zipCode: addressParts[4] || "",
      };
      setAddressFields(addressFields);

      const mappedData = {
        companyName: data.companyName || "",
        industryType: data.industryType || "",
        description: data.description || "",
        website: data.website || "",
        businessEmail: data.businessEmail || "",
        address: data.address || "", // Keep as single string
        socialMedia: data.socialMedia || {
          linkedin: "",
          twitter: "",
          instagram: "",
        },
        dialCode: data.dialCode || {
          countryCode: "US",
          dialCode: "+1",
          countryName: "United States",
        },
        phoneNumber: data.phoneNumber || "",
        logo: data.logo || {
          fileUrl: "",
          fileName: "",
          fileType: "",
          uploadDate: null,
        },
      };

      setCompanyData(data);
      setFormData(mappedData);
      setLogoPreview(data.logo?.fileUrl || null);
      setFetchError(null);
    } catch (err) {
      console.error("Error fetching company data:", err);
      if (err.response?.status === 404) {
        // If company doesn't exist yet, just set companyData to null
        setCompanyData(null);
        setFetchError(null);
      } else {
        toast.error(err.message || "Failed to fetch company data");
        setFetchError(err.message || "Failed to fetch company data");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoize input handlers
  const handleInputChange = useCallback((section, key, value) => {
    console.log(`Updating ${section}${key ? "." + key : ""} with:`, value);

    setFormData((prev) => {
      if (key === null) {
        return { ...prev, [section]: value };
      }
      return {
        ...prev,
        [section]: { ...prev[section], [key]: value },
      };
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const formDataToSend = new FormData();
      const dataToSend = {
        companyName: formData.companyName,
        industryType: formData.industryType,
        businessEmail: formData.businessEmail,
        description: formData.description,
        website: formData.website,
        phoneNumber: formData.phoneNumber,
        dialCode: formData.dialCode,
        address: formData.address,
        socialMedia: formData.socialMedia,
        logo: logo ? null : formData.logo, // Only send existing logo if no new logo uploaded
      };

      formDataToSend.append("data", JSON.stringify(dataToSend));
      if (logo) {
        formDataToSend.append("logo", logo);
      }

      await toast.promise(
        recruiterApi.post("/company-details", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
        {
          loading: "Updating company profile...",
          success: "Company profile updated successfully!",
          error: (err) =>
            err.response?.data?.message || "Failed to update company profile",
        }
      );

      setIsEditing(false);
      await fetchCompanyData();
    } catch (err) {
      console.error("Submission error:", err.response?.data || err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        await fetchCompanyData();
        // Remove the auto-editing mode
        const dialCodesResponse = await publicApi.get("/dial-code");
        if (isMounted) {
          setDialCodes(dialCodesResponse.data);
        }
      } catch (err) {
        if (isMounted) {
          setFetchError(err.message || "Failed to fetch data");
          setDialCodes([
            { countryName: "United States", countryCode: "US", dialCode: "+1" },
            { countryName: "India", countryCode: "IN", dialCode: "+91" },
          ]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoError("");

    if (file) {
      // Check file size (200KB = 200 * 1024 bytes)
      if (file.size > 200 * 1024) {
        setLogoError("File size should not exceed 200KB");
        return;
      }

      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/svg+xml"];
      if (!validTypes.includes(file.type)) {
        setLogoError("Please upload a valid image file (PNG, JPG, SVG)");
        return;
      }

      setLogo(file);
      // Update logo preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        // Update form data with temporary logo info
        setFormData((prev) => ({
          ...prev,
          logo: {
            fileName: file.name,
            fileType: file.type,
            uploadDate: new Date().toISOString(),
            fileUrl: reader.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteLogo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLogoPreview(null);
    setLogoError("");
  };

  const handlePhoneChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumber: e.target.value,
    }));
  };

  const handleDialCodeChange = (value) => {
    const selectedCode = dialCodes.find((code) => code.dialCode === value);
    setFormData((prev) => ({
      ...prev,
      dialCode: selectedCode,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Update email input handling in Contact Information section
  const handleBusinessEmailChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      businessEmail: e.target.value,
    }));
  };

  // Add function to handle address field changes and update formData
  const handleAddressChange = (field, value) => {
    setAddressFields((prev) => {
      const newFields = { ...prev, [field]: value };
      // Update formData with comma-separated string
      const addressString = Object.values(newFields).filter(Boolean).join(", ");
      handleInputChange("address", null, addressString);
      return newFields;
    });
  };

  // Move getReadOnlyClass to useMemo
  const getReadOnlyClass = useMemo(() => {
    return (editing) => (editing ? "" : "bg-gray-50 cursor-not-allowed");
  }, []);

  return (
    <div className="h-full pb-6">
      {isLoading ? (
        <div className="w-full h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading company profile...</p>
          </div>
        </div>
      ) : fetchError ? (
        <div className="w-full h-[60vh] flex items-center justify-center">
          <div className="text-center text-red-600">
            <p>{fetchError}</p>
            <Button
              variant="outline"
              onClick={fetchCompanyData}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-5xl mx-auto pb-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Company Profile</h1>
              <p className="text-gray-500">
                Manage your company information and details
              </p>
            </div>
            <Button
              onClick={handleEditToggle}
              variant={isEditing ? "destructive" : "secondary"}
            >
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </Button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Company Logo - only show upload UI in edit mode */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <HiOfficeBuilding className="text-blue-500" />
                Company Logo
              </h2>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 relative">
                  {logoPreview ? (
                    <>
                      <img
                        src={logoPreview}
                        alt="Company logo preview"
                        className="w-full h-full object-contain p-2"
                      />
                      {isEditing && (
                        <button
                          type="button"
                          onClick={handleDeleteLogo}
                          className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-md z-10"
                        >
                          <HiTrash size={14} />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center">
                      <HiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-gray-600">
                        {isEditing ? "Upload Logo" : "No Logo"}
                      </span>
                    </div>
                  )}
                  {isEditing && (
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.svg"
                      onChange={handleLogoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  <p className="font-medium">Company Logo Requirements:</p>
                  <ul className="list-disc list-inside">
                    <li>File format: PNG, JPG, or SVG</li>
                    <li>Maximum size: 200KB</li>
                  </ul>
                  {logoError && (
                    <p className="text-red-500 mt-2 font-medium">{logoError}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Basic Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <HiOfficeBuilding className="text-blue-500" />
                Basic Information
              </h2>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) =>
                      handleInputChange("companyName", null, e.target.value)
                    }
                    placeholder="Enter company name"
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="industryType">Industry Type</Label>
                  <Input
                    id="industryType"
                    value={formData.industryType}
                    onChange={(e) =>
                      handleInputChange("industryType", null, e.target.value)
                    }
                    placeholder="Enter industry type"
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", null, e.target.value)
                    }
                    placeholder="Enter company description"
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", null, e.target.value)
                    }
                    placeholder="Enter company website"
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Contact Information
              </h2>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <div className="flex gap-2 items-center">
                    <HiMail className="text-gray-500" />
                    <Input
                      id="businessEmail"
                      type="email"
                      value={formData.businessEmail}
                      onChange={handleBusinessEmailChange}
                      placeholder="company@example.com"
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center gap-3">
                    <HiPhone className="flex-shrink-0 text-gray-500" />
                    <div className="flex-1 flex items-center gap-3">
                      <Select
                        value={formData.dialCode.dialCode}
                        onValueChange={handleDialCodeChange}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>
                            <div className="flex items-center gap-2">
                              <span>{formData.dialCode.countryCode}</span>
                              <span className="text-gray-500">
                                {formData.dialCode.dialCode}
                              </span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent align="start" className="w-[220px]">
                          {dialCodes.map((code) => (
                            <SelectItem
                              key={code.dialCode}
                              value={code.dialCode}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="font-medium">
                                  {code.countryCode}
                                </span>
                                <span className="text-gray-500">
                                  {code.dialCode}
                                </span>
                                <span className="text-xs text-gray-400 truncate max-w-[100px]">
                                  {code.countryName}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        value={formData.phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="Phone number"
                        className={`flex-1 ${getReadOnlyClass(isEditing)}`}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Address Fields */}
                <div className="grid gap-4">
                  <h3 className="font-medium">Office Address</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="street">Street</Label>
                      <Input
                        id="street"
                        value={addressFields.street}
                        onChange={(e) =>
                          handleAddressChange("street", e.target.value)
                        }
                        placeholder="Street address"
                        className={getReadOnlyClass(isEditing)}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={addressFields.city}
                        onChange={(e) =>
                          handleAddressChange("city", e.target.value)
                        }
                        placeholder="City"
                        className={getReadOnlyClass(isEditing)}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={addressFields.state}
                        onChange={(e) =>
                          handleAddressChange("state", e.target.value)
                        }
                        placeholder="State"
                        className={getReadOnlyClass(isEditing)}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={addressFields.country}
                        onChange={(e) =>
                          handleAddressChange("country", e.target.value)
                        }
                        placeholder="Country"
                        className={getReadOnlyClass(isEditing)}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        value={addressFields.zipCode}
                        onChange={(e) =>
                          handleAddressChange("zipCode", e.target.value)
                        }
                        placeholder="Zip Code"
                        className={getReadOnlyClass(isEditing)}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Social Media */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Social Media</h2>
              <div className="grid gap-4">
                {Object.entries(formData.socialMedia).map(([key, value]) => (
                  <div key={key} className="grid gap-2">
                    <Label htmlFor={`social-${key}`}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Label>
                    <div className="flex gap-2 items-center">
                      {key === "linkedin" && (
                        <FaLinkedin className="text-gray-500" />
                      )}
                      {key === "twitter" && (
                        <FaTwitter className="text-gray-500" />
                      )}
                      {key === "instagram" && (
                        <FaInstagram className="text-gray-500" />
                      )}
                      <Input
                        id={`social-${key}`}
                        value={value}
                        onChange={(e) =>
                          handleInputChange("socialMedia", key, e.target.value)
                        }
                        placeholder={`${key} profile URL`}
                        className={getReadOnlyClass(isEditing)}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Show save button only in edit mode */}
            {isEditing && (
              <div className="flex justify-end gap-4 py-4 mt-6 z-10">
                <Button type="submit" disabled={submitLoading}>
                  {submitLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default React.memo(CompanyProfile);
