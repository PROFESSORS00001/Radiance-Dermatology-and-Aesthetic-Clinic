const API_URL = 'http://localhost:3000/api';

window.filterTable = function(tbodyId, term) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const rows = tbody.getElementsByTagName('tr');
  const lowerTerm = term.toLowerCase();
  for (let i = 0; i < rows.length; i++) {
    const text = rows[i].textContent.toLowerCase();
    rows[i].style.display = text.includes(lowerTerm) ? '' : 'none';
  }
};

let currentUser = null;
let allUsers = [];
let allPatients = [];
let allAppointments = [];
let labCatalog = [];
let pharmacyInventory = [];
let treatmentCatalog = [];
let sysSettings = {};
window.publicBrand = { clinic_name: 'Radiance Derms', clinic_logo: '' };

window.showModal = function(contentHtml) {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'activeModalOverlay';
  overlay.innerHTML = contentHtml;
  document.body.appendChild(overlay);
}

window.closeModal = function() {
  const overlay = document.getElementById('activeModalOverlay');
  if (overlay) overlay.remove();
}

window.toast = function(msg) {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerText = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('dcms_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('dcms_token');
      localStorage.removeItem('dcms_user');
      window.location.reload();
    }
    throw new Error(data.error || 'API Error');
  }
  return data;
}

const appRoot = document.getElementById('app');

function renderLogin() {
  const brandName = window.publicBrand.clinic_name || 'Radiance Derms';
  const logoSrc = window.publicBrand.clinic_logo || '/logo.png';
  
  const brandLockup = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; margin-bottom:1.5rem; gap:12px;">
      <div class="logo-wrapper-pro" style="margin:0; max-width:160px; max-height:80px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
        <img src="${logoSrc}" style="width:100%; height:100%; object-fit:contain; border-radius:8px;" onerror="this.style.display='none'">
      </div>
      <h1 style="margin:0; font-size:1.6rem; font-weight:800; letter-spacing:1px; background: linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0px 2px 4px rgba(37, 99, 235, 0.15));">${brandName}</h1>
    </div>
  `;

  appRoot.innerHTML = `
    <div class="auth-wrapper">
      <div class="auth-card" style="text-align:center;">
          ${brandLockup}
          <p style="margin-bottom:1.2rem; color:#64748b; font-size:0.9rem;">Login to your account</p>
        <form id="loginForm" autocomplete="off" style="text-align:left;">
          <div class="form-group" style="margin-bottom:1.2rem;">
            <label>Username</label>
            <input type="text" id="username" autocomplete="off" readonly onfocus="this.removeAttribute('readonly');" required />
          </div>
          <div class="form-group" style="position:relative;">
            <label>Password</label>
            <input type="password" id="password" autocomplete="new-password" readonly onfocus="this.removeAttribute('readonly');" required style="padding-right:2.5rem;" />
            <span id="togglePassword" style="position:absolute; right:12px; top:38px; cursor:pointer; color:#94a3b8; font-size:1.2rem; user-select:none;" title="Show/Hide Password">
              <svg id="eyeIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </span>
          </div>
          <button type="submit" class="btn btn-block">Sign In</button>
        </form>
      </div>
    </div>
  `;
  document.getElementById('togglePassword').addEventListener('click', function() {
    const pwField = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    if (pwField.type === 'password') {
      pwField.type = 'text';
      eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
    } else {
      pwField.type = 'password';
      eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
    }
  });
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ username: e.target.username.value, password: e.target.password.value })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      localStorage.setItem('dcms_token', data.token);
      localStorage.setItem('dcms_user', JSON.stringify(data.user));
      initApp();
    } catch(err) {
      toast(err.message);
    }
  });
}

function renderLayout() {
  appRoot.innerHTML = `
    <div class="app-layout">
      <div class="sidebar ${localStorage.getItem('sidebarCollapsed') === 'true' ? 'collapsed' : ''}" style="display:flex; flex-direction:column; background: #ffffff; color:#334155; border-right: 3px solid transparent; border-image: linear-gradient(180deg, rgba(14, 165, 233, 0.8) 0%, rgba(16, 185, 129, 0.8) 100%) 1; box-shadow: 4px 0 20px rgba(0,0,0,0.05); z-index:50;">
          
        
        <div class="sidebar-header" style="padding:1.5rem 1.5rem 1rem 1.5rem; background: #ffffff; text-align:center; display:flex; flex-direction:column; align-items:center;">
          ${window.publicBrand.clinic_logo ? `<img src="${window.publicBrand.clinic_logo}" class="sidebar-logo-image" style="width: 100%; max-width: 170px; max-height: 90px; object-fit: contain; mix-blend-mode: multiply; margin-bottom: 0.5rem; transition:all 0.3s;">` : `<div class="sidebar-logo-icon" style="width:70px; height:70px; border-radius:50%; background:linear-gradient(135deg, #0ea5e9, #2563eb); display:flex; align-items:center; justify-content:center; color:white; font-size:2rem; margin-bottom:0.5rem; box-shadow:0 10px 20px rgba(37, 99, 235, 0.2); transition:all 0.3s;">🏥</div>`}
          <h2 class="sidebar-clinic-name" style="font-size:0.95rem; margin:0; font-weight:800; letter-spacing:0.5px; color:#0f172a; text-transform:uppercase; line-height:1.3; margin-bottom:0.5rem; transition:all 0.3s; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;">${window.publicBrand.clinic_name || 'Radiance Derms'}</h2>
          <div id="networkStatusBadge" style="cursor:help; font-size:0.65rem; font-weight:800; letter-spacing:1px; background: #ecfdf5; color:#059669; padding: 4px 10px; border-radius: 20px; display: inline-flex; align-items: center; gap: 6px; border: 1px solid #a7f3d0; transition:all 0.3s; white-space:nowrap;" title="Checking Network..."><i class="fas fa-wifi" id="networkWifiIcon"></i> <span id="networkStatusText" class="status-text">ONLINE</span></div>
        </div>
          
          <div class="toggle-btn-container" style="padding: 0 1.5rem 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; transition: padding 0.3s;">
              <button onclick="toggleSidebar()" class="advanced-toggle-btn" title="Toggle Menu">
                <i class="${localStorage.getItem('sidebarCollapsed') === 'true' ? 'fas fa-indent' : 'fas fa-outdent'}" id="advancedToggleIcon"></i> 
                <span id="advancedToggleText">${localStorage.getItem('sidebarCollapsed') === 'true' ? 'OPEN' : 'CLOSE'}</span>
              </button>
            </div>

          <div class="sidebar-nav" id="navMenu" style="flex:1; overflow-y:auto; padding:1.5rem 1rem 0 1rem; background: #ffffff;"></div>
          
          <div class="sidebar-footer" style="padding:1.5rem; background: #ffffff; border-top:1px solid #e2e8f0; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:1rem;">
          <div style="display:flex; align-items:center; width:100%; gap:12px; transition:all 0.3s;" id="footerProfileRow">
            <div style="min-width:40px; height:40px; border-radius:10px; background:linear-gradient(135deg, #0ea5e9, #2563eb); color:white; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.1rem;">${currentUser.name.charAt(0).toUpperCase()}</div>
            <div style="text-align:left; flex:1; overflow:hidden;" class="footer-profile-text">
              <p style="margin:0; color:#0f172a; font-weight:700; font-size:0.9rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${currentUser.name}</p>
              <p style="margin:0; color:#64748b; font-size:0.75rem; text-transform:capitalize;">${currentUser.role}</p>
            </div>
          </div>
          <button onclick="logout()" class="logout-btn" data-tooltip="Secure Logout" style="width:100%; padding:0.6rem; border-radius:8px; border:none; background:#fee2e2; color:#ef4444; font-weight:600; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px;" onmouseover="this.style.background='#ef4444'; this.style.color='white'" onmouseout="this.style.background='#fee2e2'; this.style.color='#ef4444'" title="Logout"><i class="fas fa-sign-out-alt"></i> <span class="logout-text">Logout</span></button>
        </div>
      </div>
      <div class="main-content" id="mainContent"></div>
    </div>
  `;
  
  // Build Nav based on Role
  let navHTML = '';
  const r = currentUser.role;

  if(r==='Admin') navHTML += `<div class="nav-label">System</div><button class="nav-item" onclick="nav('admin')" data-tooltip="Admin Dashboard"><i class="fas fa-chart-pie nav-icon"></i> <span class="nav-text">Admin Dashboard</span></button>`;
  if(r==='Admin' || r==='Receptionist') navHTML += `<div class="nav-label">Front Desk</div><button class="nav-item" onclick="nav('reception')" data-tooltip="Appointments"><i class="fas fa-calendar-check nav-icon"></i> <span class="nav-text">Appointments</span></button>`;
  if(r==='Admin' || r==='Doctor') navHTML += `<div class="nav-label">Clinical</div><button class="nav-item" onclick="nav('doctor')" data-tooltip="Doctor Dashboard"><i class="fas fa-user-md nav-icon"></i> <span class="nav-text">Doctor Dashboard</span></button>`;
  if(r==='Admin' || r==='Lab Scientist') navHTML += `<div class="nav-label">Laboratory</div><button class="nav-item" onclick="nav('lab')" data-tooltip="Lab Dashboard"><i class="fas fa-flask nav-icon"></i> <span class="nav-text">Lab Dashboard</span></button>`;
  if(r==='Admin' || r==='Pharmacy' || r==='Receptionist') navHTML += `<div class="nav-label">Pharmacy</div><button class="nav-item" onclick="nav('pharmacy')" data-tooltip="Pharmacy Dashboard"><i class="fas fa-pills nav-icon"></i> <span class="nav-text">Pharmacy Dashboard</span></button>`;
  if(r==='Admin' || r==='Nurse') navHTML += `<div class="nav-label">Nursing</div><button class="nav-item" onclick="nav('nurse')" data-tooltip="Nursing Dashboard"><i class="fas fa-user-nurse nav-icon"></i> <span class="nav-text">Nursing Dashboard</span></button>`;
  if(r==='Admin' || r==='Receptionist') navHTML += `<div class="nav-label">Finance</div><button class="nav-item" onclick="nav('billing')" data-tooltip="Billing & Checkout"><i class="fas fa-file-invoice-dollar nav-icon"></i> <span class="nav-text">Billing & Checkout</span></button>`;
  
  document.getElementById('navMenu').innerHTML = navHTML;
  monitorNetworkStatus();
}

window.logout = function() {
  localStorage.clear();
  window.location.reload();
}

window.nav = function(route) {
  const page = document.getElementById('mainContent');
  page.innerHTML = '<div style="text-align:center; padding:3rem; color:#888;">Loading...</div>';
  
  // Deselect all
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  // Select active
  const activeBtn = Array.from(document.querySelectorAll('.nav-item')).find(el => el.getAttribute('onclick') === `nav('${route}')`);
  if(activeBtn) activeBtn.classList.add('active');

  // Route Handling (To be implemented)
  if (route === 'admin') renderAdmin(page);
  else if (route === 'reception') renderReception(page);
  else if (route === 'doctor') renderDoctor(page);
  else if (route === 'lab') renderLab(page);
  else if (route === 'pharmacy') renderPharmacy(page);
  else if (route === 'nurse') renderNurse(page);
  else if (route === 'billing') renderBilling(page);
}

window.initApp = async function() {
  try {
    const res = await fetch(`${API_URL}/public/branding`);
    if (res.ok) window.publicBrand = await res.json();
  } catch(e) { console.error("Branding fetch failed", e); }
  
  const userStr = localStorage.getItem('dcms_user');
  if(!userStr) return renderLogin();
  
  currentUser = JSON.parse(userStr);
  renderLayout();
  startNetworkMonitor();
  
  const mainContent = document.getElementById('mainContent');
  if (mainContent) {
    mainContent.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; height:100%;"><i class="fas fa-spinner fa-spin fa-3x" style="color:#3b82f6;"></i><h3 style="margin-left:1rem; color:#64748b;">Loading System Data...</h3></div>`;
  }
  
  try {
    // Fetch common data concurrently based on role
    const fetchPromises = [];
    fetchPromises.push(apiFetch('/settings').then(res => sysSettings = res).catch(e => { console.error("Settings fetch failed", e); toast("Failed to load settings from server. Check your connection."); return {}; }));
    
    if (['Admin', 'Receptionist', 'Doctor'].includes(currentUser.role)) {
      fetchPromises.push(apiFetch('/patients').then(res => allPatients = res).catch(e => { console.error("Data fetch failed", e); toast("Failed to load data from server. Check your connection."); return []; }));
      fetchPromises.push(apiFetch('/appointments').then(res => allAppointments = res).catch(e => { console.error("Data fetch failed", e); toast("Failed to load data from server. Check your connection."); return []; }));
    }
    if (['Admin', 'Doctor'].includes(currentUser.role)) {
      fetchPromises.push(apiFetch('/consultations/lab_catalog').then(res => labCatalog = res).catch(e => { console.error("Data fetch failed", e); toast("Failed to load data from server. Check your connection."); return []; }));
      fetchPromises.push(apiFetch('/consultations/pharmacy_inventory').then(res => pharmacyInventory = res).catch(e => { console.error("Data fetch failed", e); toast("Failed to load data from server. Check your connection."); return []; }));
      fetchPromises.push(apiFetch('/consultations/treatment_catalog').then(res => treatmentCatalog = res).catch(e => { console.error("Data fetch failed", e); toast("Failed to load data from server. Check your connection."); return []; }));
    }
    
    await Promise.all(fetchPromises);
    
    // Default Route
    if (currentUser.role === 'Admin') nav('admin');
    else if (currentUser.role === 'Receptionist') nav('reception');
    else if (currentUser.role === 'Doctor') nav('doctor');
    else if (currentUser.role === 'Lab Scientist') nav('lab');
    else if (currentUser.role === 'Pharmacy') nav('pharmacy');
    else if (currentUser.role === 'Nurse') nav('nurse');

  } catch(err) {
    toast("Failed to load initial data");
  }
}

initApp();

// Placeholder route functions
let currentAdminTab = 'reports';

function renderAdmin(page) {
  page.innerHTML = `
    <div class="page-header">
      <div><div class="page-title">Admin Dashboard</div></div>
    </div>
    <div style="display:flex; gap:1rem; border-bottom:1px solid #e2e8f0; margin-bottom:1.5rem;">
      <button class="btn ${currentAdminTab==='reports'?'btn-primary':'btn-secondary'}" onclick="setAdminTab('reports')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;">Reports</button>
      <button class="btn ${currentAdminTab==='users'?'btn-primary':'btn-secondary'}" onclick="setAdminTab('users')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;">User Management</button>
      <button class="btn ${currentAdminTab==='settings'?'btn-primary':'btn-secondary'}" onclick="setAdminTab('settings')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;">Settings & Catalog</button>
      <button class="btn ${currentAdminTab==='data'?'btn-primary':'btn-secondary'}" onclick="setAdminTab('data')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;">System Data</button>
    </div>
    <div id="adminTabContent"></div>
  `;
  const content = document.getElementById('adminTabContent');
  if(currentAdminTab === 'reports') renderAdminReports(content);
  else if(currentAdminTab === 'users') renderAdminUsers(content);
  else if(currentAdminTab === 'settings') renderAdminSettings(content);
  else renderAdminData(content);
}

window.setAdminTab = function(tab) {
  currentAdminTab = tab;
  renderAdmin(document.getElementById('mainContent'));
}

