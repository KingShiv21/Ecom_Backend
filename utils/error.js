export class ErrorHandler extends Error {
    constructor(message, status) {
        super(message),
            this.status = status
    }
}

export const errorHandler = (err, req, res, next) => {

    err.status = err.status || 400
    err.message = err.message || "internal error occured"


    // for some small diff errors
    if (err.name === "CastError") {
        err.status = 400
        err.message = `Resource not found. Invalid ${err.path}`
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        err.status = 400
        err.message = `Duplicate ${Object.keys(err.keyValue)} entered`
    }

    // Wrong JWT error

    if (err.name === "JsonWebTokenError") {
        err.status = 400
        err.message = `Json Web Token is invalid, Try again`
    }

    // JWT EXPIRE error

    if (err.name === "TokenExpiredError") {
        err.status = 400
        err.message = `Json Web Token is Expired, Try again `
    }

    res.status(err.status).json({
        success: false,
        message: err.message
    })
}