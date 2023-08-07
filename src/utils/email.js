import nodemailer from "nodemailer"
import {options} from "../config/options.js"

const transporter = nodemailer.createTransport({
    service:"gmail",
    port:587,
    auth:{
        user: options.gmail.adminAccount,
        pass:options.gmail.emailToken
    },
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
})

export const sendRecoveryPass = async(userEmail,token)=>{
    const link = `http://localhost:8080/reset-password?token=${token}`
    await transporter.sendMail({
        from:options.gmail.emailAdmin,
        to:userEmail,
        subject:"Restablecer contraseña",
        html: `
        <div>
        <h2>Has solicitado un cambio de contraseña.</h2>
        <p>Da clic en el siguiente enlace para restableces la contraseña</p>
        <a href="${link}">
        <button> Restablecer contraseña </button>
        </a>        
        </div>
        `
    })
}