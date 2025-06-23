import React, { useCallback, useEffect, useState } from "react";
// If using ShadCN UI Tabs:
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FiFlag,
  FiInfo,
  FiCalendar,
  FiGift,
  FiStar,
  FiMessageCircle,
} from "react-icons/fi";

import { hackathonData } from "@/utils/store";
import { Button } from "@/components/ui/button";
import { MdAccessTime } from "react-icons/md";
import recruiterApi from "@/api/recruiterApi";
import { toast } from "sonner";

const tabItems = [
  {
    value: "basic_detail",
    label: "Basic Detail",
    icon: <FiInfo className="mr-2" />,
  },
  {
    value: "stages",
    label: "Stages & Timeline",
    icon: <FiFlag className="mr-2" />,
  },
  {
    value: "details",
    label: "Details",
    icon: <FiInfo className="mr-2" />,
  },
  {
    value: "dates",
    label: "Dates & Deadlines",
    icon: <FiCalendar className="mr-2" />,
  },
  {
    value: "prizes",
    label: "Prizes",
    icon: <FiGift className="mr-2" />,
  },
];

const EditHackathonDialogSidebar = ({ value, onTabChange, id }) => {
  const [publishing, setPublishing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setPublishing(true);
    try {
      const { bannerImage, ...rest } = hackathonData;
      const formData = new FormData();
      // Use id prop if provided, else fallback to hackathonData.id
      const hackathonId = id || hackathonData.id;
      if (hackathonId) {
        formData.append("id", hackathonId);
      }
      if (bannerImage) {
        formData.append("bannerImage", bannerImage);
      }
      formData.append("data", JSON.stringify(rest));
      await recruiterApi.post("/save-hackathon", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        title: "Success",
        description: "Hackathon published successfully!",
        status: "success",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to publish hackathon.",
        status: "error",
      });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <aside className="w-full max-w-xs bg-muted/60 border-r border-border rounded-l-2xl shadow-lg py-6 px-2 flex flex-col h-full">
      <Tabs
        value={value}
        onValueChange={onTabChange}
        orientation="vertical"
        className="w-full"
        defaultValue="basic_detail"
      >
        <TabsList className="flex flex-col gap-2 bg-transparent shadow-none p-0 justify-start items-start">
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`
                w-full justify-start flex gap-3 px-4 py-3 rounded-lg transition-colors
                text-base font-medium
                data-[state=active]:bg-primary/10 data-[state=active]:text-primary
                hover:bg-accent hover:text-accent-foreground
                focus-visible:ring-2 focus-visible:ring-primary
                border-none shadow-none
              `}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="mt-auto flex flex-col items-center pt-6 gap-2">
        <Button
          className="w-5/6 font-semibold py-2 px-4 rounded-lg shadow flex items-center justify-center"
          type="button"
          onClick={handleSubmit}
          disabled={publishing}
        >
          {publishing ? (
            <>
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-blue-500 rounded-full inline-block" />
              Publishing...
            </>
          ) : (
            "Publish"
          )}
        </Button>
      </div>
    </aside>
  );
};
export default EditHackathonDialogSidebar;
