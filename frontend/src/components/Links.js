import React from "react";
import {
  DIAMOND_DAWN_TELEGRAM,
  DIAMOND_DAWN_TWITTER_URL,
  PRIVATE_TWITTER_MESSAGE_URL,
  DIAMOND_DAWN_OPENSEA,
  SYSTEM_STAGE,
} from "consts";
import { collectorDisplayName } from "utils";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { collectorSelector } from "store/collectorReducer";
import { systemSelector } from "store/systemReducer";

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

export const TwitterLink = ({ className, children }) => (
  <Link href={DIAMOND_DAWN_TWITTER_URL} className={className}>
    {children}
  </Link>
);

export const GetPasswordLink = ({ className }) => (
  <Link href={PRIVATE_TWITTER_MESSAGE_URL} className={className}>
    Ask for a password
  </Link>
);

export const CollectorLink = ({ className, collector, twitter }) => {
  if (!twitter && !collector?.twitter) return collectorDisplayName(collector);
  const handle = twitter || collector.twitter;
  const username = handle.startsWith("@") ? handle.substring(1) : handle;
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
  const collector = useSelector(collectorSelector);

  return collector?.approved ? (
    <Link href={DIAMOND_DAWN_TELEGRAM} className={className}>
      {children}
    </Link>
  ) : null;
};

export const OpenseaLink = ({ className, children }) => {
  const { systemStage } = useSelector(systemSelector);

  const disabled = !DIAMOND_DAWN_OPENSEA || systemStage < SYSTEM_STAGE.KEY;
  const title = disabled
    ? "Opensea link will be available once mint starts"
    : "";
  return (
    <Link
      href={DIAMOND_DAWN_OPENSEA}
      className={className}
      disabled={disabled}
      title={title}
    >
      {children}
    </Link>
  );
};

export const MailToSupportLink = () => (
  <a href="mailto:support@diamonddawn.art">support@diamonddawn.art</a>
);

export default Link;
