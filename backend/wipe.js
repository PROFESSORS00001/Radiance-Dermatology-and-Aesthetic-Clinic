const db = require('./src/firebase');

async function wipeMockData() {
  const collections = ['patients', 'consultations', 'billing'];
  for (let c of collections) {
    const snap = await db.collection(c).get();
    const deletePromises = snap.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`Deleted ${snap.size} documents from ${c}`);
  }
  console.log('Mock data deleted successfully!');
}

wipeMockData();
