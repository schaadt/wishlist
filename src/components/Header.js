import React from 'react'
import {AuthConsumer} from './AuthContext'


const Header = () =>(
    <header>
        <AuthConsumer>
            {({user, logOut}) =>(
               <React.Fragment>
                <div className="row">
               <div className="column box2">
                   <a href={user.id ? `/${user.id}/boards` : `/`}>
                    <h1>HOME</h1> 
                   </a>
                   </div>
                   <div className="column box2">
                   <h1>WISHLIST</h1>
                   </div>
                    <div className="column box2">
                        {/* Tjekker om en bruger, er logget ind eller ud og viser herefter forskellige ting */}
                        {user.id ? (
                        <React.Fragment>
                        <p className="user-name">user: {user.email}</p>
                        <button className="logout-color" onClick={(e) => logOut(e)}>Logout</button>
                        </React.Fragment>
                        ): (<small></small>)}
                        </div>
                    </div>
               </React.Fragment> 
            )}
        </AuthConsumer>
    </header>
)

export default Header