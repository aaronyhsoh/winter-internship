import { useNavigate } from "react-router-dom";
import TransferBondForm from '../components/bonds/TransferBondForm';
import { Breadcrumb, Layout, theme } from 'antd';
import Navigation from "../components/Navigation";
import { useState } from 'react';

const { Header, Footer, Sider, Content } = Layout;

function TransferBondPage(){
    const navigate=useNavigate();
    function transferBondHandler(bondTransferData){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify(bondTransferData);
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        
        fetch("http://localhost:10051/bond/transfer", requestOptions
        ).then(() => {
            navigate("/", {replace: true});
          });

    //     fetch('http://localhost:10051/bond/transfer',
    //         {
    //             //mode:'no-cors',
    //             method: 'POST',
    //             headers: { 
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json' 
    //             },
    //             body: JSON.stringify(bondTransferData),
    //         }
    //     ).then(() =>{
    //         navigate("/", {replace: true});
    //     });

    }


    // return(
    //     <section>
    //         <h1>Transfer Bond</h1>
    //         <TransferBondForm onTransferBond={transferBondHandler} />
    //     </section>
    // );


    const [collapsed, setCollapsed] = useState(false);
    const {
      token: { colorBgContainer },
    } = theme.useToken();

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
            
            <h1>Transfer Bond</h1>
            </Header>
            <Content>
                <TransferBondForm onTransferBond={transferBondHandler} />
            </Content>
    
            </Layout>
          </Layout>
        </>
    );
}

export default TransferBondPage;