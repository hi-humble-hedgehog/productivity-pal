import { State } from "./managers/stateManager";

export interface IElectronAPI {
    screenRecorderMessage: (message: string) => void,
    credentialMessage: (message: string) => void,
    quitApp: () => void,
    updateState: (newState:State) => void,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}