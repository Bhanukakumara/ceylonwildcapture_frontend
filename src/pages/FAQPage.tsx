import { useState } from 'react';
import './FAQPage.css';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "How do I purchase photos?",
        answer: "Browse our collection, click on any photo you like, and add it to your cart. Once you're ready, proceed to checkout and complete your purchase securely. You'll receive download links immediately after payment."
    },
    {
        question: "What file formats are available?",
        answer: "All photos are available in high-resolution JPEG format. For commercial licenses, we also provide TIFF and RAW formats upon request."
    },
    {
        question: "Can I use the photos for commercial purposes?",
        answer: "Yes! We offer different licensing options including personal use and commercial use licenses. Make sure to select the appropriate license during checkout based on your intended use."
    },
    {
        question: "What is your refund policy?",
        answer: "Due to the digital nature of our products, we generally don't offer refunds once the download link has been accessed. However, if you experience technical issues or receive a corrupted file, please contact us within 7 days and we'll resolve the issue."
    },
    {
        question: "How do I become a photographer on this platform?",
        answer: "We're always looking for talented wildlife photographers! Create an account, navigate to your profile settings, and apply to become a photographer. Our team will review your portfolio and get back to you within 5-7 business days."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for larger orders. All transactions are secured with SSL encryption."
    },
    {
        question: "Can I get a custom print of a photo?",
        answer: "Yes! Contact us through our Contact page with the photo ID and your desired print size and specifications. We'll provide you with a quote and timeline for custom prints."
    },
    {
        question: "How long do I have access to my purchased photos?",
        answer: "Once you purchase a photo, you have lifetime access to download it from your account. We recommend downloading and backing up your purchases immediately after payment."
    },
    {
        question: "Are the photos watermarked?",
        answer: "Preview images on the website are watermarked. However, the high-resolution files you receive after purchase are completely watermark-free."
    },
    {
        question: "Can I request a specific wildlife photo?",
        answer: "Absolutely! If you're looking for a specific species or scene, contact us with your requirements. We'll check with our photographers and see if we can fulfill your request."
    },
    {
        question: "What is the resolution of the photos?",
        answer: "All our photos are high-resolution, typically ranging from 12MP to 50MP depending on the photographer's equipment. Exact dimensions are listed on each photo's detail page."
    },
    {
        question: "Do you offer bulk discounts?",
        answer: "Yes! For purchases of 10 or more photos, please contact us for special bulk pricing. We also offer subscription plans for regular buyers."
    }
];

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-page">
            <section className="faq-hero">
                <div className="container">
                    <h1 className="page-title">Frequently Asked Questions</h1>
                    <p className="page-subtitle">
                        Find answers to common questions about Ceylon Wild Capture
                    </p>
                </div>
            </section>

            <section className="faq-content">
                <div className="container">
                    <div className="faq-container">
                        {faqData.map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item ${openIndex === index ? 'active' : ''}`}
                            >
                                <button
                                    className="faq-question"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <span>{faq.question}</span>
                                    <svg
                                        className="faq-icon"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M19 9l-7 7-7-7"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="faq-cta">
                        <h2>Still have questions?</h2>
                        <p>Can't find the answer you're looking for? Please contact our support team.</p>
                        <a href="/contact" className="btn btn-primary btn-lg">
                            Contact Support
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQPage;
