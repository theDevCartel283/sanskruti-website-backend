import { Request, Response } from "express";
import markdownModel from "../../model/markdown.model";

export const getMarkdown = async (
  req: Request<{}, {}, {}, { field: "returnPolicy" | "privacyPolicy" }>,
  res: Response
) => {
  const markdownobj = await markdownModel.findOne({ status: "present" });
  const { field } = req.query;
  let str: string = "";
  if (!markdownobj) {
    res.status(401).json({
      message: "markdown not found",
    });
  } else {
    if (field === "returnPolicy") {
      str = markdownobj.returnPolicy || "";
    } else if (field === "privacyPolicy") {
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
