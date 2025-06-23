import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit2,
  FiList,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiGift,
  FiCalendar,
  FiPlus,
} from "react-icons/fi";
import recruiterApi from "@/api/recruiterApi";

const SectionHeader = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 mb-2">
    <Icon className="text-primary text-lg" />
    <span className="font-semibold text-base text-gray-900 dark:text-gray-100">
      {children}
    </span>
  </div>
);

const EditInternshipDialog = ({ open, onOpenChange, internship, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [duration, setDuration] = useState("");
  const [stipend, setStipend] = useState("");
  const [location, setLocation] = useState("");
  const [benefits, setBenefits] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");
  const [mode, setMode] = useState("online");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  React.useEffect(() => {
    if (internship) {
      setTitle(internship.title || "");
      setDescription(internship.description || "");
      setResponsibilities(internship.responsibilities || "");
      setRequirements(internship.requirements || "");
      setDuration(internship.duration || "");
      setStipend(internship.stipend || "");
      setLocation(internship.location || "");
      setBenefits(internship.benefits || "");
      setDeadline(internship.deadline || "");
      setCategory(internship.category || "");
      setMode(internship.mode || "online");
    } else {
      setTitle("");
      setDescription("");
      setResponsibilities("");
      setRequirements("");
      setDuration("");
      setStipend("");
      setLocation("");
      setBenefits("");
      setDeadline("");
      setCategory("");
      setMode("online");
    }
    setErrors({});
    setSubmitError("");
  }, [internship, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!title) newErrors.title = "Title is required.";
    if (!category) newErrors.category = "Category is required.";
    if (!description) newErrors.description = "Description is required.";
    if (!duration) newErrors.duration = "Duration is required.";
    if (!mode) newErrors.mode = "Mode is required.";
    if (!deadline) newErrors.deadline = "Deadline is required.";
    if (mode === "offline" && !location)
      newErrors.location = "Location is required for offline mode.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    setSubmitError("");
    // Prepare DTO
    const internshipRequestDTO = {
      title,
      category,
      description,
      responsibilities,
      requirements,
      duration,
      stipend,
      mode,
      location: mode === "offline" ? location : "",
      benefits,
      deadline,
    };
    try {
      await recruiterApi.post(
        internship && internship.id
          ? `/save-internship?id=${internship.id}`
          : "/save-internship",
        internshipRequestDTO
      );
      onOpenChange(false);
      if (onSave) onSave();
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || "Failed to save internship."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-0 hide-scrollbar">
              <DialogHeader className="px-6 pt-6 pb-2">
                <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {internship ? (
                    <FiEdit2 className="text-primary text-2xl" />
                  ) : (
                    <FiPlus className="text-primary text-2xl" />
                  )}
                  {internship ? "Edit Internship" : "Add Internship"}
                </DialogTitle>
              </DialogHeader>
              <form
                className="px-6 pb-6 pt-2 flex flex-col gap-5"
                autoComplete="off"
                onSubmit={handleSubmit}
              >
                <SectionHeader icon={FiEdit2}>Internship Title</SectionHeader>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter internship title"
                  className="focus:ring-2 focus:ring-primary/70 focus:border-primary border-gray-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
                {errors.title && (
                  <span className="text-red-500 text-xs">{errors.title}</span>
                )}
                <SectionHeader icon={FiList}>Category</SectionHeader>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Software, Marketing, Design"
                  className="focus:ring-2 focus:ring-primary/70 focus:border-primary border-gray-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
                {errors.category && (
                  <span className="text-red-500 text-xs">
                    {errors.category}
                  </span>
                )}
                <SectionHeader icon={FiMapPin}>Mode</SectionHeader>
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="mode"
                      value="online"
                      checked={mode === "online"}
                      onChange={() => setMode("online")}
                      className="accent-primary"
                    />
                    Online
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="mode"
                      value="offline"
                      checked={mode === "offline"}
                      onChange={() => setMode("offline")}
                      className="accent-primary"
                    />
                    Offline
                  </label>
                </div>
                {errors.mode && (
                  <span className="text-red-500 text-xs">{errors.mode}</span>
                )}
                {mode === "offline" && (
                  <div className="relative flex items-center">
                    <FiMapPin className="absolute left-3 text-gray-400 text-base" />
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Kathmandu, Nepal"
                      className="pl-9 focus:ring-2 focus:ring-primary/70 focus:border-primary border-gray-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                      required={mode === "offline"}
                    />
                    {errors.location && (
                      <span className="text-red-500 text-xs ml-2">
                        {errors.location}
                      </span>
                    )}
                  </div>
                )}
                <SectionHeader icon={FiEdit2}>Description</SectionHeader>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter internship description"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 focus:ring-2 focus:ring-primary/70 focus:border-primary text-sm bg-zinc-50 dark:bg-zinc-800 min-h-[80px]"
                  rows={4}
                />
                {errors.description && (
                  <span className="text-red-500 text-xs">
                    {errors.description}
                  </span>
                )}
                <SectionHeader icon={FiList}>
                  Key Responsibilities
                </SectionHeader>
                <textarea
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  placeholder="List key responsibilities"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 focus:ring-2 focus:ring-primary/70 focus:border-primary text-sm bg-zinc-50 dark:bg-zinc-800 min-h-[70px]"
                  rows={3}
                />
                <SectionHeader icon={FiCheckCircle}>
                  Requirements / Qualifications
                </SectionHeader>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="List requirements or qualifications"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 focus:ring-2 focus:ring-primary/70 focus:border-primary text-sm bg-zinc-50 dark:bg-zinc-800 min-h-[70px]"
                  rows={3}
                />
                <SectionHeader icon={FiClock}>Duration</SectionHeader>
                <Input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 3 months"
                  className="focus:ring-2 focus:ring-primary/70 focus:border-primary border-gray-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
                <SectionHeader icon={FiGift}>Stipend</SectionHeader>
                <Input
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  placeholder="e.g. $500/month"
                  className="focus:ring-2 focus:ring-primary/70 focus:border-primary border-gray-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
                <SectionHeader icon={FiGift}>
                  Benefits / Learning Opportunities
                </SectionHeader>
                <textarea
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  placeholder="List benefits or learning opportunities"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 focus:ring-2 focus:ring-primary/70 focus:border-primary text-sm bg-zinc-50 dark:bg-zinc-800 min-h-[60px]"
                  rows={2}
                />
                <SectionHeader icon={FiCalendar}>Deadline</SectionHeader>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="focus:ring-2 focus:ring-primary/70 focus:border-primary border-gray-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
                <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                  {submitError && (
                    <span className="text-red-500 text-xs mr-auto">
                      {submitError}
                    </span>
                  )}
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="ghost"
                      onClick={() => onOpenChange(false)}
                      type="button"
                      className="rounded-lg px-6 py-2 border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                      type="submit"
                      className="rounded-lg px-6 py-2 bg-primary text-white hover:bg-primary/90 transition font-semibold shadow-md"
                      disabled={loading}
                    >
                      {loading
                        ? internship
                          ? "Saving..."
                          : "Adding..."
                        : internship
                        ? "Save Changes"
                        : "Add Internship"}
                    </Button>
                  </motion.div>
                </DialogFooter>
              </form>
            </DialogContent>
          </motion.div>
        </Dialog>
      )}
      <style>
        {`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }`}
      </style>
    </AnimatePresence>
  );
};

export default EditInternshipDialog;
