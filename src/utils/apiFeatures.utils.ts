class ApiFeatures {
  query: any;
  queryStr: any;

  constructor(query: any, queryStr: any) {
    this.query = query;
    this.queryStr = queryStr;
  }

  searchForBanner() {
    const keyword: any = this.queryStr.keyword
      ? {
          $or: [
            {
              type: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  searchForCoupon() {
    const keyword: any = this.queryStr.keyword
      ? {
          $or: [
            {
              name: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  searchForVarient() {
    const keyword: any = this.queryStr.keyword
      ? {
          $or: [
            {
              varientName: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  searchForSubCategory() {
    const keyword: any = this.queryStr.keyword
      ? {
          $or: [
            {
              Category: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  search() {
    const keyword: any = this.queryStr.keyword
      ? {
          $or: [
            {
              name: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              MainCategory: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              SubCategory: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              Title: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    //Removing some fields for category
    // console.log(queryCopy);
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);
    // console.log(queryCopy)

    //Filter for price and Rating
    // console.log("before: ",queryCopy);
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    // console.log(this)
    return this;
  }

  orderFilter(orderArr: any, paymentArr: any) {
    const queryCopy = { ...this.queryStr };
    console.log(queryCopy);
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);
    const orders = orderArr.map((order: any) => {
      const payment = paymentArr.find(
        (pay: any) => pay.orderId === order.orderId
      );
      return {
        order,
        payment,
      };
    });
    if (queryCopy.date === "" && queryCopy.status === "") {
      const result = orders.filter((item: any) => {
        return true;
      });
      this.query = result;
      return this;
    } else if (queryCopy.date !== "" && queryCopy.status === "") {
      const result = orders.filter((item: any) => {
        return (
          item.payment?.orderInfo.Date.toISOString().substring(0, 10) ===
          queryCopy.date
        );
      });
      this.query = result;
      return this;
    } else if (queryCopy.date === "" && queryCopy.status !== "") {
      let result;
      if (queryCopy.status === "On delivery") {
        if (queryCopy.type !== "") {
          result = orders.filter((item: any) => {
            return item.order.deliveryInfo.status === queryCopy.type;
          });
          this.query = result;
          return this;
        } else {
          const result = orders.filter((item: any) => {
            return true;
          });
          this.query = result;
          return this;
        }
      } else if (queryCopy.status === "On return") {
        if (queryCopy.type !== "") {
          result = orders.filter((item: any) => {
            return (
              item.order.returnInfo.isReturned.toString() === "true" &&
              item.order.returnInfo.status === queryCopy.type
            );
          });
          this.query = result;
          return this;
        } else {
          result = orders.filter((item: any) => {
            return item.order.returnInfo.isReturned.toString() === "true";
          });
          this.query = result;
          return this;
        }
      } else if (queryCopy.status === "Cancelled") {
        if (queryCopy.type !== "") {
          result = orders.filter((item: any) => {
            return (
              item.order.cancellationInfo.isCancelled.toString() === "true" &&
              item.order.cancellationInfo.Amount_refunded.toString() ===
                queryCopy.type
            );
          });
          this.query = result;
          return this;
        } else {
          result = orders.filter((item: any) => {
            return (
              item.order.cancellationInfo.isCancelled.toString() === "true"
            );
          });
          this.query = result;
          return this;
        }
      } else {
        const result = orders.filter((item: any) => {
          return true;
        });
        this.query = result;
        return this;
      }
    } else {
      let result;
      if (queryCopy.status === "On delivery") {
        if (queryCopy.type !== "") {
          result = orders.filter((item: any) => {
            return (
              item.order.deliveryInfo.status === queryCopy.type &&
              item.payment?.orderInfo.Date.toISOString().substring(0, 10) ===
                queryCopy.date
            );
          });
          this.query = result;
          return this;
        } else {
          const result = orders.filter((item: any) => {
            return (
              item.payment?.orderInfo.Date.toISOString().substring(0, 10) ===
              queryCopy.date
            );
          });
          this.query = result;
          return this;
        }
      } else if (queryCopy.status === "On return") {
        if (queryCopy.type !== "") {
          result = orders.filter((item: any) => {
            return (
              item.order.returnInfo.isReturned.toString() === "true" &&
              item.order.returnInfo.status === queryCopy.type &&
              item.payment?.orderInfo.Date.toISOString().substring(0, 10) ===
                queryCopy.date
            );
          });
          this.query = result;
          return this;
        } else {
          result = orders.filter((item: any) => {
            return (
              item.order.returnInfo.isReturned.toString() === "true" &&
              item.payment?.orderInfo.Date.toISOString().substring(0, 10) ===
                queryCopy.date
            );
          });
          this.query = result;
          return this;
        }
      } else if (queryCopy.status === "Cancelled") {
        if (queryCopy.type !== "") {
          result = orders.filter((item: any) => {
            return (
              item.order.cancellationInfo.isCancelled.toString() === "true" &&
              item.order.cancellationInfo.Amount_refunded.toString() ===
                queryCopy.type &&
              item.payment?.orderInfo.Date.toISOString().substring(0, 10) ===
                queryCopy.date
            );
          });
          this.query = result;
          return this;
        } else {
          result = orders.filter((item: any) => {
            return (
              item.order.cancellationInfo.isCancelled.toString() === "true" &&
              item.payment?.orderInfo.Date.toISOString().substring(0, 10) ===
                queryCopy.date
            );
          });
          this.query = result;
          return this;
        }
      } else {
        const result = orders.filter((item: any) => {
          return (
            item.payment?.orderInfo.Date.toISOString().substring(0, 10) ===
            queryCopy.date
          );
        });
        this.query = result;
        return this;
      }
    }
  }

  pagination(resultperpage: number) {
    const currentpage: number = Number(this.queryStr.page) || 1;

    const skip: number = resultperpage * (currentpage - 1);

    this.query = this.query.limit(resultperpage).skip(skip);

    return this;
  }
}
export default ApiFeatures;
