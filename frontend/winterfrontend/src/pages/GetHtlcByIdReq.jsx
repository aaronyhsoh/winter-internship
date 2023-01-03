import HtlcByIdForm from '../components/HtlcById/HtlcByIdForm';
import GetHtlcByIdPage from './GetHtlcById';
import { useState } from 'react';

function GetHtlcByIdReqPage(){
    const [bond, setBond] = useState();

    var api = 'http://localhost:10051/htlc?id='

    function getByIdHandler(htlcid){

        fetch(api + htlcid
            ).then(response => {
                return response.json();
            })
            .then((data) => {
                setBond(data)
            });
    }

    return(
        <section>
            <h1>Get HTLC by ID</h1>
            {bond === undefined ? <HtlcByIdForm onGetById={getByIdHandler} /> 
            : <GetHtlcByIdPage loadedData={bond} />
            }
        </section>
    );
}

export default GetHtlcByIdReqPage;