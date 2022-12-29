import { useState, useEffect } from 'react';
import BondHtlcList from '../components/bonds/BondHtlc/BondHtlcList';

function GetHtlcPage(){
    const [isLoading, setIsLoading] = useState(true);
    const [loadedBonds, setLoadedBonds] = useState([]);
    // useEffect(() => {
    // var requestOptions = {
    //     method: 'GET',
    //     redirect: 'follow'
    //   };
      
    //   fetch("http://localhost:10051/htlc/getAll", requestOptions)
    //     .then(response => response.text())
    //     .then(result => console.log(result))
    //     .catch(error => console.log('error', error))
    //     .then((data) => {
    //         setIsLoading(false);
    //         setLoadedBonds(data);
    //     // }).catch(err => {
    //     //     console.log(err);
    //     });
    // },[]);


    useEffect(() => {
        fetch('http://localhost:10051/htlc/getAll'
        ).then(response => {
            return response.json();
        })
        .then((data) => {
            const bonds = [];

            for(const key in data){
                const bond = {
                    id: key,
                    ...data[key]
                };
                bonds.push(bond);
            }

            setIsLoading(false);
            setLoadedBonds(bonds);
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
            <h1>All Related HTLC</h1>
            <BondHtlcList htlcs={loadedBonds} />
        </section>
    );
}

export default GetHtlcPage;