import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getSalesSummary } from "../services/db.js";

const server = new Server(
  { name: "line-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler("tools/list", async () => {
  console.log("testsetste");

  return {
    tools: [
      {
        name: "get_sales_summary",
        description: "ดึงยอดขายสรุป",
        inputSchema: {
          type: "object",
          properties: {
            date: { type: "string" },
          },
          required: ["date"],
        },
      },
    ],
  };
});

server.setRequestHandler("tools/call", async (req) => {
  if (req.params.name === "get_sales_summary") {
    const data = await getSalesSummary(req.params.arguments);
    return {
      content: [{ type: "json", data }],
    };
  }
});

await server.connect(new StdioServerTransport());
