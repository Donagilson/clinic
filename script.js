// Doctor Notes Feature for patient_details.html (single section)

document.addEventListener('DOMContentLoaded', function() {
    const notesTextarea = document.getElementById('doctor-notes');
    const statusSpan = document.getElementById('notes-status');
    if (notesTextarea) {
        // Load saved notes if any
        const savedNotes = localStorage.getItem('doctorNotes');
        if (savedNotes) {
            notesTextarea.value = savedNotes;
            notesTextarea.disabled = true;
        } else {
            notesTextarea.disabled = false;
        }
    }
});

function saveNotes() {
    const notesTextarea = document.getElementById('doctor-notes');
    const notes = notesTextarea.value;
    localStorage.setItem('doctorNotes', notes);
    notesTextarea.disabled = true;
    const statusSpan = document.getElementById('notes-status');
    statusSpan.textContent = 'Notes saved!';
    setTimeout(() => { statusSpan.textContent = ''; }, 2000);
}

function editNotes() {
    const notesTextarea = document.getElementById('doctor-notes');
    notesTextarea.disabled = false;
    notesTextarea.focus();
}

function generatePDF() {
    const notes = document.getElementById('doctor-notes').value;
    if (!notes.trim()) {
        alert('Please write some notes before generating PDF.');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Doctor's Notes / Prescriptions:", 10, 10);
    doc.text(notes, 10, 20);
    doc.save('doctor_notes.pdf');
}
// Clinical Management System JavaScript

// Global Variables
let currentUser = null;
let isLoggedIn = false;
let appointments = [];
let patients = [];

// User credentials for demo
const users = {
    doctor: { 
        username: "doctor", 
        password: "doc123", 
        role: "Doctor",
        name: "Dr. John Smith",
        specialization: "General Medicine"
    },
    labtech: { 
        username: "labtech", 
        password: "lab123", 
        role: "Lab Technician",
        name: "Mike Johnson",
        department: "Laboratory"
    },
    reception: { 
        username: "reception", 
        password: "recep123", 
        role: "Receptionist",
        name: "Sarah Wilson",
        department: "Reception"
    }
};

// Sample appointments data
const sampleAppointments = [
    {
        id: 1,
        patientName: "Sarah Johnson",
        date: "2024-01-20",
        time: "09:00",
        reason: "Regular checkup",
        status: "Scheduled",
        doctor: "Dr. John Smith"
    },
    {
        id: 2,
        patientName: "Michael Brown",
        date: "2024-01-20",
        time: "10:30",
        reason: "Follow-up consultation",
        status: "In Progress",
        doctor: "Dr. John Smith"
    },
    {
        id: 3,
        patientName: "Emily Davis",
        date: "2024-01-20",
        time: "14:00",
        reason: "Blood pressure monitoring",
        status: "Scheduled",
        doctor: "Dr. John Smith"
    },
    {
        id: 4,
        patientName: "David Wilson",
        date: "2024-01-21",
        time: "11:00",
        reason: "Diabetes management",
        status: "Scheduled",
        doctor: "Dr. John Smith"
    },
    {
        id: 5,
        patientName: "Lisa Anderson",
        date: "2024-01-21",
        time: "15:30",
        reason: "Annual physical",
        status: "Scheduled",
        doctor: "Dr. John Smith"
    }
];

// Sample patients data
const samplePatients = [
    {
        id: 1,
        name: "Sarah Johnson",
        age: 35,
        gender: "Female",
        bloodGroup: "A+",
        medicalHistory: "Hypertension (2018), Diabetes Type 2 (2020), Allergic to Penicillin",
        contact: "+1 (555) 123-4567",
        email: "sarah.johnson@email.com"
    },
    {
        id: 2,
        name: "Michael Brown",
        age: 42,
        gender: "Male",
        bloodGroup: "O+",
        medicalHistory: "Asthma (2015), No known allergies",
        contact: "+1 (555) 234-5678",
        email: "michael.brown@email.com"
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    hideLoadingScreen();
    initializeEventListeners();
    loadSampleData();
    checkUserSession();
}

// Hide Loading Screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    }
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('bg-white', 'shadow');
        } else {
            navbar.classList.remove('bg-white', 'shadow');
        }
    });
}

// Load Sample Data
function loadSampleData() {
    appointments = [...sampleAppointments];
    patients = [...samplePatients];
}

// Check User Session
function checkUserSession() {
    const savedUser = localStorage.getItem('cmsUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        showDashboard(currentUser.role);
    }
}

// Login Functions
function openLoginModal() {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim().toLowerCase();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validate credentials
    let userFound = false;
    let loginSuccessful = false;
    
    for (let role in users) {
        if (username === users[role].username) {
            userFound = true;
            if (password === users[role].password) {
                loginSuccessful = true;
                currentUser = { ...users[role] };
                isLoggedIn = true;
                break;
            }
        }
    }
    
    if (loginSuccessful) {
        showToast(`Welcome, ${currentUser.name}!`, 'success');
        
        // Save session if remember me is checked
        if (rememberMe) {
            localStorage.setItem('cmsUser', JSON.stringify(currentUser));
        }
        
        // Close modal and show dashboard
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();
        
        showDashboard(currentUser.role);
    } else if (userFound) {
        showToast('Incorrect password', 'error');
    } else {
        showToast('Username not found', 'error');
    }
}

