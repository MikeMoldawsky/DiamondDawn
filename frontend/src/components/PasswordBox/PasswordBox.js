import React, { useState, useRef } from "react";
import classNames from "classnames";
import "./PasswordBox.scss";
import { privateSaleAuthApi } from "api/serverApi";
import map from "lodash/map";
import ActionButton from "components/ActionButton";
import useActionDispatch from "hooks/useActionDispatch";
import useSound from "use-sound";
import deepSFX from "assets/audio/button3-press-deep.mp3";

const PasswordBox = ({ inviteId, onCorrect, passwordLength, buttonText }) => {
  const [password, setPassword] = useState("");
  const pwdInput = useRef(null);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const actionDispatch = useActionDispatch();
  const [playSubmit] = useSound(deepSFX);

  const submitPassword = async () => {
    if (passwordLength !== password.length) return;

    pwdInput.current.blur();
    setCheckingPassword(true);
    const isCorrect = await privateSaleAuthApi(password, inviteId);
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
      playSubmit();
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
        sfx="explore"
      >
        {buttonText}
      </ActionButton>
    </div>
  );
};

export default PasswordBox;
