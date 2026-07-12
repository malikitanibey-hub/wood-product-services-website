type TextSection = {
  id: string;
  title: string;
  body?: string;
  active: boolean;
};
export function CmsTextSections({
  sections = [],
}: {
  sections?: TextSection[];
}) {
  const visible = sections.filter((section) => section.active);
  if (!visible.length) return null;
  return (
    <section
      className="mx-auto grid max-w-[1000px] gap-5 px-6 py-16 md:grid-cols-2 md:px-12"
      aria-label="Homepage content sections"
    >
      {visible.map((section) => (
        <article
          key={section.id}
          className="group rounded-2xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[#7897c0]/70 hover:bg-white/[0.08] hover:shadow-[0_18px_40px_rgba(0,0,0,.3)]"
        >
          <h2 className="text-2xl font-medium uppercase transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#9dbce0]">{section.title}</h2>
          {section.body && (
            <p className="mt-4 leading-7 text-gray-300 transition-colors group-hover:text-white">{section.body}</p>
          )}
        </article>
      ))}
    </section>
  );
}
