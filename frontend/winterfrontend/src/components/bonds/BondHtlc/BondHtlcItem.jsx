import Card from '../../ui/Card';
function BondHtlcItem(props){
    return(
        <li>
            <Card>
                <div>
                    <p>HTLC ID: {props.htlcid}</p>
                    <p>Bond ID: {props.bondid}</p>
                    <p>Sender: {props.sender}</p>
                    <p>Receiver: {props.receiver}</p>
                    <p>Escrow: {props.escrow}</p>
                    <p>Timeout: {props.timeout}</p>
                    <p>Hash: {props.hash}</p>
                    <p>Amount: {props.amount}</p>
                    <p>Currency: {props.currency}</p>
                    <p>Status: {props.status}</p>
                </div>
            </Card>
        </li>
    );
}

export default BondHtlcItem;
