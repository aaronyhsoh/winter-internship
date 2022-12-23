import { Link } from "react-router-dom";
import classes from "./Navigation.module.css";

function Navigation(){
    return(
        <header className={classes.header}>
            <div className={classes.logo}>
                <Link to="/">ABC Bond</Link>
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
                    </ul>
                </nav>
        </header>
    );
}

export default Navigation;