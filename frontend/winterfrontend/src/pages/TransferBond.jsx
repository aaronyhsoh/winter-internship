import { useNavigate } from "react-router-dom";
import TransferBondForm from '../components/bonds/TransferBondForm';

function TransferBondPage(){
    const navigate=useNavigate();
    function transferBondHandler(bondTransferData){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify(bondTransferData);
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        
        fetch("http://localhost:10051/bond/transfer", requestOptions
        ).then(() => {
            navigate("/", {replace: true});
          });

    //     fetch('http://localhost:10051/bond/transfer',
    //         {
    //             //mode:'no-cors',
    //             method: 'POST',
    //             headers: { 
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json' 
    //             },
    //             body: JSON.stringify(bondTransferData),
    //         }
    //     ).then(() =>{
    //         navigate("/", {replace: true});
    //     });

    }


    return(
        <section>
            <h1>Transfer Bond</h1>
            <TransferBondForm onTransferBond={transferBondHandler} />
        </section>
    );
}

export default TransferBondPage;