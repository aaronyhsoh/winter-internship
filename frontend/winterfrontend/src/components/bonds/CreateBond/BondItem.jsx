import { Collapse } from 'antd';
const { Panel } = Collapse;
// const { Title } = Typography;

function BondItem(props){
    // return(
    // <li>
    //     <Card>
    //         <div>
    //             <h2>{props.bondName}</h2>
    //         </div>
    //         <div>
    //             <p>Face Value: {props.faceValue}</p>
    //             <p>Coupon Rate: {props.couponRate}</p>
    //             <p>Years to Mature: {props.yearsToMature}</p>
    //             <p>Payment Interval: {props.paymentInterval}</p>
    //             <p>Issue Date: {props.issueDate}</p>
    //             <p>Maturity Date: {props.maturityDate}</p>
    //             <p>Bond Rating: {props.bondRating}</p>
    //             <p>Issuer: {props.issuer}</p>
    //             <p>Holder: {props.holder}</p>
    //             <p>Bond ID: {props.id}</p>
    //         </div>
    //     </Card>
    // </li>
    // );

    const text = (
        <>
        <p style={{
            paddingLeft: 24,
          }}>Face Value: {props.faceValue}</p>
        <p style={{
            paddingLeft: 24,
          }}>Coupon Rate: {props.couponRate}</p>
        <p style={{
            paddingLeft: 24,
          }}>Years to Mature: {props.yearsToMature}</p>
        <p style={{
            paddingLeft: 24,
          }}>Payment Interval: {props.paymentInterval}</p>
        <p style={{
            paddingLeft: 24,
          }}>Issue Date: {props.issueDate}</p>
        <p style={{
            paddingLeft: 24,
          }}>Maturity Date: {props.maturityDate}</p>
        <p style={{
            paddingLeft: 24,
          }}>Bond Rating: {props.bondRating}</p>
        <p style={{
            paddingLeft: 24,
          }}>Issuer: {props.issuer}</p>
        <p style={{
            paddingLeft: 24,
          }}>Holder: {props.holder}</p>
        <p style={{
            paddingLeft: 24,
          }}>Bond ID: {props.id}</p>
        </>
    );

    return(
        
        <Collapse bordered={false} >
            <Panel header= {props.bondName}>
            {text}
            </Panel>
        </Collapse>

        );

}

export default BondItem;