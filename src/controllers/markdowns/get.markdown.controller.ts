import { Request, Response } from "express";
import markdownModel from "../../model/markdown.model";

export const getMarkdown = async (req: Request, res: Response) => {
  const markdownobj = await markdownModel.findOne({ status: "present" });
  const feild = req.query.feild;
  let str: string = "";
  if (!markdownobj) {
    res.status(401).json({
      message: "markdown not found",
    });
  } else {
    if (feild === "returnPolicy") {
      str = markdownobj.returnPolicy || "";
    } else if (feild === "privacyPolicy") {
      str = markdownobj.privacyPolicy || "";
    } else {
      str = markdownobj.termsAndConditions || "";
    }
    res.status(200).json({
      type: "success",
      markdown: str,
    });
  }
};
