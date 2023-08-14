import { Router } from "express"

const router = Router()

router.get("/", (req,res)=>{
    req.logger.silly("nivel silly")
    req.logger.verbose("nivel verbose")
    req.logger.debug("nivel debug")
    req.logger.http("nivel http")
    req.logger.info("nivel info")
    req.logger.warn("nivel warn")
    req.logger.error("nivel error")
    req.logger.fatal("nivel fatal")
    res.send("prueba niveles")
})

export default router