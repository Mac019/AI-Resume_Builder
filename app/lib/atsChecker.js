export function checkATSFormatting(parsedText) {
    const warnings = [];
  
    // --- Section Checks ---
    const requiredSections = ["education", "experience", "skills", "projects"];
    requiredSections.forEach(section => {
      if (!parsedText.toLowerCase().includes(section)) {
        warnings.push(`Missing section: ${section}`);
      }
    });
  
    // --- Tables/Columns ---
    if (/[│┼╫═]/.test(parsedText)) {
      warnings.push("Detected table-like formatting (│ ┼ ╫). ATS systems may not read tables correctly.");
    }
  
    // --- Common visual symbols ---
    if (/[★•✓➤■▶♦]/.test(parsedText)) {
      warnings.push("Symbols like ★, ✓, ➤ found. Use standard bullet points for better ATS compatibility.");
    }
  
    // --- Image metadata (optional placeholder) ---
    if (parsedText.toLowerCase().includes("image") || parsedText.toLowerCase().includes(".png") || parsedText.toLowerCase().includes(".jpg")) {
      warnings.push("Resume contains image references. Avoid using profile photos — ATS may skip them.");
    }
  
    return warnings;
  }
  