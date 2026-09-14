import { faculty, type FacultyMember } from "@/lib/data";
import Container, { SectionHeading } from "./Container";

/**
 * One face in the room. Until a person is signed the card leads with the seat —
 * what they are to the cohort — and carries a chip where the name will go. Add a
 * `name` in `lib/data.ts` and the card promotes it and drops the chip.
 */
function Member({ person, dark }: { person: FacultyMember; dark: boolean }) {
  return (
    <li className="group">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={person.alt}
          loading="lazy"
          decoding="async"
          width={640}
          height={640}
          sizes="(min-width: 1024px) 18rem, (min-width: 640px) 40vw, 45vw"
          className="ease-in-out-quart size-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-102"
          src={person.src}
        />
        {!person.name && (
          <span className="mono-text text-dark absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-1.5 backdrop-blur-sm">
            Named at kickoff
          </span>
        )}
      </div>
      <p className="mt-4 font-medium">{person.name ?? person.seat}</p>
      {person.name && <p className={`-mt-0.5 text-sm ${dark ? "text-white/50" : "text-dark-very-subtle"}`}>{person.seat}</p>}
      <p className={`mt-3 text-sm leading-tight ${dark ? "text-white/80" : "text-dark"}`}>{person.teaches}</p>
      <p className={`mt-1 text-xs leading-tight ${dark ? "text-white/50" : "text-dark-subtle"}`}>{person.note}</p>
    </li>
  );
}

/**
 * Who actually takes the classes: the investors who run the weekly masterclasses,
 * then the execution team that stays for the eighty days of building. Two panels,
 * light and dark, so the two rooms read as two different promises.
 */
export default function Faculty() {
  return (
    <section id="faculty" className="py-12 md:py-28">
      <Container>
        <SectionHeading lead="You don’t just get a studio. You get the room.">
          Ten live classes to plan the quarter, then a working investor in front of the cohort every week—and the same four named leads building beside you the whole time.
        </SectionHeading>

        <div className="mt-12 space-y-1.5 lg:mt-20">
          {faculty.map((group, i) => {
            const dark = i === faculty.length - 1;
            return (
              <div
                key={group.id}
                className={`rounded-xl border p-6 md:p-10 lg:p-14 ${dark ? "bg-darker border-transparent text-white" : "border-black/10 bg-gray-100"}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
                  <h3 className="max-w-[20ch] text-3xl font-medium md:text-4xl">{group.title}</h3>
                  <span className={`mono-text rounded-full border px-3 py-1.5 ${dark ? "border-white/25 text-white/70" : "text-dark border-black/20"}`}>
                    {group.kicker}
                  </span>
                </div>
                <p className={`mt-5 max-w-[42rem] text-sm ${dark ? "text-white/60" : "text-dark-subtle"}`}>{group.text}</p>
                <ul className="mt-10 grid grid-cols-2 gap-x-1.5 gap-y-9 sm:gap-x-3 lg:mt-14 lg:grid-cols-3 lg:gap-x-6">
                  {group.people.map((person) => (
                    <Member key={person.seat} person={person} dark={dark} />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="text-dark-very-subtle mt-8 max-w-[42rem] text-xs">
          Faculty is confirmed six weeks before each kickoff. Names and photographs go live as each person signs—the cards above stand in until they do.
        </p>
      </Container>
    </section>
  );
}
