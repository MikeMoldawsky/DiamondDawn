import React from "react";
import classNames from "classnames";
import "./LoginPage.scss";
import PasswordBox from "components/PasswordBox";

const LoginPage = ({ onLogin }) => {
  return (
    <div className={classNames("page login-page")}>
      <main>
        <PasswordBox onCorrect={onLogin}
                     passwordLength={8}
                     buttonText="ENTER"  />
      </main>
    </div>
  );
};

export default LoginPage;
