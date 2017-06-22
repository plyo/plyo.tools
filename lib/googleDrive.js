import google from 'googleapis';
import multiparty from 'multiparty';
import GoogleAuth from 'google-auth-library';
import {
  FieldValidationError,
  GoogleDriveInitializedError,
} from './errors';

let drive;

/**
 * Connects to GDrive
 * @param {object} [googleApi] - GDrive credentials
 * @param {string} [googleApi.clientId]
 * @param {string} [googleApi.clientSecret]
 * @param {string} [googleApi.accessToken]
 * @param {string} [googleApi.refreshToken]
 * @param {string} [googleApi.expiryDate]
 */
export function setup(googleApi) {
  const auth = new GoogleAuth();
  const redirectUrl = 'urn:ietf:wg:oauth:2.0:oob';
  const { clientId, clientSecret, accessToken, refreshToken, expiryDate } = googleApi;
  const googleAuthObject = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  googleAuthObject.credentials = {
    access_token: accessToken,
    token_type: 'Bearer',
    refresh_token: refreshToken,
    expiry_date: expiryDate,
  };

  drive = google.drive({ version: 'v3', auth: googleAuthObject });
}

function ensureGoogleDriveInitialized() {
  if (drive === undefined) {
    throw new GoogleDriveInitializedError();
  }
}
/**
 * You can extend it passing additional `fields` described
 * here https://developers.google.com/drive/v3/reference/files#resource
 * @typedef {object} GoogleDriveFileResource
 * @property {string} id
 * @property {string} name
 * @property {string} webContentLink - link to download shared file
 * @property {string} webViewLink - link to view shared file (in Google App, or browser)
 */

/**
 * Returns id of first folder found by provided name
 * @param {string} folderName
 * @returns {Promise.<string>}
 */
function getFolderId(folderName) {
  return new Promise((resolve, reject) => {
    drive.files.list({
      q: `name='${folderName}' and mimeType = 'application/vnd.google-apps.folder'`,
      fields: 'nextPageToken, files(id, name)',
    }, (err, response) => {
      if (err) {
        reject(err);
        return;
      }

      if (!response.files || !response.files.length) {
        const msg = `You must have ${folderName} directory in the root of your google drive`;
        reject(new Error(msg));
        return;
      }

      resolve(response.files[0].id);
    });
  });
}

/**
 * Uploads stream to google drive
 * @param {string} parentDirectoryId - you must specify directory for files
 * @param {stream.Readable} stream
 * @param {string} stream.filename
 * @param {function(GoogleDriveFileResource)} resolve
 * @param {function(Error)} reject
 */
function uploadToGoogleDrive(parentDirectoryId, stream, resolve, reject) {
  drive.files.create({
    resource: {
      name: stream.filename,
      parents: [parentDirectoryId],
    },
    media: {
      body: stream,
    },
    fields: 'id,name,webContentLink,webViewLink',
  }, (err, result) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(result);
  });
}

/**
 * @param {http.Request} req
 * @param {string} fieldName - where to look for file
 * @param {object} options
 * @param {string} options.folder - directory to upload to
 * @returns {Promise.<GoogleDriveFileResource, Error>}
 */
export async function upload(req, fieldName, options) {
  ensureGoogleDriveInitialized();

  const parentDirectoryId = await getFolderId(options.folder);

  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();
    let fileInRequest = false;

    form.on('error', reject);

    form.on('part', (part) => {
      part.on('error', reject);

      if (part.filename && part.name === fieldName) {
        fileInRequest = true;

        uploadToGoogleDrive(parentDirectoryId, part, resolve, reject);
      }

      part.resume();
    });

    form.on('close', () => {
      if (!fileInRequest) {
        reject(new FieldValidationError(fieldName, `File ${fieldName} is required`));
      }
    });

    form.parse(req);
  });
}


/**
 * @param {stream} stream
 * @param {object} options
 * @param {string} options.folder - directory to upload to
 * @returns {Promise.<GoogleDriveFileResource, Error>}
 */
export async function uploadStream(stream, options) {
  ensureGoogleDriveInitialized();

  const parentDirectoryId = await getFolderId(options.folder);

  return new Promise((resolve, reject) => {
    uploadToGoogleDrive(parentDirectoryId, stream, resolve, reject);
  });
}

/**
 * Removes file from google drive
 * @param {string} fileId
 * @returns {Promise}
 */
export function remove(fileId) {
  ensureGoogleDriveInitialized();

  return new Promise((resolve, reject) => {
    drive.files.delete({ fileId }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(result);
    });
  });
}

/**
 * Renames file on google drive
 * @param {string} fileId
 * @param {string} name
 * @returns {Promise.<GoogleDriveFileResource, Error>}
 */
export function rename(fileId, name) {
  ensureGoogleDriveInitialized();

  return new Promise((resolve, reject) => {
    drive.files.update({
      fileId,
      resource: {
        name,
      },
      fields: 'id,name,webContentLink,webViewLink',
    }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(result);
    });
  });
}

/**
 * Copies file on google drive
 * @param {string} fileId
 * @returns {Promise.<GoogleDriveFileResource, Error>}
 */
export function copy(fileId) {
  ensureGoogleDriveInitialized();

  return new Promise((resolve, reject) => {
    drive.files.copy({
      fileId,
      fields: 'id,name,webContentLink,webViewLink',
    }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(result);
    });
  });
}
