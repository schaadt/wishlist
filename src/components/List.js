import React from 'react'
import Card from './Card'
import PropTypes from 'prop-types'
import {cardsRef, listsRef} from '../firebase'


class List extends React.Component{
    state = {
        currentCards: []
    }

    componentDidMount() {
       this.fetchCards(this.props.list.id) 
    }

    // Henter Cards ud fra Firebase hvor Cards har samme Id som List
    fetchCards = async listId => {
        try{
           await cardsRef
            .where('card.listId', '==', listId)
            .orderBy('card.createdAt')
            .onSnapshot(snapshot => {
              snapshot.docChanges()
                .forEach(change => {
                    const doc = change.doc
                    const card = {
                        id: doc.id,
                        text: doc.data().card.text,
                        labels: doc.data().card.labels
                    }
                    if (change.type === 'added') {
                        this.setState({currentCards: [...this.state.currentCards, card]})
                    }
                    if(change.type === 'removed') {
                        this.setState({
                            currentCards: [
                                ...this.state.currentCards.filter(card =>{
                                    return card.id !== change.doc.id
                                })
                            ]
                        })
                    }
                    if(change.type === 'modified'){
                       const index = this.state.currentCards.findIndex(item =>{
                           return item.id === change.doc.id
                       })
                       const cards = [...this.state.currentCards]
                       cards [index] = card
                       this.setState({currentCards: cards})
                    }
                })
            })

        } catch (error) {
            console.log('Error Fetching Cards: ', error)
        }
    }

    // Tilføjer et nyt Card
    nameInput = React.createRef()
    createNewCard = async (e) =>{
        try{
        e.preventDefault()
        const card = {
            text: this.nameInput.current.value,
            listId: this.props.list.id,
            labels: [],
            createdAt: new Date()
        }

        // Hvis der er Card Text og et List Id Tilføj Card
        if(card.text && card.listId) {
            await cardsRef.add({card})
        }

        this.nameInput.current.value = ''
        /* console.log('new card added' + card.text) */
    } catch (error) {
        console.error('Error Creating New Card: ', error)
    }

    }

    deleteList = () => {
        const listId = this.props.list.id
        this.props.deleteList(listId)
    }

    updateList = async e => {
        try{
            const listId = this.props.list.id
            const newTitle = e.currentTarget.value
            const list = await listsRef.doc(listId)
            list.update({'list.title': newTitle})

        } catch(error) {
            console.error ('error updating a new list: ', error)
        }
    }

    render (){
        return (
            <div className="column box2 space_bund">
                <div className="list-header">
                    <input 
                    type ="text" 
                    className="peterwind"
                    name="listTitle" 
                    onChange={this.updateList} 
                    defaultValue={this.props.list.title} 
                    />

                {/* <p>{this.props.list.title}</p> */}
                <span onClick={this.deleteList}>&times;</span>
            </div>
            {Object.keys(this.state.currentCards).map(key =>  (
               <Card 
                key={key}
                data={this.state.currentCards[key]} /> 
            ))}

            <form onSubmit={this.createNewCard} className="new-card-wrapper">
                <input
                type="text"
                ref={this.nameInput}
                name ="name"
                placeholder = "+ New Card" 
        
                />
                
                <button type="submit">Ny Liste</button>
            </form>

            </div>
        )
    }
}

List.propTypes = {
    list: PropTypes.object.isRequired,
    deleteList: PropTypes.func.isRequired
    
}

export default List