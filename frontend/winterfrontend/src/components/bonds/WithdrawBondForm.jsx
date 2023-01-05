import { Button, Checkbox, Form, Input } from 'antd';

function WithdrawBondForm(props){
    // const escrowInputRef = useRef();
    // const htlcIdInputRef = useRef();
    // const secretInputRef = useRef();

    function submitHandler(values){
        // event.preventDefault();
        
        const withdrawBondData = {
            escrow: values.escrow,
            htlcId: values.htlcid,
            secret: values.secret,
        };

        console.log(withdrawBondData);
        props.onWithdrawBond(withdrawBondData);
    }

    // return(
    //     <Card>
    //         <form onSubmit={submitHandler}>
    //             <div>
    //                 <label htmlFor='escrow'>Escrow</label>
    //                 <input type='text' required id='escrow' ref={escrowInputRef} />
    //             </div>
    //             <div>
    //                 <label htmlFor='htlcId'>Bond ID</label>
    //                 <input type='text' required id='htlcId' ref={htlcIdInputRef} />
    //             </div>
    //             <div>    
    //                 <label htmlFor='secret'>Secret</label>
    //                 <input type='text' required id='secret' ref={secretInputRef} />
    //             </div>
    //             <div>
    //                 <button>Withdraw Bond</button>
    //             </div>
    //         </form>
    //     </Card>
    // )

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

          <Form.Item
              label="Secret"
              name="secret"
              rules={[{ required: true, message: 'Please input Secret!' }]}
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

export default WithdrawBondForm;