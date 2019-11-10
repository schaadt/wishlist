import React from 'react'
import {AuthConsumer} from './AuthContext'

class UserForm extends React.Component{
    emailInput = React.createRef()
    passwordInput = React.createRef()

    redirect = (userId) => {
        this.props.history.push(`/${userId}/boards`)
    }


    render() {
        return(
            <AuthConsumer>
                {({ signUp, logIn, user, authMessage }) =>(
                <React.Fragment>
                    {/* Fjerner login formen, hvis brugeren er logget ind */}

                    {/* Hvis brugerens id ikke er til stede */}
                    {!user.id ? (
                    <div className="row-vertical center-items">
                        <div className="column_log">
                            <h3>Login, or Create a new account</h3>
                        </div>
                        {authMessage ? <span>{authMessage}</span> : ''}
                        <form className="column_log">
                            <div>
                                <input ref={this.emailInput} type="email" name="email" placeholder="Email" />
                            </div>
                            <div>
                                <input ref={this.passwordInput} type="password" name="password" placeholder="Password" />
                            </div>
                            <div>
                                <button
                                className="login-color" 
                                onClick={(e) => logIn(
                                    this.emailInput.current.value,
                                    this.passwordInput.current.value,
                                    e
                                )}>
                                Login</button>
                                <button 
                                className="signup-color" 
                                onClick={(e) => signUp(
                                    this.emailInput.current.value,
                                    this.passwordInput.current.value,
                                    e
                                )}>
                                Sign Up</button>
                            </div>
                        </form>
                    </div>
                    
                    ):(
                        <button onClick={() => this.redirect(user.id)}>Go to boards</button> 
                    )}
                </React.Fragment>
                )}
            </AuthConsumer>
        )
    }
}

export default UserForm