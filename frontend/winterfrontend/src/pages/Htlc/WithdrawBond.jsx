import WithdrawBondForm from '../../components/bonds/WithdrawBondForm';
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/Navigation";
import { Breadcrumb, Layout, theme } from 'antd';
import { useState } from 'react';

const { Header, Footer, Sider, Content } = Layout;
function WithdrawBondPage(){
    const navigate=useNavigate();
    function withdrawBondHandler(withdrawBondData){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(withdrawBondData);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://localhost:10051/htlc/bond/withdraw", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
        .then(() => {
            navigate("/", {replace: true});
        });
    }
    const [collapsed, setCollapsed] = useState(false);
    const {
      token: { colorBgContainer },
    } = theme.useToken();

    // return(
    //     <section>
    //         <h1>Withdraw Bond</h1>
    //         <WithdrawBondForm onWithdrawBond={withdrawBondHandler} />
    //     </section>
    // );

    return (
        <>
        <Layout style={{ height: "100%" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div
                style={{
                    height: 32,
                    margin: 16,
                    background: 'rgba(255, 255, 255, 0.2)',
                }}
                />
            <Navigation />
        </Sider>
        <Layout>
            <Header 
                style={{
                    padding: 0,
                    background: colorBgContainer,
                }}
            >
            
            <h1>Withdraw Bond</h1>
            </Header>
            <Content>
                <WithdrawBondForm onWithdrawBond={withdrawBondHandler} />
            </Content>
    
            </Layout>
          </Layout>
        </>
    );

}

export default WithdrawBondPage;