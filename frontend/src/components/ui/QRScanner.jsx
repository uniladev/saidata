import React, { useState, useEffect, useRef } from 'react';

const QRScanner = ({ onScanSuccess, onClose }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Start scanning after video is ready
        videoRef.current.onloadedmetadata = () => {
          startScanning();
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
    }
  };

  const startScanning = () => {
    // Import QR code scanner dynamically
    if ('BarcodeDetector' in window) {
      scanWithBarcodeDetector();
    } else {
      // Fallback: use jsQR library
      loadJsQRAndScan();
    }
  };

  const scanWithBarcodeDetector = async () => {
    try {
      const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
      
      scanIntervalRef.current = setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          try {
            const barcodes = await barcodeDetector.detect(videoRef.current);
            if (barcodes.length > 0) {
              handleScanSuccess(barcodes[0].rawValue);
            }
          } catch (err) {
            console.error('Scan error:', err);
          }
        }
      }, 500);
    } catch (err) {
      console.error('BarcodeDetector error:', err);
      loadJsQRAndScan();
    }
  };

  const loadJsQRAndScan = () => {
    // Load jsQR from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
    script.onload = () => {
      scanWithJsQR();
    };
    script.onerror = () => {
      setError('Gagal memuat library scanner QR. Silakan refresh halaman.');
    };
    document.body.appendChild(script);
  };

  const scanWithJsQR = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;

    const context = canvas.getContext('2d');
    
    scanIntervalRef.current = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = window.jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          handleScanSuccess(code.data);
        }
      }
    }, 500);
  };

  const handleScanSuccess = (data) => {
    setIsScanning(false);
    stopCamera();
    
    if (onScanSuccess) {
      onScanSuccess(data);
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleClose = () => {
    stopCamera();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="w-full h-full max-w-2xl max-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-qrcode mr-2 text-xl"></i>
            <h3 className="text-lg font-semibold">Scan QR Code</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close scanner"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        {/* Camera View */}
        <div className="flex-1 relative bg-black flex items-center justify-center">
          {error ? (
            <div className="text-white text-center p-4">
              <i className="fas fa-exclamation-triangle text-4xl mb-4"></i>
              <p>{error}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Scanning Frame */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  {/* Corner borders */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500"></div>
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500"></div>
                  
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-1 bg-blue-500 animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>

              {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white rounded-lg p-6 text-center">
                    <i className="fas fa-check-circle text-green-600 text-5xl mb-4"></i>
                    <p className="text-lg font-semibold text-gray-800">QR Code Terdeteksi!</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Instructions */}
        {isScanning && !error && (
          <div className="bg-white p-4">
            <div className="flex items-start">
              <i className="fas fa-info-circle text-blue-600 mr-2 mt-1 flex-shrink-0"></i>
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">Arahkan kamera ke QR code</p>
                <p className="text-xs text-gray-600">QR code akan otomatis terdeteksi</p>
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="bg-gray-800 p-4">
          <button
            onClick={handleClose}
            className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Tutup Scanner
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;