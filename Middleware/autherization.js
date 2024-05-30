// this middleware used for authorization for the user, it verify token and allow user accourding to it

import jwt from "jsonwebtoken";

import UnauthenticatedError from "../errors/unauthenticated.js";

const autherization = async (req, res, next) => {
  console.log('request came here')
   const header = req.headers.authorization
      if(!header || !header.startsWith('Bearer'))
          throw new UnauthenticatedError('Authentication invalid')
  const token = header.substring(7, header.length - 1);
  // const token = req.cookies.access_token;
  if (!token) throw new UnauthenticatedError("Your not authenticated!");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Token is invalid");
  }
};

export const verifyAdmin = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) throw new UnauthenticatedError("Your not authenticated!");
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if(payload.isAdmin)
    next();
  else throw new UnauthenticatedError('Your not admin to perform this operation')
};

export default autherization;
