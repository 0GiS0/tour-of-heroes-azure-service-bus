const { ServiceBusClient } = require("@azure/service-bus");

import('chalk').then(chalk => {

    console.log(chalk.default.bgBlue.white.bold(`Connection string:`) + `${process.env.CONN_STRING}`);
    console.log(chalk.default.bgBlue.white.bold(`Queue name: ${process.env.QUEUE_NAME}`));    

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