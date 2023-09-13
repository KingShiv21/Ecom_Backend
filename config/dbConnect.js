import mongoose from "mongoose";

export const db_connect = () => {


    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,   (not supported)
    }).then(
        (c) => { console.log(`db connected with ${c.connection.host}`) }
    )


}