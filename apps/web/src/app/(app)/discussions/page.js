"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatIcon, HeartIcon } from "@/components/ui/icons";
import { getDiscussions, createDiscussion } from "@/lib/api/discussions";
import { formatDate } from "@/lib/profileView";
import Button from "@/components/ui/Button";

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setDiscussions(await getDiscussions());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setFormError("");
    try {
      const created = await createDiscussion({
        title: title.trim(),
        content: content.trim(),
        tag: tag.trim() || undefined,
      });
      setDiscussions((prev) => [created, ...(prev || [])]);
      setTitle("");
      setContent("");
      setTag("");
      setFormOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">Discussions</h1>
          <p className="mt-2 max-w-[56ch] text-15 leading-[1.5] text-steel">
            Ask questions, share shortcuts, and help fellow aspirants.
          </p>
        </div>
        <Button variant="primary" onClick={() => setFormOpen((v) => !v)}>
          New Discussion
        </Button>
      </header>

      {/* New discussion form */}
      {formOpen && (
        <form
          onSubmit={handleCreate}
          className="mt-8 rounded-2xl border border-mist bg-canvas p-6"
        >
          <div className="grid gap-4">
            <div>
              <label className="font-polysans text-13 text-graphite" htmlFor="discussion-title">
                Title
              </label>
              <input
                id="discussion-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you want to discuss?"
                className="mt-1.5 h-10 w-full rounded-lg border border-mist bg-fog px-3 text-15 text-graphite placeholder:text-slate/60 focus:border-graphite focus:outline-none"
              />
            </div>
            <div>
              <label className="font-polysans text-13 text-graphite" htmlFor="discussion-content">
                Details
              </label>
              <textarea
                id="discussion-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share context, what you tried, where you're stuck…"
                rows={4}
                className="mt-1.5 w-full rounded-lg border border-mist bg-fog px-3 py-2.5 text-15 text-graphite placeholder:text-slate/60 focus:border-graphite focus:outline-none"
              />
            </div>
            <div>
              <label className="font-polysans text-13 text-graphite" htmlFor="discussion-tag">
                Tag <span className="text-slate">(optional)</span>
              </label>
              <input
                id="discussion-tag"
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. Probability"
                className="mt-1.5 h-10 w-full rounded-lg border border-mist bg-fog px-3 text-15 text-graphite placeholder:text-slate/60 focus:border-graphite focus:outline-none"
              />
            </div>
          </div>

          {formError && (
            <p className="mt-3 text-13 text-ember">{formError}</p>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {saving ? "Posting…" : "Post Discussion"}
            </Button>
          </div>
        </form>
      )}

      <div className="mt-10">
        {loading ? (
          <p className="text-13 text-slate">Loading discussions…</p>
        ) : error ? (
          <div className="rounded-2xl bg-ash p-6 text-13 text-steel">
            <p>Couldn&apos;t load discussions: {error}</p>
            <button
              type="button"
              onClick={load}
              className="mt-3 font-polysans text-graphite underline underline-offset-2 hover:text-ember"
            >
              Try again
            </button>
          </div>
        ) : discussions.length === 0 ? (
          <div className="rounded-2xl bg-ash px-6 py-12 text-center">
            <p className="text-15 text-steel">
              No discussions yet — start the first one.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-mist rounded-2xl bg-ash px-6">
            {discussions.map((d) => (
              <article key={d.id} className="py-5 first:pt-7 last:pb-7">
                <p className="font-polysans text-base tracking-[-0.02em] text-graphite transition-colors hover:text-ember">
                  {d.title}
                </p>
                <p className="mt-2 max-w-[70ch] text-13 leading-[1.5] text-steel">
                  {d.snippet}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-13 text-slate">
                  {d.tag && (
                    <span className="rounded-tags bg-canvas px-2.5 py-0.5 text-13 text-brass">
                      {d.tag}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <ChatIcon className="h-3.5 w-3.5" />
                    {d.replies} replies
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HeartIcon className="h-3.5 w-3.5" />
                    {d.likes} likes
                  </span>
                  <span>
                    {d.author} · {formatDate(d.createdAt)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
