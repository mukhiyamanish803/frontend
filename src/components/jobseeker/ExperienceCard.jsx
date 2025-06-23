import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FaGlobe,
  FaMapMarkerAlt,
  FaCertificate,
  FaFile,
  FaTrash,
} from "react-icons/fa";
import { Badge } from "@/components/ui/badge";

const ExperienceCard = ({ experience, onEdit, onDelete, isDeleting }) => {
  const renderCertificate = () => {
    if (!experience.certificateLink && !experience.file) return null;

    return (
      <div className="flex items-center gap-2 text-green-600">
        {experience.file ? (
          <div className="flex items-center gap-2">
            <FaFile />
            <a
              href={experience.file.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800"
            >
              {experience.file.fileName}
            </a>
          </div>
        ) : (
          experience.certificateLink && (
            <div className="flex items-center gap-2">
              <FaCertificate />
              <a
                href={experience.certificateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800"
              >
                View Certificate
              </a>
            </div>
          )
        )}
      </div>
    );
  };
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="space-y-4 w-full">
          {/* Title and Company Section */}
          <div>
            <h3 className="text-xl font-semibold text-primary">
              {experience.jobTitle}
            </h3>
            <div className="flex items-center gap-4 text-gray-600 mt-1">
              <span className="font-medium">{experience.companyName}</span>
              {experience.companyUrl && (
                <a
                  href={experience.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                >
                  <FaGlobe className="h-4 w-4" /> Company Website
                </a>
              )}
            </div>
          </div>

          {/* Date and Location Section */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Duration:</span>
              {formatDate(experience.startDate)} -{" "}
              {experience.endDate ? formatDate(experience.endDate) : "Present"}
            </div>
            {experience.companyLocation && (
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="h-4 w-4 text-gray-500" />
                <span>{experience.companyLocation}</span>
              </div>
            )}
          </div>

          {/* Certificate Section */}
          {renderCertificate()}

          {/* Skills/Technologies Section */}
          {Array.isArray(experience.skills) && experience.skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                Technologies & Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {experience.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description Section */}
          {experience.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Description</h4>
              <p className="text-gray-600 whitespace-pre-wrap">
                {experience.description}
              </p>
            </div>
          )}
        </div>{" "}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(experience)}
            className="text-blue-500 hover:text-blue-700"
            disabled={isDeleting}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(experience.id)}
            className="text-red-500 hover:text-red-700"
            disabled={isDeleting}
          >
            <FaTrash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ExperienceCard;
