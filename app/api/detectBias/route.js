// pages/api/detectBias.js

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { text } = req.body;

    if (!text) return res.status(400).json({ error: "No resume text provided" });

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: `You are a resume reviewer. Analyze the resume text below for biased or discriminatory language (gender, age, race, etc.). If no bias is found, respond with: "No bias detected."
  
                        """
                        ${text}
                        """`,
                    },
                ],
                max_tokens: 500,
            }),
        });

        const data = await response.json();

        if (!data.choices || !data.choices[0]?.message?.content) {
            return res.status(500).json({ error: "Failed to get a valid response from OpenAI API." });
        }

        res.status(200).json({ result: data.choices[0].message.content });
    } catch (error) {
        console.error("Bias detection error:", error);
        res.status(500).json({ error: "Failed to fetch bias report." });
    }
}
