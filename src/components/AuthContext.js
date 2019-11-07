import React from 'react'

const AuthContext = React.createContext()


class AuthProvider extends React.Component {
    state = {
        user: {
            name: 'Peter'
        }  
    }


render() {
    return(
        //gør at provideren har adgang til alt indhold på app siden 
        // forskelligt indhold alt efter hvilken bruger der logger ind
        // REACT CONTEXT API
        <AuthContext.Provider value={{user: this.state.user}}>
            {this.props.children}
        </AuthContext.Provider>
    )
}
}

const AuthConsumer = AuthContext.Consumer


export {AuthProvider, AuthConsumer}