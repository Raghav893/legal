const { pool } = require("../config/db");
const { camelizeRow } = require("../utils/mapRows");

async function listDocuments(ownerUserId) {
  const [rows] = await pool.query(`
    SELECT d.id, d.file_name, d.document_type, d.content_type, d.size_bytes, d.document_url, d.summary, d.case_id,
           d.uploaded_by_id, d.uploaded_at, c.title AS case_title, u.full_name AS uploaded_by_name
    FROM documents d
    JOIN cases c ON c.id = d.case_id
    JOIN users u ON u.id = d.uploaded_by_id
    WHERE d.owner_user_id = ?
    ORDER BY d.id DESC
  `, [ownerUserId]);
  return rows.map(camelizeRow);
}

async function createDocument(payload, ownerUserId) {
  const { fileName, documentType, contentType, sizeBytes, documentUrl, summary, caseId, uploadedById } = payload;
  const [result] = await pool.query(
    `INSERT INTO documents (owner_user_id, file_name, document_type, content_type, size_bytes, document_url, summary, case_id, uploaded_by_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [ownerUserId, fileName, documentType, contentType || "application/pdf", sizeBytes || 0, documentUrl || null, summary || null, caseId, uploadedById]
  );
  const [[caseFile]] = await pool.query("SELECT title FROM cases WHERE id = ? LIMIT 1", [caseId]);
  const [[user]] = await pool.query("SELECT full_name FROM users WHERE id = ? LIMIT 1", [uploadedById]);
  return {
    id: result.insertId,
    fileName,
    documentType,
    contentType: contentType || "application/pdf",
    sizeBytes: sizeBytes || 0,
    documentUrl: documentUrl || null,
    summary: summary || null,
    caseId,
    uploadedById,
    uploadedAt: new Date().toISOString(),
    caseTitle: caseFile ? caseFile.title : null,
    uploadedByName: user ? user.full_name : null
  };
}

module.exports = { listDocuments, createDocument };
