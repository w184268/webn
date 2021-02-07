import PropTypes from 'prop-types';
import React from 'react';
import ArtiePopupComponent from '../components/artie-exercises/artie-exercises-popup.jsx';
import {defineMessages, injectIntl} from 'react-intl';
import bindAll from 'lodash.bindall';

const exercisesMessages = defineMessages({
    popupModalTitle: {
        defaultMessage: 'ARTIE',
        description: 'ARTIE',
        id: 'gui.menuBar.artie.exercises.popup.modalTitle'
    },
    message: {
        defaultMessage: 'The exercise has been sent successfully!',
        description: 'The exercise has been sent successfully!',
        id: 'gui.artie.exercise.sent'
    }
});

const solutionMessages = defineMessages({
    popupModalTitle: {
        defaultMessage: 'ARTIE',
        description: 'ARTIE',
        id: 'gui.menuBar.artie.exercises.popup.modalTitle'
    },
    message: {
        defaultMessage: 'The solution has been sent successfully!',
        description: 'The solution has been sent successfully!',
        id: 'gui.artie.solution.sent'
    }
});

const initialEvaluationMessages = defineMessages({
    popupModalTitle: {
        defaultMessage: 'Welcome',
        description: 'Welcome',
        id: 'gui.artie.evaluation.welcome'
    },
    message: {
        defaultMessage: "Welcome!In first place we will check your knowledge about Scratch! Let's see if you are a Padawan, Jedi or Master Jedi in Scratch.",
        description: "Welcome!In first place we will check your knowledge about Scratch! Let's see if you are a Padawan, Jedi or Master Jedi in Scratch.",
        id: 'gui.artie.evaluation.intro'
    }
});

const padawanEvaluationMessages = defineMessages({
    popupModalTitle: {
        defaultMessage: 'Welcome to Padawan level',
        description: 'Welcome to Padawan level',
        id: 'gui.artie.evaluation.welcome.padawan'
    },
    message: null
});

const jediEvaluationMessages = defineMessages({
    popupModalTitle: {
        defaultMessage: 'Welcome to Jedi level',
        description: 'Welcome to Jedi level',
        id: 'gui.artie.evaluation.welcome.jedi'
    },
    message: null
});

const masterJediEvaluationMessages = defineMessages({
    popupModalTitle: {
        defaultMessage: 'Welcome to Master Jedi level',
        description: 'Welcome to Master Jedi level',
        id: 'gui.artie.evaluation.welcome.masterjedi'
    },
    message: null
});

const exerciseComponent = (onCancel, type) => {
    return (
        <ArtiePopupComponent
            onCancel={onCancel}
            type = {type}
            messages = {exercisesMessages}
            okButton = {false}
            cancelButton = {false}
        />
    );
}

const solutionComponent = (onCancel, type) => {
    return(
        <ArtiePopupComponent
            onCancel={onCancel}
            type = {type}
            messages = {solutionMessages}
            okButton = {false}
            cancelButton = {false}
        />
    );
}

const evaluationComponent = (onCancel, onOK, type, image, messages, customBodyMessage) => {
    return(
        <ArtiePopupComponent
            onCancel={onCancel}
            onOK={onOK}
            type = {type}
            messages = {messages}
            okButton = {true}
            cancelButton = {false}
            image={image}
            customBodyMessage={customBodyMessage}
        />
    );
}

class ArtieExercisePopup extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            artieExercises: null,
            artieLogin: null
        };
        bindAll(this, [
            'handleEvaluationOKClick',
            'nextExercise',
            'handleCloseEvaluationPopup'
        ]);
    }

    componentWillReceiveProps (newProps) {
        if(this.state.artieExercises !== newProps.artieExercises){
            this.setState({
                artieExercises: newProps.artieExercises
            });
        }

        if(this.state.artieLogin !== newProps.artieLogin){
            this.setState({
                artieLogin: newProps.artieLogin
            });
        }
    }

    //Function to determine the type of popup to show
    popupType(login, exercises){
        if( exercises !== undefined && exercises !== null && exercises.popupExercise){
            return 'exercise';
        }else if(exercises !== undefined && exercises !== null && exercises.popupSolution){
            return 'solution';
        }else if(login !== undefined && login !== null && login.currentStudent !== undefined && login.currentStudent !==null &&
                (login.currentStudent.competence == undefined || login.currentStudent.competence === 0) &&
                (exercises === undefined || exercises === null || exercises.currentExercise === null)){
            return 'initialEvaluation';
        }else if(exercises !== undefined && exercises !== null && exercises.popupEvaluation){
            return 'evaluation';
        }else{
            return null;
        }
    }

    nextExercise(currentExercise, exercises){

        var nextExercise=null;

        //1- If the current exercise is null or undefined, we take the first exercise
        if((currentExercise === undefined || currentExercise === null) && exercises.length > 0){
            //Setting the current exercise
            nextExercise = exercises[0];
        }else{
            var index = exercises.findIndex(exercise => exercise.id === currentExercise.id);

            if(exercises.size > index+1){
                nextExercise = exercises[index + 1];
            }else{
                nextExercise = null;
            }
        }
        return nextExercise;
    }

    handleEvaluationOKClick(){
        const nextExercise = this.nextExercise(this.state.artieExercises.currentExercise, this.state.artieExercises.exercises);

        //Updating the store to set the current exercise
        this.props.setCurrentExercise(nextExercise);

        //Closing this popup and showing the next one
        this.props.onArtiePopupEvaluation(true);
    }

    handleCloseEvaluationPopup(){
        //Closing this popup
        this.props.onArtiePopupEvaluation(false);
    }

    render () {

        var type = this.popupType(this.state.artieLogin, this.state.artieExercises);

        if( type === 'exercise'){
            return exerciseComponent(this.props.onCancel, type);
        }else if(type === 'solution'){
            return solutionComponent(this.props.onCancel, type)
        }else if(type === 'initialEvaluation'){
            var image = require('../../static/ThreeJedi.jpg');
            return evaluationComponent(this.handleEvaluationOKClick, this.handleEvaluationOKClick, type, image, initialEvaluationMessages, null);
        }else if(type == 'evaluation'){

            //Checking if the current exercise is level 0, 1 or 2
            var image = null;
            if(this.state.artieExercises.currentExercise.level === 0){
                image = require('../../static/Padawan.jpg');
                messages = padawanEvaluationMessages;
            }else if(this.state.artieExercises.currentExercise.level === 1){
                image = require('../../static/Jedi.jpg');
                messages = jediEvaluationMessages;
            }else if(this.state.artieExercises.currentExercise.level === 2){
                image = require('../../static/Master.jpg');
                messages = masterJediEvaluationMessages;
            }

            return evaluationComponent(this.handleCloseEvaluationPopup, this.handleCloseEvaluationPopup, type, image,
                                       messages, this.state.artieExercises.currentExercise.description);
        }else{
            return null;
        }
    }
}

ArtieExercisePopup.propTypes = {
    onCancel: PropTypes.func.isRequired,
    artieExercises: PropTypes.object,
    setCurrentExercise: PropTypes.func,
    artieLogin: PropTypes.object,
    onArtiePopupEvaluation: PropTypes.func
}

export default injectIntl(ArtieExercisePopup);
