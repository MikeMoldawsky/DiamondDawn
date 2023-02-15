import React from "react";
import {
  DIAMOND_DAWN_TWITTER_URL,
  PRIVATE_TWITTER_MESSAGE_URL,
  DIAMOND_DAWN_OPENSEA,
  DIAMOND_DAWN_SUBSTACK,
} from "consts";
import {collectorDisplayName, getCollectorTwitterName, isNoContractMode} from "utils";
import classNames from "classnames";
import { useSelector } from "react-redux";
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
  <Link
    href={DIAMOND_DAWN_TWITTER_URL}
    className={classNames("twitter-link", className)}
  >
    {children}
  </Link>
);

export const TwitterShareNFTLink = ({ className, tokenId, children }) => {
  const { ddContractInfo } = useSelector(systemSelector);
  if (!ddContractInfo) return null;

  const text = encodeURIComponent(
    `I just started the @DiamondDawnNFT journey with key #${tokenId}/333\nCheck it out 💎`
  );
  const url = encodeURIComponent(
    `https://opensea.io/assets/ethereum/${ddContractInfo.address}/${tokenId}`
  );
  const link = `http://twitter.com/share?text=${text}&url=${url}`;

  return (
    <Link href={link} className={classNames(className)}>
      {children}
    </Link>
  );
};

export const GetPasswordLink = ({ className }) => (
  <Link href={PRIVATE_TWITTER_MESSAGE_URL} className={className}>
    Request to Join
  </Link>
);

export const CollectorLink = ({ className, collector, twitter }) => {
  if (!twitter && !collector?.twitter) return collectorDisplayName(collector);
  const username = getCollectorTwitterName({ twitter: twitter || collector.twitter });
  return (
    <Link
      href={`https://twitter.com/${username}`}
      className={classNames("text-gold", className)}
    >
      <b>@{username}</b>
    </Link>
  );
};

export const TelegramLink = ({ className, href, children }) => {
  return (
    <Link className={classNames("tg-link", className)} href={href}>
      {children}
    </Link>
  );
};

export const OpenseaLink = ({ className, children }) => {
  if (isNoContractMode() || DIAMOND_DAWN_OPENSEA === "") return null
  return (
    <Link
      href={DIAMOND_DAWN_OPENSEA}
      className={classNames("opensea", className)}
    >
      {children}
    </Link>
  );
};

export const SubstackLink = ({ className, children }) => {
  return (
    <Link
      className={classNames("substack-link", className)}
      href={DIAMOND_DAWN_SUBSTACK}
    >
      {children}
    </Link>
  );
};

export const MailToSupportLink = () => (
  <a href="mailto:support@diamonddawn.art">support@diamonddawn.art</a>
);

export default Link;
