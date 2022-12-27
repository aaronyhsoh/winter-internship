import Card from "../ui/Card";
import { useRef } from 'react';

function RefundBondForm(props){
    const escrowInputRef = useRef();
    const htlcIdInputRef = useRef();

    function submitHandler(event){
        event.preventDefault();

        const refundBondData = {
            escrow: escrowInputRef.current.value,
            htlcId: htlcIdInputRef.current.value,
        };

        console.log(refundBondData);
        props.onRefundBond(refundBondData);
    }

    return(
        <Card>
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor='escrow'>Escrow</label>
                    <input type='text' required id='escrow' ref={escrowInputRef} />'
                </div>
                <div>
                    <label htmlFor='htlcid'>htlc ID</label>
                    <input type='text' required id='htlcid' ref={htlcIdInputRef}/>
                </div>
                <div>
                    <button>Refund Bond Htlc</button>
                </div>
            </form>
        </Card>
    );

}

export default RefundBondForm;