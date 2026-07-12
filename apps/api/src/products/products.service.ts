import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
const defaults = [
  {
    name: "Oak",
    category: "Hardwood",
    image: "/images/old-wood-grain-background 2.png",
    characteristics: [
      "Durability",
      "Beautiful texture",
      "Water resistance",
      "Expensive",
    ],
    displayOrder: 1,
  },
  {
    name: "Buk",
    category: "Hardwood",
    image: "/images/wood-texture-design-decoration 1.png",
    characteristics: ["Durability", "Hard to handle"],
    displayOrder: 2,
  },
  {
    name: "Ash",
    category: "Hardwood",
    image: "/images/pale-oak-wood-texture-design-background 1.png",
    characteristics: ["Durability", "Hard to handle"],
    displayOrder: 3,
  },
];
@Injectable()
export class ProductsService {
  constructor(private p: PrismaService) {}
  async list() {
    if ((await this.p.woodProduct.count()) === 0)
      for (const x of defaults)
        await this.p.woodProduct.create({
          data: { ...x, characteristics: x.characteristics },
        });
    return this.p.woodProduct.findMany({ orderBy: { displayOrder: "asc" } });
  }
  create(b: any) {
    return this.p.woodProduct.create({
      data: {
        ...b,
        characteristics: (b.characteristics ?? []) as Prisma.InputJsonValue,
      },
    });
  }
  async update(id: number, b: any) {
    const { characteristics, ...rest } = b;
    const x = await this.p.woodProduct.updateMany({
      where: { id },
      data: {
        ...rest,
        ...(characteristics
          ? { characteristics: characteristics as Prisma.InputJsonValue }
          : {}),
      },
    });
    if (!x.count) throw new NotFoundException();
    return this.p.woodProduct.findUnique({ where: { id } });
  }
  async remove(id: number) {
    await this.p.woodProduct.delete({ where: { id } });
  }
  async gallery() {
    return this.p.galleryImage.findMany({ orderBy: { displayOrder: "asc" } });
  }
  addImage(b: any) {
    return this.p.galleryImage.create({ data: b });
  }
  editImage(id: number, b: any) {
    return this.p.galleryImage.update({ where: { id }, data: b });
  }
  deleteImage(id: number) {
    return this.p.galleryImage.delete({ where: { id } });
  }
}
