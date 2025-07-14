'use client';

const PrivacyPolicy = () => {
  return (
    <div className="font-mono text-gray-800 dark:text-gray-300 p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Naikas Reminder App Privacy Policy</h1>
      <h3 className="text-lg font-semibold mb-4">Effective Date: 10th July 2025</h3>

      <p className="mb-4">
        Naikas Reminder App ("we", "our", or "us") is committed to protecting your privacy.
        This Privacy Policy explains how your personal information is collected, used, and shared
        when you use our mobile application ("Naikas Reminder App" or the "App").
      </p>

      <p className="mb-4">
        By using Naikas Reminder App, you agree to the collection and use of information in accordance with this policy.
      </p>

      <h2 className="text-xl font-semibold my-2">1. Information We Collect</h2>
      <p className="mb-2">
        We collect limited information to provide you with timely reminders and notifications regarding the renewal or update of your important documents.
      </p>

      <h3 className="font-semibold">1.1 Personal Information</h3>
      <ul className="list-disc list-inside mb-4">
        <li>Name (optional)</li>
        <li>Email address (if account registration or backup is used)</li>
        <li>Reminder titles and descriptions</li>
        <li>Document renewal dates</li>
      </ul>

      <h3 className="font-semibold">1.2 Automatically Collected Information</h3>
      <ul className="list-disc list-inside mb-4">
        <li>Device ID and device type</li>
        <li>OS version and App version</li>
        <li>Crash logs and diagnostics (used for performance and debugging purposes)</li>
        <li>Notification preferences and usage statistics</li>
      </ul>

      <p className="mb-4">
        We do not collect sensitive personal data such as national ID numbers, biometric data, or financial information.
      </p>

      <h2 className="text-xl font-semibold my-2">2. How We Use Your Information</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Provide personalized reminders and notification services</li>
        <li>Enable backup and sync (if enabled by the user)</li>
        <li>Improve app functionality and user experience</li>
        <li>Detect and fix bugs or technical issues</li>
        <li>Comply with legal obligations where applicable</li>
      </ul>

      <h2 className="text-xl font-semibold my-2">3. Data Storage and Security</h2>
      <ul className="list-disc list-inside mb-4">
        <li>All reminders and document-related data are stored locally on your device by default.</li>
        <li>
          If you opt-in to use cloud backup or sync features (e.g., Google Drive), your data may be stored securely on third-party servers,
          subject to their respective privacy policies.
        </li>
        <li>We implement industry-standard security measures to protect your data from unauthorized access or disclosure.</li>
      </ul>

      <h2 className="text-xl font-semibold my-2">4. Data Sharing and Third Parties</h2>
      <p className="mb-2">We do not sell or rent your personal data to third parties.</p>
      <p className="mb-2">We may share limited data in the following cases:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Service Providers: Third-party services (e.g., analytics or cloud storage) that help us operate and improve the App.</li>
        <li>Legal Requirements: If required to do so by law or in response to valid legal requests by public authorities.</li>
        <li>Business Transfers: In the event of a merger, acquisition, or asset sale, user information may be transferred as part of that transaction.</li>
      </ul>

      <h2 className="text-xl font-semibold my-2">5. Your Rights and Choices</h2>
      <ul className="list-disc list-inside mb-4">
        <li>You can access, update, or delete your reminders at any time within the App.</li>
        <li>You can disable notifications via your device settings or within the App.</li>
        <li>You may uninstall the App at any time, which will remove all locally stored data from your device.</li>
      </ul>

      <h2 className="text-xl font-semibold my-2">6. Children’s Privacy</h2>
      <p className="mb-4">
        Naikas Reminder App is not intended for children under the age of 13. We do not knowingly collect personal data from children.
        If you believe a child has provided us with personal data, please contact us so we can delete it.
      </p>

      <h2 className="text-xl font-semibold my-2">7. Changes to This Privacy Policy</h2>
      <p className="mb-4">
        We may update our Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Effective Date."
        We encourage you to review this policy periodically for any updates.
      </p>

      <h2 className="text-xl font-semibold my-2">8. Contact Us</h2>
      <p className="mb-1">If you have any questions or concerns about this Privacy Policy or our practices, please contact us at:</p>
      <p className="mb-1 font-semibold">Naikas App Team</p>
      <p className="mb-1">Email: <a href="mailto:support@naikas.com" className="text-blue-500 hover:underline">support@naikas.com</a></p>
      <p className="mb-1">Website: <a href="https://www.naikas.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">www.naikas.com</a></p>
    </div>
  );
};

export default PrivacyPolicy;
