import Card from '../ui/Card';
function BondItem(props){
    return(
    <li>
        <Card>
            <div>
                <h1>{props.bondName}</h1>
            </div>
            <div>
                <p>{props.faceValue}</p>
                <p>{props.couponRate}</p>
                <p>{props.yearsToMature}</p>
                <p>{props.paymentInterval}</p>
                <p>{props.holder}</p>
            </div>
        </Card>
    </li>
    );
}

export default BondItem;