function renderAdminReports(container) {
  container.innerHTML = `<div id="adminReportsContainer">
      <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
        <div>
          <div class="page-title">Clinic Performance Overview</div>
          <div style="color:#64748b; font-size:0.9rem; margin-top:0.25rem;">Real-time analytics and revenue tracking</div>
        </div>
        <div style="display:flex; gap:10px;" class="no-print">
          <button class="btn btn-secondary" onclick="exportReportsCSV()" style="display:flex; align-items:center; gap:8px;"><i class="fas fa-file-csv"></i> Export CSV</button>
          <button class="btn btn-primary" onclick="window.print()" style="display:flex; align-items:center; gap:8px;"><i class="fas fa-print"></i> Save PDF</button>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.5rem; margin-bottom:2rem;">
        
        <div class="card" style="padding:1.5rem; display:flex; align-items:center; gap:1.5rem; border-left:4px solid #3b82f6;">
          <div style="width:50px; height:50px; border-radius:12px; background:#eff6ff; color:#3b82f6; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">
            <i class="fas fa-users"></i>
          </div>
          <div>
            <div style="color:#64748b; font-size:0.85rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Total Patients</div>
            <div style="font-size:1.75rem; font-weight:700; color:#0f172a; line-height:1;" id="rPat">--</div>
          </div>
        </div>

        <div class="card" style="padding:1.5rem; display:flex; align-items:center; gap:1.5rem; border-left:4px solid #10b981;">
          <div style="width:50px; height:50px; border-radius:12px; background:#ecfdf5; color:#10b981; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">
            <i class="fas fa-wallet"></i>
          </div>
          <div>
            <div style="color:#64748b; font-size:0.85rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Total Revenue</div>
            <div style="font-size:1.5rem; font-weight:700; color:#0f172a; line-height:1;" id="rRev">--</div>
          </div>
        </div>

        <div class="card" style="padding:1.5rem; display:flex; align-items:center; gap:1.5rem; border-left:4px solid #8b5cf6;">
          <div style="width:50px; height:50px; border-radius:12px; background:#f5f3ff; color:#8b5cf6; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">
            <i class="fas fa-flask"></i>
          </div>
          <div>
            <div style="color:#64748b; font-size:0.85rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Lab Tests Completed</div>
            <div style="font-size:1.75rem; font-weight:700; color:#0f172a; line-height:1;" id="rLab">--</div>
          </div>
        </div>

        <div class="card" style="padding:1.5rem; display:flex; align-items:center; gap:1.5rem; border-left:4px solid #f59e0b;">
          <div style="width:50px; height:50px; border-radius:12px; background:#fffbeb; color:#f59e0b; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">
            <i class="fas fa-pills"></i>
          </div>
          <div>
            <div style="color:#64748b; font-size:0.85rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Prescriptions Dispensed</div>
            <div style="font-size:1.75rem; font-weight:700; color:#0f172a; line-height:1;" id="rRx">--</div>
          </div>
        </div>

      </div>

      <div style="display:grid; grid-template-columns: 2fr 1fr; gap:1.5rem;" class="chart-grid">
        <div class="card" style="padding:2rem;">
          <h3 style="color:#1e293b; font-size:1.1rem; margin-bottom:1.5rem; font-weight:600;">Revenue & Patient Trends</h3>
          <div style="position: relative; height:350px; width:100%;">
            <canvas id="lineChart"></canvas>
          </div>
        </div>
        <div class="card" style="padding:2rem;">
          <h3 style="color:#1e293b; font-size:1.1rem; margin-bottom:1.5rem; font-weight:600;">Top Diagnoses</h3>
          <div style="position: relative; height:350px; width:100%;">
            <canvas id="donutChart"></canvas>
          </div>
        </div>
      </div>
    `;
  
    apiFetch('/admin/reports').then(data => {
    window.reportDataCache = data;
      document.getElementById('rPat').innerText = data.patients;
      document.getElementById('rRev').innerText = 'Le ' + (data.revenue || 0).toLocaleString();
      document.getElementById('rLab').innerText = data.labs;
      document.getElementById('rRx').innerText = data.prescriptions;
  
      if (window.Chart) {
        if (window.adminLineChart) window.adminLineChart.destroy();
        if (window.adminDonutChart) window.adminDonutChart.destroy();
  
        window.adminLineChart = new Chart(document.getElementById('lineChart'), {
          type: 'line',
          data: {
            labels: data.chartData.labels,
            datasets: [
              { label: 'Revenue', data: data.chartData.revenue, borderColor: '#10b981', backgroundColor: '#10b98122', fill: true, tension: 0.4 },
              { label: 'Patients', data: data.chartData.patients, borderColor: '#3b82f6', backgroundColor: '#3b82f622', fill: true, tension: 0.4 }
            ]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }
        });
  
        window.adminDonutChart = new Chart(document.getElementById('donutChart'), {
          type: 'doughnut',
          data: {
            labels: data.diagnosisData.labels,
            datasets: [{
              data: data.diagnosisData.data,
              backgroundColor: ['#3b82f6', '#8b5cf6', '#f43f5e', '#f59e0b', '#10b981'],
              borderWidth: 0
            }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, cutout: '70%' }
        });
      }
    });
}


function renderAdminUsers(container) {
  container.innerHTML = `
    <div class="card" style="margin-bottom:1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
      <h3 style="margin:0; color:#1e293b;">System Users & Access Control</h3>
      <div style="display:flex; gap:1rem; align-items:center;">
        <input type="text" placeholder="Search users..." style="padding:0.5rem; border-radius:8px; border:1px solid #cbd5e1; min-width:250px;" oninput="filterTable('admUserTb', this.value)">
        <button class="btn btn-primary" onclick="addUser()">+ Add New User</button>
      </div>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr style="color:#64748b; font-size:0.8rem; letter-spacing:0.05em; text-transform:uppercase;">
              <th>Name & Email</th>
              <th>Role / Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="admUserTb"><tr><td colspan="4" style="text-align:center; padding:2rem;">Loading users...</td></tr></tbody>
        </table>
      </div>
    </div>
  `;

  apiFetch('/users').then(users => {
    const tb = document.getElementById('admUserTb');
    if (!tb) return;
    
    const rCol = {
      'Admin': '#fef3c7', 'Doctor': '#dbeafe', 'Receptionist': '#fce7f3',
      'Nurse': '#e0e7ff', 'Pharmacy': '#ffedd5', 'Lab Scientist': '#ede9fe'
    };
    
    tb.innerHTML = users.map(u => `
      <tr>
        <td style="padding:1rem;">
          <div style="font-weight:600; color:#0f172a;">${u.name}</div>
          <div style="font-size:0.85rem; color:#64748b;">${u.email}</div>
        </td>
        <td style="padding:1rem;">
          <span style="background:${rCol[u.role]||'#f1f5f9'}; padding:4px 10px; border-radius:12px; font-size:0.8rem; font-weight:600; color:#334155;">${u.role}</span>
        </td>
        <td style="padding:1rem;">
          <span style="color:${u.status==='active'?'#16a34a':'#dc2626'}; font-weight:600; font-size:0.85rem;">${u.status}</span>
        </td>
        <td style="padding:1rem;">
          <div style="display:flex; gap:0.5rem;">
            ${u.status==='active' ? 
              `<button class="btn btn-sm" style="background:#f1f5f9; color:#475569;" onclick="toggleUserStatus('${u.id}', 'suspended')">Suspend</button>` : 
              `<button class="btn btn-sm" style="background:#ecfdf5; color:#10b981;" onclick="toggleUserStatus('${u.id}', 'active')">Restore</button>`
            }
            <button class="btn btn-sm" style="background:#fee2e2; color:#ef4444; border:none;" onclick="delUser('${u.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  });
}

function renderAdminSettings(container) {
  window.tempBase64Logo = sysSettings.clinic_logo || ''; // Initialize with existing logo
  
  container.innerHTML = `
    <div class="card" style="margin-bottom:1.5rem; padding:2rem;">
      <h3 style="margin-bottom:1.5rem; color:#1e293b; font-size:1.1rem; font-weight:600;">System Settings & Clinic Info</h3>
      
      <div style="display:flex; gap:2rem; align-items:flex-start; margin-bottom:2rem; flex-wrap:wrap;">
        <div style="flex:0 0 120px; text-align:center;">
          <div style="width:120px; height:120px; border-radius:12px; border:2px dashed #cbd5e1; display:flex; align-items:center; justify-content:center; overflow:hidden; background:#f8fafc; margin-bottom:0.5rem;">
            ${sysSettings.clinic_logo ? `<img id="logoPreview" src="${sysSettings.clinic_logo}" style="width:100%; height:100%; object-fit:contain;">` : `<span id="logoPreviewText" style="color:#94a3b8; font-size:0.8rem;">No Logo</span><img id="logoPreview" style="display:none; width:100%; height:100%; object-fit:contain;">`}
          </div>
          <label class="btn btn-sm btn-secondary" style="cursor:pointer; display:block;">
            Upload Logo
            <input type="file" id="admClinicLogoFile" accept="image/*" style="display:none;" onchange="handleLogoUpload(event)">
          </label>
        </div>
        
        <div class="form-grid" style="flex:1; min-width:300px;">
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">Clinic Name</label>
            <input type="text" id="admClinicName" value="${sysSettings.clinic_name || 'Radiance Dermatology & Aesthetic Clinic'}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">Clinic Contact</label>
            <input type="text" id="admClinicContact" value="${sysSettings.clinic_contact || '+232 77 123 456'}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">Clinic Email</label>
            <input type="email" id="admClinicEmail" value="${sysSettings.clinic_email || 'contact@dcmsclinic.com'}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">Default Booking Fee (Le)</label>
            <input type="number" id="admConsFee" value="${sysSettings.consultation_fee || 300}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">Orange Money Agent Code</label>
            <input type="text" id="admOmAgent" value="${sysSettings.om_agent_code || '123456'}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group span2" style="grid-column: span 2;">
            <label style="color:#475569; font-weight:500;">Clinic Address</label>
            <input type="text" id="admClinicAddress" value="${sysSettings.clinic_address || '123 Health Ave, Freetown'}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">Start Time</label>
            <input type="time" id="admStartTime" value="${sysSettings.working_hours_start || '09:00'}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">End Time</label>
            <input type="time" id="admEndTime" value="${sysSettings.working_hours_end || '17:00'}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">Closed Days (comma separated)</label>
            <input type="text" id="admClosedDays" value="${sysSettings.closed_days || 'Sunday'}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;" placeholder="e.g. Saturday, Sunday">
          </div>
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">Slot Duration (minutes)</label>
            <input type="number" id="admSlotDuration" value="${sysSettings.slot_duration || 30}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group span2" style="grid-column: span 2;">
            <label style="color:#475569; font-weight:500;">Clinic Policy & Conduct</label>
            <textarea id="admClinicPolicy" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%; height:100px; resize:vertical;">${sysSettings.clinic_policy || 'Please arrive 10 minutes early. Cancellations require 24h notice.'}</textarea>
          </div>
        </div>
      </div>
      
      <div style="text-align:right;">
        <button class="btn btn-primary" onclick="updateSysSettings(this)" style="padding:0.75rem 2rem;">Save Settings</button>
      </div>
    </div>

    <div class="card" style="padding:2rem;">
      <h3 style="margin-bottom:1.5rem; color:#1e293b; font-size:1.1rem; font-weight:600;">Catalog Management (Pricing & Inventory)</h3>
      <div style="display:flex; gap:1rem; flex-wrap:wrap;">
        <button class="btn" style="background:#f1f5f9; color:#1e293b; border:1px solid #cbd5e1;" onclick="editCatalog('lab_catalog')"><i class="fas fa-flask"></i> Edit Lab Tests</button>
        <button class="btn" style="background:#f1f5f9; color:#1e293b; border:1px solid #cbd5e1;" onclick="editCatalog('pharmacy_inventory')"><i class="fas fa-pills"></i> Edit Pharmacy Drugs</button>
        <button class="btn" style="background:#f1f5f9; color:#1e293b; border:1px solid #cbd5e1;" onclick="editCatalog('treatment_catalog')"><i class="fas fa-hand-holding-medical"></i> Edit Treatments</button>
      </div>
    </div>

      <div class="card" style="margin-top:1.5rem; padding:2rem;">
        <h3 style="margin-bottom:1.5rem; color:#1e293b; font-size:1.1rem; font-weight:600;"><i class="fas fa-download" style="color:#3b82f6; margin-right:8px;"></i>Software Update</h3>
        <div style="display:flex; align-items:center; gap:1.5rem; flex-wrap:wrap;">
          <div style="flex:1; min-width:250px;">
            <p style="color:#475569; margin-bottom:0.5rem; font-size:0.95rem;">Current Version: <strong id="appVersionDisplay">1.0.0</strong></p>
            <p id="updateStatusText" style="color:#64748b; font-size:0.85rem; margin:0;">Click the button to check for the latest version.</p>
            <div id="updateProgressContainer" style="display:none; margin-top:0.75rem; width:100%; background:#e2e8f0; border-radius:6px; height:10px; overflow:hidden;">
              <div id="updateProgressBar" style="width:0%; height:100%; background:linear-gradient(90deg, #3b82f6, #2563eb); transition:width 0.2s ease;"></div>
            </div>
          </div>
          <button id="checkUpdateBtn" class="btn" style="background:linear-gradient(135deg, #3b82f6, #2563eb); color:white; padding:0.75rem 1.5rem; border:none; border-radius:8px; cursor:pointer; font-weight:500;" onclick="checkForAppUpdates()">
            <i class="fas fa-sync-alt" style="margin-right:6px;"></i>Check for Updates
          </button>
        </div>
      </div>

      <div style="margin-top:3rem; padding:2rem; border-radius:12px; border:1px solid #fee2e2; background:#fef2f2;">
        <h3 style="color:#dc2626; margin-bottom:1rem; font-weight:600;"><i class="fas fa-exclamation-triangle"></i> Danger Zone: System Purge</h3>
        <p style="color:#7f1d1d; margin-bottom:1.5rem; font-size:0.95rem;">This action will permanently delete all patient records, appointments, consultations, prescriptions, lab orders, and billing receipts. The system counters will be reset to zero. This action cannot be undone.</p>
        <button class="btn" style="background:#dc2626; color:white; padding:0.75rem 1.5rem;" onclick="openPurgeModal()">Factory Reset System</button>
      </div>
      
      <div style="margin-top:2rem; padding:1.5rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;">
        <h3 style="color:#1e293b; font-size:1.1rem; font-weight:600; margin-bottom:1rem;"><i class="fas fa-history" style="color:#64748b; margin-right:8px;"></i> System Purge History</h3>
        <div id="purgeLogsContainer">
          <div style="color:#94a3b8; font-size:0.9rem; font-style:italic;">Loading history...</div>
        </div>
      </div>
  `;
  
  apiFetch('/admin/purge-logs')
    .then(logs => {
      const c = document.getElementById('purgeLogsContainer');
      if (!c) return;
      if (!logs || logs.length === 0) {
        c.innerHTML = '<div style="color:#94a3b8; font-size:0.9rem; font-style:italic;">No purge history recorded.</div>';
        return;
      }
      c.innerHTML = logs.map(l => `
        <div style="padding:0.75rem; border-bottom:1px solid #e2e8f0; font-size:0.9rem; display:flex; justify-content:space-between;">
          <div><strong style="color:#dc2626;">${l.adminName || 'Admin'}</strong> (${l.adminEmail || 'N/A'})</div>
          <div style="color:#64748b;">${new Date(l.timestamp).toLocaleString()}</div>
        </div>
      `).join('');
    })
    .catch(err => {
      const c = document.getElementById('purgeLogsContainer');
      if (c) c.innerHTML = '<div style="color:#ef4444; font-size:0.9rem;">Failed to load purge history.</div>';
    });
}

window.toggleUserStatus = async function(id, status) {
  try {
    await apiFetch(`/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({status}) });
    toast("User status updated");
    renderAdmin(document.getElementById('mainContent'));
  } catch(e) { toast(e.message); }
}


window.editCatalog = async function(table) {
  try {
    const items = await apiFetch(`/consultations/${table}`);
    const isPharm = table === 'pharmacy_inventory';
    
    showModal(`
      <div class="modal modal-lg">
        <div class="modal-header"><h3>Edit ${table.replace('_', ' ').toUpperCase()}</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
        <div class="modal-body">
          <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem; padding:1rem; background:#f8fafc; border-radius:8px;">
            <input type="text" id="newCatName" placeholder="New item name..." style="flex:2; padding:0.5rem;">
            <input type="number" id="newCatPrice" placeholder="Price (Le)" style="flex:1; padding:0.5rem;">
            ${isPharm ? `<input type="number" id="newCatStock" placeholder="Stock" style="flex:0.5; padding:0.5rem;">` : ''}
            <button class="btn btn-primary" onclick="addCatalogItem('${table}')">+ Add</button>
          </div>
          <div style="max-height:50vh; overflow-y:auto; padding-right:1rem;">
            ${items.map(i => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem; border-bottom:1px solid #e2e8f0;">
                <div style="flex:1; font-weight:600; color:#334155;">${i.test_name || i.drug_name || i.treatment_name}</div>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span style="font-size:0.8rem; color:#64748b;">Le</span>
                  <input type="number" id="cat_${table}_${i.id}" value="${i.price}" style="width:100px; text-align:right; padding:0.25rem;">
                  ${isPharm ? `<span style="font-size:0.8rem; color:#64748b; margin-left:0.5rem;">Qty:</span><input type="number" id="stock_${table}_${i.id}" value="${i.stock||0}" style="width:60px; text-align:right; padding:0.25rem;">` : ''}
                  <button class="btn btn-sm btn-secondary" onclick="updateCatalogItem(this, '${table}', '${i.id}')">Save</button>
                  <button class="btn btn-sm" style="background:#fee2e2; color:#ef4444; border:none;" onclick="deleteCatalogItem('${table}', '${i.id}')">Del</button>
                </div>
              </div>
            `).join('')}
            ${items.length === 0 ? '<p style="text-align:center; padding:1rem;">No items found.</p>' : ''}
          </div>
        </div>
      </div>
    `);
  } catch(e) { toast(e.message); }
}

window.addCatalogItem = async function(table) {
  const name = document.getElementById('newCatName').value;
  const price = document.getElementById('newCatPrice').value;
  const stockEl = document.getElementById('newCatStock');
  const stock = stockEl ? stockEl.value : null;
  
  if(!name || !price) return toast("Name and price required");
  
  try {
    await apiFetch(`/admin/catalog/${table}`, { method: 'POST', body: JSON.stringify({name, price, stock}) });
    toast("Item added successfully");
    editCatalog(table); // Re-render modal
  } catch(e) { toast(e.message); }
}

window.updateCatalogItem = async function(btn, table, id) {
  const orig = btn.innerText; btn.innerText = '...'; btn.disabled = true;
  const price = document.getElementById(`cat_${table}_${id}`).value;
  const stockEl = document.getElementById(`stock_${table}_${id}`);
  const stock = stockEl ? stockEl.value : null;
  
  try {
    await apiFetch(`/admin/catalog/${table}/${id}`, { method:'PATCH', body:JSON.stringify({price, stock}) });
    toast("Item updated!");
  } catch(e) { toast(e.message); }
  btn.innerText = orig; btn.disabled = false;
}

window.deleteCatalogItem = async function(table, id) {
  if(!confirm("Are you sure you want to delete this item?")) return;
  try {
    await apiFetch(`/admin/catalog/${table}/${id}`, {method:'DELETE'});
    toast("Item deleted");
    editCatalog(table);
  } catch(e) { toast(e.message); }
}

window.delUser = async function(id) {
  if(!confirm('Are you sure you want to delete this user?')) return;
  try {
    await apiFetch(`/users/${id}`, {method:'DELETE'});
    toast("User deleted"); renderAdmin(document.getElementById('mainContent'));
  } catch(err) { toast(err.message); }
}
window.receptionTab = window.receptionTab || 'appointments';

function renderReception(page) {
  const searchTerm = (document.getElementById('receptionSearch') || {value: ''}).value.toLowerCase();
  const apps = allAppointments.filter(a => 
    a.status !== 'Completed' && 
    a.status !== 'Cancelled' &&
    (a.patient_name?.toLowerCase().includes(searchTerm) || a.purpose?.toLowerCase().includes(searchTerm) || a.status?.toLowerCase().includes(searchTerm))
  );
  const fee = sysSettings.consultation_fee || 150000;
  
  page.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
      <div style="display:flex; gap:0.5rem; background:#e2e8f0; padding:4px; border-radius:10px;">
        <button class="btn ${window.receptionTab==='appointments'?'btn-primary':'btn-secondary'}" onclick="setReceptionTab('appointments')" style="border-radius:8px; padding:0.5rem 1.25rem;"><i class="fas fa-calendar-check" style="margin-right:6px;"></i>Appointments & Reception</button>
        <button class="btn ${window.receptionTab==='pharmacy'?'btn-primary':'btn-secondary'}" onclick="setReceptionTab('pharmacy')" style="border-radius:8px; padding:0.5rem 1.25rem;"><i class="fas fa-pills" style="margin-right:6px;"></i>Pharmacy Dashboard</button>
      </div>
      ${window.receptionTab==='appointments' ? `<button class="btn" onclick="openBookAppointmentModal()">+ Book Appointment</button>` : ''}
    </div>

    <div id="receptionTabContent"></div>
  `;

  const container = document.getElementById('receptionTabContent');
  if (window.receptionTab === 'pharmacy') {
    renderPharmacy(container);
  } else {
    container.innerHTML = `
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3>Upcoming Appointments</h3>
          <input type="text" id="receptionSearch" placeholder="Search appointments..." style="padding:0.5rem; border-radius:8px; border:1px solid #cbd5e1; min-width:250px;" oninput="renderReception(document.getElementById('mainContent'))" value="${searchTerm}">
        </div>
        <div class="table-wrap" style="margin-top:1rem;">
          <table>
            <thead><tr><th>Date & Time</th><th>Patient</th><th>Doctor</th><th>Purpose</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${apps.map(a => `<tr>
                <td>${a.date} <br><small style="color:#64748b;">${a.time}</small></td>
                <td><strong>${a.patient_name}</strong></td>
                <td>${a.doctor_name || 'Any'}</td>
                <td>${a.purpose}</td>
                <td>
                  <span class="status-badge" style="background:${a.status==='Approved'?'#d1fae5':a.status==='Rescheduled'?'#e0e7ff':'#fef3c7'}; color:${a.status==='Approved'?'#065f46':a.status==='Rescheduled'?'#3730a3':'#92400e'};">${a.status}</span>
                  ${a.payment_status === 'Unpaid' ? `<br><span style="display:inline-block; margin-top:4px; padding:2px 6px; background:#fee2e2; color:#b91c1c; border-radius:4px; font-size:0.75rem; font-weight:bold;">NLE 300 Due</span>` : ''}
                </td>
                <td>
                  <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
                    ${a.status === 'Pending' ? `
                      <button class="btn btn-sm" style="background:#10b981;" onclick="updateAppointmentStatus('${a.id}', 'Approved')">Approve</button>
                      <button class="btn btn-sm" style="background:#ef4444;" onclick="updateAppointmentStatus('${a.id}', 'Rejected')">Reject</button>
                    ` : ''}
                    ${a.status === 'Approved' || a.status === 'Rescheduled' ? `
                      <button class="btn btn-sm btn-secondary" onclick="printBookingReceipt('${a.patient_id}', '${a.date}', ${fee})">Receipt</button>
                      <button class="btn btn-sm" style="background:#f59e0b;" onclick="updateAppointmentStatus('${a.id}', 'Cancelled')">Cancel</button>
                    ` : ''}
                    <button class="btn btn-sm" style="background:#3b82f6;" onclick="openRescheduleModal('${a.id}', '${a.date}', '${a.time}')">Reschedule</button>
                  </div>
                </td>
              </tr>`).join('')}
              ${apps.length===0?'<tr><td colspan="6" style="text-align:center; padding:2rem;">No upcoming appointments</td></tr>':''}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Add auto-refresh to check for new bookings every 10 seconds
    if (!window.receptionAutoRefresh) {
      window.receptionAutoRefresh = setInterval(async () => {
        if (window.receptionTab === 'appointments') {
          const oldLen = allAppointments.length;
          allAppointments = await apiFetch('/appointments');
          if (allAppointments.length !== oldLen) {
            renderReception(document.getElementById('mainContent'));
            toast("New booking arrived!");
          }
        }
      }, 10000);
    }
  }
}

window.verifyPayment = async function(appId) {
  if(!confirm('Has the Orange Money payment been verified for this booking?')) return;
  try {
    toast("Verifying payment and generating receipt email...");
    await apiFetch(`/appointments/${appId}/verify_payment`, { method: 'PATCH' });
    toast("Payment verified and email sent!");
    allAppointments = await apiFetch('/appointments');
    renderReception(document.getElementById('mainContent'));
  } catch(err) {
    toast(err.message);
  }
};

window.setReceptionTab = function(tab) {
  window.receptionTab = tab;
  renderReception(document.getElementById('mainContent'));
};

window.openBookAppointmentModal = function() {
  const patOpts = allPatients.map(p => `<option value="${p.id}">[${p.id}] ${p.name} (${p.phone})</option>`).join('');
  const fee = sysSettings.consultation_fee || 150000;

  showModal(`
    <div class="modal">
      <div class="modal-header"><h3>Book Appointment</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
      <div class="modal-body">
        <form id="bookAppForm">
          <div class="form-group">
            <label>Select Patient</label>
            <select id="baPat" required>
              <option value="">-- Select Patient --</option>
              ${patOpts}
            </select>
            <small style="display:block; margin-top:5px;"><a href="#" onclick="openAddPatientModal()" style="color:var(--primary)">+ Add New Patient</a></small>
          </div>
          <div class="form-grid">
            <div class="form-group"><label>Purpose</label>
              <select id="baPurpose" required>
                <option>New Patient Consultation</option>
                <option>Follow-up Consultation</option>
                <option>Treatment</option>
              </select>
            </div>
            <div class="form-group"><label>Doctor (Optional)</label><input type="text" id="baDoc" placeholder="Leave blank for any available"></div>
            <div class="form-group"><label>Date</label><input type="date" id="baDate" required></div>
            <div class="form-group"><label>Time</label><input type="time" id="baTime" required></div>
          </div>
          <div style="background:#f8fafc; padding:1rem; border-radius:8px; margin-bottom:1rem; text-align:center;">
            <strong>Booking / Consultation Fee to Collect:</strong><br>
            <span style="font-size:1.5rem; color:var(--primary); font-weight:700;">Le ${parseInt(fee).toLocaleString()}</span>
          </div>
          <button type="submit" class="btn btn-block">Confirm Payment & Book</button>
        </form>
      </div>
    </div>
  `);

  document.getElementById('bookAppForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      btn.disabled = true;
      btn.innerText = 'Booking...';
      
      try {
        const fee = sysSettings.consultation_fee || 150000;
        const patIdObj = document.getElementById('baPat').value;
        const bDateObj = document.getElementById('baDate').value;
        
        let htmlStr = '';
        const patObj = allPatients.find(p => p.id == patIdObj);
        if (patObj && patObj.email) {
           toast("Generating official receipt PDF...");
           htmlStr = buildBookingReceiptHTML(patIdObj, bDateObj, fee);
        }

        await apiFetch('/appointments', {
          method: 'POST',
          body: JSON.stringify({
            patient_id: patIdObj,
            doctor_id: null,
            purpose: document.getElementById('baPurpose').value,
            date: bDateObj,
            time: document.getElementById('baTime').value,
            booking_fee: fee,
            htmlString: htmlStr // The backend will automatically generate the PDF and email it!
          })
        });
        
        toast("Appointment booked! Receipt emailed securely to patient.");
        allAppointments = await apiFetch('/appointments');
        closeModal();
        renderReception(document.getElementById('mainContent'));
        
        // Auto-print receipt simulation
        printBookingReceipt(document.getElementById('baPat').value, document.getElementById('baDate').value, fee);
      } catch(err) { 
        toast(err.message); 
        btn.disabled = false;
        btn.innerText = 'Confirm Payment & Book';
      }
  });
}


window.generatePdfBase64 = function(htmlContent) {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    // html2canvas requires the element to be in the DOM
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    const opt = {
      margin:       0.5,
      filename:     'document.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(container).set(opt).outputPdf('datauristring').then((pdfString) => {
      document.body.removeChild(container);
      const base64 = pdfString.split('base64,')[1];
      resolve(base64);
    }).catch((err) => {
      document.body.removeChild(container);
      reject(err);
    });
  });
};

window.buildPrescriptionHTML = function(myRx) {
  const pName = myRx[0].patient_name;
  const dName = myRx[0].doctor_name;
  const cName = sysSettings.clinic_name || 'Radiance Dermatology & Aesthetic Clinic';
  const cAdd = sysSettings.clinic_address || '123 Health Ave, Freetown';
  const cContact = sysSettings.clinic_contact || '+232 77 123 456';
  const cEmail = sysSettings.clinic_email || 'contact@dcmsclinic.com';
  const logo = sysSettings.clinic_logo ? `<img src="${sysSettings.clinic_logo}" style="max-width:250px; max-height:70px; object-fit:contain; margin-bottom:1rem;">` : '';

  const rxListHTML = myRx.map(rx => `
    <div style="margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid #e2e8f0;">
      <div style="font-size:1.1rem; font-weight:bold;">${rx.drug_name}</div>
      <div style="font-size:0.9rem; margin-top:0.3rem;">
        <strong>Dose/Freq:</strong> ${rx.frequency} &nbsp;|&nbsp; <strong>Route:</strong> ${rx.route} &nbsp;|&nbsp; <strong>Duration:</strong> ${rx.duration}
      </div>
      <div style="font-size:0.9rem; margin-top:0.3rem;"><strong>Instructions:</strong> ${rx.instructions || 'None'}</div>
    </div>
  `).join('');

  return `
    <html><head><title>Prescription</title>
    <style>body{font-family:sans-serif; padding:2rem; max-width:700px; margin:auto;} .header{text-align:center; border-bottom:2px solid #000; padding-bottom:1rem; margin-bottom:2rem;} </style>
    </head><body>
      <div class="header">
        ${logo}
        <h2>${cName.toUpperCase()}</h2>
        <p>${cAdd} | ${cContact} | ${cEmail}</p>
        <h3 style="margin-top:1.5rem;">PRESCRIPTION</h3>
      </div>
      <div style="margin-bottom:2rem;">
        <p><strong>Patient Name:</strong> ${pName}</p>
        <p><strong>Prescribing Doctor:</strong> ${dName}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <div>
        <h4>Medications</h4>
        ${rxListHTML}
      </div>
      <div style="margin-top:4rem; border-top:1px solid #000; padding-top:1rem; display:inline-block; min-width:200px;">
        <p style="margin:0; text-align:center;">Doctor's Signature</p>
      </div>
    </body></html>
  `;
};

window.buildBookingReceiptHTML = function(patId, date, fee) {
  const p = allPatients.find(x=>x.id == patId);
  const cName = sysSettings.clinic_name || 'Radiance Dermatology & Aesthetic Clinic';
  const cAdd = sysSettings.clinic_address || '123 Health Ave, Freetown';
  const cContact = sysSettings.clinic_contact || '+232 77 123 456';
  const cEmail = sysSettings.clinic_email || 'contact@dcmsclinic.com';
  const logoStr = sysSettings.clinic_logo ? `<img src="${sysSettings.clinic_logo}" style="max-width:200px; max-height:60px; object-fit:contain;">` : `<h2 style="margin:0; color:#1e3a8a;">${cName}</h2>`;
  return `
    <html>
      <head>
        <title>Appointment Receipt</title>
        <style>body { font-family: 'Outfit', sans-serif; padding: 2rem; color: #1e293b; max-width:600px; margin:auto; }</style>
      </head>
      <body>
        <div style="text-align:center; margin-bottom:2rem; border-bottom: 2px solid #e2e8f0; padding-bottom:1rem;">
          ${logoStr}
          <p style="color:#64748b; font-size:14px; margin-top:10px;">${cAdd}<br>${cContact}<br>${cEmail}</p>
        </div>
        <h2 style="text-align:center;">BOOKING RECEIPT</h2>
        <div style="margin-top:2rem;">
          <p><strong>Patient:</strong> ${p ? p.name : patId}</p>
          <p><strong>Date of Booking:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Appointment Date:</strong> ${date}</p>
          <hr style="border:none; border-top:1px dashed #cbd5e1; margin:1.5rem 0;">
          <div style="display:flex; justify-content:space-between; font-size:1.2rem; font-weight:bold;">
            <span>Total Consultation Fee:</span>
            <span>Le ${Number(fee).toLocaleString()}</span>
          </div>
          <hr style="border:none; border-top:1px dashed #cbd5e1; margin:1.5rem 0;">
          <p style="text-align:center; color:#64748b; font-size:12px; margin-top:3rem;">Thank you for choosing ${cName}.</p>
        </div>
      </body>
    </html>
  `;
};

window.emailPrescription = async function(consId) {
    try {
      const allRx = await apiFetch('/pharmacy/prescriptions');
      const myRx = allRx.filter(rx => rx.consultation_id == consId);
      
      if (myRx.length === 0) {
        toast("No medications prescribed in this consultation to email.");
        return;
      }
      
      const patId = myRx[0].patient_id;
      const patObj = allPatients.find(p => String(p.id) === String(patId));
      if (!patObj || !patObj.email) {
        toast("Patient does not have an email address on file.");
        return;
      }

      const pName = myRx[0].patient_name;
      const dName = myRx[0].doctor_name;
      
      const cName = sysSettings.clinic_name || 'Radiance Dermatology & Aesthetic Clinic';
      const cAdd = sysSettings.clinic_address || '123 Health Ave, Freetown';
      const cContact = sysSettings.clinic_contact || '+232 77 123 456';
      const cEmail = sysSettings.clinic_email || 'contact@dcmsclinic.com';
      const logo = sysSettings.clinic_logo ? `<img src="${sysSettings.clinic_logo}" style="max-width:250px; max-height:70px; object-fit:contain; margin-bottom:1rem;">` : '';
  
      const rxListHTML = myRx.map(rx => `
        <div style="margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid #e2e8f0;">
          <div style="font-size:1.1rem; font-weight:bold;">${rx.drug_name}</div>
          <div style="font-size:0.9rem; margin-top:0.3rem;">
            <strong>Dose/Freq:</strong> ${rx.frequency} &nbsp;|&nbsp; <strong>Route:</strong> ${rx.route} &nbsp;|&nbsp; <strong>Duration:</strong> ${rx.duration}
          </div>
          <div style="font-size:0.9rem; margin-top:0.3rem;"><strong>Instructions:</strong> ${rx.instructions || 'None'}</div>
        </div>
      `).join('');
  
      const htmlContent = `
        <html><head><title>Prescription</title>
        <style>body{font-family:sans-serif; padding:2rem; max-width:700px; margin:auto;} .header{text-align:center; border-bottom:2px solid #000; padding-bottom:1rem; margin-bottom:2rem;} </style>
        </head><body>
          <div class="header">
            ${logo}
            <h2>${cName.toUpperCase()}</h2>
            <p>${cAdd} | ${cContact} | ${cEmail}</p>
            <h3 style="margin-top:1.5rem;">PRESCRIPTION</h3>
          </div>
          
          <div style="display:flex; justify-content:space-between; margin-bottom:2rem; border:1px solid #000; padding:1rem;">
            <div>
              <p style="margin:0 0 0.5rem 0;"><strong>Patient:</strong> ${pName}</p>
              <p style="margin:0;"><strong>Date:</strong> ${new Date(myRx[0].created_at).toLocaleDateString()}</p>
            </div>
            <div style="text-align:right;">
              <p style="margin:0 0 0.5rem 0;"><strong>Prescriber:</strong> Dr. ${dName}</p>
              <p style="margin:0;"><strong>Cons. ID:</strong> #${consId}</p>
            </div>
          </div>
          
          <div style="margin-bottom:2rem;">
            <h2 style="font-family:serif; font-size:2rem; margin-bottom:1rem;">Rx</h2>
            ${rxListHTML}
          </div>
          
          <div style="margin-top:4rem; border-top:1px solid #000; padding-top:1rem; text-align:right;">
            <p style="margin:0;">Signature: _______________________</p>
          </div>
        </body></html>
      `;

      toast("Generating and emailing Prescription PDF...");
      await apiFetch('/email/send-pdf', {
        method: 'POST',
        body: JSON.stringify({
          to: patObj.email,
          subject: 'Your Prescription - ' + cName,
          htmlBody: '<p>Please find your prescription attached.</p>',
          htmlString: htmlContent,
          filename: `Prescription_${consId}.pdf`
        })
      });
      toast("Prescription emailed successfully to " + patObj.email);
    } catch(err) {
      toast("Failed to email prescription: " + err.message);
    }
}

window.printPrescription = async function(consId) {
  try {
    toast("Generating Prescription...");
    const allRx = await apiFetch('/pharmacy/prescriptions');
    const myRx = allRx.filter(rx => rx.consultation_id == consId);
    
    if (myRx.length === 0) {
      toast("No medications prescribed in this consultation.");
      return;
    }
    
    const pName = myRx[0].patient_name;
    const dName = myRx[0].doctor_name;
    
    const cName = sysSettings.clinic_name || 'Radiance Dermatology & Aesthetic Clinic';
    const cAdd = sysSettings.clinic_address || '123 Health Ave, Freetown';
  const cContact = sysSettings.clinic_contact || '+232 77 123 456';
  const cEmail = sysSettings.clinic_email || 'contact@dcmsclinic.com';
    const logo = sysSettings.clinic_logo ? `<img src="${sysSettings.clinic_logo}" style="max-width:250px; max-height:70px; object-fit:contain; margin-bottom:1rem;">` : '';

    const rxListHTML = myRx.map(rx => `
      <div style="margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid #e2e8f0;">
        <div style="font-size:1.1rem; font-weight:bold;">${rx.drug_name}</div>
        <div style="font-size:0.9rem; margin-top:0.3rem;">
          <strong>Dose/Freq:</strong> ${rx.frequency} &nbsp;|&nbsp; <strong>Route:</strong> ${rx.route} &nbsp;|&nbsp; <strong>Duration:</strong> ${rx.duration}
        </div>
        <div style="font-size:0.9rem; margin-top:0.3rem;"><strong>Instructions:</strong> ${rx.instructions || 'None'}</div>
      </div>
    `).join('');

    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Prescription</title>
      <style>body{font-family:sans-serif; padding:2rem; max-width:700px; margin:auto;} .header{text-align:center; border-bottom:2px solid #000; padding-bottom:1rem; margin-bottom:2rem;} </style>
      </head><body>
        <div class="header">
          ${logo}
          <h2>${cName.toUpperCase()}</h2>
          <p>${cAdd} | ${cContact} | ${cEmail}</p>
          <h3 style="margin-top:1.5rem;">PRESCRIPTION</h3>
        </div>
        
        <div style="display:flex; justify-content:space-between; margin-bottom:2rem; border:1px solid #000; padding:1rem;">
          <div>
            <p style="margin:0 0 0.5rem 0;"><strong>Patient:</strong> ${pName}</p>
            <p style="margin:0;"><strong>Date:</strong> ${new Date(myRx[0].created_at).toLocaleDateString()}</p>
          </div>
          <div style="text-align:right;">
            <p style="margin:0 0 0.5rem 0;"><strong>Prescriber:</strong> Dr. ${dName}</p>
            <p style="margin:0;"><strong>Cons. ID:</strong> #${consId}</p>
          </div>
        </div>
        
        <div style="margin-bottom:2rem;">
          <h2 style="font-family:serif; font-size:2rem; margin-bottom:1rem;">Rx</h2>
          ${rxListHTML}
        </div>
        
        <div style="margin-top:4rem; border-top:1px dashed #000; padding-top:1rem; display:flex; justify-content:space-between;">
          <div style="width:200px; border-top:1px solid #000; text-align:center; padding-top:0.5rem; margin-top:2rem;">Doctor's Signature</div>
          <div style="font-size:0.8rem; color:#666; max-width:250px;">This prescription is valid only for the patient named above. Please consult the pharmacy for dispensing.</div>
        </div>
      </body></html>
    `);
    win.document.close();
    setTimeout(()=>win.print(), 500);

  } catch(err) {
    toast("Error loading prescription: " + err.message);
  }
}

window.printBookingReceipt = function(patId, date, fee) {
  const p = allPatients.find(x=>x.id == patId);
  const cName = sysSettings.clinic_name || 'Radiance Dermatology & Aesthetic Clinic';
  const cAdd = sysSettings.clinic_address || '123 Health Ave, Freetown';
  const cContact = sysSettings.clinic_contact || '+232 77 123 456';
  const cEmail = sysSettings.clinic_email || 'contact@dcmsclinic.com';
  const logo = sysSettings.clinic_logo ? `<img src="${sysSettings.clinic_logo}" style="max-width:250px; max-height:70px; object-fit:contain; margin-bottom:1rem;">` : '';

  const win = window.open('', '_blank');
  win.document.write(`
    <html><head><title>Booking Receipt</title>
    <style>body{font-family:sans-serif; padding:2rem; max-width:600px; margin:auto;} .header{text-align:center; border-bottom:2px solid #000; padding-bottom:1rem; margin-bottom:2rem;} </style>
    </head><body>
      <div class="header">
        ${logo}
        <h2>${cName.toUpperCase()}</h2>
        <p>${cAdd} | ${cContact} | ${cEmail}</p>
        <h3>BOOKING RECEIPT</h3>
      </div>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Patient:</strong> ${p ? p.name : 'Unknown'}</p>
      <p><strong>Purpose:</strong> Consultation Booking / Registration</p>
      <h2 style="text-align:right">Amount Paid: Le ${parseInt(fee).toLocaleString()}</h2>
      <p style="text-align:center; margin-top:3rem; font-size:12px;">Thank you. Please wait for the doctor.</p>
    </body></html>
  `);
  win.document.close();
  setTimeout(()=>win.print(), 500);
}

window.printClinicalRecordCard = async function(consId) {
  try {
    toast("Generating Patient Record Card...");
    const [consList, allRx, allPatientsList] = await Promise.all([
      apiFetch('/consultations'),
      apiFetch('/pharmacy/prescriptions'),
      apiFetch('/patients')
    ]);
    
    const c = consList.find(x => x.id == consId);
    if (!c) {
      toast("Clinical record not found.");
      return;
    }
    
    const p = allPatientsList.find(x => x.id == c.patient_id);
    const myRx = allRx.filter(rx => rx.consultation_id == consId);
    
    const cName = sysSettings.clinic_name || 'Radiance Dermatology & Aesthetic Clinic';
    const cAdd = sysSettings.clinic_address || '59 Big Waterloo Street, Freetown, Sierra Leone';
    const cContact = sysSettings.clinic_contact || '+232 77 123 456';
    const cEmail = sysSettings.clinic_email || 'contact@dcmsclinic.com';
    const logo = sysSettings.clinic_logo ? `<img src="${sysSettings.clinic_logo}" style="max-height:50px; object-fit:contain;">` : '';

    // Checkboxes parsing
    const parseChecked = (jsonStr, key) => {
      try {
        const obj = JSON.parse(jsonStr);
        return obj && obj[key] ? '☒' : '☐';
      } catch(e) { return '☐'; }
    };
    
    const getOtherText = (jsonStr) => {
      try {
        const obj = JSON.parse(jsonStr);
        return obj && obj.other ? obj.other : (obj && obj.others ? obj.others : '');
      } catch(e) { return ''; }
    };
    
    const getDetailsText = (jsonStr) => {
      try {
        const obj = JSON.parse(jsonStr);
        return obj && obj.details ? obj.details : '';
      } catch(e) { return ''; }
    };

    // Build body map dots SVGs
    let anteriorDotsHTML = '';
    let posteriorDotsHTML = '';
    try {
      const dots = JSON.parse(c.body_map_data_json || '[]');
      dots.forEach(d => {
        const circle = `<circle cx="${d.x}%" cy="${d.y}%" r="5" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />`;
        if (d.type === 'anterior') anteriorDotsHTML += circle;
        else posteriorDotsHTML += circle;
      });
    } catch(e){}

    const anteriorSVG = `
      <svg viewBox="0 0 200 300" style="width:180px; height:270px; background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:8px;">
        <circle cx="100" cy="35" r="18" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
        <path d="M 75,60 C 65,60 55,75 50,90 C 45,105 40,130 45,140 C 48,145 53,142 55,135 L 68,95 C 68,120 70,160 72,190 L 60,280 C 58,290 73,290 75,280 L 88,195 L 100,195 L 112,195 L 125,280 C 127,290 142,290 140,280 L 128,190 C 130,160 132,120 132,95 L 145,135 C 147,142 152,145 155,140 C 160,130 155,105 150,90 C 145,75 135,60 125,60 Z" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
        ${anteriorDotsHTML}
      </svg>
    `;

    const posteriorSVG = `
      <svg viewBox="0 0 200 300" style="width:180px; height:270px; background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:8px;">
        <circle cx="100" cy="35" r="18" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
        <path d="M 75,60 C 65,60 55,75 50,90 C 45,105 40,130 45,140 C 48,145 53,142 55,135 L 68,95 C 68,120 70,160 72,190 L 60,280 C 58,290 73,290 75,280 L 88,195 L 100,195 L 112,195 L 125,280 C 127,290 142,290 140,280 L 128,190 C 130,160 132,120 132,95 L 145,135 C 147,142 152,145 155,140 C 160,130 155,105 150,90 C 145,75 135,60 125,60 Z" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
        <line x1="100" y1="60" x2="100" y2="190" stroke="#475569" stroke-dasharray="3,3" stroke-width="1.5"/>
        ${posteriorDotsHTML}
      </svg>
    `;

    const win = window.open('', '_blank');
    win.document.write(`
      <html>
      <head>
        <title>Patient Record Card - ${p ? p.name : 'Clinical Record'}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
          body { font-family: 'Inter', sans-serif; font-size: 11px; line-height: 1.4; color: #000; padding: 1.5cm; }
          .header-table { width: 100%; border-bottom: 3px solid #1e3a8a; padding-bottom: 0.5rem; margin-bottom: 1rem; }
          .section-title { background: #1e3a8a; color: #fff; padding: 4px 8px; font-weight: bold; font-size: 12px; margin-top: 1.2rem; text-transform: uppercase; }
          .grid-table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
          .grid-table td { padding: 5px; border: 1px solid #cbd5e1; }
          .check-item { display: inline-flex; align-items: center; margin-right: 15px; }
          .checkbox { font-size: 14px; margin-right: 4px; font-family: monospace; }
          .text-line { border-bottom: 1px solid #000; display: inline-block; min-width: 150px; }
          .med-table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
          .med-table th, .med-table td { border: 1px solid #000; padding: 6px; text-align: left; }
          .med-table th { background: #f1f5f9; }
          .page-break { page-break-before: always; }
        </style>
      </head>
      <body>
        <!-- Header -->
        <table class="header-table">
          <tr>
            <td>
              ${logo}
              <h2 style="margin:0; color:#1e3a8a; font-size:18px;">${cName}</h2>
              <p style="margin:2px 0 0 0; color:#475569; font-size:10px;">${cAdd}<br>Tel: ${cContact} | Email: ${cEmail}</p>
            </td>
            <td style="text-align:right; vertical-align:bottom; font-size:12px;">
              <strong>PATIENT RECORD CARD</strong><br><br>
              Record No: <span class="text-line" style="min-width:80px; text-align:center;">${c.patient_id}</span><br>
              Date: <span class="text-line" style="min-width:80px; text-align:center;">${new Date(c.created_at).toLocaleDateString()}</span>
            </td>
          </tr>
        </table>

        <!-- Demographics -->
        <div class="section-title">Patient Demographics</div>
        <table class="grid-table">
          <tr>
            <td colspan="2"><strong>Full Name:</strong> ${p ? p.name : 'Unknown'}</td>
            <td><strong>Sex:</strong> 
              <span class="check-item"><span class="checkbox">${c.gender === 'Male' ? '☒' : '☐'}</span> M</span>
              <span class="check-item"><span class="checkbox">${c.gender === 'Female' ? '☒' : '☐'}</span> F</span>
            </td>
          </tr>
          <tr>
            <td><strong>Date of Birth:</strong> ${p ? p.dob || 'N/A' : 'N/A'}</td>
            <td><strong>Age:</strong> ${p ? p.age || 'N/A' : 'N/A'}</td>
            <td><strong>Occupation:</strong> ${p ? p.occupation || 'N/A' : 'N/A'}</td>
          </tr>
          <tr>
            <td colspan="2"><strong>Address:</strong> ${p ? p.address || 'N/A' : 'N/A'}</td>
            <td><strong>Phone No:</strong> ${p ? p.phone || 'N/A' : 'N/A'}</td>
          </tr>
          <tr>
            <td><strong>Next of Kin / Contact:</strong> ${p ? p.nok || 'N/A' : 'N/A'}</td>
            <td><strong>NOK Phone:</strong> ${p ? p.nok_phone || 'N/A' : 'N/A'}</td>
            <td><strong>Referred By:</strong> ${c.referred_by || 'None'}</td>
          </tr>
          <tr>
            <td colspan="3"><strong>Visit Type:</strong>
              <span class="check-item"><span class="checkbox">${c.visit_type === 'New' ? '☒' : '☐'}</span> New</span>
              <span class="check-item"><span class="checkbox">${c.visit_type === 'Follow-up' ? '☒' : '☐'}</span> Follow-up</span>
            </td>
          </tr>
        </table>

        <!-- Presenting Complaint & History -->
        <div class="section-title">Presenting Complaint & History</div>
        <table class="grid-table">
          <tr>
            <td colspan="2" style="height:50px; vertical-align:top;">
              <strong>Presenting Complaint:</strong><br>
              ${c.primary_complaint || 'None'}
            </td>
          </tr>
          <tr>
            <td colspan="2" style="height:70px; vertical-align:top;">
              <strong>History of Presenting Complaint:</strong> <small style="color:#64748b;">(onset, duration, evolution, triggers, itch/pain, prior treatment)</small><br>
              ${c.history_of_presenting_complaint || 'None'}
            </td>
          </tr>
          <tr>
            <td style="width:50%; vertical-align:top;">
              <strong>Past Medical / Dermatological History:</strong><br><br>
              <span class="check-item"><span class="checkbox">${parseChecked(c.past_history_json, 'allergy')}</span> Allergy (asthma / eczema / rhinitis)</span><br>
              <span class="check-item"><span class="checkbox">${parseChecked(c.past_history_json, 'diabetes')}</span> Diabetes</span><br>
              <span class="check-item"><span class="checkbox">${parseChecked(c.past_history_json, 'hypertension')}</span> Hypertension</span><br>
              <span class="check-item"><span class="checkbox">${parseChecked(c.past_history_json, 'hiv')}</span> HIV</span><br>
              <span class="check-item"><span class="checkbox">${parseChecked(c.past_history_json, 'autoimmune')}</span> Autoimmune disease</span><br>
              Other: <span class="text-line" style="min-width:180px;">${getOtherText(c.past_history_json)}</span>
            </td>
            <td style="width:50%; vertical-align:top;">
              <strong>Drug / Allergy History:</strong><br><br>
              <span class="check-item"><span class="checkbox">${parseChecked(c.drug_history_json, 'known_allergy')}</span> Known drug allergy</span><br>
              <span class="check-item"><span class="checkbox">${parseChecked(c.drug_history_json, 'current_meds')}</span> Current medications</span><br>
              <span class="check-item"><span class="checkbox">${parseChecked(c.drug_history_json, 'family_history')}</span> Family history of skin disease</span><br>
              Details: <span class="text-line" style="min-width:180px;">${getDetailsText(c.drug_history_json)}</span>
            </td>
          </tr>
        </table>

        <!-- Page Break -->
        <div class="page-break"></div>

        <!-- Skin Examination -->
        <div class="section-title">Skin Examination</div>
        <table class="grid-table">
          <tr>
            <td style="width:50%; vertical-align:top;">
              <strong>Morphology:</strong><br><br>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                <div><span class="checkbox">${parseChecked(c.morphology_json, 'macule')}</span> Macule</div>
                <div><span class="checkbox">${parseChecked(c.morphology_json, 'papule')}</span> Papule</div>
                <div><span class="checkbox">${parseChecked(c.morphology_json, 'plaque')}</span> Plaque</div>
                <div><span class="checkbox">${parseChecked(c.morphology_json, 'nodule')}</span> Nodule</div>
                <div><span class="checkbox">${parseChecked(c.morphology_json, 'vesicle')}</span> Vesicle</div>
                <div><span class="checkbox">${parseChecked(c.morphology_json, 'bulla')}</span> Bulla</div>
                <div><span class="checkbox">${parseChecked(c.morphology_json, 'pustule')}</span> Pustule</div>
                <div><span class="checkbox">${parseChecked(c.morphology_json, 'wheal')}</span> Wheal</div>
                <div><span class="checkbox">${parseChecked(c.morphology_json, 'scale')}</span> Scale</div>
                <div><span class="checkbox">${parseChecked(c.morphology_json, 'ulcer')}</span> Ulcer</div>
                <div><span class="checkbox">${parseChecked(c.morphology_json, 'crust')}</span> Crust</div>
                <div><span class="checkbox">${parseChecked(c.morphology_json, 'atrophy')}</span> Atrophy</div>
              </div>
              <div style="margin-top:10px;">Other: <span class="text-line" style="min-width:180px;">${getOtherText(c.morphology_json)}</span></div>
            </td>
            <td style="width:50%; vertical-align:top;">
              <strong>Distribution / Pattern:</strong><br><br>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                <div><span class="checkbox">${parseChecked(c.distribution_json, 'localised')}</span> Localised</div>
                <div><span class="checkbox">${parseChecked(c.distribution_json, 'generalised')}</span> Generalised</div>
                <div><span class="checkbox">${parseChecked(c.distribution_json, 'symmetrical')}</span> Symmetrical</div>
                <div><span class="checkbox">${parseChecked(c.distribution_json, 'asymmetrical')}</span> Asymmetrical</div>
                <div><span class="checkbox">${parseChecked(c.distribution_json, 'flexural')}</span> Flexural</div>
                <div><span class="checkbox">${parseChecked(c.distribution_json, 'extensor')}</span> Extensor</div>
                <div><span class="checkbox">${parseChecked(c.distribution_json, 'sun_exposed')}</span> Sun-exposed</div>
                <div><span class="checkbox">${parseChecked(c.distribution_json, 'mucosal')}</span> Mucosal</div>
              </div>
              <div style="margin-top:10px;">Others: <span class="text-line" style="min-width:180px;">${getOtherText(c.distribution_json)}</span></div>
            </td>
          </tr>
          <tr>
            <td colspan="2"><strong>Site(s) Affected:</strong> ${c.site_affected || 'None'}</td>
          </tr>
          <tr>
            <td colspan="2"><strong>Additional Findings:</strong> <small style="color:#64748b;">(hair, nails, mucosae, lymph nodes)</small><br>${c.additional_findings || 'None'}</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align:center;">
              <div style="display:flex; justify-content:center; gap:2cm; padding:10px 0;">
                <div>
                  <div style="font-weight:bold; margin-bottom:5px;">Anterior (Front) Body Map</div>
                  ${anteriorSVG}
                </div>
                <div>
                  <div style="font-weight:bold; margin-bottom:5px;">Posterior (Back) Body Map</div>
                  ${posteriorSVG}
                </div>
              </div>
            </td>
          </tr>
        </table>

        <!-- Assessment -->
        <div class="section-title">Assessment</div>
        <table class="grid-table">
          <tr>
            <td><strong>Working Diagnosis:</strong> ${c.working_diagnosis || 'None'}</td>
            <td><strong>Differential Diagnosis:</strong> ${c.differential_diagnosis || 'None'}</td>
          </tr>
          <tr>
            <td colspan="2">
              <strong>Investigations Ordered:</strong> &nbsp;&nbsp;&nbsp;&nbsp;
              <span class="check-item"><span class="checkbox">${parseChecked(c.investigations_ordered_json, 'scraping')}</span> Skin scraping</span>
              <span class="check-item"><span class="checkbox">${parseChecked(c.investigations_ordered_json, 'biopsy')}</span> Biopsy</span>
              <span class="check-item"><span class="checkbox">${parseChecked(c.investigations_ordered_json, 'bloods')}</span> Bloods</span>
              <span class="check-item"><span class="checkbox">${parseChecked(c.investigations_ordered_json, 'culture')}</span> Culture</span>
              &nbsp;&nbsp; Other: <span class="text-line" style="min-width:100px;">${getOtherText(c.investigations_ordered_json)}</span>
            </td>
          </tr>
        </table>

        <!-- Treatment Plan -->
        <div class="section-title">Treatment Plan</div>
        <table class="med-table">
          <thead>
            <tr>
              <th style="width:40%;">Medication / Treatment</th>
              <th style="width:20%;">Dose / Strength</th>
              <th style="width:40%;">Directions & Duration</th>
            </tr>
          </thead>
          <tbody>
            ${myRx.length ? myRx.map(rx => `
              <tr>
                <td><strong>${rx.drug_name}</strong></td>
                <td>${rx.frequency}</td>
                <td>${rx.route} - ${rx.duration}<br><small>${rx.instructions}</small></td>
              </tr>
            `).join('') : '<tr><td colspan="3" style="text-align:center; color:#64748b;">No medications prescribed.</td></tr>'}
          </tbody>
        </table>
        
        <table class="grid-table" style="margin-top:0.5rem;">
          <tr>
            <td colspan="2"><strong>Patient Education / Counseling Given:</strong><br>${c.patient_education || 'None'}</td>
          </tr>
          <tr>
            <td style="width:50%;">
              <strong>Next Appointment:</strong><br>
              Date: <span class="text-line" style="min-width:100px;">${c.next_appointment_date || 'N/A'}</span><br><br>
              Type: 
              <span class="check-item"><span class="checkbox">${c.next_appointment_type === 'Routine' ? '☒' : '☐'}</span> Routine</span>
              <span class="check-item"><span class="checkbox">${c.next_appointment_type === 'Urgent review' ? '☒' : '☐'}</span> Urgent review</span>
            </td>
            <td style="width:50%; vertical-align:bottom; text-align:center; height:60px;">
              <span class="text-line" style="min-width:180px; font-weight:bold;">Dr. ${c.doctor_name || 'Clinician'}</span><br>
              Clinician Name & Signature
            </td>
          </tr>
        </table>
      </body>
      </html>
    `);
    win.document.close();
    setTimeout(()=>win.print(), 800);
  } catch(e) {
    toast(e.message);
  }
}

window.openAddPatientModal = function() {
  showModal(`
    <div class="modal">
      <div class="modal-header"><h3>Add New Patient</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
      <div class="modal-body">
        <form id="addPatForm">
          <div class="form-group"><label>Name *</label><input id="apName" required></div>
          <div class="form-grid">
            <div class="form-group"><label>Phone</label><input id="apPhone"></div>
            <div class="form-group"><label>Email</label><input type="email" id="apEmail"></div>
            <div class="form-group"><label>Gender</label><select id="apGender"><option>Male</option><option>Female</option></select></div>
            <div class="form-group"><label>Date of Birth</label><input type="date" id="apDob"></div>
          </div>
          <div class="form-group"><label>Residential Address</label><textarea id="apAddr"></textarea></div>
          <button type="submit" class="btn btn-block">Save Patient</button>
        </form>
      </div>
    </div>
  `);
  document.getElementById('addPatForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/patients', {
        method:'POST', body: JSON.stringify({
          name: document.getElementById('apName').value,
          phone: document.getElementById('apPhone').value,
          email: document.getElementById('apEmail').value,
          gender: document.getElementById('apGender').value,
          dob: document.getElementById('apDob').value,
          address: document.getElementById('apAddr').value
        })
      });
      toast("Patient added successfully");
      allPatients = await apiFetch('/patients');
      closeModal();
      openBookAppointmentModal(); // go back to booking
    } catch(err) { toast(err.message); }
  });
}


