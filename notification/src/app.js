import "dotenv/config";
import express from "express";
import morgan from "morgan";
import sendEmail from "./service/email.service.js";
import channel from "./config/mq.js";

const app = express();

app.use(morgan("dev"));

app.get("/api/mail/healthz", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.get("/api/mail/readyz", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

channel.consume("auth_notification_queue", async (msg) => {
  if (msg !== null) {
    const messageContent = msg.content.toString();

    console.log("Received message from queue", messageContent);

    try {
      const { userId, timestamp, email } = JSON.parse(messageContent);

      const subject = "New Login Notification";
      const text = `A new login was detected for your account at ${timestamp}. If this was not you, please secure your account immediately.`;
      const html = `<p>A new login was detected for your account at <strong>${timestamp}</strong>. If this was not you, please secure your account immediately.</p>`;

      await sendEmail(email, subject, text, html);

      channel.ack(msg);
    } catch (error) {
      throw error;
    }
  } else {
    console.log("Received null message");
  }
});

export default app;
