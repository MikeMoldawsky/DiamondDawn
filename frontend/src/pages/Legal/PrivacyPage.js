import React from "react";
import "./Legal.scss";
import Footer from "components/Footer";
import { MailToSupportLink } from "components/Links";
import PageSizeLimit from "components/PageSizeLimit";

const PrivacyPage = () => (
  <PageSizeLimit>
    <div className="page tnc-page">
      <div className="inner-page">
        <h1>Privacy Policy</h1>
        <h2>Effective Date: October 26, 2022</h2>

        <div className="start-start-aligned-row heading">
          <div>1.</div>
          <div>General</div>
        </div>
        <div className="start-start-aligned-row">
          <div />
          <div>
            <p>
              We at Tweezers Hands LTD (the <b>“Company”</b>, <b>“We”</b>,{" "}
              <b>“Us”</b> or <b>“Our”</b>), are committed to securing your (
              <b>“You”</b>, <b>“Your”</b> or <b>“User”</b>) Personal Data and Your
              privacy. This privacy policy (the <b>“Policy”</b>) provides You
              information regarding the types of information that We collect about
              the Members of the Diamond Dawn community operated on Our Website
              diamonddawn.art (the <b>“Website”</b>) and the services provided as
              part of the community (the <b>“Services”</b>), how We use it, store
              it, process it and share it with third parties.
            </p>
            <p>
              In this Policy, <b>“Personal Data”</b> refers to any information
              relating to an identified or identifiable natural person. An
              identifiable natural person is one who can be identified, directly
              or in combination with additional information that We have or that
              We have access to.{" "}
            </p>
            <p>
              This Policy is part of and should be read in conjunction with the
              Terms and Conditions of the Website (the <b>“Terms”</b>).
              Capitalized terms in this Policy shall have the meanings ascribed to
              them in the Terms.
            </p>
          </div>
        </div>

        <div className="start-start-aligned-row heading">
          <div>2.</div>
          <div>When do We collect Personal Data about You?</div>
        </div>
        <div className="start-start-aligned-row">
          <div />
          <div>
            <p>
              We may collect Personal Data about You in the following
              circumstances:
              <br />
              <ul>
                <li>When You access or use the Website;</li>
                <li>When You use the Services;</li>
                <li>When You interact with Us via Our communication channels.</li>
              </ul>
            </p>
            <p>
              <b>
                Blockchain information – since part of the Services are ran on the
                blockchain network, it is important that You will be aware that
                activity made on blockchain network (ether and other digital
                assets) are not truly anonymous. We, and any others who can match
                Your public blockchain network address to other Personal Data
                about You, may be able to identify You from a blockchain
                transaction because, in some circumstances, Personal Data
                published on a blockchain (such as Your blockchain network address
                and IP address) can be correlated with Personal Data that We and
                others may have. Furthermore, by using data analysis techniques on
                a given blockchain network, it may be possible to identify other
                Personal Data about You.
              </b>
            </p>
          </div>
        </div>

        <div className="start-start-aligned-row heading">
          <div>3.</div>
          <div>
            No Obligation To Provide Personal Data To The Company And Its
            Implications
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div />
          <div>
            <p>
              You are not obligated to provide Us with any Personal Data about
              You. However, in some instances, not providing such Personal Data
              will prevent Us from providing You with the Services You requested
              Us to provide You, will prevent Your use of the Services or a part
              thereof.{" "}
            </p>
          </div>
        </div>

        <div className="start-start-aligned-row heading">
          <div>4.</div>
          <div>What types of Personal Data do We collect?</div>
        </div>
        <div className="start-start-aligned-row">
          <div />
          <div>
            <p>
              We (or others on Our behalf) may collect the following types of
              Personal Data about You:{" "}
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>4.1.</div>
          <div>
            <p>
              <u>Login information</u> – when You log-in to Our Website, You
              provide Us with Your Ethereum wallet address.
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>4.2.</div>
          <div>
            <p>
              <u>Service activity information</u> – along with the data that You
              actively provide Us with, We may also automatically gather certain
              data out of Your use of the Services, including the Website. The
              information that We gather about You in this context includes any
              interaction that You will make with the Services, including the
              Website’s pages that You will visit, Your interaction with such
              pages, Diamond-NFTs that You will purchase through the Website and
              Your Diamond-NFT-related actions on the Website.{" "}
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>4.3.</div>
          <div>
            <p>
              <u>Diamond-NFTs purchase data</u> – when You purchase a Diamond-NFT,
              We will gather Your social media page URL and your email address.
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>4.4.</div>
          <div>
            <p>
              <u>Diamond-NFTs redemption data</u> – when You redeem a Diamond NFT
              by purchasing the Art associated with the Diamond-NFT, You will be
              requested to provide Us with Your email address, full name and
              physical address.
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>4.5.</div>
          <div>
            <p>
              <u>Usage information and log files</u> - as You navigate through and
              use the Website, We may also use automatic data collection
              technologies to collect certain information about Your equipment,
              browsing actions and patterns. This information is used by Us in
              order to provide Our Service and make it more useful to You, and it
              includes online activity log, IP address, mobile device ID,
              blockchain address, browser type, operating system, country
              location, wallet type, date and time stamps, web and mobile page(s)
              visited, clickstream data, configuration data and software crash
              reports. Some of this information may not identify You personally,
              and therefore not constitute Personal Data.{" "}
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>4.6.</div>
          <div>
            <p>
              <u>Communication information</u> - when You contact Us, including
              via the Website, social media networks or any other User support
              channels, You may provide Us with Your name, certain contact
              information (such as email address and telephone number), the
              content of Your communication with Us and Your interaction with the
              content that We shall send You.
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>4.7.</div>
          <div>
            <p>
              <u>Aggregate Information</u> - We will also create statistical,
              aggregated and anonymized data relating to Our Users and the Service
              for analytical purposes, including business development and services
              improvements. Aggregated data is derived from Personal Data but in
              its aggregated form it does not relate to or identify any particular
              individual or any specific User’s data. This data is used to
              understand Our users’ base and to develop, improve and market Our
              Services.{" "}
            </p>
          </div>
        </div>

        <div className="start-start-aligned-row heading">
          <div>5.</div>
          <div>
            The Purposes Of The Processing Of Personal Data And Their Legal Basis
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div />
          <div>
            <p>
              <p>
                The Company processes Your Personal Data for one or more of the
                purposes outlined in this section and according to the appropriate
                legal basis.
              </p>
              <p>
                <u>Legal bases for Our processing of Your Personal Data</u>:
              </p>
              <p>
                The Company will not process Personal Data about You unless there
                is a legal basis for such processing.
              </p>
              <p>
                The legal bases according to which the Company may process
                Personal Data about You are as follows:
              </p>
              <ul>
                <li>
                  <b>
                    Processing is necessary for the performance of a contract to
                    which You are party or in order to take steps at Your request
                    prior to entering into a contract.
                  </b>{" "}
                  This refers to all the information required for Us to provide
                  You with the Services and grant You access thereto, including
                  for the purpose of the shipment of the Art that You will redeem
                  into a Jewelry art piece through the Website.{" "}
                </li>
                <li>
                  <b>
                    Processing is necessary for the purposes of the legitimate
                    interests pursued by the Company or by a third party.
                  </b>{" "}
                  By way of example, for the purpose of improving Our Services We
                  will use the data concerning errors and malfunctions that You
                  will overcome while using the Website; in addition, We may use
                  certain Personal Data for the exercise or defence of legal
                  claims.
                </li>
                <li>
                  <p>
                    <b>
                      Your consent that the Company will process Personal Data
                      about You for one or more specific purposes.
                    </b>{" "}
                    By way of example, for the purpose of sending marketing
                    materials to You.
                  </p>
                  <p>
                    Where the legal basis for the processing of the Personal Data
                    about You is consent, You may at any time withdraw Your
                    consent for the purposes for which You provided Your consent
                    by sending a notice free of charge to the following email
                    address: <MailToSupportLink />.
                  </p>
                  <p>
                    Where You withdraw Your consent for the processing of Personal
                    Data about You, We might not be able to provide You with some
                    or all of the Services You requested or in the form intended
                    to be provided to You.
                  </p>
                </li>
                <li>
                  <b>
                    Processing is necessary for compliance with a legal obligation
                    to which the Company is subject.
                  </b>{" "}
                  We may need to use some of the Diamond-NFTs redemption data for
                  compliance with anti-money laundering regulation applicable to
                  Us.{" "}
                </li>
              </ul>
            </p>
            <p>
              At any time, You may approach Us by sending a notice to the email
              address <MailToSupportLink />, in order to receive information
              concerning the review performed by Us. This is so You can conclude
              that We may process the Personal Data about You on account of such
              processing being necessary for the purposes of the legitimate
              interests pursued by the Company or by a third party.
            </p>
            <p>
              The following list outlines the purposes for which We may process
              Personal Data about You and the legal basis for any such processing:
            </p>
            <table>
              <thead>
              <tr>
                <th>Legal Basis</th>
                <th>Purpose</th>
                <th />
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>
                  <ul>
                    <li>
                      Processing is necessary for the performance of a contract
                      to which You are party or in order to take steps at Your
                      request prior to entering into a contract.
                    </li>
                  </ul>
                </td>
                <td>
                  <p>
                    <b>In order to login to the Website</b>
                  </p>
                  <p>
                    Upon Your request to log-in to the Website with Your
                    Ethereum wallet, You will have to submit Your public
                    Ethereum wallet address.
                  </p>
                </td>
                <td>1</td>
              </tr>
              <tr>
                <td>
                  <ul>
                    <li>
                      Processing is necessary for the performance of a contract
                      to which You are party or in order to take steps at Your
                      request prior to entering into a contract.
                    </li>
                  </ul>
                </td>
                <td>
                  <p>
                    <b>
                      In order for Us to be able to provide You with Our
                      Services (including the Website)
                    </b>
                  </p>
                  <p>
                    Whenever You request to use Our Services (including the
                    Website), We will process the Personal Data required for Us
                    to perform such request. For instance, in order to ship the
                    Art that You purchase by way of redemption of Your
                    Diamond-NFT into Jewelry art piece, You will be required to
                    provide Us with some Personal Data about You.
                  </p>
                </td>
                <td>2</td>
              </tr>
              <tr>
                <td>
                  <ul>
                    <li>
                      Processing is necessary for the performance of a contract
                      to which You are party or in order to take steps at Your
                      request prior to entering into a contract.
                    </li>
                  </ul>
                </td>
                <td>
                  <p>
                    <b>
                      In order to contact You for the purpose of operational
                      requirements
                    </b>
                  </p>
                  <p>
                    In some circumstances, We will contact You in order to
                    update You in respect of certain operational matters—for
                    instance, if We wish to update You of new Services features.
                    In these circumstances, We will need to use Personal Data
                    about You accordingly.{" "}
                  </p>
                </td>
                <td>3</td>
              </tr>
              <tr>
                <td>
                  <ul>
                    <li>
                      Processing is necessary for the purpose of the legitimate
                      interests pursued by the Company or by a third party.
                    </li>
                  </ul>
                </td>
                <td>
                  <p>
                    <b>
                      In order to respond to Your queries, requests, and/or
                      complaints, and to provide You with customer support
                      services
                    </b>
                  </p>
                  <p>
                    Processing of Personal Data about You is required in order
                    to respond to queries You may have concerning Your use of
                    the Services, and in general to provide You with customer
                    support services.{" "}
                  </p>
                </td>
                <td>4</td>
              </tr>
              <tr>
                <td>
                  <ul>
                    <li>
                      Processing is necessary for the purpose of the legitimate
                      interests pursued by the Company or by a third party.
                    </li>
                  </ul>
                </td>
                <td>
                  <p>
                    <b>
                      In order to customize the Services to Your Needs and
                      preferences
                    </b>
                  </p>
                  <p>
                    We may analyze the data that We gather about You and infer
                    from such analysis additional information about You, in
                    order to make accessible to You a more customized content or
                    services.
                  </p>
                </td>
                <td>5</td>
              </tr>
              <tr>
                <td>
                  <ul>
                    <li>Your consent</li>
                  </ul>
                </td>
                <td>
                  <p>
                    <b>In order to send You marketing materials</b>
                  </p>
                  <p>
                    In as much as You agree to receive marketing materials from
                    Us, We will send You, via the means of communication You
                    consented to, marketing materials relating to Our Services,
                    whether in existence now or in the future, whether similar
                    to Our Services and whether different ones, and/or products
                    and services of third parties.
                  </p>
                  <p>
                    It is hereby clarified that You may withdraw Your consent at
                    any time, by clicking the unsubscribe button at bottom of
                    the email or message.{" "}
                  </p>
                  <p>
                    It is hereby further clarified that unsubscribing will not
                    cause the deletion of Your contact details, but to cease
                    receiving marketing materials – unless You re-request to
                    receive them.
                  </p>
                </td>
                <td>6</td>
              </tr>
              <tr>
                <td>
                  <ul>
                    <li>
                      Processing is necessary for the purpose of the legitimate
                      interests pursued by the Company or by a third party.
                    </li>
                  </ul>
                </td>
                <td>
                  <p>
                    <b>
                      In order to provide You with tailor made marketing
                      materials and offers
                    </b>
                  </p>
                  <p>
                    We process Personal Data about You in order to adjust the
                    materials presented to You according to Your preferences,
                    behavior, characteristics and interests; these materials can
                    be Ours or of third parties. For this purpose, We use
                    automated analysis techniques, including profiling.
                  </p>
                  <p>
                    We process Personal Data about You in order to adjust the
                    materials presented to You according to Your preferences,
                    behavior, characteristics and interests; these materials can
                    be Ours or of third parties. For this purpose, We use
                    automated analysis techniques, including profiling.
                  </p>
                </td>
                <td>7</td>
              </tr>
              <tr>
                <td>
                  <ul>
                    <li>
                      Processing is necessary for compliance with a legal
                      obligation to which the Company is subject.
                    </li>
                  </ul>
                </td>
                <td>
                  <p>
                    <b>
                      In order to comply with any legal obligations or judicial
                      or administrative orders
                    </b>
                  </p>
                  <p>
                    We process Personal Data about You in order to comply with
                    Our various legal obligations, including AML obligations.{" "}
                  </p>
                </td>
                <td>8</td>
              </tr>
              <tr>
                <td>
                  <ul>
                    <li>
                      Processing is necessary for the purpose of the legitimate
                      interests pursued by the Company or by a third party.
                    </li>
                  </ul>
                </td>
                <td>
                  <p>
                    <b>
                      In order to improve the Services, as well as to develop
                      new ones
                    </b>
                  </p>
                  <p>
                    We may use Personal Data about You in order to improve the
                    Services. Such processing will include, inter alia, any
                    comments and complaints received in respect of the Services,
                    as well as any errors and malfunctions reports.{" "}
                  </p>
                </td>
                <td>9</td>
              </tr>
              <tr>
                <td>
                  <ul>
                    <li>
                      Processing is necessary for the purpose of the legitimate
                      interests pursued by the Company or by a third party.
                    </li>
                  </ul>
                </td>
                <td>
                  <p>
                    <b>
                      In order to perform and maintain various activities
                      supporting the Services
                    </b>
                  </p>
                  <p>
                    Such activities include back-office functions, business
                    development activities, strategic decision-making, etc.
                  </p>
                </td>
                <td>10</td>
              </tr>
              <tr>
                <td>
                  <ul>
                    <li>
                      Processing is necessary for the purpose of the legitimate
                      interests pursued by the Company or by a third party.
                    </li>
                  </ul>
                </td>
                <td>
                  <p>
                    <b>
                      In order to perform analysis, including statistical
                      analysis
                    </b>
                  </p>
                  <p>
                    We use various analytical measures (including statistical
                    ones) to make decisions on various issues. For instance,
                    data collected from Users may be put through algorithms to
                    make decisions about User experiences, create and assign
                    User profiles, and provide other services. However, no
                    algorithms shall be used to make adverse decisions about
                    Users unless it is to fulfill an affirmative duty to prevent
                    criminal activity.
                  </p>
                </td>
                <td>11</td>
              </tr>
              <tr>
                <td>
                  <ul>
                    <li>
                      Processing is necessary for the purpose of the legitimate
                      interests pursued by the Company or by a third party.
                    </li>
                  </ul>
                </td>
                <td>
                  <p>
                    <b>
                      In order to protect Our and third parties’ interests,
                      rights, and assets, including initiation, exercise, or
                      defense of legal claims
                    </b>
                  </p>
                  <p>
                    We may process Personal Data about You in order to protect
                    Our interests, rights, and assets, or those of third
                    parties, according to any law, regulation, or agreement,
                    including any of Our terms and conditions and policies.
                  </p>
                </td>
                <td>12</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="start-start-aligned-row heading">
          <div>6.</div>
          <div>
            Your Right To Object To The Processing of Personal Data About You For
            Direct Marketing Purposes
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>6.1.</div>
          <div>
            <p>
              The Company may provide You with offers that are tailored for You
              specifically, in order to connect You to products, services and
              activities in ways that are compatible to Your needs and preference.
              This may include ads, offers and other sponsored content related to
              products and services of Ours or of third parties. For this purpose,
              We may use automated analysis techniques that provide Us with
              analysis and conclusions concerning You in various aspects,
              including profiling.
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>6.2.</div>
          <div>
            <p>
              Similar analysis and conclusions are used to the extent that You
              agreed to receive marketing materials from Us, as such materials can
              be tailored to offer You products and services which We think may be
              of more interest to You.{" "}
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>6.3.</div>
          <div>
            <p>
              You shall have the right to object at any time to such processing
              for direct marketing purposes, including profiling to the extent
              that it is related to such direct marketing, by sending a notice to
              the following email address: <MailToSupportLink />, in which case We
              shall cease to process Personal Data about You for direct marketing
              purposes.{" "}
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>6.4.</div>
          <div>
            <p>
              In addition, You may withdraw Your consent from receiving marketing
              materials via email at any time, by sending an email free of charge
              with the title “unsubscribe” to the following email address:{" "}
              <MailToSupportLink /> or by clicking the unsubscribe option in any
              marketing material sent to You. You can withdraw Your consent from
              receiving marketing materials via push notifications in Your mobile
              device’s settings page.
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>6.5.</div>
          <div>
            <p>
              Please note that if You opt out of receiving marketing
              communications from Us, We may still communicate with You from time
              to time if We need to provide You with non-marketing information
              about Our Services or for other legitimate non-marketing reasons.
            </p>
          </div>
        </div>

        <div className="start-start-aligned-row heading">
          <div>7.</div>
          <div>Transfer Of Personal Data To Third Parties</div>
        </div>
        <div className="start-start-aligned-row">
          <div>7.1.</div>
          <div>
            <p>
              We will not disclose Personal Data about You to third parties except
              as detailed in this Policy.
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>7.2.</div>
          <div>
            <p>
              We may transfer Personal Data to entities that control Us, entities
              that are under Our control and/or to entities under common control
              or ownership with Us, as shall be from time to time (collectively
              the <b>“Group”</b>). Such entities may use the Personal Data to
              support the needs of the Group.{" "}
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>7.3.</div>
          <div>
            <p>
              The Company may also share Personal Data about You with third
              parties that provide Us with the following services:
            </p>
            <ul>
              <li>
                Storage and hosting providers, including cloud computing services
                and data security services;
              </li>
              <li>IP address information;</li>
              <li>Analysis of user experience;</li>
              <li>Support;</li>
              <li>Marketing;</li>
              <li>CRM data management;</li>
              <li>KYC checks third-party provider;</li>
              <li>Accounting and legal services; and</li>
              <li>Research, analytical, technical, and diagnostic services.</li>
            </ul>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>7.4.</div>
          <div>
            <p>
              In addition, We may share Personal Data about You with the following
              third parties or for the following purposes:
            </p>
            <ul>
              <li>Upon Your consent or instruction;</li>
              <li>
                If We are involved in a merger, acquisition, bankruptcy,
                reorganization, partnership, asset sale or any other such
                transaction;
              </li>
              <li>
                To protect Our rights, property and interest or those of third
                parties;
              </li>
              <li>
                To fulfil Our legal or regulatory requirements or to comply with a
                court order.
              </li>
            </ul>
          </div>
        </div>

        <div className="start-start-aligned-row heading">
          <div>8.</div>
          <div>Transfer of Personal Data Abroad</div>
        </div>
        <div className="start-start-aligned-row">
          <div />
          <div>
            <p>
              Personal Data about You may be transferred to a third country (i.e.
              jurisdictions other than the one You reside in) or to international
              organizations. In such circumstances, the Company shall take
              appropriate safeguards to ensure the protection of Personal Data
              about You and to provide that enforceable data subject rights and
              effective legal remedies for data subjects are available.
            </p>
            <p>
              If You are an EEA resident, please note that these safeguards and
              protection will be available if any of the following are met:
            </p>
            <ol type="a">
              <li>
                The transfer is to a third country or an international
                organization that the EU Commission has decided provides an
                adequate level of protection to the Personal Data that is
                transferred to it pursuant to Article 45(3) of Regulation (EU)
                2016/679 of the European Parliament and of the Council of 27 April
                2016 (<b>"GDPR"</b>);
              </li>
              <li>
                The transfer is according to a legally binding and enforceable
                instrument between public authorities or bodies pursuant to
                Article 46(2)(a) of the GDPR; or
              </li>
              <li>
                The transfer is in accordance with standard data protection
                clauses adopted by the EU Commission pursuant to Article 46(2)(c)
                of the GDPR.
              </li>
            </ol>
            <p>
              You may request that the Company provide You with details concerning
              the safeguards employed by it to protect the Personal Data about You
              that are transferred to a third country or an international
              organization, by sending an email to the following address:{" "}
              <MailToSupportLink />.
            </p>
          </div>
        </div>

        <div className="start-start-aligned-row heading">
          <div>9.</div>
          <div>Retention of Personal Data</div>
        </div>
        <div className="start-start-aligned-row">
          <div />
          <div>
            <p>
              We will retain Personal Data about You only for as long as necessary
              for the fulfillment of the purposes for which such Personal Data is
              collected. We may retain Personal Data about You for longer periods,
              if We find it necessary to comply with legal requirements applicable
              to Us.
            </p>
          </div>
        </div>

        <div className="start-start-aligned-row heading">
          <div>10.</div>
          <div>Security</div>
        </div>
        <div className="start-start-aligned-row">
          <div />
          <div>
            <p>
              We have implemented suitable security policies, rules and technical
              measures to protect and safeguard the Personal Data under Our
              control from unauthorized access, improper use or disclosure,
              unauthorized modification, or unlawful destruction. However, any
              storage of Personal Data and especially, the transfer thereof via
              the internet cannot be fully secured, and therefore We cannot
              promise absolute protection of Your Personal Data.{" "}
            </p>
          </div>
        </div>

        <div className="start-start-aligned-row heading">
          <div>11.</div>
          <div>Disclaimer</div>
        </div>
        <div className="start-start-aligned-row">
          <div />
          <div>
            <p>
              We cannot guarantee, nor do We represent, that there will be
              error-free performance regarding the privacy of Your Personal Data,
              and We will not be liable for any indirect, incidental,
              consequential, or punitive damages relating to the use or release of
              Personal Data about You including, but not limited to, disclosure of
              Personal Data due to errors in transmission, unauthorized
              third-party access, or other causes beyond Our reasonable control.
            </p>
          </div>
        </div>

        <div className="start-start-aligned-row heading">
          <div>12.</div>
          <div>Links to Other Websites</div>
        </div>
        <div className="start-start-aligned-row">
          <div>12.1.</div>
          <div>
            <p>
              The Services may contain links to websites and/or applications of
              third parties. Other websites and applications may also reference or
              link to Our Website. We do not control such websites and
              applications, nor the collection and/or processing of Personal Data
              about You by such websites and applications, and thus We are not
              responsible for their privacy practices. This Policy does not apply
              to any actions taken via such websites and/or applications.
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>12.2.</div>
          <div>
            <p>
              Whenever You access such third parties’ websites and/or
              applications, We recommend that You carefully review their privacy
              policies prior to using such websites and/or applications and prior
              to disclosing any Personal Data about You.
            </p>
          </div>
        </div>

        <div className="start-start-aligned-row heading">
          <div>13.</div>
          <div>Your Rights In Respect Of The Personal Data About You</div>
        </div>
        <div className="start-start-aligned-row">
          <div>13.1.</div>
          <div>
            <p>
              Generally, You have the right to request that We provide You with
              confirmation as to whether Personal Data about You is being
              collected by Us, to ask to review such data, to rectify the Personal
              Data if applicable and to erase the Personal Data no longer required
              by Us.
            </p>
          </div>
        </div>
        <p>If You are an EEA resident, please read this section below:</p>
        <div className="start-start-aligned-row">
          <div>13.2.</div>
          <div>
            <p>
              You are entitled to the following rights in respect of the Personal
              Data about You. To exercise such rights, You may send a request to
              exercise Your rights to the following email address:{" "}
              <MailToSupportLink />.{" "}
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>13.3.</div>
          <div>
            <p>
              We will fulfil Your right to receive information about how Personal
              Data about You is processed by Us; to rectify any inaccuracy in Your
              Personal Data; to erase Your Personal Data processed and stored by
              Us; to restrict the processing of Personal Data about You or object
              to such processing if applicable under the circumstances; and the
              right to receive the Personal Data about You, which You have
              provided to the Company, in a structured machine readable manner.
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>13.4.</div>
          <div>
            <p>
              We may reject Your requests where they harm the rights and freedoms
              of others or where We must do so to comply with legal requirements
              applicable to Us. We may also charge a reasonable fee where
              applicable.
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          <div>13.5.</div>
          <div>
            <p>
              You will also have the right to lodge a complaint with a supervisory
              authority established by a Member State to protect the fundamental
              rights and freedoms of natural persons in relation to the processing
              of Personal Data within the European Union.{" "}
            </p>
          </div>
        </div>

        <table>
          <thead>
          <tr>
            <th>Scope</th>
            <th>Right</th>
            <th />
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              <p>You have the right to receive the following information:</p>
              <ul>
                <li>What types of Personal Data collected;</li>
                <li>
                  What are the types of sources of the Personal Data collected;
                </li>
                <li>To what end We collect the Personal Data;</li>
                <li>
                  Types of third parties with whom We share Personal Data, if
                  any; and
                </li>
                <li>
                  The specific pieces of Personal Data We have collected about
                  You.
                </li>
              </ul>
            </td>
            <td>Right to know</td>
            <td>1</td>
          </tr>
          <tr>
            <td>
              <p>
                You may ask Us to delete Your Personal Data and direct Our
                service providers to do so.
              </p>
              <p>
                Please note that We may not delete Your Personal Data if it is
                necessary to complete Our legal obligation to You to provide the
                Services or otherwise protect Our legal rights; to comply with
                an existing legal obligation; or use Your Personal Data,
                internally, in a lawful manner that is compatible with the
                context in which You provided the information.
              </p>
            </td>
            <td>Right of Erasure</td>
            <td>2</td>
          </tr>
          <tr>
            <td>
              You have the right to not be discriminated against by Us because
              You exercised any of Your rights under the CCPA.{" "}
            </td>
            <td>
              Right to Non-Discrimination for the exercise of Your privacy
              rights
            </td>
            <td>3</td>
          </tr>
          <tr>
            <td>
              You may designate an authorized agent to make a request under the
              CCPA on Your behalf. To do so, You need to provide the authorized
              agent written permission to do so and the agent will need to
              submit to Us a proof that such agent has been authorized by You.
              We will also require that You verify Your own identity, as
              explained below.
            </td>
            <td>
              Right to designate an authorized agent to submit CCPA requests on
              Your behalf
            </td>
            <td>4</td>
          </tr>
          </tbody>
        </table>
        <div className="start-start-aligned-row">
          <div />
          <div>
            <p style={{ marginTop: "1em" }}>
              In order to exercise Your CCPA rights, please contact Us using the
              following details: <MailToSupportLink />.{" "}
            </p>
          </div>
        </div>
        <div className="start-start-aligned-row">
          Please note that We may need to receive Personal Data from You in order
          to verify Your identity prior to allowing You to exercise Your rights.
        </div>
        <div className="start-start-aligned-row heading">
          <div>14.</div>
          <div>Changes to the Policy</div>
        </div>
        <div className="start-start-aligned-row">
          <div />
          <div>
            <p>
              We may amend, from time to time, the terms of this Policy. Whenever
              We amend this Policy, We will notify You of such amendments by
              publishing the updated Policy on the Website. In addition, when We
              make significant amendments to this Policy, We will strive to inform
              You about such amendments via means of communication We believe are
              reasonably appropriate to inform You of such amendments and by
              publishing a notice about such amendments on the Website. Unless
              stated otherwise, all amendments will enter into force upon
              publication of the updated Policy on Our Website or on the
              designated page in the Website.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </PageSizeLimit>
);

export default PrivacyPage;
