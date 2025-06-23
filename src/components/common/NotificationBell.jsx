import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContex";
import { Button } from "@/components/ui/button";
import { IoNotificationsOutline } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import publicApi from "@/api/publicApi";

const NotificationBell = () => {

  const { user, notifications, setNotifications } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Only mark as read, don't remove
  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open) {
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    }
  };


  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full h-10 w-10"
        >
          <IoNotificationsOutline className="h-5 w-5" />
          {notifications.filter((n) => !n.read).length > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white grid place-items-center">
              {notifications.filter((n) => !n.read).length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.map((notif, idx) => (
            <DropdownMenuItem
              key={idx}
              className={cn(
                "flex flex-col items-start gap-1 p-4 cursor-default",
                !notif.read && "bg-muted/50",
                idx < notifications.length - 1 && "border-b"
              )}
            >
              <p className="text-sm font-medium">{notif.message.message}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(notif.timeStamp).toLocaleString()}
              </p>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
