import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaBriefcase, FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import EditInternshipDialog from "./EditInternshipDialog";
import recruiterApi from "@/api/recruiterApi";
import { useAuth } from "@/context/AuthContex";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const filters = [
  { label: "All", active: true },
  { label: "Active", active: false },
  { label: "Closed", active: false },
];

const Internship = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [internshipToDelete, setInternshipToDelete] = useState(null);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const response = await recruiterApi.get("/get-all-internships");
      setInternships(response.data);
    } catch (err) {
      setError("Failed to fetch internships.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <EditInternshipDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedInternship(null);
        }}
        internship={selectedInternship}
        onSave={fetchInternships}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this internship?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              internship posting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (internshipToDelete) {
                  try {
                    await recruiterApi.delete(
                      `/delete-internship/${internshipToDelete.id}`
                    );
                    setDeleteDialogOpen(false);
                    setInternshipToDelete(null);
                    fetchInternships();
                  } catch (err) {
                    setDeleteDialogOpen(false);
                    setInternshipToDelete(null);
                    // Optionally show error
                  }
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-900">
            My Internship Postings
          </h2>
          <Button
            className="bg-black hover:bg-gray-900 text-white font-semibold px-6 py-2 flex items-center gap-2"
            onClick={() => setDialogOpen(true)}
          >
            <span className="text-xl">+</span> Post New Internship
          </Button>
        </div>
        <div className="flex gap-3 mb-8">
          {filters.map((f, i) => (
            <button
              key={f.label}
              className={cn(
                "px-6 py-2 rounded-full font-medium border border-gray-200 transition-colors",
                f.active
                  ? "bg-black text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : internships.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No internships found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {internships.map((job) => (
              <Card
                key={job.id}
                className="rounded-2xl shadow-md border-0 bg-white/90 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between min-h-[340px]"
              >
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <img
                    src={job.companyLogoUrl}
                    alt={job.companyName}
                    className="w-10 h-10 rounded bg-white border object-contain"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-lg">
                        {job.companyName}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className={`ml-auto text-xs px-3 py-1 rounded-full font-semibold border focus:outline-none ${
                              job.status === "ACTIVE"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-gray-200 text-gray-700 border-gray-300"
                            }`}
                          >
                            {job.status}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={async () => {
                              if (job.status !== "ACTIVE") {
                                await recruiterApi.patch(
                                  `/update-internship-status/${job.id}?status=ACTIVE`
                                );
                                fetchInternships();
                              }
                            }}
                          >
                            ACTIVE
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              if (job.status !== "CLOSED") {
                                await recruiterApi.patch(
                                  `/update-internship-status/${job.id}?status=CLOSED`
                                );
                                fetchInternships();
                              }
                            }}
                          >
                            CLOSED
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Updated {job.updatedAt || job.createdAt}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 pb-4 flex-1 flex flex-col">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-1">
                    {job.title}
                  </CardTitle>
                  <div className="text-lg font-semibold text-gray-700 mb-2">
                    {job.stipend || "-"}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                      {job.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {job.mode}
                    </span>
                    {job.location && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {job.location}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-1">
                    {(() => {
                      const maxChars = 160;
                      const desc = job.description || "";
                      const isLong =
                        desc.length > maxChars ||
                        (desc.match(/\n/g) || []).length > 1;
                      return isLong
                        ? desc.slice(0, maxChars).replace(/\n/g, " ").trim() +
                            "..."
                        : desc;
                    })()}
                  </p>
                  <div className="flex items-center justify-end gap-4 border-t pt-3 mt-auto">
                    <button
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                      onClick={() => {
                        setSelectedInternship(job);
                        setDialogOpen(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-gray-500 hover:text-red-600 transition-colors"
                      onClick={() => {
                        setInternshipToDelete(job);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Internship;
