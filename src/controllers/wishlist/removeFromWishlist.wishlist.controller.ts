import { ObjectId } from "bson";
import { Request, Response } from "express";
import wishlistModel from "../../model/wishlist.model";
import { ReqWishlistObject } from "../../schema/wishlist.schema";
import { TokenPayload } from "../../utils/jwt.utils";

const handleRemoveFromWishlist = async (
  req: Request<{}, {}, TokenPayload, ReqWishlistObject>,
  res: Response
) => {
  const user = await wishlistModel.findOne({
    userId: req.body.userUniqueIdentity,
  });
  const productId = new ObjectId(req.query.productId);

  if (!user) return res.send({ ids: [] });

  user.products = user.products.filter(
    (product) => product._id.toString() !== productId.toHexString()
  );
  const userWishlist = await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    ids: userWishlist.products,
  });
};

export default handleRemoveFromWishlist;
