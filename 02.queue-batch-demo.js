const { ServiceBusClient } = require("@azure/service-bus");

import('chalk').then(chalk => {

    console.log(chalk.default.bgBlue.white.bold(`Connection string:`) + `${process.env.CONN_STRING}`);
    console.log(chalk.default.bgBlue.white.bold(`Queue name: ${process.env.QUEUE_NAME}`));


    const messages = [        
        { body: "Superman is Clark Kent" },
        { body: "Arrow is Oliver Queen" },
        { body: "Flash is Barry Allen" },
        { body: "Catwoman is Selina Kyle" }
    ];

    async function main() {

        const sbClient = new ServiceBusClient(process.env.CONN_STRING);
        const sender = sbClient.createSender(process.env.QUEUE_NAME);


        try {


            // Create a batch object
            let batch = await sender.createMessageBatch();

            for (let i = 0; i < messages.length; i++) {

                console.log(chalk.default.bgBlue.white.bold(`Sending message: ${messages[i].body}`));

                //try to add the message to the batch
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

            // Send the last created batch of messages to the queue
            await sender.sendMessages(batch);

            console.log(chalk.default.bgGreenBright.white(`Sent a batch of messages to the queue: ${process.env.QUEUE_NAME}`));

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
});

