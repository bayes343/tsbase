import fs from 'fs';

(() => {
  const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      if (fs.statSync(dirPath + '/' + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
      } else {
        arrayOfFiles.push(`${dirPath}/${file}`);
      }
    });

    return arrayOfFiles;
  };

  const docsFiles = getAllFiles('./docs');

  for (const filePath of docsFiles) {
    if (filePath.endsWith('.html')) {
      const scriptToAdd = `<script src="${filePath.split('/').length > 3 ? '../' : './'}playground.js"></script>`;
      const contents = fs.readFileSync(filePath).toString();
      fs.writeFileSync(filePath, contents.replace('</body>', `${scriptToAdd}</body>`));
    }
  }
})();
