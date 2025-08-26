"use server";

import { readDataFile, writeDataFile, generateId } from "@/lib/dataUtils";

export async function getGuards() {
  try {
    const guards = await readDataFile("guards");
    return { success: true, data: guards };
  } catch (error) {
    console.error("Error fetching guards:", error);
    return { success: false, error: "Failed to fetch guards" };
  }
}

export async function deleteGuard(guardId) {
  try {
    const guards = await readDataFile("guards");
    const updatedGuards = guards.filter((guard) => guard.id !== guardId);
    await writeDataFile("guards", updatedGuards);
    return { success: true, message: "Guard deleted successfully" };
  } catch (error) {
    console.error("Error deleting guard:", error);
    return { success: false, error: "Failed to delete guard" };
  }
}

export async function createGuard(prevState, formData) {
  try {
    // Validate required fields
    const name = formData.get("name")?.trim();
    const email = formData.get("email")?.trim();
    const post = formData.get("post")?.trim();

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

    if (!post) {
      errors.post = "Post is required";
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
    const existingGuards = await readDataFile("guards");
    const emailExists = existingGuards.some((guard) => guard.email === email);
    if (emailExists) {
      return {
        ...prevState,
        errors: { email: "A guard with this email already exists" },
        success: false,
        message: "Email already exists",
      };
    }

    // Create new guard object
    const newGuard = {
      id: generateId(existingGuards),
      name,
      email,
      post,
      phone: formData.get("phone") || null,
      address: formData.get("address") || null,
      shift: formData.get("shift") || "Morning",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to existing guards
    const updatedGuards = [...existingGuards, newGuard];

    // Write to file
    await writeDataFile("guards", updatedGuards);

    return {
      ...prevState,
      errors: {},
      success: true,
      message: "Guard created successfully!",
    };
  } catch (error) {
    console.error("Error creating guard:", error);
    return {
      ...prevState,
      errors: { general: "An error occurred while creating the guard" },
      success: false,
      message: "Failed to create guard",
    };
  }
}

export async function getGuardById(id) {
  try {
    const guards = await readDataFile("guards");
    const guard = guards.find((g) => g.id === parseInt(id));
    if (!guard) {
      return { success: false, error: "Guard not found" };
    }
    return { success: true, data: guard };
  } catch (error) {
    console.error("Error fetching guard:", error);
    return { success: false, error: "Failed to fetch guard" };
  }
}

export async function updateGuard(id, formData) {
  try {
    const guards = await readDataFile("guards");
    const guardIndex = guards.findIndex((g) => g.id === parseInt(id));

    if (guardIndex === -1) {
      return { success: false, error: "Guard not found" };
    }

    const updatedGuard = {
      ...guards[guardIndex],
      name: formData.get("name"),
      email: formData.get("email"),
      post: formData.get("post"),
      phone: formData.get("phone") || null,
      address: formData.get("address") || null,
      shift: formData.get("shift") || "Morning",
      updatedAt: new Date().toISOString(),
    };

    guards[guardIndex] = updatedGuard;
    await writeDataFile("guards", guards);

    return { success: true, message: "Guard updated successfully" };
  } catch (error) {
    console.error("Error updating guard:", error);
    return { success: false, error: "Failed to update guard" };
  }
}
