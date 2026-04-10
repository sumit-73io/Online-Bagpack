function showLeftOptions() {
  let value = document.getElementById("bagsOption").value;

  imageChange(value);
}

function imageChange(value) {
  let source = "";

  if (value === "studentBagOption") {
    source = "https://images.pexels.com/photos/3731256/pexels-photo-3731256.jpeg";
  } else if (value === "travelBagOption") {
    source = "https://images.pexels.com/photos/22434759/pexels-photo-22434759.jpeg";
  } else if (value === "officeBagOption") {
    source = "https://images.pexels.com/photos/11623262/pexels-photo-11623262.jpeg";
  }

  if (source) {
    document.getElementById("mainImg").src = source;
  }
}