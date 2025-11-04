export interface PlateValidationResult {
  isValid: boolean;
  format: string | null;
  suggestion: string | null;
  message: string;
}

// Vietnamese license plate formats
const PLATE_FORMATS = [
  {
    regex: /^\d{2}[A-Z]-\d{3}\.\d{2}$/,
    format: '##X-###.##',
    example: '51F-238.91',
    description: 'Standard format (e.g., 51F-238.91)'
  },
  {
    regex: /^\d{2}[A-Z]-\d{4,5}$/,
    format: '##X-####',
    example: '43A-12345',
    description: 'Without dots (e.g., 43A-12345)'
  },
  {
    regex: /^\d{2}[A-Z]\d{5}$/,
    format: '##X#####',
    example: '51F23891',
    description: 'No dash (e.g., 51F23891)'
  }
];

export function validateLicensePlate(input: string): PlateValidationResult {
  const trimmed = input.trim().toUpperCase();
  
  if (trimmed.length === 0) {
    return {
      isValid: false,
      format: null,
      suggestion: null,
      message: 'Vui lòng nhập biển số xe'
    };
  }

  if (trimmed.length < 5) {
    return {
      isValid: false,
      format: null,
      suggestion: null,
      message: 'Biển số quá ngắn (tối thiểu 5 ký tự)'
    };
  }

  // Check if it matches any valid format
  for (const format of PLATE_FORMATS) {
    if (format.regex.test(trimmed)) {
      return {
        isValid: true,
        format: format.format,
        suggestion: null,
        message: `✓ Format hợp lệ: ${format.description}`
      };
    }
  }

  // Try to suggest a format
  const suggestion = suggestFormat(trimmed);
  
  return {
    isValid: false,
    format: null,
    suggestion: suggestion.formatted,
    message: suggestion.message
  };
}

function suggestFormat(input: string): { formatted: string | null; message: string } {
  // Remove all special characters
  const cleaned = input.replace(/[^0-9A-Z]/g, '');
  
  if (cleaned.length < 5) {
    return {
      formatted: null,
      message: 'Biển số không hợp lệ. Ví dụ: 51F-238.91 hoặc 43A-12345'
    };
  }

  // Try to extract province code (2 digits + 1 letter)
  const provinceMatch = cleaned.match(/^(\d{2})([A-Z])/);
  
  if (!provinceMatch) {
    return {
      formatted: null,
      message: 'Format không đúng. Biển số phải bắt đầu bằng 2 số và 1 chữ cái (VD: 51F)'
    };
  }

  const province = provinceMatch[1];
  const letter = provinceMatch[2];
  const numbers = cleaned.substring(3);

  if (numbers.length < 2) {
    return {
      formatted: null,
      message: `Format không đúng. Sau ${province}${letter} phải có ít nhất 2 số`
    };
  }

  // Format based on length
  let formatted: string;
  if (numbers.length >= 5) {
    // Standard format: ##X-###.##
    const part1 = numbers.substring(0, 3);
    const part2 = numbers.substring(3, 5);
    formatted = `${province}${letter}-${part1}.${part2}`;
  } else if (numbers.length >= 4) {
    // Without dots: ##X-####
    formatted = `${province}${letter}-${numbers}`;
  } else {
    formatted = `${province}${letter}-${numbers}`;
  }

  return {
    formatted,
    message: `Gợi ý: ${formatted}`
  };
}

export function normalizePlate(plate: string): string {
  const validation = validateLicensePlate(plate);
  
  if (validation.isValid) {
    return plate.trim().toUpperCase();
  }
  
  if (validation.suggestion) {
    return validation.suggestion;
  }
  
  return plate.trim().toUpperCase();
}
