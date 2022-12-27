import Card from '../ui/Card';
import { useRef } from 'react';

function TransferBondForm(props){
    const receiverInputRef = useRef();
    const bondIdInputRef = useRef();

    function submitHandler(event){
        event.preventDefault();
        
        const bondTransferData = {
            receiver: receiverInputRef.current.value,
            bondId: bondIdInputRef.current.value,
        };

        console.log(bondTransferData);
        props.onTransferBond(bondTransferData);
    }

    return(
        <Card>
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor='receiver'>Receiver</label>
                    <input type='text' required id='receiver' ref={receiverInputRef} />
                </div>
                <div>
                    <label htmlFor='bondid'>Bond ID</label>
                    <input type='text' required id='bondid' ref={bondIdInputRef} />
                </div>
                <div>
                    <button>Transfer Bond</button>
                </div>
            </form>
        </Card>
    );

}

export default TransferBondForm;