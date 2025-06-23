import React, { useEffect, useState } from "react";
import HackathonCard from "../common/HackathonCard";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // shadcn button import
import EditHackathonDialogLayout from "./EditHackathonDialogLayout";
import recruiterApi from "@/api/recruiterApi";

const Recruiter_Hackathons = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hackathons, setHackathons] = useState([]);

  useEffect(() => {
    const fetchHackathons = async () => {
      const res = await recruiterApi.get("/get-all-hackathons");
      console.log(JSON.parse(res.data[0].details))
      // Map backend data to HackathonCard props
      const mapped = (res.data || []).map((item) => {
        let details = {};
        try {
          details = JSON.parse(item.details);
        } catch (e) {}
        const basic = details.basic_detail || {};
        return {
          title: basic.hackathon_title || "",
          date: details.dates_deadlines?.[0]?.deadline
            ? `${details.dates_deadlines[0].deadline} ${
                details.dates_deadlines[0].time || ""
              }`
            : "",
          location:
            details.stages_timeline?.[0]?.location ||
            details.stages_timeline?.[0]?.mode ||
            "",
          tags: basic.tags || [],
          description: details.details || "",
          bannerImage: item.bannerImage?.fileUrl || "",
          // add more fields as needed
        };
      });
      setHackathons(mapped);
    };
    fetchHackathons();
  }, []);

  return (
    <section className="pr-2">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-left">
          Hackathons
        </h2>
        <Button variant="default" onClick={() => setDialogOpen(true)}>
          Add Hackathon
        </Button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <div className="grid px-2 gap-4 md:grid-cols-3">
          {hackathons.map((hack, idx) => (
            <HackathonCard key={idx} {...hack} />
          ))}
        </div>
      </motion.div>
      <EditHackathonDialogLayout
        open={dialogOpen}
        setOpen={setDialogOpen}
        hackathon={{}}
        onSave={(data) => {
          // handle save logic here (e.g., add to hackathons)
          setDialogOpen(false);
        }}
      />
    </section>
  );
};

export default Recruiter_Hackathons;
