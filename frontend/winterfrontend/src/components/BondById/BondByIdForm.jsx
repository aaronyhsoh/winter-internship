import { useRef } from 'react';
import Card from '../ui/Card';
//import { useNavigate } from "react-router-dom";
function BondByIdForm(props){
    const idInputRef = useRef();

    function submitHandler(event){
        event.preventDefault();

        const bondByIdData = {
            bondid: idInputRef.current.value,
        };

        console.log(bondByIdData);
        props.onGetById(bondByIdData);
        // navigate("/get-bond-by-id")
    }

//    const navigate = useNavigate();
    
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