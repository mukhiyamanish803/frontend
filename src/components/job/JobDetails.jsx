import React, { useState } from "react";
import { useAuth } from "@/context/AuthContex";
import { Link } from "react-router-dom";
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Flag,
  BookmarkPlus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { HiOutlineExternalLink } from "react-icons/hi";
import SubmitDialogPopup from "./SubmitDialogPopup";

const JobDetails = () => {
  const { user, selectedJob, appliedJobs } = useAuth();
  const [open, setOpen] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  if (!selectedJob) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center text-muted-foreground">
        Select a job to view details
      </div>
    );
  }

  // Add check for applied status
  const isApplied = appliedJobs?.some(
    (appliedJob) => appliedJob.jobId === selectedJob?.id
  );

  return (
    <div className="flex-1 p-6">
      <div className="max-w-3xl">
        {/* Header Layout */}
        <div className="flex justify-between items-start mb-8 p-6 border rounded-lg bg-transparent">
          {/* Left Side - Company Info */}
          <div className="flex gap-4">
            <img
              src={selectedJob.companyLogoUrl}
              alt={selectedJob.companyName}
              className="h-16 w-16 object-contain border rounded-lg p-2"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <Link
                  to={`/company/${selectedJob.companyId}`}
                  className="text-lg font-semibold hover:text-primary flex items-center gap-2"
                >
                  <Building2 className="h-5 w-5" />
                  {selectedJob.companyName}
                </Link>
                {selectedJob.website && (
                  <Link
                    to={selectedJob.website}
                    className="text-muted-foreground hover:text-primary"
                    target="_blank"
                  >
                    <HiOutlineExternalLink className="h-4 w-4" />
                  </Link>
                )}
              </div>
              {selectedJob.companyAddress && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedJob.companyAddress}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Actions */}
          <div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="lg"
                className="gap-2 text-muted-foreground shadow-sm"
              >
                <Flag className="h-4 w-4" />
                Report Job
              </Button>
              {user ? (
                isApplied ? (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="gap-2 bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-700"
                    disabled
                  >
                    <Check className="h-4 w-4" />
                    Applied
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={() => setShowSubmitDialog(true)}
                  >
                    Apply Now
                  </Button>
                )
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="lg" className="flex-1">
                      Apply Now
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Authentication Required
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Please sign in or register to apply for this job.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Link to="/login">Sign In</Link>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 shadow-sm"
              >
                <BookmarkPlus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        {/* Job Title */}
        <h1 className="text-2xl font-bold mb-6">{selectedJob.jobTitle}</h1>
        {/* Job Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {selectedJob.experienceLevel} • {selectedJob.jobType}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{selectedJob.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{selectedJob.salaryRange}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Deadline: {new Date(selectedJob.deadline).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Description and Requirements */}
        <div className="space-y-6">
          {selectedJob.aboutCompany && (
            <section>
              <h2 className="text-xl font-semibold mb-3">About Company</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {selectedJob.aboutCompany}
              </p>
            </section>
          )}

          <section>
            <h2 className="text-xl font-semibold mb-3">Job Description</h2>
            <p className="text-muted-foreground whitespace-pre-line">
              {selectedJob.jobDescription}
            </p>
          </section>

          {selectedJob.responsibilities && (
            <section>
              <h2 className="text-xl font-semibold mb-3">
                Key Responsibilities
              </h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {selectedJob.responsibilities}
              </p>
            </section>
          )}

          <section>
            <h2 className="text-xl font-semibold mb-3">Requirements</h2>
            <p className="text-muted-foreground whitespace-pre-line">
              {selectedJob.requirements}
            </p>
          </section>

          {selectedJob.niceToHave && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Nice to Have</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {selectedJob.niceToHave}
              </p>
            </section>
          )}

          {selectedJob.requiredSkills && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {selectedJob.requiredSkills}
              </p>
            </section>
          )}

          {selectedJob.educationRequirement && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Education</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {selectedJob.educationRequirement}
              </p>
            </section>
          )}

          {selectedJob.benefitsAndPerks && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Benefits & Perks</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {selectedJob.benefitsAndPerks}
              </p>
            </section>
          )}
        </div>
      </div>
      <SubmitDialogPopup
        isOpen={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        jobTitle={selectedJob?.jobTitle}
        jobId={selectedJob?.id}
        companyId={selectedJob?.companyId}
      />
    </div>
  );
};

export default JobDetails;
