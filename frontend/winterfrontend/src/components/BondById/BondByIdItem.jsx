import { Card } from 'antd';
function BondByIdItem({bond}){
    console.log("Bond", bond);
    // return(
    //     <Card>
    //         <div>
    //             <h2>{bond.bondName}</h2>
    //         </div>
    //         <div>
    //             <p>Face Value: {bond.faceValue}</p>
    //             <p>Coupon Rate: {bond.couponRate}</p>
    //             <p>Years to Mature: {bond.yearsToMature}</p>
    //             <p>Payment Interval: {bond.paymentInterval}</p>
    //             <p>Issue Date: {bond.issueDate}</p>
    //             <p>Maturity Date: {bond.maturityDate}</p>
    //             <p>Bond Rating: {bond.bondRating}</p>
    //             <p>Issuer: {bond.issuer}</p>
    //             <p>Holder: {bond.holder}</p>
    //             <p>Bond ID: {bond.linearID.id}</p>
    //         </div>
    //     </Card>
    // )
    const text = (
        <>
        <p style={{
            paddingLeft: 24,
          }}>Face Value: {bond.faceValue}</p>
        <p style={{
            paddingLeft: 24,
          }}>Coupon Rate: {bond.couponRate}</p>
        <p style={{
            paddingLeft: 24,
          }}>Years to Mature: {bond.yearsToMature}</p>
        <p style={{
            paddingLeft: 24,
          }}>Payment Interval: {bond.paymentInterval}</p>
        <p style={{
            paddingLeft: 24,
          }}>Issue Date: {bond.issueDate}</p>
        <p style={{
            paddingLeft: 24,
          }}>Maturity Date: {bond.maturityDate}</p>
        <p style={{
            paddingLeft: 24,
          }}>Bond Rating: {bond.bondRating}</p>
        <p style={{
            paddingLeft: 24,
          }}>Issuer: {bond.issuer}</p>
        <p style={{
            paddingLeft: 24,
          }}>Holder: {bond.holder}</p>
        <p style={{
            paddingLeft: 24,
          }}>Bond ID: {bond.linearID.id}</p>
        </>
    );

    return(
        <section>
            <h1>{bond.bondName}</h1>
            {text}
        </section>
    );


}

export default BondByIdItem;

