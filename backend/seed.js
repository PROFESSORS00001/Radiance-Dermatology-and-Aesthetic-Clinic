const db = require('./src/firebase');

async function seedData() {
  try {
    console.log("Starting DB seeding...");
    const now = new Date();
    const M_MS = 30 * 24 * 60 * 60 * 1000;
    
    // Seed Patients
    const patIds = [];
    for (let i = 0; i < 15; i++) {
      const d = new Date(now.getTime() - (Math.random() * 5 * M_MS)); // past 5 months
      const p = await db.collection('patients').add({
        name: `Test Patient ${i}`,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        created_at: d.toISOString()
      });
      patIds.push(p.id);
    }
    console.log(`Seeded ${patIds.length} patients.`);
    
    // Seed Consultations
    const diagnoses = ['Acne Vulgaris', 'Atopic Dermatitis', 'Acne Vulgaris', 'Psoriasis', 'Acne Vulgaris', 'Atopic Dermatitis', 'Melasma'];
    const consultIds = [];
    for (let i = 0; i < diagnoses.length; i++) {
      const d = new Date(now.getTime() - (Math.random() * 4 * M_MS));
      const c = await db.collection('consultations').add({
        patient_id: patIds[i % patIds.length],
        working_diagnosis: diagnoses[i],
        created_at: d.toISOString()
      });
      consultIds.push(c.id);
    }
    console.log(`Seeded ${consultIds.length} consultations.`);
    
    // Seed Billing
    for (let i = 0; i < 20; i++) {
      const d = new Date(now.getTime() - (Math.random() * 5 * M_MS));
      await db.collection('billing').add({
        patient_id: patIds[i % patIds.length],
        consultation_id: consultIds[i % consultIds.length],
        total_amount: Math.floor(Math.random() * 500000) + 150000,
        status: 'Paid',
        created_at: d.toISOString()
      });
    }
    console.log("Seeded 20 billing records.");
    
    console.log("Seeding complete!");
  } catch (err) {
    console.error("Seeding Error:", err);
  }
}

seedData();
