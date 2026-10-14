const { getModel } = require('../config/gemini');

const getCareerAdvice = async (userProfile, question) => {
  try {
    const model = getModel();
    const prompt = `You are an expert career advisor for software developers. 
    
User Profile:
- Level: ${userProfile.level}
- XP: ${userProfile.xp}
- Top Skills: ${userProfile.topSkills?.map(s => s.name).join(', ') || 'Not specified'}
- Challenges Solved: ${userProfile.challengesSolved || 0}
- Current Streak: ${userProfile.streak || 0} days

User Question: ${question}

Provide detailed, actionable career advice tailored to their exact level and skills. Include:
1. A realistic, immediate career next step.
2. Salary insights for their market.
3. 3 highly specific technical areas they MUST master.
4. A clear short-term goal to achieve on the platform (e.g., reaching the next level, earning a specific badge).
Use an encouraging, professional tone. Format beautifully using markdown headers, bullet points, and bold text.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error.message);
    throw new Error('Failed to generate career advice. Please try again later.');
  }
};

const getSkillRecommendation = async (userProfile) => {
  try {
    const model = getModel();
    const prompt = `You are a technical skills advisor for developers.

User Profile:
- Level: ${userProfile.level}
- Current Skills: ${userProfile.topSkills?.map(s => `${s.name} (Level ${s.level})`).join(', ') || 'Beginner'}
- Challenges Solved: ${userProfile.challengesSolved || 0}

Recommend 5 specific skills or technologies they should learn next. For each skill provide:
1. **Why it's valuable**: The industry demand and relevance to their current stack.
2. **How to start**: A concrete project idea or platform challenge they can build to practice it.
Format the output using clear markdown with emojis to make it engaging and readable.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error.message);
    throw new Error('Failed to generate skill recommendations. Please try again later.');
  }
};

const getCodeReview = async (code, language) => {
  try {
    const model = getModel();
    const prompt = `You are an expert code reviewer. Review the following ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide a comprehensive and rigorous review:
1. **Overall Quality Score** (1-10) with a one-sentence summary.
2. **Security & Performance**: Identify any vulnerabilities, memory leaks, or Big-O inefficiencies.
3. **Good Practices**: Highlight exactly what they did right.
4. **Actionable Improvements**: Suggest refactoring for clean code, DRY principles, and modern syntax.
5. **Refactored Version**: Provide a polished, refactored version of the most critical section.
Format using clean markdown.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error.message);
    throw new Error('Failed to generate code review. Please try again later.');
  }
};

const analyzeResume = async (resumeContent, jobDescription = "") => {
  try {
    const model = getModel();
    const promptText = `You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
Analyze the provided resume against industry standards for a Software Engineer role.
${jobDescription ? `Specifically tailor your analysis to this job description: ${jobDescription}` : ''}

IMPORTANT: If the provided document or image does NOT appear to be a resume (e.g., it is source code, a blank page, or a random picture), you MUST still output valid JSON. Set the score to 0, and in the summary explain that the document is not a valid resume.

Provide your analysis STRICTLY in the following JSON format, do not use markdown blocks around the JSON:
{
  "score": <number 0-100 representing ATS match>,
  "missingKeywords": [<array of 3-5 important technical keywords missing from the resume>],
  "suggestions": [<array of 3-5 actionable bullet points to improve the resume>],
  "summary": "<1-2 sentence overall impression>"
}`;

    const promptParts = [promptText];
    if (typeof resumeContent === 'string') {
      promptParts.push(`\nResume Text:\n${resumeContent}`);
    } else {
      promptParts.push(resumeContent);
    }

    const result = await model.generateContent(promptParts);
    const text = result.response.text();
    
    // Extract JSON block using regex to ignore conversational prefixes/suffixes
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in Gemini response");
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Gemini API error:', error.message);
    throw new Error('Failed to analyze resume. Please try again later.');
  }
};

const generateRoadmap = async (currentSkills, targetRole) => {
  try {
    const model = getModel();
    const prompt = `You are a Senior Career Mentor for developers.
Generate a structured learning roadmap for a developer wanting to become a ${targetRole}.
Their current skills: ${currentSkills.join(', ')}.

Provide your roadmap STRICTLY in the following JSON format, do not use markdown blocks:
{
  "title": "Roadmap to ${targetRole}",
  "estimatedMonths": <number>,
  "phases": [
    {
      "name": "<Phase Title>",
      "description": "<Brief phase description>",
      "topics": ["<Topic 1>", "<Topic 2>", "<Topic 3>"]
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON block using regex to ignore conversational prefixes/suffixes
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in Gemini response");
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Gemini API error:', error.message);
    throw new Error('Failed to generate roadmap. Please try again later.');
  }
};

const generalChat = async (prompt) => {
  try {
    const model = getModel();
    const systemPrompt = `You are DevArena AI, a helpful, encouraging, and highly skilled software engineering assistant. You guide users on the DevArena platform to level up their coding skills. Answer concisely and use markdown formatting.\n\nHere is the recent conversation transcript:\n${prompt}\n\nPlease provide the next response as the AI assistant.`;

    const result = await model.generateContent(systemPrompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error.message);
    throw new Error('Failed to respond. Please try again later.');
  }
};

module.exports = { getCareerAdvice, getSkillRecommendation, getCodeReview, analyzeResume, generateRoadmap, generalChat };
