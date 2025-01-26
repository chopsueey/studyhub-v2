import { GoogleGenerativeAI } from "@google/generative-ai";
import type { QuillFormat } from "../models/Note";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

export async function promptAI(option: number, noteContent: QuillFormat[]) {
  const content = noteContent.map((item: QuillFormat) => item.insert).join("");

  const prompts = [
    `Summarize the following content:`,
    `Give me the most important keywords or technical terms of the following content with a short explanation:`,
    `Make a quiz that involves the most important concepts, ideas and aspects of the following content:`,
    `Make an advanced quiz that is not necessarily about the following content but related to it:`,
  ];

  const prompt = `${prompts[option]} \n\n" ${content} " ${
    option == 2 || option == 3
      ? `The quiz should be in a suitable JSON format, like this: "{
                "quizTitle": "A Quiz about Giraffes",
                "questions": [
                     {
                      "question": "Where do Giraffes live?",
                      "options": [
      "A: The Moon",
      "B: Africa",
      "C: The Northpole",
      "D: East-Asia"
    ],
    "answerText": "B: Africa",
    "answer": "B",
  }
    ]
    }`
      : ""
  }`;

  const result = await model.generateContent(prompt);

  let asText = result.response.text();

  if (option == 2 || option == 3) {
    asText = asText.replace(/^```json\s*/, "").replace(/```/, "");
  }

  return asText;
}

// ChatGPT
// const openai = new OpenAI();

// const completion = await openai.chat.completions.create({
//   model: "gpt-4o-mini",
//   messages: [
//       { role: "system", content: "You are a helpful assistant." },
//       {
//           role: "user",
//           content: `Summarize the following content:\n\n${content}`,
//       },
//   ],
// });

// const aiResponse = completion.choices[0].message || '';
//       console.log(aiResponse)
