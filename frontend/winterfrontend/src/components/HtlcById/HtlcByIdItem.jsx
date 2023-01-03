function HtlcByIdItem({htlc}){
    return(
        <div>
            <p>HTLC ID: {htlc.htlcId.id}</p>
            <p>Bond ID: {htlc.bondId.id}</p>
            <p>Sender: {htlc.sender}</p>
            <p>Receiver: {htlc.receiver}</p>
            <p>Escrow: {htlc.escrow}</p>
            <p>Time Out: {htlc.timeout}</p>
            <p>Hash: {htlc.hash}</p>
            <p>Amount: {htlc.amount}</p>
            <p>Currency: {htlc.currency}</p>
            <p>Status: {htlc.status}</p>
        </div>
    );

}

export default HtlcByIdItem;
