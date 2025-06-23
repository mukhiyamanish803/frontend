import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import AddOrUpdateProject from "./AddOrUpdateProject";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import jobseekerApi from "@/api/JobseekerApi";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await jobseekerApi.get("projects");
      setProjects(response.data);
    } catch (error) {
      toast.error("Failed to fetch projects. Please try again.");
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = (newProject) => {
    setProjects([...projects, newProject]);
    setIsAddingProject(false);
  };

  const handleDeleteProject = async (projectId) => {
    if (!projectId || isDeleting) return;

    try {
      setIsDeleting(true);
      await jobseekerApi.delete(`project/${projectId}`);
      setProjects(projects.filter((proj) => proj.id !== projectId));
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete project. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-none border-none outline-none bg-transparent">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={() => setIsAddingProject(true)}>Add Project</Button>
      </div>
      {isAddingProject && (
        <AddOrUpdateProject
          onSubmit={handleAddProject}
          onCancel={() => setIsAddingProject(false)}
        />
      )}{" "}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No projects added yet.
          </p>
        ) : (
          projects.map((project) => (
            <div key={project.id}>
              {editingProject?.id === project.id ? (
                <AddOrUpdateProject
                  project={project}
                  onSubmit={(updatedProject) => {
                    setProjects(
                      projects.map((p) =>
                        p.id === updatedProject.id ? updatedProject : p
                      )
                    );
                    setEditingProject(null);
                  }}
                  onCancel={() => setEditingProject(null)}
                />
              ) : (
                <ProjectCard
                  project={project}
                  onEdit={() => setEditingProject(project)}
                  onDelete={handleDeleteProject}
                  isDeleting={isDeleting}
                />
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default Projects;
