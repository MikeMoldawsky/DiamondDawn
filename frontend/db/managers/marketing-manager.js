const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: "us21",
});

const APPLICANTS_LIST_ID = "ed3fc1dea7";

async function onApplicationSubmitted(applicant) {
  try {
    console.log("onApplicationSubmitted");
    if (!applicant || !applicant.email) {
      console.error(
        "onApplicationSubmitted FAILED, applicant has no email address",
        applicant
      );
      return;
    }

    const applicantName = applicant.twitter
      ? applicant.twitter.substring(1)
      : applicant.email.substring(0, applicant.email.indexOf("@"));

    const response = await mailchimp.lists.addListMember(APPLICANTS_LIST_ID, {
      email_address: applicant.email,
      status: "subscribed",
      merge_fields: {
        FNAME: applicantName,
      },
    });

    console.log(
      `onApplicationSubmitted Success. The contact's id is ${response.id}.`
    );
  } catch (e) {
    console.error("onApplicationSubmitted FAILED", e);
  }
}

module.exports = {
  onApplicationSubmitted,
};
