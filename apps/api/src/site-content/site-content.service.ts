import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
export const defaults = {
  about: {
    title: "ABOUT US",
    body: "BIO CWT - We manufacture solid wood products according to individual drawings. We make chairs, armchairs, wardrobes, beds and much more in our own workshop, equipped with all the necessary industrial equipment.",
    images: [
      "/images/person-taking-measures-wood 1.png",
      "/images/portrait-young-motivated-carpenter-standing-by-woodworking-machine-his-carpentry-workshop 1.png",
      "/images/cropped-man-wearing-blue-overall-drawing-furniture-sheet-paper 1.png",
    ],
  },
  contact: {
    title: "ANY QUESTIONS?",
    description:
      "Write to us and we will be sure to answer all your questions and give you a comprehensive consultation.",
    namePlaceholder: "Your name",
    phonePlaceholder: "Your telephone number",
    questionPlaceholder: "Your question",
    buttonText: "Send",
    successTitle: "Thank you!",
    successMessage:
      "We have received your message and will get back to you as soon as possible.",
    formImage: "/images/image.png",
    contactTitle: "CONTACT US",
    phoneLabel: "PHONE",
    phone: "+420 000 000 000",
    addressLabel: "ADDRESS",
    address: "Na Plzeňce 1166/0\n150 00, Prague",
    hoursLabel: "WORKING HOURS",
    hours: "Mon – Fri: 8:00 – 18:00",
    mapUrl:
      "https://maps.google.com/maps?q=Na+Plze%C5%88ce+1166%2F0+150+00+Prague&output=embed",
  },
  login: {
    title: "Admin login",
    subtitle: "Sign in to access the administration dashboard",
    emailLabel: "Email",
    passwordLabel: "Password",
    buttonText: "Sign In",
    footerText: "© BIO CWT. All rights reserved.",
    backgroundImage: "/images/imag.png",
    decorativeImage: "/images/image.png",
  },
};
@Injectable()
export class SiteContentService {
  constructor(private p: PrismaService) {}
  async get() {
    const content = await this.p.siteContent.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        about: defaults.about,
        contact: defaults.contact,
        login: defaults.login,
      },
    });
    const merged = {
      about: { ...defaults.about, ...(content.about as object) },
      contact: { ...defaults.contact, ...(content.contact as object) },
      login: { ...defaults.login, ...(content.login as object) },
    };
    return this.p.siteContent.update({
      where: { id: 1 },
      data: {
        about: merged.about,
        contact: merged.contact,
        login: merged.login,
      },
    });
  }
  async update(section: string, value: unknown) {
    if (!["about", "contact", "login"].includes(section))
      throw new BadRequestException();
    return this.p.siteContent.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        about:
          section === "about"
            ? (value as Prisma.InputJsonValue)
            : defaults.about,
        contact:
          section === "contact"
            ? (value as Prisma.InputJsonValue)
            : defaults.contact,
        login:
          section === "login"
            ? (value as Prisma.InputJsonValue)
            : defaults.login,
      },
      update: { [section]: value as Prisma.InputJsonValue },
    });
  }
  reset(section: string) {
    return this.update(section, defaults[section as keyof typeof defaults]);
  }
}
