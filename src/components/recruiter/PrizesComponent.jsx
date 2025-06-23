import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { hackathonData } from "@/utils/store";
import { LiaCertificateSolid } from "react-icons/lia";
import { IoCloseCircle } from "react-icons/io5";

const PrizesComponent = () => {
  // Initialize from hackathonData.prizes or empty array
  const [prizes, setPrizes] = useState(() =>
    Array.isArray(hackathonData.prizes) ? [...hackathonData.prizes] : []
  );
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [certificate, setCertificate] = useState(false);

  // Keep hackathonData.prizes in sync with local state
  useEffect(() => {
    hackathonData.prizes = [...prizes];
  }, [prizes]);

  const handleSave = () => {
    const newPrize = { title, description, amount, certificate };
    setPrizes((prev) => [...prev, newPrize]);
    setTitle("");
    setDescription("");
    setAmount("");
    setCertificate(false);
    setOpen(false);
  };

  const handleDelete = (idx) => {
    setPrizes((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Prizes and Rewards</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>Add Prize</Button>
          </DialogTrigger>
          <DialogContent
            // Add description for accessibility
            aria-describedby="add-prize-dialog-desc"
          >
            <DialogHeader>
              <DialogTitle>Add Prize</DialogTitle>
            </DialogHeader>
            <div
              id="add-prize-dialog-desc"
              className="text-muted-foreground mb-4 text-sm"
            >
              Fill in the details below to add a new prize or reward.
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="prize-title" className="block text-sm mb-1">
                  Title
                </label>
                <Input
                  id="prize-title"
                  placeholder="Winner"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="prize-description"
                  className="block text-sm mb-1"
                >
                  Description
                </label>
                <Textarea
                  id="prize-description"
                  placeholder="The team securing the first position will ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="prize-amount" className="block text-sm mb-1">
                  Prize Amount
                </label>
                <Input
                  id="prize-amount"
                  placeholder="e.g. $ 1K, ₹ 10,000, USD 500"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="certificate"
                  checked={certificate}
                  onCheckedChange={setCertificate}
                />
                <label htmlFor="certificate" className="text-sm">
                  Certificate
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {/* Show message if no prizes */}
      {prizes.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No prize and reward added yet
        </div>
      ) : (
        <div className="grid gap-6">
          {prizes.map((prize, idx) => (
            <div
              key={idx}
              className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border p-6 bg-white shadow-sm"
            >
              {/* Delete button at top right */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleDelete(idx)}
                aria-label="Delete prize"
              >
                <IoCloseCircle className="h-6 w-6 text-red-500" />
              </Button>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-semibold mb-1">{prize.title}</div>
                <div className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
                  {prize.description}
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold">{prize.amount}</span>
                </div>
                {prize.certificate && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-sm font-medium mt-2">
                    <LiaCertificateSolid className="h-4 w-4" />
                    Certificate
                  </div>
                )}
              </div>
              <div className="mt-6 sm:mt-0 sm:ml-6 flex-shrink-0">
                {/* Trophy SVG icon */}
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <ellipse cx="45" cy="82" rx="28" ry="8" fill="#E6F0FA" />
                  <rect
                    x="35"
                    y="65"
                    width="20"
                    height="12"
                    rx="4"
                    fill="#FBBF24"
                  />
                  <rect
                    x="40"
                    y="77"
                    width="10"
                    height="5"
                    rx="2"
                    fill="#F59E42"
                  />
                  <path
                    d="M45 70c-10-5-15-15-15-30V20h30v20c0 15-5 25-15 30z"
                    fill="#FBBF24"
                    stroke="#F59E42"
                    strokeWidth="2"
                  />
                  <circle
                    cx="45"
                    cy="35"
                    r="10"
                    fill="#FDE68A"
                    stroke="#F59E42"
                    strokeWidth="2"
                  />
                  <path
                    d="M20 25c0 10 5 18 10 20"
                    stroke="#F59E42"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M70 25c0 10-5 18-10 20"
                    stroke="#F59E42"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrizesComponent;
