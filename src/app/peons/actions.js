"use server";

import { readDataFile, writeDataFile, generateId } from "@/lib/dataUtils";

export async function getPeons() {
  try {
    const peons = await readDataFile("peons");
    return { success: true, data: peons };
  } catch (error) {
    console.error("Error fetching peons:", error);
    return { success: false, error: "Failed to fetch peons" };
  }
}

export async function deletePeon(peonId) {
  try {
    const peons = await readDataFile("peons");
    const updatedPeons = peons.filter((peon) => peon.id !== peonId);
    await writeDataFile("peons", updatedPeons);
    return { success: true, message: "Peon deleted successfully" };
  } catch (error) {
    console.error("Error deleting peon:", error);
    return { success: false, error: "Failed to delete peon" };
  }
}

export async function getPeonById(id) {
  try {
    const peons = await readDataFile("peons");
    const peon = peons.find((p) => p.id === parseInt(id));
    if (!peon) {
      return { success: false, error: "Peon not found" };
    }
    return { success: true, data: peon };
  } catch (error) {
    console.error("Error fetching peon:", error);
    return { success: false, error: "Failed to fetch peon" };
  }
}

export async function createPeon(prevState, formData) {
  try {
    // Validate required fields
    const name = formData.get("name")?.trim();
    const email = formData.get("email")?.trim();
    const department = formData.get("department")?.trim();

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

    if (!department) {
      errors.department = "Department is required";
    }

    // Validate salary if provided
    const salaryStr = formData.get("salary");
    if (salaryStr) {
      const salary = parseFloat(salaryStr);
      if (isNaN(salary) || salary < 0) {
        errors.salary = "Salary must be a positive number";
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
    const existingPeons = await readDataFile("peons");
    const emailExists = existingPeons.some((peon) => peon.email === email);
    if (emailExists) {
      return {
        ...prevState,
        errors: { email: "A peon with this email already exists" },
        success: false,
        message: "Email already exists",
      };
    }

    // Create new peon object
    const newPeon = {
      id: generateId(existingPeons),
      name,
      email,
      department,
      phone: formData.get("phone") || null,
      address: formData.get("address") || null,
      salary: salaryStr ? parseFloat(salaryStr) : null,
      shift: formData.get("shift") || "Morning",
      responsibilities: formData.get("responsibilities")
        ? formData
            .get("responsibilities")
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s)
        : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to existing peons
    const updatedPeons = [...existingPeons, newPeon];

    // Write to file
    await writeDataFile("peons", updatedPeons);

    return {
      ...prevState,
      errors: {},
      success: true,
      message: "Peon created successfully!",
    };
  } catch (error) {
    console.error("Error creating peon:", error);
    return {
      ...prevState,
      errors: { general: "An error occurred while creating the peon" },
      success: false,
      message: "Failed to create peon",
    };
  }
}

export async function updatePeon(id, formData) {
  try {
    const peons = await readDataFile("peons");
    const peonIndex = peons.findIndex((p) => p.id === parseInt(id));

    if (peonIndex === -1) {
      return { success: false, error: "Peon not found" };
    }

    const updatedPeon = {
      ...peons[peonIndex],
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      updatedAt: new Date().toISOString(),
    };

    peons[peonIndex] = updatedPeon;
    await writeDataFile("peons", peons);

    return { success: true, message: "Peon updated successfully" };
  } catch (error) {
    console.error("Error updating peon:", error);
    return { success: false, error: "Failed to update peon" };
  }
}
