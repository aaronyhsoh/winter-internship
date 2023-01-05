import { useRef } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
//import { useNavigate } from "react-router-dom";
function BondByIdForm(props){
    // const idInputRef = useRef();

    function submitHandler(values){
        // event.preventDefault();

        const bondByIdData = {
            bondid: values.bondid,
        };

        console.log(bondByIdData);
        props.onGetById(bondByIdData);
        // navigate("/get-bond-by-id")
    }

//    const navigate = useNavigate();
    
    // return(
    //     <Card>
    //         <form onSubmit={submitHandler}>
    //             <div>
    //                 <label htmlFor='id'>Bond ID</label>
    //                 <input type='text' required id='id' ref={idInputRef} />
    //             </div>
    //             <div>
    //                 <button>Search Bond</button>
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
  
  
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <button>
                Search Bond
              </button>
          </Form.Item> 
        </Form>
      );
}

export default BondByIdForm;