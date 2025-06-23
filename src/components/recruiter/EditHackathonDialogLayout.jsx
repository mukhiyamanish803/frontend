import React, { useState } from "react";
import EditHackathonDialogSidebar from "./EditHackathonDialogSidebar";
import StagesTimelineComponent from "./StagesTimelineComponent";
import { Button } from "@/components/ui/button";
import { IoCloseCircleSharp } from "react-icons/io5";
import DetailComponent from "./DetailComponent";
import DatesDeadlinesComponent from "./DatesDeadlinesComponent";
import PrizesComponent from "./PrizesComponent";
import BasicDetailComponent from "./BasicDetailComponent";

const EditHackathonDialogLayout = ({ open, setOpen, hackathon, onSave }) => {
  const [tab, setTab] = useState("basic_detail");

  // LIFTED STATE: stages and editIdx
  const [stages, setStages] = useState([]);
  const [editIdx, setEditIdx] = useState(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px] py-4">
      <div className="bg-white rounded-xl shadow-xl relative w-full max-w-7xl flex h-full">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 right-0 text-gray-400 hover:text-gray-700 text-xl"
          onClick={() => setOpen(false)}
          aria-label="Close"
        >
          <IoCloseCircleSharp />
        </Button>
        {/* Sidebar */}
        <EditHackathonDialogSidebar value={tab} onTabChange={setTab} />
        {/* Tab content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {tab === "stages" && (
            <StagesTimelineComponent
              stages={stages}
              setStages={setStages}
              editIdx={editIdx}
              setEditIdx={setEditIdx}
            />
          )}
          {tab === "details" && (
            <DetailComponent />
          )}
          {tab === "dates" && <DatesDeadlinesComponent />}
          {tab === "prizes" && <PrizesComponent />}
          {tab === "basic_detail" && (
            <BasicDetailComponent />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditHackathonDialogLayout;
