import React from 'react';
import './App.css';
import {Layout, Menu} from 'antd';
import {Content, Footer, Header} from 'antd/lib/layout/layout';
import {PipelinesTable} from './components/PipelinesTable';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import DevicesTable from './components/DevicesTable';

function App() {
  return (
      <Router>
          <div className="App">
              <Layout style={{height:"100vh"}}>
                  <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                      <div className="logo" />
                      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                      </Menu>
                  </Header>
                  <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
                      <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                          <Route exact={true} path={'/'} component={PipelinesTable}/>
                          <Route path={'/pipeline/:pipelineId'} component={DevicesTable}/>
                      </div>
                  </Content>
                  <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
              </Layout>
          </div>
      </Router>
  );
}

export default App;
