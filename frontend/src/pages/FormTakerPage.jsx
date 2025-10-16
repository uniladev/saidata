import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.css'; // Impor tema default untuk tampilan

function FormTakerPage() {
  // 1. Ambil kembali JSON yang sudah kita simpan dari localStorage.
  // DALAM APLIKASI NYATA, Anda akan fetch JSON ini dari API backend.
  const storedJson = localStorage.getItem("my-survey-json");
  const surveyJson = storedJson ? JSON.parse(storedJson) : {};

  // 2. Buat "model" survei dari struktur JSON
  const survey = new Model(surveyJson);

  // **BAGIAN TERPENTING**: Fungsi ini akan menangani data jawaban
  // saat pengguna menekan tombol "Complete" (atau "Selesai").
  survey.onComplete.add((sender, options) => {
    const userAnswers = sender.data;
    console.log("JSON Jawaban Pengguna:", userAnswers);
    
    // Di sini Anda akan mengirim `userAnswers` (jawaban) ke backend
    // untuk disimpan di tabel `form_submissions`.
    alert("Terima kasih! Jawaban Anda telah direkam (lihat di console).");
  });

  // Jika tidak ada survei yang tersimpan, tampilkan pesan.
  if (!storedJson) {
    return <h1>Tidak ada formulir yang ditemukan. Silakan buat satu terlebih dahulu di halaman builder.</h1>;
  }

  // 3. Render komponen Survey dengan model yang sudah dibuat
  return (
    <div className="survey-container">
      <h1>Silakan Isi Formulir Ini</h1>
      <Survey model={survey} />
    </div>
  );
}

export default FormTakerPage;