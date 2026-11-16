const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Something went wrong");
  }

  return data;
};

// Upload document
export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return request("/documents/upload", {
    method: "POST",
    body: formData,
  });
};

// Get document details
export const getDocument = async (documentId) => {
  return request(`/documents/${documentId}`);
};

// Delete document
export const deleteDocument = async (documentId) => {
  return request(`/documents/${documentId}`, {
    method: "DELETE",
  });
};

// Ask question
export const askQuestion = async (documentId, message) => {
  return request("/chat/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      documentId,
      message,
    }),
  });
};
