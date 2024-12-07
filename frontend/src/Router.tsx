import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Fragment } from "react/jsx-runtime"
import App from "./App";

const RoutesApp = () => {
	return (
		<BrowserRouter>
			<Fragment>
				<Routes>
					<Route path="/" element={<App></App>} />
				</Routes>
			</Fragment>
		</BrowserRouter>
	)
}

export default RoutesApp;