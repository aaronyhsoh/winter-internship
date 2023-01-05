import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';


function CreateBondForm(props) {
    // const bondNameInputRef = useRef();
    // const faceValueInputRef = useRef();
    // const couponRateInputRef = useRef();
    // const yearsToMatureInputRef = useRef();
    // const paymentIntervalInputRef = useRef();
    // const holderInputRef = useRef();
  
    function submitHandler(values) { 
      // event.preventDefault();
  
      // const enteredBondName = bondNameInputRef.current.value;
      // const enteredValue = parseInt(faceValueInputRef.current.value);
      // const enteredCouponRate = parseInt(couponRateInputRef.current.value);
      // const enteredYearsToMature = parseInt(yearsToMatureInputRef.current.value);
      // const enteredPaymentInterval = parseInt(paymentIntervalInputRef.current.value);
      // const enteredHolder = holderInputRef.current.value;
  
      // const bondData = {
      //   bondName: enteredBondName,
      //   faceValue: enteredValue,
      //   couponRate: enteredCouponRate,
      //   yearsToMature: enteredYearsToMature,
      //   paymentInterval: enteredPaymentInterval,
      //   holder: enteredHolder,
      // };

      const enteredValue = parseInt(values.facevalue);
      const enteredCouponRate = parseInt(values.couponrate);
      const enteredYearsToMature = parseInt(values.yearstomature);
      const enteredPaymentInterval = parseInt(values.paymentinterval);
  
      const bondData = {
        bondName: values.bondname,
        faceValue: enteredValue,
        couponRate: enteredCouponRate,
        yearsToMature: enteredYearsToMature,
        paymentInterval: enteredPaymentInterval,
        holder: values.holder,
      };
      
      console.log(bondData);
      props.onCreateBond(bondData);
    }


    // return (
    // <Card>
    //     <form className={classes.form} onSubmit={submitHandler}>
    //       <div className={classes.control}>
    //         <label htmlFor='bondname'>Bond Name</label>
    //         <input type='text' required id='bondname' ref={bondNameInputRef} />
    //       </div>
    //       <div className={classes.control}>
    //         <label htmlFor='value'>Face Value</label>
    //         <input type='text' required id='value' ref={faceValueInputRef} />
    //       </div>
    //       <div className={classes.control}>
    //         <label htmlFor='couponrate'>Coupon Rate</label>
    //         <input type='text' required id='couponrate' ref={couponRateInputRef} />
    //       </div>
    //       <div className={classes.control}>
    //         <label htmlFor='yearstomature'>Years to Mature</label>
    //         <input type='text' required id='yearstomature' ref={yearsToMatureInputRef} />
    //       </div>
    //       <div className={classes.control}>
    //         <label htmlFor='paymentinterval'>Payment Interval</label>
    //         <input type='text' required id='paymentinterval' ref={paymentIntervalInputRef} />
    //       </div>
    //       <div className={classes.control}>
    //         <label htmlFor='holder'>Holder</label>
    //         <input type='text' required id='holder' ref={holderInputRef} />
    //       </div>
    //       <div className={classes.actions}>
    //         <button>Create Bond</button>
    //       </div>
    //     </form>
    // </Card>
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
            label="Bond Name"
            name="bondname"
            rules={[{ required: true, message: 'Please input Bond Name!' }]}
        >
            <Input type='text' />
        </Form.Item>

        <Form.Item
            label="Face Value"
            name="facevalue"
            rules={[{ required: true, message: 'Please input Face Value!' }]}
        >
            <Input type='text' />
        </Form.Item>

        <Form.Item
            label="Coupon Rate"
            name="couponrate"
            rules={[{ required: true, message: 'Please input Coupon Rate!' }]}
        >
            <Input type='text' />
        </Form.Item>

        <Form.Item
            label="Years to Mature"
            name="yearstomature"
            rules={[{ required: true, message: 'Please input Years to Mature!' }]}
        >
            <Input type='text' />
        </Form.Item>

        <Form.Item
            label="Payment Interval"
            name="paymentinterval"
            rules={[{ required: true, message: 'Please input Payment Interval!' }]}
        >
            <Input type='text' />
        </Form.Item>

        <Form.Item
            label="Holder"
            name="holder"
            rules={[{ required: true, message: 'Please input Holder!' }]}
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
  
export default CreateBondForm;