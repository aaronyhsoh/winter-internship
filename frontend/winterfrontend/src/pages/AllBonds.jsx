import { useState, useEffect } from 'react';
import BondList from "../components/bonds/CreateBond/BondList";
import Navigation from "../components/Navigation";
import { Breadcrumb, Layout, theme } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

// const DUMMY_DATA = [
//     {
//         id: 'b1',     
//         faceValue: '100',
//         couponRate: '10',
//         yearsToMature: '10',
//         paymentInterval: '1',
//         holder: 'PartyA',

//     },
//     {
//         id: 'b2',      
//         faceValue: '200',
//         couponRate: '20',
//         yearsToMature: '20',
//         paymentInterval: '2',
//         holder: 'PartyB',
//     },
// ];


function AllBondsPage(){
    const [isLoading, setIsLoading] = useState(true);
    const [loadedBonds, setLoadedBonds] = useState([]);

    // useEffect(() => {
    //     fetch('http://localhost:10051/bond/holder'
    //     ).then(response => {
    //         return response.json();
    //     }).then((data) => {
    //         setIsLoading(false);
    //         setLoadedBonds(data);
    //     // }).catch(err => {
    //     //     console.log(err);
    //     });
    // },[]);

    useEffect(() => {
        fetch('http://localhost:10051/bond/holder'
        ).then(response => {
            return response.json();
        })
        .then((data) => {
            const bonds = [];

            for(const key in data){
                const bond = {
                    id: key,
                    ...data[key]
                };
                bonds.push(bond);
            }

            setIsLoading(false);
            setLoadedBonds(bonds);
        // }).catch(err => {
        //     console.log(err);
        });
    },[]);

    const [collapsed, setCollapsed] = useState(false);
    const {
      token: { colorBgContainer },
    } = theme.useToken();


    if(isLoading){
        return(
            <section>
                <p>Loading...</p>
            </section>
        );
    }

    // return(
    //     <section>
    //         <h1>My Bonds</h1>
    //         <BondList bonds={loadedBonds} />
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
            
            <h1>My Wallet</h1>
            </Header>
            <Content>
                <BondList bonds={loadedBonds} />
            </Content>
    
            </Layout>
          </Layout>
        </>
    );

}

export default AllBondsPage;
