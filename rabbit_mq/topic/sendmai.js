const amqplib = require("amqplib")

const amqbUrl = "amqp://guest:12345@localhost"

const sendMail = async () => {
    try{
        //1. create connect
        const conn = await amqplib.connect(amqbUrl);
        //2. create channel
        const channel = await conn.createChannel();
        //3. create exchange name
        const nameExchange = 'send-mail'
        //4. create 
        await channel.assertExchange(nameExchange, 'topic', { 
            durable: false /// save queue when serve cash
        })

        const args = process.argv.slice(2)
        const msg = args[1] || "Fixed!!!"
        const topic = args[0]

        console.log(`msg::::${msg}, topic::::${topic}`)
        //5/ publish video
        await channel.publish(nameExchange, topic, Buffer.from(msg))

        console.log("send message [ok]: ", msg)

        //6. close conn and channel
        setTimeout(function() {
            conn.close();
            process.exit(0)
        }, 2000)


    }catch(error){
        console.error(`Error::: ${error}`)
    }
}

sendMail()