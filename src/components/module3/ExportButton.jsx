import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportButton = ({ participants }) => {

  const exportExcel = () => {

    const worksheet =
      XLSX.utils.json_to_sheet(participants);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Participants"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

    const data = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(data, "participants.xlsx");
  };

  return (
    <button
      onClick={exportExcel}
      className="bg-green-600 px-4 py-2 rounded-xl"
    >
      Export Excel
    </button>
  );
};

export default ExportButton;