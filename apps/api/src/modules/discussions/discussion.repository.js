import prisma from "../../db.js";

export const findDiscussions = async () => {
  return await prisma.discussion.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      tag: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          profile: { select: { displayName: true } },
        },
      },
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const createDiscussion = async ({ userId, title, content, tag }) => {
  return await prisma.discussion.create({
    data: { userId, title, content, tag: tag || null },
    select: { id: true, title: true, content: true, tag: true, createdAt: true },
  });
};
