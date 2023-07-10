import { Request, Response } from "express";
import { TokenPayload } from "../../utils/jwt.utils";
import wishlistModel from "../../model/wishlist.model";
import getProductsFromIds from "../../utils/getProductsFromIds";
import logger from "../../utils/logger.utils";

const handleGetWishlist = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  try {
    const userWishlist = await wishlistModel.findOne({
      userId: req.body.userUniqueIdentity,
    });

    if (!userWishlist) return res.send({ ids: [], list: [] });

    const { filteredArray, emptyArray } = await getProductsFromIds(
      userWishlist.products
    );
    if (emptyArray && emptyArray.length !== 0) {
      userWishlist.products = userWishlist.products.filter(
        (product) => !emptyArray.includes(product._id)
      );
      await userWishlist.save();
    }
    res.status(200).send({
      ids: userWishlist.products || [],
      list: filteredArray || [],
    });
  } catch (err) {
    logger.error("get wishlist error " + err);
    res.status(500).send({
      ids: [],
      list: [],
    });
  }
};

export default handleGetWishlist;
