const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-5-20250929';
const MAX_TOKENS = 1024;

function getApiKey(): string {
  return import.meta.env.VITE_ANTHROPIC_API_KEY || '';
}

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  content: Array<{ type: string; text: string }>;
}

export async function callClaude(
  systemPrompt: string,
  userMessage: string,
  options?: { language?: string }
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }

  const finalSystem = options?.language === 'es'
    ? `${systemPrompt}\n\nRespond entirely in Spanish.`
    : systemPrompt;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: finalSystem,
      messages: [{ role: 'user', content: userMessage }] as ClaudeMessage[],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Claude API error: ${response.status} - ${errText}`);
  }

  const data: ClaudeResponse = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error('Empty response from Claude API');
  return text;
}

// FEATURE 1: Job Translator
export async function translateJobToPlainEnglish(
  jobDescription: string,
  language?: string
): Promise<string> {
  const system = `Rewrite this job posting in plain, clear language that a regular person can understand. Remove corporate jargon and HR speak. Answer these questions clearly: What will I actually do every day? What does this job actually pay? Do I really need the listed requirements or are some nice-to-haves? What are the hours really like? Keep it concise and honest.`;
  return callClaude(system, jobDescription, { language });
}

// FEATURE 2: Smart Match
export interface MatchResult {
  job_id: string;
  match_score: number;
  reason: string;
}

export async function getSmartMatches(
  profileData: string,
  jobsData: string,
  language?: string
): Promise<MatchResult[]> {
  const system = `You are a job matching assistant for a Toledo, Ohio job board. Based on this person's profile, rank the following jobs by fit. Return ONLY valid JSON, no markdown, no backticks. Return an array of objects with fields: job_id (string), match_score (number 1-100), reason (string, 1-2 sentences explaining why this is a good match). Include only jobs with match_score above 50. Maximum 10 results, sorted by match_score descending.`;

  const response = await callClaude(system, `PROFILE:\n${profileData}\n\nJOBS:\n${jobsData}`, { language });

  // Parse JSON - handle potential markdown wrapping
  let cleaned = response.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) throw new Error('Expected array response');
  return parsed as MatchResult[];
}

// FEATURE 3: Instant Apply Summary
export async function generateCandidateSummary(
  profileData: string,
  jobData: string,
  language?: string
): Promise<string> {
  const system = `Generate a brief, professional 3-4 sentence candidate summary for a job application. Make it sound human and natural, not robotic. Highlight the applicant's most relevant qualifications for this specific job. If they have a Skills Card with trade certifications, mention the most relevant ones. Return only the summary text, nothing else.`;
  return callClaude(system, `APPLICANT PROFILE:\n${profileData}\n\nJOB:\n${jobData}`, { language });
}

// FEATURE 4: Training Path Recommender
export async function getTrainingRecommendations(
  profileData: string,
  jobData: string,
  language?: string
): Promise<string> {
  const system = `A job seeker in Toledo, Ohio is interested in this job but may not meet all requirements. Based on the gap between their profile and the job requirements, suggest the shortest path to qualifying. Reference specific Toledo-area training programs when possible: The Mona K Project Green Trades Academy for solar, weatherization, and energy retrofit training; Owens Community College for skilled trades certificates; IBEW Local 8 for electrical apprenticeship; UA Local 50 for plumbing and pipefitting; OhioMeansJobs Lucas County for WIOA-funded training. Be specific, actionable, and encouraging. Keep it to 3-5 bullet points maximum.`;
  return callClaude(system, `JOB SEEKER PROFILE:\n${profileData}\n\nJOB THEY'RE INTERESTED IN:\n${jobData}`, { language });
}
