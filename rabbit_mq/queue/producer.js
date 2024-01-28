const amqplib = require("amqplib")

const amqbUrl = "amqp://guest:12345@localhost"

const sendQueue = async ({ msg }) => {
    try{
        //1. create connect
        const conn = await amqplib.connect(amqbUrl);
        //2. create channel
        const channel = await conn.createChannel();
        //3. create queue name
        const nameQueue = 'q2'
        //4. create queue
        await channel.assertQueue(nameQueue, { 
            durable: true /// save queue when serve cash
            
        })

        //5/ send queue
        await channel.sendToQueue(nameQueue, Buffer.from(msg), {
            // expiration: 10000 ///set time expire for message
            persistent: true
        })

        //6. close conn and channel



    }catch(error){
        console.error(`Error::: ${error}`)
    }
}

const msg = process.argv.slice(2).join(' ') || "Hello"

sendQueue({msg: msg})