export function scoreResume(parsedData) {
  const requiredSkills = [
    // Frontend
    "ReactJS", "CAD", "MS-Office", "JavaScript", "TypeScript", "HTML5", "CSS3", "AI Tools", "Tailwind CSS", "Bootstrap", "jQuery", "Redux", "ES6", "WebAssembly", "Webpack",
  
    // Backend
    "NodeJS", "ExpressJS", "Java", "Python", "Ruby", "PHP", "Go", "C#", "Django", "Flask", "Spring", "ASP.NET", "FastAPI",
  
    // Databases
    "MongoDB", "MySQL", "PostgreSQL", "SQLite", "Cassandra", "Redis", "MariaDB", "Elasticsearch", "OracleDB", "Firebase", "DynamoDB",
  
 

  ];
  const maxSkills = requiredSkills.length;

  // === SKILLS ===
  const skillsArray = parsedData.skills || [];  // Ensure it's an array
  
  // Log to debug
  console.log("Parsed Skills:", skillsArray);

  const matchedSkills = requiredSkills.filter(skill =>
    skillsArray.some(s => s.toLowerCase().includes(skill.toLowerCase()))
  );

  const skillsScore = Math.min((matchedSkills.length / maxSkills) * 30, 30); // 30%

  // === EXPERIENCE ===
  const totalExperienceLines = parsedData.experience?.length || 0;
  const experienceScore = Math.min((totalExperienceLines / 5) * 30, 30); // 30%

  // === EDUCATION ===
  const hasBtech = parsedData.education?.some(line =>
    line.toLowerCase().includes("b.tech") || line.toLowerCase().includes("bachelor")
  );
  const educationScore = hasBtech ? 20 : 0; // 20%

  // === PROJECTS ===
  const totalProjects = parsedData.projects?.length || 0;
  const projectScore = Math.min((totalProjects / 3) * 10, 10); // 10%

  // === CERTIFICATIONS ===
  const hasCert = parsedData.text?.toLowerCase().includes("certificate");
  const certScore = hasCert ? 10 : 0; // 10%

  const total = Math.round(skillsScore + experienceScore + educationScore + projectScore + certScore);

  return {
    totalScore: total,
    breakdown: {
      skills: Math.round(skillsScore),
      experience: Math.round(experienceScore),
      education: Math.round(educationScore),
      projects: Math.round(projectScore),
      certifications: Math.round(certScore),
    }
  };
}
