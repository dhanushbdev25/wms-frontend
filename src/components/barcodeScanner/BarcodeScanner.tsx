import React, { useEffect, useRef } from "react";
import Quagga from "quagga";

interface BarcodeScannerProps {
  onScan: (data: string) => void;
}

function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const videoRef = useRef<any>(null);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    initCamera();

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream instanceof MediaStream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      }
    };
  }, []);
  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#scanner-container") as HTMLElement,
          constraints: {
            facingMode: "environment", // Use the rear camera (change as needed)
          },
        },
        decoder: {
          readers: ["code_128_reader"], // You can add other reader types if needed
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        locate: true,
      },
      (err: any) => {
        if (err) {
          console.error("Error initializing Quagga:", err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((data: any) => {
      onScan(data.codeResult.code);
      console.log("data.codeResult.code",data.codeResult.code)
    });

    return () => {
      Quagga.stop();
    };
  }, [onScan]);

  return (
    <>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }}>
        <div
          id="scanner-container"
          style={{ width: "100%", height: "100vh" }}
        />
      </video>
    </>
  );
}

export default BarcodeScanner;
