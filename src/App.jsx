import { Layout } from 'antd';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import routesConfig from '@/router/index';
import './App.css'

const { Content } = Layout;

function App() {
  const Routes = () => useRoutes(routesConfig);

  return (
    <BrowserRouter>
      <Layout>
        <Content style={{ boxSizing: 'content-box', minHeight: 'auto' }}>
          <Routes />
        </Content>
      </Layout>
    </BrowserRouter>
  )
}

export default App
