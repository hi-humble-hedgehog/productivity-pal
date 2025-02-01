export type State = 'setup' // for initial run
    | 'restricted' // when there's no OS permission to record
    | 'recording' // when it's recording 
    | 'offline' // when it can't reach the endpoint
    | 'productive' // when the user is productive
    | 'unproductive' // when the user is unproductive
    | 'caution' // when potential sensitive information is detected, provide option to go in incognito
    | 'incognito' // when the user is in incognito mode    

let state:State = 'setup';

export const getState = () => {
    return state;
}