const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = { users: [], transactions: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const db = {
  getUsers: () => loadDB().users,
  getTransactions: () => loadDB().transactions,

  findUserByEmail: (email) => loadDB().users.find(u => u.email === email.toLowerCase()),
  findUserById: (id) => loadDB().users.find(u => u.id === id),

  createUser: (user) => {
    const data = loadDB();
    data.users.push(user);
    saveDB(data);
    return user;
  },

  updateUser: (id, updates) => {
    const data = loadDB();
    const idx = data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    data.users[idx] = { ...data.users[idx], ...updates };
    saveDB(data);
    return data.users[idx];
  },

  createTransaction: (tx) => {
    const data = loadDB();
    data.transactions.push(tx);
    saveDB(data);
    return tx;
  },

  findTransactionByUTR: (utr) => loadDB().transactions.find(t => t.utr === utr),
  getUserTransactions: (userId) => loadDB().transactions.filter(t => t.userId === userId),
};

module.exports = db;
