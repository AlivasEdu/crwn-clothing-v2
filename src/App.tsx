import { useEffect, lazy, Suspense, ReactElement } from "react";
import { useDispatch } from "react-redux";

import { Routes, Route } from "react-router-dom";

import Spinner from "./components/spinner/spinner.component";
import { checkUserSession } from "./store/user/user.action";
import { GlobalStyle } from "./global.styles";

const Home = lazy(() => import("./routes/home/home.component"));
const Authentication = lazy(
  () => import("./routes/authentication/authentication.component"),
);
const Shop = lazy(() => import("./routes/shop/shop.component"));
const Navigation = lazy(
  () => import("./routes/navigation/navigation.component"),
);
const Checkout = lazy(() => import("./routes/checkout/checkout.component"));

const App = (): ReactElement => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkUserSession());
  }, []);
  return (
    <Suspense fallback={<Spinner />}>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path="shop/*" element={<Shop />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="auth" element={<Authentication />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
