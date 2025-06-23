import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  RiEditLine,
  RiDeleteBinLine,
  RiFileLine,
  RiCloseLine,
  RiDownloadLine,
} from "react-icons/ri";
import { useAuth } from "@/context/AuthContex";
import { format } from "date-fns";
import { toast } from "sonner";
import authApi from "@/api/authApi";
import JobseekerApi from "@/api/JobseekerApi";
import { Loader2 } from "lucide-react";
import AddOrUpdateEducationCard from "./AddOrUpdateEducationCard";

const JobseekerEducation = () => {
  const { user } = useAuth();
  const [educations, setEducations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEducation, setCurrentEducation] = useState({
    instituteName: "",
    fieldOfStudy: "",
    degree: "",
    specialization: "",
    startDate: "",
    endDate: "",
    description: "",
    gradeType: "percentage", // Changed to match backend model
    gradeValue: "", // Added to match backend model
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    skills: [],
    documents: [],
  });
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletedDocuments, setDeletedDocuments] = useState([]);
  const [apiErrors, setApiErrors] = useState(null);

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      setIsLoading(true);
      const response = await JobseekerApi.get("/education");
      setEducations(response.data);
      setShowForm(!response.data.length);
    } catch (error) {
      toast.error("Failed to fetch education details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiErrors(null);
    try {
      const formData = new FormData();

      // Prepare education data without documents
      const { documents: _, ...educationWithoutDocs } = currentEducation;

      const educationData = {
        ...educationWithoutDocs,
        id: currentEducation.id,
        startDate: format(new Date(currentEducation.startDate), "yyyy-MM-dd"),
        endDate: currentEducation.endDate
          ? format(new Date(currentEducation.endDate), "yyyy-MM-dd")
          : null,
        skills: Array.isArray(currentEducation.skills)
          ? currentEducation.skills
          : [],
        documents: currentEducation.documents
          .filter(
            (doc) => !doc.isNew && !deletedDocuments.includes(doc.fileUrl)
          )
          .map((doc) => ({
            fileUrl: doc.fileUrl,
            fileName: doc.fileName,
            fileType: doc.fileType,
            uploadDate: doc.uploadDate,
            _id: doc._id,
          })),
      };

      formData.append("education", JSON.stringify(educationData));

      // Add new documents to FormData
      const newDocuments = currentEducation.documents.filter(
        (doc) => doc.isNew
      );
      newDocuments.forEach((doc) => {
        formData.append("documents", doc.file);
      });

      if (currentEducation.id) {
        formData.append("id", currentEducation.id);
      }

      if (deletedDocuments.length > 0) {
        deletedDocuments.forEach((url) => {
          formData.append("deletedDocuments", url);
        });
      }

      const response = await JobseekerApi.post("/save-education", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDeletedDocuments([]);
      await fetchEducations();
      toast.success(
        `Education ${isEditing ? "updated" : "added"} successfully`
      );
      setShowForm(false);
    } catch (error) {
      console.error("Education save error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to save education details";

      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        setApiErrors(error.response.data.errors);
        toast.error("Please correct the errors in the form");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (eduId) => {
    try {
      await JobseekerApi.delete(`/education/${eduId}`);
      await fetchEducations(); // Replace fetchUser with fetchEducations
      toast.success("Education deleted successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete education"
      );
    }
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), "yyyy-MM-dd");
    } catch {
      return "";
    }
  };

  const resetForm = () => {
    setCurrentEducation({
      instituteName: "",
      fieldOfStudy: "",
      degree: "",
      specialization: "",
      startDate: "",
      endDate: "",
      description: "",
      gradeType: "percentage", // Changed to match backend model
      gradeValue: "", // Added to match backend model
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
      skills: [],
      documents: [],
    });
    setDeletedDocuments([]); // Reset deleted documents
    setIsEditing(false);
    setShowForm(false);
  };

  const handleInstituteAddressChange = (e, field) => {
    setCurrentEducation((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: e.target.value,
      },
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      isNew: true, // Flag to identify new uploads
    }));

    setCurrentEducation((prev) => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }));
  };

  const downloadDocument = (doc) => {
    // For existing documents, use the fileUrl from backend
    if (!doc.isNew) {
      window.open(doc.fileUrl || doc.url, "_blank");
      return;
    }
    // For new documents, use the local URL
    const link = document.createElement("a");
    link.href = doc.url;
    link.download = doc.name || doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Update document display in the education list
  const renderDocumentsList = (documents) => (
    <div className="border-t pt-4 mt-4">
      <h4 className="font-medium mb-2">Documents</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {documents.map((doc, index) => (
          <div
            // Ensure unique key by using index as fallback
            key={doc._id || doc.id || `document-${index}`}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <RiFileLine className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600 truncate max-w-[200px]">
                {doc.fileName || doc.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => downloadDocument(doc)}
              className="p-1 hover:bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <RiDownloadLine className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const handleGradeTypeChange = (type) => {
    setCurrentEducation((prev) => ({
      ...prev,
      gradeType: type,
      gradeValue: "", // Reset value when type changes
    }));
  };

  const handleGradeValueChange = (value) => {
    setCurrentEducation((prev) => ({
      ...prev,
      gradeValue: value,
    }));
  };

  const formatDisplayDate = (date) => {
    if (!date) return "Present";
    return format(new Date(date), "MMM yyyy");
  };

  const removeDocument = (fileUrlToRemove) => {
    setCurrentEducation((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => {
        if (!doc.isNew) {
          const shouldRemove = doc.fileUrl === fileUrlToRemove;
          if (shouldRemove) {
            // Update deleted documents as a flat array
            setDeletedDocuments((prev) => [
              ...new Set([...prev, fileUrlToRemove]),
            ]);
          }
          return !shouldRemove;
        }
        return doc.url !== fileUrlToRemove;
      }),
    }));
  };

  const handleInputChange = (field, value) => {
    setCurrentEducation((prev) => ({
      ...prev,
      [field]: field === "skills" ? (Array.isArray(value) ? value : []) : value,
    }));
  };

  // Update the edit button click handler
  const handleEditClick = (education) => {
    setCurrentEducation({
      ...education,
      id: education._id || education.id,
      skills: Array.isArray(education.skills) ? education.skills : [],
      documents: Array.isArray(education.documents)
        ? education.documents.map((doc) => ({
            ...doc,
            isNew: false, // Ensure existing documents are marked as not new
          }))
        : [],
    });
    setIsEditing(true);
    setShowForm(true);
    setDeletedDocuments([]); // Reset deleted documents when starting edit
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Education</h1>
        {!showForm && (
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2"
          >
            <RiAddLine /> Add Education
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {showForm && (
            <AddOrUpdateEducationCard
              isEditing={isEditing}
              currentEducation={currentEducation}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              apiErrors={apiErrors}
              handleGradeTypeChange={handleGradeTypeChange}
              handleGradeValueChange={handleGradeValueChange}
              handleInstituteAddressChange={handleInstituteAddressChange}
              handleFileChange={handleFileChange}
              downloadDocument={downloadDocument}
              removeDocument={removeDocument}
              resetForm={resetForm}
              handleInputChange={handleInputChange}
              formatDate={formatDate}
            />
          )}

          {educations.length > 0 && (
            <div className="space-y-4">
              {educations.map((education) => (
                <Card key={education._id || education.id} className="w-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">
                          {education.instituteName}
                        </CardTitle>
                        <CardDescription>
                          {education.degree} in {education.fieldOfStudy}
                          {education.specialization &&
                            ` (${education.specialization})`}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditClick(education)}
                        >
                          <RiEditLine className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(education.id)}
                        >
                          <RiDeleteBinLine className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>
                        {formatDisplayDate(education.startDate)} -{" "}
                        {formatDisplayDate(education.endDate)}
                      </span>
                    </div>
                    {education.description && (
                      <p className="text-gray-600">{education.description}</p>
                    )}

                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium mb-2">Institute Address</h4>
                      <p className="text-gray-600">
                        {`${education.address.street}, ${education.address.city}, ${education.address.state}, ${education.address.country} - ${education.address.zipCode}`}
                      </p>
                    </div>

                    {education.skills.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Skills Acquired</h4>
                        <div className="flex flex-wrap gap-2">
                          {education.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="font-medium">Grade:</span>
                      <span className="text-gray-600">
                        {education.gradeValue}
                        {education.gradeType === "percentage" ? "%" : " CGPA"}
                      </span>
                    </div>

                    {education.documents?.length > 0 &&
                      renderDocumentsList(education.documents)}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobseekerEducation;
