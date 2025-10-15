import React from 'react';
import { SurveyCreatorComponent } from 'survey-creator-react';
import { SurveyCreatorModel } from 'survey-creator-core';
import 'survey-creator-core/survey-creator-core.min.css';

// Opsi untuk kustomisasi creator
const creatorOptions = {
  showLogicTab: true,    // Menampilkan tab "Logic" untuk formulir dinamis
  showTranslationTab: true, // Opsional: untuk formulir multi-bahasa
  isAutoSave: false // Kita akan menangani penyimpanan secara manual
};

function FormBuilderPage() {
  // **PERBAIKAN**: Import SurveyCreatorModel dari 'survey-creator-core'
  const creator = new SurveyCreatorModel(creatorOptions);

  // **BAGIAN TERPENTING**: Fungsi ini akan menangani apa yang terjadi
  // saat Anda menekan tombol "Save survey" di dalam editor.
  creator.saveSurveyFunc = (saveNo, callback) => {
    // 1. Mengambil hasil desain formulir dalam format JSON.
    const surveyJson = creator.text;
    
    // 2. Simpan ke localStorage (dalam aplikasi nyata, kirim ke backend)
    localStorage.setItem("my-survey-json", surveyJson);
    
    console.log("Survey saved:", surveyJson);
    
    // 3. Callback untuk memberitahu creator bahwa save berhasil
    callback(saveNo, true);
    
    alert("Survey berhasil disimpan!");
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
}

export default FormBuilderPage;