// Sends website forms straight to Google Forms. Responses appear in each form's
// Responses tab and linked Google Sheet. See docs/FORM_SETUP.md.
//
// Option text for Services, launch timeline and "How did you hear about us"
// must match the Google Form options exactly, or Google drops that answer.
const FORMS = {
  enquiry: {
    id: '1FAIpQLScjT-YjsH23LE7m11HuC-OHI8lv0dKoyZioSbe0vRCoy0GNHA',
    fields: {
      name: 'entry.816395972',
      email: 'entry.3894537',
      phone: 'entry.632465745',
      company: 'entry.205285810',
      website: 'entry.1844104256',
      services: 'entry.1693376879', // checkboxes: one entry per ticked option
      budget: 'entry.566859339',
      timeline: 'entry.2073515990',
      details: 'entry.1115585367',
      source: 'entry.1023414681',
    },
  },
  waitlist: {
    id: '1FAIpQLSfIQaeeX_a4WYJaO0sr-5vncwUJG-veKixIEVEovCEazJpXHQ',
    fields: {
      name: 'entry.906295489',
      email: 'entry.1120840864',
    },
  },
}

export async function submitForm(type, data) {
  const form = FORMS[type]
  if (!form) throw new Error(`Unknown form: ${type}`)

  const body = new URLSearchParams()
  for (const [key, entry] of Object.entries(form.fields)) {
    const v = data[key]
    if (Array.isArray(v)) v.forEach((item) => body.append(entry, item))
    else if (v != null && String(v).trim() !== '') body.append(entry, String(v).trim())
  }

  // Google Forms sends no CORS headers, so the response is opaque. A network
  // failure still throws, and the forms show an error with the email fallback.
  await fetch(`https://docs.google.com/forms/d/e/${form.id}/formResponse`, { method: 'POST', mode: 'no-cors', body })
  return { ok: true }
}
