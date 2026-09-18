import { faculty, type FacultyGroup, type FacultyMember } from "@/lib/data";
import Container, { SectionHeading } from "./Container";

const img = (person: FacultyMember, sizes: string, className: string) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    alt={person.alt}
    loading="lazy"
    decoding="async"
    width={400}
    height={400}
    sizes={sizes}
    className={`size-full object-cover ${className}`}
    src={person.src}
  />
);

/**
 * The masterclasses are a timetable, so they are drawn as one: a ruled syllabus
 * where each row is a class. The class leads — it's the thing a founder is buying —
 * and the investor sits beside it as a small portrait and a seat, since until each
 * person is signed the seat is the promise and the face is a stand-in.
 */
function Syllabus({ group }: { group: FacultyGroup }) {
  return (
    <ol className="border-t border-dark/15">
      {group.people.map((person) => (
        <li
          key={person.seat}
          className="grid grid-cols-[3.25rem_1fr] items-start gap-x-4 border-b border-dark/15 py-5 sm:grid-cols-[3.25rem_1fr_11rem] sm:gap-x-6 lg:py-6"
        >
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-200">{img(person, "3.25rem", "")}</div>
          <div className="min-w-0">
            <p className="text-lg leading-tight font-medium lg:text-xl">{person.teaches}</p>
            <p className="text-dark-subtle mt-1.5 max-w-[38rem] text-sm leading-snug">{person.note}</p>
            <p className="mono-text text-dark/70 mt-2.5 sm:hidden">{person.name ?? person.seat}</p>
          </div>
          <div className="hidden sm:block sm:pt-0.5">
            <p className="text-sm leading-snug font-medium">{person.name ?? person.seat}</p>
            <p className="text-dark-very-subtle mt-0.5 text-xs leading-snug">{person.name ? person.seat : "Named at kickoff"}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * The execution team is the opposite promise — the same faces, all at once, all
 * quarter — so it is drawn as one lineup: six portraits butted into a single strip
 * with hairline gaps, the way a team stands for a photograph, with each person's
 * seat and what they own underneath their column.
 */
function Lineup({ group }: { group: FacultyGroup }) {
  return (
    <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-px lg:gap-y-0 lg:overflow-hidden lg:rounded-xl">
      {group.people.map((person) => (
        <li key={person.seat} className="flex min-w-0 flex-col overflow-hidden rounded-lg lg:rounded-none">
          <div className="aspect-[4/5] shrink-0 overflow-hidden bg-gray-200">
            {img(person, "(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw", "")}
          </div>
          <div className="grow bg-white/55 px-3.5 pt-4 pb-5">
            <p className="leading-tight font-medium">{person.name ?? person.seat}</p>
            {person.name && <p className="text-dark-very-subtle mt-0.5 text-xs">{person.seat}</p>}
            <p className="mt-3 text-sm leading-snug">{person.teaches}</p>
            <p className="text-dark-subtle mt-1 text-xs leading-snug">{person.note}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * Who actually takes the classes: the investors who run the weekly masterclasses,
 * then the execution team that stays for the eighty days of building. The two rooms
 * are two different promises — one person a week versus the same six people every
 * week — so they get two different forms rather than the same grid twice: a
 * syllabus for the classes, a lineup for the team. The panels still step down the
 * sky ramp, `gray-100` then the deeper `panel`, to keep them as siblings.
 */
export default function Faculty() {
  const [investors, studio] = faculty;
  return (
    <section id="faculty" className="py-12 md:py-28">
      <Container>
        <SectionHeading lead="You don’t just get a studio. You get the room.">
          Ten live classes to plan the quarter, then a working investor in front of the cohort every week—and the same four named leads building beside you the whole time.
        </SectionHeading>

        <div className="mt-12 space-y-1.5 lg:mt-20">
          {/* Room one: the masterclasses, as a syllabus beside a sticky introduction. */}
          <div className="rounded-xl border border-dark/10 bg-gray-100 p-6 md:p-10 lg:p-14">
            <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:gap-x-20">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <span className="mono-text text-dark inline-block rounded-full border border-dark/20 px-3 py-1.5">{investors.kicker}</span>
                <h3 className="mt-6 max-w-[16ch] text-3xl font-medium md:text-4xl">{investors.title}</h3>
                <p className="text-dark-subtle mt-5 max-w-[34rem] text-sm">{investors.text}</p>
              </div>
              <Syllabus group={investors} />
            </div>
          </div>

          {/* Room two: the execution team, as one lineup under its introduction. */}
          <div className="bg-panel rounded-xl p-6 md:p-10 lg:p-14">
            <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
              <div>
                <span className="mono-text text-dark inline-block rounded-full border border-dark/20 px-3 py-1.5">{studio.kicker}</span>
                <h3 className="mt-6 max-w-[16ch] text-3xl font-medium md:text-4xl">{studio.title}</h3>
              </div>
              <p className="text-dark/80 max-w-[34rem] text-sm lg:pb-1">{studio.text}</p>
            </div>
            <div className="mt-10 lg:mt-14">
              <Lineup group={studio} />
            </div>
          </div>
        </div>

        <p className="text-dark-very-subtle mt-8 max-w-[42rem] text-xs">
          Faculty is confirmed six weeks before each kickoff. Names and photographs go live as each person signs—the portraits above stand in until they do.
        </p>
      </Container>
    </section>
  );
}
