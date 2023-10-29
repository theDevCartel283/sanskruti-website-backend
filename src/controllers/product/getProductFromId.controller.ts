import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import ProductModel from "../../model/product.model";

const handleGetProductFromId = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);

    if (!product)
      return res
        .status(404)
        .send({ message: "product not found", type: "error" });

    return res.status(200).send({
      product,
    });
  } catch (err) {
    logger.error("handle get product error " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export default handleGetProductFromId;
