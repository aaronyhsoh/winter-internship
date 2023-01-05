import BondHtlcForm from "../../components/bonds/BondHtlc/BondHtlcForm";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/Navigation";

import { useState } from 'react';
import { Breadcrumb, Layout, theme } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

function BondHtlcRequestPage() {
  const navigate = useNavigate();
  function createHtlcHandler(bondHtlcData) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(bondHtlcData);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:10051/htlc/bond/initiate", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error))
      .then(() => {
        navigate("/", { replace: true });
      });
  }


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
        
        <h1>Create HTLC</h1>
        </Header>
        <Content>
            <BondHtlcForm onCreateHtlc={createHtlcHandler} />
        </Content>

        </Layout>
      </Layout>
    </>
  );
}

export default BondHtlcRequestPage;
