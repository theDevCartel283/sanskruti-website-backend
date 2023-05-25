import { Request, Response } from "express";
import varientModel from "../../model/varients.model";

const deleteVarient = async (req: Request, res: Response) => {
  const id: any = req.query.id;
  if (id.length == 24) {
    const varient: any = await varientModel.findById(id);

    if (!varient) {
      return res.status(500).json({
        success: false,
        message: "varient not found",
      });
    } else {
      await varient.deleteOne(req.query);
      res.status(200).json({
        success: true,
        message: "varient Deleted Successfully",
      });
    }
  } else {
    res.status(500).json({
      success: false,
      message: "wrong id / id length should be of 24 char",
    });
  }
};

export default deleteVarient;
