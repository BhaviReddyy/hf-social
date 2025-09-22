// backend/src/ai.js
const { GoogleGenAI } = require('@google/genai');
// NOTE: You must set your API Key as an environment variable (GEMINI_API_KEY)
const ai = new GoogleGenAI({});

// 💡 Placeholder function to get the user's saved business context
// In a real app, this would query your database (e.g., MongoDB)
const getBusinessContext = async(userId) => {
    // For now, return a hardcoded context for testing
    return {
        industry: "Sustainable Coffee Shop",
        brandVoice: "Friendly, passionate, and eco-conscious",
        targetAudience: "Young professionals (25-40) interested in ethical sourcing",
    };
};


/**
 * Generates content using the Gemini model.
 * @param {string} userId - The ID of the user requesting content.
 * @param {string} userPrompt - The specific request from the user (e.g., "Write a post about our new autumn blend").
 * @param {string} platform - The target platform (e.g., 'Twitter', 'Instagram').
 * @param {string} postType - 'Dynamic' or 'Static'.
 * @returns {Promise<string>} The generated content text.
 */
async function generateContent(userId, userPrompt, platform, postType) {
    // 1. Retrieve the saved business context
    const context = await getBusinessContext(userId);

    // 2. Craft a sophisticated prompt based on all requirements
    const systemPrompt = `You are a professional social media content manager. Your goal is to write high-quality, genuine content that does NOT sound like it was written by an AI.

    **Business Context:**
    - Industry: ${context.industry}
    - Brand Voice: ${context.brandVoice}
    - Target Audience: ${context.targetAudience}

    **Content Requirements:**
    - Platform: ${platform} (Adjust tone and length appropriately. Use relevant emojis for Instagram.)
    - Post Type: ${postType} (If Dynamic, include a clear question/CTA for engagement.)
    - User Request: "${userPrompt}"

    Draft the post content based on these parameters. Return only the final text, ready to post.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Use a fast, capable model
            contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
        });

        // 3. Extract the generated text
        return response.text.trim();

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate content via AI service.");
    }
}

module.exports = { generateContent };