let currentDocTab = 'queue';
let activeConsAppId = null;
let activeConsPatId = null;

function renderDoctor(page) {
  page.innerHTML = `
    <div class="page-header">
      <div><div class="page-title">Doctor Dashboard</div></div>
    </div>
    <div class="tab-container" style="flex-wrap:wrap;">
      <button class="btn ${currentDocTab==='queue'?'btn-primary':'btn-secondary'}" onclick="setDocTab('queue')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;">Appointment Queue</button>
      <button class="btn ${currentDocTab==='consultation'?'btn-primary':'btn-secondary'}" onclick="setDocTab('consultation')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;">Consultation Form</button>
      <button class="btn ${currentDocTab==='history'?'btn-primary':'btn-secondary'}" onclick="setDocTab('history')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;">Patient History</button>
      <button class="btn ${currentDocTab==='timeline'?'btn-primary':'btn-secondary'}" onclick="setDocTab('timeline')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;"><i class="fas fa-stream"></i> Full Timeline</button>
      <button class="btn ${currentDocTab==='analysis'?'btn-primary':'btn-secondary'}" onclick="setDocTab('analysis')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;">Clinic Analysis</button>
    </div>
    <div id="docTabContent"></div>
  `;
  const content = document.getElementById('docTabContent');
  if(currentDocTab === 'queue') renderDocQueue(content);
  else if(currentDocTab === 'consultation') renderDocConsultation(content);
  else if(currentDocTab === 'history') renderDocHistory(content);
  else if(currentDocTab === 'timeline') renderDocTimeline(content);
  else if(currentDocTab === 'analysis') renderAdminReports(content);
}

