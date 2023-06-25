import { Configuration, OpenAIApi } from "openai";
import { Input, generatePromptMessages } from "./prompts";

const temperature = 0.7;
const maxTokens = 1144;
const model = "gpt-3.5-turbo";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function query(input: Partial<Input>): Promise<Advice> {
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
    throw new Error("No choices found");
  }

  return JSON.parse(choice.replace("```json", "").replace("```", ""));
}

export type Advice = {
  Title: string;
  ShortDescription: string;
  IncidentType: string;
  TimeSensitiveInformation: string;
};
