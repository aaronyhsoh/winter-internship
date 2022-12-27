import BondItem from "./BondItem";
function BondList(props){
    return(
        <ul>
            {props.bonds.map((bond) =>(
                <BondItem
                key={bond.id}
                bondName={bond.bondName}
                faceValue={bond.faceValue}
                couponRate={bond.couponRate}
                yearsToMature={bond.yearsToMature}
                paymentInterval={bond.paymentInterval}
                issueDate={bond.issueDate}
                maturityDate={bond.maturityDate}
                bondRating={bond.bondRating}
                issuer={bond.issuer}
                holder={bond.holder}
                id={bond.linearID.id}
                />
            ))}
        </ul>
    );

}

export default BondList;