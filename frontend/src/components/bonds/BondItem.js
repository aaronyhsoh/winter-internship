import React from 'react';

import Card from '../ui/Card';
import classes from './BondItem.module.css';


function BondItem(props) {

  return (
    <li className={classes.item}>
      <Card>
        <div className={classes.content}>
          <h3>{props.bondname}</h3>
          <p>{props.value}</p>
          <p>{props.couponrate}</p>
          <p>{props.yearstomature}</p>
          <p>{props.paymentinterval}</p>
          <p>{props.holder}</p>
        </div>
      </Card>
    </li>
  );
}

export default BondItem;