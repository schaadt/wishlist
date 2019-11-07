import React from 'react'
import BoardPreview from '../BoardPreview'
import PropTypes from 'prop-types'
import CreateBoardForm from '../CreateBoardForm'


class Home extends React.Component {

    componentDidMount(){
        this.props.getBoards()
      }

    render(){
        return(
            <div>
                <span>{this.props.match.params.userId}</span>
                <CreateBoardForm createNewBoard={this.props.createNewBoard} />
                <div className="row">

            {
                Object.keys(this.props.boards).map(key =>(
                <BoardPreview 
                key = {key}
                board = {this.props.boards[key]} />
            ))}
            </div>

            </div>
        )
    }
}
Home.propTypes = {
    getBoards: PropTypes.func.isRequired,
    boards: PropTypes.array.isRequired,
    createNewBoard: PropTypes.func.isRequired
}
export default Home