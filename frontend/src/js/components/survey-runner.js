// frontend/src/js/components/survey-runner.js
class SurveyRunner {
    constructor(survey) {
        this.survey = survey;
        this.responses = {};
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Clear previous content
        const surveyElement = this.survey.render();
        container.appendChild(surveyElement);
    }

    collectResponses() {
        this.responses = this.survey.getResponses();
    }

    displayResults(containerId) {
        const resultsContainer = document.getElementById(containerId);
        resultsContainer.innerHTML = JSON.stringify(this.responses, null, 2);
    }
}

export default SurveyRunner;