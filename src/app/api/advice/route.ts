import { Configuration, OpenAIApi } from "openai";

import { Input, generatePromptMessages } from "./prompt/route";

const temperature = 0.7;
const maxTokens = 1144;
const model =  "gpt-3.5-turbo";

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

  return new Response(JSON.stringify(completion.data, null, 2));
}
