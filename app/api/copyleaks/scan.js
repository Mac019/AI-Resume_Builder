// /pages/api/copyleaks/scan.js
export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
  
    const { text } = req.body;
    const token = process.env.COPYLEAKS_API_KEY;  // Access the API key from .env
    const scanId = `scan-${Date.now()}`; // Unique scan ID
  
    try {
      const submitRes = await fetch(`https://api.copyleaks.com/v3/scans/submit/${scanId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  // Pass the token here
        },
        body: JSON.stringify({
          base64: Buffer.from(text).toString("base64"),
          filename: "resume.txt",
          properties: {
            webhooks: {
              status: `${process.env.NEXT_PUBLIC_BASE_URL}/api/copyleaks/status`,
            },
            sandbox: true, // Use sandbox mode in dev (no cost)
          },
        }),
      });
  
      const result = await submitRes.json();
      res.status(200).json({ message: "Submitted for scan", result });
    } catch (error) {
      res.status(500).json({ error: "Scan submission failed", details: error });
    }
}
