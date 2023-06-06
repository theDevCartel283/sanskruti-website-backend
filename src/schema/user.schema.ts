import { z } from "zod";

// schemas
export const username = z.object({
  username: z.string({
    required_error: "username is not defined",
  }),
});

export const auth = z.object({
  emailOrNumber: z.union([z.string().email(), z.number()]),
  password: z.string(),
});

export const authWithUsername = auth.merge(username);

export const emailAndNumber = z.object({
  email: z.string().email(),
  Mobile_No: z.number(),
  password: z.string(),
});

export const register = username.merge(emailAndNumber);

// email register
export const userEmailPwd = z.object({
  email: z
    .string({
      required_error: "email is not defined",
    })
    .email(),
  password: z.string({
    required_error: "password is not defined",
  }),
});

//phone no register
export const userMobileNoPwd = z.object({
  Mobile_No: z.number({
    required_error: "Mobile Number is not defined",
  }),
  password: z.string({
    required_error: "password is not defined",
  }),
});

export const userUpdatePassword = z.object({
  password: z.string({
    required_error: "update password is not defined",
  }),
  updatePassword: z.string({
    required_error: "update password is not defined",
  }),
});

export const userDetails = z.object({
  username: z.string({
    required_error: "name is not defined",
  }),
  email: z
    .string({
      required_error: "email is not defined",
    })
    .email(),
  Mobile_No: z.number({
    required_error: "Mobile Number is not defined",
  }),
});

export const addressObject = z.object({
  fullName: z.string({ required_error: "fullName is not Defined" }),
  contactNo: z.number({ required_error: "fullName is not Defined" }),
  pincode: z.number({ required_error: "fullName is not Defined" }),
  nearBy: z.string({ required_error: "near by feild is empty" }),
  landmark: z.string({ required_error: "landmark is not defined" }),
  city: z.string({ required_error: "city is not Defined" }),
  state: z.string({ required_error: "state is not Defined" }),
});
export const Address = z.object({
  newAddress: addressObject.merge(
    z.object({
      id: z.string(),
    })
  ),
});

export const userObject = userEmailPwd.merge(userDetails);
export const emailPwdWithUsername = userEmailPwd.merge(username);
export const userMobileNoPwdWithUsername = userMobileNoPwd.merge(username);

// types
export type ReqAuth = z.infer<typeof auth>;
export type ReqAuthWithUsername = z.infer<typeof authWithUsername>;

export type ReqRegister = z.infer<typeof register>;

export type ReqEmailPwd = z.infer<typeof userEmailPwd>;
export type RequserMobileNoPwd = z.infer<typeof userMobileNoPwd>;
export type ReqEmailPwdWithUsername = z.infer<typeof emailPwdWithUsername>;
export type RequserMobileNoPwdWithUsername = z.infer<
  typeof userMobileNoPwdWithUsername
>;
export type ReqUserUpdatePassword = z.infer<typeof userUpdatePassword>;
export type ReqUserDetails = z.infer<typeof userDetails>;
export type ReqUserObject = z.infer<typeof userObject>;
export type ReqAddressObject = z.infer<typeof addressObject>;
export type ReqAddress = z.infer<typeof Address>;
