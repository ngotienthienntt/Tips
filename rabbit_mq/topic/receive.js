const amqplib = require("amqplib")

const amqbUrl = "amqp://guest:12345@localhost"

const receiveMail = async () => {
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

        //5. create queue
        const { queue } = await channel.assertQueue('', {
            exclusive: true
        })

        //6. binding
        const args = process.argv.slice(2)
        if(!args.length){
            process.exit(0)
        }


        
        console.log(`waiting::::${queue}, topic::::${args}`)
        args.forEach(async key => {
            await channel.bindQueue(queue, nameExchange, key)
        })
        //5/  consume

        await channel.consume(queue, msg => {
            console.log(`Routing key:::${msg.fields.routingKey}, msg::::${msg.content.toString()}`)
        })

        /*
            *: match any words 
            #: match a word or words => #.lead => any string has ".lead" is match
        */

    }catch(error){
        console.error(`Error::: ${error}`)
    }
}

receiveMail()