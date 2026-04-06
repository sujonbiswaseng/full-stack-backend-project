import "dotenv/config";
import { auth } from "../lib/auth";

export const seedAdmin = async () => {
  try {
   const result= await auth.api.signUpEmail({
    body: {
      name: "admin12",
      email: "admin1@gmail.com", 
      password: "Admin12!@",
      emailVerified:true,
      image: "https://images.pexels.com/users/avatars/2159489466/sujon-biswas-288.jpg?auto=compress&fit=crop&h=140&w=140&dpr=1",
      phone: "01804935939",
      role:"ADMIN",
    },
  });
  if(!result){
    console.log('fail create user')
  }
  return {success:true,message:"user created successfully",data:result}

  } catch (error) {
    console.log(error,'errror')
  }
};

seedAdmin();
