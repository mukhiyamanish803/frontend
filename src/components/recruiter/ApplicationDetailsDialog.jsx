import React, { useState, useEffect } from "react";
import {
  HiEye,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiDocument,
  HiOutlineExternalLink,
} from "react-icons/hi";
import { FaGithub, FaLinkedin, FaGlobe, FaTwitter } from "react-icons/fa";
import { Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import recruiterApi from "@/api/recruiterApi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const ApplicationDetailsDialog = ({ candidate }) => {
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fetchCandidateDetails = async () => {
      setIsLoading(true);
      try {
        const response = await recruiterApi.get(
          `/candidate/${candidate.applicantId}`
        );
        console.log(
          "Full candidate details:",
          JSON.stringify(response.data, null, 2)
        );
        setCandidateDetails(response.data);
      } catch (error) {
        toast.error("Failed to fetch candidate details");
        console.error("Error fetching candidate details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchCandidateDetails();
    }
  }, [candidate.applicantId, open]);

  const getSocialIconAndName = (url) => {
    const urlLower = url.toLowerCase();
    if (urlLower.includes("github.com"))
      return { icon: <FaGithub className="h-5 w-5" />, name: "GitHub" };
    if (urlLower.includes("linkedin.com"))
      return { icon: <FaLinkedin className="h-5 w-5" />, name: "LinkedIn" };
    if (urlLower.includes("twitter.com") || urlLower.includes("x.com"))
      return { icon: <FaTwitter className="h-5 w-5" />, name: "Twitter" };
    return { icon: <FaGlobe className="h-5 w-5" />, name: "Website" };
  };

  const DetailSection = ({ title, children }) => (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold">{title}</h4>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <HiEye className="h-4 w-4" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-none min-w-5xl mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          candidateDetails && (
            <ScrollArea className="max-h-[85vh] pr-4">
              {/* Resume Header */}
              <div className="mb-8">
                <div className="flex flex-row-reverse items-start gap-12">
                  {/* Profile Image - Right Side */}
                  <div className="flex-shrink-0">
                    <Avatar className="h-48 w-48">
                      {candidateDetails?.profile?.profileImageUrl ? (
                        <AvatarImage
                          src={candidateDetails.profile.profileImageUrl}
                          alt={`${candidateDetails?.user?.firstName} ${candidateDetails?.user?.lastName}`}
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="text-4xl">
                          {candidateDetails?.user?.firstName?.[0]}
                          {candidateDetails?.user?.lastName?.[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>

                  {/* Left Side Content */}
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      {/* Name */}
                      <h1 className="text-4xl font-bold text-gray-900">
                        {candidateDetails?.user?.firstName}{" "}
                        {candidateDetails?.user?.lastName}
                      </h1>

                      {/* Title */}
                      <h2 className="text-2xl text-gray-600">
                        {candidateDetails?.profile?.title}
                      </h2>
                    </div>

                    {/* Contact and Address */}
                    <div className="space-y-2">
                      <div className="flex gap-4">
                        {candidateDetails?.user?.email && (
                          <div className="flex items-center gap-2">
                            <HiMail className="h-5 w-5 text-primary" />
                            <a
                              href={`mailto:${candidateDetails?.user?.email}`}
                              className="text-gray-600 hover:text-primary"
                            >
                              {candidateDetails?.user?.email}
                            </a>
                          </div>
                        )}

                        {candidateDetails?.profile?.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <HiPhone className="h-5 w-5 text-primary" />
                            <span className="text-gray-600">
                              {candidateDetails?.profile?.dialCode}{" "}
                              {candidateDetails?.profile?.phoneNumber}
                            </span>
                          </div>
                        )}
                        {candidateDetails?.profile?.address && (
                          <div className="flex items-center gap-2">
                            <HiLocationMarker className="h-5 w-5 text-primary" />
                            <span className="text-gray-600">
                              {candidateDetails.profile.address.split(",")[1]}
                              {", "}
                              {candidateDetails.profile.address.split(",")[2]}
                              {", "}
                              {candidateDetails.profile.address.split(",")[3]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Social Links */}
                    {candidateDetails?.profile?.socialLinks?.length > 0 && (
                      <div className="flex gap-4 pt-2">
                        {candidateDetails.profile.socialLinks.map(
                          (link, index) => {
                            const social = getSocialIconAndName(link);
                            return (
                              <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                              >
                                {social.icon}
                                <span className="text-sm font-medium">
                                  {social.name}
                                </span>
                              </a>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Separator className="my-8" />
              {/* About Me Section */}
              {candidateDetails?.profile?.bio && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 bg-gray-100 w-fit px-4 py-1 rounded-md">
                    About Me
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {candidateDetails.profile.bio}
                  </p>
                </div>
              )}

              <Separator className="my-8" />

              {/* Education Section */}
              {candidateDetails.education?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 bg-gray-100 w-fit px-4 py-1 rounded-md">
                    Education
                  </h3>
                  <div className="space-y-6">
                    {candidateDetails.education.map((edu, index) => (
                      <div key={index} className="space-y-3">
                        {/* Institution Name */}
                        <h3 className="text-xl font-medium text-gray-900">
                          {edu.instituteName ||
                            edu.institution ||
                            edu.institute ||
                            "Unknown Institution"}
                        </h3>

                        {/* Institution Address */}
                        {edu.address && (
                          <div className="flex items-start gap-2 text-gray-600">
                            <HiLocationMarker className="h-5 w-5 text-primary mt-0.5" />
                            <span>{edu.address}</span>
                          </div>
                        )}

                        {/* Degree Details */}
                        <div className="space-y-2">
                          {edu?.degree} {edu?.fieldOfStudy}{" "}
                          {edu?.specialization &&
                            `with specialization in ${edu?.specialization}`}
                        </div>

                        {/* Duration */}
                        <p className="text-gray-600">
                          {new Date(edu.startDate).getFullYear()} -{" "}
                          {edu.endDate
                            ? new Date(edu.endDate).getFullYear()
                            : "Present"}
                        </p>

                        {/* Grade */}
                        {(edu.gradeType || edu.gradeValue) && (
                          <p className="text-gray-700">
                            {edu.gradeType}:{" "}
                            <span className="font-medium">
                              {edu.gradeValue}
                            </span>
                          </p>
                        )}

                        {/* Document Links */}
                        {edu.documents?.length > 0 && (
                          <div className="flex flex-col gap-2 mt-2">
                            <p className="text-sm font-medium text-gray-700">
                              Documents:
                            </p>
                            <div className="flex flex-wrap gap-3">
                              {edu.documents.map((doc, docIndex) => (
                                <a
                                  key={docIndex}
                                  href={doc}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
                                >
                                  <HiDocument className="h-5 w-5" />
                                  <span className="font-medium text-sm">
                                    {doc.fileName || "View Document"}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-8" />

              {/* Experience Section */}
              {candidateDetails.experience?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 bg-gray-100 w-fit px-4 py-1 rounded-md">
                    Experience
                  </h3>
                  <div className="space-y-6">
                    {candidateDetails.experience.map((exp, index) => (
                      <div key={index} className="space-y-3">
                        {/* Job Title and Company */}
                        <h3 className="text-xl font-medium text-gray-900">
                          {exp.jobTitle}
                        </h3>

                        {/* Company Details */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            <span>{exp.companyName}</span>
                            {exp.companyUrl && (
                              <a
                                href={exp.companyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary"
                              >
                                <HiOutlineExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>

                          {/* Location */}
                          {exp.companyLocation && (
                            <div className="flex items-start gap-2 text-gray-600">
                              <HiLocationMarker className="h-5 w-5 text-primary mt-0.5" />
                              <span>{exp.companyLocation}</span>
                            </div>
                          )}
                        </div>

                        {/* Duration */}
                        <p className="text-gray-600">
                          {new Date(exp.startDate).toLocaleDateString()} -{" "}
                          {exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString()
                            : "Present"}
                        </p>

                        {/* Description */}
                        {exp.description && (
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {exp.description}
                          </p>
                        )}

                        {/* Certificate/File */}
                        {exp.file && (
                          <div className="flex items-center gap-2 mt-2">
                            <HiDocument className="h-5 w-5 text-primary" />
                            <a
                              href={exp.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                            >
                              View Certificate
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-8" />

              {/* Projects Section */}
              {candidateDetails.projects?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 bg-gray-100 w-fit px-4 py-1 rounded-md">
                    Projects
                  </h3>
                  <div className="space-y-6">
                    {candidateDetails.projects.map((project, index) => (
                      <div key={index} className="space-y-4">
                        {/* Project Title and Links */}
                        <div className="flex items-center gap-4">
                          <h3 className="text-xl font-medium text-gray-900">
                            {project.title}
                          </h3>
                          <div className="flex gap-2">
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary"
                              >
                                <FaGithub className="h-5 w-5" />
                              </a>
                            )}
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary"
                              >
                                <HiOutlineExternalLink className="h-5 w-5" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        {project.description && (
                          <p className="text-gray-700">{project.description}</p>
                        )}

                        {/* Technologies */}
                        {project.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Features */}
                        {project.features?.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">
                              Key Features:
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                              {project.features.map((feature, i) => (
                                <li key={i}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Screenshots */}
                        {project.screenshots?.length > 0 && (
                          <div className="grid grid-cols-4 gap-4">
                            {project.screenshots.map((screenshot, i) => (
                              <img
                                key={i}
                                src={screenshot}
                                alt={`${project.title} screenshot ${i + 1}`}
                                className="rounded-lg border object-cover w-60 h-60"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-8" />

              {/* Certificates Section */}
              {candidateDetails.certificates?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 bg-gray-100 w-fit px-4 py-1 rounded-md">
                    Certifications
                  </h3>
                  <div className="space-y-6">
                    {candidateDetails.certificates.map((cert, index) => (
                      <div key={index} className="space-y-4">
                        {/* Certificate Title and Organization */}
                        <div className="space-y-2">
                          <h3 className="text-xl font-medium text-gray-900">
                            {cert.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            <span>{cert.organization}</span>
                            {cert.organizationLink && (
                              <a
                                href={cert.organizationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary"
                              >
                                <HiOutlineExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Issue Date and Expiry */}
                        <p className="text-gray-600">
                          Issued:{" "}
                          {new Date(cert.dateIssued).toLocaleDateString()}
                          {cert.dateExpire && (
                            <>
                              {" "}
                              • Expires:{" "}
                              {new Date(cert.dateExpire).toLocaleDateString()}
                            </>
                          )}
                        </p>

                        {/* Description */}
                        {cert.description && (
                          <p className="text-gray-700">{cert.description}</p>
                        )}

                        {/* Skills Acquired */}
                        {cert.skillsAcquired?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {cert.skillsAcquired.map((skill, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Certificate Document */}
                        {cert.documents && (
                          <div className="flex items-center gap-2">
                            <HiDocument className="h-5 w-5 text-primary" />
                            <a
                              href={cert.documents}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                            >
                              View Certificate
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-8" />

              {/* Skills Section */}
              {candidateDetails.skills?.length > 0 && (
                <DetailSection title="Skills">
                  <div className="flex flex-wrap gap-2">
                    {candidateDetails.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </DetailSection>
              )}
            </ScrollArea>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsDialog;
