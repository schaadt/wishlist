import React from 'react'
import { cardsRef } from '../firebase'
import PropTypes from 'prop-types'

class EditCardModal extends React.Component {
    state = {
        availableLabels: [
            "#80ccff",
            "#80ffaa",
            "#f94a1e",
            "#ffb3ff",
            "#bf00ff",
            "#ffad33",
        ],
        selectedLabels: [
        ]
    }

    componentDidMount() {
        this.setState({
            selectedLabels: this.props.cardData.labels
        })
    }

    textInput = React.createRef()
    updateCard = async e => {
        try{
            e.preventDefault()
            const cardId = this.props.cardData.id
            const newText = this.textInput.current.value
            const labels = this.state.selectedLabels
            const card = await cardsRef.doc(cardId)
            card.update({
                'card.text': newText,
                'card.labels':labels
            })

            this.props.toggleModal()

        } catch(error) {
            console.error('error updating card', error)
        }
    }

    setLabel = label => {
        const labels = [...this.state.selectedLabels]
        if(labels.includes(label)) {
            const newLabels = labels.filter((element)=> {
                return element !== label
            })
            this.setState({selectedLabels: newLabels})
        } else {
            labels.push(label)
            this.setState ({selectedLabels: labels})
        }
    }

    render() {
        return(
            <div className="modal-wrapper" style={{display: this.props.modalOpen ? 'block' : 'none'}}>
                <div className="modal-body">
                    <form onSubmit={this.updateCard}>
                        <div>
                            <span className="modal-close" onClick={this.props.toggleModal}>&times;</span>
                            <p className="label-title">Add / Remove:</p>
                           
                            
                        </div>
                <div className="edit-area">
                
                    <input className="textbox-edit" defaultValue={this.props.cardData.text} ref={this.textInput}></input>
                </div>
                <div>
         
                </div>
                <button type="submit">Save Changes</button>
                </form>
                </div>
            </div>
        )
    }

}

EditCardModal.propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    cardData: PropTypes.object.isRequired
}

export default EditCardModal