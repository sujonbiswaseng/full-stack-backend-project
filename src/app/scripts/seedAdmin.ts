import "dotenv/config";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";
import AppError from "../errorHelper/AppError";

export const seedAdmin = async () => {

  try {
   const result= await auth.api.signUpEmail({
    body: {
      name: "admin12",
      email: "admin123@gmail.com", 
      password: "Admin12!@",
      emailVerified:true,
      image: "https://images.pexels.com/users/avatars/2159489466/sujon-biswas-288.jpg?auto=compress&fit=crop&h=140&w=140&dpr=1",
      phone: "01804935939",
      role:"ADMIN",
    },
  });
  if(!result){
    throw new AppError(400,'user created fail')
  }
  return {success:true,message:"user created successfully",data:result}

  } catch (error) {
     throw new AppError(500,'something went wrong ,please try again')
  }
};

seedAdmin();
