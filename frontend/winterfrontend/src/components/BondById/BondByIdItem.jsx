import Card from "../ui/Card";

function BondByIdItem(bond){
    return(
        <li>
        <Card>
            <div>
                <h2>{bond.bondName}</h2>
            </div>
            <div>
                <p>Face Value: {bond.faceValue}</p>
                <p>Coupon Rate: {bond.couponRate}</p>
                <p>Years to Mature: {bond.yearsToMature}</p>
                <p>Payment Interval: {bond.paymentInterval}</p>
                <p>Issue Date: {bond.issueDate}</p>
                <p>Maturity Date: {bond.maturityDate}</p>
                <p>Bond Rating: {bond.bondRating}</p>
                <p>Issuer: {bond.issuer}</p>
                <p>Holder: {bond.holder}</p>
                <p>Bond ID: {bond.linearID.id}</p>
            </div>
        </Card>
    </li>
    )
}

export default BondByIdItem;

