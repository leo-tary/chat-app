
const isValidString = (data) => {

    return typeof data === 'string' && data.trim().length > 0;

}

const isEmptyObject = (dataObject) => {

    return Object.keys(dataObject).length;

}


module.exports = {
    isValidString ,
    isEmptyObject
}