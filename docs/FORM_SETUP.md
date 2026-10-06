# Website forms → Google Form

The website submits straight to two Google Forms. The connection, including each question's `entry.` ID, lives in [`src/lib/submit.js`](../src/lib/submit.js).

| Website form | Google Form | Questions |
|---|---|---|
| Project enquiry (Contact section) | STAT6 project enquiry | Full name, Work email, Phone, Company, Current website, Services, Budget, Launch timeline, Project details, How did you hear about us |
| STAT6 BMS waitlist | STAT6 BMS waitlist | Full name, Work email |

## Required settings (both forms)

Without these, Google silently rejects submissions from the website.

- **Settings → Responses → Collect email addresses:** Do not collect
- **Settings → Responses → Limit to 1 response:** off
- **Workspace accounts:** turn off "Restrict to users in your organisation"
- The form must be **published** and **accepting responses**
- Leave all questions **optional**. The website validates required fields itself.

## Where to see entries

- **Responses tab** in the form, or **Link to Sheets** for a spreadsheet
- **⋮ → Get email notifications for new responses** for an email per enquiry

## Editing the form

Option text must match the website exactly, character for character:

- **Services:** Custom software · AI agents · AI automation and integration · Website · SEO and AI search · STAT6 BMS
- **When do you want to launch?** As soon as possible · In 1 to 3 months · In 3 to 6 months · Just exploring
- **How did you hear about us?** Google search · ChatGPT or AI search · LinkedIn · Instagram · Referral · Event · Other

If you rename an option, change it in `src/components/EnquiryForm.jsx` too. If you add or replace a question, get a new pre-filled link (**⋮ → Get pre-filled link**) and update the `entry.` IDs in `src/lib/submit.js`.
