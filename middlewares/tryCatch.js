export const catchAsyncErrors = theFunc => (req,res,next) =>{
    Promise.resolve(theFunc(req,res,next)).catch(next)
}

// so this next will call error handler function (without errorHandler class) 
// if next is given errorhandler class obj, then that will call