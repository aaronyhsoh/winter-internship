import BondHtlcForm from '../../components/bonds/BondHtlc/BondHtlcForm';
import { useNavigate } from "react-router-dom";

function BondHtlcRequestPage(){
    const navigate = useNavigate();
    function createHtlcHandler(bondHtlcData){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(bondHtlcData);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://localhost:10051/htlc/bond/initiate", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
        .then(() =>{
            navigate("/", {replace: true});
        });
    }

    return(
        <section>
            <h1>Create Htlc Bond</h1>
            <BondHtlcForm onCreateHtlc={createHtlcHandler}/>
        </section>
    );
}

export default BondHtlcRequestPage;