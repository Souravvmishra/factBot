const { Telegraf } = require('telegraf')
const { v4: uuidV4 } = require('uuid')
require('dotenv').config()
let factGenerator = require('./factGenerator')
const { instaDown } = require('./jimplearn')


const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => {
    let message = ` Please use the /fact command to receive a new fact`
    ctx.reply(message)
})


bot.command('fact', async (ctx) => {
    try {
        ctx.reply('Generating image, Please wait !!!')
        let imagePath = `./temp/${uuidV4()}.jpg`
        await factGenerator.generateImage(imagePath)
        await ctx.replyWithPhoto({ source: imagePath })
        factGenerator.deleteImage(imagePath)
    } catch (error) {
        console.log('error', error)
        ctx.reply('error sending image')
    }
})


bot.on('photo', async (ctx) => {
    // get the photo object
    const photo = ctx.message.photo[0]
    // get the file URL
    const url = await ctx.telegram.getFileLink(photo)
    // call your function on the URL
    instaDown(photo)
    // send back the edited photo
    ctx.replyWithPhoto({ source: 'lena-pasted.jpg' })
    ctx.deleteMessage(ctx.message.message_id)

})

bot.launch()