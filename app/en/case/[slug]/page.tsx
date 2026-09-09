import Link from "next/link";
import { notFound } from "next/navigation";
import { work } from "@/lib/data";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { containerClass } from "@/components/Container";

export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = work.find((w) => w.slug === slug);
  if (!item) notFound();

  return (
    <div className="bg-white">
      <Nav />
      <main className={`${containerClass} min-h-[70vh] pt-16 pb-24`}>
        <Link href="/en" className="mono-text text-dark-subtle hover:text-dark font-mono">
          ← Back
        </Link>
        <p className="mt-16 text-dark-subtle">{item.client}</p>
        <h1 className="mt-2 text-3xl font-medium md:text-4xl">{item.title}</h1>
        <p className="text-dark-subtle mt-10 max-w-[36rem]">Case study content coming soon.</p>
      </main>
      <Footer />
    </div>
  );
}
