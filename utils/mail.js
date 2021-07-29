const nodemailer = require('nodemailer')

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
    return {
      subject: `Thank you for your Blanche order #${order.id} `,
      html: `
      <html>
      <body>
      <div>
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td class="esd-email-paddings" valign="top">

                        <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" esd-custom-block-id="1754" align="center">
                                        <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p10t es-p10b es-p20r es-p20l" esd-general-paddings-checked="false" align="left">
                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esd-container-frame" width="560" valign="top" align="center">
                                                                        <table style="border-radius: 0px; border-collapse: separate;" width="100%" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-block-text es-p10t es-p15b" align="center">
                                                                                        <h1>Thanks for your order<br></h1>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="esd-block-text es-p5t es-p5b es-p40r es-p40l" align="center">
                                                                                        <p style="color: #333333;">You'll receive an email when your items are shipped.</p>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                           
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" esd-custom-block-id="1755" align="center">
                                        <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p20t es-p30b es-p20r es-p20l" align="left">
                                                        <table class="es-left" cellspacing="0" cellpadding="0" align="left">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="es-m-p20b esd-container-frame" width="280" align="left">
                                                                        <table style="background-color: #fef9ef; border-color: #efefef; border-collapse: separate; border-width: 1px 0px 1px 1px; border-style: solid;" width="100%" cellspacing="0" cellpadding="0" bgcolor="#fef9ef">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-block-text es-p20t es-p10b es-p20r es-p20l" align="left">
                                                                                        <h4>SUMMARY:</h4>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="esd-block-text es-p20b es-p20r es-p20l" align="left">
                                                                                        <table style="width: 100%;" class="cke_show_border" cellspacing="1" cellpadding="1" border="0" align="left">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td><span style="font-size: 14px; line-height: 150%;">Order #:</span></td>
                                                                                                    <td><span style="font-size: 14px; line-height: 150%;">${order.id}</span></td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td><span style="font-size: 14px; line-height: 150%;">Order Total:</span></td>
                                                                                                    <td><span style="font-size: 14px; line-height: 150%;">$ ${order.amount}</span></td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td><span style="font-size: 14px; line-height: 150%;">Receiver's Name:</span></td>
                                                                                                    <td><span style="font-size: 14px; line-height: 150%;">${order.name}</span></td>
                                                                                                </tr>
                                                                                              <tr>
                                                                                                    <td><span style="font-size: 14px; line-height: 150%;">Receiver's Phone:</span></td>
                                                                                                    <td><span style="font-size: 14px; line-height: 150%;">${order.phone}</span></td>
                                                                                                </tr>
                                                                                              <tr>
                                                                                                    <td><span style="font-size: 14px; line-height: 150%;">Shipping Address:</span></td>
                                                                                                    <td><span style="font-size: 14px; line-height: 150%;">${order.address}</span></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                        <p style="line-height: 150%;"><br></p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                
                                                        <table class="es-right" cellspacing="0" cellpadding="0" align="right">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esd-container-frame" width="280" align="left">
                                                                        <table style="background-color: #fef9ef; border-collapse: separate; border-width: 1px; border-style: solid; border-color: #efefef;" width="100%" cellspacing="0" cellpadding="0" bgcolor="#fef9ef">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-block-text es-p20t es-p10b es-p20r es-p20l" align="left">
                                                                                        <h4>Order Status:<br></h4>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                     <td><span style="font-size: 14px; line-height: 150%;">Paymeny Status:</span></td>
                                                                                     <td><span style="font-size: 14px; line-height: 150%;">${paymentStatus}</span></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td></td>
                                                                                    <td><a href="${process.env.URL}/orders/${order.id}/payment">Click here to pay</a></td>
                                                                                     
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
      </body>
    </html>
    `
    }
  }
}
