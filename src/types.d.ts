import { State } from "./managers/stateManager";

export interface IElectronAPI {
    quitApp: () => void,
    updateState: (newState:State) => void,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}

  