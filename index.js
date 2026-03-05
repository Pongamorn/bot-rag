import express from "express";
import bodyParser from "body-parser";
import { checkPermission } from "./guard/guard.js";
import { parseIntent } from "./llm/intent.js";
import { reply } from "./util/reply.js";
import sequelize from "./config/db.js";
import data_report from "./models/DataReport.js";

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

let topic = "";

const sessions = {};
app.post("/webhook", async (req, res) => {
  const event = req.body.events?.[0];
  if (!event || event.type !== "message") {
    return res.sendStatus(200);
  }

  const text = event.message.text;
  const groupId = event.source.groupId;
  const userId = event.source.userId;

  // 1. Command Guard
  // const allowed = await checkPermission(groupId, userId);
  // if (!allowed) {
  //   return res.sendStatus(200);
  // }
  // if (groupId === "Cea304ea2f60c5dda2e123dd62e00a10e") {
  //   console.log("Received message:", { text, groupId, userId });
  // }
  console.log(groupId, userId);

  if (!sessions[userId]) {
    sessions[userId] = { waitingIntent: false, step: "waiting_topic" };
  }

  console.log("session", sessions);

  if (text === "น้องเต่า" && sessions[userId].waitingIntent) {
    await reply(
      event.replyToken,
      `น้องเต่ากำลังรอคำสั่งอยู่ ${sessions[userId].step === "waiting_topic" ? "กรุณาระบุหัวข้อ" : "กรุณาระบุรายละเอียดเพิ่มเติม"}`,
    );
    return res.sendStatus(200);
  }

  // ถ้า user เรียกน้องเต่า
  if (text === "น้องเต่า") {
    sessions[userId].waitingIntent = true;
    await reply(event.replyToken, "น้องเต่าพร้อมรับคำสั่ง");
    return res.sendStatus(200);
  }
  console.log("session2", sessions);

  // ถ้ารอคำสั่งอยู่ step: "waiting_topic"
  if (
    sessions[userId].waitingIntent &&
    sessions[userId].step === "waiting_topic"
  ) {
    const intent = await parseIntent(text);
    console.log("test", intent);

    if (intent?.cancel) {
      sessions[userId].waitingIntent = false;
      sessions[userId].step = "waiting_topic";
      await reply(event.replyToken, "ยกเลิกการสั่งงานเรียบร้อย");
      return res.sendStatus(200);
    }

    if (intent?.response_again) {
      await reply(event.replyToken, intent.intent);
      return res.sendStatus(200);
    }
    sessions[userId].step = "waiting_comment";
    await reply(
      event.replyToken,
      `น้องเต่ารับเรื่อง"${intent.intent}"แล้ว!
รบกวนระบุรายละเอียดเพิ่มเติมครับ`,
    );
    topic = intent.intent;
    return res.sendStatus(200);
  } else if (
    sessions[userId].waitingIntent &&
    sessions[userId].step === "waiting_comment"
  ) {
    const intent = await parseIntent(text);
    if (intent?.cancel) {
      sessions[userId].waitingIntent = false;
      sessions[userId].step = "waiting_topic";
      await reply(event.replyToken, "ยกเลิกการสั่งงานเรียบร้อย");
      return res.sendStatus(200);
    }

    const comment = text;
    try {
      await data_report.create({
        topic,
        comment,
        user_id: userId,
        group_id: groupId,
      });
      sessions[userId].waitingIntent = false;
      sessions[userId].step = "waiting_topic";
      await reply(event.replyToken, `น้องเต่าบันทึกเรื่องเรียบร้อยแล้ว!`);
      return res.sendStatus(200);
    } catch (error) {
      console.error("Failed to save report:", error);
      await reply(
        event.replyToken,
        `น้องเต่าพบปัญหาในการบันทึกข้อมูลครับ ลองใหม่อีกครั้งนะครับ`,
      );
      return res.sendStatus(200);
    }
  } else {
    return res.sendStatus(200);
  }
});

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log("Database connected");
    await sequelize.sync(); // ใช้ตอน dev

    app.listen(3000, () => {
      console.log("Server is running on port 3000 +++++=");
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

startServer();
