import BondByIdForm from '../components/BondById/BondByIdForm';
import GetBondByIdPage from './GetBondById';
import { useState } from 'react';
import Navigation from '../components/Navigation';
import { Breadcrumb, Layout, theme } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

function BondByIdPage(){
    const [bond, setBond] = useState();
    const [isLoading, setIsLoading] = useState(true);

    var api = 'http://localhost:10051/bond?id='

    function getByIdHandler(bondByIdData){
        // <GetBondByIdPage bondByIdData />
        console.log(bondByIdData);
        fetch(api + bondByIdData.bondid
            ).then(response => {
                return response.json();
            })
            .then((data) => {
                setIsLoading(false);
                setBond(data)
            });
    }

    // return(
    //     <section>
    //         <h1>Get Bond by ID</h1>
    //         { bond === undefined ?
    //             <BondByIdForm 
    //             onGetById={getByIdHandler} />
    //             : 
    //             <GetBondByIdPage isLoading={isLoading} loadedBonds={bond} />
    //         }
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
            
            <h1>Get Bond by ID</h1>
            </Header>
            <Content>
                { bond === undefined ?
                    <BondByIdForm 
                    onGetById={getByIdHandler} />
                    : 
                    <GetBondByIdPage isLoading={isLoading} loadedBonds={bond} />
                }
            </Content>
    
            </Layout>
          </Layout>
        </>
    );
}

export default BondByIdPage;