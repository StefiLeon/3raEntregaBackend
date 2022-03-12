import dotenv from 'dotenv';

dotenv.config();

export default {
    mongo: {
        url: process.env.MONGO_URL || 'mongodb://localhost:27017/ecommerce'
    },
    session: {
        ADMIN: process.env.ADMIN,
        PASSWORD: process.env.PASSWORD
    },
    jwt: {
        SECRET: process.env.JWT_SECRET
    },
    twilio: {
        CLIENT_SID: process.env.TWILIO_CLIENT_SID,
        AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
        PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
        SANDBOX_WHATSAPP_NUMBER: process.env.TWILIO_SANDBOX_WHATSAPP_NUMBER,
        PERSONAL_NUMBER: process.env.TWILIO_PERSONAL_NUMBER,
        WHATSAPP_PERSONAL_NUMBER: process.env.TWILIO_WHATSAPP_PERSONAL_NUMBER
    },
    nodemailer: {
        USER_FROM: process.env.NODEMAILER_USER_FROM
    }
}