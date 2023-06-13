import { Types } from "mongoose";
import { signToken } from "../jwt.utils";

export const getForgotPasswordFormat = (
  username: string,
  id: Types.ObjectId,
  provider: string
) => {
  const token = signToken("EMAIL_TOKEN_PRIVATE", id, provider, "USER");

  const link = `http://localhost:3000/auth/forgotPassword/${token}`;

  return `
  <div style="max-width: 30rem; margin: auto">
      <img
        style="max-width: 30rem; border-radius: 10px; margin: auto"
        alt="sanskruti nx"
        src="cid:it.developer2002@gmail.com"
      />
    </div>
    <br />
    <div style="max-width: 30rem; margin: auto">Dear ${username},</div>
    <br />
    <div style="max-width: 30rem; margin: auto">
      We received a request to reset your password for your account. 
      To proceed with the password reset, please click on the following link:
    </div>
    <br />
    <div
      style="
        max-width: 30rem;
        margin: auto;
      "
    >
      <a
        href="${link}"
        style="
          text-decoration: none;
          border: 2px solid #eab308;
          background-color: #ffe58f;
          padding: 10px 5rem;
          border-radius: 5px;
          text-align: center;
          width: 100%;
        "
        >RESET PASSWORD</a
      >
    </div>
    <br />
    <div style="max-width: 30rem; margin: auto">
      Please note that this link is valid for one-time use only and will expire
      after 15 minutes. If the link has expired, please visit our website and
      request a new password reset link.
    </div>
    <br />
    <div style="max-width: 30rem; margin: auto">
      If you didn't request this password reset, please ignore this email. 
      Your password will remain unchanged.
    </div>
    <br />
    <div style="max-width: 30rem; margin: auto">
      If you have any questions or need assistance, feel free to contact our
      support team at [support email].
    </div>
    <br />
    <div style="max-width: 30rem; margin: auto">
      Thank you for choosing our platform.
    </div>
    <br />
    <br />
    <div style="max-width: 30rem; margin: auto">Best regards,<br/>Sanskruti NX</div>
  `;
};
