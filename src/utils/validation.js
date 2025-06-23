export const validateEducation = (education) => {
  const errors = {};
  // Required fields
  if (!education.instituteName?.trim()) {
    errors.instituteName = "Institute name is required";
  }

  if (!education.fieldOfStudy?.trim()) {
    errors.fieldOfStudy = "Field of study is required";
  }

  if (!education.degree?.trim()) {
    errors.degree = "Degree is required";
  }

  // Specialization is optional but should be validated if provided
  if (education.specialization && education.specialization.length > 100) {
    errors.specialization = "Specialization should not exceed 100 characters";
  }

  if (!education.startDate) {
    errors.startDate = "Start date is required";
  }

  // Date validation
  if (education.startDate && education.endDate) {
    const start = new Date(education.startDate);
    const end = new Date(education.endDate);
    if (start > end) {
      errors.endDate = "End date must be after start date";
    }
  }

  // Grade validation
  if (education.gradeValue) {
    const gradeNum = parseFloat(education.gradeValue);
    if (isNaN(gradeNum)) {
      errors.gradeValue = "Grade must be a number";
    } else if (education.gradeType === "percentage") {
      if (gradeNum < 0 || gradeNum > 100) {
        errors.gradeValue = "Percentage must be between 0 and 100";
      }
    } else if (education.gradeType === "cgpa") {
      if (gradeNum < 0 || gradeNum > 10) {
        errors.gradeValue = "CGPA must be between 0 and 10";
      }
    }
  }

  // File validation
  if (education.documents) {
    const invalidFiles = education.documents.filter((doc) => {
      if (!doc.file) return false; // Skip already uploaded files

      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(doc.file.type)) {
        return true;
      }

      // Check file size (10MB limit)
      if (doc.file.size > 10 * 1024 * 1024) {
        return true;
      }

      return false;
    });

    if (invalidFiles.length > 0) {
      errors.documents =
        "Some files are invalid. Please use PDF or DOC files under 10MB";
    }
  }

  return errors;
};
