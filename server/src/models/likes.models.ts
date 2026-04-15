import { prisma } from "../utils";

class LikeModel {
  // CREATE LIKE
  async addLike(user_id: number, post_id: number) {
  try {
    const like = await prisma.like.create({
      data: { user_id, post_id },
    });
    return like;
  } catch (err) {
    throw err;
  }
}

  // REMOVE LIKE

  async removeLike(user_id: number, post_id: number) {
  const result = await prisma.like.deleteMany({
    where: { user_id, post_id },
  });

  return result.count > 0;
}

  // CHECK IF EXISTS
  async isLiked(user_id: number, post_id: number) {
    const count = await prisma.like.count({
      where: { user_id, post_id },
    });

    return count > 0;
  }

    // TOGGLE LIKE 
  async toggleLike(user_id: number, post_id: number) {
    const exists = await this.isLiked(user_id, post_id);

    if (exists) {
      await this.removeLike(user_id, post_id);
      return {
        liked: false,
      };
    }

    await this.addLike(user_id, post_id);
    return {
      liked: true,
    };
  }
}

export const likeModel = new LikeModel();