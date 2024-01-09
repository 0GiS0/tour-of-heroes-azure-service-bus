import { ServiceBusClient } from "@azure/service-bus";
import boxen from 'boxen';
import chalk from "chalk";
import dotenv from 'dotenv';
dotenv.config();


const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'green',
    backgroundColor: '#555555'
};

const greeting = chalk.yellow('Azure Service Bus Queue Demo: Send a single message to a queue');

console.log(boxen(greeting, boxenOptions));

console.log(`Connection string 🤫:` + `${process.env.CONN_STRING}`);
console.log(`Queue name 📪: ${process.env.QUEUE_NAME}`);

async function main() {

    const sbClient = new ServiceBusClient(process.env.CONN_STRING);
    const sender = sbClient.createSender(process.env.QUEUE_NAME);


    try {

        // Messages, payloads and serializations: https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messages-payloads
        // ServiceBusMessage properties: https://learn.microsoft.com/en-us/javascript/api/@azure/service-bus/servicebusmessage?view=azure-node-latest        
        // {
        //     body: this.body,
        //     contentType: this.contentType,
        //     correlationId: this.correlationId,
        //     subject: this.subject,
        //     messageId: this.messageId,
        //     partitionKey: this.partitionKey,
        //     replyTo: this.replyTo,
        //     replyToSessionId: this.replyToSessionId,
        //     scheduledEnqueueTimeUtc: this.scheduledEnqueueTimeUtc,
        //     sessionId: this.sessionId,
        //     timeToLive: this.timeToLive,
        //     to: this.to,
        //     applicationProperties: this.applicationProperties,
        // }

        // Send a single message
        await sender.sendMessages({
            contentType: "application/json",
            body: "Hello World",
            subject: "My favorite hero",
            body: "Batman is Bruce Wayne",
            timeToLive: 2 * 60 * 1000 // expires in 2 minutes
        });

        console.log(chalk.bgBlue.white.bold(`Sent a single message to the queue 💌: ${process.env.QUEUE_NAME}`));

        // Close the sender
        await sender.close();

    } finally {
        await sbClient.close();

    }
}

// call the main function
main().catch((err) => {
    console.log(chalk.bgRed.white.bold(`Error occurred: ${err}`));
    process.exit(1);
});

