const xml2js = require("xml2js")

async function parseXML(xmlData){
    const parser = new xml2js.Parser({explicitArray: false});
    return parser.parseStringPromise(xmlData)
}

module.exports = parseXML