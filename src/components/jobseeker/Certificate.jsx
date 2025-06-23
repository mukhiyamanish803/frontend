import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AddOrUpdateCertificateCard from "./AddOrUpdateCertificateCard";
import CertificateCard from "./CertificateCard";
import JobseekerApi from "@/api/JobseekerApi";

const Certificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await JobseekerApi.get("/get-all-certificates");
      console.log("Fetched certificates:", response.data); // Add this for debugging
      setCertificates(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast.error("Failed to fetch certificates");
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      let response;
      if (editingCertificate) {
        // Use PUT for updates
        response = await JobseekerApi.put(
          `/update-certificate/${editingCertificate.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Use POST for new certificates
        response = await JobseekerApi.post("/add-certificate", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Certificate ${editingCertificate ? "updated" : "added"} successfully`
        );
        setIsAddingNew(false);
        setEditingCertificate(null);
        await fetchCertificates();
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        "Failed to save certificate";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (certificate) => {
    if (!window.confirm("Are you sure you want to delete this certificate?"))
      return;

    try {
      await JobseekerApi.delete(`/delete-certificate/${certificate.id}`);
      toast.success("Certificate deleted successfully");
      await fetchCertificates();
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete certificate"
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Certificates</h2>
          <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Certificates</h2>
        <Button onClick={() => setIsAddingNew(true)}>Add Certificate</Button>
      </div>

      {(isAddingNew || editingCertificate) && (
        <AddOrUpdateCertificateCard
          initialData={editingCertificate}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsAddingNew(false);
            setEditingCertificate(null);
          }}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(certificates || []).map((cert) => (
          <CertificateCard
            key={cert.id} // Change this to just id
            certificate={cert}
            onEdit={() => setEditingCertificate(cert)}
            onDelete={() => handleDelete(cert)}
          />
        ))}
      </div>

      {certificates.length === 0 && !isAddingNew && (
        <div className="text-center py-8 text-gray-500">
          No certificates added yet. Click the Add Certificate button to get
          started.
        </div>
      )}
    </div>
  );
};

export default Certificate;
