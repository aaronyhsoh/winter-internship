import CreateBondForm from '../components/bonds/CreateBondForm';


function NewBondPage(){
    function createBondHandler(bondData){
        // fetch(
        //     ''
        //     {
        //         method: 
        //     }

        // );

        
    }


    return(
        <section>
            <h1>Create Bond</h1>
            <CreateBondForm onCreateBond={createBondHandler} />
        </section>
    );
}

export default NewBondPage;