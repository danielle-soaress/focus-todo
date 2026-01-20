export const parseLocalDate = (dateString) => {
  if (!dateString) return null;
  // pega só a parte YYYY-MM-DD da data
  const cleanDate = dateString.toString().split('T')[0];
  const [year, month, day] = cleanDate.split('-').map(Number);
  
  return new Date(year, month - 1, day);
};