import { Request, Response } from "express";
import axios from "axios";

const delete_single_image = async (req: Request, res: Response) => {
  const url_params = req.query;
  const response = await axios.delete(
    `${process.env.CDN_ENDPOINT}/cdn/v1/images/deleteImage?name=${url_params.name}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = response.data;

  res.status(200).json({
    type: "success",
    message: data.message,
  });
};

export default delete_single_image;
