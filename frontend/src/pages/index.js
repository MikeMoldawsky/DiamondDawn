import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ComingSoonPage from "pages/ComingSoonPage";
import Homepage from "pages/Homepage";
import TokensProvider from "containers/TokensProvider";
import ProcessPage from "pages/ProcessPage";
import RebirthPage from "pages/RebirthPage";
import CollectorPage from "pages/CollectorPage";
import NFTPage from "pages/NFTPage";
import TheJourneyPage from "pages/TheJourneyPage";
import AboutUsPage from "pages/AboutUsPage";
import TechPage from "pages/TechPage";
import PrivacyPage from "pages/Legal/PrivacyPage";
import TNCPage from "pages/Legal/TNCPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" exact element={<ComingSoonPage />} />
      <Route path="/explore" element={<Homepage />} />
      <Route
        path="process"
        element={
          <TokensProvider withLoader isGated>
            <ProcessPage />
          </TokensProvider>
        }
      />
      <Route
        path="rebirth/:tokenId"
        element={
          <TokensProvider withLoader isGated>
            <RebirthPage />
          </TokensProvider>
        }
      />
      <Route
        path="collector"
        element={
          <TokensProvider goThrough>
            <CollectorPage />
          </TokensProvider>
        }
      />
      <Route
        path="nft/:tokenId"
        element={
          <TokensProvider withLoader isGated>
            <NFTPage />
          </TokensProvider>
        }
      />
      <Route path="the-journey" element={<TheJourneyPage />} />
      <Route path="about-us" element={<AboutUsPage />} />
      <Route path="technology" element={<TechPage />} />
      <Route path="privacy" element={<PrivacyPage />} />
      <Route path="tnc" element={<TNCPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
