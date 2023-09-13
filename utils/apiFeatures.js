export class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    
    //  for search (th. name of product)
    search() {
        const findObject = (this.queryStr.keyword) ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            },
        } : {};

        // updating query (not executing)
        this.query = this.query.find({ ...findObject })
        return this
    }

    filter() {

        // filter for category
        let queryStrCopy = { ...this.queryStr }   // copy value of queryStr object, not org(call by ref)
        const removingFields = ["keyword", "page", "limit"]
        removingFields.forEach((key) => delete queryStrCopy[key])

        // filetr also with price
        // addding dollar sig before gt,gte,, due to mongodb find rules
        let queryStr = JSON.stringify(queryStrCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        // updating query (not executing)
        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }


    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1
        const skip = resultPerPage * (currentPage - 1)

        this.query = this.query.limit(resultPerPage).skip(skip)
        return this
    }
}