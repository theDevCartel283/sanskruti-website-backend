import { Request, Response, NextFunction } from "express";
import markdownModel from "../../model/markdown.model";
import { ReqMarkdownObject } from "../../schema/markdown.schema";

const addMarkdown = async (
  req: Request<{}, {}, ReqMarkdownObject>,
  res: Response,
  next: NextFunction
) => {
  const { status } = req.body;

  const markdownObj = await markdownModel.findOne({ status });
  if (markdownObj) {
    if (req.body.returnPolicy !== undefined) {
      await markdownModel.findOneAndUpdate(
        { status },
        { $set: { returnPolicy: req.body.returnPolicy } }
      );
    } else if (req.body.termsAndConditions !== undefined) {
      await markdownModel.findOneAndUpdate(
        { status },
        { $set: { termsAndConditions: req.body.termsAndConditions } }
      );
    } else {
      await markdownModel.findOneAndUpdate(
        { status },
        { $set: { privacyPolicy: req.body.privacyPolicy } }
      );
    }

    res.status(200).json({
      type: "success",
      message: "markdown updated",
    });
  } else {
    try {
      const newmarkdown = new markdownModel({
        status: "present",
        returnPolicy: req.body.returnPolicy || "",
        termsAndConditions: req.body.termsAndConditions || "",
        privacyPolicy: req.body.privacyPolicy || "",
      });
      await newmarkdown.save();
      res.status(201).json({
        type: "success",
        message: "markdown set",
      });
    } catch (error) {
      res.status(502).json({
        type: "error",
        message: "something went wrong",
      });
    }
  }
};
export default addMarkdown;
