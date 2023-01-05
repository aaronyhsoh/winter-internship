import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import BondHtlcList from '../.././components/bonds/BondHtlc/BondHtlcList';
import { Breadcrumb, Layout, theme } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

function GetHtlcPage(){
    const [isLoading, setIsLoading] = useState(true);
    const [loadedBonds, setLoadedBonds] = useState([]);
    // useEffect(() => {
    // var requestOptions = {
    //     method: 'GET',
    //     redirect: 'follow'
    //   };
      
    //   fetch("http://localhost:10051/htlc/getAll", requestOptions)
    //     .then(response => response.text())
    //     .then(result => console.log(result))
    //     .catch(error => console.log('error', error))
    //     .then((data) => {
    //         setIsLoading(false);
    //         setLoadedBonds(data);
    //     // }).catch(err => {
    //     //     console.log(err);
    //     });
    // },[]);


    useEffect(() => {
        fetch('http://localhost:10051/htlc/getAll'
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
    //         <h1>All Related HTLC</h1>
    //         <BondHtlcList htlcs={loadedBonds} />
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
            
            <h1>All Hash Timelocked Contract</h1>
            </Header>
            <Content>
                <BondHtlcList htlcs={loadedBonds} />
            </Content>
    
            </Layout>
          </Layout>
        </>
    );
}

export default GetHtlcPage;