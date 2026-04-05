import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'capacitor-www');

const include = [
  'index.html',
  'manifest.json',
  'service_worker.js',
  'icon-192.png',
  'icon-512.png',
  'icon.png',
  'relatorio.png',
  'AJUDA.png',
  'carro_frente_nobg.png',
  'carro_tras_nobg.png',
  'carro_esquerda_nobg.png',
  'carro_direita_nobg.png',
  'frente.png',
  'traseira.png',
  'lateral esquerda.png',
  'lateral direita.png',
  'splash.jpeg',
  'css',
  'js',
  'img',
  'icon'
];

function rmrf(target) {
  fs.rmSync(target, { recursive: true, force: true });
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

rmrf(outDir);
fs.mkdirSync(outDir, { recursive: true });

for (const entry of include) {
  const src = path.join(root, entry);
  if (!fs.existsSync(src)) {
    throw new Error(`Asset ausente: ${entry}`);
  }
  copyRecursive(src, path.join(outDir, entry));
}

console.log(`Web assets preparados em ${outDir}`);
