import * as DiscussionRepository from "./discussion.repository.js";

const toDTO = (d) => ({
  id: d.id,
  title: d.title,
  snippet:
    d.content.length > 140 ? `${d.content.slice(0, 140)}…` : d.content,
  tag: d.tag,
  replies: d._count.comments,
  likes: d._count.likes,
  author: d.user.profile?.displayName || d.user.name,
  createdAt: d.createdAt,
});

export const listDiscussionsService = async () => {
  const rows = await DiscussionRepository.findDiscussions();
  return rows.map(toDTO);
};

export const createDiscussionService = async (userId, data) => {
  const row = await DiscussionRepository.createDiscussion({
    userId,
    title: data.title,
    content: data.content,
    tag: data.tag,
  });
  return {
    id: row.id,
    title: row.title,
    snippet:
      row.content.length > 140
        ? `${row.content.slice(0, 140)}…`
        : row.content,
    tag: row.tag,
    replies: 0,
    likes: 0,
    createdAt: row.createdAt,
  };
};
