import React from "react";
import classNames from "classnames";

export const Link = ({ href, className, disabled, title = "", children }) => {
  const aProps = {};
  if (!!href) {
    aProps.href = href;
  }

  return (
    <a
      target="_blank"
      rel="noreferrer"
      title={title}
      className={classNames(className, { disabled })}
      {...aProps}
    >
      {children}
    </a>
  );
};

export const TwitterLink = ({ className, handle }) => {
  if (!handle || !handle.startsWith("@")) return handle;
  const username = handle.startsWith("@") ? handle.substring(1) : handle;
  return (
    <Link
      href={`https://twitter.com/${username}`}
      className={classNames("text-gold", className)}
    >
      <b>{handle}</b>
    </Link>
  );
};

export const OpenseaLink = ({ className, address, children }) => {
  return (
    <Link
      href={`https://opensea.io/${address}`}
      className={classNames("opensea-link", className)}
    >
      {children || address}
    </Link>
  );
};

export const EtherscanLink = ({ className, address, children }) => {
  return (
    <Link
      href={`https://etherscan.io/address/${address}`}
      className={classNames("etherscan-link", className)}
    >
      {children || address}
    </Link>
  );
};

export default Link;
