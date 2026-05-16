export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-6">Last updated: March 7, 2026</p>

        <h2>1. Information We Collect</h2>
        <p>
          At PHAGLP, we collect information to provide better services to all our users. This
          includes:
        </p>
        <ul>
          <li>
            <strong>Profile Information:</strong> Name, email address, and philosophical interests.
          </li>
          <li>
            <strong>Marriage Matching Data:</strong> For those using our matching service, we
            collect personal values and preferences.
          </li>
          <li>
            <strong>Usage Data:</strong> How you interact with our courses and lectures.
          </li>
        </ul>

        <h2>2. How We Use Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services.</li>
          <li>Develop new philosophical and scientific content.</li>
          <li>Protect PHAGLP and our users.</li>
        </ul>

        <h2>3. Data Protection</h2>
        <p>
          We work hard to protect PHAGLP and our users from unauthorized access to or unauthorized
          alteration, disclosure, or destruction of information we hold.
        </p>

        <h2>4. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at
          privacy@phaglp.com.
        </p>
      </div>
    </div>
  )
}
