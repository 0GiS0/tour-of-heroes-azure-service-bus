const { delay, ServiceBusClient, ServiceBusMessage } = require("@azure/service-bus");

async function main() {
    // create a Service Bus client using the connection string to the Service Bus namespace
    const sbClient = new ServiceBusClient(process.env.CONN_STRING);

    // createReceiver() can also be used to create a receiver for a subscription.
    const receiver = sbClient.createReceiver(process.env.QUEUE_NAME);

    // function to handle messages
    const myMessageHandler = async (messageReceived) => {
        console.log(`Received message: ${messageReceived.body}`);
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