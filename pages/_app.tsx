import "../styles/globals.css";
import type { AppProps } from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "react-phone-input-2/lib/style.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Layout from "../components/Layout";
// import "react-datepicker/dist/react-datepicker.css";
// import { SwitchTransition, CSSTransition } from "react-transition-group";

// Binding events
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
