const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}
// function logout() {
//   localStorage.removeItem("user");
//   window.location.href = "login.html";
// }










// ===============================
// SUBJECT + FILE SYSTEM LOGIC
// ===============================


let currentFolderName = null;
let selectedItemId = null;
let isSelectionMode = false;
let currentSubject = "books";
let currentFolder = null;
// let currentFolder = null; // root = null
// currentFolderName = current?.parentName || null;

function selectSubject(subject) {
  currentSubject = subject;
  currentFolder = null;
  // console.log("selectsubject is called")
  updatePath();
  loadFiles();
}

async function loadFiles() {
  // const res = await fetch(
  //   `http://localhost:5000/api/files?subject=${currentSubject}&parent=${currentFolder || ""}`
  // );

  const res = await fetch(
  `http://localhost:5000/api/files?subject=${currentSubject}&parent=${currentFolder || ""}`
);


  const data = await res.json();
  console.log("Data: ", data)
  const grid = document.getElementById("fileGrid");
  grid.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "file-card";
    console.log(data);



    if (item.type === "folder") {
      div.innerHTML = `
    <div style="font-size:40px;">📁</div>
    <div>${item.name}</div>
  `;
    } else {
      if (item.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        div.innerHTML = `
      <img src="http://localhost:5000${item.path}" class="file-img"/>
      <div>${item.name}</div>
    `;
      } else {
        div.innerHTML = `
      <div style="font-size:40px;">📄</div>
      <div>${item.name}</div>
    `;
      }
    }




    // div.onclick = () => {

    //   // 🔹 SELECTION MODE
    //   if (isSelectionMode) {
    //     selectedItemId = item._id;

    //     document.querySelectorAll(".file-card").forEach(card => {
    //       card.classList.remove("selected");
    //     });

    //     div.classList.add("selected");
    //     return; // stop further action
    //   }

    //   // 🔹 NORMAL MODE
    //   if (item.type === "folder") {
    //     // currentFolder = item._id;
    //     currentFolder = item._id;
    //     currentFolderName = item.name;
    //     updatePath();
    //     loadFiles();
    //   } else {
    //     // window.open(`http://localhost:5000/${item.path}`);
    //     // window.open(`http://localhost:5000${item.path}`);
    //     openPreview(item);
    //   }
    // };
    div.onclick = () => {

      // 🔹 SELECTION MODE
      if (isSelectionMode) {
        selectedItemId = item._id;

        document.querySelectorAll(".file-card").forEach(card => {
          card.classList.remove("selected");
        });

        div.classList.add("selected");
        return;
      }

      // 🔹 NORMAL MODE
      if (item.type === "folder") {
        currentFolder = item._id;
        currentFolderName = item.name;

        console.log("Entering folder:", item.name); // 🔥 debug

        updatePath();
        loadFiles();
      } else {
        console.log("Opening file:", item.path); // 🔥 debug
        openPreview(item);
      }
    };

    grid.appendChild(div);
  });
}



// ===============================
// SIDEBAR CONNECTION
// ===============================

function bindSidebarSubjects() {
  document.querySelectorAll(".sidebar details[data-subject]").forEach((group) => {
    const summary = group.querySelector("summary");

    summary.addEventListener("click", () => {
      const subject = group.dataset.subject;
      selectSubject(subject);
    });
  });
}

// ===============================
// PATH BAR
// ===============================

// function updatePath() {
//   const pathBar = document.getElementById("pathBar");
//   if (pathBar) {
//     pathBar.textContent = "Home / " + currentSubject;
//   }
// }

function updatePath() {
  const pathBar = document.getElementById("pathBar");

  if (!pathBar) return;

  let path = `Home / ${currentSubject}`;

  if (currentFolderName) {
    path += ` / ${currentFolderName}`;
  }

  pathBar.textContent = path;
}

// ===============================
// MENU + FILE ACTIONS
// ===============================

