import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import TokensProvider from "containers/TokensProvider";
const ComingSoonPage = lazy(() => import("pages/ComingSoonPage"));
const Homepage = lazy(() => import("pages/Homepage"));
const ProcessPage = lazy(() => import("pages/ProcessPage"));
const RebirthPage = lazy(() => import("pages/RebirthPage"));
const CollectorPage = lazy(() => import("pages/CollectorPage"));
const NFTPage = lazy(() => import("pages/NFTPage"));
const TheJourneyPage = lazy(() => import("pages/TheJourneyPage"));
const AboutUsPage = lazy(() => import("pages/AboutUsPage"));
const TechPage = lazy(() => import("pages/TechPage"));
const PrivacyPage = lazy(() => import("pages/Legal/PrivacyPage"));
const TNCPage = lazy(() => import("pages/Legal/TNCPage"));
const CreditsPage = lazy(() => import("pages/CreditsPage"));
const FAQsPage = lazy(() => import("pages/FAQsPage"));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" exact element={<ComingSoonPage />} />
      <Route path="/explore" element={<Homepage />} />
      <Route
        path="process"
        element={
          <TokensProvider withLoader isGated>
            <Suspense fallback={<></>}>
              <ProcessPage />
            </Suspense>
          </TokensProvider>
        }
      />
      <Route
        path="rebirth/:tokenId"
        element={
          <TokensProvider withLoader isGated>
            <Suspense fallback={<></>}></Suspense>
            <RebirthPage />
          </TokensProvider>
        }
      />
      <Route
        path="collector"
        element={
          <TokensProvider goThrough>
            <Suspense fallback={<></>}>
              <CollectorPage />
            </Suspense>
          </TokensProvider>
        }
      />
      <Route
        path="nft/:tokenId"
        element={
          <TokensProvider withLoader isGated>
            <Suspense fallback={<></>}>
              <NFTPage />
            </Suspense>
          </TokensProvider>
        }
      />
      <Route
        path="the-journey"
        element={
          <Suspense fallback={<></>}>
            <TheJourneyPage />
          </Suspense>
        }
      />
      <Route
        path="about-us"
        element={
          <Suspense fallback={<></>}>
            <AboutUsPage />
          </Suspense>
        }
      />
      <Route
        path="technology"
        element={
          <Suspense fallback={<></>}>
            <TechPage />
          </Suspense>
        }
      />
      <Route
        path="privacy"
        element={
          <Suspense fallback={<></>}>
            <PrivacyPage />
          </Suspense>
        }
      />
      <Route
        path="tnc"
        element={
          <Suspense fallback={<></>}>
            <TNCPage />
          </Suspense>
        }
      />
      <Route
        path="credits"
        element={
          <Suspense fallback={<></>}>
            <CreditsPage />
          </Suspense>
        }
      />
      <Route
        path="faq"
        element={
          <Suspense fallback={<></>}>
            <FAQsPage />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
