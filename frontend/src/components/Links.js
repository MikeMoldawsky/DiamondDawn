import React from "react";
import { DIAMOND_DAWN_TELEGRAM, DIAMOND_DAWN_TWITTER_URL } from "consts";
import { collectorDisplayName } from "utils";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { collectorSelector } from "store/collectorReducer";

export const Link = ({ href, className, children }) => (
  <a target="_blank" rel="noreferrer" href={href} className={className}>
    {children}
  </a>
);

export const TwitterLink = ({ className, children }) => (
  <Link href={DIAMOND_DAWN_TWITTER_URL} className={className}>
    {children}
  </Link>
);

export const CollectorLink = ({ className, collector }) => {
  if (!collector?.twitter) return collectorDisplayName(collector);
  const { twitter } = collector;

  const username = twitter.startsWith("@") ? twitter.substring(1) : twitter;
  return (
    <Link
      href={`https://twitter.com/${username}`}
      className={classNames("text-gold", className)}
    >
      <b>@{username}</b>
    </Link>
  );
};

export const TelegramLink = ({ className, children }) => {
  // const collector = useSelector(collectorSelector)
  //
  // return collector?.approved ? (
  //   <Link href={DIAMOND_DAWN_TELEGRAM} className={className}>
  //     {children}
  //   </Link>
  // ) : null
  return (
    <Link href={DIAMOND_DAWN_TELEGRAM} className={className}>
      {children}
    </Link>
  );
};

export const MailToSupportLink = () => (
  <a href="mailto:support@diamonddawn.art">support@diamonddawn.art</a>
);

export default Link;
