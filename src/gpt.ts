import { Configuration, OpenAIApi } from "openai";
import { Input, generatePromptMessages } from "./prompts";

const temperature = 0.2;
const maxTokens = 1144;
const model = "gpt-3.5-turbo";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function query(input: Input): Promise<Advice> {
  const messages = await generatePromptMessages(input);

  const completion = await openai.createChatCompletion({
    model,
    messages,
    max_tokens: maxTokens,
    temperature,
  });

  const choice = completion?.data?.choices?.[0]?.message?.content;

  if (!choice) {
    throw new Error("No choices found");
  }

  console.log("Choice", choice);

  return JSON.parse(
    choice
      .replace("```json", "")
      .replace("```", "")
      .replace("•", "-")
      .replace("•", "-")
  );
}

export type Advice = {
  Title: string;
  ShortDescription: string;
  IncidentType: string;
  TimeSensitiveInformation: string;
};