window.setDocTab = function(tab) {
  currentDocTab = tab;
  renderDoctor(document.getElementById('mainContent'));
}

function renderDocQueue(container) {
  container.innerHTML = `
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3>Pending Consultations</h3>
        <input type="text" placeholder="Search patients..." style="padding:0.5rem; border-radius:8px; border:1px solid #cbd5e1; min-width:250px;" oninput="filterTable('docAppTb', this.value)">
      </div>
      <div class="table-wrap" style="margin-top:1rem;">
        <table>
          <thead><tr><th>Time</th><th>Patient</th><th>Purpose</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="docAppTb"><tr><td colspan="5">Loading...</td></tr></tbody>
        </table>
      </div>
    </div>
  `;

  const apps = allAppointments.filter(a => 
    a.status === 'Approved' || 
    a.status === 'Scheduled' || 
    a.status === 'Rescheduled' || 
    a.status === 'Awaiting Lab Results' || 
    a.status === 'Lab Results Received'
  );
  document.getElementById('docAppTb').innerHTML = apps.map(a => `
    <tr>
      <td>${a.date} <br><small style="color:#64748b;">${a.time}</small></td>
      <td><strong>${a.patient_name}</strong></td>
      <td>${a.purpose}</td>
      <td>
        <span class="badge" style="background:${a.status==='Lab Results Received'?'#10b981':a.status==='Awaiting Lab Results'?'#3b82f6':'#64748b'}; color:white; font-size:11px; padding:3px 8px; border-radius:4px;">
          ${a.status}
        </span>
      </td>
      <td>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          ${a.status !== 'Approved' && a.status !== 'Awaiting Lab Results' && a.status !== 'Lab Results Received' ? `<button class="btn btn-sm" style="background:#16a34a; color:white; border:none;" onclick="approveApp(this, '${a.id}')">Approve</button>` : ''}
          <button class="btn btn-sm" style="background:#eab308; color:white; border:none;" onclick="rescheduleApp('${a.id}')">Reschedule</button>
          <button class="btn btn-sm btn-primary" onclick="startConsultation('${a.id}', '${a.patient_id}')">
            ${a.status === 'Awaiting Lab Results' || a.status === 'Lab Results Received' ? 'Resume Consultation' : 'Start Consultation'}
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  if (apps.length===0) document.getElementById('docAppTb').innerHTML='<tr><td colspan="5" style="text-align:center; padding:2rem;">No pending appointments</td></tr>';
}

function renderDocHistory(container) {
  container.innerHTML = `
    <div class="card">
      <h3>Recent Patient Consultations</h3>
      <div class="table-wrap" style="margin-top:1rem;">
        <table>
          <thead><tr><th>Date</th><th>Patient</th><th>Diagnosis</th><th>Actions</th></tr></thead>
          <tbody id="docConsTb"><tr><td colspan="4">Loading...</td></tr></tbody>
        </table>
      </div>
    </div>
  `;
  apiFetch('/consultations').then(cons => {
    document.getElementById('docConsTb').innerHTML = cons.map(c => `
      <tr>
        <td>${c.date}</td>
        <td><strong>${c.patient_name}</strong></td>
        <td>${c.working_diagnosis || 'Pending'}</td>
        <td>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-sm btn-secondary" onclick="viewHistory('${c.patient_id}')">View History</button>
            <button class="btn btn-sm btn-secondary" onclick="printPrescription('${c.id}')">Print Rx</button>
          </div>
        </td>
      </tr>
    `).join('');
  });
}

// Global state for dynamic meds
window.docMedCount = 1;
window.addMedRow = function() {
  window.docMedCount++;
  const container = document.getElementById('medBuilder');
  const dOpts = pharmacyInventory.map(d => `<option value="${d.id}" data-name="${d.drug_name}" data-price="${d.price}">${d.drug_name}</option>`).join('');
  
  const html = `
    <div class="form-grid" style="margin-top:1rem; padding-top:1rem; border-top:1px solid #e2e8f0;" id="medrow_${window.docMedCount}">
      <div class="form-group"><label>Medication</label>
        <select class="med-sel"><option value="">Select...</option>${dOpts}</select>
      </div>
      <div class="form-group"><label>Dose</label><input type="text" class="med-dose" placeholder="e.g. 10mg / thin layer"></div>
      <div class="form-group"><label>Frequency</label>
        <select class="med-freq">
          <option>Select...</option><option>Once Daily (OD)</option><option>Twice Daily (BD)</option><option>Three Times Daily (TDS)</option>
          <option>Four Times Daily (QDS)</option><option>Every Morning</option><option>Every Night</option>
          <option>Every Other Day</option><option>Once Weekly</option><option>As Needed (PRN)</option>
        </select>
      </div>
      <div class="form-group"><label>Route</label>
        <select class="med-route">
          <option>Select...</option><option>Topical</option><option>Oral</option><option>Injection (IM)</option>
          <option>Injection (IV)</option><option>Subcutaneous</option><option>Intralesional</option>
        </select>
      </div>
      <div class="form-group"><label>Duration</label>
        <select class="med-dur">
          <option>Select...</option><option>3 Days</option><option>5 Days</option><option>7 Days</option><option>10 Days</option>
          <option>14 Days</option><option>21 Days</option><option>1 Month</option><option>2 Months</option>
          <option>3 Months</option><option>Until Review</option>
        </select>
      </div>
      <div class="form-group"><label>Instructions</label>
        <select class="med-inst">
          <option>Select...</option>
          <option>Apply a thin layer to the affected area.</option><option>Apply after washing and drying the skin.</option>
          <option>Take with food.</option><option>Take after meals.</option><option>Take before meals.</option>
          <option>Take at bedtime.</option><option>Avoid direct sunlight during treatment.</option>
          <option>Complete the full course of medication.</option><option>Avoid contact with the eyes.</option>
          <option>Keep the treated area clean and dry.</option>
        </select>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);
}

