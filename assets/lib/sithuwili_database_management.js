import fs from 'fs';
import { MongoClient } from 'mongodb';


global.filePath = 'sithuwili.json';
global.contentdb = 'contentdb.json';
global.user_cache = []
global.mongodb_url = 'mongodb+srv://bravindudilshan:5Pfle3O71cK3pEDM@cluster0.qrphyqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
global.database = "Sithuwili_data";
global.collection = "Sithuwili_data";

/**
 * Read data from a file asynchronously
 * @param {string} filePath - The path of the file to read
 * @returns {Promise} - A promise that resolves with the parsed JSON data, or rejects with an error
 */
export async function read_data() {
    return new Promise((resolve, reject) => {
        fs.readFile(global.filePath, 'utf8', (err, data) => { 
            if (err) { 
                emergency_database()
                reject("There may be a database error. I am trying to solve it by connecting to my cloud, please try again later "); 
            } else { 
                try {
                    const jsonData = JSON.parse(data); 
                    resolve(jsonData); 
                } catch (error) {
                    reject(error); 
                }
            }
        }); 
    }); 
} 

/**
 * Get information about a user
 * @param {number|string} user_id - The ID of the user to get information about
 * @returns {Promise<object>} - Resolves to an object containing information about the user, or an object with a single property 'exists' set to false if the user was not found
 */
export async function user_report(user_id) {
    return new Promise((resolve, reject) => {
        read_data()
            .then(jsonData => {
                //console.log(jsonData)
                const user = jsonData.find(user => user.user_id === user_id); 
                //console.log(user)

                if (user) { 
                    const data = {
                        exists: true,
                        is_team_member: user.is_team_member,
                        user_no: user.user_no,
                        id: user.user_id,
                        role: user.role,
                        username: user.username,
                        name:user.name,
                        age:user.age,
                        bio: user.bio,
                        contact: user.contact,
                        last_seen: user.last_seen,
                        joined: user.joined,
                        status: user.status,
                        react: user.react,
                        is_writer: user.is_writer,
                        is_banned: user.is_banned,
                        banned_reason: user.banned_reason,
                        content_count: user.content_count,
                        sent_content_id: user.sent_content_id
                    };

                    resolve(data); 
                    global.user_cache.push(data); 
                } else {
                    resolve({ exists: false }); 
                }
            })
            .catch(error => reject(error)); 
    });
}

export async function user_report_by_user_no(user_no) {
    return new Promise((resolve, reject) => {
        read_data()
            .then(jsonData => {
                //console.log(jsonData)
                const user = jsonData.find(user => user.user_no === user_no); 
                //console.log(user)

                if (user) { 
                    const data = {
                        exists: true,
                        is_team_member: user.is_team_member,
                        user_no: user.user_no,
                        id: user.user_id,
                        role: user.role,
                        username: user.username,
                        name:user.name,
                        age:user.age,
                        bio: user.bio,
                        contact: user.contact,
                        last_seen: user.last_seen,
                        joined: user.joined,
                        status: user.status,
                        react: user.react,
                        is_writer: user.is_writer,
                        is_banned: user.is_banned,
                        banned_reason: user.banned_reason,
                        content_count: user.content_count,
                        sent_content_id: user.sent_content_id
                    };

                    resolve(data); 
                    global.user_cache.push(data); 
                } else {
                    resolve({ exists: false }); 
                }
            })
            .catch(error => reject(error)); 
    });
}



/**
 * Write data to a file asynchronously
 * @param {object} new_user - The new data to write to the file
 * @returns {Promise} - Resolves when the data has been written to the file, or rejects with an error
 */
export async function write_data(new_user) {
        try {
            const jsonData = await read_data();
            const user = jsonData.find(user => user.user_id === parseInt(new_user.user_id));
            
            if (user) {
                return { exists: true , message: 'User already exists' }; 
            } else {
                const existingData = await read_data();
                await mongodb_upload(new_user);
                existingData.push(new_user);
                const updatedData = JSON.stringify(existingData, null, 2);
                
                fs.writeFile(global.filePath, updatedData, 'utf8', (err) => {
                    if (err) {
                        console.error(`Error writing to : ${global.filePath}`, err);
                    } else {
                        console.log(`Data has been written to : ${global.filePath}`);
                    }
                });
            }
        } catch (error) {
            console.error('Error:', error);
    }
    
}

/**
 * Ban a user
 * @param {number} ban_user_id - The user's user_id
 * @param {string} user_banned_reason - The reason for the ban
 * @returns {string} - Returns a message if the user is not found
 */
export async function user_ban(ban_user_id,user_banned_reason) {
    const jsonData = JSON.parse(fs.readFileSync(global.filePath, 'utf8'));
    const user = jsonData.findIndex(user => user.user_id === ban_user_id);

    if (user !== -1) {
        const user_ban_data = {
            is_banned: true,
            banned_reason: user_banned_reason
        }
        await mongo_data_update(ban_user_id, user_ban_data);
        jsonData[user].banned_reason = user_banned_reason;
        jsonData[user].is_banned = true;
        fs.writeFileSync(global.filePath, JSON.stringify(jsonData, null, 2));
    } else {
        return `User with user_id not found.`
    }
}

