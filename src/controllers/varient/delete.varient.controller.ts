import { Request, Response } from "express";
import varientModel from "../../model/varients.model";

const deleteVarient = async (req: Request, res: Response) => {
  const id: any = req.query.id;

  const varient: any = await varientModel.findById(id);

  if (!varient) {
    return res.status(500).json({
      type: "warning",
      message: "varient not found",
    });
  } else {
    await varient.deleteOne(req.query);
    res.status(200).json({
      type: "success",
      message: "varient Deleted Successfully",
    });
  }
};

export default deleteVarient;