// Show Dashboard based on role
function showDashboard(role) {
    // Hide main content
    document.querySelectorAll('section, footer').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show appropriate dashboard
    switch(role) {
        case 'Doctor':
            showDoctorDashboard();
            break;
        case 'Lab Technician':
            showLabTechDashboard();
            break;
        case 'Receptionist':
            showReceptionistDashboard();
            break;
        default:
            showToast('Invalid role', 'error');
    }
}

// Doctor Dashboard Functions
function showDoctorDashboard() {
    const dashboard = document.getElementById('doctorDashboard');
    dashboard.style.display = 'block';
    
    // Update doctor name
    const doctorName = dashboard.querySelector('.navbar-text');
    if (doctorName) {
        doctorName.innerHTML = `<i class="fas fa-user me-2"></i>${currentUser.name}`;
    }
    
    // Load appointments
    loadAppointments();
    
    // Load patient data
    loadPatientData();
}

function loadAppointments() {
    const appointmentsTable = document.getElementById('appointmentsTable');
    if (!appointmentsTable) return;
    
    appointmentsTable.innerHTML = '';
    
    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.patientName}</td>
            <td>${formatDate(appointment.date)} ${appointment.time}</td>
            <td>${appointment.reason}</td>
            <td><span class="badge bg-${getStatusColor(appointment.status)}">${appointment.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewPatient('${appointment.patientName}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="startAppointment(${appointment.id})">
                    <i class="fas fa-play"></i>
                </button>
            </td>
        `;
        appointmentsTable.appendChild(row);
    });
}

function loadPatientData() {
    // Load first patient as default
    const patient = patients[0];
    if (patient) {
        document.getElementById('patientName').value = patient.name;
        document.getElementById('patientAge').value = patient.age;
        document.getElementById('patientGender').value = patient.gender;
        document.getElementById('bloodGroup').value = patient.bloodGroup;
        document.getElementById('medicalHistory').value = patient.medicalHistory;
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getStatusColor(status) {
    switch(status) {
        case 'Scheduled': return 'primary';
        case 'In Progress': return 'warning';
        case 'Completed': return 'success';
        case 'Cancelled': return 'danger';
        default: return 'secondary';
    }
}

// Patient Management Functions
function viewPatient(patientName) {
    const patient = patients.find(p => p.name === patientName);
    if (patient) {
        document.getElementById('patientName').value = patient.name;
        document.getElementById('patientAge').value = patient.age;
        document.getElementById('patientGender').value = patient.gender;
        document.getElementById('bloodGroup').value = patient.bloodGroup;
        document.getElementById('medicalHistory').value = patient.medicalHistory;
        
        showToast(`Loaded patient: ${patient.name}`, 'info');
    }
}

function startAppointment(appointmentId) {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
        appointment.status = 'In Progress';
        loadAppointments();
        showToast(`Started appointment with ${appointment.patientName}`, 'success');
    }
}

// Medicine Management Functions
function addMedicine() {
    const medicineTableBody = document.getElementById('medicineTableBody');
    if (!medicineTableBody) return;
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" class="form-control" placeholder="Medicine name"></td>
        <td><input type="text" class="form-control" placeholder="Dosage"></td>
        <td><input type="text" class="form-control" placeholder="Duration"></td>
        <td><input type="text" class="form-control" placeholder="Instructions"></td>
        <td><button class="btn btn-sm btn-outline-danger" onclick="removeMedicine(this)"><i class="fas fa-trash"></i></button></td>
    `;
    medicineTableBody.appendChild(newRow);
}

function removeMedicine(button) {
    const row = button.closest('tr');
    row.remove();
}

// Data Management Functions
function savePatientData() {
    const patientName = document.getElementById('patientName').value;
    const prescriptionNotes = document.getElementById('prescriptionNotes').value;
    
    if (!patientName || !prescriptionNotes) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Collect medicine data
    const medicines = [];
    const medicineRows = document.querySelectorAll('#medicineTableBody tr');
    medicineRows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        if (inputs[0].value.trim()) {
            medicines.push({
                name: inputs[0].value,
                dosage: inputs[1].value,
                duration: inputs[2].value,
                instructions: inputs[3].value
            });
        }
    });
    
    // Save to localStorage (simulating database save)
    const patientData = {
        patientName,
        prescriptionNotes,
        medicines,
        savedAt: new Date().toISOString(),
        doctor: currentUser.name
    };
    
    localStorage.setItem(`patient_${patientName}`, JSON.stringify(patientData));
    
    showToast('Patient data saved successfully!', 'success');
}

// Quick Actions Functions
function addNewAppointment() {
    showToast('New appointment feature coming soon!', 'info');
}

