import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const ProjectCard = ({ project, onEdit, onDelete, isDeleting }) => {
  const renderLinks = () => {
    return (
      <div className="flex items-center gap-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <FaGithub className="h-5 w-5" />
            <span className="font-medium">GitHub</span>
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-900 transition-colors"
          >
            <FaExternalLinkAlt className="h-4 w-4" />
            <span className="font-medium">Live Demo</span>
          </a>
        )}
      </div>
    );
  };
  const renderPreview = () => {
    if (project.liveUrl) return null;
    if (!project.screenshots || project.screenshots.length === 0) return null;

    return (
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {project.screenshots.map((screenshot, index) => (
            <div key={index} className="relative">
              <img
                src={screenshot.fileUrl}
                alt={`${project.title} screenshot ${index + 1}`}
                className="rounded-lg shadow-md w-full h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(screenshot.fileUrl, "_blank")}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="space-y-4 w-full">
          {/* Title Section */}
          <div>
            <h3 className="text-xl font-semibold text-primary">
              {project.title}
            </h3>
            <div className="flex items-center gap-4 text-gray-600 mt-1">
              {renderLinks()}
            </div>
          </div>
          {/* Technologies Section */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}{" "}
          {/* Project Preview Section */}
          {renderPreview()}
          {/* Description Section */}
          {project.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Description</h4>
              <p className="text-gray-600 whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          )}
          {/* Features Section */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                Key Features
              </h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {project.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(project)}
            className="text-blue-500 hover:text-blue-700"
            disabled={isDeleting}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(project.id)}
            className="text-red-500 hover:text-red-700"
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
