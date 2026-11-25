const COMPANIES = [
  { id: 'COMP_A', name: 'Company A' },
  { id: 'COMP_B', name: 'Company B' },
  { id: 'COMP_C', name: 'Company C' },
  { id: 'COMP_D', name: 'Company D' }
];

const COMPANY_IDS = COMPANIES.map((company) => company.id);

module.exports = {
  COMPANIES,
  COMPANY_IDS
};

