import Mailgen from "mailgen";
import nodemailer from "nodemaoler"

const sendEmail = async (options) => {
   const mailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Task Manager",
        link:"https://taskmanagerlink.com"
    }
   }) 


   mailGenerator.generatePlaintex(options.mailgenContent)


   const emailHtml = mailGenerator.generator.generate(options.mailgenContent)


   const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS
    }
   })

   const maail = {
    from: "mail.taskmanagre@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTexttual,
    html: emailHtml
   }

   try {
        await transporter.sendMail(mail)
   } catch (error) {
      console.error("Email service faied siliently. Make sure that you have provided your MAILTRAP credentials in the .env file")
      console.error("Error: ", error)
   }
}


const emailVerificationMailgenContent = (username,verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "welcome to App! we'aer excited to have you on board.",
            action:{
                instructions: "To verify your email please click on the following button",
                button: {
                    color: "#laa5aff",
                    text: verificationUrl
                },
            },
            outro:
            "Need help, or have quesion? just reply to this email, we'd love to help.",
        },
    };
};

export { emailVerificationMailgenContent,forgotPasswordMailgenContent };
