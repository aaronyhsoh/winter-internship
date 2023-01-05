import { useRef } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
function HtlcByIdForm(props){
    // const idInputRef = useRef();

    function submitHandler(values){
        // event.preventDefault();

        console.log(values.htlcid);
        props.onGetById(values.htlcid);
    }

//     return(
//         <form onSubmit={submitHandler}>
//             <div>
//                 <label htmlFor='id'>HTLC ID</label>
//                 <input type='text' required id='id' ref={idInputRef} />
//             </div>
//             <div>
//                 <button>Search HTLC</button>
//             </div>
//         </form>
//     );

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


        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <button>
                Search HTLC
            </button>
        </Form.Item> 
        </Form>
    );


}

export default HtlcByIdForm;