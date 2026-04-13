// function showLeftOptions() {
//   let value = document.getElementById("bagsOption").value;

//   imageChange(value);
// }

// function imageChange(value) {
//   let source = "";

//   if (value === "studentBagOption") {
//     source = "https://images.pexels.com/photos/3731256/pexels-photo-3731256.jpeg";
//   } else if (value === "travelBagOption") {
//     source = "https://images.pexels.com/photos/22434759/pexels-photo-22434759.jpeg";
//   } else if (value === "officeBagOption") {
//     source = "https://images.pexels.com/photos/11623262/pexels-photo-11623262.jpeg";
//   }

//   if (source) {
//     document.getElementById("mainImg").src = source;
//   }
// }


// sidebar toggle
const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.querySelector(".sidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

// shows selection
document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("bagsOption");
  const groups = document.querySelectorAll(".menu-group");

  function updateSidebar() {
    const value = select.value;

    groups.forEach(group => {
      group.style.display = "none";
    });

    if (value === "studentBagOption") {
      document.querySelector('[data-menu="student"]').style.display = "block";
    } else if (value === "officeBagOption") {
      document.querySelector('[data-menu="office"]').style.display = "block";
    } else if (value === "travelBagOption") {
      document.querySelector('[data-menu="travel"]').style.display = "block";
    } else {
      document.querySelector('[data-menu="default"]').style.display = "block";
    }
  }

  select.addEventListener("change", updateSidebar);
  updateSidebar();
});



//Stopwatch
// Toggle visibility
function toggleStopwatch() {
  const box = document.getElementById("stopwatch");
  box.style.display = box.style.display === "block" ? "none" : "block";
}

// Stopwatch logic
let timer = null;
let seconds = 0;

function updateTime() {
  let hrs = Math.floor(seconds / 3600);
  let mins = Math.floor((seconds % 3600) / 60);
  let secs = seconds % 60;

  document.getElementById("time").textContent =
    `${String(hrs).padStart(2, '0')}:` +
    `${String(mins).padStart(2, '0')}:` +
    `${String(secs).padStart(2, '0')}`;
}

document.getElementById("startBtn").addEventListener("click", () => {
  if (!timer) {
    timer = setInterval(() => {
      seconds++;
      updateTime();
    }, 1000);
  }
});

document.getElementById("stopBtn").addEventListener("click", () => {
  clearInterval(timer);
  timer = null;
});

document.getElementById("resetBtn").addEventListener("click", () => {
  clearInterval(timer);
  timer = null;
  seconds = 0;
  updateTime();
});

// upload file
async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  await fetch("http://localhost:5000/api/files/upload", {
    method: "POST",
    body: formData
  });
}


//connecting upload button to file input
document.getElementById("uploadBtn").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please choose a file first");
    return;
  }

  uploadFile(file);
});


