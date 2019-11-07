import React from 'react'
import List from './List'
import {boardsRef,listsRef} from '../firebase'
import PropTypes from 'prop-types';
import {AuthConsumer} from './AuthContext'


class Board extends React.Component{

    state = {
        currentBoard: {},
        currentLists: []
    }
    componentDidMount(){
        //Henter IDet fra adresseLinien
        this.getBoard(this.props.match.params.boardId) 
        this.getLists(this.props.match.params.boardId)  
    }

    getLists = async boardId => {
        try {
            //Henter kun listen ud derfra hvor Board matcher med det rigtige board Id
            const lists = await listsRef
            .where('list.board', '==', boardId)
            .orderBy('list.createdAt')
            //FIREBASES METODE PÅ AT HENTE REALTIME DATA
            .onSnapshot(snapshot => {
                snapshot.docChanges()
                .forEach(change =>{
                    if (change.type === 'added') {
                        const doc = change.doc
                        const list = {
                            id: doc.id,
                            title: doc.data().list.title
                        }
                        this.setState ({
                            currentLists: [...this.state.currentLists, list]
                        })
                    }
                    if(change.type === 'removed') {
                        this.setState({
                            currentLists: [
                                ...this.state.currentLists.filter(list => {
                                    return list.id !== change.doc.id
                                })
                            ]
                        })
                    }
                })

            })
        } catch (error) {
            console.log('Error Fetching Lists: ', error)
        }
    }

    getBoard = async boardId => {
        try{
            const board = await boardsRef.doc(boardId).get()
            this.setState({currentBoard: board.data().board})
        } catch (error) {
            console.log('error getting boards', error)
        }
    }

    addBoardInput = React.createRef()

    createNewList = async (e) => {
        try{
        e.preventDefault()
        /* console.log(this.addBoardInput.current.value) */
      const list = {
            title: this.addBoardInput.current.value,
            board: this.props.match.params.boardId,
            createdAt: new Date(),
        }

        if(list.title && list.board) {
           await listsRef.add({list})
        }   
        this.addBoardInput.current.value = ''
        } catch(error) {
            console.error ('error creating a new list: ', error)
        }
    } 

    deleteBoard = async () => {
        const boardId = this.props.match.params.boardId
        this.props.deleteBoard(boardId)
    }

    updateBoard = e => {
        const boardId = this.props.match.params.boardId
        const newTitle = e.currentTarget.value
            if (boardId && newTitle) {
                this.props.updateBoard(boardId, newTitle)
            }
    }

    render (){
        return (
            // GIVER BRUGEREN ADGANG TIL BOARDS
            <AuthConsumer>

            {({user}) => (
                
            <div className="row" style={{backgroundColor: this.state.currentBoard.background }}>

            <div className="board-header">
           {/* <h1> {user.name} </h1> */}
                {/* <h3>{this.state.currentBoard.title}</h3> */}
                <input type="text" name="boardTitle" onChange={this.updateBoard} defaultValue={this.state.currentBoard.title}/>
                <button onClick={this.deleteBoard}>Delete Board</button>
            </div>

                <div className ="list-wrapper">

                    {Object.keys(this.state.currentLists).map(key => (
                    <List 
                    key={this.state.currentLists[key].id} 
                    list = {this.state.currentLists[key]}
                    deleteList={this.props.deleteList}/> 
                    ))} 

                </div>
                <form onSubmit = {this.createNewList}
                className="new-list-wrapper">
                        <input
                        type="text"
                        ref ={this.addBoardInput}
                        name ="name"
                        placeholder="+ New List" />
                </form>
                </div>
            )}
            </AuthConsumer>
       )
    }
}

Board.propTypes = {
    deleteBoard: PropTypes.func.isRequired,
    deleteList: PropTypes.func.isRequired,
    updateBoard: PropTypes.func.isRequired
}
export default Board