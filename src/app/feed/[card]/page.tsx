import { Feed } from "@/components/feed/feed";

type FeedPageProps = {
  params: Promise<{ card: string }>;
};

export default async function FeedPage({ params }: FeedPageProps) {
  const { card } = await params;
  const parsed = Number(card);
  const initialIndex = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  return <Feed initialIndex={initialIndex} />;
}