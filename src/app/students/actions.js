"use server";

import { readDataFile, writeDataFile } from "@/lib/dataUtils";

export async function getStudents() {
  try {
    const students = await readDataFile("students");
    return { success: true, data: students };
  } catch (error) {
    console.error("Error fetching students:", error);
    return { success: false, error: "Failed to fetch students" };
  }
}

export async function deleteStudent(studentId) {
  try {
    const students = await readDataFile("students");
    const updatedStudents = students.filter(
      (student) => student.id !== studentId
    );
    await writeDataFile("students", updatedStudents);
    return { success: true, message: "Student deleted successfully" };
  } catch (error) {
    console.error("Error deleting student:", error);
    return { success: false, error: "Failed to delete student" };
  }
}

export async function getStudentById(id) {
  try {
    const students = await readDataFile("students");
    const student = students.find((s) => s.id === parseInt(id));
    if (!student) {
      return { success: false, error: "Student not found" };
    }
    return { success: true, data: student };
  } catch (error) {
    console.error("Error fetching student:", error);
    return { success: false, error: "Failed to fetch student" };
  }
}

export async function updateStudent(id, formData) {
  try {
    const students = await readDataFile("students");
    const studentIndex = students.findIndex((s) => s.id === parseInt(id));

    if (studentIndex === -1) {
      return { success: false, error: "Student not found" };
    }

    const updatedStudent = {
      ...students[studentIndex],
      name: formData.get("name"),
      email: formData.get("email"),
      grade: formData.get("grade"),
      age: formData.get("age") ? parseInt(formData.get("age")) : null,
      phone: formData.get("phone") || null,
      parentName: formData.get("parentName") || null,
      address: formData.get("address") || null,
      updatedAt: new Date().toISOString(),
    };

    students[studentIndex] = updatedStudent;
    await writeDataFile("students", students);

    return { success: true, message: "Student updated successfully" };
  } catch (error) {
    console.error("Error updating student:", error);
    return { success: false, error: "Failed to update student" };
  }
}
