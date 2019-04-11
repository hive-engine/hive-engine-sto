import './state-costs.css';

export class StateCosts {
    private stateCosts = [
        { state: 'Alabama', when: 'Within 15 days', cost: '$300' },
        { state: 'Alaska', when: 'Within 15 days', cost: '$600 for one year' },
        { state: 'Arizona', when: 'Within 15 days', cost: '$250' },
        { state: 'Arkansas', when: 'Within 15 days', cost: '1/10 of 1% of the offering price, with a minimum fee of $100, and a maximum fee of $500' },
        { state: 'California', when: 'Within 15 days', cost: '$300' },
        { state: 'Colorado', when: 'Within 15 days', cost: '$50' },
        { state: 'Connecticut', when: 'Within 15 days', cost: '$150' },
        { state: 'Delaware', when: 'Within 15 days', cost: `1/2 of 1% of the maximum aggregate offering price of securities to be offered in Delaware during the initial registration period, but not less than<br>
        $200.00 or more than $1,000.00.
        Late Fee: The Rule 506 filing fee, if not paid when due, will be doubled unless the Director waives the late fee, but the total fee will not excee the relevant statutory maximum amount.` },
        { state: 'District of Columbia', when: 'Within 15 days', cost: '$250' },
        { state: 'Florida', when: 'Within 15 days', cost: 'No filing fee associated with Regulation D exemptions' },
        { state: 'Georgia', when: 'Within 15 days', cost: 'Initial: $250; Renewal: $100' },
        { state: 'Guam', when: 'Within 15 days', cost: 'No laws or regulations on this topic' },
        { state: 'Hawaii', when: 'Within 15 days', cost: '$100' },
        { state: 'Idaho', when: 'Within 15 days', cost: '$50. Late filing of notice: additional $50' },
        { state: 'Illinois', when: 'Within 15 days', cost: '$100' },
        { state: 'Indiana', when: 'Within 15 days', cost: 'No fee' },
        { state: 'Iowa', when: 'Within 15 days', cost: '$100' },
        { state: 'Kansas', when: 'Within 15 days', cost: 'The fee amount should be $250 if timely filed; If filed late, the fee should be the greater of either $500 or 1/10 of 1% of the dollar value of the securities sold to Kansas residents before the date on which Form D is filed, not to exceed $5,000' },
        { state: 'Kentucky', when: 'Within 15 days', cost: '$250' },
        { state: 'Louisiana', when: 'Within 15 days', cost: '$300' },
        { state: 'Maine', when: 'Within 15 days', cost: '$300' },
        { state: 'Maryland', when: 'Within 15 days', cost: '$100' },
        { state: 'Massachusetts', when: 'Within 15 days', cost: `Offering Amount: $0-$500,000 Fee: $150<br>
        Offering Amount: Up to $2,000,000 Fee: $250<br>
        Offering Amount: Up to $7,500,000 Fee: $500<br>
        Offering Amount: $7,500,000 + Fee: $750` },
        { state: 'Michigan', when: 'Within 15 days', cost: '$100' },
        { state: 'Minnesota', when: 'Within 15 days', cost: `Initial filing: $100. Additional filing: 1/10 of 1% of the maximum aggregate offering price at which the securities will be offered in Minnesota, with maximum combined fees not to exceed $300` },
        { state: 'Mississippi', when: 'Within 15 days', cost: `$300 Additional late fee for not submitting the initial notice & fee within 15 days of the first sale of securities in Mississippi: 1% of the amount sold in Mississippi up to a maximum penalty of $5,000. Sales report fee accompanied by sales report on Form D when offering is not completed within 12 months of the date of the initial notice filing: $50<br><br>
        Termination fee due with a notice of completion of offering (upon completing the offering): $50` },
        { state: 'Missouri', when: 'Within 15 days', cost: '$100; Late filing of notice: $50.' },
        { state: 'Montana', when: 'Within 15 days', cost: `$200 plus 1/10 of 1% of any offering
        amount exceeding $100,000
        Maximum fee: $1,000` },
        { state: 'Nebraska', when: 'Within 15 days', cost: '$200' },
        { state: 'Nevada', when: 'Within 15 days', cost: '$500' },
        { state: 'New Hampshire', when: 'Within 15 days', cost: `$500<br>
        <br>
        Late filing fees. 1/10 of 1% of the offering value of a federal covered securities issue, with a maximum late fee of $525, will be imposed in the following circumstances:<br>
        <br>
        (1) It is requested that the provisions of
        RSA 421-B:3-303(c)(2) be waived; or<br>
        <br>
        (2) Securities sold in this state are more than registered on the effective application filed with the secretary of state, where the maximum registration fee has not been paid; or<br>
        <br>
        (3) The registration application is amended to increase the amount registered in this state, where the maximum registration fee has not been paid, subsequent to the effectiveness of the registration in this state; or` },
        { state: 'New Jersey', when: 'Within 15 days', cost: '$250' },
        { state: 'New Mexico', when: 'Within 15 days', cost: '$350; Late Fees: Filing Form D within 10 days after the due date--$700; Filing more than 10 days after the due date--1050' },
        { state: 'New York', when: 'Within 15 days', cost: '$300 for offerings of $500,000 or less, $1,200 for offerings over $500,000' },
        { state: 'North Carolina', when: 'Within 15 days', cost: '$350' },
        { state: 'North Dakota', when: 'Within 15 days', cost: '$100' },
        { state: 'Ohio', when: 'Within 15 days', cost: `$100<br>
        Excusable neglect--Retroactive filing required under Section 1707.03(X):
        $100 (required filing fee) + $100 (penalty fee).` },
        { state: 'Oklahoma', when: 'Within 15 days', cost: '$250' },
        { state: 'Oregon', when: 'Within 15 days', cost: '$250 (one-time fee; no renewal)' },
        { state: 'Pennsylvania', when: 'Within 15 days', cost: '$525' },
        { state: 'Puerto Rico', when: 'Within 15 days', cost: `$1,500 or equal to 1/5 of 1% of the maximum tender price at which the securities will be offered in Puerto Rico, with a minimum fee of $350 and the fee for amending a Rule 506 filing that increases the amount of securities offered: 1/5 of 1% of the additional shares offered but the fee will not exceed $1,500` },
        { state: 'Rhode Island', when: 'Within 15 days', cost: '$300' },
        { state: 'South Carolina', when: 'Within 15 days', cost: '$300' },
        { state: 'South Dakota', when: 'Within 15 days', cost: `$250; Late filing: $275. Total initial filing + late fee<br>
        =<br>
        $525` },
        { state: 'Tennessee', when: 'Within 15 days', cost: '$500' },
        { state: 'Texas', when: 'Within 15 days', cost: `1/10 of 1% of the aggregate amount of securities described as being offered for sale, but in no event will the fee be more than $500.<br>
        <br>
        Fee for secondary trading of federal covered securities: $500.` },
        { state: 'Utah', when: 'Within 15 days', cost: '$100' },
        { state: 'Vermont', when: 'Within 15 days', cost: '$600' },
        { state: 'Virgin Islands', when: 'Within 15 days', cost: `$1,500 (late fee: $3,000) Amendment: $50

        General transaction fee: Persons currently engaged in securities transactions in the Virgin Islands must pay a $50 fee for filing terminations, withdrawals, notifications and other documents with the Division of Banking and Insurance.` },
        { state: 'Virginia', when: 'Within 15 days', cost: '$250' },
        { state: 'Washington', when: 'Within 15 days', cost: '$300' },
        { state: 'West Virginia', when: 'Within 15 days', cost: '$125' },
        { state: 'Wisconsin', when: 'Within 15 days', cost: '$200' },
        { state: 'Wyoming', when: 'Within 15 days', cost: '$200' }
    ];
}
