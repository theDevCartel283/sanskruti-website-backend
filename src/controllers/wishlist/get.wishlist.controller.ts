import { Request, Response } from "express";
import { TokenPayload } from "../../utils/jwt.utils";
import wishlistModel from "../../model/wishlist.model";
import getProductsFromIds from "../../utils/getProductsFromIds";

const handleGetWishlist = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  const userWishlist = await wishlistModel.findOne({
    userId: req.body.userUniqueIdentity,
  });

  if (!userWishlist) return res.send({ list: [] });

  const productsList = await getProductsFromIds(userWishlist.products);
  res.status(200).send({
    ids: userWishlist.products,
    list: productsList,
  });
};

export default handleGetWishlist;
