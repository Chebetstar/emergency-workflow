// Load saved patients on page load
window.onload = function() {
  const savedPatients = JSON.parse(localStorage.getItem('patients')) || [];
  savedPatients.forEach(patient => addPatientToList(patient.name, patient.urgency, patient.time));
};

// Handle form submit
document.getElementById('patient-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const urgency = document.getElementById('urgency').value;
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add patient to list and storage
  addPatientToList(name, urgency, time);
  savePatient(name, urgency, time);

  document.getElementById('patient-form').reset();
});

// Function to add patient to the UI
function addPatientToList(name, urgency, time) {
  const li = document.createElement('li');
  li.textContent = `${name} – ${urgency} – ${time}`;

  // Add color
  li.classList.add(urgency.toLowerCase());

  // Add remove button
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.style.marginLeft = '10px';
  removeBtn.onclick = function() {
    li.remove();
    removePatient(name, urgency, time);
  };

  li.appendChild(removeBtn);
  document.getElementById('patient-list').appendChild(li);
}

// Function to save to localStorage
function savePatient(name, urgency, time) {
  const patients = JSON.parse(localStorage.getItem('patients')) || [];
  patients.push({ name, urgency, time });
  localStorage.setItem('patients', JSON.stringify(patients));
}

// Function to remove from localStorage
function removePatient(name, urgency, time) {
  let patients = JSON.parse(localStorage.getItem('patients')) || [];
  patients = patients.filter(p => !(p.name === name && p.urgency === urgency && p.time === time));
  localStorage.setItem('patients', JSON.stringify(patients));
}
