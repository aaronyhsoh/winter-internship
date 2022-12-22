import BondList from "../components/bonds/BondList";


const DUMMY_DATA = [
    {
        id: 'b1',     
        faceValue: '100',
        couponRate: '10',
        yearsToMature: '10',
        paymentInterval: '1',
        holder: 'PartyA',

    },
    {
        id: 'b2',      
        faceValue: '200',
        couponRate: '20',
        yearsToMature: '20',
        paymentInterval: '2',
        holder: 'PartyB',
    },
];


function AllBondsPage(){
    return(
        <section>
            <h1>All Bonds Page</h1>
            <BondList bonds={DUMMY_DATA} />
        </section>
    );
}

export default AllBondsPage;