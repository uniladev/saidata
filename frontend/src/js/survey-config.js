// frontend/src/js/survey-config.js
const surveyConfig = {
    title: "Customer Satisfaction Survey",
    description: "We value your feedback. Please take a moment to fill out this survey.",
    pages: [
        {
            name: "page1",
            elements: [
                {
                    type: "radiogroup",
                    name: "satisfaction",
                    title: "How satisfied are you with our service?",
                    choices: [
                        "Very satisfied",
                        "Satisfied",
                        "Neutral",
                        "Dissatisfied",
                        "Very dissatisfied"
                    ]
                },
                {
                    type: "comment",
                    name: "improvements",
                    title: "What can we do to improve?"
                }
            ]
        },
        {
            name: "page2",
            elements: [
                {
                    type: "checkbox",
                    name: "features",
                    title: "Which features do you use?",
                    choices: [
                        "Feature A",
                        "Feature B",
                        "Feature C",
                        "Feature D"
                    ]
                },
                {
                    type: "text",
                    name: "email",
                    title: "Your email (optional)",
                    inputType: "email"
                }
            ]
        }
    ],
    showQuestionNumbers: "off",
    completedHtml: "<h4>Thank you for your feedback!</h4>"
};

export default surveyConfig;