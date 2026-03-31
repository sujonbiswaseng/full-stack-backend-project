import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";

const OwnProfileDelete = async (userid: string) => {
    console.log(userid);
    const userData = await prisma.user.findUnique({
      where: { id: userid },
    });
    if (!userData) {
      throw new AppError(404,"your user data not found");
    }
    const result = await prisma.user.delete({
      where: { id: userid },
    });
    return result;
  };

  export const UserService={
    OwnProfileDelete
  }