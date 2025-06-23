import React, { Suspense, lazy } from "react";

// Lazy load components
const Hero = lazy(() => import("@/components/landing/Hero"));
const GetAhead = lazy(() => import("@/components/landing/GetAhead"));
const HowItWorks = lazy(() => import("@/components/landing/HowItWorks"));
const LatestJobs = lazy(() => import("@/components/landing/LatestJobs"));
const JobCategories = lazy(() => import("@/components/landing/JobCategories"));
const TestimonialSlider = lazy(() =>
  import("@/components/landing/TestimonialSlider")
);
const Articles = lazy(() => import("@/components/landing/Articles"));

const LoadingFallback = () => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="animate-pulse">Loading...</div>
  </div>
);

const LandingPage = () => {
  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <GetAhead />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <LatestJobs />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <JobCategories />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <TestimonialSlider />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Articles />
      </Suspense>
    </>
  );
};

export default LandingPage;
