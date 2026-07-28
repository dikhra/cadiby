"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";

import { prisma } from "../database/prisma";
import { handleError } from "../utils";

const authorSelect = {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    clerkId: true,
  },
};

// ADD IMAGE
export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    const author = await prisma.user.findUnique({ where: { id: userId } });

    if (!author) {
      throw new Error("User not found");
    }

    const newImage = await prisma.image.create({
      data: {
        ...image,
        author: { connect: { id: author.id } },
      },
    });

    revalidatePath(path);

    return newImage;
  } catch (error) {
    handleError(error);
  }
}

// UPDATE IMAGE
export async function updateImage({ image, userId, path }: UpdateImageParams) {
  try {
    const imageToUpdate = await prisma.image.findUnique({
      where: { id: image.id },
    });

    if (!imageToUpdate || imageToUpdate.authorId !== userId) {
      throw new Error("Unauthorized or image not found");
    }

    const { id, ...data } = image;

    const updatedImage = await prisma.image.update({
      where: { id },
      data,
    });

    revalidatePath(path);

    return updatedImage;
  } catch (error) {
    handleError(error);
  }
}

// DELETE IMAGE
export async function deleteImage(imageId: string) {
  try {
    await prisma.image.delete({ where: { id: imageId } });
  } catch (error) {
    handleError(error);
  } finally {
    redirect("/");
  }
}

// GET IMAGE
export async function getImageById(imageId: string) {
  try {
    const image = await prisma.image.findUnique({
      where: { id: imageId },
      include: { author: authorSelect },
    });

    if (!image) throw new Error("Image not found");

    return image;
  } catch (error) {
    handleError(error);
  }
}

// GET IMAGES
export async function getAllImages({
  limit = 9,
  page = 1,
  searchQuery = "",
}: {
  limit?: number;
  page: number;
  searchQuery?: string;
}) {
  try {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    let expression = "folder=cadiby";

    if (searchQuery) {
      expression += ` AND ${searchQuery}`;
    }

    const { resources } = await cloudinary.search
      .expression(expression)
      .execute();

    const resourceIds = resources.map((resource: any) => resource.public_id);

    const where = searchQuery
      ? { publicId: { in: resourceIds as string[] } }
      : {};

    const skipAmount = (Number(page) - 1) * limit;

    const images = await prisma.image.findMany({
      where,
      include: { author: authorSelect },
      orderBy: { updatedAt: "desc" },
      skip: skipAmount,
      take: limit,
    });

    const totalImages = await prisma.image.count({ where });
    const savedImages = await prisma.image.count();

    return {
      data: images,
      totalPage: Math.ceil(totalImages / limit),
      savedImages,
    };
  } catch (error) {
    handleError(error);
  }
}

// GET IMAGES BY USER
export async function getUserImages({
  limit = 9,
  page = 1,
  userId,
}: {
  limit?: number;
  page: number;
  userId: string;
}) {
  try {
    const skipAmount = (Number(page) - 1) * limit;

    const images = await prisma.image.findMany({
      where: { authorId: userId },
      include: { author: authorSelect },
      orderBy: { updatedAt: "desc" },
      skip: skipAmount,
      take: limit,
    });

    const totalImages = await prisma.image.count({
      where: { authorId: userId },
    });

    return {
      data: images,
      totalPages: Math.ceil(totalImages / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
