const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require("md5");
const _ = require("lodash");

const isEmailActive = !_.isEmpty(process.env.MAILCHIMP_API_KEY);

if (isEmailActive) {
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: "us21",
  });
}

const APPROVED_LIST_ID = "11f455b394";
const APPLICANTS_LIST_ID = "ed3fc1dea7";

async function removeFromList(email) {
  const subscriberHash = md5(email.toLowerCase());
  const response = await mailchimp.lists.updateListMember(
    APPLICANTS_LIST_ID,
    subscriberHash,
    {
      status: "unsubscribed",
    }
  );

  console.log(`This user is now ${response.status}.`);
}

async function onApplicationApproved(applicant) {
  if (!isEmailActive) return;

  try {
    console.log("onApplicationSubmitted");
    if (!applicant || !applicant.email) {
      console.error(
        "onApplicationApproved FAILED, applicant has no email address",
        applicant
      );
      return;
    }

    await removeFromList(applicant.email);

    const applicantName = applicant.twitter
      ? applicant.twitter.substring(1)
      : applicant.email.substring(0, applicant.email.indexOf("@"));
    const response = await mailchimp.lists.addListMember(APPROVED_LIST_ID, {
      email_address: applicant.email,
      status: "subscribed",
      merge_fields: {
        FNAME: applicantName,
      },
    });

    console.log(
      `onApplicationApproved Success. The contact's id is ${response.id}.`
    );
  } catch (e) {
    console.error("onApplicationApproved FAILED", e);
  }
}

module.exports = {
  onApplicationApproved,
};
