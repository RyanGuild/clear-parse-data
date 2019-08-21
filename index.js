const fs = require("fs")
const os = require("os")
const yargs = require("yargs")
const Parse = require("parse/node")

const options = 
    yargs
        .usage("clear-parse-data -c <class-name> -p <class-property-name> -r <regex-name>")
        .option("c", 
        { 
            alias: "className", 
            describe: "_User | Product | Farm", 
            type: "string", 
            demandOption: true 
        })
        .option("p",
        {
            alias: "propertyName",
            describe: "farmName | username | email",
            string:"string",
            demandOption:true
        })
        .option("r",
        {
            alias: "regex",
            describe: "the string to match the property against",
            string:"string",
            demandOption:true
        })
        .option("timeout",
        {
            alias: "regex",
            describe: "the string to match the property against",
            string:"number",
            demandOption:false,
            default:10000
        })
        .argv

const Model = Parse.Object.extend(options.className)
const Query = new Parse.Query(Model)
const Regex = new RegExp(options.regex)

const Timer = setTimeout(() => {
    console.log('operations took too long')
}, options.timeout);

new Promise(async (resolve, reject) => {
    let count = 0
    await Query
        .find()
        .forEach(
            (object) => {
                if (Regex.test(object.get(options.propertyName))){
                    object.destroy()
                    count += 1
                }
            });
    resolve()
})
.then(() =>{
    console.log(`${count} objects deleted`)
    clearTimeout(Timer)
})

