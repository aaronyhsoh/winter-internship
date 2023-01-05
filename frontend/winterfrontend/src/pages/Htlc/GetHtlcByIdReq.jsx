import HtlcByIdForm from '../../components/HtlcById/HtlcByIdForm';
import GetHtlcByIdPage from './GetHtlcById';
import { useState } from 'react';
import Navigation from "../../components/Navigation";
import { Breadcrumb, Layout, theme } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

function GetHtlcByIdReqPage(){
    const [bond, setBond] = useState();

    var api = 'http://localhost:10051/htlc?id='

    function getByIdHandler(htlcid){

        fetch(api + htlcid
            ).then(response => {
                return response.json();
            })
            .then((data) => {
                setBond(data)
            });
    }

    const [collapsed, setCollapsed] = useState(false);
    const {
      token: { colorBgContainer },
    } = theme.useToken();

    // return(
    //     <section>
    //         <h1>Get HTLC by ID</h1>
    //         {bond === undefined ? <HtlcByIdForm onGetById={getByIdHandler} /> 
    //         : <GetHtlcByIdPage loadedData={bond} />
    //         }
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
            
            <h1>Get HTLC by ID</h1>
            </Header>
            <Content>
                {bond === undefined ? <HtlcByIdForm onGetById={getByIdHandler} /> 
                : <GetHtlcByIdPage loadedData={bond} />
                }
            </Content>
    
            </Layout>
          </Layout>
        </>
    );
}

export default GetHtlcByIdReqPage;