function autocomplete(input, latInput, lngInput) {
  // Skip this gn from running if there is not input on the page
  if (!input) return;
  const autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener('place_changed', function(){
    const place = autocomplete.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  });

  // If someone hits enter on the address field, don't submit the form
  input.on('keydown', function(e){
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  });
}

module.exports = autocomplete;
