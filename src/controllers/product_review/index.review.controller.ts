import updateReview from "./update.review.controller";
import handleReviewFetch from "./fetch.review.controller";
import handleCreateReview from "./create.review.controller";
import handleFetchUsersReview from "./fetchUser.review.constroller";
import handleDeleteReview from "./delete.review.controller";
import handleAdminUpdateReviewStatus from "./admin.updateReviewStatus.review.controller";
import handleGetReviewFilters from "./admin.getReviewFilters.review.controller";
import handleAdminNotifyStatus from "./admin.changeNotifyStatus.review.controller";

export {
  updateReview,
  handleReviewFetch,
  handleCreateReview,
  handleFetchUsersReview,
  handleDeleteReview,

  // admin
  handleAdminUpdateReviewStatus,
  handleGetReviewFilters,
  handleAdminNotifyStatus,
};
