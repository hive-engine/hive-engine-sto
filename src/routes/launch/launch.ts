import { DialogService } from 'aurelia-dialog';
import { autoinject } from 'aurelia-framework';

import './launch.css';
import { EnquireModal } from './modals/enquire';

@autoinject()
export class Launch {
    private pricingPackages = [
        {
            id: 'colony',
            name: 'Colony',
            subheading: 'Regulation D - 506(B) Offering',
            description: `Companies conducting an offering under Rule 506(b) can raise an unlimited amount of money and can sell securities to an unlimited number of accredited investors with the following two requirements: (1) No General Solicitation or Advertising to Market the Securities; and (2) Securities may not be sold to more than 35 non-accredited investors.`,
            items: [
                'Business + Legal Evaluation',
                'Term Sheet + Form D Filing',
                'Non-Accredited Investor Screening',
                'Accredited Investor Screening',
                'Private Placement Memorandum (PPM)',
                'Security Token Subscription Agreement'
            ],
            price: '9,5000 USD + State costs',
            stateCosts: true
        },
        {
            id: 'velocity',
            name: 'Velocity',
            subheading: 'Regulation D - 506(C) Offering',
            description: `Companies conducting an offering under Rule 506(c) can raise an unlimited amount of money and can sell securities to an unlimited number of accredited investors.`,
            items: [
                'Business + Legal Evaluation',
                'Term Sheet + Form D Filing',
                'Accredited Investor Screening',
                'Private Placement Memorandum (PPM)',
                'Security Token Subscription Agreement'
            ],
            price: '9,5000 USD + State costs',
            stateCosts: true
        },
        {
            id: 'slingshot',
            name: 'Slingshot',
            subheading: 'Regulation D - 504 Offering',
            description: `Companies conducting an offering under Rule 504 are afforded an exemption from registration requirements of federal securities laws for so long as they offer and sell up to $5,000,000 of their securities in any 12-month period. Additionally, the entity must file at the state level for any state the tokens are being offered, which subjects them to limitations at the state level.`,
            items: [
                'Business + Legal Evaluation',
                'Term Sheet + Form D Filing',
                'Accredited Investor Screening',
                'Private Placement Memorandum (PPM)',
                'Security Token Subscription Agreement',
                'State Filings (Additional cost per State)'
            ],
            price: '9,5000 USD + State costs',
            stateCosts: true
        },
        {
            id: 'alliance',
            name: 'Alliance',
            subheading: 'Regulation CF (Crowd Funding)',
            description: `Companies conducting an offering through Regulation CF are able to raise a maximum aggregate amount of $1,070,000 from any individual in a 12-month period. All transactions must take place online through an SEC-registered intermediary, either a broker-dealer or a funding portal. In addition, a company must draft and file a Form C with the SEC before proceeding with their raise.`,
            items: [
                'Business + Legal Evaluation',
                'Term Sheet + Form D Filing',
                'Accredited Investor Screening',
                'Private Placement Memorandum (PPM)',
                'Security Token Subscription Agreement',
                'Contractual Documents'
            ],
            price: '9,995 USD'
        },
        {
            id: 'interstellar',
            name: 'Interstellar',
            subheading: 'Regulation S - Foreign Offering',
            description: `Offer securities in the form of tokens to foreign investors and employees, advisers, and independent contractors based outside the United States.`,
            items: [
                'Business + Legal Evaluation',
                'Term Sheet + Form D Filing',
                'Foreign Jurisdiction Verification',
                'Accredited Investor Screening',
                'Private Placement Memorandum (PPM)',
                'Security Token Subscription Agreement'
            ],
            price: '12,000 USD'
        },
        {
            id: 'explorer',
            name: 'Explorer',
            subheading: 'Regulation 701 - Employee Offering',
            description: `Offer employees, advisers, and independent contractors equity for services with an equity plan.`,
            items: [
                'TOKEN/EQUITY PLAN',
                'U.S. AWARD AGREEMENTS',
                'NON-U.S. AWARD AGREEMENTS',
                'INCLUDES ONE JURISDICTION'
            ],
            price: '5,000 USD + 1,000/Jur.'
        }
    ];

    private services = [
        {
            id: 'corporation',
            name: 'Corporation',
            subheading: 'United States',
            description: `Create a legal corporation within the United States.`,
            items: [
                'Articles of Organization',
                'Bylaws',
                'Corporate Resolutions'
            ],
            price: '1,500 USD'
        },
        {
            id: 'corporation-foreign',
            name: 'Corporation',
            subheading: 'Foreign Jurisdiction',
            description: `Cayman Islands, Malta, BVI, Singapore, Bermuda, Caymans, Liechtenstein, and more.`,
            items: [
                'Articles of Organization',
                'Bylaws',
                'Corporate Resolutions'
            ],
            price: '3,000 USD'
        },
        {
            id: 'llc',
            name: 'LLC',
            subheading: 'United States',
            description: `Create a legal corporation within the United States.`,
            items: [
                'Operating Agreement',
                'Certificate of Organization'
            ],
            price: '1,500 USD'
        },
        {
            id: 'llc-foreign',
            name: 'LLC',
            subheading: 'Foreign Jurisdiction',
            description: `Cayman Islands, Malta, BVI, Singapore, Bermuda, Caymans, Liechtenstein, and more.`,
            items: [
                'Operating Agreement',
                'Certificate of Organization'
            ],
            price: '1,500 USD'
        },
        {
            id: 'doc-review',
            name: 'Doc Review',
            subheading: 'Compliance / Promo Materials',
            description: `Attorney review of all promotional materials used in connection with the offering for material misrepresentations, omissions, and compliance with Securities and Exchange Commission (SEC) rules.`,
            items: [
                'White Paper Audit',
                'Website Audit',
                'PowerPoints, Commericals, Ads',
                'Terms of Service',
                'Privacy Policy'
            ],
            price: '4,000 USD'
        }
    ];

    constructor(private dialogService: DialogService) {

    }

    private launch(item: any) {
        this.dialogService.open({ viewModel: EnquireModal, model: item }).whenClosed(response => {
            console.log(response);
        });
    }
}
