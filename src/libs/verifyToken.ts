import {Request, Response, NextFunction} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken'

export const TokenValidation = (req: Request, res: Response, next: NextFunction) => {
  const tokenRequest = req.header('token') || ''; 
  // Validate invalid request
  if(!tokenRequest) {
    res.status(401).send('Invalid request bro! Token needed');
    return;  // Stop flow
  }

  // Validate Token
  console.log("token Validation");
  let payload: JwtPayload;
  try {
    // Validate token autenticity and get decoded info
    payload = jwt.verify(tokenRequest, process.env.SECRET_TOKEN || 'testsecrettoken');
    // Create userId attribute in HTTP Request
    req.userId = payload._id;
    // Go to original destination resource
    next();
  } catch (err) {
    console.log("Catch error jwt.verify()");
    res.status(401).json('Invalid token');
    console.log(err);
    return; // Stop flow
  }
}