const { Telegraf } = require('telegraf')
const { v4: uuidV4 } = require('uuid')
require('dotenv').config()
let factGenerator = require('./factGenerator')
const Jimp = require('jimp');



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
    const photo = ctx.message.photo[0]
    const url = await ctx.telegram.getFileLink(photo)
    Jimp.read(photo)
        .then((image) => {
            const imageWidth = image.getWidth();
            const imageHeight = image.getHeight();
            const removeHeight = 120; // Height to be removed from the bottom

            image.crop(0, 0, imageWidth, imageHeight - removeHeight);

            const x = Math.round((1000 - image.getWidth()) / 2);
            const y = Math.round((1000 - image.getHeight()) / 2);

            const squareImage = new Jimp(1000, 1000, 'black');

            squareImage.composite(image, x, y);

            // Save the modified image
            return squareImage.write('lena-pasted.png');
        })
        .catch((err) => {
            console.error(err);
        });
    ctx.replyWithPhoto({ source: 'lena-pasted.png' })
    ctx.deleteMessage(ctx.message.message_id)
})



bot.launch()