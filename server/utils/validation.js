
/**
 * 
 *  Server-side validations for the input provided
 * 
 */


const isValidString = (input) => {

    return typeof input === 'string' && input.trim().length > 0;

}

const isEmptyObject = (inputObject) => {

    return Object.keys(inputObject).length;

}

module.exports = {
    isValidString ,
    isEmptyObject
}