function renderDocConsultation(container) {
  if (!activeConsAppId || !activeConsPatId) {
    container.innerHTML = `<div class="card" style="text-align:center; padding:3rem; color:#64748b;">Please start a consultation from the Appointment Queue.</div>`;
    return;
  }
  
  const p = allPatients.find(x => x.id == activeConsPatId);
  const dOpts = pharmacyInventory.map(d => `<option value="${d.id}" data-name="${d.drug_name}" data-price="${d.price}">${d.drug_name}</option>`).join('');
  const labOpts = labCatalog.map(l => `<label class="checkbox-item"><input type="checkbox" name="c_lab" value="${l.id}" data-name="${l.test_name}" data-price="${l.price}"> ${l.test_name}</label>`).join('');
  const txOpts = treatmentCatalog.map(t => `<label class="checkbox-item"><input type="checkbox" name="c_tx" value="${t.id}" data-name="${t.treatment_name}" data-price="${t.price}"> ${t.treatment_name}</label>`).join('');
  window.docMedCount = 1;
  window.bodyMapDots = [];

  container.innerHTML = `
    <!-- SECTION 1: DEMOGRAPHIC INFO -->
    <div class="card" style="margin-bottom:1.5rem;">
      <h3 style="color:var(--primary); font-size:1.1rem; margin-bottom:1rem; text-transform:uppercase; letter-spacing:0.05em; border-bottom:2px solid var(--border-color); padding-bottom:0.5rem;"><i class="fas fa-id-card"></i> 1. Patient Demographics</h3>
      
      <div style="background:#f8fafc; padding:1.2rem; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:1.2rem; display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1.2rem; font-size:14px;">
        <div><strong>Patient Name:</strong> <span style="color:#334155;">${p.name}</span></div>
        <div><strong>Age / Date of Birth:</strong> <span style="color:#334155;">${p.age || 'N/A'} yrs / ${p.dob || 'N/A'}</span></div>
        <div><strong>Gender:</strong> <span style="color:#334155;">${p.gender || 'Not specified'}</span></div>
        <div><strong>Phone No:</strong> <span style="color:#334155;">${p.phone || 'N/A'}</span></div>
        <div style="grid-column: 1 / -1;"><strong>Residential Address:</strong> <span style="color:#334155;">${p.address || 'N/A'}</span></div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label>Sex (On Record Card)</label>
          <div style="display:flex; gap:1.5rem; padding:0.5rem 0;">
            <label class="checkbox-item"><input type="radio" name="cf_gender" value="Male" ${p.gender==='Male'?'checked':''}> Male</label>
            <label class="checkbox-item"><input type="radio" name="cf_gender" value="Female" ${p.gender==='Female'?'checked':''}> Female</label>
          </div>
        </div>
        <div class="form-group">
          <label>Visit Type</label>
          <div style="display:flex; gap:1.5rem; padding:0.5rem 0;">
            <label class="checkbox-item"><input type="radio" name="cf_visit" value="New" checked> New Visit</label>
            <label class="checkbox-item"><input type="radio" name="cf_visit" value="Follow-up"> Follow-up Visit</label>
          </div>
        </div>
        <div class="form-group"><label>Referred By</label><input type="text" id="cf_ref" placeholder="Referred by physician or other source..."></div>
        <div class="form-group"><label>Occupation</label><input type="text" id="cf_occupation" placeholder="Patient's occupation..."></div>
        <div class="form-group"><label>Next of Kin / Contact</label><input type="text" id="cf_nok" placeholder="NOK Name & relationship..." value="${p.nok || ''}"></div>
        <div class="form-group"><label>NOK Phone No.</label><input type="text" id="cf_nok_phone" placeholder="NOK telephone..." value="${p.nok_phone || ''}"></div>
      </div>
    </div>

    <!-- SECTION 2: PRESENTING COMPLAINT & HISTORY -->
    <div class="card" style="margin-bottom:1.5rem;">
      <h3 style="color:var(--primary); font-size:1.1rem; margin-bottom:1rem; text-transform:uppercase; letter-spacing:0.05em; border-bottom:2px solid var(--border-color); padding-bottom:0.5rem;"><i class="fas fa-history"></i> 2. Presenting Complaint & History</h3>
      
      <div class="form-group">
        <label>Presenting Complaint</label>
        <textarea id="cf_primary" rows="2" placeholder="Primary complaint described by the patient..."></textarea>
      </div>

      <div class="form-group">
        <label>History of Presenting Complaint (Onset, duration, evolution, triggers, itch/pain, prior treatment)</label>
        <textarea id="cf_history" rows="3" placeholder="Describe the chronological history of the skin condition, including onset, duration, triggers, itch/pain level, prior treatments, etc..."></textarea>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem; margin-top:1.5rem;">
        <div style="background:#f8fafc; padding:1.2rem; border-radius:8px; border:1px solid #e2e8f0;">
          <strong style="display:block; margin-bottom:0.8rem; color:#1e293b; font-size:14px;">Past Medical / Dermatological History</strong>
          <div style="display:grid; grid-template-columns:1fr; gap:0.5rem;">
            <label class="checkbox-item"><input type="checkbox" id="ph_allergy"> Allergy (asthma / eczema / rhinitis)</label>
            <label class="checkbox-item"><input type="checkbox" id="ph_diabetes"> Diabetes</label>
            <label class="checkbox-item"><input type="checkbox" id="ph_hypertension"> Hypertension</label>
            <label class="checkbox-item"><input type="checkbox" id="ph_hiv"> HIV</label>
            <label class="checkbox-item"><input type="checkbox" id="ph_autoimmune"> Autoimmune disease</label>
            <div style="margin-top:0.3rem;">
              <label style="font-size:12px; font-weight:500;">Other History Detail:</label>
              <input type="text" id="ph_other_val" placeholder="Specify other conditions..." style="padding:0.4rem; font-size:13px; margin-top:3px;">
            </div>
          </div>
        </div>

        <div style="background:#f8fafc; padding:1.2rem; border-radius:8px; border:1px solid #e2e8f0;">
          <strong style="display:block; margin-bottom:0.8rem; color:#1e293b; font-size:14px;">Drug / Allergy History</strong>
          <div style="display:grid; grid-template-columns:1fr; gap:0.5rem;">
            <label class="checkbox-item"><input type="checkbox" id="dh_allergy"> Known drug allergy (specify below)</label>
            <label class="checkbox-item"><input type="checkbox" id="dh_meds"> Current medications (specify below)</label>
            <label class="checkbox-item"><input type="checkbox" id="dh_family"> Family history of skin disease</label>
            <div style="margin-top:0.5rem;">
              <label style="font-size:12px; font-weight:500;">Details / Meds / Allergies List:</label>
              <textarea id="dh_details" rows="2" placeholder="List specific drug allergies, current treatments, or family history..." style="font-size:13px; padding:0.5rem; margin-top:3px;"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 3: SKIN EXAMINATION & BODY MAP -->
    <div class="card" style="margin-bottom:1.5rem;">
      <h3 style="color:var(--primary); font-size:1.1rem; margin-bottom:1rem; text-transform:uppercase; letter-spacing:0.05em; border-bottom:2px solid var(--border-color); padding-bottom:0.5rem;"><i class="fas fa-stethoscope"></i> 3. Skin Examination</h3>
      
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem;">
        <div style="background:#fcfaf2; padding:1.2rem; border-radius:8px; border:1px solid #fef08a;">
          <strong style="display:block; margin-bottom:0.8rem; color:#854d0e; font-size:14px;">Morphology</strong>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.4rem;">
            <label class="checkbox-item"><input type="checkbox" id="m_macule"> Macule</label>
            <label class="checkbox-item"><input type="checkbox" id="m_papule"> Papule</label>
            <label class="checkbox-item"><input type="checkbox" id="m_plaque"> Plaque</label>
            <label class="checkbox-item"><input type="checkbox" id="m_nodule"> Nodule</label>
            <label class="checkbox-item"><input type="checkbox" id="m_vesicle"> Vesicle</label>
            <label class="checkbox-item"><input type="checkbox" id="m_bulla"> Primary Bulla</label>
            <label class="checkbox-item"><input type="checkbox" id="m_pustule"> Pustule</label>
            <label class="checkbox-item"><input type="checkbox" id="m_wheal"> Wheal</label>
            <label class="checkbox-item"><input type="checkbox" id="m_scale"> Scale</label>
            <label class="checkbox-item"><input type="checkbox" id="m_ulcer"> Ulcer</label>
            <label class="checkbox-item"><input type="checkbox" id="m_crust"> Crust</label>
            <label class="checkbox-item"><input type="checkbox" id="m_atrophy"> Atrophy</label>
          </div>
          <div style="margin-top:0.8rem;">
            <label style="font-size:12px; font-weight:500; color:#854d0e;">Other Morphology:</label>
            <input type="text" id="m_other_val" placeholder="Specify other lesions..." style="padding:0.4rem; font-size:13px; margin-top:3px; background:#fff;">
          </div>
        </div>

        <div style="background:#f2fcfc; padding:1.2rem; border-radius:8px; border:1px solid #a5f3fc;">
          <strong style="display:block; margin-bottom:0.8rem; color:#0e7490; font-size:14px;">Distribution / Pattern</strong>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.4rem;">
            <label class="checkbox-item"><input type="checkbox" id="d_localised"> Localised</label>
            <label class="checkbox-item"><input type="checkbox" id="d_generalised"> Generalised</label>
            <label class="checkbox-item"><input type="checkbox" id="d_symmetrical"> Symmetrical</label>
            <label class="checkbox-item"><input type="checkbox" id="d_asymmetrical"> Asymmetrical</label>
            <label class="checkbox-item"><input type="checkbox" id="d_flexural"> Flexural</label>
            <label class="checkbox-item"><input type="checkbox" id="d_extensor"> Extensor</label>
            <label class="checkbox-item"><input type="checkbox" id="d_sun_exposed"> Sun-exposed</label>
            <label class="checkbox-item"><input type="checkbox" id="d_mucosal"> Mucosal involvement</label>
          </div>
          <div style="margin-top:0.8rem;">
            <label style="font-size:12px; font-weight:500; color:#0e7490;">Others:</label>
            <input type="text" id="d_others_val" placeholder="Specify other pattern..." style="padding:0.4rem; font-size:13px; margin-top:3px; background:#fff;">
          </div>
        </div>
      </div>

      <div class="form-grid" style="margin-top:1.5rem;">
        <div class="form-group"><label>Site(s) Affected</label><input type="text" id="cf_site" placeholder="Describe anatomical sites (e.g. face, scalp, back of hands)..."></div>
        <div class="form-group"><label>Additional Findings (hair, nails, mucosae, lymph nodes)</label><input type="text" id="cf_findings" placeholder="Observe and record nail changes, hair loss, lymphadenopathy, etc..."></div>
      </div>

      <!-- Body Map Interactive SVGs -->
      <div style="margin-top:1.5rem; background:#f8fafc; padding:1.2rem; border-radius:8px; border:1px solid #cbd5e1; text-align:center;">
        <strong style="display:block; margin-bottom:0.5rem; font-size:15px; color:#1e293b;"><i class="fas fa-male"></i> Interactive Body Map</strong>
        <p style="font-size:12px; color:#64748b; margin-bottom:1rem;">Click on the figures below to place red lesion marker dots. Click a dot again to remove it.</p>
        
        <div style="display:flex; justify-content:center; gap:2.5rem; flex-wrap:wrap; margin:1rem 0;">
          <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem;">
            <span style="font-weight:600; font-size:13px; color:#475569;">Anterior (Front)</span>
            <div style="position:relative; width:200px; height:300px;">
              <svg id="svg-anterior" class="body-silhouette" viewBox="0 0 200 300" onclick="window.addBodyMapDot(event, 'anterior')" style="width:200px; height:300px; background:#fff; border:2px solid #cbd5e1; border-radius:12px; cursor:crosshair; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
                <circle cx="100" cy="35" r="18" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
                <path d="M 75,60 C 65,60 55,75 50,90 C 45,105 40,130 45,140 C 48,145 53,142 55,135 L 68,95 C 68,120 70,160 72,190 L 60,280 C 58,290 73,290 75,280 L 88,195 L 100,195 L 112,195 L 125,280 C 127,290 142,290 140,280 L 128,190 C 130,160 132,120 132,95 L 145,135 C 147,142 152,145 155,140 C 160,130 155,105 150,90 C 145,75 135,60 125,60 Z" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
                <g id="anterior-dots"></g>
              </svg>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem;">
            <span style="font-weight:600; font-size:13px; color:#475569;">Posterior (Back)</span>
            <div style="position:relative; width:200px; height:300px;">
              <svg id="svg-posterior" class="body-silhouette" viewBox="0 0 200 300" onclick="window.addBodyMapDot(event, 'posterior')" style="width:200px; height:300px; background:#fff; border:2px solid #cbd5e1; border-radius:12px; cursor:crosshair; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
                <circle cx="100" cy="35" r="18" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
                <path d="M 75,60 C 65,60 55,75 50,90 C 45,105 40,130 45,140 C 48,145 53,142 55,135 L 68,95 C 68,120 70,160 72,190 L 60,280 C 58,290 73,290 75,280 L 88,195 L 100,195 L 112,195 L 125,280 C 127,290 142,290 140,280 L 128,190 C 130,160 132,120 132,95 L 145,135 C 147,142 152,145 155,140 C 160,130 155,105 150,90 C 145,75 135,60 125,60 Z" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
                <line x1="100" y1="60" x2="100" y2="190" stroke="#475569" stroke-dasharray="3,3" stroke-width="1.5"/>
                <g id="posterior-dots"></g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 4: ASSESSMENT -->
    <div class="card" style="margin-bottom:1.5rem;">
      <h3 style="color:var(--primary); font-size:1.1rem; margin-bottom:1rem; text-transform:uppercase; letter-spacing:0.05em; border-bottom:2px solid var(--border-color); padding-bottom:0.5rem;"><i class="fas fa-file-medical-alt"></i> 4. Assessment</h3>
      <div class="form-grid">
        <div class="form-group"><label>Working Diagnosis</label><input id="cf_diag" placeholder="Primary diagnosed dermatological condition..."></div>
        <div class="form-group"><label>Differential Diagnosis</label><input id="cf_diff_diag" placeholder="Possible secondary or rule-out diagnoses..."></div>
      </div>
      
      <div style="margin-top:1rem; background:#f8fafc; padding:1.2rem; border-radius:8px; border:1px solid #cbd5e1;">
        <strong style="display:block; margin-bottom:0.8rem; color:#1e293b; font-size:14px;">Investigations Ordered</strong>
        <div style="display:flex; gap:2rem; flex-wrap:wrap; margin-bottom:0.8rem;">
          <label class="checkbox-item"><input type="checkbox" id="inv_scraping"> Skin scraping</label>
          <label class="checkbox-item"><input type="checkbox" id="inv_biopsy"> Biopsy</label>
          <label class="checkbox-item"><input type="checkbox" id="inv_bloods"> Bloods</label>
          <label class="checkbox-item"><input type="checkbox" id="inv_culture"> Culture</label>
        </div>
        <div>
          <label style="font-size:12px; font-weight:500;">Other Lab/Clinic Investigation:</label>
          <input type="text" id="inv_other_val" placeholder="Specify other tests ordered..." style="padding:0.4rem; font-size:13px; margin-top:3px; background:#fff;">
        </div>
      </div>

      <h4 style="margin-top:1.5rem; font-size:0.85rem; color:#64748b; font-weight:600;">Lab Orders (Dispatched to Clinic Lab Catalog)</h4>
      <div class="checklist-grid" style="background:#fdf2f8; padding:1rem; border-radius:8px; border:1px solid #fbcfe8;">${labOpts}</div>
      <h4 style="margin-top:1rem; font-size:0.85rem; color:#64748b; font-weight:600;">Clinical Treatments (Ordered by Doctor, executed by Nurse)</h4>
      <div class="checklist-grid" style="background:#f5f3ff; padding:1rem; border-radius:8px; border:1px solid #ddd6fe;">${txOpts}</div>
    </div>

    <!-- SECTION 5: TREATMENT PLAN (MEDS) -->
    <div class="card" style="margin-bottom:1.5rem;">
      <h3 style="color:var(--primary); font-size:1.1rem; margin-bottom:1rem; text-transform:uppercase; letter-spacing:0.05em; border-bottom:2px solid var(--border-color); padding-bottom:0.5rem;"><i class="fas fa-pills"></i> 5. Prescription & Treatment Plan</h3>
      
      <div id="medBuilder" style="background:#f8fafc; padding:1rem; border-radius:8px; border:1px solid #cbd5e1;">
        <div class="form-grid" id="medrow_1">
          <div class="form-group"><label>Medication / Treatment</label>
            <select class="med-sel"><option value="">Select...</option>${dOpts}</select>
          </div>
          <div class="form-group"><label>Dose / Strength</label><input type="text" class="med-dose" placeholder="e.g. 10mg / thin layer"></div>
          <div class="form-group"><label>Frequency</label>
            <select class="med-freq">
              <option>Select...</option><option>Once Daily (OD)</option><option>Twice Daily (BD)</option><option>Three Times Daily (TDS)</option>
              <option>Four Times Daily (QDS)</option><option>Every Morning</option><option>Every Night</option>
              <option>Every Other Day</option><option>Once Weekly</option><option>As Needed (PRN)</option>
            </select>
          </div>
          <div class="form-group"><label>Route</label>
            <select class="med-route">
              <option>Select...</option><option>Topical</option><option>Oral</option><option>Injection (IM)</option>
              <option>Injection (IV)</option><option>Subcutaneous</option><option>Intralesional</option>
            </select>
          </div>
          <div class="form-group"><label>Duration</label>
            <select class="med-dur">
              <option>Select...</option><option>3 Days</option><option>5 Days</option><option>7 Days</option><option>10 Days</option>
              <option>14 Days</option><option>21 Days</option><option>1 Month</option><option>2 Months</option>
              <option>3 Months</option><option>Until Review</option>
            </select>
          </div>
          <div class="form-group"><label>Instructions</label>
            <select class="med-inst">
              <option>Select...</option>
              <option>Apply a thin layer to the affected area.</option><option>Apply after washing and drying the skin.</option>
              <option>Take with food.</option><option>Take after meals.</option><option>Take before meals.</option>
              <option>Take at bedtime.</option><option>Avoid direct sunlight during treatment.</option>
              <option>Complete the full course of medication.</option><option>Avoid contact with the eyes.</option>
              <option>Keep the treated area clean and dry.</option>
            </select>
          </div>
        </div>
      </div>
      <button class="btn btn-sm btn-secondary" style="margin-top:1rem;" onclick="window.addMedRow()">+ Add Medication</button>

      <div class="form-group" style="margin-top:1.5rem;">
        <label>Patient Education / Counseling Given</label>
        <textarea id="cf_education" rows="2" placeholder="Counseling notes on skin hygiene, hydration, sunscreens, or avoidance triggers..."></textarea>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem; margin-top:1.5rem; background:#f8fafc; padding:1.2rem; border-radius:8px; border:1px solid #cbd5e1;">
        <div>
          <label style="font-weight:600; display:block; margin-bottom:0.5rem; font-size:13px;">Next Appointment Date</label>
          <input type="date" id="cf_next_date" style="padding:0.6rem; font-size:14px; border:1px solid #cbd5e1; border-radius:6px; background:#fff; width:100%;">
        </div>
        <div>
          <label style="font-weight:600; display:block; margin-bottom:0.5rem; font-size:13px;">Review Type</label>
          <div style="display:flex; gap:1.5rem; padding:0.5rem 0;">
            <label class="checkbox-item"><input type="radio" name="cf_next_type" value="Routine" checked> Routine Review</label>
            <label class="checkbox-item"><input type="radio" name="cf_next_type" value="Urgent review"> Urgent Review</label>
          </div>
        </div>
        <div>
          <label style="font-weight:600; display:block; margin-bottom:0.5rem; font-size:13px;">Clinician Signature (Stamping)</label>
          <input type="text" id="cf_clinician" disabled value="Dr. ${currentUser.name}" style="background:#f1f5f9; color:#475569; padding:0.6rem; font-size:14px; border:1px solid #cbd5e1; border-radius:6px; width:100%;">
        </div>
      </div>
    </div>

    <!-- SUBMISSION ACTIONS FOOTER -->
    <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap; margin-top:2rem; background:#fff; padding:1.2rem; border-radius:12px; border:1px solid #e2e8f0; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
      <div>
        <button class="btn btn-secondary" style="background:#3b82f6; color:white; border:none; font-weight:600;" onclick="window.submitFullConsultation(this, 'draft')">
          <i class="fas fa-flask"></i> Send to Lab & Await Results
        </button>
      </div>
      <div style="display:flex; gap:1rem;">
        <button class="btn btn-secondary" style="background:#f1f5f9; color:#475569;" onclick="window.submitFullConsultation(this, 'print')">
          <i class="fas fa-print"></i> Save & Print Prescription
        </button>
        <button class="btn btn-secondary" style="background:#f1f5f9; color:#475569;" onclick="window.submitFullConsultation(this, 'email')">
          <i class="fas fa-envelope"></i> Save & Email Patient
        </button>
        <button class="btn btn-primary" onclick="window.submitFullConsultation(this, 'save')" style="background:#1e3a8a; font-weight:600;">
          <i class="fas fa-check"></i> Save Consultation (Final)
        </button>
      </div>
    </div>
  `;

  // Try loading draft values
  setTimeout(() => {
    window.loadDraftConsultation(activeConsAppId);
  }, 100);
}

// Global helpers for body mapping
window.bodyMapDots = [];
window.addBodyMapDot = function(e, type) {
  const svg = e.currentTarget;
  const rect = svg.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  
  window.bodyMapDots.push({ x, y, type });
  window.renderBodyMapDots();
};

window.renderBodyMapDots = function() {
  const antContainer = document.getElementById('anterior-dots');
  const postContainer = document.getElementById('posterior-dots');
  if (!antContainer || !postContainer) return;
  
  antContainer.innerHTML = '';
  postContainer.innerHTML = '';
  
  window.bodyMapDots.forEach((dot, index) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", `${dot.x}%`);
    circle.setAttribute("cy", `${dot.y}%`);
    circle.setAttribute("r", "6");
    circle.setAttribute("fill", "#ef4444");
    circle.setAttribute("stroke", "#ffffff");
    circle.setAttribute("stroke-width", "1.5");
    circle.setAttribute("style", "cursor: pointer;");
    circle.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent placing new dot
      window.bodyMapDots.splice(index, 1);
      window.renderBodyMapDots();
    });
    
    if (dot.type === 'anterior') {
      antContainer.appendChild(circle);
    } else {
      postContainer.appendChild(circle);
    }
  });
};

// Draft recovery helper
window.loadDraftConsultation = async function(appId) {
  try {
    const draft = await apiFetch(`/consultations/draft/${appId}`);
    if (draft) {
      toast("Restored active consultation draft.");
      
      // visit type
      if (draft.visit_type) {
        const el = document.querySelector(`input[name="cf_visit"][value="${draft.visit_type}"]`);
        if (el) el.checked = true;
      }
      
      // referred by
      if (draft.referred_by) document.getElementById('cf_ref').value = draft.referred_by;
      
      // presenting complaint
      if (draft.primary_complaint) document.getElementById('cf_primary').value = draft.primary_complaint;
      
      // history of presenting complaint
      if (draft.history_of_presenting_complaint) {
        document.getElementById('cf_history').value = draft.history_of_presenting_complaint;
      }
      
      // past history checkboxes
      if (draft.past_history_json) {
        try {
          const ph = JSON.parse(draft.past_history_json);
          document.getElementById('ph_allergy').checked = !!ph.allergy;
          document.getElementById('ph_diabetes').checked = !!ph.diabetes;
          document.getElementById('ph_hypertension').checked = !!ph.hypertension;
          document.getElementById('ph_hiv').checked = !!ph.hiv;
          document.getElementById('ph_autoimmune').checked = !!ph.autoimmune;
          document.getElementById('ph_other_val').value = ph.other || '';
        } catch(e){}
      }
      
      // drug allergy history
      if (draft.drug_history_json) {
        try {
          const dh = JSON.parse(draft.drug_history_json);
          document.getElementById('dh_allergy').checked = !!dh.known_allergy;
          document.getElementById('dh_meds').checked = !!dh.current_meds;
          document.getElementById('dh_family').checked = !!dh.family_history;
          document.getElementById('dh_details').value = dh.details || '';
        } catch(e){}
      }
      
      // morphology
      if (draft.morphology_json) {
        try {
          const morph = JSON.parse(draft.morphology_json);
          document.getElementById('m_macule').checked = !!morph.macule;
          document.getElementById('m_papule').checked = !!morph.papule;
          document.getElementById('m_plaque').checked = !!morph.plaque;
          document.getElementById('m_nodule').checked = !!morph.nodule;
          document.getElementById('m_vesicle').checked = !!morph.vesicle;
          document.getElementById('m_bulla').checked = !!morph.bulla;
          document.getElementById('m_pustule').checked = !!morph.pustule;
          document.getElementById('m_wheal').checked = !!morph.wheal;
          document.getElementById('m_scale').checked = !!morph.scale;
          document.getElementById('m_ulcer').checked = !!morph.ulcer;
          document.getElementById('m_crust').checked = !!morph.crust;
          document.getElementById('m_atrophy').checked = !!morph.atrophy;
          document.getElementById('m_other_val').value = morph.other || '';
        } catch(e){}
      }
      
      // distribution
      if (draft.distribution_json) {
        try {
          const dist = JSON.parse(draft.distribution_json);
          document.getElementById('d_localised').checked = !!dist.localised;
          document.getElementById('d_generalised').checked = !!dist.generalised;
          document.getElementById('d_symmetrical').checked = !!dist.symmetrical;
          document.getElementById('d_asymmetrical').checked = !!dist.asymmetrical;
          document.getElementById('d_flexural').checked = !!dist.flexural;
          document.getElementById('d_extensor').checked = !!dist.extensor;
          document.getElementById('d_sun_exposed').checked = !!dist.sun_exposed;
          document.getElementById('d_mucosal').checked = !!dist.mucosal;
          document.getElementById('d_others_val').value = dist.others || '';
        } catch(e){}
      }
      
      // site affected & findings
      if (draft.site_affected) document.getElementById('cf_site').value = draft.site_affected;
      if (draft.additional_findings) document.getElementById('cf_findings').value = draft.additional_findings;
      
      // body map
      if (draft.body_map_data_json) {
        try {
          window.bodyMapDots = JSON.parse(draft.body_map_data_json) || [];
          window.renderBodyMapDots();
        } catch(e){}
      }
      
      // diagnosis
      if (draft.working_diagnosis) document.getElementById('cf_diag').value = draft.working_diagnosis;
      if (draft.differential_diagnosis) document.getElementById('cf_diff_diag').value = draft.differential_diagnosis;
      
      // investigations ordered
      if (draft.investigations_ordered_json) {
        try {
          const inv = JSON.parse(draft.investigations_ordered_json);
          document.getElementById('inv_scraping').checked = !!inv.scraping;
          document.getElementById('inv_biopsy').checked = !!inv.biopsy;
          document.getElementById('inv_bloods').checked = !!inv.bloods;
          document.getElementById('inv_culture').checked = !!inv.culture;
          document.getElementById('inv_other_val').value = inv.other || '';
        } catch(e){}
      }
      
      // education
      if (draft.patient_education) document.getElementById('cf_education').value = draft.patient_education;
      
      // next appointment
      if (draft.next_appointment_type) {
        const el = document.querySelector(`input[name="cf_next_type"][value="${draft.next_appointment_type}"]`);
        if (el) el.checked = true;
      }
      if (draft.next_appointment_date) {
        document.getElementById('cf_next_date').value = draft.next_appointment_date;
      }
    }
  } catch(err) { console.error("Error loading draft:", err); }
};

