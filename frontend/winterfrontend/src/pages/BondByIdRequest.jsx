import BondByIdForm from '../components/BondById/BondByIdForm';
import GetBondByIdPage from './GetBondById';
import { useState } from 'react';

function BondByIdPage(){
    const [bond, setBond] = useState();
    const [isLoading, setIsLoading] = useState(true);

    var api = 'http://localhost:10051/bond?id='

    function getByIdHandler(bondByIdData){
        // <GetBondByIdPage bondByIdData />
        console.log(bondByIdData);
        fetch(api + bondByIdData.bondid
            ).then(response => {
                return response.json();
            })
            .then((data) => {
                setIsLoading(false);
                setBond(data)
            });
    }

    return(
        <section>
            <h1>Get Bond by ID</h1>
            { bond === undefined ?
                <BondByIdForm 
                onGetById={getByIdHandler} />
                : 
                <GetBondByIdPage isLoading={isLoading} loadedBonds={bond} />
            }
        </section>
    );
}

export default BondByIdPage;