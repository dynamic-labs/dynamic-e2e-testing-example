import fs from 'fs';
import https from 'https';

export const downloadFile = (url: string, destination: string) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    https
      .get(url, (response) => {
        if (
          response.statusCode! >= 300 &&
          response.statusCode! < 400 &&
          response.headers.location
        ) {
          // redirect
          downloadFile(response.headers.location, destination)
            .then(resolve)
            .catch(reject);
        } else {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(undefined);
          });
        }
      })
      .on('error', (err) => {
        // Handle errors
        fs.unlink(destination, (err) => {
          // Delete the file async. (But we don't check the result)
          if (err) throw err;
          console.log(`${destination} was deleted`);
        });
        reject(err.message);
      });
  });
};
