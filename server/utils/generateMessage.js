const moment = require('moment');
const config = require('config');

const generateMessages = (from , text) => {

    return {
        from ,
        text , 
        createdAt: moment().valueOf()
    }


}

const showCurrentLocation = (from , coords) => {

    return {
        from,
        hoverUrl: `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,
        mapsUrl:config.get('GOOGLE_STATIC_MAPS_URL'),
        mapsParams:config.get('GOOGLE_STATIC_MAPS_PARAMS'),
        MAPS_API_KEY: config.get('STATIC_MAP_KEY'),
        latitude: coords.latitude,
        longitude: coords.longitude,
        // status: config.get("MESSAGE_DELIVERED"),
        createdAt: moment().valueOf()
    }

}


module.exports = {
    generateMessages,
    showCurrentLocation
}