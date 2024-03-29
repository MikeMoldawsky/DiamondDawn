import React from "react";
import { getCDNImageUrl } from "utils";
import Link from "components/Links";

export const AboutUsText = () => (
  <div className="text our-team">
    <p>
      Diamond Dawn was created by Mike Moldawsky, renowned artist David Ariew,
      and respected diamond company Moldawsky Diamonds as well a team of
      software engineers and visual artists who share a common set of values.
    </p>
    <p>
      We all believe that <b>decentralization</b> is the key to a better future
      and the survival of our society.
    </p>
    <p>
      We look forward to the day when the robust technology behind Web3 and NFTs
      will disrupt most industries as we know them today, resulting in a shift
      in “power” from corporations to individuals.
    </p>
    <p>
      Diamond Dawn was specifically crafted to demonstrate how decentralized
      technology can create a <b>REAL-LIFE</b> impact.
    </p>
  </div>
);

export const DecentralizationText = () => (
  <>
    <p>
      Decentralized systems are designed to be secure, public, and trustless -
      unable to be changed or manipulated in any way.
    </p>
    <p>
      <b>NFTs are a disruptive, decentralized technology.</b>
    </p>
    <p>
      For the first time, you can truly own an asset without trusting in a third
      party that can impose its own rules at will - and it’s 100% publicly
      verifiable.
    </p>
    <p>
      Many early and current NFT projects still feature centralized aspects. At
      Diamond Dawn, we believe in and deliver 100% decentralization (see
      timeless technology).
    </p>
  </>
);

export const InnovationText = () => (
  <>
    <p>
      NFT technology is brand new, a standard first introduced in 2018 that has
      only since 2021 really begun to gain real world traction.
    </p>
    <p>
      <b>
        We haven’t even started to scratch the surface of NFT technology’s
        capabilities.
      </b>
    </p>
    <p>
      We are driven to push the limits of this relatively young tech as we
      continue to set new standards in this space, striving to craft meaningful
      experiences that fully leverage NFT technology and show the world just why
      it’s so valuable.
    </p>
    <p>That is the path to true mass adoption.</p>
  </>
);

export const IRLImpactText = () => (
  <>
    <p>
      The ongoing breakthrough of NFT tech enables us to perform once-impossible
      feats. With NFTs, you truly own assets, track provenance and verify
      publicly, with zero third-party reliance.
    </p>
    <p>
      <b>
        NFT technology will disrupt all traditional industries in remarkable
        ways.
      </b>
    </p>
    <div className="gia-report">
      <img src={getCDNImageUrl("gia-report.jpeg")} alt="" />
      <div className="image-caption">A GIA Report</div>
    </div>
    <p>
      These “simple” breakthroughs will impact every aspect of all industries,
      from supply chain maintenance and deed creation to the very way goods are
      traded.
    </p>
    <p>
      Right now, the countless certifications of a $100B diamond industry are
      kept in paper ledgers held by major players. Can their transparency,
      provenance and record really be considered 100% tamper-free?
    </p>
    <p>
      What do you think the certification of industries like the diamond sector
      will look like in 10 years?
    </p>
  </>
);

export const DigitalValueText = () => (
  <>
    <p>Right now, many people disregard digital value.</p>
    <p>
      <b>However, most of the world’s value cannot be touched.</b>
    </p>
    <p>
      As NFT technology continues to rise, more begin to reevaluate traditional
      assumptions.
    </p>
    <p>
      Is it really the case that a digital creation has no value, or is that
      thinking simply because we had no way of truly owning online assets?
    </p>
    <p>
      With NFT technology permitting true online ownership, digital items can
      now be just as scarce and valuable as diamonds are in the physical realm.
    </p>
    <p>
      Nobody can copy/paste a new NFT into existence, and
      right-click-image-saving won’t help when it comes to trying to sell a
      digital asset. The only way forward is to demonstrate the full potential
      of NFT technology.
    </p>
  </>
);

export const MikeText = () => (
  <p>
    An entrepreneur and early adopter by nature, Mike foresaw the immense power
    behind web3’s disruptive tech several years ago.
    <br />
    He has since left his position at Palantir R&D to pursue his passion for
    decentralized technology. His projects aim to push the technology forward to
    a state where it creates a REAL-LIFE impact for society at large.
    <br />
    Mike holds a BSc in Computer Science from Tel Aviv University.
  </p>
);

export const DavidText = () => (
  <p>
    A digital artist and educator for over 10 years, David has worked with some
    of the world's biggest digital artists, such as Beeple and Pak. Recently, he
    sold his first{" "}
    <Link href="https://www.sothebys.com/en/buy/auction/2022/contemporary-art-evening-sale/jia-aili-x-david-ariew-jia-ai-li-x-da-weiai-lu-the">
      artwork
    </Link>{" "}
    at Sotheby’s Contemporary Art Evening for $224K, alongside artworks by
    Banksy and Basquiat. In addition, he created 2 out of the 3{" "}
    <Link href="https://twitter.com/beeple/status/1525142908680257536">
      Beeple X Madonna
    </Link>{" "}
    NFTs (one of which sold for $346K) and has collaborated with artists such as
    Katy Perry, Zedd and Deadmau5.
    <br /> David holds a Master's degree in Neuroscience from UVA.
  </p>
);

export const TonyText = () => (
  <p>
    An immigrant activist turned entrepreneur in the cryptocurrency, blockchain,
    and NFT space. Tony is a founding member of Galaxis (formerly Ether Cards),
    and of several DAOs dedicated to the metaverse including MeebitsDAO, NeonDAO
    and ReadyPlayerDAO.
  </p>
);

export const AvivaText = () => (
  <p>
    Born to a family of diamond merchants, Aviva has known the diamond industry
    intimately for over 35 years. A highly-respected name in the diamond world,
    the Moldawsky family has supplied precious stones to the world’s largest
    diamond sellers. As a passionate diamond designer, Aviva oversees the entire
    design process - from selecting the right stone, to the most exquisite
    setting and design, right down to the display and packaging in which it is
    delivered to the client.
  </p>
);

export const AsafText = () => (
  <p>
    A front-end developer for over 15 years, Asaf discovered the world of
    blockchain technology 3 years ago and has worked exclusively on web3
    projects. Asaf lives and breathes crypto and is an active member of several
    DAOs. He believes that decentralization is the key to the Internet’s
    survival and insists that music and art set us apart and make us shine as a
    species.
  </p>
);
