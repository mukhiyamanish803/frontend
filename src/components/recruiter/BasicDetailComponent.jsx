import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hackathonData } from "@/utils/store";

const BasicDetailComponent = () => {
  const [basicDetail, setBasicDetail] = useState({
    hackathon_title: hackathonData.basic_detail.hackathon_title || "",
    registration_deadline:
      hackathonData.basic_detail.registration_deadline || "",
    registration_time: "",
    total_prize: hackathonData.basic_detail.total_prize || "",
    team_size: hackathonData.basic_detail.team_size || "",
    tags: (hackathonData.basic_detail.tags || []).join(", "),
  });
  const [bannerPreview, setBannerPreview] = useState(null);

  // Restore state from hackathonData when component mounts
  useEffect(() => {
    setBasicDetail({
      hackathon_title: hackathonData.basic_detail.hackathon_title || "",
      registration_deadline:
        (hackathonData.basic_detail.registration_deadline || "").split(
          "T"
        )[0] || "",
      registration_time:
        (hackathonData.basic_detail.registration_deadline || "").split(
          "T"
        )[1] || "",
      total_prize: hackathonData.basic_detail.total_prize || "",
      team_size: hackathonData.basic_detail.team_size || "",
      tags: (hackathonData.basic_detail.tags || []).join(", "),
    });

    // Restore banner preview if file exists
    if (hackathonData.bannerImage instanceof File) {
      const reader = new FileReader();
      reader.onload = (ev) => setBannerPreview(ev.target.result);
      reader.readAsDataURL(hackathonData.bannerImage);
    } else {
      setBannerPreview(null);
    }
  }, []);

  const handleChange = (field, value) => {
    let updatedDetail = { ...basicDetail, [field]: value };
    setBasicDetail(updatedDetail);

    // Prepare tags as array, others as string
    hackathonData.basic_detail = {
      ...hackathonData.basic_detail,
      hackathon_title: updatedDetail.hackathon_title,
      registration_deadline:
        updatedDetail.registration_deadline +
        (updatedDetail.registration_time
          ? `T${updatedDetail.registration_time}`
          : ""),
      total_prize: updatedDetail.total_prize,
      team_size: updatedDetail.team_size,
      tags: updatedDetail.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };
  };

  return (
    <>
      <h2 className="text-3xl font-semibold">
        Add Basic Details about hackathon.
      </h2>
      <div className="mt-4">
        <Label className="block text-lg font-medium mb-1">
          Hackathon Title
        </Label>
        <Input
          type="text"
          className="w-96"
          placeholder="Enter hackathon title"
          value={basicDetail.hackathon_title}
          onChange={(e) => handleChange("hackathon_title", e.target.value)}
        />
      </div>
      {/* Banner Image */}
      <div className="mt-4">
        <Label className="block text-lg font-medium mb-1">Banner Image</Label>
        <div className="flex flex-col items-start gap-2">
          <label
            htmlFor="banner-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer w-96 h-40 hover:border-blue-400 transition-colors bg-gray-50"
          >
            {bannerPreview ? (
              <img
                src={bannerPreview}
                alt="Banner Preview"
                className="max-h-36 rounded object-contain"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <span className="text-gray-400">
                Click to upload or drag and drop
                <br />
                <span className="text-xs">PNG, JPG, JPEG, GIF (max 5MB)</span>
              </span>
            )}
            <input
              id="banner-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                hackathonData.bannerImage = file || null;
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setBannerPreview(ev.target.result);
                  reader.readAsDataURL(file);
                } else {
                  setBannerPreview(null);
                }
              }}
            />
          </label>
          {bannerPreview && (
            <button
              type="button"
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              onClick={() => {
                setBannerPreview(null);
                hackathonData.bannerImage = null;
                // Clear the file input value
                const input = document.getElementById("banner-upload");
                if (input) input.value = "";
              }}
            >
              Remove Image
            </button>
          )}
        </div>
      </div>
      <div className="mt-4">
        <Label className="block text-lg font-medium mb-1">
          Registration Deadline
        </Label>
        <div className="flex gap-4">
          <Input
            type="date"
            className="mr-2 w-48"
            value={basicDetail.registration_deadline}
            onChange={(e) =>
              handleChange("registration_deadline", e.target.value)
            }
          />
          <Input
            type="time"
            className="w-48"
            value={basicDetail.registration_time}
            onChange={(e) => handleChange("registration_time", e.target.value)}
          />
        </div>
      </div>
      <div className="mt-4">
        <Label className="block text-lg font-medium mb-1">Team Size</Label>
        <Input
          type="text"
          className="w-48"
          placeholder="2 - 5"
          value={basicDetail.team_size}
          onChange={(e) => handleChange("team_size", e.target.value)}
        />
      </div>
      <div className="mt-4">
        <Label className="block text-lg font-medium mb-1">Total Prize</Label>
        <Input
          type="text"
          className="w-48"
          placeholder="$ 5K"
          value={basicDetail.total_prize}
          onChange={(e) => handleChange("total_prize", e.target.value)}
        />
      </div>
      <div className="mt-4">
        <Label className="block text-lg font-medium mb-1">Tags</Label>
        <Input
          type="text"
          className="w-96"
          placeholder="e.g. AI, Innovation"
          value={basicDetail.tags}
          onChange={(e) => handleChange("tags", e.target.value)}
        />
      </div>
    </>
  );
};

export default BasicDetailComponent;
