import { Input, generatePromptMessages } from "@/app/prompts";
import { Configuration, OpenAIApi } from "openai";

const temperature = 0.7;
const maxTokens = 1144;
const model = "gpt-3.5-turbo";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: Request): Promise<Response> {
  const input: Partial<Input> = await req.json();
  const messages = await generatePromptMessages(input);

  const completion = await openai.createChatCompletion({
    model,
    messages,
    max_tokens: maxTokens,
    temperature,
  });
  console.log(completion.data);

  const choice = completion?.data?.choices?.[0]?.message?.content;

  if (!choice) {
    throw new Error("No choices");
  }

  return new Response(choice);
}

export type Advice = {
  Title: string;
  ShortDescription: string;
  IncidentType: string;
  TimeSensitiveInformation: string;
};
