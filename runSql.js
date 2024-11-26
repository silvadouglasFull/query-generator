const fs = require('fs');
const sql = require('mssql');
const path = require('path');

// Configurações de conexão com o banco de dados MSSQL
const config = {
    user: 'usr_sgi',
    password: 'ea#hqXXx73^hF$xX9iomTX',
    server: '10.199.114.73',
    database: 'DB_SISF',
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
 * Reads a  file and returns its content as a string.
 *
 * @param {string} filePath - The path to the  file.
 * @returns {Promise<string>} - A promise that resolves with the content of the  file.
 */
const readFile = async (filePath) => {
    try {
        // Resolve the file path to ensure it's absolute
        const absolutePath = path.resolve(filePath);

        // Read the file content
        const Content = await fs.promises.readFile(absolutePath, 'utf-8');

        return Content;
    } catch (error) {
        console.error('Error reading  file:', error);
        return '';
    }
}
const runQuery = async (query) => {
    try {
        const result = await sql.query(query)
        return result.recordset
    } catch (error) {
        console.log('erro read', error)
    }
}

const combineJsonFiles = async () => {
    try {
        const files = await getFilesFromDirectory('./json')
        files.filter(item => item !== 'query_to_photos.json').forEach(async item => {
            const content = await readFile(`json/${item}`)
            const jsonParse = JSON.parse(con)
        })
    } catch (error) {
      console.error('Error combining JSON files:', error);
    }
  };
let i = 0
const run = async () => {
    try {
        await sql.connect(config);

        const sqlFilesPath = await getFilesFromDirectory('./querys')
        sqlFilesPath.forEach(async sqlFilePath => {
            const sqlContent = await readFile(`querys/${sqlFilePath}`);
            if (!sqlContent) {
                throw new Error('Erro ao processar o sqlContent')
            }
            const content = await runQuery(String(sqlContent))
            fs.writeFile(`json/result_${i}.json`, JSON.stringify(content), err => {
                console.log(err)
            })
            i = i + 1
        })
       
        console.log('done')
    } catch (error) {
        console.log('run', error)
    }
}
combineJsonFiles('json','json/FISCALIZACAO_VIAOESTE')