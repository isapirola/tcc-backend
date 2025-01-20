export const config = {
  dbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/myapp",
  port: process.env.PORT || 5000,
};
