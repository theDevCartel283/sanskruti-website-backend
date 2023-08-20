import { Request, Response } from "express";
import categoryModel from "../../model/category.model";
import axios from "axios";
import { ReqCategoryObject } from "../../schema/category.schema";
const updateCategory = async (
  req: Request<{}, {}, ReqCategoryObject>,
  res: Response
) => {
  const id: any = req.query.id;
  const image = req.body.Image;
  const temp = {
    image: req.body.Image.split(",")[1],
    imageName: req.body.imageName,
  };
  const category = await categoryModel.findById(id);
  if (!category) {
    return res.status(500).json({
      type: "error",
      message: "category not found",
    });
  } else {
    const duplicateCategory = await categoryModel.findOne({
      Title: req.body.Title,
    });
    if (duplicateCategory) {
      if (req.body.Title !== category.Title) {
        res.status(200).json({
          type: "warning",
          message: "category already exists !",
        });
      } else {
        if (image === "" || image.length < 100) {
          const newCategory = await categoryModel.findByIdAndUpdate(
            id,
            {
              Title: req.body.Title,
              Meta_Title: req.body.Meta_Title,
              Meta_Description: req.body.Meta_Description,
              Image: req.body.Image,
            },
            {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            }
          );
          res.status(200).json({
            type: "success",
            message: "category updated successfully",
          });
        } else {
          const response = await axios.post(
            `${process.env.CDN_ENDPOINT}/cdn/v1/images/takeImages`,
            temp,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = response.data;
          const path = data.path;
          await categoryModel.findByIdAndUpdate(
            id,
            {
              Title: req.body.Title,
              Meta_Title: req.body.Meta_Title,
              Meta_Description: req.body.Meta_Description,
              Image: path,
            },
            {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            }
          );
          res.status(200).json({
            type: "success",
            message: "category updated successfully",
          });
        }
      }
    } else {
      if (image === "" || image.length < 100) {
        const newCategory = await categoryModel.findByIdAndUpdate(
          id,
          {
            Title: req.body.Title,
            Meta_Title: req.body.Meta_Title,
            Meta_Description: req.body.Meta_Description,
            Image: req.body.Image,
          },
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );
        res.status(200).json({
          type: "success",
          message: "category updated successfully",
        });
      } else {
        const response = await axios.post(
          `${process.env.CDN_ENDPOINT}/cdn/v1/images/takeImages`,
          temp,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;
        const path = data.path;
        await categoryModel.findByIdAndUpdate(
          id,
          {
            Title: req.body.Title,
            Meta_Title: req.body.Meta_Title,
            Meta_Description: req.body.Meta_Description,
            Image: path,
          },
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );
        res.status(200).json({
          type: "success",
          message: "category updated successfully",
        });
      }
    }
  }
};

export default updateCategory;
