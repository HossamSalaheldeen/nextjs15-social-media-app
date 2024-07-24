import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell, Bookmark, Home, Mail } from "lucide-react";

interface MenuBarProps {
  className?: string;
}

function MenuBar({ className }: MenuBarProps) {
  return (
    <div className={cn("", className)}>
      <Button
        variant="ghost"
        title="Home"
        className="flex items-center justify-start gap-2"
        asChild
      >
        <Link href="/">
          <Home />
          <span hidden className="lg:inline">
            Home
          </span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        title="Notifications"
        className="flex items-center justify-start gap-2"
        asChild
      >
        <Link href="/">
          <Bell />
          <span hidden className="lg:inline">
            Notifications
          </span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        title="Messages"
        className="flex items-center justify-start gap-2"
        asChild
      >
        <Link href="/">
          <Mail />
          <span hidden className="lg:inline">
            Messages
          </span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        title="Bookmark"
        className="flex items-center justify-start gap-2"
        asChild
      >
        <Link href="/">
          <Bookmark />
          <span hidden className="lg:inline">
            Bookmark
          </span>
        </Link>
      </Button>
    </div>
  );
}

export default MenuBar;
