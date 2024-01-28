const amqplib = require("amqplib")

const amqbUrl = "amqp://guest:12345@localhost"

const receiveNoti = async () => {
    try{
        //1. create connect
        const conn = await amqplib.connect(amqbUrl);
        //2. create channel
        const channel = await conn.createChannel();
        //3. create exchange name
        const nameExchange = 'video'
        //4. create exchange
        await channel.assertExchange(nameExchange, 'fanout', { 
            durable: false /// save queue when serve cash
        })

       //5. create queue
       const { queue } =  await channel.assertQueue('', { 
        exclusive: true // auto remove queue when the connection close
    })

       console.log(`Name queue::::${queue}`)

       //6. binding
       await channel.bindQueue(queue, nameExchange, '')

       await channel.consume(queue, msg => {
            console.log("msg:::", msg.content.toString())
       },{
        noAck: true
       })

    }catch(error){
        console.error(`Error::: ${error}`)
    }
}

receiveNoti()