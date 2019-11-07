import React from 'react'
import Board from './Board'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom'

class BoardPreview extends React.Component{
    goToBoard = () => {
        const boardId = this.props.board.id
        this.props.history.push({
            pathname: `/board/${boardId}`

        })
    }
    render(){
        return (
           <div className="column box"
           onClick= {this.goToBoard}
           style={{backgroundColor: this.props.board.background}}>
               <p className="board-text">{this.props.board.title}</p>
           </div>
        )
    }
}


BoardPreview.propTypes = {
    board: PropTypes.object.isRequired

}
export default withRouter(BoardPreview)