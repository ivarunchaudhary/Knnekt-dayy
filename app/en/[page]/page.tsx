import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { containerClass } from "@/components/Container";

const pages: Record<string, string> = {
  "privacy-policy": "Datenschutzerklärung",
  imprint: "Impressum",
  "terms-and-conditions": "AGB",
};

export function generateStaticParams() {
  return Object.keys(pages).map((page) => ({ page }));
}

export default async function LegalPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const title = pages[page];
  if (!title) notFound();

  return (
    <div className="bg-white">
      <Nav />
      <main className={`${containerClass} min-h-[70vh] pt-16 pb-24`}>
        <Link href="/en" className="mono-text text-dark-subtle hover:text-dark font-mono">
          ← Back
        </Link>
        <h1 className="mt-16 text-3xl font-medium md:text-4xl">{title}</h1>
        <p className="text-dark-subtle mt-10 max-w-[36rem]">Content coming soon.</p>
      </main>
      <Footer />
    </div>
  );
}
