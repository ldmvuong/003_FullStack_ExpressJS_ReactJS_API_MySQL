import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./util/axios.customize"
import { useContext, useEffect } from "react"
import { AuthContext } from "./components/context/auth.context";
import { Spin } from "antd";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "./util/apolloClient";

function App() {
  const { auth, setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      const res = await axios.get("/v1/api/account"); // Gọi API /account (từ api.js BackEnd)
      if (res && !res.message) {
        setAuth({
          isAuthenticated: true,
          user: {
            email: res.email,
            name: res.name
          }
        })
      }
      setAppLoading(false);
    }
    // Chỉ gọi fetchAccount nếu chưa đăng nhập
    if (!auth.isAuthenticated) {
        fetchAccount();
    }
  }, [])

  return (
    <ApolloProvider client={apolloClient}>
      <div>
        {appLoading === true ?
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)"
          }}>
            <Spin />
          </div>
          :
          <>
            <Header />
            <Outlet />
          </>
        }
      </div>
    </ApolloProvider>
  )
}

export default App