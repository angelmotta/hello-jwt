import {Request, Response} from 'express';
import UserModel, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';

export const signup = async (req: Request, res: Response) => {
  console.log(req.body);

  // Create Mongo Model
  const user = new UserModel({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  // Update password with hashed data in UserModel
  user.password = user.encryptPassword(user.password);

  // Saving UserModel in MongoDB
  let savedUser: Document<IUser>;
  try {
    // Save User in MongoDB
    savedUser =  await user.save();
    // Generate Token
    const token: string = jwt.sign({_id: savedUser._id}, process.env.SECRET_TOKEN || 'testsecrettoken');
    // Send Response: Include token in HTTP Header and Json Body
    res.header('Authorization', token).json(savedUser);
  } catch (err) {
    console.log(`Catched error:`);
    console.log(err);
    if (err instanceof Error) {
      if (err.name === "MongooseServerSelectionError") {
        res.send(`Sorry Bro. Service is not available`);
      } else if (err.message.split(" ")[0] === "E11000") {
        res.send(`Signup failed. Email already registered`)
      }
    }
  }
}

export const signin = async (req: Request, res: Response) => {
  // Find User in MongoDB
  const userFound = await UserModel.findOne({email: req.body.email});
  if (!userFound) return res.status(400).json('Sorry bro! Email not registered');
  // Check credentials
  const isValidPass = userFound.isValidPassword(req.body.password);
  if (!isValidPass) return res.status(400).json('Sorry bro! Invalid password');
  // Generate Token
  const token: string = jwt.sign({_id: userFound._id}, process.env.SECRET_TOKEN || 'defaultsecret', { expiresIn: 60 * 10});
  // Send Response: Include token in HTTP Header and Json body
  res.header('Authorization', token).json(userFound); 
}

export const profile = async (req: Request, res: Response) => {  
  console.log(`-- Call Profile --`);
  // Defensive check
  if (!req.userId) {  // Request not identified (unkown user)
    // Check if HTTP Response was already sent
    if (res.headersSent) return;
    // Send HTTP Response
    return res.status(404).json("Sorry bro something wrong happened. I don't know who you are");
  }
  // Retrieve information from user
  UserModel.findById(req.userId)
  .then(user => {
    console.log("user: ", user);
    // Send Json Response
    res.json(user);   
  })
  .catch(err => {
    console.log(err);
    return res.status(404).json("Something happened. User not found!");
  });
}