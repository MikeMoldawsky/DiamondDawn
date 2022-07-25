import React, { useState, useRef } from "react";
import classNames from "classnames";
import './PasswordBox.scss'

const PASSWORD_LENGTH = 10
const CHECK_TIME = 1750

const PasswordBox = () => {
  const [password, setPassword] = useState("");
  const pwdInput = useRef(null);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const submitPassword = () => {
    pwdInput.current.blur()
    return
    setCheckingPassword(true)
    setTimeout(() => {
      setCheckingPassword(false)
      setPasswordError(true)
      setPassword('')
    }, CHECK_TIME)
  }

  const onPasswordChange = e => {
    const pwd = e.target.value
    setPassword(pwd)
    if (pwd.length === PASSWORD_LENGTH) {
      submitPassword()
    }
  };

  const onPasswordEnter = e => {
    if (e.charCode === 13) {
      // enter key
      submitPassword()
    }
  }

  return (
    <div className={classNames("password-box", { 'has-error': passwordError })}>
      <div className="password-title">TRY PASSWORD</div>
      <input ref={pwdInput} type="password"
             className={classNames({filled: password.length > 0, loading: checkingPassword})}
             value={password} onChange={onPasswordChange} onKeyPress={onPasswordEnter} maxLength={PASSWORD_LENGTH} />
    </div>
  );
};

export default PasswordBox;
