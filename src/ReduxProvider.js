import React from "react";

export const GlobalContext = React.createContext({})

const Provider = ({ store, children }) => {

    return (
        <GlobalContext.Provider value={store}>
            {children}
        </GlobalContext.Provider>
    )
}

export default Provider;