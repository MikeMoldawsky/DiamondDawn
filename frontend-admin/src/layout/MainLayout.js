import React, { useEffect } from "react";
import classNames from "classnames";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "pages/AdminPage";
import WagmiWrapper from "layout/WagmiWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useActionDispatch from "hooks/useActionDispatch";
import { loadContractInfo } from "store/systemReducer";
import AppLoader from "layout/AppLoader";

const MainLayout = () => {
  const actionDispatch = useActionDispatch();

  useEffect(() => {
    actionDispatch(loadContractInfo(), "get-contract");
  }, []);

  return (
    <div className={classNames("main-layout")}>
      <Router>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <WagmiWrapper>
                <AppLoader>
                  <AdminPage />
                </AppLoader>
              </WagmiWrapper>
            }
          />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
