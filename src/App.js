import React from 'react';
import './App.css';
import Board from './components/Board'
import PageNotFound from './components/pages/PageNotFound'
import Home from './components/pages/Home'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {boardsRef, listsRef, cardsRef} from './firebase'
import AuthProvider from './components/AuthContext'
import UserForm from './components/UserForm'
import Header from './components/Header'


class App extends React.Component {
  state = {
    boards: []
  }
    // Henter Board Data ned fra firebase, og viser det rigtige data fra brugeren der logget ind
  getBoards = async userId => {
    try{

      this.setState({ boards: []} )
      const boards = await boardsRef
        .where('board.user', '==', userId)
        .orderBy('board.createdAt')
        .get()
      boards.forEach(board =>{
        const data = board.data().board
        const boardObj = {
          id: board.id,
          ...data
        }
        // Henter den eksistrende data og tilføjer det ny
        this.setState({boards: [...this.state.boards, boardObj]})
      })

    }
    catch (error) {
      console.log('Error getting boards', error)
    }
  }

  //Tilføjer et Nyt Board
  createNewBoard = async board => {
    try {
      const newBoard =  await boardsRef.add({board})
      const boardObj = {
        id: newBoard.id,
        ...board
      }
      this.setState({boards: [...this.state.boards, boardObj]})
    } catch (error) {
      console.error('Error Creating New Board: ', error)
    }
  }

//Sletter listen
  deleteList = async (listId) => {
    try{
        const cards = await cardsRef
        .where('card.listId', '==', listId)
        .get()
        if(cards.docs.lenght !==0){
            cards.forEach(card => {
                card.ref.delete()
            })
        }
        const list = await listsRef.doc(listId)
        list.delete()
    }catch(error){
        console.error ('Error Deleting Lists:', error)
    }
}

//Sletter Boardet
deleteBoard = async boardId => {
  try{
    const lists = await listsRef
    .where('list.board', '==', boardId)
    .get()

    if(lists.docs.lenght !==0){
      lists.forEach(list => {
        this.deleteList(list.ref.id)
      })
    }
    const board = await boardsRef.doc(boardId)
    this.setState({
      boards: [
        ...this.state.boards.filter(board => {
          return board.id !== boardId
        })
      ]
    })
    board.delete()
  } catch (error) {
    console.error('error deleting board', error)
  }
}

updateBoard = async (boardId, newTitle) => {
  try{

    const board = await boardsRef.doc(boardId)
    board.update({'board.title': newTitle})

  }catch (error) {
    console.error('error updating board', error)
  }
}

//Viser Indholdet i Appen
render(){
    return(
    <div>
      <BrowserRouter>
      <AuthProvider>
        <Header />
      <Switch>
        <Route
        exact
        path="/"
        component={UserForm}/>
      <Route 
        exact 
        path= "/:userId/boards"
        render = {(props) => (
          <Home 
          {...props}
          //Henter fra Home Component
          getBoards = {this.getBoards}
          boards = {this.state.boards} 
                createNewBoard = {this.createNewBoard} />
        )}
        
      />
      <Route 
        path="/board/:boardId"
        render = {props => (
         <Board 
          {...props} 
          updateBoard={this.updateBoard}
          deleteBoard={this.deleteBoard}
          deleteList={this.deleteList}
          />
        )}
         />
        
      <Route component = {PageNotFound} />


{/*       <Home boards = {this.state.boards} 
      createNewBoard = {this.createNewBoard} />
      <Board /> */}
      </Switch>
      </AuthProvider>
      </BrowserRouter>
    </div>
    );
}
}
export default App;
