export const ENV = process.env.NODE_ENV || "development";
export const API_URL = (ENV !== 'development')? "https://ryflect.ca" : "http://localhost:5000";