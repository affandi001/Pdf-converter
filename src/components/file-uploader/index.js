import React, {useRef, useState} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';

// Set the worker path for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({file, extractedData}) => {
  const [numPages, setNumPages] = useState (null);

  const onDocumentLoadSuccess = ({numPages}) => {
    setNumPages (numPages);
  };

  return (
    <div className="p-4 mt-8  border border-gray-300">
      <p className="mb-4 text-xl font-bold">Number of Pages: {numPages}</p>
      <div className="">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="border-8 border-black border-dotted"
        >
          {Array.from (new Array (numPages), (_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              className="mb-4 max-w-[1200px] mx-auto flex justify-center space-x-32 pt-8 "
            />
          ))}
        </Document>
      </div>
      <div className="absolute">
        <h4>Extracted Data</h4>
        <pre>{extractedData}</pre>
      </div>
    </div>
  );
};

const PdfUploader = () => {
  const fileInputRef = useRef (null);
  const [selectedFile, setSelectedFile] = useState (null);
  const [extractedData, setExtractedData] = useState ('');

  const handleFileChange = event => {
    const file = event.target.files[0];
    setSelectedFile (file);
  };

  const handleUpload = () => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      const reader = new FileReader ();
      reader.onload = async e => {
        const buffer = e.target.result;
        const pdf = await pdfjs.getDocument (buffer).promise;
        const totalPages = pdf.numPages;
        let extractedText = '';

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          const page = await pdf.getPage (pageNum);
          const textContent = await page.getTextContent ();

          extractedText += textContent.items.map (item => item.str).join (' ');

          console.log (extractedText, 'text content');
        }
        setExtractedData (extractedText);
      };

      reader.readAsArrayBuffer (selectedFile);
      setSelectedFile (null);
    }
  };

  return (
    <div className="max-w-[1200px] py-8 mx-auto">
      <div className="flex items-center justify-center mb-4">
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-700"
        >
          Select PDF
        </label>
        {selectedFile &&
          <p className="ml-4">Selected file: {selectedFile.name}</p>}
      </div>
      <div className="flex justify-center" />
      {selectedFile &&
        <PdfViewer file={selectedFile} extractedData={extractedData} />}
    </div>
  );
};

export default PdfUploader;
