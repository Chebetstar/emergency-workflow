// Load saved patients on page load
window.onload = function () {
  const savedPatients = JSON.parse(localStorage.getItem('patients')) || [];
  savedPatients.forEach(patient => addPatientToList(patient));
};

// Handle form submit
document.getElementById('patient-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const contactName = document.getElementById('contactName').value;
  const contactPhone = document.getElementById('contactPhone').value;
  const urgency = document.getElementById('urgency').value;
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const id = generatePatientID();

  const patient = {
    id,
    name,
    phone,
    contactName,
    contactPhone,
    urgency,
    time,
    status: "Waiting"
  };

  addPatientToList(patient);
  savePatient(patient);

  document.getElementById('patient-form').reset();
});

// Function to add patient to the UI
function addPatientToList(patient) {
  const li = document.createElement('li');
  li.style.lineHeight = '1.6';

  li.innerHTML = `
    <strong>${patient.id}</strong> – ${patient.name} (${patient.phone})<br>
    <strong>Urgency:</strong> <span class="${patient.urgency.toLowerCase()}">${patient.urgency}</span><br>
    <strong>Time:</strong> ${patient.time}<br>
    <strong>Contact:</strong> ${patient.contactName} (${patient.contactPhone})<br>
    <strong>Status:</strong> <span class="status">${patient.status || 'Waiting'}</span><br>

    <label>Update Status:</label>
    <select class="status-select">
      <option value="Waiting">Waiting</option>
      <option value="Seen by Doctor">Seen by Doctor</option>
      <option value="Lab Test">Lab Test</option>
      <option value="X-Ray">X-Ray</option>
      <option value="Admitted">Admitted</option>
      <option value="Discharged">Discharged</option>
    </select>
    <button class="update-status">Update</button>
  `;

  // Remove button
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.style.marginLeft = '10px';
  removeBtn.onclick = function () {
    li.remove();
    removePatient(patient);
  };
  li.appendChild(removeBtn);

  // Update status and log
  li.querySelector('.update-status').onclick = function () {
    const newStatus = li.querySelector('.status-select').value;
    li.querySelector('.status').textContent = newStatus;
    patient.status = newStatus;
    updatePatientInStorage(patient);

    const logMsg = `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — Notified ${patient.contactName} (${patient.contactPhone}): ${patient.name} is now at ${newStatus}`;
    addToNotificationLog(logMsg);
  };

  document.getElementById('patient-list').appendChild(li);
}

// Save patient to localStorage
function savePatient(patient) {
  const patients = JSON.parse(localStorage.getItem('patients')) || [];
  patients.push(patient);
  localStorage.setItem('patients', JSON.stringify(patients));
}

// Remove patient from localStorage
function removePatient(patientToRemove) {
  let patients = JSON.parse(localStorage.getItem('patients')) || [];
  patients = patients.filter(p => p.id !== patientToRemove.id);
  localStorage.setItem('patients', JSON.stringify(patients));
}

// Update patient in localStorage
function updatePatientInStorage(updatedPatient) {
  let patients = JSON.parse(localStorage.getItem('patients')) || [];
  patients = patients.map(p => {
    if (p.id === updatedPatient.id) {
      return updatedPatient;
    }
    return p;
  });
  localStorage.setItem('patients', JSON.stringify(patients));
}

// Generate unique patient ID
function generatePatientID() {
  const patients = JSON.parse(localStorage.getItem('patients')) || [];
  const nextId = patients.length + 1;
  return `P${String(nextId).padStart(3, '0')}`; // e.g., P001
}

// Add notification to log
function addToNotificationLog(message) {
  const log = document.getElementById('notification-log');
  const li = document.createElement('li');
  li.textContent = message;
  log.prepend(li); // Show newest first
}

// 🖨️ Print only the patient list
function printPatientList() {
  const printContents = document.getElementById('print-area').innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  location.reload(); // restore functionality
}

// 🧼 Clear all saved patient data
function clearAllPatients() {
  localStorage.removeItem('patients');
  document.getElementById('patient-list').innerHTML = '';
  document.getElementById('notification-log').innerHTML = '';
  alert("All patient data has been cleared.");
}
