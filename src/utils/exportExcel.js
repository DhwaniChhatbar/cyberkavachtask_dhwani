import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// 📊 Generic Excel Export Function
export const exportToExcel = (data, fileName = "data.xlsx") => {
  try {
    // Convert JSON → Sheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Append sheet
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create Blob
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    // Download file
    saveAs(blob, fileName);
  } catch (error) {
    console.error("Excel export error:", error);
  }
};