import React from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';

const SurveyTest = () => {
  // Contoh survey sederhana untuk testing
  const surveyJson = {
    title: "Test Survey SAI Data",
    pages: [{
      name: "page1",
      elements: [{
        type: "text",
        name: "name",
        title: "Nama Anda:",
        isRequired: true
      }, {
        type: "radiogroup",
        name: "satisfaction",
        title: "Tingkat kepuasan:",
        choices: [
          "Sangat Puas",
          "Puas", 
          "Cukup",
          "Tidak Puas"
        ],
        isRequired: true
      }, {
        type: "comment",
        name: "feedback",
        title: "Saran dan masukan:"
      }]
    }]
  };

  const survey = new Model(surveyJson);

  // Handler ketika survey selesai
  survey.onComplete.add((result) => {
    console.log("Survey completed:", result.data);
    alert("Survey selesai! Cek console untuk melihat data.");
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Test SurveyJS</h2>
      <Survey model={survey} />
    </div>
  );
};

export default SurveyTest;