import { z } from "zod";

// schemas
export const username = z.object({
  username: z.string({
    required_error: "username is not defined",
  }),
});

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

export const userUpdatePassword = userEmailPwd.merge(
  z.object({
    updatePassword: z.string({
      required_error: "update password is not defined",
    }),
  })
);

export const userDetails = z.object({
  email: z
    .string({
      required_error: "email is not defined",
    })
    .email(),
  name: z.string({
    required_error: "name is not defined",
  }),
  dob: z
    .string({
      required_error: "dob is not defined",
    })
    .refine((data) => !isNaN(Date.parse(new Date(data).toDateString())), {
      message: "invalid date",
    }),
  mobileNo: z.number({
    required_error: "mobile number is not defined",
  }),
  address: z.string({
    required_error: "address is not defined",
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
export const arr = z.object({
  arr: z.array(z.object({})),
});

export const userObject = userEmailPwd.merge(userDetails);
export const emailPwdWithUsername = userEmailPwd.merge(username);
export const userMobileNoPwdWithUsername = userMobileNoPwd.merge(username);

// types
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
export type ReqArr = z.infer<typeof arr>;
