import express from "express";
import axios from "axios";

const userRouter = express.Router();

userRouter.get("/get-image", async (req, res) => {
  res.send("Get image route");
});

export default userRouter;
