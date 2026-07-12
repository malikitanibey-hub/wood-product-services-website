import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { serviceDefaults } from "./services.defaults";

type ServiceInput = {
  name: string;
  shortDescription: string;
  description?: string;
  image?: string;
  category?: string;
  price?: string;
  active?: boolean;
  displayOrder?: number;
};

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}
  async list() {
    if ((await this.prisma.service.count()) === 0)
      await this.prisma.service.createMany({ data: serviceDefaults });
    return this.prisma.service.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });
  }
  create(data: ServiceInput) {
    return this.prisma.service.create({
      data: {
        ...data,
        category: data.category || "General",
        displayOrder: data.displayOrder ?? 0,
      },
    });
  }
  async update(id: number, data: Partial<ServiceInput>) {
    const result = await this.prisma.service.updateMany({
      where: { id },
      data,
    });
    if (!result.count) throw new NotFoundException("Service not found");
    return this.prisma.service.findUnique({ where: { id } });
  }
  async remove(id: number) {
    const result = await this.prisma.service.deleteMany({ where: { id } });
    if (!result.count) throw new NotFoundException("Service not found");
  }
}
