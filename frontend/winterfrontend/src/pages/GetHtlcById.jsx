import HtlcByIdItem from '../components/HtlcById/HtlcByIdItem';
function GetHtlcByIdPage(props){
    return(
        <section>
            <h1>HTLC Details:</h1>
            <HtlcByIdItem htlc={props.loadedData}/>
        </section>
    )

}


export default GetHtlcByIdPage;