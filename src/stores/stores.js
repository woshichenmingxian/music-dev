import { store } from "rfx-core";

import AppState from "./AppState";
import Mix from './mixmobx'

export default store.setup({
	appState: AppState,
	Mix:Mix
});
