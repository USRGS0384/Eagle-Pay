import dotenv from "dotenv";

dotenv.config();

export default {
    MONGO_URI: process.env.MONGO_URI,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT || 5000,
};

