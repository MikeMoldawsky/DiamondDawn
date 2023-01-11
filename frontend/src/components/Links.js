import React from "react";
import {
  DIAMOND_DAWN_TWITTER_URL,
  PRIVATE_TWITTER_MESSAGE_URL,
  DIAMOND_DAWN_OPENSEA,
  DIAMOND_DAWN_SUBSTACK,
} from "consts";
import { collectorDisplayName, isNoContractMode } from "utils";
import classNames from "classnames";
import {useSelector} from "react-redux";
import {systemSelector} from "store/systemReducer";

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
  if (!ddContractInfo) return null

  const text = encodeURIComponent(`Starting my @DiamondDawnNFT journey with Mine Key #${tokenId}/333`)
  const url = encodeURIComponent(`https://opensea.io/assets/ethereum/${ddContractInfo.address}/${tokenId}`)
  const link = `http://twitter.com/share?text=${text}&url=${url}`

  return (
    <Link
      href={link}
      className={classNames(className)}
    >
      {children}
    </Link>
  )
};

export const GetPasswordLink = ({ className }) => (
  <Link href={PRIVATE_TWITTER_MESSAGE_URL} className={className}>
    Request a password
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

export const TelegramLink = ({ className, href, children }) => {
  return (
    <Link className={classNames("tg-link", className)} href={href}>
      {children}
    </Link>
  );
};

export const OpenseaLink = ({ className, children }) => {
  const disabled = isNoContractMode();
  const title = disabled
    ? "Opensea link will be available once mint starts"
    : "";
  return (
    <Link
      href={DIAMOND_DAWN_OPENSEA}
      className={classNames("opensea", className)}
      disabled={disabled}
      title={title}
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