window.startConsultation = function(appId, patId) {
  activeConsAppId = appId;
  activeConsPatId = patId;
  setDocTab('consultation');
}

window.submitFullConsultation = async function(btn, action) {
  const orig = btn.innerText; btn.innerText = 'Saving...'; btn.disabled = true;

  const checked = (name) => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : '';
  };
  const checkedMulti = (name) => Array.from(document.querySelectorAll(`input[name="${name}"]:checked`));

  // Gather Meds
  let prescriptions = [];
  for(let i=1; i<=window.docMedCount; i++) {
    const row = document.getElementById(`medrow_${i}`);
    if(!row) continue;
    const sel = row.querySelector('.med-sel');
    if(!sel || !sel.value) continue;
    const opt = sel.options[sel.selectedIndex];
    prescriptions.push({
      drug_name: opt.dataset.name,
      price: opt.dataset.price,
      frequency: row.querySelector('.med-freq').value,
      route: row.querySelector('.med-route').value,
      duration: row.querySelector('.med-dur').value,
      instructions: row.querySelector('.med-inst').value
    });
  }

  const payload = {
    appointment_id: activeConsAppId,
    patient_id: activeConsPatId,
    doctor_id: currentUser.id,
    age_group: 'Adult',
    gender: checked('cf_gender') || 'Not disclosed',
    residence_type: 'Unknown',
    primary_complaint: document.getElementById('cf_primary').value,
    working_diagnosis: document.getElementById('cf_diag').value,
    follow_up_needed: document.getElementById('cf_next_date').value ? 'Yes' : 'No',
    follow_up_interval: checked('cf_next_type') || 'As needed',
    lab_orders: checkedMulti('c_lab').map(el => ({ test_name: el.dataset.name, price: el.dataset.price })),
    clinical_treatments: checkedMulti('c_tx').map(el => ({ treatment_name: el.dataset.name, price: el.dataset.price })),
    prescriptions: prescriptions,

    // New Card Fields
    visit_type: checked('cf_visit'),
    referred_by: document.getElementById('cf_ref').value,
    history_of_presenting_complaint: document.getElementById('cf_history').value,
    past_history_json: JSON.stringify({
      allergy: document.getElementById('ph_allergy').checked,
      diabetes: document.getElementById('ph_diabetes').checked,
      hypertension: document.getElementById('ph_hypertension').checked,
      hiv: document.getElementById('ph_hiv').checked,
      autoimmune: document.getElementById('ph_autoimmune').checked,
      other: document.getElementById('ph_other_val').value
    }),
    drug_history_json: JSON.stringify({
      known_allergy: document.getElementById('dh_allergy').checked,
      current_meds: document.getElementById('dh_meds').checked,
      family_history: document.getElementById('dh_family').checked,
      details: document.getElementById('dh_details').value
    }),
    morphology_json: JSON.stringify({
      macule: document.getElementById('m_macule').checked,
      papule: document.getElementById('m_papule').checked,
      plaque: document.getElementById('m_plaque').checked,
      nodule: document.getElementById('m_nodule').checked,
      vesicle: document.getElementById('m_vesicle').checked,
      bulla: document.getElementById('m_bulla').checked,
      pustule: document.getElementById('m_pustule').checked,
      wheal: document.getElementById('m_wheal').checked,
      scale: document.getElementById('m_scale').checked,
      ulcer: document.getElementById('m_ulcer').checked,
      crust: document.getElementById('m_crust').checked,
      atrophy: document.getElementById('m_atrophy').checked,
      other: document.getElementById('m_other_val').value
    }),
    distribution_json: JSON.stringify({
      localised: document.getElementById('d_localised').checked,
      generalised: document.getElementById('d_generalised').checked,
      symmetrical: document.getElementById('d_symmetrical').checked,
      asymmetrical: document.getElementById('d_asymmetrical').checked,
      flexural: document.getElementById('d_flexural').checked,
      extensor: document.getElementById('d_extensor').checked,
      sun_exposed: document.getElementById('d_sun_exposed').checked,
      mucosal: document.getElementById('d_mucosal').checked,
      others: document.getElementById('d_others_val').value
    }),
    site_affected: document.getElementById('cf_site').value,
    additional_findings: document.getElementById('cf_findings').value,
    body_map_data_json: JSON.stringify(window.bodyMapDots || []),
    differential_diagnosis: document.getElementById('cf_diff_diag').value,
    investigations_ordered_json: JSON.stringify({
      scraping: document.getElementById('inv_scraping').checked,
      biopsy: document.getElementById('inv_biopsy').checked,
      bloods: document.getElementById('inv_bloods').checked,
      culture: document.getElementById('inv_culture').checked,
      other: document.getElementById('inv_other_val').value
    }),
    patient_education: document.getElementById('cf_education').value,
    next_appointment_type: checked('cf_next_type'),
    next_appointment_date: document.getElementById('cf_next_date').value
  };

  try {
    if (action === 'draft') {
      await apiFetch('/consultations/lab_orders_draft', { method: 'POST', body: JSON.stringify(payload) });
      toast("Draft saved! Patient sent to laboratory queue.");
    } else {
      const res = await apiFetch('/consultations', { method:'POST', body: JSON.stringify(payload) });
      if (action === 'print') {
        toast("Consultation saved. Generating Prescription...");
        printPrescription(res.id);
      } else if (action === 'email') {
        toast("Consultation saved. Prescription emailed to patient.");
      } else {
        toast("Consultation saved. Orders dispatched.");
      }
    }

    activeConsAppId = null;
    activeConsPatId = null;
    allAppointments = await apiFetch('/appointments');
    setDocTab('queue');
  } catch(err) { toast(err.message); }
  
  btn.innerText = orig; btn.disabled = false;
}


window.viewHistory = async function(patId) {
  try {
    const data = await apiFetch(`/patients/${patId}/history`);
    showModal(`
      <div class="modal modal-lg">
        <div class="modal-header"><h3>Patient Clinical History</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
        <div class="modal-body">
          <div style="background:#f1f5f9; padding:1rem; border-radius:8px; margin-bottom:1rem; display:flex; gap:1rem;">
            <div><strong>Consultations:</strong> ${data.consultations.length}</div>
            <div><strong>Labs Ordered:</strong> ${data.labs.length}</div>
            <div><strong>Prescriptions:</strong> ${data.prescriptions.length}</div>
          </div>
          <div style="overflow-y:auto; max-height:60vh; padding-right:10px;">
            ${data.consultations.length === 0 ? '<p>No history found.</p>' : ''}
            ${data.consultations.map(c => {
              const consRx = data.prescriptions.filter(rx => rx.consultation_id === c.id);
              const consLabs = data.labs.filter(l => l.consultation_id === c.id);
              const consTx = data.treatments.filter(t => t.consultation_id === c.id);
              
              return `
                <div style="border-left:4px solid var(--primary); padding-left:1rem; margin-bottom:1.5rem; background:#fafaf9; padding:1rem; border-radius:4px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:0.5rem; margin-bottom:0.5rem;">
                    <strong>${c.date}</strong>
                    <div style="display:flex; gap:0.5rem;">
                      <button class="btn btn-sm btn-secondary" onclick="printPrescription('${c.id}')">Print Rx</button>
                      <button class="btn btn-sm btn-secondary" style="background:#1e3a8a; color:white; border:none;" onclick="printClinicalRecordCard('${c.id}')"><i class="fas fa-file-medical"></i> Print Record Card</button>
                    </div>
                  </div>
                  <h4 style="color:var(--primary); margin-bottom:0.5rem;">${c.working_diagnosis || 'No Diagnosis Recorded'}</h4>
                  <p style="font-size:14px; color:#555; margin-bottom:1rem;"><strong>Notes:</strong> ${c.doctor_notes || c.primary_complaint || 'None'}</p>
                  
                  <div class="history-grid">
                    <div>
                      <strong style="font-size:13px; color:#1e293b;">Medications:</strong>
                      <ul style="font-size:13px; margin:5px 0 0 15px; color:#475569;">
                        ${consRx.length ? consRx.map(r => `<li>${r.drug_name} - ${r.frequency} (${r.duration})<br><small>${r.instructions}</small></li>`).join('') : '<li>None</li>'}
                      </ul>
                    </div>
                    <div>
                      <strong style="font-size:13px; color:#1e293b;">Labs / Treatments:</strong>
                      <ul style="font-size:13px; margin:5px 0 0 15px; color:#475569;">
                        ${consLabs.map(l => `<li>Lab: ${l.test_name} - <em>${l.status}</em></li>`).join('')}
                        ${consTx.map(t => `<li>Tx: ${t.treatment_name}</li>`).join('')}
                        ${!consLabs.length && !consTx.length ? '<li>None</li>' : ''}
                      </ul>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `);
  } catch(e) { toast(e.message); }
}

window.labPendingData = []; // Store globally for modal access

function renderLab(page) {
  page.innerHTML = `
    <div class="page-header"><div><div class="page-title">Laboratory Dashboard</div></div></div>
    <div class="card" style="margin-bottom:1.5rem; display:flex; gap:2rem; padding:1rem; background:linear-gradient(135deg, #eff6ff, #dbeafe);">
      <div style="flex:1">
        <h4 style="color:#1e40af; margin-bottom:0.5rem">Lab Analytics</h4>
        <div style="font-size:1.5rem; font-weight:700" id="labTotalTests">--</div>
        <div style="color:#64748b; font-size:0.9rem">Total Tests Performed</div>
      </div>
      <div style="flex:1">
        <h4 style="color:#1e40af; margin-bottom:0.5rem">Revenue Generated</h4>
        <div style="font-size:1.5rem; font-weight:700" id="labTotalRev">--</div>
        <div style="color:#64748b; font-size:0.9rem">Total Lab Revenue (Le)</div>
      </div>
    </div>
    
    <div class="card" style="margin-bottom:1.5rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; padding:1.5rem 1.5rem 0 1.5rem;">
        <h3 style="margin:0; color:#1e293b; font-size:1.1rem;">Pending Lab Orders Queue</h3>
        <input type="text" placeholder="Search orders..." style="padding:0.5rem; border-radius:8px; border:1px solid #cbd5e1; min-width:250px;" oninput="filterTable('labTb', this.value)">
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Patient Name</th><th>Doctor</th><th>Test Name</th><th>Actions</th></tr></thead>
          <tbody id="labTb"><tr><td colspan="4">Loading...</td></tr></tbody>
        </table>
      </div>
    </div>
    
    <div class="card">
      <h3 style="padding:1.5rem 1.5rem 0 1.5rem; margin:0; color:#1e293b; font-size:1.1rem;">Completed Tests History Log</h3>
      <div class="table-wrap" style="max-height: 400px; overflow-y: auto;">
        <table>
          <thead><tr><th>Date</th><th>Patient Name</th><th>Test Name</th><th>Result</th><th>Status</th></tr></thead>
          <tbody id="labHistTb"><tr><td colspan="5">Loading...</td></tr></tbody>
        </table>
      </div>
    </div>
  `;
  apiFetch('/laboratory').then(labs => {
    let done = labs.filter(l => l.status === 'Completed');
    document.getElementById('labTotalTests').innerText = done.length;
    document.getElementById('labTotalRev').innerText = done.reduce((a, b) => a + (b.price||0), 0).toLocaleString();

    // Pending Queue
    const pending = labs.filter(l => l.status === 'Pending');
    document.getElementById('labTb').innerHTML = pending.map(l => `
      <tr>
        <td>${l.patient_name}</td>
        <td>Dr. ${l.doctor_name}</td>
        <td>${l.test_name}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="openLabModal('${l.id}', '${l.patient_name}', '${l.test_name}', '${l.working_diagnosis}')">Enter Results</button>
        </td>
      </tr>
    `).join('');

    if (pending.length === 0) document.getElementById('labTb').innerHTML = `<tr><td colspan="4" style="text-align:center;">No pending lab orders.</td></tr>`;
    
    // Completed History
    document.getElementById('labHistTb').innerHTML = done.map(l => `
      <tr>
        <td>${new Date(l.created_at).toLocaleDateString()}</td>
        <td>${l.patient_name}</td>
        <td>${l.test_name}</td>
        <td style="max-width:300px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${l.result || 'No result text'}</td>
        <td><span style="background:#dcfce7; color:#166534; padding:4px 8px; border-radius:12px; font-size:0.8rem; font-weight:600;">Completed</span></td>
      </tr>
    `).join('');
    
    if (done.length === 0) document.getElementById('labHistTb').innerHTML = `<tr><td colspan="5" style="text-align:center;">No completed tests history.</td></tr>`;
  });
}

window.openLabPatient = function(pid) {
  const pTests = window.labPendingData.filter(x => x.patient_id === pid);
  if(!pTests.length) return;

  showModal(`
    <div class="modal modal-lg">
      <div class="modal-header"><h3>Process Lab Tests for ${pTests[0].patient_name}</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
      <div class="modal-body">
        <p style="margin-bottom:1rem; color:#64748b;">Mark the tests you are able to perform below and enter results.</p>
        <div style="max-height:60vh; overflow-y:auto; padding-right:1rem;">
          ${pTests.map(t => `
            <div style="border:1px solid #e2e8f0; border-radius:8px; padding:1rem; margin-bottom:1rem; background:#f8fafc;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                <strong>${t.test_name}</strong>
                <select id="lstat_${t.id}" style="padding:4px; font-size:0.9rem;">
                  <option value="Pending">Skip (Leave Pending)</option>
                  <option value="Completed">Completed / Performed</option>
                  <option value="Not Performed">Cannot Perform</option>
                </select>
              </div>
              <textarea id="lres_${t.id}" placeholder="Enter test result / findings..." rows="2" style="width:100%; padding:0.5rem; border:1px solid #cbd5e1; border-radius:4px;"></textarea>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-primary btn-block" style="margin-top:1rem;" onclick="submitLabBatch(this, '${pid}')">Save Records & Send to Billing</button>
      </div>
    </div>
  `);
}

window.submitLabBatch = async function(btn, pid) {
  const pTests = window.labPendingData.filter(x => x.patient_id === pid);
  const orig = btn.innerText; btn.innerText = 'Processing...'; btn.disabled = true;
  
  try {
    for(let t of pTests) {
      const status = document.getElementById(`lstat_${t.id}`).value;
      const result = document.getElementById(`lres_${t.id}`).value;
      if (status !== 'Pending') {
        await apiFetch(`/laboratory/${t.id}`, { method: 'PATCH', body: JSON.stringify({ status, result }) });
      }
    }
    toast("Lab records updated successfully!");
    closeModal();
    renderLab(document.getElementById('mainContent'));
  } catch (e) {
    toast(e.message);
  }
  btn.innerText = orig; btn.disabled = false;
}

window.pharmPendingData = []; // Store globally for modal access

function renderPharmacy(page) {
  page.innerHTML = `
    <div class="page-header"><div><div class="page-title">Pharmacy Dashboard</div></div></div>
    
    <div style="display:grid; grid-template-columns: 2fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
      <div class="card" style="margin-bottom:0;">
        <div style="display:flex; justify-content:space-between; align-items:center; padding:1.5rem 1.5rem 0 1.5rem;">
          <h3 style="margin:0; color:#1e293b; font-size:1.1rem;">Pending Dispense Queue</h3>
          <input type="text" placeholder="Search pharmacy..." style="padding:0.5rem; border-radius:8px; border:1px solid #cbd5e1; min-width:200px;" oninput="filterTable('pharmTb', this.value)">
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Patient ID</th><th>Patient Name</th><th>Pending Items</th><th>Actions</th></tr></thead>
            <tbody id="pharmTb"><tr><td colspan="4">Loading...</td></tr></tbody>
          </table>
        </div>
      </div>
      
      <div class="card" style="margin-bottom:0; background:linear-gradient(180deg, #f8fafc 0%, #fff 100%);">
        <h3 style="padding:1.5rem 1.5rem 0 1.5rem; margin:0; color:#1e293b; font-size:1.1rem;">Live Inventory Stock</h3>
        <div class="table-wrap" style="max-height: 300px; overflow-y: auto;">
          <table>
            <thead><tr><th>Drug Name</th><th style="text-align:right;">Stock Left</th></tr></thead>
            <tbody id="invTb"><tr><td colspan="2">Loading...</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div class="card">
      <h3 style="padding:1.5rem 1.5rem 0 1.5rem; margin:0; color:#1e293b; font-size:1.1rem;">Dispensing History Log</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Patient Name</th><th>Drug Dispensed</th><th>Amount (Le)</th><th>Status</th></tr></thead>
          <tbody id="pharmHistTb"><tr><td colspan="5">Loading...</td></tr></tbody>
        </table>
      </div>
    </div>
  `;
  
  // Fetch Prescriptions
  apiFetch('/pharmacy/prescriptions').then(rxs => {
    // 1. Pending Queue
    const pending = rxs.filter(r => !r.is_paid);
    window.pharmPendingData = pending;
    const patients = [...new Set(pending.map(p => p.patient_id))];

    document.getElementById('pharmTb').innerHTML = patients.map(pid => {
      const pRxs = pending.filter(x => x.patient_id === pid);
      return `
      <tr>
        <td>PAT-${pid}</td>
        <td>${pRxs[0].patient_name}</td>
        <td><span style="background:#fee2e2; padding:4px 8px; border-radius:12px; font-size:0.8rem; font-weight:600;">${pRxs.length} items</span></td>
        <td><button class="btn btn-sm btn-secondary" onclick="openPharmPatient('${pid}')">Process Payment & Dispense</button></td>
      </tr>
      `;
    }).join('');

    if (patients.length === 0) document.getElementById('pharmTb').innerHTML = `<tr><td colspan="4" style="text-align:center;">No pending prescriptions.</td></tr>`;
    
    // 2. Dispensing History
    const completed = rxs.filter(r => r.is_paid || r.status === 'Dispensed');
    document.getElementById('pharmHistTb').innerHTML = completed.map(r => `
      <tr>
        <td>${new Date(r.created_at).toLocaleDateString()}</td>
        <td>${r.patient_name}</td>
        <td>${r.drug_name}</td>
        <td>${(r.price||0).toLocaleString()}</td>
        <td><span style="background:#dcfce7; color:#166534; padding:4px 8px; border-radius:12px; font-size:0.8rem; font-weight:600;">Dispensed</span></td>
      </tr>
    `).join('');
    
    if (completed.length === 0) document.getElementById('pharmHistTb').innerHTML = `<tr><td colspan="5" style="text-align:center;">No dispensing history found.</td></tr>`;
  });
  
  // Fetch Live Inventory
  apiFetch('/admin/catalog/pharmacy_inventory').then(inv => {
    document.getElementById('invTb').innerHTML = inv.map(i => {
      const stockColor = i.stock < 10 ? '#ef4444' : '#1e293b';
      const stockWeight = i.stock < 10 ? '700' : '400';
      return `
      <tr>
        <td>${i.drug_name}</td>
        <td style="text-align:right; color:${stockColor}; font-weight:${stockWeight};">${i.stock !== undefined ? i.stock : '--'}</td>
      </tr>
    `}).join('');
    if(inv.length === 0) document.getElementById('invTb').innerHTML = `<tr><td colspan="2" style="text-align:center;">Inventory is empty.</td></tr>`;
  }).catch(e => {
      // Fallback if admin route is restricted, use the consultation one
      apiFetch('/pharmacy_inventory').then(inv => {
        document.getElementById('invTb').innerHTML = inv.map(i => {
          const stockColor = i.stock < 10 ? '#ef4444' : '#1e293b';
          const stockWeight = i.stock < 10 ? '700' : '400';
          return `
          <tr>
            <td>${i.drug_name}</td>
            <td style="text-align:right; color:${stockColor}; font-weight:${stockWeight};">${i.stock !== undefined ? i.stock : '--'}</td>
          </tr>
        `}).join('');
      });
  });
}

window.openPharmPatient = function(pid) {
  const pRxs = window.pharmPendingData.filter(x => x.patient_id === pid);
  if(!pRxs.length) return;

  showModal(`
    <div class="modal modal-lg">
      <div class="modal-header"><h3>Process Prescriptions for ${pRxs[0].patient_name}</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
      <div class="modal-body">
        <p style="margin-bottom:1rem; color:#64748b;">Select the medications the patient is paying for to dispense them.</p>
        <div style="max-height:50vh; overflow-y:auto; padding-right:1rem;">
          <table style="width:100%; border-collapse:collapse; margin-bottom:1rem;">
            <thead><tr style="border-bottom:2px solid #e2e8f0;"><th style="text-align:left; padding:0.5rem;">Dispense</th><th style="text-align:left;">Drug</th><th style="text-align:right;">Price (Le)</th></tr></thead>
            <tbody>
              ${pRxs.map(r => `
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:0.5rem;"><input type="checkbox" id="prx_${r.id}" checked></td>
                  <td>${r.drug_name}<br><small style="color:#64748b;">${r.frequency}, ${r.duration}</small></td>
                  <td style="text-align:right;">${(r.price||0).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <button class="btn btn-primary btn-block" onclick="submitPharmBatch(this, '${pid}')">Mark Paid, Dispense & Print Receipt</button>
      </div>
    </div>
  `);
}

window.submitPharmBatch = async function(btn, pid) {
  const pRxs = window.pharmPendingData.filter(x => x.patient_id === pid);
  const orig = btn.innerText; btn.innerText = 'Processing...'; btn.disabled = true;
  
  let paidItems = [];
  try {
    for(let r of pRxs) {
      const isChecked = document.getElementById(`prx_${r.id}`).checked;
      if (isChecked) {
        await apiFetch(`/pharmacy/prescriptions/${r.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'Dispensed', is_paid: true }) });
        paidItems.push(r);
      }
    }
    toast("Medications marked paid & dispensed.");
    closeModal();
    renderPharmacy(document.getElementById('mainContent'));
    if(paidItems.length > 0) {
      printPharmacyReceipt(paidItems);
    }
  } catch (e) {
    toast(e.message);
  }
  btn.innerText = orig; btn.disabled = false;
}