function openMenu() {
  const menu = document.getElementById("dropdownMenu");
  if (menu) {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  }
}

function triggerUpload() {
  const fileInput = document.getElementById("fileInput");
  if (fileInput) fileInput.click();
}

async function handleUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("subject", currentSubject);
  formData.append("parent", currentFolder);

  await fetch("http://localhost:5000/api/files/upload", {
    method: "POST",
    body: formData
  });

  loadFiles();
}

async function createFolder() {
  const name = prompt("Enter folder name:");
  if (!name) return;

  await fetch("http://localhost:5000/api/files/folder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      subject: currentSubject,
      parent: currentFolder,
      parentName: currentFolderName
    })
  });

  loadFiles();
}

// function enableSelectionMode() {
//   if (isSelectionMode) {
//     isSelectionMode = false;
//     selectedItemId = null;
//     alert("Selection mode OFF");
//     return;
//   }
//   isSelectionMode = true;
//   selectedItemId = null;

//   alert("Selection mode ON");
// }
function enableSelectionMode() {
  isSelectionMode = !isSelectionMode;
  selectedItemId = null;

  // remove previous selections
  document.querySelectorAll(".file-card").forEach(card => {
    card.classList.remove("selected");
  });

  // UI indicator
  document.body.classList.toggle("selection-mode", isSelectionMode);

  // console.log("Selection Mode:", isSelectionMode ? "ON" : "OFF");
}

async function deleteItem() {
  if (!selectedItemId) {
    alert("Select a file first");
    return;
  }

  const confirmDelete = confirm("Are you sure?");
  if (!confirmDelete) return;

  await fetch(`http://localhost:5000/api/files/${selectedItemId}`, {
    method: "DELETE"
  });

  selectedItemId = null;
  isSelectionMode = false; //  important
  loadFiles();
}

