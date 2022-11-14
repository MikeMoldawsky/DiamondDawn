import React, { useState, useRef } from "react";
import classNames from "classnames";
import "./PasswordBox.scss";
import { demoAuthApi } from "api/serverApi";
import map from "lodash/map";
import ActionButton from "components/ActionButton";
import useActionDispatch from "hooks/useActionDispatch";

const PasswordBox = ({ inviteId, onCorrect, passwordLength, buttonText }) => {
  const [password, setPassword] = useState("");
  const pwdInput = useRef(null);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const actionDispatch = useActionDispatch();

  const submitPassword = async () => {
    if (passwordLength !== password.length) return;

    pwdInput.current.blur();
    setCheckingPassword(true);
    const isCorrect = await demoAuthApi(password, inviteId);
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
      className={classNames("password-box", {
        loading: checkingPassword,
        "has-error": passwordError,
      })}
    >
      <div className="input-container">
        <input
          ref={pwdInput}
          type="password"
          autoFocus
          value={password}
          onChange={onPasswordChange}
          onKeyPress={onPasswordEnter}
          maxLength={passwordLength}
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
