const { app, BrowserWindow , ipcMain} = require('electron')
const path = require('path');
const fs = require('fs'); 
 const jwt = require('jsonwebtoken');
 const bcrypt = require('bcryptjs');
 const sqlite3 = require('sqlite3').verbose();

 const dbPath = path.join(__dirname, 'Myvuedatbase.db');
let db = new sqlite3.Database(dbPath);
console.log('__dirname:', __dirname);
console.log('dbPath:', dbPath);

try {
  fs.accessSync(dbPath, fs.constants.R_OK | fs.constants.W_OK);
  db = new sqlite3.Database(dbPath);
} catch (err) {
  console.error('Error accessing database file:', err.message);
}
global.sharedDb = db;

db.serialize(() => {
db.run(`
  CREATE TABLE IF NOT EXISTS newusers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT,
    email TEXT,
    password TEXT,
    token TEXT
  )
`, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Table "newusers" created');
  }
});

const insertUserDetails = (details) => {
  return new Promise((resolve, reject) => {
      const token = jwt.sign({ email: details.email }, 'you', { expiresIn: '1h' });
      db.run(
          'INSERT INTO newusers (fullName, email, password, token) VALUES (?, ?, ?, ?)',
          [details.fullName, details.email, details.password, token],
          (err) => {
              if (err) {
                  reject(err.message);
              } else {
                  resolve('User details inserted successfully');
              }
          }
      );
  });
};
});

  const checkUserCredentials = (email, password) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT COUNT(*) as count FROM newusers WHERE email = ? AND password = ?',
        [email, password],
        (err, row) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(row.count > 0); 
          }
        }
      );
    });
  };
  ipcMain.handle('checkUserCredentials', async (event, details) => {
    try {
      const user = await getUserByEmail(details.email);
      
      if (user && bcrypt.compareSync(details.password, user.password)) {
        return { isValid: true };
      } else {
        return { isValid: false };
      }
    } catch (error) {
      throw new Error(error);
    }
  });
  

  ipcMain.handle('saveUserDetails', async (event, details, token) => {
    try {
      const response = await insertUserDetails(details, token);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  });
  ipcMain.handle('getUserToken', async (event, userDetails) => {
    try {
      const user = await getUserByEmail(userDetails.email);
      
      if (user) {
        return { success: true, token: user.token };
      } else {
        return { success: false, message: 'User not found' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to fetch user token' };
    }
  });
  
  
  


  db.run(`
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    address TEXT,
    phoneNumber TEXT,
    email TEXT
  )
`, (err) => {
  if (err) {
    console.error('Error creating "patients" table:', err.message);
  } else {
    console.log('Table "patients" created');
  }
});
const insertPatientDetails = (details) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO patients (name, address, phoneNumber, email) VALUES (?, ?, ?, ?)',
      [details.name, details.address, details.phoneNumber, details.email],
      (err) => {
        if (err) {
          reject(err.message);
        } else {
          resolve('Patient details inserted successfully');
        }
      }
    );
  });
};

ipcMain.handle('savePatientDetails', async (event, details) => {
  try {
    const response = await insertPatientDetails(details);
    return response;
  } catch (error) {
    throw new Error(error);
  }
});


const getPatientsFromDatabase = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM patients', (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(rows);
      }
    });
  });
};

ipcMain.handle('fetchPatients', async () => {
  try {
    const patientsFromDB = await getPatientsFromDatabase();
    return patientsFromDB;
  } catch (error) {
    throw new Error(error);
  }
});

ipcMain.handle('deletePatient', async (event, patientId) => {
  try {
    await deletePatient(patientId);
    return 'Patient deleted successfully';
  } catch (error) {
    throw new Error(error);
  }
});
const deletePatient = (patientId) => {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM patients WHERE id = ?',
      [patientId],
      (err) => {
        if (err) {
          reject(err.message);
        } else {
          resolve();
        }
      }
    );
  });
};
const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM newusers WHERE email = ?', [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row); 
      }
    });
  });
};


ipcMain.handle('forgotPassword', async (event, email) => {
  try {
    console.log('Forgot password request for email:', email);
    
    const user = await getUserByEmail(email);
    
    if (user) {
      const resetToken = jwt.sign({ email }, 'hashi', { expiresIn: '11d' });
      console.log('Generated reset token:', resetToken);
      await updateUserResetToken(email, resetToken);
      return { success: true, token: resetToken };
    } else {
      console.log('User not found');
      return { success: false, message: 'User not found' };
    }
  } catch (error) {
    console.error('Error in forgotPassword:', error.message);
    return { success: false, message: error.message };
  }
});
const updateUserResetToken = (email, resetToken) => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE newusers SET token = ? WHERE email = ?', [resetToken, email], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(); 
      }
    });
  });


};

const updateUserPasswordHash = (email, newPasswordHash) => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE newusers SET password = ? WHERE email = ?', [newPasswordHash, email], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(); 
      }
    });
  });
};
ipcMain.handle('resetPassword', async (event, resetData) => {
  try {
    const { token, newPassword } = resetData;
    const decodedToken = jwt.verify(token, 'hashi');
    console.log('Decoded token:', decodedToken);
    
    const user = await getUserByEmail(decodedToken.email);
    
    if (user) {
      
      const saltRounds = 10;

      
      const newPasswordHash = bcrypt.hashSync(newPassword, saltRounds);

     
      await updateUserPasswordHash(user.email, newPasswordHash);
      
      
      await updateUserResetToken(decodedToken.email, null);
      
      console.log('Password reset successful for user:', user.email);
      
      return { success: true, message: 'Password reset successful' };
    } else {
      return { success: false, message: 'User not found' };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to reset password' };
  }
});
ipcMain.handle('updatePatientDetails', async (event, updatedPatient) => {
  try {
    await updatePatientInDatabase(updatedPatient);
    return { success: true, message: 'Patient details updated successfully' };
  } catch (error) {
    console.error('Error updating patient details:', error);
    return { success: false, message: 'Failed to update patient details' };
  }
});

const updatePatientInDatabase = (updatedPatient) => {
  return new Promise((resolve, reject) => {
    const query =
      'UPDATE patients SET name = ?, address = ?, phoneNumber = ?, email = ? WHERE id = ?';
    db.run(
      query,
      [
        updatedPatient.name,
        updatedPatient.address,
        updatedPatient.phoneNumber,
        updatedPatient.email,
        updatedPatient.id,
      ],
      (err) => {
        if (err) {
          reject(err.message);
        } else {
          resolve();
        }
      }
    );
  });
};
const createWindow = () => {

  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadURL('http://localhost:5173/');
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {


  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  app.on('before-quit', () => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error closing the database:', err.message);
        } else {
          console.log('Database connection closed.');
        }
      });
    }
  });
  
});




