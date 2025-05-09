
import React from 'react';
import LicensePlateScannerContainer from './licensePlate/LicensePlateScannerContainer';

interface LicensePlateProps {
  onDetection?: (plate: string, confidence: number) => void;
}

const LicensePlateScanner: React.FC<LicensePlateProps> = ({ onDetection }) => {
  return <LicensePlateScannerContainer onDetection={onDetection} />;
};

export default LicensePlateScanner;
