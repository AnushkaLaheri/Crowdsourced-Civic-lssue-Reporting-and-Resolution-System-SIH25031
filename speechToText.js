const { exec } = require('child_process');
const path = require('path');

async function speechToText(audioPath) {
  return new Promise((resolve, reject) => {
    const script = path.join(__dirname, "whisper.py");
    exec(`python ${script} "${audioPath}"`, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve(stdout.trim());
    });
  });
}

module.exports = { speechToText };
