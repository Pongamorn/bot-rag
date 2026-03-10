import fetch from "node-fetch";
import dotenv from "dotenv";
import { quickReplyItems } from "../quickReply/quickReply.js";
dotenv.config();

export async function reply(replyToken, message, isQuickReplyItems) {
  let replyMessage = {
    type: "text",
    text: message,
  };

  if (isQuickReplyItems) {
    replyMessage.quickReply = {
      items: quickReplyItems,
    };
  }

  try {
    const response = await fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        replyToken: replyToken,
        messages: [replyMessage],
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