export async function user_unban(ban_user_id) {
    const jsonData = JSON.parse(fs.readFileSync(global.filePath, 'utf8'));
    const user = jsonData.findIndex(user => user.user_id === ban_user_id);

    if (user !== -1) {
        const user_ban_data = {
            is_banned: false,
            banned_reason: ''
        }
        await mongo_data_update(ban_user_id, user_ban_data);
        jsonData[user].banned_reason = '';
        jsonData[user].is_banned = false;
        fs.writeFileSync(global.filePath, JSON.stringify(jsonData, null, 2));
    } else {
        return `User with user_id not found.`
    }
}



export async function database_update(user_id,content_count,massage_id) {

    const jsonData = JSON.parse(fs.readFileSync(global.filePath, 'utf8'));
    const user = jsonData.findIndex(user => user.user_id === user_id);
    jsonData[user].sent_content_id = massage_id;
    jsonData[user].content_count = content_count;
    fs.writeFileSync(global.filePath, JSON.stringify(jsonData, null, 2));
    
}


export async function user_data_update(user_no,user_data) {

    const jsonData = JSON.parse(fs.readFileSync(global.filePath, 'utf8'));
    const user = jsonData.findIndex(user => user.user_no === user_no);
    jsonData[user].name = user_data.name;
    jsonData[user].age = user_data.age;
    jsonData[user].bio = user_data.bio;
    jsonData[user].contact = user_data.contact;
    jsonData[user].is_writer = true;
    fs.writeFileSync(global.filePath, JSON.stringify(jsonData, null, 2));
    
}




/**
 * Update a user's data in MongoDB
 * @param {number} user_id - The user's user_id
 * @param {object} Data - The data to update
 * */
export async function mongo_data_update(user_id,Data) {
    const uri = global.mongodb_url;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db(global.database);
        const collection = database.collection(global.collection);
        const result = await collection.updateOne(
            { user_id: user_id },
            { $set: Data} 
        );
        return `updated`;
    } finally {
        await client.close();
    }
    
}


/**
 * Upload data to MongoDB
 * @param {object} data - The data to upload to MongoDB
 * @returns {Promise} - Resolves when the data has been uploaded to MongoDB, or rejects with an error
 */
export async function mongodb_upload(data) {
    const uri = global.mongodb_url;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db(global.database);
        const collection = database.collection(global.collection);
        const result = await collection.insertOne(data);

    } catch (error) {
        console.error(`Error uploading data to MongoDB: ${error}`);
    } finally {
        await client.close();
    }
}


/**
 * Download all data from MongoDB and write it to a file
 * @returns {Promise} - Resolves when the data has been written to the file, or rejects with an error
 */
export async function emergency_database() {
    const mongo_data = [];
    const uri = global.mongodb_url;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(global.database);
        const collection = database.collection(global.collection);
        const cursor = await collection.find();
        await cursor.forEach(doc => {
            mongo_data.push(doc);
        });
    } finally {
        await client.close();
        try {
            const data_bucket = JSON.stringify(mongo_data, null, 2);
            fs.writeFile(global.filePath, data_bucket, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing to : ${global.filePath}`, err); 
                } else {
                    console.log(`Data has been written to : ${global.filePath}`); 
                }
            });
        } catch (error) {
            console.error('Error:', error); 
        }
    }
}

export async function content_data_write(ox_data) {
    const ox_data_str = JSON.stringify(ox_data);

    fs.readFile(global.contentdb, 'utf8', (err, data) => { 
        if (err) { 
            fs.writeFile(global.contentdb, ox_data_str, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing to : ${global.filePath}`, err);
                } else {
                    console.log(`Data has been written to : ${global.filePath}`);
                }
            });
            console.error(`Error reading from : ${global.contentdb}`, err);
        } else { 
            try {
                if (data) {
                const jsonData = JSON.parse(data);
                jsonData.push(ox_data);

                const updated_data = JSON.stringify(jsonData, null, 2);

                fs.writeFile(global.contentdb, updated_data, 'utf8', (err) => {
                    if (err) {
                        console.error(`Error writing to : ${global.contentdb}`, err);
                    } else {
                        console.log(`Data has been written to : ${global.contentdb}`);
                    }
                });
                }
                
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });
}



export async function simple_manage (user_id,content,massage_id) {
    
    const user_reports = await user_report(user_id);
    const user =  user_reports.exists
    if (user) {
        const connect_index = user_reports.content_count + 1;
        const sent_content_id_ud =user_reports.sent_content_id +','+ massage_id;

        const mongo_data = {
        sent_content_id : sent_content_id_ud,
        }

        const data = {
        user_id: user_id,
        is_appured: false,
        massage_id: massage_id,
        content: content
        }
        database_update(user_id,connect_index,sent_content_id_ud)
        content_data_write(data);
       await mongo_data_update(user_id,mongo_data) 
    } else {
        return "user not found"

    }

}