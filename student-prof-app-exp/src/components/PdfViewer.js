import React from 'react';

const PdfViewer = ({ base64Pdf }) => {
  return (
    <div className="mt-4">
      <h5>Document PDF :</h5>
      <iframe
        src={base64Pdf}
        width="100%"
        height="500px"
        title="PDF Viewer"
        style={{ border: '1px solid #ccc' }}
      ></iframe>
    </div>
  );
};

export default PdfViewer;
