import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export async function reply(replyToken, message) {
  console.log("Replying with message:", message);

  try {
    const response = await fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        replyToken: replyToken,
        messages: [
          {
            type: "text",
            text: message,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("LINE API Error:", data);
    }

    return data;
  } catch (err) {
    console.error("Reply Error:", err);
  }
}
