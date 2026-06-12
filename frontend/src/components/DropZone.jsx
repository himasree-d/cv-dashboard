import React, { useCallback, useRef } from 'react';

const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter" className="text-accent-highlight mb-4">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const FileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-accent-primary mr-3">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </svg>
);

const DropZone = ({ file, setFile }) => {
  const fileInputRef = useRef(null);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  }, [setFile]);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div 
      className="w-full h-[280px] border-[1.5px] border-dashed border-accent-highlight cursor-pointer liquid-glass flex flex-col items-center justify-center relative hover:border-solid transition-all duration-300"
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={onFileChange}
        accept="image/jpeg, image/png, video/mp4, video/x-msvideo, video/quicktime"
      />
      
      {file ? (
        <div className="flex flex-col items-center z-10">
          <div className="flex items-center">
            <FileIcon />
            <span className="font-mono-custom text-[14px] text-accent-primary border-b-[1px] border-accent-highlight pb-[2px]">
              {file.name}
            </span>
          </div>
          <span className="font-mono-custom text-[12px] text-muted mt-3">
            {formatSize(file.size)}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center pointer-events-none z-10">
          <UploadIcon />
          <span className="text-muted text-[15px] mb-1">Drop your file here</span>
          <span className="text-muted text-[13px] opacity-70">JPG, PNG, MP4, AVI, MOV up to 500MB</span>
        </div>
      )}
    </div>
  );
};

export default DropZone;
