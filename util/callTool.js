import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export async function callTool(intent) {
  const toolHandlers = intent.tool.split(".").map((tool) => tool.trim())[1];
  console.log(toolHandlers);

  let data;

  switch (toolHandlers) {
    case "get_sales_summary":
      data = await get_sales_summary(intent.params);
      break;

    case "greeting":
      data = { message: intent.params.message };
      break;

    default:
      return "ไม่รองรับคำสั่งนี้";
  }
  return data;
}

function get_sales_summary(params) {
  // จำลองการดึงข้อมูลยอดขายจากฐานข้อมูล
  const summaries = {
    today: {
      date: "2026-02-15",
      total_sales: 185420,
      total_orders: 48,
      average_order_value: 3862,
      top_products: [
        { name: "Beger Shield Nano", qty: 120, amount: 72000 },
        { name: "Beger Cool All Plus", qty: 85, amount: 51000 },
        { name: "Beger Primer Pro", qty: 60, amount: 32420 },
      ],
      payment_methods: {
        cash: 65420,
        transfer: 80000,
        credit_card: 40000,
      },
    },
    yesterday: "ยอดขายเมื่อวาน: 80,000 บาท",
    "2024-02-01": "ยอดขายวันที่ 1 กุมภาพันธ์ 2024: 90,000 บาท",
  };

  return summarizeSales(params.date);
}

export async function summarizeSales(data) {
  console.log(data);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
คุณเป็นนักวิเคราะห์ยอดขาย
สรุปจากข้อมูลที่ให้เป็นภาษาไทยแบบกระชับ อ่านง่ายสำหรับ LINE

`,
      },
      {
        role: "user",
        content: JSON.stringify({
          date: "2026-02-15",
          total_sales: 185420,
          total_orders: 48,
          average_order_value: 3862,
          top_products: [
            { name: "Beger Shield Nano", qty: 120, amount: 72000 },
            { name: "Beger Cool All Plus", qty: 85, amount: 51000 },
            { name: "Beger Primer Pro", qty: 60, amount: 32420 },
          ],
          payment_methods: {
            cash: 65420,
            transfer: 80000,
            credit_card: 40000,
          },
        }),
      },
    ],
    temperature: 0.2,
  });

  console.log();

  return completion.choices[0].message.content;
}
