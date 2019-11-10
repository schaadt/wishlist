import React from 'react'
import PropTypes from 'prop-types';
import {AuthConsumer} from '../components/AuthContext'

class CreateBoardForm  extends React.Component{

    state = {
        title: '',
        background: '#1f3a93'
    }

    handleSubmit = (e, userId) => {
        e.preventDefault()
        const board = {
            title: this.state.title,
            background: this.state.background,
            createdAt: new Date(),
            user: userId
        }
        if(board.title && board.background && board.user) {
            this.props.createNewBoard(board)
        }
    }
    render(){
        return(
            <AuthConsumer>
                {({user}) =>(
                <form className="row center-items top-space"
                onSubmit ={(e) => this.handleSubmit(e, user.id)}>
                    <input
                        type="text"
                        name= "name"
                        placeholder="Boardname"
                        onChange = {(e) => this.setState({title: e.target.value})}
                    />

                <select name="background"
                    onChange = {(e) => this.setState({background: e.target.value})}
                >
                    <option value="#1f3a93">Blue</option>
                    <option value="#00b16a">Green</option>
                    <option value="#cf000f">Red</option>
                    <option value="#db0a5b">Pink</option>
                    <option value="#8c14fc">Purple</option>
                    <option value="#f15a22">Orange</option>
                </select>

                <button type="submit" className="login-color">Nyt Board</button>
            </form>
                )}
            </AuthConsumer>

        )
    }
}

CreateBoardForm.propTypes = {
    createNewBoard: PropTypes.func.isRequired
}

export default CreateBoardForm