window.buildPharmacyReceiptHTML = function(paidItems) {
  if(!paidItems.length) return '';
  const pName = paidItems[0].patient_name;
  const total = paidItems.reduce((a, b) => a + (b.price||0), 0);
  const cName = sysSettings.clinic_name || 'Radiance Dermatology & Aesthetic Clinic';
  const cAdd = sysSettings.clinic_address || '123 Health Ave, Freetown';
  const cContact = sysSettings.clinic_contact || '+232 77 123 456';
  const cEmail = sysSettings.clinic_email || 'contact@dcmsclinic.com';
  const logo = sysSettings.clinic_logo ? `<img src="${sysSettings.clinic_logo}" style="max-width:250px; max-height:70px; object-fit:contain; margin-bottom:1rem;">` : '';

  const rows = paidItems.map(x => `<tr><td style="padding:0.5rem; border-bottom:1px solid #e2e8f0;">${x.drug_name}</td><td style="padding:0.5rem; border-bottom:1px solid #e2e8f0;">Le ${Number(x.price || 0).toLocaleString()}</td></tr>`).join('');

  return `
    <html><head><title>Pharmacy Receipt</title>
    <style>body{font-family:sans-serif; padding:2rem; max-width:600px; margin:auto;} table{width:100%; border-collapse:collapse; margin-top:2rem;} th{text-align:left; padding:0.5rem; border-bottom:2px solid #000;}</style>
    </head><body>
      <div style="text-align:center; border-bottom:2px solid #000; padding-bottom:1rem;">
        ${logo}
        <h2>${cName.toUpperCase()}</h2>
        <p>${cAdd} | ${cContact} | ${cEmail}</p>
        <h3 style="margin-top:1rem;">PHARMACY RECEIPT</h3>
      </div>
      <p style="margin-top:2rem;"><strong>Patient Name:</strong> ${pName}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <table>
        <thead><tr><th>Item</th><th>Price</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="margin-top:2rem; text-align:right; font-size:1.2rem;">
        <strong>Total Paid: Le ${Number(total).toLocaleString()}</strong>
      </div>
      <p style="margin-top:3rem; text-align:center; color:#666;">Thank you for your business!</p>
    </body></html>
  `;
};

window.buildFinalReceiptHTML = function(id) {
  const b = window.allBillsCache.find(x => String(x.id) === String(id));
  if (!b) return '';
  const items = JSON.parse(b.items_json);
  
  const cName = sysSettings.clinic_name || 'Radiance Dermatology & Aesthetic Clinic';
  const cAdd = sysSettings.clinic_address || '123 Health Ave, Freetown';
  const cContact = sysSettings.clinic_contact || '+232 77 123 456';
  const cEmail = sysSettings.clinic_email || 'contact@dcmsclinic.com';
  const logo = sysSettings.clinic_logo ? `<img src="${sysSettings.clinic_logo}" style="max-width:250px; max-height:70px; object-fit:contain; margin-bottom:1rem;">` : '';

  const rows = items.map(x => `<tr><td style="padding:0.5rem; border-bottom:1px solid #e2e8f0;">${x.name || x.desc || "Item"}</td><td style="padding:0.5rem; border-bottom:1px solid #e2e8f0;">Le ${Number(x.cost || x.price || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>`).join('');

  return `
    <html><head><title>Official Receipt</title>
    <style>body{font-family:sans-serif; padding:2rem; max-width:600px; margin:auto;} table{width:100%; border-collapse:collapse; margin-top:2rem;} th{text-align:left; padding:0.5rem; border-bottom:2px solid #000;}</style>
    </head><body>
      <div style="text-align:center; border-bottom:2px solid #000; padding-bottom:1rem;">
        ${logo}
        <h2>${cName.toUpperCase()}</h2>
        <p>${cAdd} | ${cContact} | ${cEmail}</p>
        <h3 style="margin-top:1rem;">OFFICIAL RECEIPT</h3>
      </div>
      <p style="margin-top:2rem;"><strong>Patient Name:</strong> ${b.patient_name}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Receipt #:</strong> ${b.id}</p>
      <table>
        <thead><tr><th>Description</th><th>Amount</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="margin-top:2rem; text-align:right; font-size:1.2rem;">
        <strong>Total Amount: Le ${Number(b.total_amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
      </div>
      <div style="margin-top:1rem; text-align:right; font-size:1.1rem; color:green;">
        <strong>Status: ${b.status}</strong>
      </div>
    </body></html>
  `;
};
window.printPharmacyReceipt = function(paidItems) {
  if(!paidItems.length) return;
  const pName = paidItems[0].patient_name;
  const total = paidItems.reduce((a, b) => a + (b.price||0), 0);
  const cName = sysSettings.clinic_name || 'Radiance Dermatology & Aesthetic Clinic';
  const cAdd = sysSettings.clinic_address || '123 Health Ave, Freetown';
  const cContact = sysSettings.clinic_contact || '+232 77 123 456';
  const cEmail = sysSettings.clinic_email || 'contact@dcmsclinic.com';
  const logo = sysSettings.clinic_logo ? `<img src="${sysSettings.clinic_logo}" style="max-width:250px; max-height:70px; object-fit:contain; margin-bottom:1rem;">` : '';

  const win = window.open('', '_blank');
  win.document.write(`
    <html><head><title>Pharmacy Receipt</title>
    <style>body{font-family:sans-serif; padding:2rem; max-width:600px; margin:auto;} .header{text-align:center; border-bottom:2px solid #000; padding-bottom:1rem; margin-bottom:2rem;} table{width:100%; border-collapse:collapse; margin-bottom:2rem;} th,td{padding:0.5rem; text-align:left; border-bottom:1px solid #ccc;}</style>
    </head><body>
      <div class="header">
        ${logo}
        <h2>${cName.toUpperCase()}</h2>
        <p>${cAdd} | ${cContact} | ${cEmail}</p>
        <h3>PHARMACY RECEIPT</h3>
      </div>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Patient:</strong> ${pName}</p>
      <table>
        <thead><tr><th>Item</th><th style="text-align:right;">Amount (Le)</th></tr></thead>
        <tbody>
          ${paidItems.map(i => `<tr><td>${i.drug_name}</td><td style="text-align:right;">${(i.price||0).toLocaleString()}</td></tr>`).join('')}
        </tbody>
      </table>
      <h2 style="text-align:right">Total Paid: Le ${total.toLocaleString()}</h2>
      <p style="text-align:center; margin-top:3rem; font-size:12px;">Thank you for your business. (Email dispatched to patient)</p>
    </body></html>
  `);
  win.document.close();
  setTimeout(()=>win.print(), 500);
}

function renderNurse(page) {
  page.innerHTML = `
    <div class="page-header"><div><div class="page-title">Nursing Dashboard</div></div></div>
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3>Pending Clinical Treatments</h3>
        <input type="text" placeholder="Search orders..." style="padding:0.5rem; border-radius:8px; border:1px solid #cbd5e1; min-width:250px;" oninput="filterTable('nurseTxTb', this.value)">
      </div>
      <div class="table-wrap" style="margin-top:1rem;">
        <table>
          <thead><tr><th>Patient</th><th>Doctor</th><th>Treatment</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="nurseTxTb"><tr><td colspan="5">Loading...</td></tr></tbody>
        </table>
      </div>
    </div>
  `;
  apiFetch('/nursing/treatments').then(txs => {
    document.getElementById('nurseTxTb').innerHTML = txs.map(t => `
      <tr>
        <td>${t.patient_name}</td><td>${t.doctor_name}</td><td>${t.treatment_name}</td>
        <td>${t.status}</td>
        <td><button class="btn btn-sm" onclick="administerTx('${t.id}')">Mark Administered</button></td>
      </tr>
    `).join('');
    if(txs.length===0) document.getElementById('nurseTxTb').innerHTML='<tr><td colspan="5">No pending treatments</td></tr>';
  });
}

window.administerTx = async function(id) {
  try {
    await apiFetch(`/nursing/treatments/${id}`, { method: 'PATCH' });
    toast("Treatment administered.");
    renderNurse(document.getElementById('mainContent'));
  } catch(e) { toast(e.message); }
}
function renderBilling(page) {
  page.innerHTML = `
    <div class="page-header">
      <div><div class="page-title">Billing & Final Checkout</div></div>
    </div>
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <h3 style="margin:0;">Invoices & Billing Queue</h3>
        <input type="text" placeholder="Search bills..." style="padding:0.5rem; border-radius:8px; border:1px solid #cbd5e1; min-width:250px;" oninput="filterTable('billTb', this.value)">
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Date</th><th>Patient</th><th>Amount (Le)</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="billTb"><tr><td colspan="6">Loading...</td></tr></tbody>
        </table>
      </div>
    </div>
  `;
  
  apiFetch('/billing').then(bills => {
    window.allBillsCache = bills;
    document.getElementById('billTb').innerHTML = bills.map(b => `
      <tr>
        <td>RCPT-${b.id}</td>
        <td>${new Date(b.created_at).toLocaleDateString()}</td>
        <td>${b.patient_name}</td>
        <td>Le ${b.total_amount.toLocaleString()}</td>
        <td><span class="status-badge" style="background:${b.status==='Paid'?'#d1fae5':'#fee2e2'}; color:${b.status==='Paid'?'#065f46':'#991b1b'};">${b.status}</span></td>
        <td style="display: flex; gap: 8px; align-items: center; justify-content: flex-start; flex-wrap: wrap;">
            ${b.status !== 'Paid' ? `
              <button onclick="markBillPaid('${b.id}')" title="Mark this invoice as Paid" style="background:#10b981; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.75rem; display:flex; align-items:center; gap:6px; transition:all 0.2s; box-shadow:0 2px 4px rgba(16,185,129,0.2);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(16,185,129,0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(16,185,129,0.2)';">
                <i class="fas fa-check-circle"></i> Mark Paid
              </button>
            ` : ''}
            
            <button onclick="printFinalReceipt('${b.id}')" title="Print Official Receipt" style="background:#f8fafc; color:#334155; border:1px solid #cbd5e1; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.75rem; display:flex; align-items:center; gap:6px; transition:all 0.2s; box-shadow:0 1px 2px rgba(0,0,0,0.05);" onmouseover="this.style.background='#f1f5f9'; this.style.color='#0f172a'; this.style.borderColor='#94a3b8'; this.style.transform='translateY(-1px)';" onmouseout="this.style.background='#f8fafc'; this.style.color='#334155'; this.style.borderColor='#cbd5e1'; this.style.transform='translateY(0)';">
              <i class="fas fa-print" style="color:#0ea5e9;"></i> Print
            </button>
            
            <button id="emailBtn_${b.id}" onclick="emailFinalReceipt(this, '${b.id}', '${b.patient_id}')" title="Email Receipt to Patient" style="background:#f8fafc; color:#334155; border:1px solid #cbd5e1; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.75rem; display:flex; align-items:center; gap:6px; transition:all 0.2s; box-shadow:0 1px 2px rgba(0,0,0,0.05);" onmouseover="if(!this.disabled){this.style.background='#f1f5f9'; this.style.color='#0f172a'; this.style.borderColor='#94a3b8'; this.style.transform='translateY(-1px)';}" onmouseout="if(!this.disabled){this.style.background='#f8fafc'; this.style.color='#334155'; this.style.borderColor='#cbd5e1'; this.style.transform='translateY(0)';}">
              <i class="fas fa-envelope" style="color:#8b5cf6;"></i> Email
            </button>
          </td>
      </tr>
    `).join('');
  }).catch(e => toast(e.message));
}

