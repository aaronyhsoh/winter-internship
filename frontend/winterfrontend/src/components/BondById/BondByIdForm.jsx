import { useRef } from 'react';
import Card from '../ui/Card';
function BondByIdForm(props){
    const idInputRef = useRef();

    function submitHandler(event){
        event.preventDefault();

        const bondByIdData = {
            bondid: idInputRef.current.value,
        };

        console.log(bondByIdData);
        props.onGetById(bondByIdData);
    }
    
    return(
        <Card>
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor='id'>Bond ID</label>
                    <input type='text' required id='id' ref={idInputRef} />
                </div>
                <div>
                    <button>Search Bond</button>
                </div>
            </form>
        </Card>
    );
}

export default BondByIdForm;