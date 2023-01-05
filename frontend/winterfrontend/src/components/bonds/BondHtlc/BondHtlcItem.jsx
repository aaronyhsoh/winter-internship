import Card from '../../ui/Card';
import { Collapse } from 'antd';
const { Panel } = Collapse;

function BondHtlcItem(props){
    // return(
    //     <li>
    //         <Card>
    //             <div>
    //                 <p>HTLC ID: {props.htlcid}</p>
    //                 <p>Bond ID: {props.bondid}</p>
    //                 <p>Sender: {props.sender}</p>
    //                 <p>Receiver: {props.receiver}</p>
    //                 <p>Escrow: {props.escrow}</p>
    //                 <p>Timeout: {props.timeout}</p>
    //                 <p>Hash: {props.hash}</p>
    //                 <p>Amount: {props.amount}</p>
    //                 <p>Currency: {props.currency}</p>
    //                 <p>Status: {props.status}</p>
    //             </div>
    //         </Card>
    //     </li>
    // );
    const text = (
        <>
        <p style={{
            paddingLeft: 24,
          }}>Bond ID: {props.bondid}</p>
        <p style={{
            paddingLeft: 24,
          }}>Sender: {props.sender}</p>
        <p style={{
            paddingLeft: 24,
          }}>Receiver: {props.receiver}</p>
        <p style={{
            paddingLeft: 24,
          }}>Escrow: {props.escrow}</p>
        <p style={{
            paddingLeft: 24,
          }}>Timeout: {props.timeout}</p>
        <p style={{
            paddingLeft: 24,
          }}>Hash: {props.hash}</p>
        <p style={{
            paddingLeft: 24,
          }}>Amount: {props.amount}</p>
        <p style={{
            paddingLeft: 24,
          }}>Currency: {props.currency}</p>
        <p style={{
            paddingLeft: 24,
          }}>Status: {props.status}</p>
        </>
    );

    return(
        
        <Collapse bordered={false} >
            <Panel header= {props.htlcid}>
            {text}
            </Panel>
        </Collapse>

    );
}

export default BondHtlcItem;
