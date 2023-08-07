import winston from "winston"
import * as dotenv from "dotenv"
import  {__dirname}  from "../utils.js"
import path  from "path"

dotenv.config()

const customLevels = {
    levels:{
        debug:1,
        http:2,
        info:3,
        warn:4,
        error:5,
        fatal:6
    },
    colors:{
        fatal:"red",
        error:"orange",
        warn:"yellow",
        info:"blue",
        http:"green",
        debug:"purple"
    }
}

const devLogger = winston.createLogger({
    levels:customLevels.levels,
    transports:[
        new winston.transports.Console({
            level:"debug",
            format: winston.format.combine(
                winston.format.colorize({
                    colors: customLevels.colors,
                }),
                winston.format.simple()
            ),
        }),
    ],
})

const prodLogger = winston.createLogger({
    transports:[
        new winston.transports.Console({ level: "info"}),
        new winston.transports.File({filename: path.join(__dirname,"./errors.log"), level:"warn" })
    ]
})

const currentEnv = process.env.NODE_ENV || "development"

export const addLogger = (req,res,next)=>{
    if(currentEnv === "development"){
        req.logger = devLogger
    } else {
        req.logger = prodLogger
    }
    req.logger.http(`${req.url} - metodo: ${req.method}`)
    next()
}