import fs from 'fs';
import path from 'path';

interface KnowledgeCache {
  [fileName: string]: any;
}

let cachedKnowledge: KnowledgeCache = {};
let isLoaded = false;

export const loadKnowledge = async (): Promise<void> => {
  if (isLoaded) return;

  try {
    const knowledgeDir = path.join(process.cwd(), 'knowledge');
    if (!fs.existsSync(knowledgeDir)) {
      console.warn(`[KnowledgeService] Knowledge directory not found at ${knowledgeDir}`);
      return;
    }

    const files = fs.readdirSync(knowledgeDir);
    console.log(`[KnowledgeService] Found ${files.length} files in knowledge directory.`);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(knowledgeDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        try {
          const parsed = JSON.parse(fileContent);
          cachedKnowledge[file] = parsed;
          console.log(`[KnowledgeService] Loaded: ${file}`);
        } catch (jsonErr: any) {
          console.error(`[KnowledgeService] Error parsing JSON file ${file}:`, jsonErr.message);
        }
      }
    }

    isLoaded = true;
    console.log('[KnowledgeService] All knowledge base files loaded into memory successfully.');
  } catch (error: any) {
    console.error('[KnowledgeService] Failed to load knowledge base:', error.message);
  }
};

export const getKnowledge = (): KnowledgeCache => {
  return cachedKnowledge;
};

export const getKnowledgeFile = (fileName: string): any | null => {
  return cachedKnowledge[fileName] || null;
};
