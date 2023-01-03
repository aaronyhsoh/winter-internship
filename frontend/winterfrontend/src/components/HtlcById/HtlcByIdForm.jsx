import { useRef } from 'react';
function HtlcByIdForm(props){
    const idInputRef = useRef();

    function submitHandler(event){
        event.preventDefault();

        console.log(idInputRef.current.value);
        props.onGetById(idInputRef.current.value);
    }

    return(
        <form onSubmit={submitHandler}>
            <div>
                <label htmlFor='id'>HTLC ID</label>
                <input type='text' required id='id' ref={idInputRef} />
            </div>
            <div>
                <button>Search HTLC</button>
            </div>
        </form>
    );
}

export default HtlcByIdForm;