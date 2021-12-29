const nodemailer = require('nodemailer');

const sendEmail = (options)=>{
 const transport = nodemailer.createTransport({
  host:process.env.SMTP_HOST ,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

  const mailOption = {
   from:options.from,
   to:options.to,
   subject:options.subject,
   text:options.text,
   html:options.html
  }
  transport.sendMail(mailOption)
}

module.exports = sendEmail;