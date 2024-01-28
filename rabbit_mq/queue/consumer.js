const amqplib = require("amqplib")

const amqbUrl = "amqp://guest:12345@localhost"

const receiveQueue = async () => {
    try{
        //1. create connect
        const conn = await amqplib.connect(amqbUrl);
        //2. create channel
        const channel = await conn.createChannel();
        //3. create queue name
        const nameQueue = 'q2'
        //4. create queue
        await channel.assertQueue(nameQueue, { 
            durable: true ///nghiên cứu sau
        })

        //5/ receive queue
        await channel.consume(nameQueue, msg => {
            console.log(`Msg:::${msg.content.toString()}`)
        }, {
            noAck: true
        })

        //6. close conn and channel

    }catch(error){
        console.error(`Error::: ${error}`)
    }
}

receiveQueue()