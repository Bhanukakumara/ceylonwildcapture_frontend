import './LegalPage.css';

const PrivacyPolicyPage = () => {
    return (
        <div className="legal-page">
            <section className="legal-hero">
                <div className="container">
                    <h1 className="page-title">Privacy Policy</h1>
                    <p className="page-subtitle">Last updated: December 20, 2024</p>
                </div>
            </section>

            <section className="legal-content">
                <div className="container">
                    <div className="legal-text">
                        <h2>1. Information We Collect</h2>
                        <p>We collect several types of information for various purposes to provide and improve our service to you.</p>

                        <h3>Personal Data</h3>
                        <p>While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This may include:</p>
                        <ul>
                            <li>Email address</li>
                            <li>First name and last name</li>
                            <li>Phone number</li>
                            <li>Address, State, Province, ZIP/Postal code, City</li>
                            <li>Payment information</li>
                        </ul>

                        <h3>Usage Data</h3>
                        <p>We may also collect information on how the service is accessed and used. This may include your computer's IP address, browser type, browser version, pages visited, time and date of visit, and other diagnostic data.</p>

                        <h2>2. How We Use Your Information</h2>
                        <p>Ceylon Wild Capture uses the collected data for various purposes:</p>
                        <ul>
                            <li>To provide and maintain our service</li>
                            <li>To notify you about changes to our service</li>
                            <li>To provide customer support</li>
                            <li>To gather analysis or valuable information to improve our service</li>
                            <li>To monitor the usage of our service</li>
                            <li>To detect, prevent and address technical issues</li>
                            <li>To process your transactions</li>
                        </ul>

                        <h2>3. Data Security</h2>
                        <p>The security of your data is important to us. We use commercially acceptable means to protect your personal information, but remember that no method of transmission over the Internet is 100% secure.</p>

                        <h2>4. Cookies and Tracking</h2>
                        <p>We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>

                        <h2>5. Third-Party Services</h2>
                        <p>We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, or assist us in analyzing how our service is used. These third parties have access to your personal data only to perform these tasks on our behalf.</p>

                        <h2>6. Payment Processing</h2>
                        <p>We use secure third-party payment processors. We do not store or collect your payment card details. That information is provided directly to our third-party payment processors.</p>

                        <h2>7. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access, update or delete your personal information</li>
                            <li>Rectify inaccurate data</li>
                            <li>Object to processing of your personal data</li>
                            <li>Request restriction of processing</li>
                            <li>Request transfer of your data</li>
                            <li>Withdraw consent</li>
                        </ul>

                        <h2>8. Children's Privacy</h2>
                        <p>Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.</p>

                        <h2>9. Changes to This Privacy Policy</h2>
                        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>

                        <h2>10. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at privacy@ceylonwildcapture.com</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicyPage;
