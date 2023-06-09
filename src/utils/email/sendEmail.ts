import nodeMailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import { getVerifyEmailFormat } from "./verifyEmailFormat";

type Options = {
  email: string;
  subject: string;
  message: string;
};
const sendEmail = async (options: Options) => {
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

  const mailOptions: MailOptions = {
    from: "it.developer2002@gmail.com",
    to: options.email,
    subject: options.subject,
    html: options.message,
    attachments: [
      {
        filename: "image.png",
        path: "./src/utils/email/assets/sanskruti_banner.png",
        cid: "it.developer2002@gmail.com",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
