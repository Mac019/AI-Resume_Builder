export async function detectBiasInResume(text) {
    console.log("[detectBiasInResume] Input text:", text);

    try {
        // Sending POST request to the server API
        const res = await fetch("/api/detectBias", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text }),
        });

        console.log("[detectBiasInResume] Response status:", res.status);

        // Check if the response status is not OK (not 2xx range)
        if (!res.ok) {
            // Fetch the error text for debugging
            const errorText = await res.text();
            console.error("[detectBiasInResume] Server returned error:", errorText);
            return `Error from API: ${res.status} - ${errorText}`;
        }

        // Parse the JSON response
        const data = await res.json();
        console.log("[detectBiasInResume] API response JSON:", data);

        // Check if 'result' field is present in the response
        if (!data.result) {
            console.warn("[detectBiasInResume] No 'result' field in response:", data);
            return "Bias report is missing in the response.";
        }

        return data.result;

    } catch (error) {
        // Log any unexpected errors
        console.error("[detectBiasInResume] Exception occurred:", error);

        // Additional context to identify if the error is network-related
        if (error.name === "TypeError" && error.message.includes("fetch")) {
            return "Network error occurred while contacting the API.";
        }

        // General error message for other issues
        return "An error occurred while detecting bias.";
    }
}
