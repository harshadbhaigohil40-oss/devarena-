const { getModel, isAvailable } = require('../config/gemini');

// Mock responses for when Gemini is unavailable
const MOCK_RESPONSES = {
  career: `Based on your profile, here are my recommendations:

**Career Path Suggestion:** Full-Stack Developer → Senior Developer → Tech Lead

**Key Skills to Focus On:**
1. **System Design** — Essential for senior roles
2. **Cloud Architecture** — AWS/GCP certification boosts salary 20-30%
3. **Leadership** — Start mentoring juniors now

**Salary Expectations (India):**
- Mid-level: ₹12-20 LPA
- Senior: ₹25-45 LPA
- Lead: ₹40-70 LPA

**Action Items:**
- Complete 5 system design challenges this month
- Build a production-grade project using microservices
- Contribute to 2+ open-source projects

*This is a sample response. Configure your Gemini API key for personalized AI guidance.*`,

  skill: `Based on your current progress, here are recommended skills:

1. **TypeScript** — Industry standard, essential for large codebases
2. **Docker & Kubernetes** — DevOps skills are high-demand
3. **GraphQL** — Modern API design
4. **Redis** — Caching & real-time features
5. **Testing (Jest/Cypress)** — Quality assurance is non-negotiable

*Configure your Gemini API key for personalized recommendations.*`,

  review: `Here's a general code review:

✅ **Good practices noticed:**
- Clean function naming
- Proper error handling

⚠️ **Suggestions:**
- Add input validation
- Consider edge cases
- Add JSDoc comments
- Extract magic numbers into constants

*Configure your Gemini API key for AI-powered code reviews.*`,

  resume: `{"score": 75, "missingKeywords": ["Docker", "Kubernetes", "AWS"], "suggestions": ["Add metrics to your bullet points (e.g. 'improved performance by 20%')", "Highlight your open-source contributions more clearly."], "summary": "Strong foundational React skills, but lacking cloud deployment experience."}`,
  roadmap: `{"title": "Full-Stack Senior Engineer", "estimatedMonths": 6, "phases": [{"name": "Advanced React & Architecture", "description": "Mastering Micro-frontends and state management.", "topics": ["Zustand", "Module Federation", "SSR"]}, {"name": "Backend Scaling", "description": "Building high throughput systems.", "topics": ["Redis Caching", "Message Queues", "Kubernetes"]}]}`
};

const getCareerAdvice = async (userProfile, question) => {
  if (!isAvailable()) {
    return MOCK_RESPONSES.career;
  }

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

Provide detailed, actionable career advice. Include specific recommendations, salary insights, and learning roadmap. Format using markdown.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return MOCK_RESPONSES.career;
  }
};

const getSkillRecommendation = async (userProfile) => {
  if (!isAvailable()) {
    return MOCK_RESPONSES.skill;
  }

  try {
    const model = getModel();
    const prompt = `You are a technical skills advisor for developers.

User Profile:
- Level: ${userProfile.level}
- Current Skills: ${userProfile.topSkills?.map(s => `${s.name} (Level ${s.level})`).join(', ') || 'Beginner'}
- Challenges Solved: ${userProfile.challengesSolved || 0}

Recommend 5 skills they should learn next, with explanation of why each is valuable and how to start learning. Format using markdown.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return MOCK_RESPONSES.skill;
  }
};

const getCodeReview = async (code, language) => {
  if (!isAvailable()) {
    return MOCK_RESPONSES.review;
  }

  try {
    const model = getModel();
    const prompt = `You are an expert code reviewer. Review the following ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. Overall quality score (1-10)
2. Good practices noticed
3. Issues found (bugs, performance, security)
4. Suggestions for improvement
5. Refactored version if applicable

Format using markdown.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return MOCK_RESPONSES.review;
  }
};

const analyzeResume = async (resumeText, jobDescription = "") => {
  if (!isAvailable()) {
    return JSON.parse(MOCK_RESPONSES.resume);
  }

  try {
    const model = getModel();
    const prompt = `You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
Analyze the following resume text against industry standards for a Software Engineer role.
${jobDescription ? `Specifically tailor your analysis to this job description: ${jobDescription}` : ''}

Resume Text:
${resumeText}

Provide your analysis STRICTLY in the following JSON format, do not use markdown blocks around the JSON:
{
  "score": <number 0-100 representing ATS match>,
  "missingKeywords": [<array of 3-5 important technical keywords missing from the resume>],
  "suggestions": [<array of 3-5 actionable bullet points to improve the resume>],
  "summary": "<1-2 sentence overall impression>"
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
    return JSON.parse(MOCK_RESPONSES.resume);
  }
};

const generateRoadmap = async (currentSkills, targetRole) => {
  if (!isAvailable()) {
    return JSON.parse(MOCK_RESPONSES.roadmap);
  }

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
    return JSON.parse(MOCK_RESPONSES.roadmap);
  }
};

const generalChat = async (prompt) => {
  if (!isAvailable()) {
    return "Hi there! I am DevArena AI. Configure your Gemini API key to chat with me!";
  }

  try {
    const model = getModel();
    const systemPrompt = `You are DevArena AI, a helpful, encouraging, and highly skilled software engineering assistant. You guide users on the DevArena platform to level up their coding skills. Answer concisely and use markdown formatting.\n\nUser says: ${prompt}`;

    const result = await model.generateContent(systemPrompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return "Oops, I'm experiencing some network interference. Try again later.";
  }
};

module.exports = { getCareerAdvice, getSkillRecommendation, getCodeReview, analyzeResume, generateRoadmap, generalChat };
