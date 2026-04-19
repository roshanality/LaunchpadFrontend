import {
  Rocket,
  Briefcase,
  GraduationCap,
  Target,
  TrendingUp,
  Award,
} from "lucide-react";
import { ExpandingCards } from "../ui/expanding-cards";
import type { CardItem } from "../ui/expanding-cards";

const successStories: CardItem[] = [
  {
    id: "mvp-weeks",
    title: "MVP in 6 weeks",
    description:
      "A founder needed a working prototype for investors. A team of three IIT KGP students delivered the MVP on time and within budget through KGP Forge.",
    imgSrc:
      "/bangalore_it_office.png",
    icon: <Rocket size={24} />,
    linkHref: "#",
  },
  {
    id: "idea-to-launch",
    title: "From idea to launch",
    description:
      "A student-led team built and shipped a fintech feature for an alumni-founded startup. They learned production workflows and got strong referrals.",
    imgSrc:
      "/indian_fintech_team.png",
    icon: <GraduationCap size={24} />,
    linkHref: "#",
  },
  {
    id: "hired-from-platform",
    title: "Hired from the platform",
    description:
      "After completing two projects as a developer on KGP Forge, a final-year student was offered a full-time role at the same startup.",
    imgSrc:
      "/indian_developer_hired.png",
    icon: <Briefcase size={24} />,
    linkHref: "#",
  },
  {
    id: "scale-with-talent",
    title: "Scale with student talent",
    description:
      "A B2B SaaS founder scaled the product roadmap by onboarding two KGP Forge developers part-time. Quality and communication exceeded expectations.",
    imgSrc:
      "/indian_student.png",
    icon: <TrendingUp size={24} />,
    linkHref: "#",
  },
  {
    id: "first-revenue",
    title: "First revenue with KGP talent",
    description:
      "A solo founder used KGP Forge to get design and dev support for her D2C brand. The site went live in a month and drove the first sales.",
    imgSrc:
      "/indian_girl_founder.png",
    icon: <Target size={24} />,
    linkHref: "#",
  },
  {
    id: "cross-campus-team",
    title: "Cross-campus team",
    description:
      "Students from different departments formed a team on the platform, delivered a full-stack project for an alumni, and continued as a freelance unit.",
    imgSrc:
      "/bangalore_it_office.png",
    icon: <Award size={24} />,
    linkHref: "#",
  },
];

export function SuccessStoriesSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="flex w-full flex-col items-center justify-center space-y-8 px-4 md:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Success Stories
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Real outcomes from founders and students on KGP Forge. Hover or
            click on a card to read their story.
          </p>
        </div>
        <ExpandingCards items={successStories} defaultActiveIndex={0} />
      </div>
    </section>
  );
}
