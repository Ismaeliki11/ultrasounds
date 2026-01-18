const ggwaveFactory = require('ggwave');
ggwaveFactory().then(instance => {
    console.log("Instance keys:", Object.keys(instance));
    // Check for encode/decode
    console.log("Has encode:", typeof instance.encode);
    console.log("Has decode:", typeof instance.decode);
}).catch(err => console.error(err));
