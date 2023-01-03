//import { useState, useEffect } from 'react';
import BondByIdItem from '../components/BondById/BondByIdItem';

function GetBondByIdPage(props){
    // const [isLoading, setIsLoading] = useState(true);
    // const [loadedBonds, setLoadedBonds] = useState([]);
    
    // var raw = "";

    // var requestOptions = {
    // method: 'GET',
    // redirect: 'follow'
    // };

    // var api = 'http://localhost:10051/bond?id='
    
    // useEffect(()=>{
    //     fetch(api + bondByIdData.bondid
    //     ).then(response => {
    //         return response.json();
    //     })
    //     .then((data) => {
    //         setIsLoading(false);
    //         setLoadedBonds(data)
    //     });

    // },[]);

    // function getByIdHandler(bondByIdData){
    //     var raw = "";

    //     var requestOptions = {
    //     method: 'GET',
    //     body: raw,
    //     redirect: 'follow'
    //     };

    //     var api = 'http://localhost:10051/bond?id='

    //     fetch(api + bondByIdData, requestOptions)
    //     .then(response => response.text())
    //     .then(result => console.log(result))
    //     .catch(error => console.log('error', error));
    // }

    if(props.isLoading){
        return(
            <section>
                <p>Loading...</p>
            </section>
        );
    }


    return(
        <section>
            <h1>Bond Details:</h1>
            <BondByIdItem bond={props.loadedBonds}/>
        </section>
    )

}

export default GetBondByIdPage;