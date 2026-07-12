import Image from "next/image";

export type WoodProduct = {
  id: number;
  name: string;
  category: string;
  image?: string;
  characteristics: string[];
  active: boolean;
  displayOrder: number;
};
const defaults: WoodProduct[] = [
  {
    id: 1,
    name: "Oak",
    category: "Hardwood",
    image: "/images/old-wood-grain-background 2.png",
    characteristics: [
      "+Durability",
      "+Beautiful texture",
      "+Water resistance",
      "-Expensive",
    ],
    active: true,
    displayOrder: 1,
  },
  {
    id: 2,
    name: "Buk",
    category: "Hardwood",
    image: "/images/wood-texture-design-decoration 1.png",
    characteristics: ["+Durability", "-Hard to handle"],
    active: true,
    displayOrder: 2,
  },
  {
    id: 3,
    name: "Ash",
    category: "Hardwood",
    image: "/images/pale-oak-wood-texture-design-background 1.png",
    characteristics: ["+Durability", "-Hard to handle"],
    active: true,
    displayOrder: 3,
  },
];

function characteristic(value: string) {
  const explicit = value.startsWith("+") || value.startsWith("-");
  const negative =
    value.startsWith("-") ||
    (!explicit && /expensive|hard|less|difficult|poor/i.test(value));
  return { negative, text: explicit ? value.slice(1) : value };
}
export function Materials({
  products = defaults,
}: {
  products?: WoodProduct[];
}) {
  const visible = products
    .filter((x) => x.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  return (
    <section className="mx-auto max-w-[1000px] px-6 py-24 md:px-12" id="prices">
      <h2 className="mb-16 text-[42px] font-medium uppercase leading-tight md:text-[58px]">
        The wood we
        <br />
        work with
      </h2>
      <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-3 sm:gap-10 lg:gap-20">
        {visible.map((product) => (
          <article className="flex flex-col text-center" key={product.id}>
            {product.image ? (
              <div className="relative mx-auto h-36 w-full">
                <Image
                  className="object-contain"
                  src={product.image}
                  alt={`${product.name} wood sample`}
                  fill
                  sizes="220px"
                />
              </div>
            ) : (
              <div className="mx-auto h-36 w-full rounded-xl bg-white/5" />
            )}
            <h3 className="my-4 text-lg font-semibold">{product.name}</h3>
            <p className="mb-3 text-xs uppercase tracking-wider text-[#9dbce0]">
              {product.category}
            </p>
            <ul className="mx-auto grid w-fit list-none gap-2 p-0 text-left text-sm">
              {product.characteristics.map((value, index) => {
                const item = characteristic(value);
                return (
                  <li
                    key={`${value}-${index}`}
                    className="flex items-start gap-2"
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${item.negative ? "bg-red-500/15 text-red-400" : "bg-emerald-500/15 text-emerald-400"}`}
                    >
                      {item.negative ? "×" : "✓"}
                    </span>
                    <span>{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
