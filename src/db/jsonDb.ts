import fs from "fs";
import path from "path";

function loadJson(file: string) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    return Array.isArray(file) ? [] : {};
  }
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function saveJson(file: string, data: any) {
  const filePath = path.join(__dirname, file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// 🔑 Tenants DB
export const tenants = {
  getAll: () => loadJson("tenants.json"),
  get: (apiKey: string) => {
    const all = loadJson("tenants.json");
    return all[apiKey];
  },
  updateUsage: (apiKey: string, usedWords: number) => {
    const all = loadJson("tenants.json");
    if (!all[apiKey]) return null;
    all[apiKey].usedWords = usedWords;
    saveJson("tenants.json", all);
    return all[apiKey];
  },
};

// 📋 Plans DB
export const plans = {
  getAll: () => loadJson("plans.json"),
  get: (planName: string) => {
    const all = loadJson("plans.json");
    return all[planName];
  },
};

// 📝 Estimates DB (audit log)
export const estimates = {
  getAll: () => loadJson("estimates.json") || [],
  add: (data: any) => {
    const list = loadJson("estimates.json") || [];
    list.push({ ...data, createdAt: new Date().toISOString() });
    saveJson("estimates.json", list);
    return data;
  },
};
