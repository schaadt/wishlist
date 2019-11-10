import React from 'react'
import {firebaseAuth} from '../firebase'
import {withRouter} from 'react-router-dom'

const AuthContext = React.createContext()


class AuthProvider extends React.Component {
    state = {
        user: {}, 
        authMessage: '' 
    }

    componentWillMount(){
        firebaseAuth.onAuthStateChanged((user) => {
            if(user) {
                this.setState({
                    user:{
                        id: user.uid,
                        email: user.email
                    }
                })
            }else {
                this.setState({
                    user: {}
                })
            }
        })
    }


    // Registrere Brugeren i FireBase og sender brugeren til boards siden.
    signUp = async (email, password, e) => {
        try{
            e.preventDefault()
            await firebaseAuth.createUserWithEmailAndPassword(
                email,
                password
            )
            this.props.history.push(`/${this.state.user.id}/boards`)
        } catch (error) {
            this.setState({
                authMessage: error.message
            })
        }
    }

    logIn = async (email, password, e) =>{
        try{
            e.preventDefault()
            await firebaseAuth.signInWithEmailAndPassword(
                email,
                password
            )
            this.props.history.push(`/${this.state.user.id}/boards`)

        } catch (error){
            this.setState({
                authMessage: error.message
            })
        }
    }

    // LOGGER UD
    logOut = () => {
        try{
          firebaseAuth.signOut()
          this.setState  ({
              user: {}
          })
          this.props.history.push(`/`)
        } catch (error){
            this.setState({
                authMessage: error.message
            })
        }
    }


render() {
    return(
        
        // REACT CONTEXT API
        // Auth kan kaldes fra denne fil, og man behøver derfor kun at hente fra denne fil når brugeren skal have adgang til bestemte sider.
        // Placere User Auth i en fil, der så kan kaldes når der brug for den, man behøver derfor ikke Prop Drille for at få adgang.

        <AuthContext.Provider 
            value={{
                user: this.state.user,
                signUp:this.signUp,
                logIn: this.logIn,
                logOut: this.logOut,
                authMessage: this.state.authMessage
            }}>
            {this.props.children}
        </AuthContext.Provider>
    )
}
}

const AuthConsumer = AuthContext.Consumer

export default withRouter(AuthProvider)
export {AuthConsumer}