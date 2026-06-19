import amqplib from "amqplib";

const QUEUE = 'auth_notification_queue';

const connection = await amqplib.connect(process.env.RABBITMQ_URL);

connection.on('error', (err) => {
  console.error("AMQP connection error:", err.message);

  err.message = "Error while establishing connection with AMQP";

  throw err;
});

const channel = await connection.createChannel();

channel.on('error', (err) => {
  err.message = "Error while creating a channel";

  throw err;
});

channel.assertQueue(QUEUE, { durable: true });

export default channel;