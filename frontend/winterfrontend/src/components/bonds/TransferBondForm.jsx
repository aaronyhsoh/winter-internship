import Card from '../ui/Card';
import { useRef } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';

function TransferBondForm(props){
    // const receiverInputRef = useRef();
    // const bondIdInputRef = useRef();

    function submitHandler(values){
        // event.preventDefault();
        
        const bondTransferData = {
            receiver: values.receiver,
            bondId: values.bondid,
        };

        console.log(bondTransferData);
        props.onTransferBond(bondTransferData);
    }

    // return(
    //     <Card>
    //         <form onSubmit={submitHandler}>
    //             <div>
    //                 <label htmlFor='receiver'>Receiver</label>
    //                 <input type='text' required id='receiver' ref={receiverInputRef} />
    //             </div>
    //             <div>
    //                 <label htmlFor='bondid'>Bond ID</label>
    //                 <input type='text' required id='bondid' ref={bondIdInputRef} />
    //             </div>
    //             <div>
    //                 <button>Transfer Bond</button>
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
              label="Bond ID"
              name="bondid"
              rules={[{ required: true, message: 'Please input Bond ID!' }]}
          >
              <Input type='text' />
          </Form.Item>

          <Form.Item
              label="Receiver"
              name="receiver"
              rules={[{ required: true, message: 'Please input Receiver!' }]}
          >
              <Input type='text' />
          </Form.Item>
  
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <button>
                Create
              </button>
          </Form.Item> 
        </Form>
      );

}

export default TransferBondForm;