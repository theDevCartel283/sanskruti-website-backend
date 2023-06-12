class ApiFeatures {
  query: any;
  queryStr: any;

  constructor(query: any, queryStr: any) {
    this.query = query;
    this.queryStr = queryStr;
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
    // console.log(queryCopy)
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);
    // console.log(queryCopy)

    //Filter for price and Rating
    // console.log("before: ",queryCopy);
    let queryStr = JSON.stringify(queryCopy);
    // console.log("after: ",queryStr);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    // console.log(this)
    return this;
  }

  pagination(resultperpage: number) {
    const currentpage: number = Number(this.queryStr.page) || 1;

    const skip: number = resultperpage * (currentpage - 1);

    this.query = this.query.limit(resultperpage).skip(skip);

    return this;
  }
}
export default ApiFeatures;
