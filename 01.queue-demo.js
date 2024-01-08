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

const greeting = chalk.yellow('Azure Service Bus Queue Demo: Send a single message to a queue');

console.log(boxen(greeting, boxenOptions));

console.log(`Connection string 🤫:` + `${process.env.CONN_STRING}`);
console.log(`Queue name 📪: ${process.env.QUEUE_NAME}`);

async function main() {

    const sbClient = new ServiceBusClient(process.env.CONN_STRING);
    const sender = sbClient.createSender(process.env.QUEUE_NAME);


    try {

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
    console.log(chalk.default.bgRed.white.bold(`Error occurred: ${err}`));
    process.exit(1);
});

