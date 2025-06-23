import { useAuth } from "@/context/AuthContex";
import React, { useState, useRef, useEffect } from "react";
import {
  RiEditLine,
  RiUserLine,
  RiLinkedinBoxLine,
  RiGithubLine,
  RiGlobalLine,
  RiFacebookBoxFill,
  RiInstagramLine,
} from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import adminApi from "@/api/adminApi";
import JobseekerApi from "@/api/JobseekerApi";
import { toast } from "sonner";
import publicApi from "@/api/publicApi";

const JobseekerProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dialCodes, setDialCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, fetchUser } = useAuth();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    title: user?.title || "",
    bio: user?.bio || "",
    profileImage: user?.profileImage || null,
    socialLinks: {
      linkedin: "",
      github: "",
      facebook: "",
      instagram: "",
      portfolio: "",
      ...(Array.isArray(user?.socialLinks)
        ? user?.socialLinks.reduce((acc, link) => {
            if (link.includes("linkedin.com")) acc.linkedin = link;
            else if (link.includes("github.com")) acc.github = link;
            else if (link.includes("facebook.com")) acc.facebook = link;
            else if (link.includes("instagram.com")) acc.instagram = link;
            else acc.portfolio = link;
            return acc;
          }, {})
        : user?.socialLinks),
    },
    address: user?.address || {
      country: "",
      state: "",
      city: "",
      street: "",
      zipCode: "",
    },
    dialCode: user?.dialCode || {
      countryName: "United States",
      countryCode: "US",
      dialCode: "+1",
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  const handleChange = (e, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleAddressChange = (e, field) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: e.target.value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store existing image URL before setting new image
      if (formData.profileImage?.fileUrl) {
        setImageToDelete(formData.profileImage.fileUrl);
      }
      setProfileImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formDataToSend = new FormData();

      // Prepare userData object matching ProfileDTO structure
      const userDataObj = {
        title: formData.title,
        bio: formData.bio,
        phoneNumber: formData.phoneNumber,
        dialCode: formData.dialCode,
        address: formData.address,
        // Convert social links object to array, filtering out empty values
        socialLinks: Object.values(formData.socialLinks).filter(
          (link) => link && link.trim()
        ),
        profileImage: formData.profileImage,
      };

      // Log the userData object
      console.log("UserData object being sent:", userDataObj);

      formDataToSend.append("userData", JSON.stringify(userDataObj));

      // Handle profile image
      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
        // If we have a previous image URL to delete
        if (imageToDelete) {
          formDataToSend.append("deleteImageUrl", imageToDelete);
        }
      }

      const response = await JobseekerApi.post(
        "/update-profile",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Update formData with response while preserving user-specific fields
      setFormData((prev) => ({
        ...prev,
        ...response.data,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
      }));
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCountryCodeChange = (value) => {
    const selectedCountry = dialCodes.find((c) => c.dialCode === value);
    if (selectedCountry) {
      setFormData((prev) => ({
        ...prev,
        dialCode: selectedCountry,
      }));
    }
  };

  // Replace the profile image section with this updated version
  const ProfileImageSection = () => (
    <div
      className="relative"
      onClick={isEditing ? handleImageClick : undefined}
    >
      {imagePreview || formData.profileImage?.fileUrl ? (
        <img
          src={imagePreview || formData.profileImage?.fileUrl}
          alt={`${user.firstName} ${user.lastName}`}
          className={`w-20 h-20 rounded-full object-cover ${
            isEditing ? "cursor-pointer" : ""
          }`}
        />
      ) : (
        <Avatar className={`w-20 h-20 ${isEditing ? "cursor-pointer" : ""}`}>
          <AvatarImage src={formData.profileImage?.fileUrl} />
          <AvatarFallback>
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
      )}
      {isEditing && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 hover:opacity-100 transition-opacity">
            <RiEditLine className="w-6 h-6 text-white" />
          </div>
        </>
      )}
    </div>
  );

  // Update handleSocialLinksChange to work with object format
  const handleSocialLinksChange = (e, platform) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const SocialLinksCard = () => {
    const renderSocialIcon = (platform) => {
      const icons = {
        linkedin: <RiLinkedinBoxLine className="w-5 h-5 text-[#0077b5]" />,
        github: <RiGithubLine className="w-5 h-5 text-[#333]" />,
        facebook: <RiFacebookBoxFill className="w-5 h-5 text-[#1877f2]" />,
        instagram: <RiInstagramLine className="w-5 h-5 text-[#e4405f]" />,
        portfolio: <RiGlobalLine className="w-5 h-5 text-[#00ab6c]" />,
      };
      return icons[platform] || null;
    };

    const socialPlatformNames = {
      linkedin: "LinkedIn",
      github: "GitHub",
      facebook: "Facebook",
      instagram: "Instagram",
      portfolio: "Portfolio",
    };

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <h2 className="text-gray-900 font-semibold text-base mb-4">
          Social Links
        </h2>
        <div className="space-y-4">
          {isEditing ? (
            <>
              <div className="flex items-center gap-2">
                <RiLinkedinBoxLine className="w-6 h-6 text-[#0077b5]" />
                <input
                  type="url"
                  value={formData.socialLinks.linkedin || ""}
                  onChange={(e) => handleSocialLinksChange(e, "linkedin")}
                  className="flex-1 p-2.5 border border-gray-300 rounded-lg"
                  placeholder="Paste LinkedIn URL"
                />
              </div>
              <div className="flex items-center gap-2">
                <RiGithubLine className="w-6 h-6 text-[#333]" />
                <input
                  type="url"
                  value={formData.socialLinks.github || ""}
                  onChange={(e) => handleSocialLinksChange(e, "github")}
                  className="flex-1 p-2.5 border border-gray-300 rounded-lg"
                  placeholder="Paste GitHub URL"
                />
              </div>
              <div className="flex items-center gap-2">
                <RiFacebookBoxFill className="w-6 h-6 text-[#1877f2]" />
                <input
                  type="url"
                  value={formData.socialLinks.facebook || ""}
                  onChange={(e) => handleSocialLinksChange(e, "facebook")}
                  className="flex-1 p-2.5 border border-gray-300 rounded-lg"
                  placeholder="Paste Facebook URL"
                />
              </div>
              <div className="flex items-center gap-2">
                <RiInstagramLine className="w-6 h-6 text-[#e4405f]" />
                <input
                  type="url"
                  value={formData.socialLinks.instagram || ""}
                  onChange={(e) => handleSocialLinksChange(e, "instagram")}
                  className="flex-1 p-2.5 border border-gray-300 rounded-lg"
                  placeholder="Paste Instagram URL"
                />
              </div>
              <div className="flex items-center gap-2">
                <RiGlobalLine className="w-6 h-6 text-[#00ab6c]" />
                <input
                  type="url"
                  value={formData.socialLinks.portfolio || ""}
                  onChange={(e) => handleSocialLinksChange(e, "portfolio")}
                  className="flex-1 p-2.5 border border-gray-300 rounded-lg"
                  placeholder="Paste Portfolio URL"
                />
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {Object.entries(formData.socialLinks)
                .filter(([_, url]) => url && url.trim().length > 0)
                .map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group transition-all duration-200"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 group-hover:bg-white group-hover:shadow-sm transition-all duration-200">
                      {renderSocialIcon(platform)}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        {socialPlatformNames[platform]}
                      </span>
                      <span className="text-sm text-gray-500 truncate max-w-[300px]">
                        {url}
                      </span>
                    </div>
                  </a>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchDialCodes = async () => {
      try {
        setLoading(true);
        const response = await publicApi.get("/dial-code");
        setDialCodes(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch dial codes");
      } finally {
        setLoading(false);
      }
    };
    fetchDialCodes();
  }, []);

  // Update useEffect to handle profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await JobseekerApi.get("/get-my-profile");
        const profileData = response.data;

        // Convert social links array to object format for frontend
        const socialLinksObject =
          (Array.isArray(profileData.socialLinks)
            ? profileData.socialLinks.reduce((acc, link) => {
                if (link.includes("linkedin.com")) acc.linkedin = link;
                else if (link.includes("github.com")) acc.github = link;
                else if (link.includes("facebook.com")) acc.facebook = link;
                else if (link.includes("instagram.com")) acc.instagram = link;
                else acc.portfolio = link;
                return acc;
              }, {})
            : profileData.socialLinks) || {};

        setFormData((prev) => ({
          ...prev,
          ...profileData,
          socialLinks: {
            linkedin: "",
            github: "",
            facebook: "",
            instagram: "",
            portfolio: "",
            ...socialLinksObject,
          },
          // preserve user fields if needed
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          email: user?.email || "",
        }));

        if (profileData) {
          console.log("Profile data loaded:", profileData);
        }
      } catch (error) {
        setError("Failed to load profile");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          My Profile
        </h1>
        <Button
          variant={isEditing ? "outline" : "default"}
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 transition-all duration-200 hover:shadow-md"
        >
          <RiEditLine className="w-4 h-4" />
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <ProfileImageSection />
              <div className="space-y-3">
                <h1 className="text-gray-900 font-semibold text-2xl leading-tight group-hover:text-blue-600 transition-colors duration-200">
                  {`${user.firstName} ${user.lastName}`}
                </h1>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange(e, "title")}
                    className="p-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Professional Title"
                  />
                ) : (
                  <>
                    <p className="text-lg text-gray-600 leading-tight font-medium">
                      {formData.title || "Professional Title"}
                    </p>
                    <p className="text-sm text-gray-500 leading-tight flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {`${formData.address.city}, ${formData.address.state}`}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <h2 className="text-gray-900 font-semibold text-lg mb-4 flex items-center gap-2">
            <RiUserLine className="h-5 w-5 text-blue-500" />
            About
          </h2>
          <textarea
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              !isEditing ? "bg-gray-50" : ""
            }`}
            rows="4"
            value={formData.bio || ""}
            onChange={(e) => handleChange(e, "bio")}
            disabled={!isEditing}
            placeholder="Tell us about yourself"
          />
        </div>

        {/* Personal Information Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <h2 className="text-gray-900 font-semibold text-base mb-4">
            Personal information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={formData.firstName || ""}
                  onChange={(e) => handleChange(e, "firstName")}
                  className="p-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your first name"
                />
                <input
                  type="text"
                  value={formData.lastName || ""}
                  onChange={(e) => handleChange(e, "lastName")}
                  className="p-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your last name"
                />
                <div>
                  <p className="font-normal">Email address</p>
                  <p className="text-gray-700 font-semibold mt-1">
                    {formData.email}
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <p className="font-normal">Phone number</p>
                  <div className="flex gap-2 items-center">
                    <Select
                      value={formData.dialCode.dialCode}
                      onValueChange={handleCountryCodeChange}
                    >
                      <SelectTrigger className="w-[100px] h-10">
                        <SelectValue>{formData.dialCode.dialCode}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {dialCodes.map((country) => (
                          <SelectItem
                            key={country.dialCode}
                            value={country.dialCode}
                            className="flex items-center gap-2"
                          >
                            <span className="font-medium">
                              {country.dialCode}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {country.countryName}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="tel"
                      value={formData.phoneNumber || ""}
                      onChange={(e) => handleChange(e, "phoneNumber")}
                      className="flex-1 px-3 h-10 border border-gray-300 rounded-md"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="font-normal">First Name</p>
                  <p className="text-gray-700 font-semibold mt-1">
                    {formData.firstName}
                  </p>
                </div>
                <div>
                  <p className="font-normal">Last Name</p>
                  <p className="text-gray-700 font-semibold mt-1">
                    {formData.lastName}
                  </p>
                </div>
                <div>
                  <p className="font-normal">Email address</p>
                  <p className="text-gray-700 font-semibold mt-1">
                    {formData.email}
                  </p>
                </div>
                <div>
                  <p className="font-normal">Phone</p>
                  <div className="flex gap-2 items-center">
                    {/* this should be dropdown */}
                    <p className="text-gray-700 font-semibold mt-1">
                      {formData.dialCode.dialCode}
                    </p>
                    <p className="text-gray-700 font-semibold mt-1">
                      {formData.phoneNumber}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <h2 className="text-gray-900 font-semibold text-base mb-4">
            Address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={formData.address.street || ""}
                  onChange={(e) => handleAddressChange(e, "street")}
                  className="p-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter street address"
                />
                <input
                  type="text"
                  value={formData.address.country || ""}
                  onChange={(e) => handleAddressChange(e, "country")}
                  className="p-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter country"
                />
                <input
                  type="text"
                  value={formData.address.city || ""}
                  onChange={(e) => handleAddressChange(e, "city")}
                  className="p-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter city"
                />
                <input
                  type="text"
                  value={formData.address.state || ""}
                  onChange={(e) => handleAddressChange(e, "state")}
                  className="p-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter state"
                />
                <input
                  type="text"
                  value={formData.address.zipCode || ""}
                  onChange={(e) => handleAddressChange(e, "zipCode")}
                  className="p-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter postal code"
                />
              </>
            ) : (
              <>
                <div>
                  <p className="font-normal">Street</p>
                  <p className="text-gray-700 font-semibold mt-1">
                    {formData.address.street}
                  </p>
                </div>
                <div>
                  <p className="font-normal">Country</p>
                  <p className="text-gray-700 font-semibold mt-1">
                    {formData.address.country}
                  </p>
                </div>
                <div>
                  <p className="font-normal">City</p>
                  <p className="text-gray-700 font-semibold mt-1">
                    {formData.address.city}
                  </p>
                </div>
                <div>
                  <p className="font-normal">State</p>
                  <p className="text-gray-700 font-semibold mt-1">
                    {formData.address.state}
                  </p>
                </div>
                <div>
                  <p className="font-normal">Postal Code</p>
                  <p className="text-gray-700 font-semibold mt-1">
                    {formData.address.zipCode}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Social Links Card */}
        <SocialLinksCard />

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end sticky bottom-4 pt-4">
            <Button
              type="submit"
              className="px-8 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-gradient-to-r from-blue-600 to-blue-700"
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default JobseekerProfile;
