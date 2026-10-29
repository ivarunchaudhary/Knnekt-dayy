import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { containerClass } from "@/components/Container";
import { privacyPolicy, termsAndConditions, type Block, type LegalDoc, type Para } from "@/lib/legal";

const pages: Record<string, string> = {
  "privacy-policy": "Privacy Policy",
  imprint: "Imprint",
  "terms-and-conditions": "Terms & Conditions",
};

const documents: Record<string, LegalDoc> = {
  "privacy-policy": privacyPolicy,
  "terms-and-conditions": termsAndConditions,
};

const columns: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

export function generateStaticParams() {
  return Object.keys(pages).map((page) => ({ page }));
}

function Text({ value }: { value: Para }) {
  if (typeof value === "string") return <>{value}</>;
  return (
    <>
      <strong className="font-semibold text-dark">{value.lead}</strong> {value.text}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  if ("p" in block) return <p className="text-dark-subtle mt-5 max-w-[40rem] leading-relaxed">{<Text value={block.p} />}</p>;

  if ("ul" in block)
    return (
      <ul className="text-dark-subtle mt-5 max-w-[40rem] list-disc space-y-2 pl-5 leading-relaxed">
        {block.ul.map((item, i) => (
          <li key={i}>
            <Text value={item} />
          </li>
        ))}
      </ul>
    );

  const { head, rows } = block.table;
  const cols = columns[head.length] ?? "";
  return (
    <div className="mt-6 max-w-[48rem] border-t border-black/15">
      <div className={`text-dark hidden gap-6 border-b border-black/15 py-2 text-sm font-semibold md:grid ${cols}`}>
        {head.map((h) => (
          <div key={h}>{h}</div>
        ))}
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className={`border-b border-black/10 py-3 md:grid md:gap-6 md:py-3 ${cols}`}
        >
          {row.map((cell, j) => (
            <div key={j} className={j === 0 ? "text-dark font-medium" : "text-dark-subtle"}>
              {head.length > 1 && (
                <span className="text-dark-subtle mb-0.5 block text-xs font-semibold md:hidden">{head[j]}</span>
              )}
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function LegalDocument({ doc, title }: { doc: LegalDoc; title: string }) {
  return (
    <>
      <h1 className="mt-16 text-3xl font-medium md:text-4xl">{title}</h1>
      <p className="text-dark-subtle mt-3 text-sm">Knnekt Studios, a brand of Qolorr Retail Private Limited</p>
      <p className="text-dark-subtle mt-1 text-sm">Effective {doc.effective}</p>

      {doc.sections.map((s, i) => (
        <section key={s.title} id={`section-${i + 1}`} className="mt-14 scroll-mt-24">
          <h2 className="text-dark text-xl font-semibold">
            <span className="text-dark-subtle mr-3 font-normal">{i + 1}.</span>
            {s.title}
          </h2>
          {s.blocks.map((block, j) => (
            <BlockView key={j} block={block} />
          ))}
        </section>
      ))}

      <p className="text-dark-subtle mt-14 max-w-[40rem] border-t border-black/15 pt-6 text-sm">{doc.footer}</p>
    </>
  );
}

export default async function LegalPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const title = pages[page];
  if (!title) notFound();
  const doc = documents[page];

  return (
    <div className="bg-white">
      <Nav />
      <main className={`${containerClass} min-h-[70vh] pt-16 pb-24`}>
        <Link href="/en" className="mono-text text-dark-subtle hover:text-dark font-mono">
          ← Back
        </Link>
        {doc ? (
          <LegalDocument doc={doc} title={title} />
        ) : (
          <>
            <h1 className="mt-16 text-3xl font-medium md:text-4xl">{title}</h1>
            <p className="text-dark-subtle mt-10 max-w-[36rem]">Content coming soon.</p>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
