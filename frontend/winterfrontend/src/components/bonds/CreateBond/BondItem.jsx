import Card from '../../ui/Card';
function BondItem(props){
    return(
    <li>
        <Card>
            <div>
                <h2>{props.bondName}</h2>
            </div>
            <div>
                <p>Face Value: {props.faceValue}</p>
                <p>Coupon Rate: {props.couponRate}</p>
                <p>Years to Mature: {props.yearsToMature}</p>
                <p>Payment Interval: {props.paymentInterval}</p>
                <p>Issue Date: {props.issueDate}</p>
                <p>Maturity Date: {props.maturityDate}</p>
                <p>Bond Rating: {props.bondRating}</p>
                <p>Issuer: {props.issuer}</p>
                <p>Holder: {props.holder}</p>
                <p>Bond ID: {props.id}</p>
            </div>
        </Card>
    </li>
    );
}

export default BondItem;