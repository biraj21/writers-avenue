import dotenv from "dotenv";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

dotenv.config();

const model = new OpenAI({ temperature: 0.2 });

const template = `
Look at the text enclosed in triple backticks. Identify the  language, understand the text & translate it to American English.
You have to give me name of the original language & it's translation as a valid JSON & nothing else.
If for you are not able to translate, then don't make things up & just return translation as an empty string ("").
Look at the examples below for better understanding.

Example 1:-
  - Input: su kare?
  - Output: {{ "language":  "Gujarati", "translation": "what are you doing?" }}
Example 2:-
  - Input: uta aytha?
  - Output: {{ "language":  "Kannada", "translation": "had food?" }}
Example 3:-
  - Input: asdnjsagjff
  - Output: {{ "language": "Unknown", translation: "" }}

\`\`\`
{text}
\`\`\`
`.trim();
const prompt = new PromptTemplate({
  template,
  inputVariables: ["text"],
});

const chain = new LLMChain({ llm: model, prompt: prompt });

export default async function translate(text: string): Promise<{ language: string; translation: string }> {
  try {
    const res = await chain.call({ text });
    return JSON.parse(res.text.trim());
  } catch (err) {
    throw err;
  }
}
