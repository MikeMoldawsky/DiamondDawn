import React, { useState, useEffect } from "react";
import classNames from "classnames";
import useDDContract from "hooks/useDDContract";
import { createPasswordsApi, countPasswordsApi } from "api/serverApi";
import { allowMineEntranceApi } from "api/contractApi";
import ActionButton from "components/ActionButton";

const PasswordsTab = () => {
  const [passwordCount, setPasswordCount] = useState({});
  const contract = useDDContract();

  const fetchPasswordCount = async () => {
    const [available, pending, used] = await Promise.all([
      countPasswordsApi("available"),
      countPasswordsApi("pending"),
      countPasswordsApi("used"),
    ]);
    setPasswordCount({
      available,
      pending,
      used,
      total: available + pending + used,
    });
  };

  const createPasswords = async () => {
    const hashes = await createPasswordsApi(100);
    await allowMineEntranceApi(contract, hashes);
    fetchPasswordCount();
  };

  useEffect(() => {
    fetchPasswordCount();
  }, []);

  return (
    <div className={classNames("tab-content passwords")}>
      <h1>Passwords</h1>
      <div>Available Password: {passwordCount.available}</div>
      <div>Pending Password: {passwordCount.pending}</div>
      <div>Used Password: {passwordCount.used}</div>
      <div>Total Password: {passwordCount.total}</div>
      <ActionButton actionKey="create-passwords" onClick={createPasswords}>
        CREATE PASSWORDS
      </ActionButton>
    </div>
  );
};

export default PasswordsTab;
