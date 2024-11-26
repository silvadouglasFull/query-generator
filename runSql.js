const fs = require('fs');
const sql = require('mssql');
const path = require('path');

// Configurações de conexão com o banco de dados MSSQL
const config = {
    user: 'usr_sgi',
    password: 'ea#hqXXx73^hF$xX9iomTX',
    server: '10.199.114.73',
    database: 'master',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};
/**
 * Retrieves a list of all files in a specified directory.
 *
 * @param {string} directoryPath - The path of the directory to list files from.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of file names.
 *
 * @example
 * getFilesFromDirectory('./querys')
 *   .then(files => console.log('Files:', files))
 *   .catch(error => console.error('Error:', error));
 */
const getFilesFromDirectory = (directoryPath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return reject(`Unable to scan directory: ${err}`);
            }

            // Filter out directories, returning only files
            const fileList = files.filter(file => {
                const fullPath = path.join(directoryPath, file);
                return fs.statSync(fullPath).isFile();
            });

            resolve(fileList);
        });
    });
};


const run = async () => {
    await sql.connect(config);
    const getQuerys = await getFilesFromDirectory('./querys')
    const result = await sql.query`
        USE DB_SISF;

        `
    console.log(getQuerys)
}
run()