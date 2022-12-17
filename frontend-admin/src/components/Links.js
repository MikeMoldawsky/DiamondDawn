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

export const OpenseaLink = ({ className, address }) => {
  return (
    <Link href={`https://opensea.io/${address}`} className={className}>
      {address}
    </Link>
  );
};

export default Link;
