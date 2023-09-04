import nodeMailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import logger from "../logger.utils";
import { env } from "../../config/env";

type Options = {
  email: string;
  subject: string;
  message: string;
};
const sendEmail = async (options: Options) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,

      service: "gmail",
      auth: {
        user: env.NODEMAILER_EMAIL,
        pass: env.NODEMAILER_EMAIL_PASSWORD,
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
  } catch (err) {
    logger.error("send email failed " + err);
  }
};

export default sendEmail;
