let { createClient } = require('pexels')
let Jimp = require('jimp')
const fs = require('fs')
const request = require('request');

async function generateImage(imagePath) {
  let fact = await randomFact()
  let photo = await getRandomImage(fact)
  await editImage(photo, imagePath, fact)
}


async function randomFact() {
    return new Promise((resolve, reject) => {
      const limit = 1;
      request.get({
        url: `https://api.api-ninjas.com/v1/facts?limit=${limit}`,
        headers: {
          'X-Api-Key': process.env.FACTS_API_KEY
        },
      }, function(error, response, body) {
        if (error) {
          console.error('Request failed:', error);
          reject(error);
        } else if (response.statusCode != 200) {
          console.error('Error:', response.statusCode, body.toString('utf8'));
          reject(new Error(`Error: ${response.statusCode}`));
        } else {
          const fact = JSON.parse(body)[0].fact;
          console.log(fact);
          resolve(fact);
        }
      });
    });
  }
  


function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function getRandomImage(fact) {
  try {
    const client = createClient(process.env.PEXELS_API_KEY)
    const rand = fact.split(" ")
    const rand2 = rand[Math.floor(Math.random()*rand.length)]
    const query = rand2
    let image

    await client.photos.search({ query, per_page: 10 }).then(res => {
      let images = res.photos
      image = images[randomInteger(0, (images.length - 1))]

    })

    return image

  } catch (error) {
    console.log('error downloading image', error)
    getRandomImage(animal)
  }
}


async function editImage(image, imagePath, fact) {
  try {
    let imgURL = image.src.medium
    let animalImage = await Jimp.read(imgURL).catch(error => console.log('error ', error))
    let animalImageWidth = animalImage.bitmap.width
    let animalImageHeight = animalImage.bitmap.height
    let imgDarkener = await new Jimp(animalImageWidth, animalImageHeight, '#000000')
    imgDarkener = await imgDarkener.opacity(0.7)
    animalImage = await animalImage.composite(imgDarkener, 0, 0);

    let posX = animalImageWidth / 15
    let posY = animalImageHeight / 15
    let maxWidth = animalImageWidth - (posX * 2)
    let maxHeight = animalImageHeight - posY

    let font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE)
    await animalImage.print(font, posX, posY, {
      text: fact,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, maxWidth, maxHeight)

    await animalImage.writeAsync(imagePath)
    console.log("Image generated successfully")

  } catch (error) {
    console.log("error editing image", error)
  }

}


const deleteImage = (imagePath) => {
  fs.unlink(imagePath, (err) => {
    if (err) {
      return
    }
    console.log('file deleted')
  })
}


module.exports = { generateImage, deleteImage }