import { ServiceBusClient, delay } from "@azure/service-bus";
import boxen from 'boxen';
import chalk from "chalk";

const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'green',
    backgroundColor: '#555555'
};

import dotenv from 'dotenv';
dotenv.config();


const greeting = chalk.yellow('Azure Service Bus Queue Demo: Received messages to a queue');

console.log(boxen(greeting, boxenOptions));

console.log(`Connection string 🤫:` + `${process.env.CONN_STRING}`);
console.log(`Queue name 📪: ${process.env.QUEUE_NAME}`);


async function main() {
    // create a Service Bus client using the connection string to the Service Bus namespace
    const sbClient = new ServiceBusClient(process.env.CONN_STRING);

    // createReceiver() can also be used to create a receiver for a subscription.
    const receiver = sbClient.createReceiver(process.env.QUEUE_NAME);

    // function to handle messages
    const myMessageHandler = async (messageReceived) => {
        console.log(`Received message 📥: ${messageReceived.body}`);
    };

    // function to handle any errors
    const myErrorHandler = async (error) => {
        console.log(error);
    };

    // subscribe and specify the message and error handlers
    receiver.subscribe({
        processMessage: myMessageHandler,
        processError: myErrorHandler
    });

    // Waiting long enough before closing the receiver to receive messages
    await delay(20000);

    await receiver.close();
    await sbClient.close();
}
// call the main function
main().catch((err) => {
    console.log("Error occurred: ", err);
    process.exit(1);
});