const path = require('path');
const express = require('express');


const app = express();
const PORT = process.env.PORT || 9900;
const publicPath = path.join(__dirname , '../public');



app.use(express.static(publicPath));
app.listen(PORT , () => {

    console.log(`Chat Server Fired Up @${PORT}...`);

})