import express from "express";
import axios from "axios";
import reportBot from "../models/reportBot.js";

const botReportRoute = express.Router();

botReportRoute.get("/all", async (req, res) => {
  try {
    const reports = await reportBot.findAll();
    res.json(reports);
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    res.status(500).send("Failed to fetch reports");
  }
});

botReportRoute.patch("/update-title", async (req, res) => {
  const { id, newTitle } = req.body;
  console.log(id, newTitle);

  if (!id || !newTitle) {
    return res.status(400).send("Missing id or newTitle in request body");
  }
  try {
    const reports = await reportBot.update(
      { topic: newTitle },
      {
        where: {
          id: id,
        },
      },
    );

    if (reports[0] === 0) {
      return res.status(404).send("Report not found");
    }

    res.json(reports);
  } catch (error) {
    console.error("Failed to update report:", error);
    res.status(500).send("Failed to update report");
  }
});

export default botReportRoute;
