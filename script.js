fetch('data/donors.json')
  .then((res) => res.json())
  .then((data) => {
    megaDonors = data.megaDonors;
    donors = data.donors;
    renderMegaDonors();
    renderDonors();
    populateBrandSelect();
  })
  .catch((e) => console.error('Failed to load donor data:', e));
