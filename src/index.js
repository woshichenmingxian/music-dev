import("./styles/main.scss");
import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "mobx-react";
import { AppContainer } from "react-hot-loader";
import { rehydrate, hotRehydrate } from "rfx-core";
// import { CSSTransitionGroup } from 'react-transition-group'
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import 'antd/dist/antd.css';
import { isProduction } from "./utils/constants";
import App from "./components/App";
// import Rout from "./components/rout";
import stores from "./stores/stores";

const store = rehydrate();

const renderApp = Component => {

	// console.log(Router.map(()))
	render(
		<AppContainer>
			<Router>
				<Provider store={isProduction ? store : hotRehydrate()}>
					<App />
				</Provider>
			</Router>
		</AppContainer>,
		document.getElementById("root")
	);
};

renderApp(App);

if (module.hot) {
	module.hot.accept(() => renderApp(App));
}
