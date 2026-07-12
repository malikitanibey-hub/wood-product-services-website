import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { homepageDefaults } from "./homepage.defaults";

@Injectable()
export class HomepageService {
  constructor(private readonly prisma: PrismaService) {}

  get() {
    return this.prisma.homepageContent.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        hero: homepageDefaults.hero,
        banners: homepageDefaults.banners,
        textSections: homepageDefaults.textSections,
        images: homepageDefaults.images,
      },
    });
  }

  async update(data: {
    hero: unknown;
    banners: unknown;
    textSections: unknown;
    images: unknown;
  }) {
    const content = await this.prisma.homepageContent.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        hero: data.hero as Prisma.InputJsonValue,
        banners: data.banners as Prisma.InputJsonValue,
        textSections: data.textSections as Prisma.InputJsonValue,
        images: data.images as Prisma.InputJsonValue,
      },
      update: {
        hero: data.hero as Prisma.InputJsonValue,
        banners: data.banners as Prisma.InputJsonValue,
        textSections: data.textSections as Prisma.InputJsonValue,
        images: data.images as Prisma.InputJsonValue,
      },
    });
    if (Array.isArray(data.images)) {
      const images = data.images as Array<{ title?: string; url?: string; alt?: string; active?: boolean }>;
      await this.prisma.$transaction([
        this.prisma.galleryImage.deleteMany(),
        this.prisma.galleryImage.createMany({ data: images.filter((item) => item.url).map((item, index) => ({ title: item.title || `Gallery image ${index + 1}`, image: item.url!, alt: item.alt || item.title || "Wood project", active: item.active ?? true, displayOrder: index + 1 })) }),
      ]);
    }
    return content;
  }

  reset() {
    return this.update(homepageDefaults);
  }
}
