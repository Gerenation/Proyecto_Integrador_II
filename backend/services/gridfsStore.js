const mongoose = require('mongoose');
const { Readable } = require('stream');

const BUCKET_NAME = 'sivur_fs';

function getBucket() {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('MongoDB no está conectada');
  }
  return new mongoose.mongo.GridFSBucket(db, { bucketName: BUCKET_NAME });
}

/**
 * @param {Buffer} buffer
 * @param {string} filename
 * @param {string} contentType
 * @param {Record<string, unknown>} metadata
 * @returns {Promise<mongoose.Types.ObjectId>}
 */
function uploadBuffer(buffer, filename, contentType, metadata = {}) {
  return new Promise((resolve, reject) => {
    const bucket = getBucket();
    const upload = bucket.openUploadStream(filename, {
      contentType: contentType || 'application/octet-stream',
      metadata
    });
    Readable.from(buffer)
      .pipe(upload)
      .on('error', reject)
      .on('finish', () => resolve(upload.id));
  });
}

function openDownloadStream(fileId) {
  return getBucket().openDownloadStream(new mongoose.Types.ObjectId(String(fileId)));
}

async function findFileDoc(fileId) {
  const _id = new mongoose.Types.ObjectId(String(fileId));
  const coll = mongoose.connection.db.collection(`${BUCKET_NAME}.files`);
  return coll.findOne({ _id });
}

async function deleteFile(fileId) {
  if (!fileId) return;
  try {
    await getBucket().delete(new mongoose.Types.ObjectId(String(fileId)));
  } catch (err) {
    if (String(err.message).includes('File not found')) return;
    throw err;
  }
}

module.exports = {
  uploadBuffer,
  openDownloadStream,
  findFileDoc,
  deleteFile,
  BUCKET_NAME
};
