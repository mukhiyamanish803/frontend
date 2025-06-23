import Articles from "@/components/landing/Articles";
import GetAhead from "@/components/landing/GetAhead";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import JobCategories from "@/components/landing/JobCategories";
import LatestJobs from "@/components/landing/LatestJobs";
import TestimonialSlider from "@/components/landing/TestimonialSlider";

export default function Home() {
  return (
    <>
      <Hero />
      <GetAhead />
      <HowItWorks />
      <LatestJobs />
      <JobCategories />
      <TestimonialSlider />
      <Articles />
    </>
  );
}
