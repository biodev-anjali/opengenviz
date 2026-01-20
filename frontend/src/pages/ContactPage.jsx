/** Contact page (frontend-only, mailto submission) */
import React, { useMemo, useState } from 'react'
import Layout from '../components/Layout'

const CONTACT_EMAIL = 'hello@opengenviz.com'

const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  })
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(() => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!form.email.trim()) next.email = 'Email is required.'
    if (!form.message.trim()) next.message = 'Message is required.'
    return next
  }, [form])

  const canSubmit = Object.keys(errors).length === 0

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const onBlur = (key) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(false)
    setTouched({ name: true, email: true, organization: true, message: true })

    if (!canSubmit) return

    const subject = `OpenGenViz Contact — ${form.name.trim()}`
    const bodyLines = [
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      `Organization: ${form.organization.trim() || '(not provided)'}`,
      '',
      'Message:',
      form.message.trim(),
    ]

    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`

    // Frontend-only submission: open user's email client with a prefilled draft.
    window.location.href = href
    setSubmitted(true)
  }

  return (
    <Layout showDisclaimer={false}>
      <div className="page-container">
        <div className="page-header">
          <h2 className="page-title">Contact Us</h2>
          <p className="page-subtitle">
            Talk to us about early access, lab usage, or custom requirements.
          </p>
        </div>

        <div className="panel" style={{ maxWidth: 760 }}>
          <p style={{ marginBottom: '1rem', color: '#444' }}>
            OpenGenViz is currently onboarding early users manually. If you are a researcher, lab, or biotech team interested in using the product,
            reach out to us.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Name <span style={{ color: '#c0392b' }}>*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={onChange('name')}
                onBlur={onBlur('name')}
                placeholder="Your full name"
                aria-invalid={Boolean(touched.name && errors.name)}
              />
              {touched.name && errors.name && (
                <p className="helper-text" style={{ color: '#c0392b' }}>
                  {errors.name}
                </p>
              )}

              <label style={{ marginTop: '0.75rem' }}>
                Email <span style={{ color: '#c0392b' }}>*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={onChange('email')}
                onBlur={onBlur('email')}
                placeholder="Work or academic email preferred"
                aria-invalid={Boolean(touched.email && errors.email)}
              />
              {touched.email && errors.email && (
                <p className="helper-text" style={{ color: '#c0392b' }}>
                  {errors.email}
                </p>
              )}

              <label style={{ marginTop: '0.75rem' }}>
                Organization <span className="helper-text" style={{ marginLeft: '0.25rem' }}>(optional)</span>
              </label>
              <input
                type="text"
                value={form.organization}
                onChange={onChange('organization')}
                onBlur={onBlur('organization')}
                placeholder="University, lab, or company name"
              />

              <label style={{ marginTop: '0.75rem' }}>
                Message <span style={{ color: '#c0392b' }}>*</span>
              </label>
              <textarea
                value={form.message}
                onChange={onChange('message')}
                onBlur={onBlur('message')}
                placeholder="Tell us briefly about your use case, dataset type, or research workflow."
                rows={6}
                style={{ resize: 'vertical' }}
                aria-invalid={Boolean(touched.message && errors.message)}
              />
              {touched.message && errors.message && (
                <p className="helper-text" style={{ color: '#c0392b' }}>
                  {errors.message}
                </p>
              )}
            </div>

            <button className="btn btn-primary" type="submit" disabled={!canSubmit}>
              Send message
            </button>
            {!canSubmit && (
              <p className="helper-text" style={{ marginTop: '0.5rem' }}>
                Please fill the required fields to continue.
              </p>
            )}

            {submitted && (
              <div className="docs-warning" style={{ marginTop: '1rem' }}>
                Your email client should open with a pre-filled message. If it doesn’t, you can email us directly at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#3498db', textDecoration: 'none', fontWeight: 500 }}>
                  {CONTACT_EMAIL}
                </a>
                .
              </div>
            )}
          </form>

          <p className="helper-text" style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
            We typically respond within 24–48 hours. Your message will only be used to contact you back.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default ContactPage


