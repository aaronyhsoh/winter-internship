import BondHtlcItem from './BondHtlcItem';
function BondHtlcList(props){
    return(
        <ul>
            {props.htlcs.map((htlc) =>(
                <BondHtlcItem 
                key={htlc.id}
                htlcid={htlc.htlcId.id}
                bondid={htlc.bondId.id}
                sender={htlc.sender}
                receiver={htlc.receiver}
                escrow={htlc.escrow}
                timeout={htlc.timeout}
                hash={htlc.hash}
                amount={htlc.amount}
                currency={htlc.currency}
                status={htlc.status}
                />
            ))}
        </ul>
    );

}

export default BondHtlcList;