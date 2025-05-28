function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function haversineFunction(lat1, lon1, lat2, lon2, earthRad = 6371) {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  lat1 = toRadians(lat1);
  lat2 = toRadians(lat2);

  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRad * c;
}

function distanceFilter(latitude, longitude, collection, radius) {
  const result = collection.filter(item => {
    const distance = haversineFunction(
      latitude,
      longitude,
      item.location.latitude,
      item.location.longitude
    );
    return distance < radius/1000;
  });
  return result;
}

module.exports = distanceFilter;