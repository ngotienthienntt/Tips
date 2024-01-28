const amqplib = require("amqplib")

const amqbUrl = "amqp://guest:12345@localhost"

const postVideo = async ({ msg }) => {
    try{
        //1. create connect
        const conn = await amqplib.connect(amqbUrl);
        //2. create channel
        const channel = await conn.createChannel();
        //3. create exchange name
        const nameExchange = 'video'
        //4. create 
        await channel.assertExchange(nameExchange, 'fanout', { 
            durable: false /// save queue when serve cash
        })

        //5/ publish video
        await channel.publish(nameExchange, "", Buffer.from(msg))

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

const msg = process.argv.slice(2).join(' ') || "Hello"

postVideo({msg: msg})