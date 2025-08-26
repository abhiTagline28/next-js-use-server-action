"use server";

import { writeDataFile, readDataFile, generateId } from "@/lib/dataUtils";

export async function createStudent(prevState, formData) {
  try {
    // Validate required fields
    const name = formData.get("name")?.trim();
    const email = formData.get("email")?.trim();
    const grade = formData.get("grade")?.trim();

    const errors = {};

    if (!name) {
      errors.name = "Name is required";
    }

    if (!email) {
      errors.email = "Email is required";
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (!grade) {
      errors.grade = "Grade is required";
    }

    // Validate age if provided
    const ageStr = formData.get("age");
    if (ageStr) {
      const age = parseInt(ageStr);
      if (isNaN(age) || age < 5 || age > 25) {
        errors.age = "Age must be between 5 and 25";
      }
    }

    // Validate GPA if provided
    const gpaStr = formData.get("gpa");
    if (gpaStr) {
      const gpa = parseFloat(gpaStr);
      if (isNaN(gpa) || gpa < 0 || gpa > 4) {
        errors.gpa = "GPA must be between 0 and 4";
      }
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return {
        ...prevState,
        errors,
        success: false,
        message: "Please fix the errors below",
      };
    }

    // Check if email already exists
    const existingStudents = await readDataFile("students");
    const emailExists = existingStudents.some(
      (student) => student.email === email
    );
    if (emailExists) {
      return {
        ...prevState,
        errors: { email: "A student with this email already exists" },
        success: false,
        message: "Email already exists",
      };
    }

    // Create new student object
    const newStudent = {
      id: generateId(existingStudents),
      name,
      email,
      grade,
      age: ageStr ? parseInt(ageStr) : null,
      phone: formData.get("phone") || null,
      address: formData.get("address") || null,
      gpa: gpaStr ? parseFloat(gpaStr) : null,
      subjects: formData.get("subjects")
        ? formData
            .get("subjects")
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s)
        : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to existing students
    const updatedStudents = [...existingStudents, newStudent];

    // Write to file
    await writeDataFile("students", updatedStudents);

    return {
      ...prevState,
      errors: {},
      success: true,
      message: "Student created successfully!",
    };
  } catch (error) {
    console.error("Error creating student:", error);
    return {
      ...prevState,
      errors: { general: "An error occurred while creating the student" },
      success: false,
      message: "Failed to create student",
    };
  }
}
