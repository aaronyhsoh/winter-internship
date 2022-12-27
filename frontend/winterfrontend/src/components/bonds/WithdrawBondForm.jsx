import Card from '../ui/Card';
import { useRef } from 'react';

function WithdrawBondForm(props){
    const escrowInputRef = useRef();
    const htlcIdInputRef = useRef();
    const secretInputRef = useRef();

    function submitHandler(event){
        event.preventDefault();
        
        const withdrawBondData = {
            escrow: escrowInputRef.current.value,
            htlcId: htlcIdInputRef.current.value,
            secret: secretInputRef.current.value,
        };

        console.log(withdrawBondData);
        props.onWithdrawBond(withdrawBondData);
    }

    return(
        <Card>
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor='escrow'>Escrow</label>
                    <input type='text' required id='escrow' ref={escrowInputRef} />
                </div>
                <div>
                    <label htmlFor='htlcId'>Bond ID</label>
                    <input type='text' required id='htlcId' ref={htlcIdInputRef} />
                </div>
                <div>    
                    <label htmlFor='secret'>Secret</label>
                    <input type='text' required id='secret' ref={secretInputRef} />
                </div>
                <div>
                    <button>Withdraw Bond</button>
                </div>
            </form>
        </Card>
    )
}

export default WithdrawBondForm;