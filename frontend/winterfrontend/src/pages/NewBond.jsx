import { useNavigate } from "react-router-dom";
import CreateBondForm from '../components/bonds/CreateBond/CreateBondForm';
import Navigation from "../components/Navigation";
import { Breadcrumb, Layout, theme } from 'antd';
import { useState } from 'react';

const { Header, Footer, Sider, Content } = Layout;
//import axios from "axios";


function NewBondPage(){
    const navigate = useNavigate();
    function createBondHandler(bondData){
        fetch('http://localhost:10051/bond/create',
            {
                //mode:'no-cors',
                method: 'POST',
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(bondData),
            }
        ).then(() =>{
            navigate("/", {replace: true});
        });

        ///
        ///

        // var myHeaders = new Headers();
        // myHeaders.append("Content-type", "application/json");

        // var raw = JSON.stringify(bondData);

        // var requestOptions = {
        // method: 'POST',
        // //mode:'no-cors',
        // headers: myHeaders,
        // body: raw,
        // redirect: 'follow'
        // };

        // fetch("http://localhost:10051/bond/create", requestOptions)
        // .then(response => response.text())
        // .then(result => console.log(result))
        // .catch(error => console.log('error', error));



        // //axios
        // var data = JSON.stringify({
        // "bondName": "bondC",
        // "faceValue": 100,
        // "couponRate": 5,
        // "yearsToMature": 2,
        // "paymentInterval": 0.5,
        // "holder": "PartyB"
        // });

        // var config = {
        // method: 'post',
        // url: 'localhost:10051/bond/create',
        // headers: { 
        //     'Content-Type': 'application/json'
        // },
        // data : data
        // };

        // axios(config)
        // .then(function (response) {
        // console.log(JSON.stringify(response.data));
        // })
        // .catch(function (error) {
        // console.log(error);
        // });

    }


    // return(
    //     <section>
    //         <h1>Create Bond</h1>
    //         <CreateBondForm onCreateBond={createBondHandler} />
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
        
        <h1>Create Bond</h1>
        </Header>
        <Content>
            <CreateBondForm onCreateBond={createBondHandler} />
        </Content>

        </Layout>
      </Layout>
    </>
  );
}

export default NewBondPage;