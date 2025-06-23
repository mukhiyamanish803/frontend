import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav({ links, socialLinks, currentPath }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={cn(
                  "block px-2 py-1 text-lg transition-colors",
                  currentPath === link.href
                    ? "text-primary font-medium"
                    : "hover:text-primary"
                )}
              >
                {link.title}
              </a>
            ))}
          </div>
          <div className="flex gap-5 mt-4">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={social.label}
              >
                <div className="h-6 w-6">{social.icon}</div>
              </a>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
