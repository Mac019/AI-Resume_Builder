export function scoreResume(parsedData) {
    const requiredSkills = ["ReactJS", "NodeJS", "MongoDB", "Tailwind CSS", "Figma", "ExpressJS"];
    const maxSkills = requiredSkills.length;
  
    // === SKILLS ===
    const matchedSkills = requiredSkills.filter(skill =>
      parsedData.skills?.join(" ").toLowerCase().includes(skill.toLowerCase())
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
  