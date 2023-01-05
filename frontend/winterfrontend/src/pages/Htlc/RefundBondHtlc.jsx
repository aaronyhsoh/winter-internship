import RefundBondForm from '../../components/bonds/RefundBondForm';
import { useNavigate } from "react-router-dom";
import  Navigation from "../../components/Navigation";
import { Breadcrumb, Layout, theme } from 'antd';
import { useState } from 'react';

const { Header, Footer, Sider, Content } = Layout;

function RefundBondPage(){
    const navigate = useNavigate();
    function refundBondHandler(refundBondData){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(refundBondData);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://localhost:10051/htlc/bond/refund", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
        .then(() => {
            navigate("/", {replace: true});
        });

    }
    // return(
    //     <section>
    //         <h1>Refund Bond</h1>
    //         <RefundBondForm onRefundBond={refundBondHandler} />
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
          
          <h1>Refund Bond</h1>
          </Header>
          <Content>
            <RefundBondForm onRefundBond={refundBondHandler} />
          </Content>
  
          </Layout>
        </Layout>
      </>
    );
}
export default RefundBondPage;