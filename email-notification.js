const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'apikey',
    pass: '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',
  },
});

const sendEmailNotification = async (request, response) => {
  const { email, wallet, nickname } = request.body;
  const link = `http://localhost:3000/new-user/${wallet}`;
  const mailData = {
    from: 'uniboxteam@gmail.com', // sender address
    to: email, // list of receivers
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
    html: `<b>Welcome, ${nickname}</b>
        <br>We need you to confirm linking your account to email <br/>
        <button><a href=${link}>Submit</a></button>`,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      return response.status(500).json({ status: 'FAILED', message: err });
    } else {
      return response.status(200).json({ status: 200, message: 'Done' });
    }
  });
};

module.exports = {
  sendEmailNotification,
};
