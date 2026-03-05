import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function parseIntent(text) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `คุณคือ intent parser สำหรับระบบสแกน QRCode + Bill เพื่อรับเงิน

หน้าที่ของคุณคือ:
- ถ้าผู้ใช้แจ้งว่า QRCode สแกนไม่ติด และมีคำว่า QR / QRCode / คิวอาร์ → {"intent":"qrcode สแกนไม่ติด","response_again":false, "cancel": false}
- ถ้าผู้ใช้แจ้งว่า ลงทะเบียนไม่ได้ → {"intent":"ลงทะเบียนไม่ได้","response_again":false, "cancel": false}
- ถ้าผู้ใช้แจ้งว่า QRCode ซ้ำ และมีคำว่า QR / QRCode / คิวอาร์ → {"intent":"qrcode ซ้ำ","response_again":false, "cancel": false}
- ถ้าผู้ใช้แจ้งว่า QRCode เสีย,ไม่ดี,พัง,ขาด และมีคำว่า QR / QRCode / คิวอาร์ → {"intent":"qrcode เสีย","response_again":false, "cancel": false}
- ถ้าผู้ใช้แจ้งว่า QRCode ไม่มีข้อมูล และมีคำว่า QR / QRCode / คิวอาร์ → {"intent":"qrcode ไม่มีข้อมูล","response_again":false, "cancel": false}
- ถ้าผู้ใช้แจ้งว่าสแกนบิลไม่ได้เพราะมีการเขียนบนบิล → {"intent":"สแกนบิลไม่ได้(บิลมีการเขียน)","response_again":false, "cancel": false}
- ถ้าผู้ใช้สอบถามสถานะคำร้องหรือรอการอนุมัติ → {"intent":"รอการอนุมัติคำร้อง","response_again":false, "cancel": false}
- ถ้าผู้ใช้แจ้งว่าเงินไม่เข้า → {"intent":"เงินไม่เข้า","response_again":false , "cancel": false}
- ถ้าผู้ใช้แจ้งว่า สแกน qr code แล้วบอกว่าไม่ร่วมโปรโมชั่น / สแกนสินค้า แล้วบอกว่าไม่ร่วมโปรโมชั่น → {"intent":"สินค้าไม่ร่วมโปรโมชั่น","response_again":false, "cancel": false}
- ถ้าผู้ใช้แจ้งว่า สแกน qr code แล้วบอกว่าสินค้าเกินระยะเวลาโปรโมชั่น / สแกนสินค้า แล้วบอกว่าสินค้าเกินระยะเวลาโปรโมชั่น → {"intent":"สินค้าเกินระยะเวลาโปรโมชั่น","response_again":false, "cancel": false}
- ถ้าผู้ใช้แจ้งว่า สแกน qr code แล้วบอกว่าสินค้าเคยถูกส่งมาแล้ว / สแกนสินค้า แล้วบอกว่าสินค้าเคยถูกส่งมาแล้ว /สินค้าถูกส่งมาแล้ว → {"intent":"สินค้าเคยถูกส่งมาแล้ว","response_again":false, "cancel": false}
- ถ้าผู้ใช้แจ้งว่า กล้องเปิดไม่ได้/กล้องเป็นสีดำ/กล้องเปิดไม่ติด → {"intent":"กล้องเปิดไม่ได้","response_again":false, "cancel": false}
- ถ้าผู้ใช้แจ้งว่า application ของลูกค้าขึ้นว่าไม่อนุมัติ/ไม่อนุมัติ/คำร้องไม่อนุมัติ → {"intent":"ไม่อนุมัติ","response_again":false, "cancel": false}

- ถ้าไม่เกี่ยวข้องกับระบบ ให้ตอบกลับเป็นข้อความปกติตามบริบทของผู้ใช้ {"intent": "ผมไม่เข้าใจคำสั่งของคุณ","response_again":true , "cancel": false}
- ถ้าผู้ใช้แจ้งว่า "ยกเลิก" หรือ "ไม่เอาแล้ว" ให้ตอบกลับว่า {"intent": "ยกเลิกการสั่งงาน","response_again":false, "cancel": true}
ห้ามอธิบายเพิ่มเติม
ห้ามใส่ markdown`,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });
  console.log(completion.choices[0].message.content);
  try {
    const raw = JSON.parse(completion.choices[0].message.content?.trim());
    console.log("openai", raw);

    return raw;
  } catch (err) {
    console.error("Intent parse failed:", err);
    return {
      intent: "ผมไม่เข้าใจคำสั่งของคุณ",
      response_again: false,
      cancel: true,
    };
  }
}
