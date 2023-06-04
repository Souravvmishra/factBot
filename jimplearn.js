const Jimp = require('jimp');

function instaDown(url) {
    Jimp.read(url)
        .then((image) => {
            const imageWidth = image.getWidth();
            const imageHeight = image.getHeight();
            const removeHeight = 120; // Height to be removed from the bottom

            image.crop(0, 0, imageWidth, imageHeight - removeHeight);
            // image.resize(imageWidth, imageHeight)
            // Calculate the dimensions of the black square

            // Calculate the position to place the cropped image at the center of the square
            const x = Math.round((squareSize - image.getWidth()) / 2);
            const y = Math.round((squareSize - image.getHeight()) / 2);

            // Create a new image with a black square as the background
            const squareImage = new Jimp(100, 100, 'black');

            // Paste the cropped image onto the black square at the center
            squareImage.composite(image, x, y);

            // Save the modified image
            squareImage.write('lena-pasted.jpg');
        })
        .catch((err) => {
            console.error(err);
        });

}

module.exports = { instaDown }
