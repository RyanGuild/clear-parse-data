#!/usr/bin/env node


const fs = require("fs")
const os = require("os")
const yargs = require("yargs")
const Parse = require("parse/node")

const options = 
    yargs
        .usage("clear-parse-data -c <class-name> -p <class-property-name> -r <regex-name> --appID <parse-appID> --masterKey <parse-masterKey> --serverURL <parse-server-url>")
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
        .option("t",
        {
            alias: "timeout",
            describe: "the number of ms before timeout",
            string:"number",
            demandOption:false,
            default:10000
        })
        .option("a",
        {
            alias: "appID",
            describe: "the parse server app id",
            string:"string",
            demandOption:true
        })
        .option("m",
        {
            alias: "masterKey",
            describe: "the parse server masterKey",
            string:"string",
            demandOption:true
        })
        .option("s",
        {
            alias: "serverURL",
            describe: "the parse server url",
            string:"string",
            demandOption:true
        })
        .argv

Parse.initialize(options.appID,null, options.masterKey)
Parse.serverURL = options.serverURL

const Model = Parse.Object.extend(options.className)
const Query = new Parse.Query(Model)
const Regex = new RegExp(options.regex)
let count = 0

const Timer = setTimeout(() => {
    console.log('operations took too long')
}, options.timeout);

new Promise(async (resolve, reject) => {
    
    let result = await Query.find()
    result
        .forEach(
            (object) => {
                if (Regex.test(object.get(options.propertyName))){
                    object.destroy({useMasterKey: true})
                    count += 1
                }
            });
    resolve()
})
.then(() =>{
    console.log(`${count} objects deleted`)
    clearTimeout(Timer)
})

