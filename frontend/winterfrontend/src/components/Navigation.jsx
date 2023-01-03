import { Link } from "react-router-dom";
import classes from "./Navigation.module.css";

function Navigation(){
    return(
        <header className={classes.header}>
            <div className={classes.logo}>
                <Link to="/">Home</Link>
            </div>        
                <nav>
                    <ul>
                        <li>
                            <Link to="/all-bonds">My Bonds</Link>
                        </li>
                        <li>
                            <Link to="/new-bond">Create Bond</Link>
                        </li>
                        <li>
                            <Link to="/transfer-bond">Transfer Bond</Link>
                        </li>
                        <li>
                            <Link to="/withdraw-bond">Withdraw Bond</Link>
                        </li>
                        <li>
                            <Link to="/refund-bond">Refund Bond</Link>
                        </li>
                        <li>
                            <Link to="/bond-htlc">Htlc</Link>
                        </li>
                        <li>
                            <Link to="/get-htlc">Get Htlc</Link>
                        </li>
                    </ul>
                </nav>
        </header>

    );
}

export default Navigation;