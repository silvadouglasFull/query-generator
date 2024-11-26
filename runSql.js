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

/**
 * Reads a SQL file and returns its content as a string.
 *
 * @param {string} filePath - The path to the SQL file.
 * @returns {Promise<string>} - A promise that resolves with the content of the SQL file.
 */
const readSQLFile = async (filePath) => {
    try {
        // Resolve the file path to ensure it's absolute
        const absolutePath = path.resolve(filePath);

        // Read the file content
        const sqlContent = await fs.promises.readFile(absolutePath, 'utf-8');

        return sqlContent;
    } catch (error) {
        console.error('Error reading SQL file:', error);
        throw error;
    }
}
const runQuery = async (query) => {
    try {
        const result = await sql.query`
            USE DB_SISF;
                ${query}
           `
        console.log('done')
        return result.recordset
    } catch (error) {
        console.log(error)
    }
}
let i = 0
const run = async () => {
    await sql.connect(config);
    const sqlFilesPath = await getFilesFromDirectory('./querys')
    sqlFilesPath.forEach(async sqlFilePath => {
        const sqlContent = await readSQLFile(sqlFilePath);
        const content = await runQuery(sqlContent)
        fs.writeFile(`json/result_${i}.json`, JSON.stringify(content), err => {
            if (err) {
                console.error(err);
            } else {
                console.log('done')
            }
        })
    })
}
run()