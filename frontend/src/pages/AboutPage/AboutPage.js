import React from "react";
import "./AboutPage.scss";
import { getCDNImageUrl } from "utils";
import FAQs from "components/FAQs";
import Footer from "components/Footer";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PageSizeLimit from "components/PageSizeLimit";

const AboutPage = () => {
  return (
    <PageSizeLimit>
    <div className="page about-page">
      <div className="inner-page">
        <div className="general">
          <div className="leading-text">About Diamond Dawn</div>
          <div className="text">
            Diamond Dawn is a social experiment developed by a passionate team
            that’s made up of software engineers, visual artists, and a
            world-renowned 3D designer alongside one of the most respected
            companies in the diamond industry.
          </div>
          <br />
          <div className="text">
            Your Diamond Dawn journey will consist of 4 steps.
            <br />
            At each step, you must choose whether to evolve your Diamond NFT to
            its next form or keep it in its current state for eternity.
            <br />
            <br />
            You’ll have exactly <b>3 weeks, 3 days, and 3 hours</b> to complete
            each step.
          </div>
          <br />
          <div className="text">
            In the last phase, you will be faced with <b>The Final Choice:</b>
            <br />
            Keep your diamond NFT digital or burn it in exchange for a physical,
            limited-edition artwork that contains your diamond (GIA-certified).{" "}
            <br />
            Once your decision is finalized on the blockchain, your artwork will
            be shipped to your specified address.
          </div>
          <div className="secondary-text">
            {" "}
            <br />
            Physical vs. Digital
            <br />
            Which diamond will you choose?
          </div>
        </div>

        <div className="center-aligned-column journey">
          <div id="journey" className="leading-text">
            THE JOURNEY
          </div>
          <div className="journey-desc text">
            Diamond Dawn does NOT hold your NFT attributes on a centralized
            server - the project is <b>entirely on-chain</b>.
            <br />
            Throughout this historical journey, you’ll learn about the hidden
            world of the diamond industry, take part in the creation of the{" "}
            <b>first digital diamonds</b> that live on the blockchain, and
            discover the secrets behind their famous sparkle.
            <br />
            Diamond Dawn has 4 steps.
          </div>
          <div className="journey-step">
            <div className="key-image" />
            <div className="secondary-text">Step 0 - Activate Your Key</div>
            <div className="text">
              If your application to join Diamond Dawn is accepted, you will
              have a limited time window of{" "}
              <b>3 days, 3 hours, and 3 minutes</b> to activate your key for
              3.33 $ETH.
              <br />
              <br />
              The key grants you <b>full access</b> to the 4 steps of DD's
              journey, starting in the virtual mine, where your journey begins.
              <br />
              <br />
              The application phase will automatically end when one of the
              following things happens:
              <br />
              <br />
              <div className="text-center">
                333 participants activated their keys
                <br />
                OR
                <br />
                The mine opens in...
              </div>
            </div>
          </div>
          <div className="journey-step">
            <div className="stone-image" />
            <div className="secondary-text">Step 1 - Enter & Mine</div>
            <div className="text">The virtual mine opens in XX:XX</div>
          </div>
          <div className="journey-step">
            <div className="secondary-text">Step 2 - ?</div>
          </div>
          <div className="journey-step">
            <div className="secondary-text">Step 3 - ?</div>
          </div>
          <div className="journey-step">
            <div className="secondary-text">Step 4 - Final Choice</div>
            <div className="text">
              The final step is unique, and that's why you’ll have a longer time
              window to decide about your actions. <br />
              <br />
              You'll have exactly <b>3 months, 3 weeks, and 3 days</b> to
              decide.
              <br />
              <br />
              In this final phase, you'll be faced with the ultimate choice:
              <br />
              Keep your diamond digital (NFT) or <b>burn</b> it in exchange for
              your physical diamond artwork (GIA-certified).
              <br />
            </div>
          </div>
        </div>
        <div className="center-aligned-column team">
          <div id="team" className="leading-text">
            OUR TEAM
          </div>
          <div className="text our-team">
            Diamond Dawn was created by a team of forward-thinking individuals
            from various fields who share a common set of values.
            <br />
            <br />
            We all believe that <b>decentralization</b> is key to the Internet’s
            survival.
            <br />
            <br /> We look forward to the day when the robust technology behind
            Web3 and NFTs will disrupt most industries as we know them today,
            resulting in a shift in “power” from corporations to individuals.
            <br />
            <br />
            Diamond Dawn was specifically architectured to demonstrate how
            decentralized technology can create a <b>REAL-LIFE</b> impact.
          </div>
          <div className="team-members">
            <div className="team-member">
              <AccountCircleIcon />
              <div className="secondary-text">Mike Moldawsky (Tweezers)</div>
              <div className="member-title">Project Creator</div>
              <div className="text">
                An entrepreneur with a background in software engineering, Mike
                fell under the magic of NFT technology in 2016. An early adopter
                by nature, Mike foresaw that the disruptive tech behind web3 and
                NFTs will become a transforming force for most industries,
                digital communities, and how we consume content on the whole. He
                has since vowed to become an active member and architect of the
                crypto revolution, making it his life’s mission to push forward
                decentralized technology to a state where it creates REAL LIFE
                impact that will, in turn, change society at large.
              </div>
            </div>
            <div className="team-member">
              <AccountCircleIcon />
              <div className="secondary-text">David Ariew</div>
              <div className="member-title">Artist</div>
              <div className="text">
                A 3D artist and educator, David is widely known in the NFT
                community. He has worked with artists like Beeple, Pak,
                Deadmau5, Zedd, Katy Perry, Keith Urban, and Excision. He is
                prolific in various artistic styles that he continues to develop
                - from energetic concert visuals that are tightly synced with
                the music, to creating overly ambitious, full CG short films,
                and mesmerizing animations. David has also had several major
                successes in web3, including being part of the Pak's ASH 2 drop,
                creating two NFTs for Beeple x Madonn a (one of which sold for
                $346,000) and a collab with famous artist Jia Alli on a piece
                entitled "The Road Ahead", which sold at Sotheby’s. David’s
                mission as an artist is not only to grow the NFT community, but
                also to help up-and-coming 3D artists gain traction in the
                field.
              </div>
            </div>
            <div className="team-member">
              <AccountCircleIcon />
              <div className="secondary-text">Aviva Moldawsky</div>
              <div className="member-title">Diamond Art Designer</div>
              <div className="text">
                Born to diamond merchants, Aviva was exposed, from a young age, 
                to both the harsh world of trade and negotiation and the
                fascinating world of exquisite beauty contained within the
                stones themselves. A world where, to this day, deals are closed
                not with a contract, but with a handshake and the word ‘luck’. 
                A highly-respected name in the world of diamonds, the Moldawsky
                family has supplied stones to Tiffany’s, Sterling, JC Penny, and
                more of  the largest firms in the world. As a diamond designer,
                Aviva helps her clients choose the rough stone, knowing which
                stone will yield the most desirable end result, and oversees the
                entire design process that will best fit her customer’s
                personality and style - from raw material all the way to the box
                in which it is delivered.
              </div>
            </div>
            <div className="team-member">
              <AccountCircleIcon />
              <div className="secondary-text">Asaf Snir</div>
              <div className="member-title">Frontend Master</div>
              <div className="text">
                Asaf has been a software developer for over 15 years, working
                mostly in web2. Three years ago, he discovered the world of
                blockchain technology and has worked exclusively on web3
                projects since. Asaf is an active member in several
                decentralized organizations (DAO). He is a frontend specialist
                who believes decentralization is the key to the Internet’s
                survival and its only logical next evolutionary step. He also
                insists that music and art are what sets us apart and makes us
                shine as a species. We agree wholeheartedly.
              </div>
            </div>
          </div>
        </div>
        <div className="faq">
          <div id="faq" className="leading-text">
            FAQ
          </div>
          <FAQs />
        </div>
        <Footer />
      </div>
    </div>
    </PageSizeLimit>
  );
};

export default AboutPage;
