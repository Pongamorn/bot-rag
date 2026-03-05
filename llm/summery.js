import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export async function call(intent) {
  // สมมติเรียก MCP แล้วได้ data
  const data = intent.data ?? {};

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "สรุปข้อมูลให้กระชับ เป็นภาษาไทย",
      },
      {
        role: "user",
        content: JSON.stringify(data),
      },
    ],
  });

  return completion.choices[0].message.content;
}
