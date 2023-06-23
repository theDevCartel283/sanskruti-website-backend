import { Request, Response } from "express";
import wishlistModel from "../../model/wishlist.model";
import { ReqWishlistObject } from "../../schema/wishlist.schema";
import { TokenPayload } from "../../utils/jwt.utils";
import ProductModel from "../../model/product.model";

const addToWishlist = async (
  req: Request<{}, {}, ReqWishlistObject & TokenPayload>,
  res: Response
) => {
  const { userUniqueIdentity, productId } = req.body;
  const user = await wishlistModel.findOne({ userId: userUniqueIdentity });

  const checkProductExists = await ProductModel.findById(productId);
  if (!checkProductExists)
    return res.status(200).json({
      success: true,
      ids: !!user ? user.products : [],
    });

  if (user) {
    if (!user.products.includes(checkProductExists._id))
      user.products.push(checkProductExists._id);
    const userWishlist = await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      ids: userWishlist.products,
    });
  } else {
    const newUserWishlist = new wishlistModel({
      userId: userUniqueIdentity,
      products: [checkProductExists._id],
    });

    const wishlist = await newUserWishlist.save();

    res.status(200).json({
      success: true,
      ids: wishlist.products,
    });
  }
};

export default addToWishlist;
