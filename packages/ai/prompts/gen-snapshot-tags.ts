/**
 * Generate tags for a document based on its title and content.
 *
 * Tag Structure Rules:
 * - Project (#Project/*\/**): For multi-step events that cannot be completed in one go
 * - Area (#Area/*//**): For continuous improvement areas that need regular attention
 * - Inbox (#Inbox/*\/**): For temporary, undigested content
 * - Resource (#Resource /*\/**): For permanent reference materials (Zettelkasten method)
 *
 * Special Rules for Technical Content:
 * - Must include #Area/Dev/Issues for content from technical Q&A platforms
 * - Must include specific technical context tags (language/framework/domain)
 * - Example: #Area/Dev/Issues + #Area/Dev/React
 *
 * Tag Format Requirements:
 * - Tags can have up to three levels (e.g., #Area/Dev/React)
 * - Each tag component should be 5 characters or less
 * - Minimum 2 tags total
 * - New tags should follow existing tag patterns when available
 *
 * @param title - The document title
 * @param snippet - The document content
 * @param generatedTags - Existing tags to reference (optional)
 * @param language - The language of the user
 * @returns JSON response with suggested tags and reasoning
 */

export function genSnapshotTagsDefaultPrompt(
  title: string,
  snippet: string,
  generatedTags: string[] = [],
  language = 'en-US'
) {
  return `You are a document organization expert. I need you to analyze the following document and suggest appropriate tags, with special attention to existing tags.

Document Title: "${title}"
Content: "${snippet}"
Existing Tags: ${generatedTags.join(', ') || 'None'}
User Language: ${language}

Tag Structure Rules:
1. Project (#Project/*/**): For multi-step events or goals
2. Area (#Area/*/**): For continuous improvement areas
3. Inbox (#Inbox/*/**): For temporary content
4. Resource (#Resource/*/**): For permanent reference materials

Language Rules:
- Generate tags in the user's language (${language})
- Technical terms (React, Vue, API, etc.) always remain in English
- For Chinese users: Use Chinese terms in non-technical tag components
- For English users: Use English terms in all tag components

Content Type Specific Rules:
- For text content: Focus on the subject matter and technical aspects
- For image/media content:
  * Use #Resource/Img/** for images
  * Use #Resource/Vid/** for videos
  * Add relevant subject tags (e.g., #Area/Design, #Area/UI)
  * Add format or type tags if applicable (e.g., #Resource/Img/Ref for reference images)

Technical Content Rules:
If content is from GitHub Issues, Stack Overflow, or any technical Q&A platforms:
1. MUST include #Area/Dev/Issues as the primary tag
2. MUST include at least one additional specific technical tag describing:
   - Programming language (e.g., #Area/Dev/JS, #Area/Dev/Go)
   - Framework/Library (e.g., #Area/Dev/React, #Area/Dev/Vue)
   - Technology domain (e.g., #Area/Dev/DB, #Area/Dev/API)

Please analyze and return your response in the following JSON format:
{
  "tags": {
    "existingTags": ["${generatedTags.join('", "')}"],
    "suggestedTags": {
      "primary": "#Area/Dev/Issues",
      "technical": ["#Area/Dev/specific"],
      "additional": ["#Category/Sub/Tag"]
    },
    "allTags": ["#Category/Sub/Tag"]  
  },
  "reasoning": {
    "technicalContext": "Analysis of the technical aspects",
    "languageChoice": "Explanation of language-specific tag choices",
    "tagSuggestionLogic": "Why these specific tags were chosen"
  }
}

Requirements:
- Each tag component should be 5 characters or less
- Technical content MUST have #Area/Dev/Issues AND specific technical context tags
- New tags should follow the pattern of existing tags when available
- Minimum 2 tags total
- Use appropriate language for non-technical terms based on user's language preference`;
}
