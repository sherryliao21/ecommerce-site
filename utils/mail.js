const nodemailer = require('nodemailer')
const fs = require('fs')
const Handlebars = require('handlebars')

const sendMailPromise = mailOptions => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD
      }
    })

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('error', error)
        resolve(false)
      } else {
        console.log('Email sent: ' + info.response)
        resolve(true)
      }
    })
  })
}

module.exports = {
  sendMail: async (receiverMail, mailContent) => {
    const mailOptions = {
      from: process.env.EMAIL_ACCOUNT,
      to: receiverMail,
      subject: mailContent.subject,
      html: mailContent.html
    }

    return await sendMailPromise(mailOptions)
  },
  orderConfirmMail: (order, paymentStatus) => {
    const source = fs.readFileSync('views/mails/orderConfirm.hbs', 'utf8')
    const template = Handlebars.compile(source)
    return {
      subject: `Thank you for your Blanche order #${order.id} `,
      html: template({ order, paymentStatus, url: process.env.URL })
    }
  }
}
