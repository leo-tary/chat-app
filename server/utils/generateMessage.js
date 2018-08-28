
const generateMessages = (from , text , assets = false) => {

    return {
        from ,
        text , 
        assets ,
        createdAt: new Date().getTime()
    }


}

module.exports = {
    generateMessages
}