import React from 'react';
import BondItem from './BondItem';
import classes from './BondList.module.css';

function BondList(props) {
  return (
    <ul className={classes.list}>
      {props.bonds.map((bond) => (
        <BondItem
          key={bond.id}
          id={bond.id}
          bondname={bond.bondname}
          value={bond.value}
          couponrate={bond.couponrate}
          yearstomature={bond.yearstomature}
          paymentinterval={bond.paymentinterval}
          holder={bond.holder}
        />
      ))}
    </ul>
  );
}

export default BondList;