const db = require('./firebase');

async function resolvePatientAndDoctorNames(docs, patientIdField = 'patient_id', doctorIdField = 'doctor_id') {
  if (!docs || docs.length === 0) return [];

  // Extract unique IDs, filtering out null/undefined/empty
  const patientIds = patientIdField 
    ? [...new Set(docs.map(d => String(d[patientIdField])).filter(id => id && id !== 'null' && id !== 'undefined' && id.trim() !== ''))]
    : [];
    
  const doctorIds = doctorIdField 
    ? [...new Set(docs.map(d => String(d[doctorIdField])).filter(id => id && id !== 'null' && id !== 'undefined' && id.trim() !== ''))]
    : [];

  // Fetch only the referenced patient and doctor documents in parallel
  const [patientsDocs, usersDocs] = await Promise.all([
    patientIds.length > 0 ? Promise.all(patientIds.map(id => db.collection('patients').doc(id).get())) : Promise.resolve([]),
    doctorIds.length > 0 ? Promise.all(doctorIds.map(id => db.collection('users').doc(id).get())) : Promise.resolve([])
  ]);

  // Build key-value maps
  const patientMap = {};
  patientsDocs.forEach(doc => {
    if (doc.exists) {
      patientMap[doc.id] = doc.data().name || 'Unknown Patient';
    }
  });

  const userMap = {};
  usersDocs.forEach(doc => {
    if (doc.exists) {
      userMap[doc.id] = doc.data().name || 'Unknown Doctor';
    }
  });

  // Attach resolved names to the items
  return docs.map(d => {
    const pId = patientIdField ? String(d[patientIdField]) : null;
    const dId = doctorIdField ? String(d[doctorIdField]) : null;
    return {
      ...d,
      patient_name: pId ? (patientMap[pId] || 'Unknown Patient') : 'Unknown Patient',
      doctor_name: dId ? (userMap[dId] || 'Unknown Doctor') : 'Any'
    };
  });
}

module.exports = {
  resolvePatientAndDoctorNames
};
