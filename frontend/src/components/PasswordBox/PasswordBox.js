import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import "./PasswordBox.scss";
import { demoAuthApi } from 'api/serverApi'

const PASSWORD_LENGTH = 10;
const CHECK_TIME = 1750;

const PasswordBox = ({ onCorrect }) => {
  const [password, setPassword] = useState("");
  const pwdInput = useRef(null);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    if (password.length === PASSWORD_LENGTH) {
      submitPassword();
    }
  }, [password]);

  const submitPassword = async () => {
    pwdInput.current.blur();
    setCheckingPassword(true);
    const isCorrect = await demoAuthApi(password);
    setCheckingPassword(false);

    if (isCorrect) {
      console.log("PASSWORD CORRECT");
      onCorrect();
    } else {
      setPasswordError(true);
      setTimeout(() => {
        setPasswordError(false);
        setPassword("");
        pwdInput.current.focus();
      }, 500);
    }
  };

  const onPasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
  };

  const onPasswordEnter = (e) => {
    if (e.charCode === 13) {
      // enter key
      submitPassword();
    }
  };

  return (
    <div
      className={classNames("password-box", {
        loading: checkingPassword,
        "has-error": passwordError,
      })}
    >
      <div className="password-title">TRY PASSWORD</div>
      <div className="input-container">
        <input
          ref={pwdInput}
          type="password"
          autoFocus
          value={password}
          onChange={onPasswordChange}
          onKeyPress={onPasswordEnter}
          maxLength={PASSWORD_LENGTH}
        />
      </div>
    </div>
  );
};

export default PasswordBox;
