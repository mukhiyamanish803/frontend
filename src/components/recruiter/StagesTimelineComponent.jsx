import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaCalendarAlt,
  FaRegTimesCircle,
  FaTrash,
  FaEdit,
  FaArrowUp,
  FaArrowDown,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { hackathonData } from "@/utils/store";

const AddStageForm = ({ onClose, onAdd }) => {
  const [mode, setMode] = useState("online");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      title,
      subtitle,
      description,
      mode,
      location: mode === "offline" ? location : "",
      startDate,
      endDate,
    });
    // Optionally reset form fields here
    setTitle("");
    setSubtitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setMode("online");
    setLocation("");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.25 }}
      className="mb-6"
    >
      <Card className="border-none shadow-lg bg-background dark:bg-muted">
        <CardContent className="py-6 px-4">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <Label htmlFor="stage-title" className="mb-1">
                  Title
                </Label>
                <Input
                  id="stage-title"
                  type="text"
                  placeholder="Quiz Assessment"
                  className="bg-background"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="stage-subtitle" className="mb-1">
                  Subtitle
                </Label>
                <Input
                  id="stage-subtitle"
                  type="text"
                  placeholder="Round 1: Quiz Assessment – Test Your Fundamentals"
                  className="bg-background"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="stage-description" className="mb-1">
                  Description
                </Label>
                <textarea
                  id="stage-description"
                  placeholder="Describe this stage (optional)"
                  className="border rounded px-3 py-2 bg-background text-foreground min-h-[80px] resize-y"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              {/* Redesigned Mode selection with modern toggle buttons */}
              <div className="flex flex-col gap-2 mt-2">
                <Label className="font-medium mb-1">Mode</Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("online")}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full border transition font-medium shadow-sm
                      ${
                        mode === "online"
                          ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200"
                          : "bg-background text-foreground border-muted-foreground hover:bg-muted"
                      }
                    `}
                    aria-pressed={mode === "online"}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        mode === "online" ? "bg-white" : "bg-blue-400"
                      }`}
                    />
                    Online
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("offline")}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full border transition font-medium shadow-sm
                      ${
                        mode === "offline"
                          ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200"
                          : "bg-background text-foreground border-muted-foreground hover:bg-muted"
                      }
                    `}
                    aria-pressed={mode === "offline"}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        mode === "offline" ? "bg-white" : "bg-blue-400"
                      }`}
                    />
                    Offline
                  </button>
                </div>
                {mode === "offline" && (
                  <div className="flex flex-col mt-2 w-full max-w-xs">
                    <Label htmlFor="location" className="font-medium mb-1">
                      Location
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Enter location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-background"
                      required={mode === "offline"}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col flex-1">
                <Label
                  htmlFor="start-date"
                  className="mb-1 flex items-center gap-1"
                >
                  <FaCalendarAlt className="inline text-blue-500" /> Start Date
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  className="bg-background"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col flex-1">
                <Label
                  htmlFor="end-date"
                  className="mb-1 flex items-center gap-1"
                >
                  <FaCalendarAlt className="inline text-blue-500" /> End Date
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  className="bg-background"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button
                type="button"
                variant="ghost"
                className="flex items-center gap-2"
                onClick={onClose}
              >
                <FaRegTimesCircle className="text-lg" />
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                className="flex items-center gap-2"
              >
                <FaPlus className="text-lg" />
                Add Stage
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EditStageForm = ({ stage, onSave, onCancel }) => {
  const [mode, setMode] = useState(stage.mode);
  const [location, setLocation] = useState(stage.location || "");
  const [title, setTitle] = useState(stage.title);
  const [subtitle, setSubtitle] = useState(stage.subtitle);
  const [description, setDescription] = useState(stage.description);
  const [startDate, setStartDate] = useState(stage.startDate);
  const [endDate, setEndDate] = useState(stage.endDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...stage,
      title,
      subtitle,
      description,
      mode,
      location: mode === "offline" ? location : "",
      startDate,
      endDate,
    });
  };

  return (
    <Card className="bg-background dark:bg-muted border-blue-200 border">
      <CardContent className="py-6 px-4">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <Label htmlFor="edit-stage-title" className="mb-1">
                Title
              </Label>
              <Input
                id="edit-stage-title"
                type="text"
                placeholder="Quiz Assessment"
                className="bg-background"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="edit-stage-subtitle" className="mb-1">
                Subtitle
              </Label>
              <Input
                id="edit-stage-subtitle"
                type="text"
                placeholder="Round 1: Quiz Assessment – Test Your Fundamentals"
                className="bg-background"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="edit-stage-description" className="mb-1">
                Description
              </Label>
              <textarea
                id="edit-stage-description"
                placeholder="Describe this stage (optional)"
                className="border rounded px-3 py-2 bg-background text-foreground min-h-[80px] resize-y"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {/* Mode selection */}
            <div className="flex flex-col gap-2 mt-2">
              <Label className="font-medium mb-1">Mode</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode("online")}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full border transition font-medium shadow-sm
                    ${
                      mode === "online"
                        ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200"
                        : "bg-background text-foreground border-muted-foreground hover:bg-muted"
                    }
                  `}
                  aria-pressed={mode === "online"}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      mode === "online" ? "bg-white" : "bg-blue-400"
                    }`}
                  />
                  Online
                </button>
                <button
                  type="button"
                  onClick={() => setMode("offline")}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full border transition font-medium shadow-sm
                    ${
                      mode === "offline"
                        ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200"
                        : "bg-background text-foreground border-muted-foreground hover:bg-muted"
                    }
                  `}
                  aria-pressed={mode === "offline"}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      mode === "offline" ? "bg-white" : "bg-blue-400"
                    }`}
                  />
                  Offline
                </button>
              </div>
              {mode === "offline" && (
                <div className="flex flex-col mt-2 w-full max-w-xs">
                  <Label htmlFor="edit-location" className="font-medium mb-1">
                    Location
                  </Label>
                  <Input
                    id="edit-location"
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-background"
                    required={mode === "offline"}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col flex-1">
              <Label
                htmlFor="edit-start-date"
                className="mb-1 flex items-center gap-1"
              >
                <FaCalendarAlt className="inline text-blue-500" /> Start Date
              </Label>
              <Input
                id="edit-start-date"
                type="date"
                className="bg-background"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col flex-1">
              <Label
                htmlFor="edit-end-date"
                className="mb-1 flex items-center gap-1"
              >
                <FaCalendarAlt className="inline text-blue-500" /> End Date
              </Label>
              <Input
                id="edit-end-date"
                type="date"
                className="bg-background"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex items-center gap-2"
              onClick={onCancel}
            >
              <FaTimes className="text-lg" />
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex items-center gap-2"
            >
              <FaSave className="text-lg" onClick={onSave} />
              Save
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const StagesTimelineComponent = ({
  stages: stagesProp,
  setStages: setStagesProp,
  editIdx: editIdxProp,
  setEditIdx: setEditIdxProp,
}) => {
  // Use lifted state if provided, otherwise fallback to local state for standalone use
  const [localStages, setLocalStages] = useState([]);
  const [localEditIdx, setLocalEditIdx] = useState(null);

  const stages = stagesProp ?? localStages;
  const setStages = setStagesProp ?? setLocalStages;
  const editIdx = editIdxProp ?? localEditIdx;
  const setEditIdx = setEditIdxProp ?? setLocalEditIdx;

  const [showAddStage, setShowAddStage] = useState(false);

  const handleAddStage = useCallback(
    (stage) => {
      setStages((prev) => {
        const newStages = [...prev, stage];
        hackathonData.stages_timeline = newStages;
        return newStages;
      });
      setTimeout(() => {
        console.log("hackathonData", hackathonData);
      }, 300);
    },
    [setStages]
  );

  const handleDeleteStage = (idx) => {
    setStages((prev) => {
      const newStages = prev.filter((_, i) => i !== idx);
      hackathonData.stages_timeline = newStages;
      return newStages;
    });
  };

  const handleEditStage = (idx, updatedStage) => {
    setStages((prev) => {
      const newStages = prev.map((s, i) => (i === idx ? updatedStage : s));
      hackathonData.stages_timeline = newStages;
      setTimeout(() => {
        console.log("hackathonData", hackathonData);
      }, 300);
      return newStages;
    });
    setEditIdx(null);
  };

  const handleMoveStage = (idx, direction) => {
    setStages((prev) => {
      const arr = [...prev];
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= arr.length) return arr;
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      hackathonData.stages_timeline = arr;
      setTimeout(() => {
        console.log("hackathonData", JSON.stringify(hackathonData, null, 2));
      }, 300);
      return arr;
    });
  };

  return (
    <section className="w-full mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Stages</h2>
        <Button
          variant="default"
          className="flex items-center gap-2"
          onClick={() => setShowAddStage((v) => !v)}
        >
          <FaPlus className="text-base" />
          Add Stage
        </Button>
      </div>
      <AnimatePresence>
        {showAddStage && (
          <AddStageForm
            onClose={() => setShowAddStage(false)}
            onAdd={handleAddStage}
          />
        )}
      </AnimatePresence>
      <div className="flex flex-col gap-4">
        {stages.map((stage, idx) => (
          <div key={idx}>
            {editIdx === idx ? (
              <EditStageForm
                stage={stage}
                onSave={(updatedStage) => handleEditStage(idx, updatedStage)}
                onCancel={() => setEditIdx(null)}
              />
            ) : (
              <Card className="bg-muted">
                <CardContent className="py-4 px-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base">
                        {stage.title}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {stage.mode === "online" ? "Online" : "Offline"}
                      </Badge>
                      {stage.mode === "offline" && stage.location && (
                        <span className="text-xs text-muted-foreground ml-2">
                          {stage.location}
                        </span>
                      )}
                      <div className="ml-auto flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="p-1"
                          onClick={() => handleMoveStage(idx, "up")}
                          disabled={idx === 0}
                          title="Move Up"
                        >
                          <FaArrowUp />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="p-1"
                          onClick={() => handleMoveStage(idx, "down")}
                          disabled={idx === stages.length - 1}
                          title="Move Down"
                        >
                          <FaArrowDown />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="p-1"
                          onClick={() => setEditIdx(idx)}
                          title="Edit"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="p-1"
                          onClick={() => handleDeleteStage(idx)}
                          title="Delete"
                        >
                          <FaTrash className="text-red-500" />
                        </Button>
                      </div>
                    </div>
                    {stage.subtitle && (
                      <span className="text-sm text-muted-foreground">
                        {stage.subtitle}
                      </span>
                    )}
                    {stage.description && (
                      <span className="text-xs text-muted-foreground">
                        {stage.description}
                      </span>
                    )}
                    <div className="flex gap-4 mt-2">
                      {stage.startDate && (
                        <span className="text-xs flex items-center gap-1">
                          <FaCalendarAlt className="text-blue-500" />{" "}
                          {stage.startDate}
                        </span>
                      )}
                      {stage.endDate && (
                        <span className="text-xs flex items-center gap-1">
                          <FaCalendarAlt className="text-blue-500" />{" "}
                          {stage.endDate}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default StagesTimelineComponent;
