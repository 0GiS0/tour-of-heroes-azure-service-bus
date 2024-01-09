import { ServiceBusClient } from "@azure/service-bus";
import boxen from 'boxen';
import chalk from "chalk";

const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'green',
    backgroundColor: '#555555'
};

const greeting = chalk.yellow('Azure Service Bus Topic Demo: Send messages to a topic');

console.log(boxen(greeting, boxenOptions));

console.log(`Connection string 🤫:` + `${process.env.CONN_STRING}`);
console.log(`Topic name 📪: ${process.env.TOPIC_NAME}`);

const messages = [
    { body: "Superman is Clark Kent" },
    { body: "Arrow is Oliver Queen" },
    { body: "Flash is Barry Allen" },
    { body: "Catwoman is Selina Kyle", applicationProperties: { city: "gotham" } },
    { body: "Bruce Wayne is Batman", applicationProperties: { city: "gotham" } }
];

async function main() {
    // create a Service Bus client using the connection string to the Service Bus namespace
    const sbClient = new ServiceBusClient(process.env.CONN_STRING);

    // createSender() can also be used to create a sender for a queue.
    const sender = sbClient.createSender(process.env.TOPIC_NAME);

    try {
        // Tries to send all messages in a single batch.
        // Will fail if the messages cannot fit in a batch.
        // await sender.sendMessages(messages);

        // create a batch object
        let batch = await sender.createMessageBatch();
        for (let i = 0; i < messages.length; i++) {
            // for each message in the array

            console.log(`Trying to add message to the batch: ${JSON.stringify(messages[i])}`);
            // try to add the message to the batch
            if (!batch.tryAddMessage(messages[i])) {
                // if it fails to add the message to the current batch
                // send the current batch as it is full
                await sender.sendMessages(batch);

                // then, create a new batch
                batch = await sender.createMessageBatch();

                // now, add the message failed to be added to the previous batch to this batch
                if (!batch.tryAddMessage(messages[i])) {
                    // if it still can't be added to the batch, the message is probably too big to fit in a batch
                    throw new Error("Message too big to fit in a batch");
                }
            }
        }

        // Send the last created batch of messages to the topic
        await sender.sendMessages(batch);

        console.log(`Sent a batch of messages to the topic 💌: ${process.env.TOPIC_NAME}`);

        // Close the sender
        await sender.close();
    } finally {
        await sbClient.close();
    }
}

// call the main function
main().catch((err) => {
    console.log("Error occurred: ", err);
    process.exit(1);
});