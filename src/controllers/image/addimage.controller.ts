import { Request, Response } from "express";
import axios from "axios";
import fs from "fs";

const addImage = async (req: Request, res: Response) => {
  const temp = req.body.image;
  console.log(temp);
  // const response = await axios.post(
  //   `${process.env.CDN_ENDPOINT}/cdn/v1/images/takeImages`,
  //   temp,
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );

  // const data = response.data;

  res.status(200).json({
    message: "data.message",
    type: "success",
    // path: data.path,
  });
};

export default addImage;
