const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const WelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gr54gamer@gmail.com',
        subject: "What you're doing here?",
        text: `I don't know if it's the right place to be, ${name}?!`
    })
}

const CancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gr54gamer@gmail.com',
        subject: "It's everything ok?",
        text: `I'm sorry for the incoveninet. Please make sure to reply what are the thoughts to make you do that ${name}!`
    })
}

module.exports = {
    WelcomeEmail,
    CancelationEmail
}