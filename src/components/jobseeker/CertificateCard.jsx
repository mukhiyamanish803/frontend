import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FiExternalLink, FiEdit2, FiTrash2, FiFile } from "react-icons/fi";

const CertificateCard = ({ certificate, onEdit, onDelete }) => {
  const formatDate = (date) => {
    if (!date) return "";
    try {
      return format(new Date(date), "MMM yyyy");
    } catch {
      return "";
    }
  };

  const {
    title,
    organization,
    organizationLink,
    certificateLink,
    description,
    skillsAcquired = [],
    dateIssued,
    dateExpire,
    documents,
  } = certificate;

  return (
    <Card className="w-full h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:border-primary/50 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2 text-primary group-hover:text-primary/80 transition-colors">
              {title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-muted-foreground/90 font-medium">
              {organization}
              {organizationLink && (
                <a
                  href={organizationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                  title="Visit organization website"
                >
                  <FiExternalLink className="h-4 w-4" />
                </a>
              )}
            </CardDescription>
          </div>
          <div className="flex gap-1.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
              onClick={onEdit}
              title="Edit certificate"
            >
              <FiEdit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              onClick={onDelete}
              title="Delete certificate"
            >
              <FiTrash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pb-2">
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        {skillsAcquired.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium uppercase text-muted-foreground">
              Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {skillsAcquired.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-2 py-0.5 text-xs bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-3 border-t">
        <div className="flex flex-wrap gap-2 w-full">
          {dateIssued && (
            <Badge
              variant="outline"
              className="text-xs px-2 py-0.5 bg-green-50"
            >
              Issued: {formatDate(dateIssued)}
            </Badge>
          )}
          {dateExpire && (
            <Badge
              variant="outline"
              className={`text-xs px-2 py-0.5 ${
                new Date(dateExpire) < new Date()
                  ? "border-red-500 text-red-600 bg-red-50"
                  : "border-yellow-500 text-yellow-600 bg-yellow-50"
              }`}
            >
              {new Date(dateExpire) < new Date() ? "Expired" : "Expires"}:{" "}
              {formatDate(dateExpire)}
            </Badge>
          )}
        </div>

        {(documents?.fileUrl || certificateLink) && (
          <div className="flex flex-wrap gap-2 w-full">
            {documents?.fileUrl && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => window.open(documents.fileUrl, "_blank")}
                title="Open certificate document"
              >
                <FiFile className="h-3 w-3 mr-1.5" />
                View Document
              </Button>
            )}
            {certificateLink && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => window.open(certificateLink, "_blank")}
                title="Open certificate link"
              >
                <FiExternalLink className="h-3 w-3 mr-1.5" />
                View Certificate
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default React.memo(CertificateCard);
