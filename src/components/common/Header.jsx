import { IoLogoLinkedin } from "react-icons/io5";
import { FaSquareInstagram, FaFacebook } from "react-icons/fa6";
import { IoNotificationsOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContex";
import UserMenu from "./UserMenu";
import AdminMenu from "../menu/AdminMenu";
import JobseekerMenu from "@/components/menu/JobseekerMenu";
import NotificationBell from "./NotificationBell";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const getNavigationLinks = (userRole) => [
  {
    id: 1,
    title: "Home",
    href: "/",
  },
  {
    id: 2,
    title: "Jobs",
    href: "/jobs",
  },
  {
    id: 3,
    title: "Internship",
    href: "/internship",
  },
  {
    id: 4,
    title: "Hackathons",
    href: "/hackathons",
  },
];

const SocialLinks = [
  {
    id: 1,
    icon: (
      <img
        src="https://res.cloudinary.com/dhopew3ev/image/upload/v1747895025/linkedin_uh9rav.svg"
        alt="Logo"
        className="h-6 w-6"
      />
    ),
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
  {
    id: 2,
    icon: (
      <img
        src="https://res.cloudinary.com/dhopew3ev/image/upload/v1747895025/instagram_vdzvyp.svg"
        alt="Logo"
        className="h-6 w-6"
      />
    ),
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    id: 3,
    icon: (
      <img
        src="https://res.cloudinary.com/dhopew3ev/image/upload/v1747895025/facebook_ujasod.svg"
        alt="Logo"
        className="h-6 w-6"
      />
    ),
    href: "https://facebook.com",
    label: "Facebook",
  },
];

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const NavigationLinks = getNavigationLinks(user?.role);

  const isActiveLink = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur">
      <nav className="container px-4 flex h-16 max-w-screen-2xl items-center justify-between">
        {/* Logo and Mobile Nav */}
        <div className="flex items-center gap-4">
          <MobileNav
            links={NavigationLinks}
            socialLinks={SocialLinks}
            currentPath={location.pathname}
          />
          <Link to="/" className="text-xl font-bold">
            EMPLOYARA
          </Link>
        </div>

        {/* Navigation Links - Centered - Hidden on Mobile */}
        <div className="hidden md:flex flex-1 justify-center gap-1">
          {NavigationLinks.map((link) => (
            <Button
              key={link.id}
              variant={isActiveLink(link.href) ? "default" : "ghost"}
              className={cn(
                "text-base font-medium transition-colors",
                isActiveLink(link.href)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
              asChild
            >
              <Link to={link.href}>{link.title}</Link>
            </Button>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Social Media Icons */}
          <div className="hidden md:flex items-center gap-3">
            {SocialLinks.map((social) => (
              <Button
                key={social.id}
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 hover:text-foreground"
                asChild
              >
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              </Button>
            ))}
          </div>

          {/* Login Button or User Menu */}
          {user ? (
            <>
              <NotificationBell />
              {user.role === "ADMIN" ? (
                <AdminMenu />
              ) : user.role === "JOBSEEKER" ? (
                <div className="flex items-center">
                  <JobseekerMenu />
                </div>
              ) : (
                <UserMenu />
              )}
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="font-semibold"
              asChild
            >
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
