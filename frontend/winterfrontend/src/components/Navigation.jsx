import { Link } from "react-router-dom";
import classes from "./Navigation.module.css";

function Navigation(){
    return(
        <header className={classes.header}>
            <div className={classes.logo}>Bonds</div>        
                <nav>
                    <ul>
                        <li>
                            <Link to="/">All Bonds</Link>
                        </li>
                        <li>
                            <Link to="/new-bond">Create Bond</Link>
                        </li>
                    </ul>
                </nav>
        </header>
    );
}

export default Navigation;