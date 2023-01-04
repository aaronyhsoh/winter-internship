import Card from '../../ui/Card';
import { Button, Checkbox, Form, Input } from 'antd';
import { useRef } from 'react';

function BondHtlcForm(props){
    const bondIdInputRef=useRef();
    const receiverInputRef=useRef();
    const escrowInputRef=useRef();
    const timeoutInputRef=useRef();
    const currencyInputRef=useRef();
    const amountInputRef=useRef();
    const hashInputRef=useRef();

    function submitHandler(event){
        event.preventDefault();
        const enteredTimeout = parseInt(timeoutInputRef.current.value);
        const enteredAmount = parseInt(amountInputRef.current.value);

        const bondHtlcData = {
            bondId: bondIdInputRef.current.value,
            receiver: receiverInputRef.current.value,
            escrow: escrowInputRef.current.value,
            timeout: enteredTimeout,
            currency: currencyInputRef.current.value,
            amount: enteredAmount,
            hash: hashInputRef.current.value,
        };

        console.log(bondHtlcData);
        props.onCreateHtlc(bondHtlcData); 

    }

    // return(
    //     <Card>
    //         <form onSubmit={submitHandler}>
    //             <div>
    //                 <label htmlFor='bondid'>Bond ID</label>
    //                 <input type='text' required id='bondid' ref={bondIdInputRef} />
    //             </div>
    //             <div>
    //                 <label htmlFor='receiver'>Receiver</label>
    //                 <input type='text' required id='receiver' ref={receiverInputRef} />
    //             </div>
    //             <div>
    //                 <label htmlFor='escrow'>Escrow</label>
    //                 <input type='text' required id='escrow' ref={escrowInputRef} />
    //             </div>
    //             <div>
    //                 <label htmlFor='timeout'>Time Out</label>
    //                 <input type='text' required id='timeout' ref={timeoutInputRef} />
    //             </div>
    //             <div>
    //                 <label htmlFor='currency'>Currency</label>
    //                 <input type='text' required id='currency' ref={currencyInputRef} />
    //             </div>
    //             <div>
    //                 <label htmlFor='amount'>Amount</label>
    //                 <input type='text' required id='amount' ref={amountInputRef} />
    //             </div>
    //             <div>
    //                 <label htmlFor='hash'>Hash</label>
    //                 <input type='text' required id='hash' ref={hashInputRef} />
    //             </div>
    //             <div>
    //                 <button>Create</button>
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
                onSubmit={submitHandler}
            >
                <Form.Item
                    label="Bond ID"
                    name="bondid"
                    rules={[{ required: true, message: 'Please input Bond ID!' }]}
                >
                    <Input type='text' ref={bondIdInputRef}/>
                </Form.Item>

                <Form.Item
                    label="Receiver"
                    name="receiver"
                    rules={[{ required: true, message: 'Please input Receiver!' }]}
                >
                    <Input type='text' ref={receiverInputRef}/>
                </Form.Item>

                <Form.Item
                    label="Escrow"
                    name="escrow"
                    rules={[{ required: true, message: 'Please input Escrow!' }]}
                >
                    <Input type='text' ref={escrowInputRef}/>
                </Form.Item>

                <Form.Item
                    label="Time Out"
                    name="timeout"
                    rules={[{ required: true, message: 'Please input Time Out!' }]}
                >
                    <Input type='text' ref={timeoutInputRef}/>
                </Form.Item>

                <Form.Item
                    label="Currency"
                    name="currency"
                    rules={[{ required: true, message: 'Please input Currency!' }]}
                >
                    <Input type='text' ref={currencyInputRef}/>
                </Form.Item>

                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: 'Please input Amount!' }]}
                >
                    <Input type='text' ref={amountInputRef}/>
                </Form.Item>

                <Form.Item
                    label="Hash"
                    name="hash"
                    rules={[{ required: true, message: 'Please input Hash!' }]}
                >
                    <Input type='text' ref={hashInputRef}/>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                      Create
                    </Button>
                </Form.Item>
                
            </Form>

    
    );
}

export default BondHtlcForm;
