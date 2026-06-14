/* eslint-disable */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Load Environment Variables from .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value.trim();
      }
    });
    console.log("✅ Variables d'environnement chargées de .env.local");
  } else {
    console.error("❌ Fichier .env.local introuvable !");
    process.exit(1);
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key if available, otherwise fallback to anon key (assumes RLS is temporarily disabled)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Identifiants Supabase manquants dans process.env !");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log("🚀 Lancement de la migration vers Supabase depuis le dossier frontend...");

  const dataDir = path.join(__dirname, 'src', 'data');

  // Helper to read JSON safely
  const readJSON = (fileName) => {
    const filePath = path.join(dataDir, `${fileName}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Fichier ${fileName}.json introuvable, passé.`);
      return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  };

  // Helper to upload with status log
  const uploadData = async (tableName, data) => {
    if (!data || data.length === 0) return;
    
    console.log(`⏳ Vidage de la table '${tableName}'...`);
    const deleteQuery = supabase.from(tableName).delete();
    const { error: deleteError } = ['timeline', 'documents_files'].includes(tableName)
      ? await deleteQuery.gte('id', 0)
      : await deleteQuery.neq('id', '_delete_all_');
    
    if (deleteError) {
      console.warn(`⚠️ Avertissement lors du vidage de '${tableName}':`, deleteError.message);
    }

    console.log(`⏳ Upload de ${data.length} entrées dans la table '${tableName}'...`);
    const { error } = await supabase.from(tableName).insert(data);
    if (error) {
      console.error(`❌ Erreur lors de l'upload dans '${tableName}' :`, error.message);
    } else {
      console.log(`✅ Table '${tableName}' migrée avec succès !`);
    }
  };

  // 1. Timeline
  const timelineData = readJSON('timeline');
  if (timelineData) {
    const mapped = timelineData.map((item, index) => ({
      id: index + 1,
      ...item
    }));
    await uploadData('timeline', mapped);
  }

  // 2. Actualités (map readTime -> read_time)
  const actualitesData = readJSON('actualites');
  if (actualitesData) {
    const mapped = actualitesData.map(item => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      content: item.content,
      date: item.date,
      read_time: item.readTime,
      category: item.category,
      image: item.image,
      author: item.author
    }));
    await uploadData('actualites', mapped);
  }

  // 3. Quizzes (map answer -> correct_answer)
  const quizzesData = readJSON('quizzes');
  if (quizzesData) {
    const mapped = quizzesData.map(item => ({
      id: String(item.id),
      question: item.question,
      options: item.options,
      correct_answer: item.answer,
      explanation: item.explanation,
      category: item.category,
      difficulty: item.difficulty
    }));
    await uploadData('quizzes', mapped);
  }

  // 4. Realizations
  const realizationsData = readJSON('realizations');
  await uploadData('realizations', realizationsData);

  // 5. Documents (RAG)
  const documentsData = readJSON('documents');
  await uploadData('documents', documentsData);

  // 6. Videos (map youtubeId -> youtube_id)
  const videosData = readJSON('videos');
  if (videosData) {
    const mapped = videosData.map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      youtube_id: item.youtubeId,
      duration: item.duration,
      date: item.date
    }));
    await uploadData('videos', mapped);
  }

  // 7. Documents Files
  const docsFilesData = readJSON('documents_files');
  if (docsFilesData) {
    const mapped = docsFilesData.map((item, index) => ({
      id: index + 1,
      ...item
    }));
    await uploadData('documents_files', mapped);
  }

  // 8. Scenarios
  const scenariosData = readJSON('scenarios');
  await uploadData('scenarios', scenariosData);

  console.log("🎉 Migration terminée !");
}

runMigration().catch(err => {
  console.error("❌ Erreur critique lors de la migration :", err);
});
