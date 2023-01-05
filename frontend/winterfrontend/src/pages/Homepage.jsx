import { Link } from "react-router-dom";
import { Col, Row, Divider } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import HomeNavigation from '../components/HomeNavigation';

const { Header, Content, Footer } = Layout;

function Homepage(){
    return( 
        <Layout className="layout">   
        <Header>
            <HomeNavigation />
        </Header>
        <Content style={{ padding: '0 50px' }}> 
            <Row justify="center">
                <Col span={12}>             
                <p><Link to="/all-bonds">My Wallet</Link></p>
                <p><Link to="/new-bond">Create Bond</Link></p>
                <p><Link to="/transfer-bond">Transfer Bond</Link></p>
                <p><Link to="/bond-by-id">Get Bond by ID</Link></p>
                </Col>

                <Col span={12}>
                <p><Link to="/get-htlc">View Hashed Timelock Contract (HTLC)</Link></p>
                <p><Link to="/bond-htlc">Create Htlc</Link></p>
                <p><Link to="/refund-bond">Refund Bond</Link></p>
                <p><Link to="/withdraw-bond">Withdraw Bond</Link></p>
                <p><Link to="/get-htlc-by-id">Get HTLC by ID</Link></p>
                </Col>
            </Row>
        </Content>
        </Layout>  
    );
}

export default Homepage;