window.markBillPaid = async function(id) {
  try {
    await apiFetch(`/billing/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'Paid' }) });
    toast("Bill marked as Paid");
    renderBilling(document.getElementById('mainContent'));
  } catch(e) { toast(e.message); }
}


window.emailFinalReceipt = async function(btn, billId, patId) {
    // BACKWARDS COMPATIBILITY: If user didn't hard refresh, the old button passed (billId, patId) instead of (btn, billId, patId)
    if (typeof btn === 'string') {
        patId = billId;
        billId = btn;
        btn = document.getElementById(`emailBtn_${billId}`) || { style: {} };
    }
    
    try {
      if (!allPatients || allPatients.length === 0) {
         allPatients = await apiFetch('/patients');
      }
      const pat = allPatients.find(p => p.id == patId);
      if (!pat || !pat.email) {
        toast("Patient does not have an email address.");
        return;
      }
      
      btn.disabled = true;
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="color:#0ea5e9;"></i> Sending...';
      btn.style.opacity = '0.7';
      btn.style.cursor = 'not-allowed';
      btn.style.transform = 'translateY(0)';
      
      toast("Generating Official Receipt PDF...");
      const htmlStr = buildFinalReceiptHTML(billId);
      if (!htmlStr) {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        return;
      }
      
      await apiFetch('/email/send-pdf', {
        method: 'POST',
        body: JSON.stringify({
          to: pat.email,
          subject: 'Your Official Receipt - ' + (window.sysSettings?.clinic_name || 'Radiance Derms'),
          htmlBody: '<p>Thank you. Please find your official receipt attached.</p>',
          htmlString: htmlStr,
          filename: `Receipt_${billId}.pdf`
        })
      });
      
      toast("Official Receipt emailed successfully!");
      btn.innerHTML = '<i class="fas fa-check-double" style="color:#10b981;"></i> Sent';
      btn.style.color = '#10b981';
      btn.style.borderColor = '#10b981';
      btn.style.background = '#f0fdf4';
      btn.title = "Email has already been sent.";
      btn.style.opacity = '1';
      
    } catch (err) {
      toast(err.message);
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-envelope" style="color:#8b5cf6;"></i> Email';
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
    }
  };
window.printFinalReceipt = function(id) {
  const b = window.allBillsCache.find(x => x.id === id);
  if (!b) return;
  const items = JSON.parse(b.items_json);
  
  const cName = sysSettings.clinic_name || 'Radiance Dermatology & Aesthetic Clinic';
  const cAdd = sysSettings.clinic_address || '123 Health Ave, Freetown';
  const cContact = sysSettings.clinic_contact || '+232 77 123 456';
  const cEmail = sysSettings.clinic_email || 'contact@dcmsclinic.com';
  const logo = sysSettings.clinic_logo ? `<img src="${sysSettings.clinic_logo}" style="max-width:250px; max-height:70px; object-fit:contain; margin-bottom:1rem;">` : '';

  const win = window.open('', '_blank');
  win.document.write(`
    <html><head><title>Final Receipt - RCPT-${b.id}</title>
    <style>
      body{font-family:sans-serif; padding:2rem; max-width:800px; margin:auto; color:#000;} 
      .header{text-align:center; border-bottom:2px solid #ccc; padding-bottom:1rem; margin-bottom:2rem;} 
      .meta{display:flex; justify-content:space-between; margin-bottom:2rem; font-size:14px;}
      table{width:100%; border-collapse:collapse; margin-bottom:2rem;}
      th, td{padding:0.75rem; text-align:left; border-bottom:1px solid #eee;}
      th{background:#f9fafb;}
      .total-row{font-size:1.25rem; font-weight:700; text-align:right;}
      .total-row td{border-top:2px solid #000;}
      .footer{text-align:center; margin-top:3rem; font-size:12px; color:#888;}
    </style>
    </head><body>
      <div class="header">
        ${logo}
        <h2>${cName.toUpperCase()}</h2>
        <p>${cAdd}<br>Contact: ${cContact} | Email: ${cEmail}</p>
        <h3>OFFICIAL RECEIPT</h3>
      </div>
      <div class="meta">
        <div><strong>Patient:</strong> ${b.patient_name}<br><strong>Receipt #:</strong> RCPT-${b.id}</div>
        <div><strong>Date:</strong> ${new Date(b.created_at).toLocaleDateString()}<br><strong>Status:</strong> ${b.status}</div>
      </div>
      <table>
        <thead><tr><th>Type</th><th>Item Description</th><th style="text-align:right">Cost (Le)</th></tr></thead>
        <tbody>
          ${items.map(item => `<tr><td>${item.type}</td><td>${item.name}</td><td style="text-align:right">${item.cost.toLocaleString()}</td></tr>`).join('')}
          <tr class="total-row"><td colspan="2">TOTAL DUE</td><td style="text-align:right">Le ${b.total_amount.toLocaleString()}</td></tr>
        </tbody>
      </table>
      <div class="footer">Thank you for trusting Dermatology Clinic with your care.</div>
    </body></html>
  `);
  win.document.close();
  setTimeout(()=>win.print(), 500);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}


function renderAdminData(container) {
  container.innerHTML = `
    <div class="card" style="margin-bottom:1.5rem; padding:2rem;">
      <h3 style="margin-bottom:1.5rem; color:#1e293b; font-size:1.1rem; font-weight:600;">System Data Explorer</h3>
      <p style="color:#64748b; margin-bottom:1rem; font-size:0.9rem;">Select a table to view, edit, or delete records. Warning: modifying data here directly affects system integrity.</p>
      
      <div style="display:flex; gap:1rem; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap;">
        <select id="sysDataTableSelect" class="form-group" style="margin:0; padding:0.5rem; width:250px; border:1px solid #cbd5e1; border-radius:8px;">
          <option value="patients">Patients</option>
          <option value="appointments">Appointments</option>
          <option value="consultations">Consultations</option>
          <option value="ordered_treatments">Ordered Treatments</option>
          <option value="lab_orders">Lab Orders</option>
          <option value="prescriptions">Prescriptions</option>
          <option value="nursing_logs">Nursing Logs</option>
          <option value="billing">Billing/Invoices</option>
        </select>
        <button class="btn btn-primary" onclick="loadAdminDataTable()">Load Data</button>
        <input type="text" placeholder="Search records..." style="padding:0.5rem; border-radius:8px; border:1px solid #cbd5e1; min-width:250px; margin-left:auto;" oninput="filterTable('sysDataBody', this.value)">
      </div>

      <div class="table-wrap" style="max-height:600px; overflow-y:auto; overflow-x:auto;">
        <table id="sysDataTable" style="min-width: 1000px;">
          <thead id="sysDataHead"><tr><th>Select a table and click Load Data</th></tr></thead>
          <tbody id="sysDataBody"></tbody>
        </table>
      </div>
    </div>
  `;
}

window.loadAdminDataTable = async function() {
  const table = document.getElementById('sysDataTableSelect').value;
  const tbody = document.getElementById('sysDataBody');
  const thead = document.getElementById('sysDataHead');
  tbody.innerHTML = '<tr><td colspan="100%">Loading...</td></tr>';
  
  try {
    const data = await apiFetch(`/admin/db/${table}`);
    if (data.length === 0) {
      thead.innerHTML = '<tr><th>No data found</th></tr>';
      tbody.innerHTML = '';
      return;
    }
    
    // Generate headers
    const cols = Object.keys(data[0]);
    thead.innerHTML = '<tr>' + cols.map(c => `<th>${c}</th>`).join('') + '<th>Actions</th></tr>';
    
    // Generate rows
    tbody.innerHTML = data.map(row => {
      // safely escape quotes in the json for the onclick handler
      const safeJson = JSON.stringify(row).replace(/'/g, "&#39;").replace(/"/g, "&quot;");
      let rowHtml = '<tr>';
      cols.forEach(c => {
        let val = row[c];
        if (val && typeof val === 'string' && val.length > 50) val = val.substring(0, 50) + '...';
        rowHtml += `<td>${val !== null ? val : ''}</td>`;
      });
      rowHtml += `<td style="min-width:120px;">
        <button class="btn btn-sm btn-secondary" onclick="editSysData('${table}', '${row.id}', '${safeJson}')">Edit</button>
        <button class="btn btn-sm" style="background:#fee2e2; color:#ef4444; border:none;" onclick="deleteSysData('${table}', '${row.id}')">Del</button>
      </td>`;
      rowHtml += '</tr>';
      return rowHtml;
    }).join('');
    
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="100%" style="color:red;">Error: ${e.message}</td></tr>`;
  }
}

window.editSysData = function(table, id, rowJsonStr) {
  const row = JSON.parse(rowJsonStr.replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
  const cols = Object.keys(row);
  
  let inputsHtml = '';
  cols.forEach(c => {
    if (c === 'id') {
      inputsHtml += `<div class="form-group"><label>${c} (Read-only)</label><input type="text" value="${row[c]}" disabled></div>`;
    } else {
      inputsHtml += `<div class="form-group"><label>${c}</label><input type="text" id="edit_db_${c}" value="${row[c] !== null ? String(row[c]).replace(/"/g, '&quot;') : ''}"></div>`;
    }
  });

  showModal(`
    <div class="modal modal-lg">
      <div class="modal-header"><h3>Edit Record (${table} #${id})</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
      <div class="modal-body" style="max-height:70vh; overflow-y:auto;">
        <div class="form-grid">${inputsHtml}</div>
        <div style="margin-top:1.5rem; text-align:right;">
          <button class="btn btn-primary" onclick="saveSysData('${table}', '${id}', '${cols.join(',')}')">Save Changes</button>
        </div>
      </div>
    </div>
  `);
}

window.saveSysData = async function(table, id, colsStr) {
  const cols = colsStr.split(',');
  const payload = {};
  
  cols.forEach(c => {
    if (c !== 'id') {
      const el = document.getElementById(`edit_db_${c}`);
      if (el) payload[c] = el.value;
    }
  });
  
  try {
    await apiFetch(`/admin/db/${table}/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
    toast('Record updated!');
    closeModal();
    loadAdminDataTable();
  } catch(e) { toast(e.message); }
}

window.deleteSysData = async function(table, id) {
  if(!confirm("DANGER: Are you absolutely sure you want to permanently delete this record? This may break relational integrity!")) return;
  try {
    await apiFetch(`/admin/db/${table}/${id}`, { method: 'DELETE' });
    toast('Record deleted!');
    loadAdminDataTable();
  } catch(e) { toast(e.message); }
}

// --- Software Update Functions ---
window.checkForAppUpdates = function() {
  const statusEl = document.getElementById('updateStatusText');
  const btn = document.getElementById('checkUpdateBtn');
  if (statusEl) statusEl.textContent = 'Checking for updates...';
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:6px;"></i>Checking...'; }
  
  if (window.electronAPI && window.electronAPI.checkForUpdates) {
    window.electronAPI.checkForUpdates();
  } else {
    if (statusEl) statusEl.textContent = 'Updates are only available in the desktop app.';
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-sync-alt" style="margin-right:6px;"></i>Check for Updates'; }
  }
};

// Listen for update status from Electron main process
if (window.electronAPI && window.electronAPI.onUpdateStatus) {
  window.electronAPI.onUpdateStatus((data) => {
    const statusEl = document.getElementById('updateStatusText');
    const btn = document.getElementById('checkUpdateBtn');
    const progressContainer = document.getElementById('updateProgressContainer');
    const progressBar = document.getElementById('updateProgressBar');

    if (statusEl) {
      statusEl.textContent = data.message;
      if (data.status === 'up-to-date') statusEl.style.color = '#16a34a';
      else if (data.status === 'available' || data.status === 'downloading') statusEl.style.color = '#2563eb';
      else if (data.status === 'ready') statusEl.style.color = '#16a34a';
      else if (data.status === 'error') statusEl.style.color = '#dc2626';
      else statusEl.style.color = '#64748b';
    }

    if (data.status === 'checking') {
      if (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.style.cursor = 'not-allowed';
        btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:6px;"></i>Checking...';
      }
    } else if (data.status === 'available' || data.status === 'downloading') {
      if (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.style.cursor = 'not-allowed';
        btn.innerHTML = '<i class="fas fa-download fa-pulse" style="margin-right:6px;"></i>Downloading...';
      }
      if (progressContainer) progressContainer.style.display = 'block';
      if (progressBar && typeof data.percent === 'number') {
        progressBar.style.width = Math.min(100, Math.max(0, data.percent)) + '%';
      }
    } else if (data.status === 'ready') {
      if (progressContainer) progressContainer.style.display = 'block';
      if (progressBar) progressBar.style.width = '100%';
      if (btn) {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
        btn.innerHTML = '<i class="fas fa-power-off" style="margin-right:6px;"></i>Install & Restart Now';
        btn.onclick = function() {
          btn.disabled = true;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:6px;"></i>Installing...';
          if (window.electronAPI && window.electronAPI.quitAndInstall) {
            window.electronAPI.quitAndInstall();
          }
        };
      }
    } else if (data.status === 'up-to-date' || data.status === 'error') {
      if (progressContainer) progressContainer.style.display = 'none';
      if (btn) {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
        btn.innerHTML = '<i class="fas fa-sync-alt" style="margin-right:6px;"></i>Check for Updates';
        btn.onclick = function() { checkForAppUpdates(); };
      }
    }
  });
}

// Get app version on load
if (window.electronAPI && window.electronAPI.getAppVersion) {
  window.electronAPI.getAppVersion().then(v => {
    const el = document.getElementById('appVersionDisplay');
    if (el) el.textContent = v;
  });
}

window.updateSysSettings = async function(btn) {
  const btnText = btn.innerText;
  btn.innerText = 'Saving...';
  btn.disabled = true;
  
  const updates = [
    { key: 'clinic_name', value: document.getElementById('admClinicName').value },
    { key: 'clinic_contact', value: document.getElementById('admClinicContact').value },
    { key: 'clinic_email', value: document.getElementById('admClinicEmail').value },
    { key: 'clinic_address', value: document.getElementById('admClinicAddress').value },
    { key: 'clinic_logo', value: window.tempBase64Logo || '' },
    { key: 'consultation_fee', value: document.getElementById('admConsFee').value },
    { key: 'om_agent_code', value: document.getElementById('admOmAgent').value },
    { key: 'working_hours_start', value: document.getElementById('admStartTime').value },
    { key: 'working_hours_end', value: document.getElementById('admEndTime').value },
    { key: 'closed_days', value: document.getElementById('admClosedDays').value },
    { key: 'slot_duration', value: document.getElementById('admSlotDuration').value },
    { key: 'clinic_policy', value: document.getElementById('admClinicPolicy').value }
  ];
  
  try {
    for (let u of updates) {
      await apiFetch('/settings', {
        method: 'POST',
        body: JSON.stringify(u)
      });
      sysSettings[u.key] = u.value;
    }
    toast('Settings saved successfully!');
  } catch (err) {
    toast('Failed to save settings: ' + err.message);
  }
  
  btn.innerText = btnText;
  btn.disabled = false;
  toast('Settings saved successfully!');
  renderAdminSettings(document.getElementById('mainContent'));
};

window.addUser = function() {
  showModal(`
    <div class="modal">
      <div class="modal-header"><h3>Add New User</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
      <div class="modal-body">
        <label>Full Name</label>
        <input type="text" id="addUName" placeholder="e.g. John Doe" style="width:100%; padding:0.75rem; border-radius:8px; border:1px solid #cbd5e1; margin-bottom:1rem;" />
        
        <label>Email Address</label>
        <input type="email" id="addUEmail" placeholder="e.g. john@example.com" style="width:100%; padding:0.75rem; border-radius:8px; border:1px solid #cbd5e1; margin-bottom:1rem;" />
        
        <label>Password</label>
        <input type="password" id="addUPass" placeholder="Must be at least 6 characters" style="width:100%; padding:0.75rem; border-radius:8px; border:1px solid #cbd5e1; margin-bottom:1rem;" />
        
        <label>System Role</label>
        <select id="addURole" style="width:100%; padding:0.75rem; border-radius:8px; border:1px solid #cbd5e1; margin-bottom:1.5rem;">
          <option value="Admin">Admin (Full Access)</option>
          <option value="Doctor">Doctor</option>
          <option value="Receptionist">Receptionist</option>
          <option value="Nurse">Nurse</option>
          <option value="Pharmacy">Pharmacy</option>
          <option value="Lab Scientist">Lab Scientist</option>
        </select>
        
        <button class="btn btn-primary btn-block" style="padding:1rem;" onclick="submitAddUser()">Create User Account</button>
      </div>
    </div>
  `);
};

window.submitAddUser = async function() {
  const name = document.getElementById('addUName').value;
  const email = document.getElementById('addUEmail').value;
  const password = document.getElementById('addUPass').value;
  const role = document.getElementById('addURole').value;
  
  try {
    const res = await apiFetch('/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });
    toast('User added successfully!');
    closeModal();
    setAdminTab('users'); // Reload table
  } catch (err) {
    toast(err.message);
  }
};

window.updateAppointmentStatus = async function(id, status) {
  if (status === 'Cancelled' || status === 'Rejected') {
    if (!confirm(`Are you sure you want to mark this appointment as ${status}?`)) return;
  }
  toast(`Marking as ${status}...`);
  try {
    await apiFetch(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    allAppointments = await apiFetch('/appointments');
    renderReception(document.getElementById('mainContent'));
    toast(`Appointment ${status}`);
  } catch(err) {
    toast(err.message);
  }
};

window.openRescheduleModal = function(id, currentDate, currentTime) {
  showModal(`
    <div class="modal" style="max-width:400px;">
      <div class="modal-header"><h3>Reschedule Appointment</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
      <div class="modal-body">
        <div class="form-group">
          <label>New Date</label>
          <input type="date" id="reschDate" value="${currentDate}" style="width:100%; padding:0.75rem; border-radius:8px; border:1px solid #cbd5e1;">
        </div>
        <div class="form-group" style="margin-top:1rem;">
          <label>New Time</label>
          <input type="time" id="reschTime" value="${currentTime}" style="width:100%; padding:0.75rem; border-radius:8px; border:1px solid #cbd5e1;">
        </div>
        <button class="btn btn-primary btn-block" style="margin-top:1.5rem;" onclick="submitReschedule('${id}')">Confirm Reschedule</button>
      </div>
    </div>
  `);
};

window.submitReschedule = async function(id) {
  const newDate = document.getElementById('reschDate').value;
  const newTime = document.getElementById('reschTime').value;
  if (!newDate || !newTime) return toast('Please select date and time');
  
  toast('Rescheduling...');
  try {
    await apiFetch(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'Rescheduled', new_date: newDate, new_time: newTime })
    });
    allAppointments = await apiFetch('/appointments');
    closeModal();
    renderReception(document.getElementById('mainContent'));
    toast('Appointment Rescheduled Successfully');
  } catch(err) {
    toast(err.message);
  }
};

window.rescheduleApp = function(id) {
  showModal(`
    <div class="modal">
      <div class="modal-header"><h3>Reschedule Appointment</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
      <div class="modal-body">
        <label>New Date</label>
        <input type="date" id="reschedDate" style="width:100%; padding:0.75rem; border-radius:8px; border:1px solid #cbd5e1; margin-bottom:1rem;" />
        
        <label>New Time</label>
        <input type="time" id="reschedTime" style="width:100%; padding:0.75rem; border-radius:8px; border:1px solid #cbd5e1; margin-bottom:1.5rem;" />
        
        <button class="btn btn-primary btn-block" style="padding:1rem;" onclick="submitReschedule('${id}')">Save New Schedule</button>
      </div>
    </div>
  `);
};

window.submitReschedule = async function(id) {
  const newDate = document.getElementById('reschedDate').value;
  const newTime = document.getElementById('reschedTime').value;
  
  if (!newDate || !newTime) return toast('Please select both a date and a time.');
  
  try {
    await apiFetch(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'Rescheduled', new_date: newDate, new_time: newTime })
    });
    toast('Appointment rescheduled successfully!');
    closeModal();
    nav('reception');
  } catch (err) {
    toast(err.message);
  }
};

window.handleLogoUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) return toast('File is too large! Please select an image under 2MB.');

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64Str = e.target.result;
    window.tempBase64Logo = base64Str;
    const preview = document.getElementById('logoPreview');
    const text = document.getElementById('logoPreviewText');
    if (text) text.style.display = 'none';
    preview.style.display = 'block';
    preview.src = base64Str;
  };
  reader.readAsDataURL(file);
};

window.monitorNetworkStatus = function() {
  const statusEl = document.getElementById('networkStatus');
  if(!statusEl) return;
  const textEl = statusEl.querySelector('span');
  const iconEl = statusEl.querySelector('i');

  function updateStatus() {
    if (!navigator.onLine) {
      statusEl.style.background = 'rgba(239, 68, 68, 0.2)';
      statusEl.style.color = '#fca5a5';
      iconEl.className = 'fas fa-wifi-slash';
      textEl.innerText = 'Offline';
      return;
    }

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g' || conn.downlink < 1) {
        statusEl.style.background = 'rgba(245, 158, 11, 0.2)';
        statusEl.style.color = '#fcd34d';
        iconEl.className = 'fas fa-exclamation-triangle';
        textEl.innerText = 'Slow Network';
      } else {
        statusEl.style.background = 'rgba(16, 185, 129, 0.2)';
        statusEl.style.color = '#6ee7b7';
        iconEl.className = 'fas fa-wifi';
        textEl.innerText = 'Strong Connection';
      }
    } else {
      statusEl.style.background = 'rgba(16, 185, 129, 0.2)';
      statusEl.style.color = '#6ee7b7';
      iconEl.className = 'fas fa-wifi';
      textEl.innerText = 'Online';
    }
  }

  updateStatus();
  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
  
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn) conn.addEventListener('change', updateStatus);
};



window.toggleSidebar = function() {
    const sb = document.querySelector('.sidebar');
    if(sb) {
      sb.classList.toggle('collapsed');
      
      const icon = document.getElementById('advancedToggleIcon');
      const text = document.getElementById('advancedToggleText');
      
      if (sb.classList.contains('collapsed')) {
        if(icon) icon.className = 'fas fa-indent';
        if(text) {
          text.style.display = 'block';
          text.textContent = 'OPEN';
        }
        localStorage.setItem('sidebarCollapsed', 'true');
      } else {
        if(icon) icon.className = 'fas fa-outdent';
        if(text) {
          text.style.display = 'block';
          text.textContent = 'CLOSE';
        }
        localStorage.setItem('sidebarCollapsed', 'false');
      }
    }
  };


window.openPurgeModal = function() {
  const html = `
    <div style="background:white; padding:2rem; border-radius:12px; width:450px; max-width:90%; border-top:4px solid #dc2626; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
      <h2 style="margin-bottom:1rem; color:#dc2626; font-size:1.5rem;"><i class="fas fa-skull-crossbones"></i> System Purge Authorization</h2>
      <p style="color:#64748b; margin-bottom:1.5rem; line-height:1.5;">You are about to irreversibly destroy all clinic transactional data. To proceed, you must provide your Admin Password and type the exact authorization phrase.</p>
      
      <div class="form-group" style="margin-bottom:1.5rem;">
        <label style="color:#0f172a; font-weight:600;">Admin Password</label>
        <input type="password" id="purgePassword" placeholder="Enter your login password" style="width:100%; padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; margin-top:0.5rem;" />
      </div>
      
      <div class="form-group" style="margin-bottom:1.5rem;">
        <label style="color:#0f172a; font-weight:600;">Authorization Phrase</label>
        <p style="font-size:0.85rem; color:#64748b; margin-top:0.25rem;">Type: <strong style="color:#dc2626; user-select:none;">I CONFIRM PURGE</strong></p>
        <input type="text" id="purgePhrase" autocomplete="off" placeholder="I CONFIRM PURGE" style="width:100%; padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; margin-top:0.5rem;" />
      </div>
      
      <div style="display:flex; justify-content:flex-end; gap:1rem; margin-top:2rem;">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn" style="background:#dc2626; color:white;" onclick="submitPurge()">Permanently Delete Data</button>
      </div>
    </div>
  `;
  showModal(html);
};

window.submitPurge = async function() {
  const password = document.getElementById('purgePassword').value;
  const phrase = document.getElementById('purgePhrase').value;
  
  if (!password) return toast('Admin password is required.');
  if (phrase.trim().toUpperCase() !== 'I CONFIRM PURGE') return toast('Invalid authorization phrase. Must match exactly.');
  
  if (!confirm('FINAL WARNING: Are you absolutely sure you want to completely wipe the system? This action is irreversible!')) return;
  
  try {
    toast('Executing high-security purge protocol...');
    const res = await fetch(`${API_URL}/admin/purge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('dcms_token')}`
      },
      body: JSON.stringify({ password, phrase })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Purge failed');
    
    closeModal();
    toast('System Purge Complete. Reloading environment...');
    setTimeout(() => {
      window.location.reload(true);
    }, 2000);
  } catch (err) {
    toast(err.message);
  }
};



// Network Latency Monitor
window.startNetworkMonitor = function() {
  const badge = document.getElementById('networkStatusBadge');
  const icon = document.getElementById('networkWifiIcon');
  const text = document.getElementById('networkStatusText');
  if (!badge) return;

  function updateUI(status, latency) {
    if (status === 'offline') {
      badge.style.background = '#f1f5f9';
      badge.style.color = '#64748b';
      badge.style.borderColor = '#cbd5e1';
      icon.className = 'fas fa-wifi-slash';
      text.innerText = 'OFFLINE';
      badge.title = 'No Internet Connection';
      toast('Network Disconnected!', 'error');
    } else if (status === 'excellent') {
      badge.style.background = '#ecfdf5';
      badge.style.color = '#059669';
      badge.style.borderColor = '#a7f3d0';
      icon.className = 'fas fa-wifi';
      text.innerText = 'EXCELLENT';
      badge.title = `Ping: ${latency}ms`;
    } else if (status === 'fair') {
      badge.style.background = '#fefce8';
      badge.style.color = '#ca8a04';
      badge.style.borderColor = '#fde047';
      icon.className = 'fas fa-signal';
      text.innerText = 'FAIR SIGNAL';
      badge.title = `Ping: ${latency}ms`;
    } else if (status === 'poor') {
      badge.style.background = '#fef2f2';
      badge.style.color = '#dc2626';
      badge.style.borderColor = '#fca5a5';
      icon.className = 'fas fa-exclamation-triangle';
      text.innerText = 'POOR SIGNAL';
      badge.title = `Ping: ${latency}ms`;
    }
  }

  async function pingServer() {
    if (!navigator.onLine) {
      updateUI('offline');
      return;
    }
    const start = Date.now();
    try {
      const res = await fetch('/api/ping');
      if (res.ok) {
        const latency = Date.now() - start;
        if (latency < 150) updateUI('excellent', latency);
        else if (latency < 400) updateUI('fair', latency);
        else updateUI('poor', latency);
      } else {
        updateUI('offline');
      }
    } catch (e) {
      updateUI('offline');
    }
  }

  window.addEventListener('online', pingServer);
  window.addEventListener('offline', () => updateUI('offline'));

  // Ping every 10 seconds
  setInterval(pingServer, 10000);
  pingServer();
};


window.exportReportsCSV = function() {
  if (!window.reportDataCache) {
    toast('No data to export', 'error');
    return;
  }
  const { revLabels, revData, patientLabels, patientData, topDiag, diagCounts } = window.reportDataCache;
  
  let csv = 'Report Generated: ' + new Date().toLocaleString() + '\n\n';
  
  csv += 'REVENUE TRENDS\n';
  csv += 'Month,Revenue (Le)\n';
  for(let i=0; i<revLabels.length; i++) {
    csv += `${revLabels[i]},${revData[i]}\n`;
  }
  
  csv += '\nPATIENT VISITS\n';
  csv += 'Month,Visits\n';
  for(let i=0; i<patientLabels.length; i++) {
    csv += `${patientLabels[i]},${patientData[i]}\n`;
  }
  
  csv += '\nTOP DIAGNOSES\n';
  csv += 'Diagnosis,Count\n';
  for(let i=0; i<topDiag.length; i++) {
    csv += `"${topDiag[i]}",${diagCounts[i]}\n`;
  }
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Radiance Derms_Analytics_Report.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};


function renderDocTimeline(container) {
  if (!activeConsPatId) {
    container.innerHTML = `<div class="card" style="text-align:center; padding:3rem; color:#64748b;">Please select a patient from the Appointment Queue first.</div>`;
    return;
  }
  
  const p = allPatients.find(x => x.id == activeConsPatId);
  container.innerHTML = `<div class="card" style="padding:2rem;">
    <h3 style="color:#0f172a; margin-bottom:1rem;"><i class="fas fa-stream" style="color:#3b82f6;"></i> Comprehensive Medical Timeline: ${p ? p.name : 'Unknown'}</h3>
    <div id="timelineContent" style="position:relative; padding-left:2rem; border-left:2px solid #e2e8f0; margin-top:2rem;">
      <div style="color:#64748b;">Loading timeline events...</div>
    </div>
  </div>`;
  
  apiFetch(`/patients/${activeConsPatId}/timeline`).then(events => {
    const tContent = document.getElementById('timelineContent');
    if (!events || events.length === 0) {
      tContent.innerHTML = '<div style="color:#64748b;">No medical history found for this patient.</div>';
      return;
    }
    
    let html = '';
    events.forEach(ev => {
      let icon = 'fa-notes-medical';
      let color = '#3b82f6';
      let title = 'Medical Event';
      let desc = '';
      let dateStr = new Date(ev.sortDate).toLocaleString();
      
      if (ev.type === 'appointment') {
        icon = 'fa-calendar-check'; color = '#8b5cf6'; title = 'Appointment';
        desc = `Status: ${ev.status} | Reason: ${ev.reason}`;
      } else if (ev.type === 'consultation') {
        icon = 'fa-user-md'; color = '#10b981'; title = 'Consultation';
        desc = `<strong>Working Diagnosis:</strong> ${ev.working_diagnosis || 'N/A'}<br>
               <strong>Primary Complaint:</strong> ${ev.primary_complaint || 'None'}<br>
               <div style="margin-top:0.5rem; display:flex; gap:0.5rem;">
                 <button class="btn btn-sm" style="background:#1e3a8a; color:white; border:none; padding:4px 8px; font-size:11px;" onclick="printClinicalRecordCard('${ev.id}')">
                   <i class="fas fa-file-medical"></i> Print Record Card
                 </button>
                 <button class="btn btn-sm btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="printPrescription('${ev.id}')">
                   Print Rx
                 </button>
               </div>`;
      } else if (ev.type === 'prescription') {
        icon = 'fa-pills'; color = '#f59e0b'; title = 'Prescription Issued';
        desc = `Status: ${ev.status}`;
      } else if (ev.type === 'lab_order') {
        icon = 'fa-flask'; color = '#ef4444'; title = 'Lab Test Ordered';
        desc = `Status: ${ev.status} | Results: ${ev.results || 'Pending'}`;
      } else if (ev.type === 'triage') {
        icon = 'fa-heartbeat'; color = '#ec4899'; title = 'Nursing Triage';
        desc = `BP: ${ev.blood_pressure || '--'} | Temp: ${ev.temperature || '--'}°C | Weight: ${ev.weight || '--'}kg`;
      }
      
      html += `
        <div style="position:relative; margin-bottom:2rem;">
          <div style="position:absolute; left:-2.85rem; top:0; width:40px; height:40px; border-radius:50%; background:white; border:2px solid ${color}; display:flex; align-items:center; justify-content:center; color:${color}; box-shadow:0 2px 4px rgba(0,0,0,0.1);"><i class="fas ${icon}"></i></div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:1rem; margin-left:1rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
              <strong style="color:#0f172a;">${title}</strong>
              <span style="color:#64748b; font-size:0.85rem;">${dateStr}</span>
            </div>
            <div style="color:#475569; font-size:0.95rem; line-height:1.4;">${desc}</div>
          </div>
        </div>
      `;
    });
    
    tContent.innerHTML = html;
  }).catch(err => {
    document.getElementById('timelineContent').innerHTML = '<div style="color:#ef4444;">Failed to load timeline.</div>';
  });
}
