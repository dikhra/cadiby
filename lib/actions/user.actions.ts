"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "../database/prisma";
import { handleError } from "../utils";

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    const newUser = await prisma.user.create({ data: user });

    return newUser;
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    const updatedUser = await prisma.user.update({
      where: { clerkId },
      data: user,
    });

    return updatedUser;
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    const userToDelete = await prisma.user.findUnique({ where: { clerkId } });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    const deletedUser = await prisma.user.delete({
      where: { id: userToDelete.id },
    });

    revalidatePath("/");

    return deletedUser;
  } catch (error) {
    handleError(error);
  }
}

// USE CREDITS
export async function updateCredits(userId: string, creditFee: number) {
  try {
    const updatedUserCredits = await prisma.user.update({
      where: { id: userId },
      data: { creditBalance: { increment: creditFee } },
    });

    return updatedUserCredits;
  } catch (error) {
    handleError(error);
  }
}
