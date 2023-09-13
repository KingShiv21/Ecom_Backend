
export function createCookie(user,res,statusCode){
    const token = user.getJwtToken()

    const cookieOptions = {
        httpOnly:true,
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE_DAYS * 24 * 60 * 60 * 1000  
        )
    }

    res
    .status(statusCode)
    .cookie("token", token , { cookieOptions })
    .json({
        success: true,
        token,
    })
} 