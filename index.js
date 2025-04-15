function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Dátum;Név\n";
    
    const rows = document.querySelectorAll("table tbody tr:not(.hidden)");
    rows.forEach(row => {
        const cols = row.querySelectorAll("td");
        const line = Array.from(cols).map(td => td.innerText).join(";");
        csvContent += line + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "funyiras_beosztas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    }     
    
    document.addEventListener("DOMContentLoaded", () => {
        const searchInput = document.getElementById("searchInput");
        const nameFilter = document.getElementById("nameFilter");
      
        function filterAllTables() {
          const searchTerm = searchInput.value.toLowerCase();
          const selectedName = nameFilter.value.toLowerCase();
      
          // Végigmegy minden <tbody> soron
          const allRows = document.querySelectorAll("tbody .row");
      
          // Resetelés és szűrés
          allRows.forEach(row => {
            const date = row.children[0].textContent.toLowerCase();
            const name = row.children[1].textContent.toLowerCase();
      
            const matchesText = date.includes(searchTerm) || name.includes(searchTerm);
            const matchesName = !selectedName || name === selectedName;
      
            if (matchesText && matchesName) {
              row.style.display = "";
            } else {
              row.style.display = "none";
            }
          });
      
          // Most minden táblázatot és h2 fejlécet ellenőrzünk
          document.querySelectorAll("table").forEach(table => {
            const tbodyRows = table.querySelectorAll("tbody .row");
            const hasVisible = Array.from(tbodyRows).some(row => row.style.display !== "none");
      
            table.style.display = hasVisible ? "" : "none";
      
            const heading = table.previousElementSibling;
            if (heading && heading.tagName === "H2") {
              heading.style.display = hasVisible ? "" : "none";
            }
          });
        }
      
        searchInput.addEventListener("input", filterAllTables);
        nameFilter.addEventListener("change", filterAllTables);
      });

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