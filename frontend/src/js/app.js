// frontend/src/js/app.js
import { SurveyCreator } from './components/survey-creator';
import { SurveyRunner } from './components/survey-runner';
import surveyData from '../data/sample-survey.json';

document.addEventListener('DOMContentLoaded', () => {
    const creator = new SurveyCreator('surveyCreatorContainer');
    const runner = new SurveyRunner('surveyRunnerContainer');

    // Load the sample survey data into the creator
    creator.loadSurvey(surveyData);

    // Set up event listeners for the creator and runner
    document.getElementById('saveSurveyButton').addEventListener('click', () => {
        const surveyJson = creator.saveSurvey();
        console.log('Survey saved:', surveyJson);
    });

    document.getElementById('runSurveyButton').addEventListener('click', () => {
        const surveyJson = creator.saveSurvey();
        runner.runSurvey(surveyJson);
    });
});