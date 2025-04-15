function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10; // kezdő pozíció

  document.querySelectorAll("h2").forEach((header, index) => {
    const table = header.nextElementSibling;
    if (table && table.tagName === "TABLE" && table.style.display !== "none") {
      // Hónap címe
      doc.setFontSize(14);
      doc.text(header.textContent, 10, y);
      y += 6;

      // Táblázat adatainak kigyűjtése
      const rows = [];
      table.querySelectorAll("tbody tr").forEach(row => {
        if (row.style.display !== "none") {
          const cells = row.querySelectorAll("td");
          rows.push([cells[0].textContent, cells[1].textContent]);
        }
      });

      // Csak akkor adjuk hozzá a táblát, ha van benne sor
      if (rows.length > 0) {
        doc.autoTable({
          head: [["Dátum", "Név"]],
          body: rows,
          startY: y,
          theme: "grid",
          headStyles: { fillColor: [52, 152, 219] }
        });

        y = doc.lastAutoTable.finalY + 10;
      }
    }
  });

  doc.save("funyiras_beosztas.pdf");
}