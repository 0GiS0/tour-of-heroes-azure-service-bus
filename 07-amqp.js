// https://www.returngis.net/2022/02/usar-una-libreria-para-amqp-con-azure-service-bus/
import rhea from 'rhea';
import dotenv from 'dotenv';
dotenv.config();

const options = {
    host: process.env.AMQP_HOST,
    hostname: process.env.AMQP_HOST,
    port: process.env.AMQP_PORT,
    username: process.env.AMQP_USER,
    password: process.env.AMQP_PASSWORD,
    transport: 'tls',
    reconnect_limit: 100,
    reconnect: true
};

const connection = rhea.connect(options);

connection.once('connection_close', () => console.log('connection_close 🔒'));
connection.once('disconnected', () => console.log('disconnected ☎️'));

connection.once('connection_open', async function (e) {

    console.log('connection_open 📞');
    const session = connection.create_session();

    // session events
    session.once('session_open', () => console.log('session opened 📞'));
    session.once('session_close', () => console.log('session closed 🔒'));
    session.begin();

    // Queue
    // const receiver = session.attach_receiver(process.env.QUEUE_NAME, { });

    // Topic
    const sender = session.attach_sender(process.env.TOPIC_NAME, {});

    // sender events
    sender.once('sendable', () => console.log('sender opened 🤲🏻'));
    sender.once('sender_close', () => console.log('sender closed 🔒'));
    sender.on('accepted', () => console.log('message accepted ✅'));
    sender.on('released', () => console.log('message released 𝌚'));
    sender.on('rejected', () => console.log('message rejected 🙅🏼‍♀️'));
    sender.on('modified', () => console.log('message modified 𝌡'));

    // Send a message with application properties    
    sender.send({
        body: Buffer.from(JSON.stringify({
            name: "Batman",
            quote: "I'm Batman!",
            random_value: Math.random()
        })),
        application_properties: { "city": "gotham" } // for Topic filters
    });

    console.log('Message sent 📨');

});