function viewPatientHistory() {
    showToast('Patient history feature coming soon!', 'info');
}

function generateReport() {
    showToast('Report generation feature coming soon!', 'info');
}

// Lab Technician Dashboard
function showLabTechDashboard() {
    showToast('Lab Technician dashboard coming soon!', 'info');
    setTimeout(() => {
        logout();
    }, 2000);
}

// Receptionist Dashboard
function showReceptionistDashboard() {
    showToast('Receptionist dashboard coming soon!', 'info');
    setTimeout(() => {
        logout();
    }, 2000);
}

// Logout Function
function logout() {
    currentUser = null;
    isLoggedIn = false;
    localStorage.removeItem('cmsUser');
    
    // Hide dashboard
    const dashboard = document.getElementById('doctorDashboard');
    if (dashboard) {
        dashboard.style.display = 'none';
    }
    
    // Show main content
    document.querySelectorAll('section, footer').forEach(el => {
        el.style.display = 'block';
    });
    
    showToast('Logged out successfully', 'success');
}

// Contact Form Handler
function handleContactSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!data.name || !data.email || !data.subject || !data.message) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate form submission
    showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
    event.target.reset();
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast');
    if (!toastContainer) return;
    
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div id="${toastId}" class="toast show" role="alert">
            <div class="toast-header">
                <i class="fas fa-${getToastIcon(type)} text-${type} me-2"></i>
                <strong class="me-auto">CMS</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.remove();
        }
    }, 5000);
}

function getToastIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        case 'info': return 'info-circle';
        default: return 'info-circle';
    }
}

// Password Toggle
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('passwordToggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Scroll to Section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Form Validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Data Export Functions
function exportPatientData(patientName) {
    const patientData = localStorage.getItem(`patient_${patientName}`);
    if (patientData) {
        const data = JSON.parse(patientData);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `patient_${patientName}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Patient data exported successfully!', 'success');
    }
}

// Search Functions
function searchAppointments(query) {
    const filteredAppointments = appointments.filter(appointment => 
        appointment.patientName.toLowerCase().includes(query.toLowerCase()) ||
        appointment.reason.toLowerCase().includes(query.toLowerCase())
    );
    
    // Update appointments table with filtered results
    const appointmentsTable = document.getElementById('appointmentsTable');
    if (appointmentsTable) {
        appointmentsTable.innerHTML = '';
        filteredAppointments.forEach(appointment => {
            // Same logic as loadAppointments but with filtered data
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.patientName}</td>
                <td>${formatDate(appointment.date)} ${appointment.time}</td>
                <td>${appointment.reason}</td>
                <td><span class="badge bg-${getStatusColor(appointment.status)}">${appointment.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewPatient('${appointment.patientName}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="startAppointment(${appointment.id})">
                        <i class="fas fa-play"></i>
                    </button>
                </td>
            `;
            appointmentsTable.appendChild(row);
        });
    }
}

// Statistics Functions
function getAppointmentStats() {
    const total = appointments.length;
    const scheduled = appointments.filter(a => a.status === 'Scheduled').length;
    const inProgress = appointments.filter(a => a.status === 'In Progress').length;
    const completed = appointments.filter(a => a.status === 'Completed').length;
    
    return { total, scheduled, inProgress, completed };
}

// Print Functions
function printPatientData(patientName) {
    const patientData = localStorage.getItem(`patient_${patientName}`);
    if (patientData) {
        const data = JSON.parse(patientData);
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Patient Data - ${patientName}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .section { margin-bottom: 20px; }
                        .section h3 { color: #0d6efd; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f8f9fa; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Patient Medical Record</h1>
                        <p><strong>Patient:</strong> ${data.patientName}</p>
                        <p><strong>Doctor:</strong> ${data.doctor}</p>
                        <p><strong>Date:</strong> ${new Date(data.savedAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div class="section">
                        <h3>Prescription Notes</h3>
                        <p>${data.prescriptionNotes}</p>
                    </div>
                    
                    <div class="section">
                        <h3>Prescribed Medicines</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Medicine</th>
                                    <th>Dosage</th>
                                    <th>Duration</th>
                                    <th>Instructions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.medicines.map(med => `
                                    <tr>
                                        <td>${med.name}</td>
                                        <td>${med.dosage}</td>
                                        <td>${med.duration}</td>
                                        <td>${med.instructions}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized search with debouncing
const debouncedSearch = debounce(searchAppointments, 300);

// Export functions for global access
window.openLoginModal = openLoginModal;
window.togglePassword = togglePassword;
window.scrollToSection = scrollToSection;
window.logout = logout;
window.addMedicine = addMedicine;
window.removeMedicine = removeMedicine;
window.savePatientData = savePatientData;
window.viewPatient = viewPatient;
window.startAppointment = startAppointment;
window.addNewAppointment = addNewAppointment;
window.viewPatientHistory = viewPatientHistory;
window.generateReport = generateReport;