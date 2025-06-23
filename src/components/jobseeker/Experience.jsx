import React, { useState, useEffect } from "react";
import ExperienceCard from "./ExperienceCard";
import AddOrUpdateExperience from "./AddOrUpdateExperience";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import jobseekerApi from "@/api/JobseekerApi";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fetchExperiences = async () => {
    try {
      const response = await jobseekerApi.get("experiences");
      setExperiences(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch experiences. Please try again.",
        variant: "destructive",
      });
      console.error("Error fetching experiences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleAddExperience = (newExperience) => {
    setExperiences([...experiences, newExperience]);
    setIsAddingExperience(false);
  };

  const handleDeleteExperience = async (experienceId) => {
    if (!experienceId || isDeleting) return;

    try {
      setIsDeleting(true);
      await jobseekerApi.delete(`experience/${experienceId}`);
      setExperiences(experiences.filter((exp) => exp.id !== experienceId));
      toast.success("Experience deleted successfully");
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete experience. Please try again."
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
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Work Experience</h2>
        <Button onClick={() => setIsAddingExperience(true)}>
          Add Experience
        </Button>
      </div>

      {isAddingExperience && (
        <AddOrUpdateExperience
          onSubmit={handleAddExperience}
          onCancel={() => setIsAddingExperience(false)}
        />
      )}

      <div className="space-y-4">
        {experiences.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No work experience added yet.
          </p>
        ) : (
          experiences.map((exp) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              onEdit={() => setEditingExperience(exp)}
              onDelete={handleDeleteExperience}
            />
          ))
        )}
      </div>

      {editingExperience && (
        <AddOrUpdateExperience
          experience={editingExperience}
          onSubmit={(updatedExperience) => {
            setExperiences(
              experiences.map((exp) =>
                exp.id === updatedExperience.id ? updatedExperience : exp
              )
            );
            setEditingExperience(null);
          }}
          onCancel={() => setEditingExperience(null)}
        />
      )}
    </Card>
  );
};

export default Experience;
