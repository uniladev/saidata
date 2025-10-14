// frontend/src/js/components/survey-creator.js
class SurveyCreator {
    constructor(surveyJson) {
        this.surveyJson = surveyJson;
        this.survey = null;
    }

    createSurvey() {
        // Initialize the survey using SurveyJS library
        this.survey = new Survey.Model(this.surveyJson);
    }

    addQuestion(question) {
        // Add a question to the survey
        this.survey.addNewQuestion(question);
    }

    getSurvey() {
        // Return the current survey instance
        return this.survey;
    }

    renderSurvey(containerId) {
        // Render the survey in the specified container
        Survey.SurveyNG.render(this.survey, containerId);
    }
}

export default SurveyCreator;