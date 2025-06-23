import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContex";
import { toast } from "sonner";
import jobseekerApi from "@/api/JobseekerApi";

const SubmitDialogPopup = ({ isOpen, onClose, jobTitle, jobId, companyId }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    interest: "",
    coverLetter: "",
    jobId,
    jobTitle,
    companyId,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const applicationData = {
      jobId,
      jobTitle,
      companyId,
      interest: formData.interest || undefined,
      coverLetter: formData.coverLetter || undefined,
    };

    try {
      await jobseekerApi.post("/apply", applicationData);
      toast.success("Application submitted successfully", {
        duration: 3000, // Auto dismiss after 3 seconds
      });
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit application",
        {
          duration: 3000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Submit Application</DialogTitle>
          <DialogDescription>
            Apply for the position of {jobTitle}. Feel free to tell us about
            your interest and add a cover letter.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="interest" className="flex items-center gap-2">
              Why are you interested in this job?
              <span className="text-sm text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="interest"
              placeholder="Tell us why you're interested in this position..."
              value={formData.interest}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  interest: e.target.value,
                }))
              }
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter" className="flex items-center gap-2">
              Cover Letter
              <span className="text-sm text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="coverLetter"
              placeholder="Write a brief cover letter..."
              value={formData.coverLetter}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  coverLetter: e.target.value,
                }))
              }
              className="min-h-[150px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitDialogPopup;
