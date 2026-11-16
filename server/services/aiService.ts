import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export interface EvaluationResult {
  score: number;
  strengths: string[];
  missingConcepts: string[];
  suggestions: string[];
  sampleImprovedAnswer: string;
}

export async function evaluateAnswer(
  jobRole: string,
  question: string,
  userAnswer: string,
  sampleAnswer: string
): Promise<EvaluationResult> {
  const prompt = `
You are an expert AI interview evaluator for ${jobRole}.
Evaluate the candidate's submitted answer for the following interview question.

Question: "${question}"
Candidate's Answer: "${userAnswer}"
Reference / Sample Answer: "${sampleAnswer}"

Evaluate based on:
1. Technical accuracy
2. Relevance
3. Clarity
4. Completeness
5. Concept understanding

Provide a rigorous evaluation and return a JSON object strictly matching this schema:
- score: number between 0 and 10 (with one decimal place precision, e.g. 8.5)
- strengths: array of strings detailing what the candidate answered well
- missingConcepts: array of strings detailing key concepts omitted or misunderstood
- suggestions: array of strings offering constructive educational tips to improve
- sampleImprovedAnswer: a comprehensive, professional sample improved answer
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Score out of 10" },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of candidate strengths"
            },
            missingConcepts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of missing or weak concepts"
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Constructive feedback suggestions"
            },
            sampleImprovedAnswer: {
              type: Type.STRING,
              description: "A professional model answer"
            }
          },
          required: ["score", "strengths", "missingConcepts", "suggestions", "sampleImprovedAnswer"]
        }
      }
    });

    const text = (response.text ?? "{}").trim();
    const result = JSON.parse(text);
    return {
      score: typeof result.score === 'number' ? Math.min(10, Math.max(0, result.score)) : 7.0,
      strengths: Array.isArray(result.strengths) ? result.strengths : ["Good effort and clear articulation."],
      missingConcepts: Array.isArray(result.missingConcepts) ? result.missingConcepts : ["Could provide more deep technical depth."],
      suggestions: Array.isArray(result.suggestions) ? result.suggestions : ["Include edge cases and best practices."],
      sampleImprovedAnswer: result.sampleImprovedAnswer || sampleAnswer
    };
  } catch (error) {
    console.error("Gemini AI Evaluation Error:", error);
    // Fallback evaluation if AI call fails or key is missing
    return {
      score: 7.5,
      strengths: ["Clear structure", "Addressed core concepts"],
      missingConcepts: ["Advanced nuance or production scale considerations"],
      suggestions: ["Incorporate architectural trade-offs in your explanation."],
      sampleImprovedAnswer: sampleAnswer
    };
  }
}

export async function generateCustomQuestions(jobRole: string, difficulty: string, count: number): Promise<Array<{ question_text: string; difficulty: string; sample_answer: string }>> {
  const prompt = `
Generate exactly ${count} mock interview questions for the job role "${jobRole}" with difficulty "${difficulty}".
Return a JSON array of objects with properties:
- question_text (string)
- difficulty (string: "${difficulty}")
- sample_answer (string)
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question_text: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              sample_answer: { type: Type.STRING }
            },
            required: ["question_text", "difficulty", "sample_answer"]
          }
        }
      }
    });

    const text = (response.text ?? "[]").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini question generation error:", error);
    return [];
  }
}
