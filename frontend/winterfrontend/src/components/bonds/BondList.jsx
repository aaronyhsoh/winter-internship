import BondItem from "./BondItem";
function BondList(props){
    return(
        <ul>
            {props.bonds.map((bond) =>(
                <BondItem
                key={bond.id}
                id={bond.id}
                faceValue={bond.faceValue}
                couponRate={bond.couponRate}
                yearsToMature={bond.yearsToMature}
                paymentInterval={bond.paymentInterval}
                holder={bond.holder}
                />
            ))}
        </ul>
    );

}

export default BondList;