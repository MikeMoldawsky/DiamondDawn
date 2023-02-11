import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import TokensProvider from "containers/TokensProvider";
import useAccessDDGuard from "hooks/useAccessDDGuard";
const ComingSoonPage = lazy(() => import("pages/ComingSoonPage"));
const Homepage = lazy(() => import("pages/Homepage"));
const CollectorPage = lazy(() => import("pages/CollectorPage"));
const MintPage = lazy(() => import("pages/MintPage"));
const AboutUsPage = lazy(() => import("pages/AboutUsPage"));
const TechPage = lazy(() => import("pages/TechPage"));
const PrivacyPage = lazy(() => import("pages/Legal/PrivacyPage"));
const TNCPage = lazy(() => import("pages/Legal/TNCPage"));
const CreditsPage = lazy(() => import("pages/CreditsPage"));
const FAQsPage = lazy(() => import("pages/FAQsPage"));
const InvitesPage = lazy(() => import("pages/InvitesPage"));
const JoinPage = lazy(() => import("pages/JoinPage"));
const CommunityPage = lazy(() => import("pages/CommunityPage"));

const SuspenseFallback = ({ requireAccess = true }) => {
  useAccessDDGuard(requireAccess);
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        exact
        element={
          <Suspense fallback={<SuspenseFallback requireAccess={false} />}>
            <ComingSoonPage />
          </Suspense>
        }
      />
      <Route
        path="/join"
        element={
          <Suspense fallback={<SuspenseFallback />}>
            <JoinPage />
          </Suspense>
        }
      />
      <Route
        path="/community"
        element={
          <Suspense fallback={<SuspenseFallback />}>
            <CommunityPage />
          </Suspense>
        }
      />
      <Route
        path="/explore"
        element={
          <Suspense fallback={<SuspenseFallback />}>
            <Homepage />
          </Suspense>
        }
      />
      <Route
        path="collector"
        element={
          <TokensProvider goThrough>
            <Suspense fallback={<SuspenseFallback />}>
              <CollectorPage />
            </Suspense>
          </TokensProvider>
        }
      />
      <Route
        path="mint"
        element={
          <TokensProvider goThrough>
            <Suspense fallback={<SuspenseFallback />}>
              <MintPage />
            </Suspense>
          </TokensProvider>
        }
      />
      <Route
        path="mint-honorary"
        element={
          <TokensProvider goThrough>
            <Suspense fallback={<SuspenseFallback />}>
              <MintPage isHonorary />
            </Suspense>
          </TokensProvider>
        }
      />
      <Route
        path="invites"
        element={
          <TokensProvider goThrough>
            <Suspense fallback={<SuspenseFallback />}>
              <InvitesPage />
            </Suspense>
          </TokensProvider>
        }
      />
      <Route
        path="about-us"
        element={
          <Suspense fallback={<SuspenseFallback />}>
            <AboutUsPage />
          </Suspense>
        }
      />
      <Route
        path="technology"
        element={
          <Suspense fallback={<SuspenseFallback />}>
            <TechPage />
          </Suspense>
        }
      />
      <Route
        path="privacy"
        element={
          <Suspense fallback={<SuspenseFallback />}>
            <PrivacyPage />
          </Suspense>
        }
      />
      <Route
        path="tnc"
        element={
          <Suspense fallback={<SuspenseFallback />}>
            <TNCPage />
          </Suspense>
        }
      />
      <Route
        path="credits"
        element={
          <Suspense fallback={<SuspenseFallback />}>
            <CreditsPage />
          </Suspense>
        }
      />
      <Route
        path="faq"
        element={
          <Suspense fallback={<SuspenseFallback />}>
            <FAQsPage />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
