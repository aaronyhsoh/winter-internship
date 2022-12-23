import { useState, useEffect } from 'react';
import BondList from "../components/bonds/BondList";


// const DUMMY_DATA = [
//     {
//         id: 'b1',     
//         faceValue: '100',
//         couponRate: '10',
//         yearsToMature: '10',
//         paymentInterval: '1',
//         holder: 'PartyA',

//     },
//     {
//         id: 'b2',      
//         faceValue: '200',
//         couponRate: '20',
//         yearsToMature: '20',
//         paymentInterval: '2',
//         holder: 'PartyB',
//     },
// ];


function AllBondsPage(){
    const [isLoading, setIsLoading] = useState(true);
    const [loadedBonds, setLoadedBonds] = useState([]);

    useEffect(() => {
        fetch('http://localhost:10051/bond/holder'
        ).then(response => {
            return response.json();
        }).then((data) => {
            setIsLoading(false);
            setLoadedBonds(data);
        // }).catch(err => {
        //     console.log(err);
        });
    },[]);


    if(isLoading){
        return(
            <section>
                <p>Loading...</p>
            </section>
        );
    }

    return(
        <section>
            <h1>My Bonds</h1>
            <BondList bonds={loadedBonds} />
        </section>
    );
}

export default AllBondsPage;
