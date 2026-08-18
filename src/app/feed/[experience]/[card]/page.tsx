import { notFound } from "next/navigation";
import { Feed } from "@/components/feed/feed";
import { resolveExperience, getTrack } from "@/lib/content/loader";

type FeedPageProps = {
  params: Promise<{ experience: string; card: string }>;
};

export default async function FeedPage({ params }: FeedPageProps) {
  const { experience: experienceId, card } = await params;

  let experience;
  try {
    experience = resolveExperience(experienceId);
  } catch {
    notFound();
  }

  const track = getTrack(experience.trackId);
  const parsed = Number(card);
  const initialIndex = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;

  return <Feed track={track} experience={experience} initialIndex={initialIndex} />;
}