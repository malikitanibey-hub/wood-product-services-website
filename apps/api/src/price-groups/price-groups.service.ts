import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

const defaults = [
  {
    name: "buk pr",
    displayOrder: 1,
    rows: [
      ["1000", "300", "40", "0,012", "1100", "462"],
      ["1100", "300", "40", "0,0132", "1100", "508,2"],
      ["800", "300", "40", "0,0096", "1100", "369,6"],
      ["900", "300", "40", "0,0108", "1100", "415,8"],
    ],
  },
  {
    name: "dub",
    displayOrder: 2,
    rows: [
      ["800", "200", "20", "0,0032", "2000", "224"],
      ["1400", "600", "40", "0,0336", "2000", "2352"],
      ["1700", "600", "40", "0,0408", "2000", "2856"],
      ["2200", "600", "40", "0,0528", "2500", "4620"],
    ],
  },
  {
    name: "jasan",
    displayOrder: 3,
    rows: [
      ["1000", "200", "20", "0,0044", "1700", "261,8"],
      ["1600", "900", "40", "0,0576", "1700", "3427,2"],
      ["2300", "650", "40", "0,0598", "2000", "4186"],
      ["3000", "650", "20", "0,039", "1700", "2320,5"],
    ],
  },
];
@Injectable()
export class PriceGroupsService {
  constructor(private prisma: PrismaService) {}
  async list() {
    if ((await this.prisma.priceGroup.count()) === 0)
      for (const x of defaults)
        await this.prisma.priceGroup.create({ data: { ...x, rows: x.rows } });
    return this.prisma.priceGroup.findMany({
      orderBy: { displayOrder: "asc" },
    });
  }
  create(body: {
    name: string;
    displayOrder?: number;
    active?: boolean;
    rows?: unknown;
  }) {
    return this.prisma.priceGroup.create({
      data: {
        name: body.name,
        displayOrder: body.displayOrder ?? 0,
        active: body.active ?? true,
        rows: (body.rows ?? []) as Prisma.InputJsonValue,
      },
    });
  }
  async update(
    id: number,
    body: {
      name?: string;
      displayOrder?: number;
      active?: boolean;
      rows?: unknown;
    },
  ) {
    const { rows, ...rest } = body;
    const result = await this.prisma.priceGroup.updateMany({
      where: { id },
      data: {
        ...rest,
        ...(rows !== undefined ? { rows: rows as Prisma.InputJsonValue } : {}),
      },
    });
    if (!result.count) throw new NotFoundException();
    return this.prisma.priceGroup.findUnique({ where: { id } });
  }
  async remove(id: number) {
    const result = await this.prisma.priceGroup.deleteMany({ where: { id } });
    if (!result.count) throw new NotFoundException();
  }
}
