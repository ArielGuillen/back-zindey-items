const jimp = require('jimp');
const JIMP_QUALITY = 70;

module.exports = async function( imageBase64 ){

    //Get the image and decode from base64
    const decodedImage = Buffer.from( imageBase64.replace( /^data:image\/\w+;base64,/, "" ), "base64" );

    //Convert to a jimp type for resize the image
    const jimpImage = await jimp.read( decodedImage );

    //Get the mime type for upload file to s3
    const mime = jimpImage.getMIME();

    //Resize the image using the jimpImage and get a buffer for the s3 upload
    const resizedImage = await jimpImage
        .quality( JIMP_QUALITY )
        .getBufferAsync( mime );

    return resizedImage;

}