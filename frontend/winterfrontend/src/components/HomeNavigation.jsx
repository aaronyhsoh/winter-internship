import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

// function getItem(label, key, icon, children) {
//     return {
//       key,
//       icon,
//       children,
//       label,
//     };
//   }

const items = [
    {
      label: 'Manage Bonds',
      key: 'mail',
      icon: <MailOutlined />,
    },

    {
        label: 'Manage HTLC',
        key: 'app',
        icon: <AppstoreOutlined />,
      },
];

function HomeNavigation(){
    const [current, setCurrent] = useState('mail');
    const onClick = (e) => {
      console.log('click ', e);
      setCurrent(e.key);
    };
    return(
        <Menu 
        theme="dark"
        onClick={onClick} 
        selectedKeys={[current]} 
        mode="horizontal" 
        items={items} />
    );

}

export default HomeNavigation;