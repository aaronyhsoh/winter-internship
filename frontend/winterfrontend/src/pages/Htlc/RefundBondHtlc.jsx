import RefundBondForm from '../../components/bonds/RefundBondForm';
import { useNavigate } from "react-router-dom";
function RefundBondPage(){
    const navigate = useNavigate();
    function refundBondHandler(refundBondData){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(refundBondData);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://localhost:10051/htlc/bond/refund", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
        .then(() => {
            navigate("/", {replace: true});
        });

    }
    return(
        <section>
            <h1>Refund Bond</h1>
            <RefundBondForm onRefundBond={refundBondHandler} />
        </section>
    )
}
export default RefundBondPage;