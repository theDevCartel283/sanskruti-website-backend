import nodeMailer from "nodemailer";

const sendEmail = async (options: any) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    service: process.env.SERVICE,
    auth: {
      user: "it.developer2002@gmail.com",
      pass: "wyttogzcgrfhtadt",
    },
  });

  const mailOptions = {
    from: "it.developer2002@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
