import { User } from "../../../generated/prisma/client";
import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";

const UpdateUserProfile = async (
  data: Partial<User>,
  userid: string
) => {
  if (!data || Object.keys(data).length === 0) {
    throw new AppError(400, "No profile data provided for update.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userid },
    include: { accounts: true },
  });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  const isUserRole = user.role === "USER";

  // Prepare update data, only allowing email updates if not USER
  const updateData: Partial<User> = {
    name: data.name,
    image: data.image,
    bgimage: data.bgimage,
    phone: data.phone,
    isActive: data.isActive,
    ...(isUserRole ? {} : { email: data.email }),
  };

  const updatedUser = await prisma.user.update({
    where: { id: userid },
    data: updateData,
  });

  return updatedUser;
};

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

export const UserService = {
  UpdateUserProfile,
  OwnProfileDelete
};
