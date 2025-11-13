import { useState, useCallback } from 'react';

export const useCSVParser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const parseCSV = useCallback((csvText) => {
    setLoading(true);
    setError(null);

    try {
      const lines = csvText.trim().split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV must have at least a header row and one data row');
      }

      // Parse header
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Find relevant columns (flexible column detection)
      const dateIndex = headers.findIndex(h => 
        h.includes('date') || h.includes('transaction date')
      );
      const descriptionIndex = headers.findIndex(h => 
        h.includes('description') || h.includes('merchant') || h.includes('payee') || h.includes('narration')
      );
      const amountIndex = headers.findIndex(h => 
        h.includes('amount') || h.includes('debit') || h.includes('transaction amount') || h.includes('withdrawal')
      );

      if (dateIndex === -1 || descriptionIndex === -1 || amountIndex === -1) {
        throw new Error(
          'CSV must contain columns for: Date, Description (or Merchant), and Amount'
        );
      }

      // Parse data rows
      const expenses = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;

        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length < Math.max(dateIndex, descriptionIndex, amountIndex) + 1) {
          continue;
        }

        const date = values[dateIndex];
        const description = values[descriptionIndex];
        const amountStr = values[amountIndex].replace(/[$,\s]/g, '');
        const amount = parseFloat(amountStr);

        if (!date || !description || isNaN(amount) || amount <= 0) {
          continue;
        }

        expenses.push({
          date,
          description,
          amount: Math.abs(amount),
        });
      }

      if (expenses.length === 0) {
        throw new Error('No valid expenses found in CSV');
      }

      setLoading(false);
      return expenses;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, []);

  return { parseCSV, loading, error };
};
