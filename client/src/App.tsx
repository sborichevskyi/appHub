import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { useAppDispatch } from "./redux/hooks";
import { useRefreshQuery } from "./features/auth/authApi";
import { useEffect } from "react";
import { authInitialized, setCredentials } from "./features/auth/authSlice";
import "./styles/App.scss";
import { Footer } from "./components/Footer/Footer";
import { closeDemo, isDemoMode } from "./shared/heplers/demoHelper";
import { Button } from "./components/Button/Button";
import { Hero } from "./components/Hero/Hero";
import { Loader } from "./components/Loader/Loader";

function App() {
  const dispatch = useAppDispatch();
  const isDemo = isDemoMode();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const exitDemo = () => {
    closeDemo();
    window.location.reload();
  };

  const { data, isFetching } = useRefreshQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data) {
      dispatch(setCredentials({
        user: data.user,
        token: data.accessToken,
      }));
    }

    if (!isFetching && !data) {
      dispatch(authInitialized());
    }
  }, [data, isFetching, dispatch]);

  return (
    <div className="app-layout">
      <Header />
      {isHome && <Hero />}
      <main className="main">
        {isDemo && (
          <div className="demo-banner">
            <p>Demo mode</p>
            <Button variant="ghost" size="sm" onClick={exitDemo}>
              Exit
            </Button>
          </div>
        )}

        <div className="main__content">
          {isFetching ? <Loader /> : <Outlet />}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
