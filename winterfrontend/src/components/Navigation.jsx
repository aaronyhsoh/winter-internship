import { Link } from "react-router-dom";

function Navigation(){
    return(
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
    );
}

export default Navigation;