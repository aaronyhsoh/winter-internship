import { Link } from "react-router-dom";

// function Navigation(){
//     return(
//         <header className={classes.header}>
//             <div className={classes.logo}>
//                 <Link to="/">Home</Link>
//             </div>        
//                 <nav>
//                     <ul>
//                         <li>
//                             <Link to="/all-bonds">My Bonds</Link>
//                         </li>
//                         <li>
//                             <Link to="/new-bond">Create Bond</Link>
//                         </li>
//                         <li>
//                             <Link to="/transfer-bond">Transfer Bond</Link>
//                         </li>
//                         <li>
//                             <Link to="/withdraw-bond">Withdraw Bond</Link>
//                         </li>
//                         <li>
//                             <Link to="/refund-bond">Refund Bond</Link>
//                         </li>
//                         <li>
//                             <Link to="/bond-htlc">Htlc</Link>
//                         </li>
//                         <li>
//                             <Link to="/get-htlc">Get Htlc</Link>
//                         </li>
//                     </ul>
//                 </nav>
//         </header>

//     );
// }

// export default Navigation;

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu, theme } from 'antd';

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}


const items = [
  getItem(<Link to="/">Homepage</Link>, '1', <PieChartOutlined />),
  getItem('Manage HTLCs', '2', <DesktopOutlined />),
  getItem('Manage Bonds', 'sub1', <UserOutlined />, [
    getItem(<Link to="/all-bonds">My Wallet</Link>, '3'),
    getItem(<Link to="/new-bond">Create Bond</Link>, '4'),
    getItem(<Link to="/transfer-bond">Transfer Bond</Link>,'5'),
    getItem(<Link to="/bond-by-id">Search Bond'</Link>, '6'),
  ]),
  getItem('Manage HTLCs', 'sub2', <TeamOutlined />, [
    getItem(<Link to="/get-htlc">Get Htlc</Link>, '7'), 
    getItem(<Link to="/bond-htlc">Initialise Htlc</Link>, '8'),
    getItem(<Link to="/withdraw-bond">Withdraw Bond</Link>, '9'),
    getItem(<Link to="/refund-bond">Refund Bond</Link>, '10'),
    getItem(<Link to="/get-htlc-by-id">Get HTLC by ID</Link>, '11'),]),
  getItem('Files', '12', <FileOutlined />),
];


const Navigation = () => {
  return (
    <Menu theme="dark" mode="inline" items={items} />
  );
};
export default Navigation;