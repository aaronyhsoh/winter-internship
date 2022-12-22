import React from 'react';
import { useRef } from 'react';

import Card from '../ui/Card';
import classes from './CreateBondForm.module.css';


function CreateBondForm(props) {
    const bondNameInputRef = useRef();
    const faceValueInputRef = useRef();
    const couponRateInputRef = useRef();
    const yearsToMatureInputRef = useRef();
    const paymentIntervalInputRef = useRef();
    const holderInputRef = useRef();
  
    function submitHandler(event) { 
      event.preventDefault();
  
      const enteredBondName = bondNameInputRef.current.value;
      const enteredValue = parseInt(faceValueInputRef.current.value);
      const enteredCouponRate = parseInt(couponRateInputRef.current.value);
      const enteredYearsToMature = parseInt(yearsToMatureInputRef.current.value);
      const enteredPaymentInterval = parseInt(paymentIntervalInputRef.current.value);
      const enteredHolder = holderInputRef.current.value;
  
      const bondData = {
        bondname: enteredBondName,
        value: enteredValue,
        couponrate: enteredCouponRate,
        yearstomature: enteredYearsToMature,
        paymentinterval: enteredPaymentInterval,
        holder: enteredHolder,
      };
      console.log(bondData);
      props.onCreateBond(bondData);
    }
  
    return (
    <Card>
        <form className={classes.form} onSubmit={submitHandler}>
          <div className={classes.control}>
            <label htmlFor='bondname'>Bond Name</label>
            <input type='text' required id='bondname' ref={bondNameInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor='value'>Face Value</label>
            <input type='text' required id='value' ref={faceValueInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor='couponrate'>Coupon Rate</label>
            <input type='text' required id='couponrate' ref={couponRateInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor='yearstomature'>Years to Mature</label>
            <input type='text' required id='yearstomature' ref={yearsToMatureInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor='paymentinterval'>Payment Interval</label>
            <input type='text' required id='paymentinterval' ref={paymentIntervalInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor='holder'>Holder</label>
            <input type='text' required id='holder' ref={holderInputRef} />
          </div>
          <div className={classes.actions}>
            <button>Create Bond</button>
          </div>
        </form>
    </Card>
    );
}
  
export default CreateBondForm;