async function renameItem() {
  if (!selectedItemId) {
    alert("Select a file first");
    return;
  }

  const newName = prompt("Enter new name:");
  if (!newName) return;

  await fetch(`http://localhost:5000/api/files/${selectedItemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: newName })
  });
  isSelectionMode = false;
  loadFiles();
}

// ===============================
// MAIN DOM LOADED BLOCK (IMPORTANT)
// ===============================
function handleUploadClick() {
  document.getElementById("fileInput").click();
}
document.addEventListener("DOMContentLoaded", () => {

  // Sidebar binding
  bindSidebarSubjects();
  selectSubject("books");

  // File input listener
  // const fileInput = document.getElementById("fileInput");
  // if (fileInput) {
  //   fileInput.addEventListener("change", handleUpload);
  // }



  const fileInput = document.getElementById("fileInput");

  if (fileInput) {
    fileInput.addEventListener("change", async () => {
      const file = fileInput.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("subject", currentSubject);
      formData.append("parent", currentFolder || "");

      console.log("Uploading file...");

      const res = await fetch("http://localhost:5000/api/files/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      console.log("UPLOAD RESPONSE:", data);

      loadFiles();
    });
  }

  const uploadFileBtn = document.getElementById("uploadFileBtn");

  if (uploadFileBtn) {
    uploadFileBtn.addEventListener('click', () => {
      triggerUpload();
    });
  }









  // LEFT SIDEBAR TOGGLE
  const toggleBtn = document.getElementById("toggleSidebar");
  const sidebar = document.querySelector(".sidebar");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  // RIGHT SIDEBAR TOGGLE
  const toggleToolsBtn = document.getElementById("toggleTools");
  const rightSidebar = document.querySelector(".right-sidebar");

  if (toggleToolsBtn && rightSidebar) {
    toggleToolsBtn.addEventListener("click", () => {
      rightSidebar.classList.toggle("collapsed");
    });
  }

  // SIDEBAR MENU SWITCH
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

  if (select) {
    select.addEventListener("change", updateSidebar);
    updateSidebar();
  }

  // STOPWATCH (SAFE)
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const resetBtn = document.getElementById("resetBtn");


  let timer = null;
  let seconds = 0;

  function updateTime() {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;

    const time = document.getElementById("time");
    if (time) {
      time.textContent =
        `${String(hrs).padStart(2, '0')}:` +
        `${String(mins).padStart(2, '0')}:` +
        `${String(secs).padStart(2, '0')}`;
    }
  }

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      if (!timer) {
        timer = setInterval(() => {
          seconds++;
          updateTime();
        }, 1000);
      }
    });
  }

  if (stopBtn) {
    stopBtn.addEventListener("click", () => {
      clearInterval(timer);
      timer = null;
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      clearInterval(timer);
      timer = null;
      seconds = 0;
      updateTime();
    });
  }

});

const toggleStopwatchBtn = document.getElementById("stopwatchBtn");
if (toggleStopwatchBtn) {
  toggleStopwatchBtn.addEventListener("click", () => {
    const stopwatchBtn = document.getElementById("stopwatchBtn");
    stopwatchBtn.classList.toggle("active");

    toggleStopwatch();
  }
  );
}

function toggleStopwatch() {
  let val = document.getElementById("stopwatch").style.display;
  if (val === "block") {
    document.getElementById("stopwatch").style.display = "none";
    return;
  }
  document.getElementById("stopwatch").style.display = "block";
  // document.getElementById("stopwatchBtn").classList.add("active");


}
function toggleCalculator() {
  let val = document.getElementById("calculator").style.display;
  if (val === "block") {
    document.getElementById("calculator").style.display = "none";
    document.getElementById("calculatorBtn").classList.remove("active");
    return;
  }
  document.getElementById("calculator").style.display = "block";
  document.getElementById("calculatorBtn").classList.add("active");
}


const toggleCalculatorBtn = document.getElementById("calculatorBtn");
const createFolderBtn = document.getElementById("createFolderBtn");
const uploadFileBtn = document.getElementById("uploadFileBtn");
const selectionBtn = document.getElementById("selectBtn");
const renameBtn = document.getElementById("renameBtn");
const deleteBtn = document.getElementById("deleteBtn");


toggleCalculatorBtn.addEventListener('click', () => {
  toggleCalculator();
  // console.log("click working")
})
createFolderBtn.addEventListener('click', () => {
  createFolder();
})
uploadFileBtn.addEventListener('click', () => {
  triggerUpload();
})
selectionBtn.addEventListener('click', () => {
  enableSelectionMode();
})
renameBtn.addEventListener('click', () => {
  renameItem();
});
deleteBtn.addEventListener('click', () => {
  deleteItem();
})


function openPreview(item) {
  const grid = document.getElementById("fileGrid");
  const preview = document.getElementById("previewContainer");
  const content = document.getElementById("previewContent");

  grid.style.display = "none";
  preview.style.display = "block";

  // Check file type
  if (item.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
    content.innerHTML = `
      <img src="http://localhost:5000${item.path}" style="max-width:100%; max-height:500px;" />
    `;
  } else if (item.name.match(/\.pdf$/i)) {
    content.innerHTML = `
      <iframe src="http://localhost:5000${item.path}" width="100%" height="500px"></iframe>
    `;
  } else {
    content.innerHTML = `
      <p>Preview not available</p>
      <a href="http://localhost:5000${item.path}" target="_blank">Download File</a>
    `;
  }
}


function closePreview() {
  const grid = document.getElementById("fileGrid");
  const preview = document.getElementById("previewContainer");

  preview.style.display = "none";
  grid.style.display = "flex";
}


async function goBack() {
  if (!currentFolder) return;

  const res = await fetch(`http://localhost:5000/api/files/${currentFolder}`);
  const current = await res.json();

  currentFolder = current.parent || null;
  currentFolderName = null; // reset name

  updatePath();
  loadFiles();
}