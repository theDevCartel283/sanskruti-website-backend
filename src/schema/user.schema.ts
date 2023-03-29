import { z } from 'zod';

// schemas
export const userNamePwd = z.object({
  username: z.string({
    required_error: 'username is not defined',
  }),
  password: z.string({
    required_error: 'password is not defined',
  }),
});

export const userDetails = z.object({
  name: z.string({
    required_error: 'name is not defined',
  }),
  email: z
    .string({
      required_error: 'email is not defined',
    })
    .email(),
  dob: z
    .string({
      required_error: 'dob is not defined',
    })
    .refine((data) => !isNaN(Date.parse(new Date(data).toDateString())), {
      message: 'invalid date',
    }),
  mobileNo: z.number({
    required_error: 'mobile number is not defined',
  }),
  address: z.string({
    required_error: 'address is not defined',
  }),
});

export const userObject = userNamePwd.merge(userDetails);

// types
export type ReqUserNamePwd = z.infer<typeof userNamePwd>;
export type ReqUserDetails = z.infer<typeof userDetails>;
export type ReqUserObject = z.infer<typeof userObject>;
