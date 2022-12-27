import Card from '../../ui/Card';
import { useRef } from 'react';

function BondHtlcForm(){
    const bondIdInputRef=useRef();
    const receiverInputRef=useRef();
    const escrowInputRef=useRef();
    const timeoutInputRef=useRef();
    const currencyInputRef=useRef();
    const amountInputRef=useRef();
    const hashInputRef=useRef();

    function submitHandler(event){
        event.preventDefault();
        const enteredTimeout = parseInt(timeoutInputRef.current.value);
        const enteredAmount = parseInt(amountInputRef.current.value);

        const bondHtlcData = {
            bondId: bondIdInputRef.current.value,
            receiver: receiverInputRef.current.value,
            escrow: escrowInputRef.current.value,
            timeout: enteredTimeout,
            currency: currencyInputRef.current.value,
            amount: enteredAmount,
            hash: hashInputRef.current.value,
        };

        console.log(bondHtlcData);

    }

    return(
        <Card>
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor='bondid'>Bond ID</label>
                    <input type='text' required id='bondid' ref={bondIdInputRef} />
                </div>
                <div>
                    <label htmlFor='receiver'>Receiver</label>
                    <input type='text' required id='receiver' ref={receiverInputRef} />
                </div>
                <div>
                    <label htmlFor='escrow'>Escrow</label>
                    <input type='text' required id='escrow' ref={escrowInputRef} />
                </div>
                <div>
                    <label htmlFor='timeout'>Time Out</label>
                    <input type='text' required id='timeout' ref={timeoutInputRef} />
                </div>
                <div>
                    <label htmlFor='currency'>Currency</label>
                    <input type='text' required id='currency' ref={currencyInputRef} />
                </div>
                <div>
                    <label htmlFor='amount'>Amount</label>
                    <input type='text' required id='amount' ref={amountInputRef} />
                </div>
                <div>
                    <label htmlFor='hash'>Hash</label>
                    <input type='text' required id='hash' ref={hashInputRef} />
                </div>
                <div>
                    <button>Create</button>
                </div>
            </form>

        </Card>
    );
}

export default BondHtlcForm;
