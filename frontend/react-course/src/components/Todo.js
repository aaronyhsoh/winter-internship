import React from "react";
import { useState } from 'react';

import Modal from './Modal';
import Backdrop from './Backdrop';
//import "../index.css"

function Todo(props){
//document.querySelector('button').addEventListener('click')

//usestate returns pair of values: the current state and a function that updates it
    const [modalIsOpen, setModalIsOpen] = useState(false); //initially model should not be open, hence false
    
    function deleteHandler(){
        setModalIsOpen(true);
    }

    function closeModalHandler(){
        setModalIsOpen(false);
    }

    return (
        <div className='card'>
            <h2>{props.text}</h2>
            <div className='actions'>
                <button className='btn' onClick={deleteHandler}>Delete</button>
            </div>
            {modalIsOpen && <Modal onCancel={closeModalHandler} onConfirm={closeModalHandler}/>}
            {modalIsOpen && <Backdrop onClick={closeModalHandler} />}
        </div>
    );
}

export default Todo;


