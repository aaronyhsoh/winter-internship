import Card from "../ui/Card";
import { useRef } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';

function RefundBondForm(props){
    // const escrowInputRef = useRef();
    // const htlcIdInputRef = useRef();

    function submitHandler(values){
        // event.preventDefault();

        const refundBondData = {
            escrow: values.escrow,
            htlcId: values.htlcid,
        };

        console.log(refundBondData);
        props.onRefundBond(refundBondData);
    }

    // return(
    //     <Card>
    //         <form onSubmit={submitHandler}>
    //             <div>
    //                 <label htmlFor='escrow'>Escrow</label>
    //                 <input type='text' required id='escrow' ref={escrowInputRef} />'
    //             </div>
    //             <div>
    //                 <label htmlFor='htlcid'>htlc ID</label>
    //                 <input type='text' required id='htlcid' ref={htlcIdInputRef}/>
    //             </div>
    //             <div>
    //                 <button>Refund Bond Htlc</button>
    //             </div>
    //         </form>
    //     </Card>
    // );

    return(
        <Form 
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={submitHandler}
          onSubmit={e => e.preventDefault()}
        >
          <Form.Item
              label="HTLC ID"
              name="htlcid"
              rules={[{ required: true, message: 'Please input HTLC ID!' }]}
          >
              <Input type='text' />
          </Form.Item>
  
          <Form.Item
              label="Escrow"
              name="escrow"
              rules={[{ required: true, message: 'Please input Escrow!' }]}
          >
              <Input type='text' />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <button>Refund Bond</button>
        </Form.Item> 
      </Form>
    );
  

}

export default RefundBondForm;