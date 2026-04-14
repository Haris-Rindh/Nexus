import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
  onSave: (base64Signature: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    sigCanvas.current?.clear();
  };

  const handleSave = () => {
    if (sigCanvas.current?.isEmpty()) {
      alert('Please provide a signature first.');
      return;
    }
    
    // Generates a base64 string of the signature image
    const signatureData = sigCanvas.current?.toDataURL('image/png');
    if (signatureData) {
      onSave(signatureData);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm w-fit">
      <h3 className="text-lg font-semibold text-gray-800">Sign Document</h3>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
        <SignatureCanvas 
          ref={sigCanvas}
          penColor="#1a1a2e"
          canvasProps={{ width: 500, height: 200, className: 'cursor-crosshair' }}
        />
      </div>

      <div className="flex gap-4 w-full justify-end">
        <button 
          onClick={handleClear} 
          className="px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Clear
        </button>
        <button 
          onClick={handleSave} 
          className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Signature
        </button>
      </div>
    </div>
  );
};
