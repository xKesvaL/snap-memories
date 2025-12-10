export interface MemoryItem {
  date: string;
  type: "Video" | "Image" | "Unknown";
  url: string;
  filename: string;
}

export const parseMemoriesHTML = async (file: File): Promise<MemoryItem[]> => {
  // Use readAsText for compatibility if file.text() is missing in test env
  let text = '';
  if (typeof file.text === 'function') {
    text = await file.text();
  } else {
    // Basic polyfill for JSDOM 
    text = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
    });
  }
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  
  const rows = Array.from(doc.querySelectorAll("tr"));
  // Skip header row if present (usually first row has <th>)
  const dataRows = rows.filter(row => row.querySelector("td"));

  const memories: MemoryItem[] = [];

  for (const row of dataRows) {
    const cells = row.querySelectorAll("td");
    if (cells.length < 4) continue;

    const dateStr = cells[0]?.textContent?.trim() || "";
    const typeStr = cells[1]?.textContent?.trim() || "Unknown";
    // cells[2] is Location
    const downloadCell = cells[3];
    
    // Extract URL from onclick="downloadMemories('URL')"
    const anchor = downloadCell?.querySelector("a");
    const onclickAttr = anchor?.getAttribute("onclick");
    
    let url = "";
    if (onclickAttr) {
      // Look for single quote or double quote wrapped URL
      // Updated regex to handle extra arguments: downloadMemories('URL', ...)
      const match = onclickAttr.match(/downloadMemories\(['"]([^'"]+)['"]/);
      if (match && match[1]) {
        url = match[1];
      }
    }

    if (url) {
      // Format filename safely
      let dateFormatted = dateStr;
      try {
        // Parse "2025-12-09 15:59:27 UTC"
        // date-fns parsing might be tricky with "UTC" suffix directly, 
        // but new Date() usually handles "YYYY-MM-DD HH:MM:SS UTC" well in browsers.
        const dateObj = new Date(dateStr);
        if (!isNaN(dateObj.getTime())) {
             // Format: YYYY-MM-DD_HH-mm-ss
             // Manual formatting to avoid date-fns dependency if not strictly needed or strictly typed
             const pad = (n: number) => n.toString().padStart(2, '0');
             dateFormatted = `${dateObj.getFullYear()}-${pad(dateObj.getMonth()+1)}-${pad(dateObj.getDate())}_${pad(dateObj.getHours())}-${pad(dateObj.getMinutes())}-${pad(dateObj.getSeconds())}`;
        }
      } catch (e) {
        console.warn("Date parse error", e);
      }

      const ext = typeStr === "Video" ? "mp4" : "jpg"; // Default assumptions
      // If URL has extension, use it? AWS URLs often have long query params but clean path keys.
      // Usually better to trust the Type column + Date for name.
      
      const filename = `Memory_${dateFormatted}.${ext}`;

      // Handle duplicates by keeping track of counts? 
      // Better: we'll handle unique filenames in this pass.
      
      memories.push({
        date: dateStr,
        type: typeStr as "Video" | "Image" | "Unknown",
        url,
        filename
      });
    }
  }
  
  // Deduplicate filenames
  const nameMap = new Map<string, number>();
  for (const mem of memories) {
      if (nameMap.has(mem.filename)) {
          const count = nameMap.get(mem.filename)!;
          nameMap.set(mem.filename, count + 1);
          // Inject index before extension
          const parts = mem.filename.split('.');
          const ext = parts.pop();
          const base = parts.join('.');
          mem.filename = `${base}_${count}.${ext}`;
      } else {
          nameMap.set(mem.filename, 1);
      }
  }

  return memories;
};

