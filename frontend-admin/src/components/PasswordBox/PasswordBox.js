import React, { useState, useRef } from "react";
import classNames from "classnames";
import "./PasswordBox.scss";
import {adminAuthApi} from "api/serverApi";
import map from "lodash/map";
import ActionButton from "components/ActionButton";

const PasswordBox = ({
  className,
  onCorrect,
  passwordLength,
  buttonText,
}) => {
  const [password, setPassword] = useState("");
  const pwdInput = useRef(null);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const submitPassword = async () => {
    if (passwordLength !== password.length) return;

    pwdInput.current.blur();
    setCheckingPassword(true);
    const isCorrect = await adminAuthApi(password);
    setCheckingPassword(false);

    if (isCorrect) {
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
      className={classNames("password-box", className, {
        loading: checkingPassword,
        "has-error": passwordError,
      })}
    >
      <div className="password-title">ENTER PASSWORD</div>
      <div className={classNames("input-container", { focused: isFocused })}>
        <input
          ref={pwdInput}
          type="password"
          value={password}
          onChange={onPasswordChange}
          onKeyPress={onPasswordEnter}
          maxLength={passwordLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="underscore">
          {map(new Array(passwordLength), (v, i) => (
            <div key={`char-underscore-${i}`} className="char-underscore" />
          ))}
        </div>
      </div>
      <ActionButton
        actionKey="Submit Password"
        className="transparent"
        isLoading={checkingPassword}
        disabled={password.length !== passwordLength}
        onClick={submitPassword}
      >
        {buttonText}
      </ActionButton>
    </div>
  );
};

export default PasswordBox;
