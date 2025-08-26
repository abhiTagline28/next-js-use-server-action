"use server";

import { readDataFile, writeDataFile, generateId } from "@/lib/dataUtils";

export async function getTeachers() {
  try {
    const teachers = await readDataFile("teachers");
    return { success: true, data: teachers };
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return { success: false, error: "Failed to fetch teachers" };
  }
}

export async function deleteTeacher(teacherId) {
  try {
    const teachers = await readDataFile("teachers");
    const updatedTeachers = teachers.filter(
      (teacher) => teacher.id !== teacherId
    );
    await writeDataFile("teachers", updatedTeachers);
    return { success: true, message: "Teacher deleted successfully" };
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return { success: false, error: "Failed to delete teacher" };
  }
}

export async function getTeacherById(id) {
  try {
    const teachers = await readDataFile("teachers");
    const teacher = teachers.find((t) => t.id === parseInt(id));
    if (!teacher) {
      return { success: false, error: "Teacher not found" };
    }
    return { success: true, data: teacher };
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return { success: false, error: "Failed to fetch teacher" };
  }
}

export async function updateTeacher(id, formData) {
  try {
    const teachers = await readDataFile("teachers");
    const teacherIndex = teachers.findIndex((t) => t.id === parseInt(id));

    if (teacherIndex === -1) {
      return { success: false, error: "Teacher not found" };
    }

    const updatedTeacher = {
      ...teachers[teacherIndex],
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      qualification: formData.get("qualification"),
      experience: formData.get("experience")
        ? parseInt(formData.get("experience"))
        : null,
      phone: formData.get("phone") || null,
      office: formData.get("office") || null,
      updatedAt: new Date().toISOString(),
    };

    teachers[teacherIndex] = updatedTeacher;
    await writeDataFile("teachers", teachers);

    return { success: true, message: "Teacher updated successfully" };
  } catch (error) {
    console.error("Error updating teacher:", error);
    return { success: false, error: "Failed to update teacher" };
  }
}

export async function createTeacher(prevState, formData) {
  try {
    // Validate required fields
    const name = formData.get("name")?.trim();
    const email = formData.get("email")?.trim();
    const subject = formData.get("subject")?.trim();
    const qualification = formData.get("qualification")?.trim();

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

    if (!subject) {
      errors.subject = "Subject is required";
    }

    if (!qualification) {
      errors.qualification = "Qualification is required";
    }

    // Validate experience if provided
    const experienceStr = formData.get("experience");
    if (experienceStr) {
      const experience = parseInt(experienceStr);
      if (isNaN(experience) || experience < 0 || experience > 50) {
        errors.experience = "Experience must be between 0 and 50 years";
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
    const existingTeachers = await readDataFile("teachers");
    const emailExists = existingTeachers.some(
      (teacher) => teacher.email === email
    );
    if (emailExists) {
      return {
        ...prevState,
        errors: { email: "A teacher with this email already exists" },
        success: false,
        message: "Email already exists",
      };
    }

    // Create new teacher object
    const newTeacher = {
      id: generateId(existingTeachers),
      name,
      email,
      subject,
      qualification,
      experience: experienceStr ? parseInt(experienceStr) : null,
      phone: formData.get("phone") || null,
      office: formData.get("office") || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to existing teachers
    const updatedTeachers = [...existingTeachers, newTeacher];

    // Write to file
    await writeDataFile("teachers", updatedTeachers);

    return {
      ...prevState,
      errors: {},
      success: true,
      message: "Teacher created successfully!",
    };
  } catch (error) {
    console.error("Error creating teacher:", error);
    return {
      ...prevState,
      errors: { general: "An error occurred while creating the teacher" },
      success: false,
      message: "Failed to create teacher",
    };
  }
}
