import BondByIdForm from '../components/BondById/BondByIdForm'
function BondByIdPage(){
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

    return(
        <section>
            <h1>Get Bond by ID</h1>
            <BondByIdForm 
            onGetById={getByIdHandler} 
            />
        </section>
    );
}

export default BondByIdPage;