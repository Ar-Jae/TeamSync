/**
 * Run this script with: node infra/migrations/backfill-tasks.js
 * It will normalize `labels` (to array) and `dueDate` (to Date or null) for all tasks.
 */
const mongoose = require('mongoose');
const Task = require('../../src/models/Task');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/teamsync';

async function run() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to', MONGO);
  const tasks = await Task.find({});
  console.log(`Found ${tasks.length} tasks`);
  let changed = 0;
  for (const t of tasks) {
    let modified = false;
    if (t.labels && !Array.isArray(t.labels)) {
      t.labels = String(t.labels).split(',').map(s => s.trim()).filter(Boolean);
      modified = true;
    }
    if (t.dueDate && !(t.dueDate instanceof Date)) {
      const d = new Date(t.dueDate);
      if (!Number.isNaN(d.getTime())) {
        t.dueDate = d;
        modified = true;
      } else {
        t.dueDate = null;
        modified = true;
      }
    }
    if (modified) {
      await t.save();
      changed++;
    }
  }
  console.log(`Updated ${changed} tasks`);
  await mongoose.disconnect();
  console.log('Done');
}

run().catch(err => { console.error(err); process.exit(1); });
