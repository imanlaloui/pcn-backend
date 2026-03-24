const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Firebase setup
const admin = require('firebase-admin');

const serviceAccount = {
  projectId: "pcn-5d106"
};

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: "pcn-5d106"
});

const db = admin.firestore();

// 👉 Save ticket
app.post('/upload', async (req, res) => {
  const { reg, amount } = req.body;

  await db.collection('tickets').add({
    reg,
    amount,
    createdAt: new Date()
  });

  res.send({ success: true });
});

// 👉 Get tickets
app.get('/tickets', async (req, res) => {
  const snapshot = await db.collection('tickets').get();

  const data = snapshot.docs.map(doc => doc.data());
  res.send(data);
});

app.listen(3000, () => console.log("Server running on port 3000"));
app.get('/add-test', async (req, res) => {
  try {
    const docRef = await db.collection('tickets').add({
      reg: 'TEST123',
      amount: 100,
      status: 'unpaid',
      createdAt: new Date()
    });

    res.send(`Test ticket added with ID: ${docRef.id}`);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding test ticket');
  }
});