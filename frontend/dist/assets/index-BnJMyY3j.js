(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=window.location.hostname===`localhost`||window.location.hostname===`127.0.0.1`?`http://localhost:3000/api`:`/api`;window.searchTimeout=null,window.filterTable=function(e,t){window.searchTimeout&&clearTimeout(window.searchTimeout),window.searchTimeout=setTimeout(()=>{t=t.toLowerCase();let n=document.getElementById(e);if(!n)return;let r=n.getElementsByTagName(`tr`);for(let e of r)e.textContent.toLowerCase().includes(t)?e.style.display=``:e.style.display=`none`},300)},window.formatID=function(e,t){return e?`${t}-${e.toString().substring(0,4).toUpperCase()}`:``},window.exportTableToCSV=function(e,t,n){let r=document.getElementById(e);if(!r)return;let i=n?n.innerHTML:``;n&&(n.innerHTML=`<i class="fas fa-spinner fa-spin"></i> Exporting...`,n.disabled=!0),setTimeout(()=>{let e=[],a=r.previousElementSibling;if(a&&a.tagName===`THEAD`){let t=[],n=a.querySelectorAll(`th`);for(let e of n)e.innerText!==`Actions`&&t.push(`"`+e.innerText.replace(/"/g,`""`)+`"`);e.push(t.join(`,`))}let o=r.querySelectorAll(`tr`);for(let t=0;t<o.length;t++){if(o[t].style.display===`none`)continue;let n=[],r=o[t].querySelectorAll(`td, th`);for(let e=0;e<r.length;e++){if(e===r.length-1&&a&&a.querySelectorAll(`th`)[e]?.innerText===`Actions`)continue;let t=r[e].innerText.replace(/"/g,`""`);n.push(`"`+t+`"`)}e.push(n.join(`,`))}let s=new Blob([e.join(`
`)],{type:`text/csv`}),c=document.createElement(`a`);c.download=t,c.href=window.URL.createObjectURL(s),c.style.display=`none`,document.body.appendChild(c),c.click(),document.body.removeChild(c),n&&(n.innerHTML=i,n.disabled=!1)},100)};var t=null,n=[],r=[],i=[],a=[],o=[],s={};window.publicBrand={clinic_name:`Radiance Derms`,clinic_logo:``},window.showModal=function(e){closeModal();let t=document.createElement(`div`);t.className=`modal-overlay`,t.id=`activeModalOverlay`,t.innerHTML=e,document.body.appendChild(t)},window.closeModal=function(){let e=document.getElementById(`activeModalOverlay`);e&&e.remove()},window.toast=function(e){let t=document.getElementById(`toast-container`),n=document.createElement(`div`);n.className=`toast`,n.innerText=e,t.appendChild(n),setTimeout(()=>n.remove(),3e3)};async function c(t,n={}){let r=localStorage.getItem(`dcms_token`),i={"Content-Type":`application/json`};r&&(i.Authorization=`Bearer ${r}`);let a=await fetch(`${e}${t}`,{...n,headers:i}),o=await a.json();if(!a.ok)throw(a.status===401||a.status===403)&&(localStorage.removeItem(`dcms_token`),localStorage.removeItem(`dcms_user`),window.location.reload()),Error(o.error||`API Error`);return o}var l=document.getElementById(`app`);function u(){let t=window.publicBrand.clinic_name||`Radiance Derms`;l.innerHTML=`
    <div class="auth-wrapper">
      <div class="auth-card" style="text-align:center;">
          ${`
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; margin-bottom:1.5rem; gap:12px;">
      <div class="logo-wrapper-pro" style="margin:0; max-width:160px; max-height:80px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
        <img src="${window.publicBrand.clinic_logo||`/logo.png`}" style="width:100%; height:100%; object-fit:contain; border-radius:8px;" onerror="this.style.display='none'">
      </div>
      <h1 style="margin:0; font-size:1.6rem; font-weight:800; letter-spacing:1px; background: linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0px 2px 4px rgba(37, 99, 235, 0.15));">${t}</h1>
    </div>
  `}
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
  `,document.getElementById(`togglePassword`).addEventListener(`click`,function(){let e=document.getElementById(`password`),t=document.getElementById(`eyeIcon`);e.type===`password`?(e.type=`text`,t.innerHTML=`<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path><line x1="1" y1="1" x2="23" y2="23"></line>`):(e.type=`password`,t.innerHTML=`<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`)}),document.getElementById(`loginForm`).addEventListener(`submit`,async t=>{t.preventDefault();let n=t.target.querySelector(`button[type="submit"]`),r=n.innerHTML;n.innerHTML=`<i class="fas fa-spinner fa-spin"></i> Signing In...`,n.disabled=!0;try{let n=await fetch(`${e}/auth/login`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({username:t.target.username.value,password:t.target.password.value})}),r=await n.json();if(!n.ok)throw Error(r.error);localStorage.setItem(`dcms_token`,r.token),localStorage.setItem(`dcms_user`,JSON.stringify(r.user)),initApp()}catch(e){toast(e.message)}finally{n.innerHTML=r,n.disabled=!1}})}function d(){l.innerHTML=`
    <div class="app-layout">
      <div class="sidebar ${localStorage.getItem(`sidebarCollapsed`)===`true`?`collapsed`:``}" style="display:flex; flex-direction:column; background: #ffffff; color:#334155; border-right: 3px solid transparent; border-image: linear-gradient(180deg, rgba(14, 165, 233, 0.8) 0%, rgba(16, 185, 129, 0.8) 100%) 1; box-shadow: 4px 0 20px rgba(0,0,0,0.05); z-index:50;">
          
        
        <div class="sidebar-header" style="padding:1.5rem 1.5rem 1rem 1.5rem; background: #ffffff; text-align:center; display:flex; flex-direction:column; align-items:center;">
          ${window.publicBrand.clinic_logo?`<img src="${window.publicBrand.clinic_logo}" class="sidebar-logo-image" style="width: 100%; max-width: 170px; max-height: 90px; object-fit: contain; mix-blend-mode: multiply; margin-bottom: 0.5rem; transition:all 0.3s;">`:`<div class="sidebar-logo-icon" style="width:70px; height:70px; border-radius:50%; background:linear-gradient(135deg, #0ea5e9, #2563eb); display:flex; align-items:center; justify-content:center; color:white; font-size:2rem; margin-bottom:0.5rem; box-shadow:0 10px 20px rgba(37, 99, 235, 0.2); transition:all 0.3s;">🏥</div>`}
          <h2 class="sidebar-clinic-name" style="font-size:0.95rem; margin:0; font-weight:800; letter-spacing:0.5px; color:#0f172a; text-transform:uppercase; line-height:1.3; margin-bottom:0.5rem; transition:all 0.3s; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;">${window.publicBrand.clinic_name||`Radiance Derms`}</h2>
          <div id="networkStatusBadge" style="cursor:help; font-size:0.65rem; font-weight:800; letter-spacing:1px; background: #ecfdf5; color:#059669; padding: 4px 10px; border-radius: 20px; display: inline-flex; align-items: center; gap: 6px; border: 1px solid #a7f3d0; transition:all 0.3s; white-space:nowrap;" title="Checking Network..."><i class="fas fa-wifi" id="networkWifiIcon"></i> <span id="networkStatusText" class="status-text">ONLINE</span></div>
        </div>
          
          <div class="toggle-btn-container" style="padding: 0 1.5rem 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; transition: padding 0.3s;">
              <button onclick="toggleSidebar()" class="advanced-toggle-btn" title="Toggle Menu">
                <i class="${localStorage.getItem(`sidebarCollapsed`)===`true`?`fas fa-indent`:`fas fa-outdent`}" id="advancedToggleIcon"></i> 
                <span id="advancedToggleText">${localStorage.getItem(`sidebarCollapsed`)===`true`?`OPEN`:`CLOSE`}</span>
              </button>
            </div>

          <div class="sidebar-nav" id="navMenu" style="flex:1; overflow-y:auto; padding:1.5rem 1rem 0 1rem; background: #ffffff;"></div>
          
          <div class="sidebar-footer" style="padding:1.5rem; background: #ffffff; border-top:1px solid #e2e8f0; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:1rem;">
          <div style="display:flex; align-items:center; width:100%; gap:12px; transition:all 0.3s;" id="footerProfileRow">
            <div style="min-width:40px; height:40px; border-radius:10px; background:linear-gradient(135deg, #0ea5e9, #2563eb); color:white; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.1rem;">${t.name.charAt(0).toUpperCase()}</div>
            <div style="text-align:left; flex:1; overflow:hidden;" class="footer-profile-text">
              <p style="margin:0; color:#0f172a; font-weight:700; font-size:0.9rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${t.name}</p>
              <p style="margin:0; color:#64748b; font-size:0.75rem; text-transform:capitalize;">${t.role}</p>
            </div>
          </div>
          <button onclick="logout()" class="logout-btn" data-tooltip="Secure Logout" style="width:100%; padding:0.6rem; border-radius:8px; border:none; background:#fee2e2; color:#ef4444; font-weight:600; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px;" onmouseover="this.style.background='#ef4444'; this.style.color='white'" onmouseout="this.style.background='#fee2e2'; this.style.color='#ef4444'" title="Logout"><i class="fas fa-sign-out-alt"></i> <span class="logout-text">Logout</span></button>
        </div>
      </div>
      <div class="main-content" id="mainContent"></div>
    </div>
  `;let e=``,n=t.role;n===`Admin`&&(e+=`<div class="nav-label">System</div><button class="nav-item" onclick="nav('admin')" data-tooltip="Admin Dashboard"><i class="fas fa-chart-pie nav-icon"></i> <span class="nav-text">Admin Dashboard</span></button>`),(n===`Admin`||n===`Receptionist`)&&(e+=`<div class="nav-label">Front Desk</div><button class="nav-item" onclick="nav('reception')" data-tooltip="Appointments"><i class="fas fa-calendar-check nav-icon"></i> <span class="nav-text">Appointments</span></button>`),(n===`Admin`||n===`Doctor`)&&(e+=`<div class="nav-label">Clinical</div><button class="nav-item" onclick="nav('doctor')" data-tooltip="Doctor Dashboard"><i class="fas fa-user-md nav-icon"></i> <span class="nav-text">Doctor Dashboard</span></button>`),(n===`Admin`||n===`Lab Scientist`)&&(e+=`<div class="nav-label">Laboratory</div><button class="nav-item" onclick="nav('lab')" data-tooltip="Lab Dashboard"><i class="fas fa-flask nav-icon"></i> <span class="nav-text">Lab Dashboard</span></button>`),(n===`Admin`||n===`Pharmacy`||n===`Receptionist`)&&(e+=`<div class="nav-label">Pharmacy</div><button class="nav-item" onclick="nav('pharmacy')" data-tooltip="Pharmacy Dashboard"><i class="fas fa-pills nav-icon"></i> <span class="nav-text">Pharmacy Dashboard</span></button>`),(n===`Admin`||n===`Nurse`)&&(e+=`<div class="nav-label">Nursing</div><button class="nav-item" onclick="nav('nurse')" data-tooltip="Nursing Dashboard"><i class="fas fa-user-nurse nav-icon"></i> <span class="nav-text">Nursing Dashboard</span></button>`),(n===`Admin`||n===`Receptionist`)&&(e+=`<div class="nav-label">Finance</div><button class="nav-item" onclick="nav('billing')" data-tooltip="Billing & Checkout"><i class="fas fa-file-invoice-dollar nav-icon"></i> <span class="nav-text">Billing & Checkout</span></button>`),document.getElementById(`navMenu`).innerHTML=e,monitorNetworkStatus()}window.logout=function(){localStorage.clear(),window.location.reload()},window.nav=function(e){let t=document.getElementById(`mainContent`);t.innerHTML=`<div style="text-align:center; padding:3rem; color:#888;">Loading...</div>`,document.querySelectorAll(`.nav-item`).forEach(e=>e.classList.remove(`active`));let n=Array.from(document.querySelectorAll(`.nav-item`)).find(t=>t.getAttribute(`onclick`)===`nav('${e}')`);n&&n.classList.add(`active`),e===`admin`?p(t):e===`reception`?_(t):e===`doctor`?x(t):e===`lab`?T(t):e===`pharmacy`?E(t):e===`nurse`?D(t):e===`billing`&&O(t)},window.initApp=async function(){try{let t=await fetch(`${e}/public/branding`);t.ok&&(window.publicBrand=await t.json())}catch(e){console.error(`Branding fetch failed`,e)}let l=localStorage.getItem(`dcms_user`);if(!l)return u();t=JSON.parse(l),d(),startNetworkMonitor();let f=document.getElementById(`mainContent`);f&&(f.innerHTML=`<div style="display:flex; justify-content:center; align-items:center; height:100%;"><i class="fas fa-spinner fa-spin fa-3x" style="color:#3b82f6;"></i><h3 style="margin-left:1rem; color:#64748b;">Loading System Data...</h3></div>`);try{let e=[];e.push(c(`/settings`).then(e=>s=e).catch(e=>(console.error(`Settings fetch failed`,e),toast(`Failed to load settings from server. Check your connection.`),{}))),[`Admin`,`Receptionist`,`Doctor`].includes(t.role)&&(e.push(c(`/patients`).then(e=>n=e).catch(e=>(console.error(`Data fetch failed`,e),toast(`Failed to load data from server. Check your connection.`),[]))),e.push(c(`/appointments`).then(e=>r=e).catch(e=>(console.error(`Data fetch failed`,e),toast(`Failed to load data from server. Check your connection.`),[])))),[`Admin`,`Doctor`].includes(t.role)&&(e.push(c(`/consultations/lab_catalog`).then(e=>i=e).catch(e=>(console.error(`Data fetch failed`,e),toast(`Failed to load data from server. Check your connection.`),[]))),e.push(c(`/consultations/pharmacy_inventory`).then(e=>a=e).catch(e=>(console.error(`Data fetch failed`,e),toast(`Failed to load data from server. Check your connection.`),[]))),e.push(c(`/consultations/treatment_catalog`).then(e=>o=e).catch(e=>(console.error(`Data fetch failed`,e),toast(`Failed to load data from server. Check your connection.`),[])))),await Promise.all(e),t.role===`Admin`?nav(`admin`):t.role===`Receptionist`?nav(`reception`):t.role===`Doctor`?nav(`doctor`):t.role===`Lab Scientist`?nav(`lab`):t.role===`Pharmacy`?nav(`pharmacy`):t.role===`Nurse`&&nav(`nurse`)}catch{toast(`Failed to load initial data`)}},initApp();var f=`reports`;function p(e){e.innerHTML=`
    <div class="page-header">
      <div><div class="page-title">Admin Dashboard</div></div>
    </div>
    <div style="display:flex; gap:1rem; border-bottom:1px solid #e2e8f0; margin-bottom:1.5rem;">
      <button class="btn ${f===`reports`?`btn-primary`:`btn-secondary`}" onclick="setAdminTab('reports')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;">Reports</button>
      <button class="btn ${f===`users`?`btn-primary`:`btn-secondary`}" onclick="setAdminTab('users')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;">User Management</button>
      <button class="btn ${f===`settings`?`btn-primary`:`btn-secondary`}" onclick="setAdminTab('settings')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;">Settings & Catalog</button>
      <button class="btn ${f===`data`?`btn-primary`:`btn-secondary`}" onclick="setAdminTab('data')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;">System Data</button>
    </div>
    <div id="adminTabContent"></div>
  `;let t=document.getElementById(`adminTabContent`);f===`reports`?m(t):f===`users`?h(t):f===`settings`?g(t):k(t)}window.setAdminTab=function(e){f=e,p(document.getElementById(`mainContent`))};function m(e){e.innerHTML=`<div id="adminReportsContainer">
      <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
        <div>
          <div class="page-title">Clinic Performance Overview</div>
          <div style="color:#64748b; font-size:0.9rem; margin-top:0.25rem;">Real-time analytics and revenue tracking</div>
        </div>
        <div style="display:flex; gap:10px;" class="no-print">
          <button class="btn btn-secondary" onclick="exportReportsCSV(this)" style="display:flex; align-items:center; gap:8px;"><i class="fas fa-file-csv"></i> Export CSV</button>
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
        <div class="card" style="padding:2rem;">
          <h3 style="color:#1e293b; font-size:1.1rem; margin-bottom:1.5rem; font-weight:600;">Patient Demographics (Gender)</h3>
          <div style="position: relative; height:350px; width:100%;">
            <canvas id="demoChart"></canvas>
          </div>
        </div>
      </div>
    `,c(`/admin/reports`).then(e=>{window.reportDataCache=e,document.getElementById(`rPat`).innerText=e.patients,document.getElementById(`rRev`).innerText=`Le `+(e.revenue||0).toLocaleString(),document.getElementById(`rLab`).innerText=e.labs,document.getElementById(`rRx`).innerText=e.prescriptions,window.Chart&&(window.adminLineChart&&window.adminLineChart.destroy(),window.adminDonutChart&&window.adminDonutChart.destroy(),window.adminLineChart=new Chart(document.getElementById(`lineChart`),{type:`line`,data:{labels:e.chartData.labels,datasets:[{label:`Revenue`,data:e.chartData.revenue,borderColor:`#10b981`,backgroundColor:`#10b98122`,fill:!0,tension:.4},{label:`Patients`,data:e.chartData.patients,borderColor:`#3b82f6`,backgroundColor:`#3b82f622`,fill:!0,tension:.4}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:`top`}}}}),window.adminDonutChart=new Chart(document.getElementById(`donutChart`),{type:`doughnut`,data:{labels:e.diagnosisData.labels,datasets:[{data:e.diagnosisData.data,backgroundColor:[`#3b82f6`,`#8b5cf6`,`#f43f5e`,`#f59e0b`,`#10b981`],borderWidth:0}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:`bottom`}},cutout:`70%`}}),window.adminDemoChart&&window.adminDemoChart.destroy(),window.adminDemoChart=new Chart(document.getElementById(`demoChart`),{type:`pie`,data:{labels:e.demoData?e.demoData.labels:[`Male`,`Female`],datasets:[{data:e.demoData?e.demoData.data:[50,50],backgroundColor:[`#3b82f6`,`#f43f5e`,`#cbd5e1`],borderWidth:0}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:`bottom`}}}}))})}function h(e){e.innerHTML=`
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
  `,c(`/users`).then(e=>{let t=document.getElementById(`admUserTb`);if(!t)return;let n={Admin:`#fef3c7`,Doctor:`#dbeafe`,Receptionist:`#fce7f3`,Nurse:`#e0e7ff`,Pharmacy:`#ffedd5`,"Lab Scientist":`#ede9fe`};t.innerHTML=e.map(e=>`
      <tr>
        <td style="padding:1rem;">
          <div style="font-weight:600; color:#0f172a;">${e.name}</div>
          <div style="font-size:0.85rem; color:#64748b;">${e.email}</div>
        </td>
        <td style="padding:1rem;">
          <span style="background:${n[e.role]||`#f1f5f9`}; padding:4px 10px; border-radius:12px; font-size:0.8rem; font-weight:600; color:#334155;">${e.role}</span>
        </td>
        <td style="padding:1rem;">
          <span style="color:${e.status===`active`?`#16a34a`:`#dc2626`}; font-weight:600; font-size:0.85rem;">${e.status}</span>
        </td>
        <td style="padding:1rem;">
          <div style="display:flex; gap:0.5rem;">
            ${e.status===`active`?`<button class="btn btn-sm" style="background:#f1f5f9; color:#475569;" onclick="toggleUserStatus('${e.id}', 'suspended')">Suspend</button>`:`<button class="btn btn-sm" style="background:#ecfdf5; color:#10b981;" onclick="toggleUserStatus('${e.id}', 'active')">Restore</button>`}
            <button class="btn btn-sm" style="background:#fee2e2; color:#ef4444; border:none;" onclick="delUser('${e.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join(``)})}function g(e){window.tempBase64Logo=s.clinic_logo||``,e.innerHTML=`
    <div class="card" style="margin-bottom:1.5rem; padding:2rem;">
      <h3 style="margin-bottom:1.5rem; color:#1e293b; font-size:1.1rem; font-weight:600;">System Settings & Clinic Info</h3>
      
      <div style="display:flex; gap:2rem; align-items:flex-start; margin-bottom:2rem; flex-wrap:wrap;">
        <div style="flex:0 0 120px; text-align:center;">
          <div style="width:120px; height:120px; border-radius:12px; border:2px dashed #cbd5e1; display:flex; align-items:center; justify-content:center; overflow:hidden; background:#f8fafc; margin-bottom:0.5rem;">
            ${s.clinic_logo?`<img id="logoPreview" src="${s.clinic_logo}" style="width:100%; height:100%; object-fit:contain;">`:`<span id="logoPreviewText" style="color:#94a3b8; font-size:0.8rem;">No Logo</span><img id="logoPreview" style="display:none; width:100%; height:100%; object-fit:contain;">`}
          </div>
          <label class="btn btn-sm btn-secondary" style="cursor:pointer; display:block;">
            Upload Logo
            <input type="file" id="admClinicLogoFile" accept="image/*" style="display:none;" onchange="handleLogoUpload(event)">
          </label>
        </div>
        
        <div class="form-grid" style="flex:1; min-width:300px;">
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">Clinic Name</label>
            <input type="text" id="admClinicName" value="${s.clinic_name||`Radiance Dermatology & Aesthetic Clinic`}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">Clinic Contact</label>
            <input type="text" id="admClinicContact" value="${s.clinic_contact||`+232 77 123 456`}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">Clinic Email</label>
            <input type="email" id="admClinicEmail" value="${s.clinic_email||`contact@dcmsclinic.com`}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">Default Booking Fee (Le)</label>
            <input type="number" id="admConsFee" value="${s.consultation_fee||300}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">Orange Money Agent Code</label>
            <input type="text" id="admOmAgent" value="${s.om_agent_code||`123456`}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group span2" style="grid-column: span 2;">
            <label style="color:#475569; font-weight:500;">Clinic Address (Location)</label>
            <input type="text" id="admClinicAddress" value="${s.clinic_address||`123 Health Ave, Freetown`}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group span2" style="grid-column: span 2;">
            <label style="color:#475569; font-weight:500;">About Clinic (Description for Patient App)</label>
            <textarea id="admAboutClinic" rows="4" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%; font-family:inherit;">${s.about_clinic||`Welcome to Radiance Dermatology & Aesthetic Clinic...`}</textarea>
          </div>
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">Start Time</label>
            <input type="time" id="admStartTime" value="${s.working_hours_start||`09:00`}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">End Time</label>
            <input type="time" id="admEndTime" value="${s.working_hours_end||`17:00`}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">Closed Days (comma separated)</label>
            <input type="text" id="admClosedDays" value="${s.closed_days||`Sunday`}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;" placeholder="e.g. Saturday, Sunday">
          </div>
          <div class="form-group">
            <label style="color:#475569; font-weight:500;">Slot Duration (minutes)</label>
            <input type="number" id="admSlotDuration" value="${s.slot_duration||30}" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%;">
          </div>
          <div class="form-group span2" style="grid-column: span 2;">
            <label style="color:#475569; font-weight:500;">Clinic Policy & Conduct</label>
            <textarea id="admClinicPolicy" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%; height:100px; resize:vertical;">${s.clinic_policy||`Please arrive 10 minutes early. Cancellations require 24h notice.`}</textarea>
          </div>
          
          <div class="form-group span2" style="grid-column: span 2; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
            <label style="color:#475569; font-weight:500;"><i class="fas fa-envelope"></i> Email Template: Booking Approved (Use {{name}}, {{date}}, {{time}})</label>
            <textarea id="admEmailApproved" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%; height:100px; resize:vertical;">${s.email_approved||`Hello {{name}}, Your appointment for {{date}} at {{time}} is approved.`}</textarea>
          </div>
          <div class="form-group span2" style="grid-column: span 2;">
            <label style="color:#475569; font-weight:500;"><i class="fas fa-envelope"></i> Email Template: Appointment Reminder (Use {{name}}, {{date}}, {{time}})</label>
            <textarea id="admEmailReminder" style="padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; width:100%; height:100px; resize:vertical;">${s.email_reminder||`Hello {{name}}, A reminder for your appointment on {{date}} at {{time}}.`}</textarea>
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
  `,c(`/admin/purge-logs`).then(e=>{let t=document.getElementById(`purgeLogsContainer`);if(t){if(!e||e.length===0){t.innerHTML=`<div style="color:#94a3b8; font-size:0.9rem; font-style:italic;">No purge history recorded.</div>`;return}t.innerHTML=e.map(e=>`
        <div style="padding:0.75rem; border-bottom:1px solid #e2e8f0; font-size:0.9rem; display:flex; justify-content:space-between;">
          <div><strong style="color:#dc2626;">${e.adminName||`Admin`}</strong> (${e.adminEmail||`N/A`})</div>
          <div style="color:#64748b;">${new Date(e.timestamp).toLocaleString()}</div>
        </div>
      `).join(``)}}).catch(e=>{let t=document.getElementById(`purgeLogsContainer`);t&&(t.innerHTML=`<div style="color:#ef4444; font-size:0.9rem;">Failed to load purge history.</div>`)})}window.toggleUserStatus=async function(e,t){try{await c(`/users/${e}/status`,{method:`PATCH`,body:JSON.stringify({status:t})}),toast(`User status updated`),p(document.getElementById(`mainContent`))}catch(e){toast(e.message)}},window.editCatalog=async function(e){try{let t=await c(`/consultations/${e}`),n=e===`pharmacy_inventory`;showModal(`
      <div class="modal modal-lg">
        <div class="modal-header"><h3>Edit ${e.replace(`_`,` `).toUpperCase()}</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
        <div class="modal-body">
          <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem; padding:1rem; background:#f8fafc; border-radius:8px;">
            <input type="text" id="newCatName" placeholder="New item name..." style="flex:2; padding:0.5rem;">
            <input type="number" id="newCatPrice" placeholder="Price (Le)" style="flex:1; padding:0.5rem;">
            ${n?`<input type="number" id="newCatStock" placeholder="Stock" style="flex:0.5; padding:0.5rem;">`:``}
            <button class="btn btn-primary" onclick="addCatalogItem('${e}')">+ Add</button>
          </div>
          <div style="max-height:50vh; overflow-y:auto; padding-right:1rem;">
            ${t.map(t=>`
              <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem; border-bottom:1px solid #e2e8f0;">
                <div style="flex:1; font-weight:600; color:#334155;">${t.test_name||t.drug_name||t.treatment_name}</div>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span style="font-size:0.8rem; color:#64748b;">Le</span>
                  <input type="number" id="cat_${e}_${t.id}" value="${t.price}" style="width:100px; text-align:right; padding:0.25rem;">
                  ${n?`<span style="font-size:0.8rem; color:#64748b; margin-left:0.5rem;">Qty:</span><input type="number" id="stock_${e}_${t.id}" value="${t.stock||0}" style="width:60px; text-align:right; padding:0.25rem;">`:``}
                  <button class="btn btn-sm btn-secondary" onclick="updateCatalogItem(this, '${e}', '${t.id}')">Save</button>
                  <button class="btn btn-sm" style="background:#fee2e2; color:#ef4444; border:none;" onclick="deleteCatalogItem('${e}', '${t.id}')">Del</button>
                </div>
              </div>
            `).join(``)}
            ${t.length===0?`<p style="text-align:center; padding:1rem;">No items found.</p>`:``}
          </div>
        </div>
      </div>
    `)}catch(e){toast(e.message)}},window.addCatalogItem=async function(e){let t=document.getElementById(`newCatName`).value,n=document.getElementById(`newCatPrice`).value,r=document.getElementById(`newCatStock`),i=r?r.value:null;if(!t||!n)return toast(`Name and price required`);try{await c(`/admin/catalog/${e}`,{method:`POST`,body:JSON.stringify({name:t,price:n,stock:i})}),toast(`Item added successfully`),editCatalog(e)}catch(e){toast(e.message)}},window.updateCatalogItem=async function(e,t,n){let r=e.innerHTML;e.innerHTML=`<i class="fas fa-spinner fa-spin"></i> Processing...`,e.disabled=!0;let i=document.getElementById(`cat_${t}_${n}`).value,a=document.getElementById(`stock_${t}_${n}`),o=a?a.value:null;try{await c(`/admin/catalog/${t}/${n}`,{method:`PATCH`,body:JSON.stringify({price:i,stock:o})}),toast(`Item updated!`)}catch(e){toast(e.message)}e.innerHTML=r,e.disabled=!1},window.deleteCatalogItem=async function(e,t){if(confirm(`Are you sure you want to delete this item?`))try{await c(`/admin/catalog/${e}/${t}`,{method:`DELETE`}),toast(`Item deleted`),editCatalog(e)}catch(e){toast(e.message)}},window.delUser=async function(e){if(confirm(`Are you sure you want to delete this user?`))try{await c(`/users/${e}`,{method:`DELETE`}),toast(`User deleted`),p(document.getElementById(`mainContent`))}catch(e){toast(e.message)}},window.receptionTab=window.receptionTab||`appointments`;function _(e){let t=new Date().toISOString().split(`T`)[0],n=r.filter(e=>e.status!==`Completed`&&e.status!==`Cancelled`&&e.status!==`Rejected`&&e.date>=t),i=s.consultation_fee||15e4;e.innerHTML=`
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
      <div style="display:flex; gap:0.5rem; background:#e2e8f0; padding:4px; border-radius:10px;">
        <button class="btn ${window.receptionTab===`appointments`?`btn-primary`:`btn-secondary`}" onclick="setReceptionTab('appointments')" style="border-radius:8px; padding:0.5rem 1.25rem;"><i class="fas fa-calendar-check" style="margin-right:6px;"></i>Appointments & Reception</button>
        <button class="btn ${window.receptionTab===`pharmacy`?`btn-primary`:`btn-secondary`}" onclick="setReceptionTab('pharmacy')" style="border-radius:8px; padding:0.5rem 1.25rem;"><i class="fas fa-pills" style="margin-right:6px;"></i>Pharmacy Dashboard</button>
      </div>
      ${window.receptionTab===`appointments`?`<button class="btn" onclick="openBookAppointmentModal()">+ Book Appointment</button>`:``}
    </div>

    <div id="receptionTabContent"></div>
  `;let a=document.getElementById(`receptionTabContent`);window.receptionTab===`pharmacy`?E(a):(a.innerHTML=`
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3>Upcoming Appointments</h3>
          <input type="text" id="receptionSearch" placeholder="Search appointments..." style="padding:0.5rem; border-radius:8px; border:1px solid #cbd5e1; min-width:250px;" oninput="filterTable('upcomingAppsBody', this.value)">
        </div>
        <div class="table-wrap" style="margin-top:1rem;">
          <table>
            <thead><tr><th>Date & Time</th><th>Patient</th><th>Doctor</th><th>Purpose</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody id="upcomingAppsBody">
              ${n.slice(0,50).map(e=>`<tr>
                <td>${e.date} <br><small style="color:#64748b;">${e.time}</small></td>
                <td><strong>${e.patient_name}</strong></td>
                <td>${e.doctor_name||`Any`}</td>
                <td>${e.purpose}</td>
                <td>
                  <span class="status-badge" style="background:${e.status===`Approved`?`#d1fae5`:e.status===`Rescheduled`?`#e0e7ff`:`#fef3c7`}; color:${e.status===`Approved`?`#065f46`:e.status===`Rescheduled`?`#3730a3`:`#92400e`};">${e.status}</span>
                  ${e.payment_status===`Unpaid`?`<br><span style="display:inline-block; margin-top:4px; padding:2px 6px; background:#fee2e2; color:#b91c1c; border-radius:4px; font-size:0.75rem; font-weight:bold;">NLE 300 Due</span>`:``}
                </td>
                <td>
                  <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
                    ${e.status===`Pending`?`
                      <button class="btn btn-sm" style="background:#10b981;" onclick="updateAppointmentStatus('${e.id}', 'Approved')">Approve</button>
                      <button class="btn btn-sm" style="background:#ef4444;" onclick="updateAppointmentStatus('${e.id}', 'Rejected')">Reject</button>
                    `:``}
                    ${e.status===`Approved`||e.status===`Rescheduled`?`
                      <button class="btn btn-sm btn-secondary" onclick="printBookingReceipt('${e.patient_id}', '${e.date}', ${i})">Receipt</button>
                      <button class="btn btn-sm" style="background:#f59e0b;" onclick="updateAppointmentStatus('${e.id}', 'Cancelled')">Cancel</button>
                    `:``}
                    <button class="btn btn-sm" style="background:#3b82f6;" onclick="openRescheduleModal('${e.id}', '${e.date}', '${e.time}')">Reschedule</button>
                    ${e.status===`Approved`?`<button class="btn btn-sm btn-outline" style="border: 1px solid #3b82f6; color: #3b82f6;" onclick="sendReminder('${e.id}')">Reminder</button>`:``}
                  </div>
                </td>
              </tr>`).join(``)}
              ${n.length===0?`<tr><td colspan="6" style="text-align:center; padding:2rem;">No upcoming appointments</td></tr>`:``}
            </tbody>
          </table>
        </div>
      </div>
    `,window.receptionAutoRefresh||(window.receptionAutoRefresh=setInterval(async()=>{if(window.receptionTab===`appointments`){let e=r.length;r=await c(`/appointments`),r.length!==e&&(_(document.getElementById(`mainContent`)),toast(`New booking arrived!`))}},1e4)))}window.verifyPayment=async function(e){if(confirm(`Has the Orange Money payment been verified for this booking?`))try{toast(`Verifying payment and generating receipt email...`),await c(`/appointments/${e}/verify_payment`,{method:`PATCH`}),toast(`Payment verified and email sent!`),r=await c(`/appointments`),_(document.getElementById(`mainContent`))}catch(e){toast(e.message)}},window.setReceptionTab=function(e){window.receptionTab=e,_(document.getElementById(`mainContent`))},window.sendReminder=async function(t){if(confirm(`Send a reminder email to this patient?`))try{toast(`Sending reminder...`);let n=await fetch(`${e}/appointments/${t}/remind`,{method:`POST`,headers:{Authorization:`Bearer `+localStorage.getItem(`token`)}});if(!n.ok)throw Error((await n.json()).error);toast(`Reminder email sent successfully!`)}catch(e){toast(e.message||`Failed to send reminder`)}},window.openBookAppointmentModal=function(){let e=n.map(e=>`<option value="${e.id}">[${e.id}] ${e.name} (${e.phone})</option>`).join(``),t=s.consultation_fee||15e4;showModal(`
    <div class="modal">
      <div class="modal-header"><h3>Book Appointment</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
      <div class="modal-body">
        <form id="bookAppForm">
          <div class="form-group">
            <label>Select Patient</label>
            <select id="baPat" required>
              <option value="">-- Select Patient --</option>
              ${e}
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
            <span style="font-size:1.5rem; color:var(--primary); font-weight:700;">Le ${parseInt(t).toLocaleString()}</span>
          </div>
          <button type="submit" class="btn btn-block">Confirm Payment & Book</button>
        </form>
      </div>
    </div>
  `),document.getElementById(`bookAppForm`).addEventListener(`submit`,async e=>{e.preventDefault();let t=e.target.querySelector(`button`);t.disabled=!0,t.innerText=`Booking...`;try{let e=s.consultation_fee||15e4,t=document.getElementById(`baPat`).value,i=document.getElementById(`baDate`).value,a=``,o=n.find(e=>e.id==t);o&&o.email&&(toast(`Generating official receipt PDF...`),a=buildBookingReceiptHTML(t,i,e)),await c(`/appointments`,{method:`POST`,body:JSON.stringify({patient_id:t,doctor_id:null,purpose:document.getElementById(`baPurpose`).value,date:i,time:document.getElementById(`baTime`).value,booking_fee:e,htmlString:a})}),toast(`Appointment booked! Receipt emailed securely to patient.`),r=await c(`/appointments`),closeModal(),_(document.getElementById(`mainContent`)),printBookingReceipt(document.getElementById(`baPat`).value,document.getElementById(`baDate`).value,e)}catch(e){toast(e.message),t.disabled=!1,t.innerText=`Confirm Payment & Book`}})},window.generatePdfBase64=function(e){return new Promise((t,n)=>{let r=document.createElement(`div`);r.innerHTML=e,r.style.position=`absolute`,r.style.left=`-9999px`,r.style.top=`-9999px`,document.body.appendChild(r),html2pdf().from(r).set({margin:.5,filename:`document.pdf`,image:{type:`jpeg`,quality:.98},html2canvas:{scale:2,useCORS:!0},jsPDF:{unit:`in`,format:`letter`,orientation:`portrait`}}).outputPdf(`datauristring`).then(e=>{document.body.removeChild(r);let n=e.split(`base64,`)[1];t(n)}).catch(e=>{document.body.removeChild(r),n(e)})})},window.buildPrescriptionHTML=function(e){let t=e[0].patient_name,n=e[0].doctor_name,r=s.clinic_name||`Radiance Dermatology & Aesthetic Clinic`,i=s.clinic_address||`123 Health Ave, Freetown`,a=s.clinic_contact||`+232 77 123 456`,o=s.clinic_email||`contact@dcmsclinic.com`,c=s.clinic_logo?`<img src="${s.clinic_logo}" style="max-width:250px; max-height:70px; object-fit:contain; margin-bottom:1rem;">`:``,l=e.map(e=>`
    <div style="margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid #e2e8f0;">
      <div style="font-size:1.1rem; font-weight:bold;">${e.drug_name}</div>
      <div style="font-size:0.9rem; margin-top:0.3rem;">
        <strong>Dose/Freq:</strong> ${e.frequency} &nbsp;|&nbsp; <strong>Route:</strong> ${e.route} &nbsp;|&nbsp; <strong>Duration:</strong> ${e.duration}
      </div>
      <div style="font-size:0.9rem; margin-top:0.3rem;"><strong>Instructions:</strong> ${e.instructions||`None`}</div>
    </div>
  `).join(``);return`
    <html><head><title>Prescription</title>
    <style>body{font-family:sans-serif; padding:2rem; max-width:700px; margin:auto;} .header{text-align:center; border-bottom:2px solid #000; padding-bottom:1rem; margin-bottom:2rem;} </style>
    </head><body>
      <div class="header">
        ${c}
        <h2>${r.toUpperCase()}</h2>
        <p>${i} | ${a} | ${o}</p>
        <h3 style="margin-top:1.5rem;">PRESCRIPTION</h3>
      </div>
      <div style="margin-bottom:2rem;">
        <p><strong>Patient Name:</strong> ${t}</p>
        <p><strong>Prescribing Doctor:</strong> ${n}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <div>
        <h4>Medications</h4>
        ${l}
      </div>
      <div style="margin-top:4rem; border-top:1px solid #000; padding-top:1rem; display:inline-block; min-width:200px;">
        <p style="margin:0; text-align:center;">Doctor's Signature</p>
      </div>
    </body></html>
  `},window.buildBookingReceiptHTML=function(e,t,r){let i=n.find(t=>t.id==e),a=s.clinic_name||`Radiance Dermatology & Aesthetic Clinic`,o=s.clinic_address||`123 Health Ave, Freetown`,c=s.clinic_contact||`+232 77 123 456`,l=s.clinic_email||`contact@dcmsclinic.com`;return`
    <html>
      <head>
        <title>Appointment Receipt</title>
        <style>body { font-family: 'Outfit', sans-serif; padding: 2rem; color: #1e293b; max-width:600px; margin:auto; }</style>
      </head>
      <body>
        <div style="text-align:center; margin-bottom:2rem; border-bottom: 2px solid #e2e8f0; padding-bottom:1rem;">
          ${s.clinic_logo?`<img src="${s.clinic_logo}" style="max-width:200px; max-height:60px; object-fit:contain;">`:`<h2 style="margin:0; color:#1e3a8a;">${a}</h2>`}
          <p style="color:#64748b; font-size:14px; margin-top:10px;">${o}<br>${c}<br>${l}</p>
        </div>
        <h2 style="text-align:center;">BOOKING RECEIPT</h2>
        <div style="margin-top:2rem;">
          <p><strong>Patient:</strong> ${i?i.name:e}</p>
          <p><strong>Date of Booking:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Appointment Date:</strong> ${t}</p>
          <hr style="border:none; border-top:1px dashed #cbd5e1; margin:1.5rem 0;">
          <div style="display:flex; justify-content:space-between; font-size:1.2rem; font-weight:bold;">
            <span>Total Consultation Fee:</span>
            <span>Le ${Number(r).toLocaleString()}</span>
          </div>
          <hr style="border:none; border-top:1px dashed #cbd5e1; margin:1.5rem 0;">
          <p style="text-align:center; color:#64748b; font-size:12px; margin-top:3rem;">Thank you for choosing ${a}.</p>
        </div>
      </body>
    </html>
  `},window.emailPrescription=async function(e){try{let t=(await c(`/pharmacy/prescriptions`)).filter(t=>t.consultation_id==e);if(t.length===0){toast(`No medications prescribed in this consultation to email.`);return}let r=t[0].patient_id,i=n.find(e=>String(e.id)===String(r));if(!i||!i.email){toast(`Patient does not have an email address on file.`);return}let a=t[0].patient_name,o=t[0].doctor_name,l=s.clinic_name||`Radiance Dermatology & Aesthetic Clinic`,u=s.clinic_address||`123 Health Ave, Freetown`,d=s.clinic_contact||`+232 77 123 456`,f=s.clinic_email||`contact@dcmsclinic.com`,p=s.clinic_logo?`<img src="${s.clinic_logo}" style="max-width:250px; max-height:70px; object-fit:contain; margin-bottom:1rem;">`:``,m=t.map(e=>`
        <div style="margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid #e2e8f0;">
          <div style="font-size:1.1rem; font-weight:bold;">${e.drug_name}</div>
          <div style="font-size:0.9rem; margin-top:0.3rem;">
            <strong>Dose/Freq:</strong> ${e.frequency} &nbsp;|&nbsp; <strong>Route:</strong> ${e.route} &nbsp;|&nbsp; <strong>Duration:</strong> ${e.duration}
          </div>
          <div style="font-size:0.9rem; margin-top:0.3rem;"><strong>Instructions:</strong> ${e.instructions||`None`}</div>
        </div>
      `).join(``),h=`
        <html><head><title>Prescription</title>
        <style>body{font-family:sans-serif; padding:2rem; max-width:700px; margin:auto;} .header{text-align:center; border-bottom:2px solid #000; padding-bottom:1rem; margin-bottom:2rem;} </style>
        </head><body>
          <div class="header">
            ${p}
            <h2>${l.toUpperCase()}</h2>
            <p>${u} | ${d} | ${f}</p>
            <h3 style="margin-top:1.5rem;">PRESCRIPTION</h3>
          </div>
          
          <div style="display:flex; justify-content:space-between; margin-bottom:2rem; border:1px solid #000; padding:1rem;">
            <div>
              <p style="margin:0 0 0.5rem 0;"><strong>Patient:</strong> ${a}</p>
              <p style="margin:0;"><strong>Date:</strong> ${new Date(t[0].created_at).toLocaleDateString()}</p>
            </div>
            <div style="text-align:right;">
              <p style="margin:0 0 0.5rem 0;"><strong>Prescriber:</strong> Dr. ${o}</p>
              <p style="margin:0;"><strong>Cons. ID:</strong> ${formatID(e,`CONS`)}</p>
            </div>
          </div>
          
          <div style="margin-bottom:2rem;">
            <h2 style="font-family:serif; font-size:2rem; margin-bottom:1rem;">Rx</h2>
            ${m}
          </div>
          
          <div style="margin-top:4rem; border-top:1px solid #000; padding-top:1rem; text-align:right;">
            <p style="margin:0;">Signature: _______________________</p>
          </div>
        </body></html>
      `;toast(`Generating and emailing Prescription PDF...`),await c(`/email/send-pdf`,{method:`POST`,body:JSON.stringify({to:i.email,subject:`Your Prescription - `+l,htmlBody:`<p>Please find your prescription attached.</p>`,htmlString:h,filename:`Prescription_${e}.pdf`})}),toast(`Prescription emailed successfully to `+i.email)}catch(e){toast(`Failed to email prescription: `+e.message)}},window.printConsultation=async function(e){try{toast(`Generating Consultation PDF...`);let t=(await c(`/consultations`)).find(t=>t.id==e);if(!t){toast(`Consultation not found.`);return}let n=s.clinic_name||`Radiance Dermatology Clinic`,r=s.clinic_logo?`<img src="${s.clinic_logo}" style="max-width:200px; max-height:60px; object-fit:contain; margin-bottom:1rem;">`:``,i=window.open(``,`_blank`);i.document.write(`
      <html><head><title>Consultation Record</title>
      <style>body{font-family:sans-serif; padding:2rem; max-width:800px; margin:auto; line-height:1.6;} .section{margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid #ccc;}</style>
      </head><body>
        <div style="text-align:center; border-bottom:2px solid #000; padding-bottom:1rem; margin-bottom:2rem;">
          ${r}
          <h2>${n.toUpperCase()} - CONSULTATION RECORD</h2>
        </div>
        
        <div style="display:flex; justify-content:space-between; margin-bottom:2rem; border:1px solid #000; padding:1rem; background:#f9fafb;">
          <div>
            <p style="margin:0 0 0.5rem 0;"><strong>Patient:</strong> ${t.patient_name}</p>
            <p style="margin:0;"><strong>Date:</strong> ${new Date(t.created_at).toLocaleDateString()}</p>
          </div>
          <div style="text-align:right;">
            <p style="margin:0 0 0.5rem 0;"><strong>Doctor:</strong> Dr. ${t.doctor_name}</p>
            <p style="margin:0;"><strong>Cons ID:</strong> #${e}</p>
          </div>
        </div>
        
        <div class="section">
          <h3>History & Complaint</h3>
          <p><strong>Primary Complaint:</strong> ${t.history_primary||`N/A`}</p>
          <p><strong>Detailed History:</strong> ${t.history_details||`N/A`}</p>
        </div>
        
        <div class="section">
          <h3>Examination & Findings</h3>
          <p><strong>Clinical Notes:</strong> ${t.exam_notes||`N/A`}</p>
        </div>
        
        <div class="section">
          <h3>Diagnosis & Plan</h3>
          <p><strong>Working Diagnosis:</strong> ${t.working_diagnosis||`N/A`}</p>
          <p><strong>Differentials:</strong> ${t.differentials||`N/A`}</p>
          <p><strong>Treatment Plan:</strong> ${t.treatment_plan||`N/A`}</p>
        </div>
        
        <div style="margin-top:4rem; text-align:right;">
          <p>______________________________________</p>
          <p>Dr. ${t.doctor_name} Signature</p>
        </div>
      </body></html>
    `),i.document.close(),i.focus(),setTimeout(()=>{i.print()},500)}catch(e){toast(e.message)}},window.printPrescription=async function(e){try{toast(`Generating Prescription...`);let t=(await c(`/pharmacy/prescriptions`)).filter(t=>t.consultation_id==e);if(t.length===0){toast(`No medications prescribed in this consultation.`);return}let n=t[0].patient_name,r=t[0].doctor_name,i=s.clinic_name||`Radiance Dermatology & Aesthetic Clinic`,a=s.clinic_address||`123 Health Ave, Freetown`,o=s.clinic_contact||`+232 77 123 456`,l=s.clinic_email||`contact@dcmsclinic.com`,u=s.clinic_logo?`<img src="${s.clinic_logo}" style="max-width:250px; max-height:70px; object-fit:contain; margin-bottom:1rem;">`:``,d=t.map(e=>`
      <div style="margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid #e2e8f0;">
        <div style="font-size:1.1rem; font-weight:bold;">${e.drug_name}</div>
        <div style="font-size:0.9rem; margin-top:0.3rem;">
          <strong>Dose/Freq:</strong> ${e.frequency} &nbsp;|&nbsp; <strong>Route:</strong> ${e.route} &nbsp;|&nbsp; <strong>Duration:</strong> ${e.duration}
        </div>
        <div style="font-size:0.9rem; margin-top:0.3rem;"><strong>Instructions:</strong> ${e.instructions||`None`}</div>
      </div>
    `).join(``),f=window.open(``,`_blank`);f.document.write(`
      <html><head><title>Prescription</title>
      <style>body{font-family:sans-serif; padding:2rem; max-width:700px; margin:auto;} .header{text-align:center; border-bottom:2px solid #000; padding-bottom:1rem; margin-bottom:2rem;} </style>
      </head><body>
        <div class="header">
          ${u}
          <h2>${i.toUpperCase()}</h2>
          <p>${a} | ${o} | ${l}</p>
          <h3 style="margin-top:1.5rem;">PRESCRIPTION</h3>
        </div>
        
        <div style="display:flex; justify-content:space-between; margin-bottom:2rem; border:1px solid #000; padding:1rem;">
          <div>
            <p style="margin:0 0 0.5rem 0;"><strong>Patient:</strong> ${n}</p>
            <p style="margin:0;"><strong>Date:</strong> ${new Date(t[0].created_at).toLocaleDateString()}</p>
          </div>
          <div style="text-align:right;">
            <p style="margin:0 0 0.5rem 0;"><strong>Prescriber:</strong> Dr. ${r}</p>
            <p style="margin:0;"><strong>Cons. ID:</strong> ${formatID(e,`CONS`)}</p>
          </div>
        </div>
        
        <div style="margin-bottom:2rem;">
          <h2 style="font-family:serif; font-size:2rem; margin-bottom:1rem;">Rx</h2>
          ${d}
        </div>
        
        <div style="margin-top:4rem; border-top:1px dashed #000; padding-top:1rem; display:flex; justify-content:space-between;">
          <div style="width:200px; border-top:1px solid #000; text-align:center; padding-top:0.5rem; margin-top:2rem;">Doctor's Signature</div>
          <div style="font-size:0.8rem; color:#666; max-width:250px;">This prescription is valid only for the patient named above. Please consult the pharmacy for dispensing.</div>
        </div>
      </body></html>
    `),f.document.close(),setTimeout(()=>f.print(),500)}catch(e){toast(`Error loading prescription: `+e.message)}},window.printBookingReceipt=function(e,t,r){let i=n.find(t=>t.id==e),a=s.clinic_name||`Radiance Dermatology & Aesthetic Clinic`,o=s.clinic_address||`123 Health Ave, Freetown`,c=s.clinic_contact||`+232 77 123 456`,l=s.clinic_email||`contact@dcmsclinic.com`,u=s.clinic_logo?`<img src="${s.clinic_logo}" style="max-width:250px; max-height:70px; object-fit:contain; margin-bottom:1rem;">`:``,d=window.open(``,`_blank`);d.document.write(`
    <html><head><title>Booking Receipt</title>
    <style>body{font-family:sans-serif; padding:2rem; max-width:600px; margin:auto;} .header{text-align:center; border-bottom:2px solid #000; padding-bottom:1rem; margin-bottom:2rem;} </style>
    </head><body>
      <div class="header">
        ${u}
        <h2>${a.toUpperCase()}</h2>
        <p>${o} | ${c} | ${l}</p>
        <h3>BOOKING RECEIPT</h3>
      </div>
      <p><strong>Date:</strong> ${t}</p>
      <p><strong>Patient:</strong> ${i?i.name:`Unknown`}</p>
      <p><strong>Purpose:</strong> Consultation Booking / Registration</p>
      <h2 style="text-align:right">Amount Paid: Le ${parseInt(r).toLocaleString()}</h2>
      <p style="text-align:center; margin-top:3rem; font-size:12px;">Thank you. Please wait for the doctor.</p>
    </body></html>
  `),d.document.close(),setTimeout(()=>d.print(),500)},window.printClinicalRecordCard=async function(e){try{toast(`Generating Patient Record Card...`);let[t,n,r]=await Promise.all([c(`/consultations`),c(`/pharmacy/prescriptions`),c(`/patients`)]),i=t.find(t=>t.id==e);if(!i){toast(`Clinical record not found.`);return}let a=r.find(e=>e.id==i.patient_id),o=n.filter(t=>t.consultation_id==e),l=s.clinic_name||`Radiance Dermatology & Aesthetic Clinic`,u=s.clinic_address||`59 Big Waterloo Street, Freetown, Sierra Leone`,d=s.clinic_contact||`+232 77 123 456`,f=s.clinic_email||`contact@dcmsclinic.com`,p=s.clinic_logo?`<img src="${s.clinic_logo}" style="max-height:50px; object-fit:contain;">`:``,m=(e,t)=>{try{let n=JSON.parse(e);return n&&n[t]?`☒`:`☐`}catch{return`☐`}},h=e=>{try{let t=JSON.parse(e);return t&&t.other?t.other:t&&t.others?t.others:``}catch{return``}},g=e=>{try{let t=JSON.parse(e);return t&&t.details?t.details:``}catch{return``}},_=``,v=``;try{JSON.parse(i.body_map_data_json||`[]`).forEach(e=>{let t=`<circle cx="${e.x}%" cy="${e.y}%" r="5" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />`;e.type===`anterior`?_+=t:v+=t})}catch{}let y=`
      <svg viewBox="0 0 200 300" style="width:180px; height:270px; background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:8px;">
        <circle cx="100" cy="35" r="18" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
        <path d="M 75,60 C 65,60 55,75 50,90 C 45,105 40,130 45,140 C 48,145 53,142 55,135 L 68,95 C 68,120 70,160 72,190 L 60,280 C 58,290 73,290 75,280 L 88,195 L 100,195 L 112,195 L 125,280 C 127,290 142,290 140,280 L 128,190 C 130,160 132,120 132,95 L 145,135 C 147,142 152,145 155,140 C 160,130 155,105 150,90 C 145,75 135,60 125,60 Z" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
        ${_}
      </svg>
    `,b=`
      <svg viewBox="0 0 200 300" style="width:180px; height:270px; background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:8px;">
        <circle cx="100" cy="35" r="18" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
        <path d="M 75,60 C 65,60 55,75 50,90 C 45,105 40,130 45,140 C 48,145 53,142 55,135 L 68,95 C 68,120 70,160 72,190 L 60,280 C 58,290 73,290 75,280 L 88,195 L 100,195 L 112,195 L 125,280 C 127,290 142,290 140,280 L 128,190 C 130,160 132,120 132,95 L 145,135 C 147,142 152,145 155,140 C 160,130 155,105 150,90 C 145,75 135,60 125,60 Z" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
        <line x1="100" y1="60" x2="100" y2="190" stroke="#475569" stroke-dasharray="3,3" stroke-width="1.5"/>
        ${v}
      </svg>
    `,x=window.open(``,`_blank`);x.document.write(`
      <html>
      <head>
        <title>Patient Record Card - ${a?a.name:`Clinical Record`}</title>
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
              ${p}
              <h2 style="margin:0; color:#1e3a8a; font-size:18px;">${l}</h2>
              <p style="margin:2px 0 0 0; color:#475569; font-size:10px;">${u}<br>Tel: ${d} | Email: ${f}</p>
            </td>
            <td style="text-align:right; vertical-align:bottom; font-size:12px;">
              <strong>PATIENT RECORD CARD</strong><br><br>
              Record No: <span class="text-line" style="min-width:80px; text-align:center;">${i.patient_id}</span><br>
              Date: <span class="text-line" style="min-width:80px; text-align:center;">${new Date(i.created_at).toLocaleDateString()}</span>
            </td>
          </tr>
        </table>

        <!-- Demographics -->
        <div class="section-title">Patient Demographics</div>
        <table class="grid-table">
          <tr>
            <td colspan="2"><strong>Full Name:</strong> ${a?a.name:`Unknown`}</td>
            <td><strong>Sex:</strong> 
              <span class="check-item"><span class="checkbox">${i.gender===`Male`?`☒`:`☐`}</span> M</span>
              <span class="check-item"><span class="checkbox">${i.gender===`Female`?`☒`:`☐`}</span> F</span>
            </td>
          </tr>
          <tr>
            <td><strong>Date of Birth:</strong> ${a&&a.dob||`N/A`}</td>
            <td><strong>Age:</strong> ${a&&a.age||`N/A`}</td>
            <td><strong>Occupation:</strong> ${a&&a.occupation||`N/A`}</td>
          </tr>
          <tr>
            <td colspan="2"><strong>Address:</strong> ${a&&a.address||`N/A`}</td>
            <td><strong>Phone No:</strong> ${a&&a.phone||`N/A`}</td>
          </tr>
          <tr>
            <td><strong>Next of Kin / Contact:</strong> ${a&&a.nok||`N/A`}</td>
            <td><strong>NOK Phone:</strong> ${a&&a.nok_phone||`N/A`}</td>
            <td><strong>Referred By:</strong> ${i.referred_by||`None`}</td>
          </tr>
          <tr>
            <td colspan="3"><strong>Visit Type:</strong>
              <span class="check-item"><span class="checkbox">${i.visit_type===`New`?`☒`:`☐`}</span> New</span>
              <span class="check-item"><span class="checkbox">${i.visit_type===`Follow-up`?`☒`:`☐`}</span> Follow-up</span>
            </td>
          </tr>
        </table>

        <!-- Presenting Complaint & History -->
        <div class="section-title">Presenting Complaint & History</div>
        <table class="grid-table">
          <tr>
            <td colspan="2" style="height:50px; vertical-align:top;">
              <strong>Presenting Complaint:</strong><br>
              ${i.primary_complaint||`None`}
            </td>
          </tr>
          <tr>
            <td colspan="2" style="height:70px; vertical-align:top;">
              <strong>History of Presenting Complaint:</strong> <small style="color:#64748b;">(onset, duration, evolution, triggers, itch/pain, prior treatment)</small><br>
              ${i.history_of_presenting_complaint||`None`}
            </td>
          </tr>
          <tr>
            <td style="width:50%; vertical-align:top;">
              <strong>Past Medical / Dermatological History:</strong><br><br>
              <span class="check-item"><span class="checkbox">${m(i.past_history_json,`allergy`)}</span> Allergy (asthma / eczema / rhinitis)</span><br>
              <span class="check-item"><span class="checkbox">${m(i.past_history_json,`diabetes`)}</span> Diabetes</span><br>
              <span class="check-item"><span class="checkbox">${m(i.past_history_json,`hypertension`)}</span> Hypertension</span><br>
              <span class="check-item"><span class="checkbox">${m(i.past_history_json,`hiv`)}</span> HIV</span><br>
              <span class="check-item"><span class="checkbox">${m(i.past_history_json,`autoimmune`)}</span> Autoimmune disease</span><br>
              Other: <span class="text-line" style="min-width:180px;">${h(i.past_history_json)}</span>
            </td>
            <td style="width:50%; vertical-align:top;">
              <strong>Drug / Allergy History:</strong><br><br>
              <span class="check-item"><span class="checkbox">${m(i.drug_history_json,`known_allergy`)}</span> Known drug allergy</span><br>
              <span class="check-item"><span class="checkbox">${m(i.drug_history_json,`current_meds`)}</span> Current medications</span><br>
              <span class="check-item"><span class="checkbox">${m(i.drug_history_json,`family_history`)}</span> Family history of skin disease</span><br>
              Details: <span class="text-line" style="min-width:180px;">${g(i.drug_history_json)}</span>
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
                <div><span class="checkbox">${m(i.morphology_json,`macule`)}</span> Macule</div>
                <div><span class="checkbox">${m(i.morphology_json,`papule`)}</span> Papule</div>
                <div><span class="checkbox">${m(i.morphology_json,`plaque`)}</span> Plaque</div>
                <div><span class="checkbox">${m(i.morphology_json,`nodule`)}</span> Nodule</div>
                <div><span class="checkbox">${m(i.morphology_json,`vesicle`)}</span> Vesicle</div>
                <div><span class="checkbox">${m(i.morphology_json,`bulla`)}</span> Bulla</div>
                <div><span class="checkbox">${m(i.morphology_json,`pustule`)}</span> Pustule</div>
                <div><span class="checkbox">${m(i.morphology_json,`wheal`)}</span> Wheal</div>
                <div><span class="checkbox">${m(i.morphology_json,`scale`)}</span> Scale</div>
                <div><span class="checkbox">${m(i.morphology_json,`ulcer`)}</span> Ulcer</div>
                <div><span class="checkbox">${m(i.morphology_json,`crust`)}</span> Crust</div>
                <div><span class="checkbox">${m(i.morphology_json,`atrophy`)}</span> Atrophy</div>
              </div>
              <div style="margin-top:10px;">Other: <span class="text-line" style="min-width:180px;">${h(i.morphology_json)}</span></div>
            </td>
            <td style="width:50%; vertical-align:top;">
              <strong>Distribution / Pattern:</strong><br><br>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                <div><span class="checkbox">${m(i.distribution_json,`localised`)}</span> Localised</div>
                <div><span class="checkbox">${m(i.distribution_json,`generalised`)}</span> Generalised</div>
                <div><span class="checkbox">${m(i.distribution_json,`symmetrical`)}</span> Symmetrical</div>
                <div><span class="checkbox">${m(i.distribution_json,`asymmetrical`)}</span> Asymmetrical</div>
                <div><span class="checkbox">${m(i.distribution_json,`flexural`)}</span> Flexural</div>
                <div><span class="checkbox">${m(i.distribution_json,`extensor`)}</span> Extensor</div>
                <div><span class="checkbox">${m(i.distribution_json,`sun_exposed`)}</span> Sun-exposed</div>
                <div><span class="checkbox">${m(i.distribution_json,`mucosal`)}</span> Mucosal</div>
              </div>
              <div style="margin-top:10px;">Others: <span class="text-line" style="min-width:180px;">${h(i.distribution_json)}</span></div>
            </td>
          </tr>
          <tr>
            <td colspan="2"><strong>Site(s) Affected:</strong> ${i.site_affected||`None`}</td>
          </tr>
          <tr>
            <td colspan="2"><strong>Additional Findings:</strong> <small style="color:#64748b;">(hair, nails, mucosae, lymph nodes)</small><br>${i.additional_findings||`None`}</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align:center;">
              <div style="display:flex; justify-content:center; gap:2cm; padding:10px 0;">
                <div>
                  <div style="font-weight:bold; margin-bottom:5px;">Anterior (Front) Body Map</div>
                  ${y}
                </div>
                <div>
                  <div style="font-weight:bold; margin-bottom:5px;">Posterior (Back) Body Map</div>
                  ${b}
                </div>
              </div>
            </td>
          </tr>
        </table>

        <!-- Assessment -->
        <div class="section-title">Assessment</div>
        <table class="grid-table">
          <tr>
            <td><strong>Working Diagnosis:</strong> ${i.working_diagnosis||`None`}</td>
            <td><strong>Differential Diagnosis:</strong> ${i.differential_diagnosis||`None`}</td>
          </tr>
          <tr>
            <td colspan="2">
              <strong>Investigations Ordered:</strong> &nbsp;&nbsp;&nbsp;&nbsp;
              <span class="check-item"><span class="checkbox">${m(i.investigations_ordered_json,`scraping`)}</span> Skin scraping</span>
              <span class="check-item"><span class="checkbox">${m(i.investigations_ordered_json,`biopsy`)}</span> Biopsy</span>
              <span class="check-item"><span class="checkbox">${m(i.investigations_ordered_json,`bloods`)}</span> Bloods</span>
              <span class="check-item"><span class="checkbox">${m(i.investigations_ordered_json,`culture`)}</span> Culture</span>
              &nbsp;&nbsp; Other: <span class="text-line" style="min-width:100px;">${h(i.investigations_ordered_json)}</span>
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
            ${o.length?o.map(e=>`
              <tr>
                <td><strong>${e.drug_name}</strong></td>
                <td>${e.frequency}</td>
                <td>${e.route} - ${e.duration}<br><small>${e.instructions}</small></td>
              </tr>
            `).join(``):`<tr><td colspan="3" style="text-align:center; color:#64748b;">No medications prescribed.</td></tr>`}
          </tbody>
        </table>
        
        <table class="grid-table" style="margin-top:0.5rem;">
          <tr>
            <td colspan="2"><strong>Patient Education / Counseling Given:</strong><br>${i.patient_education||`None`}</td>
          </tr>
          <tr>
            <td style="width:50%;">
              <strong>Next Appointment:</strong><br>
              Date: <span class="text-line" style="min-width:100px;">${i.next_appointment_date||`N/A`}</span><br><br>
              Type: 
              <span class="check-item"><span class="checkbox">${i.next_appointment_type===`Routine`?`☒`:`☐`}</span> Routine</span>
              <span class="check-item"><span class="checkbox">${i.next_appointment_type===`Urgent review`?`☒`:`☐`}</span> Urgent review</span>
            </td>
            <td style="width:50%; vertical-align:bottom; text-align:center; height:60px;">
              <span class="text-line" style="min-width:180px; font-weight:bold;">Dr. ${i.doctor_name||`Clinician`}</span><br>
              Clinician Name & Signature
            </td>
          </tr>
        </table>
      </body>
      </html>
    `),x.document.close(),setTimeout(()=>x.print(),800)}catch(e){toast(e.message)}},window.openAddPatientModal=function(){showModal(`
    <div class="modal">
      <div class="modal-header"><h3>Add New Patient</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
      <div class="modal-body">
        <form id="addPatForm">
          <div class="form-group"><label>Name *</label><input id="apName" required></div>
          <div class="form-grid">
            <div class="form-group"><label>Phone</label><input id="apPhone"></div>
            <div class="form-group"><label>Email</label><input type="email" id="apEmail"></div>
            <div class="form-group"><label>Gender</label><select id="apGender"><option>Male</option><option>Female</option></select></div>
            <div class="form-group"><label>Age</label><input type="number" id="apAge" placeholder="e.g. 35" min="0" max="120"></div>
          </div>
          <div class="form-group"><label>Residential Address</label><textarea id="apAddr"></textarea></div>
          <button type="submit" class="btn btn-block">Save Patient</button>
        </form>
      </div>
    </div>
  `),document.getElementById(`addPatForm`).addEventListener(`submit`,async e=>{e.preventDefault();try{await c(`/patients`,{method:`POST`,body:JSON.stringify({name:document.getElementById(`apName`).value,phone:document.getElementById(`apPhone`).value,email:document.getElementById(`apEmail`).value,gender:document.getElementById(`apGender`).value,dob:null,age:document.getElementById(`apAge`).value,address:document.getElementById(`apAddr`).value})}),toast(`Patient added successfully`),n=await c(`/patients`),closeModal(),openBookAppointmentModal()}catch(e){toast(e.message)}})};var v=`queue`,y=null,b=null;function x(e){e.innerHTML=`
    <div class="page-header">
      <div><div class="page-title">Doctor Dashboard</div></div>
    </div>
    <div class="tab-container" style="flex-wrap:wrap;">
      <button class="btn ${v===`queue`?`btn-primary`:`btn-secondary`}" onclick="setDocTab('queue')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;">Appointment Queue</button>
      <button class="btn ${v===`consultation`?`btn-primary`:`btn-secondary`}" onclick="setDocTab('consultation')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;">Consultation Form</button>
      <button class="btn ${v===`history`?`btn-primary`:`btn-secondary`}" onclick="setDocTab('history')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;">Patient History</button>
      <button class="btn ${v===`timeline`?`btn-primary`:`btn-secondary`}" onclick="setDocTab('timeline')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;"><i class="fas fa-stream"></i> Full Timeline</button>
      <button class="btn ${v===`analysis`?`btn-primary`:`btn-secondary`}" onclick="setDocTab('analysis')" style="border-radius:8px 8px 0 0; padding:0.5rem 1.5rem;">Clinic Analysis</button>
    </div>
    <div id="docTabContent"></div>
  `;let t=document.getElementById(`docTabContent`);v===`queue`?S(t):v===`consultation`?w(t):v===`history`?C(t):v===`timeline`?A(t):v===`analysis`&&m(t)}window.setDocTab=function(e){v=e,x(document.getElementById(`mainContent`))};function S(e){e.innerHTML=`
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
  `;let t=r.filter(e=>e.status===`Approved`||e.status===`Scheduled`||e.status===`Rescheduled`||e.status===`Awaiting Lab Results`||e.status===`Lab Results Received`);document.getElementById(`docAppTb`).innerHTML=t.slice(0,50).map(e=>`
    <tr>
      <td>${e.date} <br><small style="color:#64748b;">${e.time}</small></td>
      <td><strong>${e.patient_name}</strong></td>
      <td>${e.purpose}</td>
      <td>
        <span class="badge" style="background:${e.status===`Lab Results Received`?`#10b981`:e.status===`Awaiting Lab Results`?`#3b82f6`:`#64748b`}; color:white; font-size:11px; padding:3px 8px; border-radius:4px;">
          ${e.status}
        </span>
      </td>
      <td>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          ${e.status!==`Approved`&&e.status!==`Awaiting Lab Results`&&e.status!==`Lab Results Received`?`<button class="btn btn-sm" style="background:#16a34a; color:white; border:none;" onclick="approveApp(this, '${e.id}')">Approve</button>`:``}
          <button class="btn btn-sm" style="background:#eab308; color:white; border:none;" onclick="rescheduleApp('${e.id}')">Reschedule</button>
          <button class="btn btn-sm btn-primary" onclick="startConsultation('${e.id}', '${e.patient_id}')">
            ${e.status===`Awaiting Lab Results`||e.status===`Lab Results Received`?`Resume Consultation`:`Start Consultation`}
          </button>
        </div>
      </td>
    </tr>
  `).join(``),t.length===0&&(document.getElementById(`docAppTb`).innerHTML=`<tr><td colspan="5" style="text-align:center; padding:2rem;">No pending appointments</td></tr>`)}function C(e){e.innerHTML=`
    <div class="card">
      <h3>Recent Patient Consultations</h3>
      <div class="table-wrap" style="margin-top:1rem;">
        <table>
          <thead><tr><th>Date</th><th>Patient</th><th>Diagnosis</th><th>Actions</th></tr></thead>
          <tbody id="docConsTb"><tr><td colspan="4">Loading...</td></tr></tbody>
        </table>
      </div>
    </div>
  `,c(`/consultations`).then(e=>{document.getElementById(`docConsTb`).innerHTML=e.map(e=>`
      <tr>
        <td>${e.date}</td>
        <td><strong>${e.patient_name}</strong></td>
        <td>${e.working_diagnosis||`Pending`}</td>
        <td>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-sm btn-secondary" onclick="viewHistory('${e.patient_id}')">View History</button>
            <button class="btn btn-sm btn-secondary" style="background:#0ea5e9; color:white; border:none;" onclick="printConsultation('${e.id}')">Print PDF</button>
            <button class="btn btn-sm btn-secondary" onclick="printPrescription('${e.id}')">Print Rx</button>
          </div>
        </td>
      </tr>
    `).join(``)})}window.docMedCount=1,window.addMedRow=function(){window.docMedCount++;let e=document.getElementById(`medBuilder`),t=a.map(e=>`<option value="${e.id}" data-name="${e.drug_name}" data-price="${e.price}">${e.drug_name}</option>`).join(``),n=`
    <div class="form-grid" style="margin-top:1rem; padding-top:1rem; border-top:1px solid #e2e8f0;" id="medrow_${window.docMedCount}">
      <div class="form-group"><label>Medication</label>
        <select class="med-sel"><option value="">Select...</option>${t}</select>
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
  `;e.insertAdjacentHTML(`beforeend`,n)};function w(e){if(!y||!b){e.innerHTML=`<div class="card" style="text-align:center; padding:3rem; color:#64748b;">Please start a consultation from the Appointment Queue.</div>`;return}let s=n.find(e=>e.id==b),c=r.find(e=>e.id===y)||{},l=a.map(e=>`<option value="${e.id}" data-name="${e.drug_name}" data-price="${e.price}">${e.drug_name}</option>`).join(``),u=i.map(e=>`<label class="checkbox-item"><input type="checkbox" name="c_lab" value="${e.id}" data-name="${e.test_name}" data-price="${e.price}"> ${e.test_name}</label>`).join(``),d=o.map(e=>`<label class="checkbox-item"><input type="checkbox" name="c_tx" value="${e.id}" data-name="${e.treatment_name}" data-price="${e.price}"> ${e.treatment_name}</label>`).join(``);window.docMedCount=1,window.bodyMapDots=[],e.innerHTML=`
    <!-- INLINE PATIENT HISTORY -->
    <div class="card" style="margin-bottom:1.5rem; background:#f0fdf4; border:1px solid #bbf7d0;">
      <div style="display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="toggleInlineHistory()">
        <h3 style="color:#166534; font-size:1.1rem; margin:0;"><i class="fas fa-history"></i> Past Clinical History</h3>
        <span id="inlineHistoryToggleBtn" style="color:#166534;"><i class="fas fa-chevron-down"></i></span>
      </div>
      <div id="inlineHistoryContent" style="display:none; margin-top:1rem; padding-top:1rem; border-top:1px solid #bbf7d0;">
        <div style="color:#166534; font-size:0.9rem;">Loading history...</div>
      </div>
    </div>

    <!-- SECTION 1: DEMOGRAPHIC INFO -->
    <div class="card" style="margin-bottom:1.5rem;">
      <h3 style="color:var(--primary); font-size:1.1rem; margin-bottom:1rem; text-transform:uppercase; letter-spacing:0.05em; border-bottom:2px solid var(--border-color); padding-bottom:0.5rem;"><i class="fas fa-id-card"></i> 1. Patient Demographics</h3>
      
      <div style="background:#f8fafc; padding:1.2rem; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:1.2rem; display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1.2rem; font-size:14px;">
        <div><strong>Patient Name:</strong> <span style="color:#334155;">${s.name}</span></div>
        <div><strong>Age / Date of Birth:</strong> <span style="color:#334155;">${s.age||`N/A`} yrs / ${s.dob||`N/A`}</span></div>
        <div><strong>Gender:</strong> <span style="color:#334155;">${s.gender||`Not specified`}</span></div>
        <div><strong>Phone No:</strong> <span style="color:#334155;">${s.phone||`N/A`}</span></div>
        <div style="grid-column: 1 / -1;"><strong>Residential Address:</strong> <span style="color:#334155;">${s.address||`N/A`}</span></div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label>Sex (On Record Card)</label>
          <div style="display:flex; gap:1.5rem; padding:0.5rem 0;">
            <label class="checkbox-item"><input type="radio" name="cf_gender" value="Male" ${s.gender===`Male`?`checked`:``}> Male</label>
            <label class="checkbox-item"><input type="radio" name="cf_gender" value="Female" ${s.gender===`Female`?`checked`:``}> Female</label>
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
        <div class="form-group"><label>Next of Kin / Contact</label><input type="text" id="cf_nok" placeholder="NOK Name & relationship..." value="${s.nok||``}"></div>
        <div class="form-group"><label>NOK Phone No.</label><input type="text" id="cf_nok_phone" placeholder="NOK telephone..." value="${s.nok_phone||``}"></div>
      </div>
    </div>

    <!-- SECTION 2: PRESENTING COMPLAINT & HISTORY -->
    <div class="card" style="margin-bottom:1.5rem;">
      <h3 style="color:var(--primary); font-size:1.1rem; margin-bottom:1rem; text-transform:uppercase; letter-spacing:0.05em; border-bottom:2px solid var(--border-color); padding-bottom:0.5rem;"><i class="fas fa-history"></i> 2. Presenting Complaint & History</h3>
      
      <div class="form-group">
        <label>Presenting Complaint</label>
        <textarea id="cf_primary" rows="2" placeholder="Primary complaint described by the patient...">${c.purpose||``}</textarea>
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
      <div class="checklist-grid" style="background:#fdf2f8; padding:1rem; border-radius:8px; border:1px solid #fbcfe8;">${u}</div>
      <h4 style="margin-top:1rem; font-size:0.85rem; color:#64748b; font-weight:600;">Clinical Treatments (Ordered by Doctor, executed by Nurse)</h4>
      <div class="checklist-grid" style="background:#f5f3ff; padding:1rem; border-radius:8px; border:1px solid #ddd6fe;">${d}</div>
    </div>

    <!-- SECTION 5: TREATMENT PLAN (MEDS) -->
    <div class="card" style="margin-bottom:1.5rem;">
      <h3 style="color:var(--primary); font-size:1.1rem; margin-bottom:1rem; text-transform:uppercase; letter-spacing:0.05em; border-bottom:2px solid var(--border-color); padding-bottom:0.5rem;"><i class="fas fa-pills"></i> 5. Prescription & Treatment Plan</h3>
      
      <div id="medBuilder" style="background:#f8fafc; padding:1rem; border-radius:8px; border:1px solid #cbd5e1;">
        <div class="form-grid" id="medrow_1">
          <div class="form-group"><label>Medication / Treatment</label>
            <select class="med-sel"><option value="">Select...</option>${l}</select>
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
          <input type="text" id="cf_clinician" disabled value="Dr. ${t.name}" style="background:#f1f5f9; color:#475569; padding:0.6rem; font-size:14px; border:1px solid #cbd5e1; border-radius:6px; width:100%;">
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
  `,setTimeout(()=>{window.loadDraftConsultation(y)},100)}window.bodyMapDots=[],window.addBodyMapDot=function(e,t){let n=e.currentTarget.getBoundingClientRect(),r=(e.clientX-n.left)/n.width*100,i=(e.clientY-n.top)/n.height*100;window.bodyMapDots.push({x:r,y:i,type:t}),window.renderBodyMapDots()},window.renderBodyMapDots=function(){let e=document.getElementById(`anterior-dots`),t=document.getElementById(`posterior-dots`);!e||!t||(e.innerHTML=``,t.innerHTML=``,window.bodyMapDots.forEach((n,r)=>{let i=document.createElementNS(`http://www.w3.org/2000/svg`,`circle`);i.setAttribute(`cx`,`${n.x}%`),i.setAttribute(`cy`,`${n.y}%`),i.setAttribute(`r`,`6`),i.setAttribute(`fill`,`#ef4444`),i.setAttribute(`stroke`,`#ffffff`),i.setAttribute(`stroke-width`,`1.5`),i.setAttribute(`style`,`cursor: pointer;`),i.addEventListener(`click`,e=>{e.stopPropagation(),window.bodyMapDots.splice(r,1),window.renderBodyMapDots()}),n.type===`anterior`?e.appendChild(i):t.appendChild(i)}))},window.loadDraftConsultation=async function(e){try{let t=await c(`/consultations/draft/${e}`);if(t){if(toast(`Restored active consultation draft.`),t.visit_type){let e=document.querySelector(`input[name="cf_visit"][value="${t.visit_type}"]`);e&&(e.checked=!0)}if(t.referred_by&&(document.getElementById(`cf_ref`).value=t.referred_by),t.primary_complaint&&(document.getElementById(`cf_primary`).value=t.primary_complaint),t.history_of_presenting_complaint&&(document.getElementById(`cf_history`).value=t.history_of_presenting_complaint),t.past_history_json)try{let e=JSON.parse(t.past_history_json);document.getElementById(`ph_allergy`).checked=!!e.allergy,document.getElementById(`ph_diabetes`).checked=!!e.diabetes,document.getElementById(`ph_hypertension`).checked=!!e.hypertension,document.getElementById(`ph_hiv`).checked=!!e.hiv,document.getElementById(`ph_autoimmune`).checked=!!e.autoimmune,document.getElementById(`ph_other_val`).value=e.other||``}catch{}if(t.drug_history_json)try{let e=JSON.parse(t.drug_history_json);document.getElementById(`dh_allergy`).checked=!!e.known_allergy,document.getElementById(`dh_meds`).checked=!!e.current_meds,document.getElementById(`dh_family`).checked=!!e.family_history,document.getElementById(`dh_details`).value=e.details||``}catch{}if(t.morphology_json)try{let e=JSON.parse(t.morphology_json);document.getElementById(`m_macule`).checked=!!e.macule,document.getElementById(`m_papule`).checked=!!e.papule,document.getElementById(`m_plaque`).checked=!!e.plaque,document.getElementById(`m_nodule`).checked=!!e.nodule,document.getElementById(`m_vesicle`).checked=!!e.vesicle,document.getElementById(`m_bulla`).checked=!!e.bulla,document.getElementById(`m_pustule`).checked=!!e.pustule,document.getElementById(`m_wheal`).checked=!!e.wheal,document.getElementById(`m_scale`).checked=!!e.scale,document.getElementById(`m_ulcer`).checked=!!e.ulcer,document.getElementById(`m_crust`).checked=!!e.crust,document.getElementById(`m_atrophy`).checked=!!e.atrophy,document.getElementById(`m_other_val`).value=e.other||``}catch{}if(t.distribution_json)try{let e=JSON.parse(t.distribution_json);document.getElementById(`d_localised`).checked=!!e.localised,document.getElementById(`d_generalised`).checked=!!e.generalised,document.getElementById(`d_symmetrical`).checked=!!e.symmetrical,document.getElementById(`d_asymmetrical`).checked=!!e.asymmetrical,document.getElementById(`d_flexural`).checked=!!e.flexural,document.getElementById(`d_extensor`).checked=!!e.extensor,document.getElementById(`d_sun_exposed`).checked=!!e.sun_exposed,document.getElementById(`d_mucosal`).checked=!!e.mucosal,document.getElementById(`d_others_val`).value=e.others||``}catch{}if(t.site_affected&&(document.getElementById(`cf_site`).value=t.site_affected),t.additional_findings&&(document.getElementById(`cf_findings`).value=t.additional_findings),t.body_map_data_json)try{window.bodyMapDots=JSON.parse(t.body_map_data_json)||[],window.renderBodyMapDots()}catch{}if(t.working_diagnosis&&(document.getElementById(`cf_diag`).value=t.working_diagnosis),t.differential_diagnosis&&(document.getElementById(`cf_diff_diag`).value=t.differential_diagnosis),t.investigations_ordered_json)try{let e=JSON.parse(t.investigations_ordered_json);document.getElementById(`inv_scraping`).checked=!!e.scraping,document.getElementById(`inv_biopsy`).checked=!!e.biopsy,document.getElementById(`inv_bloods`).checked=!!e.bloods,document.getElementById(`inv_culture`).checked=!!e.culture,document.getElementById(`inv_other_val`).value=e.other||``}catch{}if(t.patient_education&&(document.getElementById(`cf_education`).value=t.patient_education),t.next_appointment_type){let e=document.querySelector(`input[name="cf_next_type"][value="${t.next_appointment_type}"]`);e&&(e.checked=!0)}t.next_appointment_date&&(document.getElementById(`cf_next_date`).value=t.next_appointment_date)}}catch(e){console.error(`Error loading draft:`,e)}},window.startConsultation=function(e,t){y=e,b=t,setDocTab(`consultation`)},window.toggleInlineHistory=function(){let e=document.getElementById(`inlineHistoryContent`),t=document.getElementById(`inlineHistoryToggleBtn`);e.style.display===`none`?(e.style.display=`block`,t.innerHTML=`<i class="fas fa-chevron-up"></i>`,window.loadInlineHistory(b)):(e.style.display=`none`,t.innerHTML=`<i class="fas fa-chevron-down"></i>`)},window.loadInlineHistory=async function(e){let t=document.getElementById(`inlineHistoryContent`);if(t.dataset.loaded!==`true`){t.innerHTML=`<div style="color:#166534; font-size:0.9rem;">Loading history...</div>`;try{let n=await c(`/patients/${e}/history`);if(n.consultations.length===0){t.innerHTML=`<div style="color:#475569; font-size:0.95rem; font-style:italic;">No past clinical history found for this patient.</div>`,t.dataset.loaded=`true`;return}let r=`
      <div style="background:#f1f5f9; padding:0.75rem; border-radius:8px; margin-bottom:1rem; display:flex; gap:1rem; font-size:0.9rem;">
        <div><strong>Consultations:</strong> ${n.consultations.length}</div>
        <div><strong>Labs:</strong> ${n.labs.length}</div>
        <div><strong>Prescriptions:</strong> ${n.prescriptions.length}</div>
      </div>
      <div style="overflow-y:auto; max-height:400px; padding-right:10px;">
    `;n.consultations.forEach(e=>{let t=n.prescriptions.filter(t=>t.consultation_id===e.id),i=n.labs.filter(t=>t.consultation_id===e.id),a=n.treatments.filter(t=>t.consultation_id===e.id);r+=`
        <div style="border-left:4px solid var(--primary); padding-left:1rem; margin-bottom:1.5rem; background:#fff; padding:1rem; border-radius:4px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:0.5rem; margin-bottom:0.5rem;">
            <strong>${e.date}</strong>
          </div>
          <h4 style="color:var(--primary); margin-bottom:0.5rem; font-size:1rem;">${e.working_diagnosis||`No Diagnosis Recorded`}</h4>
          <p style="font-size:13px; color:#555; margin-bottom:1rem;"><strong>Notes:</strong> ${e.doctor_notes||e.primary_complaint||`None`}</p>
          
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
            <div>
              <strong style="font-size:13px; color:#1e293b;">Medications:</strong>
              <ul style="font-size:13px; margin:5px 0 0 15px; color:#475569;">
                ${t.length?t.map(e=>`<li>${e.drug_name} - ${e.frequency} (${e.duration})</li>`).join(``):`<li>None</li>`}
              </ul>
            </div>
            <div>
              <strong style="font-size:13px; color:#1e293b;">Labs / Treatments:</strong>
              <ul style="font-size:13px; margin:5px 0 0 15px; color:#475569;">
                ${i.map(e=>`<li>Lab: ${e.test_name} - <em>${e.status}</em></li>`).join(``)}
                ${a.map(e=>`<li>Tx: ${e.treatment_name}</li>`).join(``)}
                ${!i.length&&!a.length?`<li>None</li>`:``}
              </ul>
            </div>
          </div>
        </div>
      `}),r+=`</div>`,t.innerHTML=r,t.dataset.loaded=`true`}catch(e){t.innerHTML=`<div style="color:red; font-size:0.9rem;">Error loading history: ${e.message}</div>`}}},window.submitFullConsultation=async function(e,n){let i=e.innerHTML;e.innerHTML=`<i class="fas fa-spinner fa-spin"></i> Saving...`,e.disabled=!0;let a=e=>{let t=document.querySelector(`input[name="${e}"]:checked`);return t?t.value:``},o=e=>Array.from(document.querySelectorAll(`input[name="${e}"]:checked`)),s=[];for(let e=1;e<=window.docMedCount;e++){let t=document.getElementById(`medrow_${e}`);if(!t)continue;let n=t.querySelector(`.med-sel`);if(!n||!n.value)continue;let r=n.options[n.selectedIndex];s.push({drug_name:r.dataset.name,price:r.dataset.price,frequency:t.querySelector(`.med-freq`).value,route:t.querySelector(`.med-route`).value,duration:t.querySelector(`.med-dur`).value,instructions:t.querySelector(`.med-inst`).value})}let l={appointment_id:y,patient_id:b,doctor_id:t.id,age_group:`Adult`,gender:a(`cf_gender`)||`Not disclosed`,residence_type:`Unknown`,primary_complaint:document.getElementById(`cf_primary`).value,working_diagnosis:document.getElementById(`cf_diag`).value,follow_up_needed:document.getElementById(`cf_next_date`).value?`Yes`:`No`,follow_up_interval:a(`cf_next_type`)||`As needed`,lab_orders:o(`c_lab`).map(e=>({test_name:e.dataset.name,price:e.dataset.price})),clinical_treatments:o(`c_tx`).map(e=>({treatment_name:e.dataset.name,price:e.dataset.price})),prescriptions:s,visit_type:a(`cf_visit`),referred_by:document.getElementById(`cf_ref`).value,history_of_presenting_complaint:document.getElementById(`cf_history`).value,past_history_json:JSON.stringify({allergy:document.getElementById(`ph_allergy`).checked,diabetes:document.getElementById(`ph_diabetes`).checked,hypertension:document.getElementById(`ph_hypertension`).checked,hiv:document.getElementById(`ph_hiv`).checked,autoimmune:document.getElementById(`ph_autoimmune`).checked,other:document.getElementById(`ph_other_val`).value}),drug_history_json:JSON.stringify({known_allergy:document.getElementById(`dh_allergy`).checked,current_meds:document.getElementById(`dh_meds`).checked,family_history:document.getElementById(`dh_family`).checked,details:document.getElementById(`dh_details`).value}),morphology_json:JSON.stringify({macule:document.getElementById(`m_macule`).checked,papule:document.getElementById(`m_papule`).checked,plaque:document.getElementById(`m_plaque`).checked,nodule:document.getElementById(`m_nodule`).checked,vesicle:document.getElementById(`m_vesicle`).checked,bulla:document.getElementById(`m_bulla`).checked,pustule:document.getElementById(`m_pustule`).checked,wheal:document.getElementById(`m_wheal`).checked,scale:document.getElementById(`m_scale`).checked,ulcer:document.getElementById(`m_ulcer`).checked,crust:document.getElementById(`m_crust`).checked,atrophy:document.getElementById(`m_atrophy`).checked,other:document.getElementById(`m_other_val`).value}),distribution_json:JSON.stringify({localised:document.getElementById(`d_localised`).checked,generalised:document.getElementById(`d_generalised`).checked,symmetrical:document.getElementById(`d_symmetrical`).checked,asymmetrical:document.getElementById(`d_asymmetrical`).checked,flexural:document.getElementById(`d_flexural`).checked,extensor:document.getElementById(`d_extensor`).checked,sun_exposed:document.getElementById(`d_sun_exposed`).checked,mucosal:document.getElementById(`d_mucosal`).checked,others:document.getElementById(`d_others_val`).value}),site_affected:document.getElementById(`cf_site`).value,additional_findings:document.getElementById(`cf_findings`).value,body_map_data_json:JSON.stringify(window.bodyMapDots||[]),differential_diagnosis:document.getElementById(`cf_diff_diag`).value,investigations_ordered_json:JSON.stringify({scraping:document.getElementById(`inv_scraping`).checked,biopsy:document.getElementById(`inv_biopsy`).checked,bloods:document.getElementById(`inv_bloods`).checked,culture:document.getElementById(`inv_culture`).checked,other:document.getElementById(`inv_other_val`).value}),patient_education:document.getElementById(`cf_education`).value,next_appointment_type:a(`cf_next_type`),next_appointment_date:document.getElementById(`cf_next_date`).value};try{if(n===`draft`)await c(`/consultations/lab_orders_draft`,{method:`POST`,body:JSON.stringify(l)}),toast(`Draft saved! Patient sent to laboratory queue.`);else{let e=await c(`/consultations`,{method:`POST`,body:JSON.stringify(l)});n===`print`?(toast(`Consultation saved. Generating Prescription...`),printPrescription(e.id)):n===`email`?toast(`Consultation saved. Prescription emailed to patient.`):toast(`Consultation saved. Orders dispatched.`)}y=null,b=null,r=await c(`/appointments`),setDocTab(`queue`)}catch(e){toast(e.message)}e.innerHTML=i,e.disabled=!1},window.viewHistory=async function(e){try{let t=await c(`/patients/${e}/history`);showModal(`
      <div class="modal modal-lg">
        <div class="modal-header"><h3>Patient Clinical History</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
        <div class="modal-body">
          <div style="background:#f1f5f9; padding:1rem; border-radius:8px; margin-bottom:1rem; display:flex; gap:1rem;">
            <div><strong>Consultations:</strong> ${t.consultations.length}</div>
            <div><strong>Labs Ordered:</strong> ${t.labs.length}</div>
            <div><strong>Prescriptions:</strong> ${t.prescriptions.length}</div>
          </div>
          <div style="overflow-y:auto; max-height:60vh; padding-right:10px;">
            ${t.consultations.length===0?`<p>No history found.</p>`:``}
            ${t.consultations.map(e=>{let n=t.prescriptions.filter(t=>t.consultation_id===e.id),r=t.labs.filter(t=>t.consultation_id===e.id),i=t.treatments.filter(t=>t.consultation_id===e.id);return`
                <div style="border-left:4px solid var(--primary); padding-left:1rem; margin-bottom:1.5rem; background:#fafaf9; padding:1rem; border-radius:4px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:0.5rem; margin-bottom:0.5rem;">
                    <strong>${e.date}</strong>
                    <div style="display:flex; gap:0.5rem;">
                      <button class="btn btn-sm btn-secondary" onclick="printPrescription('${e.id}')">Print Rx</button>
                      <button class="btn btn-sm btn-secondary" style="background:#1e3a8a; color:white; border:none;" onclick="printClinicalRecordCard('${e.id}')"><i class="fas fa-file-medical"></i> Print Record Card</button>
                    </div>
                  </div>
                  <h4 style="color:var(--primary); margin-bottom:0.5rem;">${e.working_diagnosis||`No Diagnosis Recorded`}</h4>
                  <p style="font-size:14px; color:#555; margin-bottom:1rem;"><strong>Notes:</strong> ${e.doctor_notes||e.primary_complaint||`None`}</p>
                  
                  <div class="history-grid">
                    <div>
                      <strong style="font-size:13px; color:#1e293b;">Medications:</strong>
                      <ul style="font-size:13px; margin:5px 0 0 15px; color:#475569;">
                        ${n.length?n.map(e=>`<li>${e.drug_name} - ${e.frequency} (${e.duration})<br><small>${e.instructions}</small></li>`).join(``):`<li>None</li>`}
                      </ul>
                    </div>
                    <div>
                      <strong style="font-size:13px; color:#1e293b;">Labs / Treatments:</strong>
                      <ul style="font-size:13px; margin:5px 0 0 15px; color:#475569;">
                        ${r.map(e=>`<li>Lab: ${e.test_name} - <em>${e.status}</em></li>`).join(``)}
                        ${i.map(e=>`<li>Tx: ${e.treatment_name}</li>`).join(``)}
                        ${!r.length&&!i.length?`<li>None</li>`:``}
                      </ul>
                    </div>
                  </div>
                </div>
              `}).join(``)}
          </div>
        </div>
      </div>
    `)}catch(e){toast(e.message)}},window.labPendingData=[];function T(e){e.innerHTML=`
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
  `,c(`/laboratory`).then(e=>{let t=e.filter(e=>e.status===`Completed`);document.getElementById(`labTotalTests`).innerText=t.length,document.getElementById(`labTotalRev`).innerText=t.reduce((e,t)=>e+(t.price||0),0).toLocaleString();let n=e.filter(e=>e.status===`Pending`);document.getElementById(`labTb`).innerHTML=n.map(e=>`
      <tr>
        <td>${e.patient_name}</td>
        <td>Dr. ${e.doctor_name}</td>
        <td>${e.test_name}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="openLabModal('${e.id}', '${e.patient_name}', '${e.test_name}', '${e.working_diagnosis}')">Enter Results</button>
        </td>
      </tr>
    `).join(``),n.length===0&&(document.getElementById(`labTb`).innerHTML=`<tr><td colspan="4" style="text-align:center;">No pending lab orders.</td></tr>`),document.getElementById(`labHistTb`).innerHTML=t.map(e=>`
      <tr>
        <td>${new Date(e.created_at).toLocaleDateString()}</td>
        <td>${e.patient_name}</td>
        <td>${e.test_name}</td>
        <td style="max-width:300px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${e.result||`No result text`}</td>
        <td><span style="background:#dcfce7; color:#166534; padding:4px 8px; border-radius:12px; font-size:0.8rem; font-weight:600;">Completed</span></td>
      </tr>
    `).join(``),t.length===0&&(document.getElementById(`labHistTb`).innerHTML=`<tr><td colspan="5" style="text-align:center;">No completed tests history.</td></tr>`)})}window.openLabPatient=function(e){let t=window.labPendingData.filter(t=>t.patient_id===e);t.length&&showModal(`
    <div class="modal modal-lg">
      <div class="modal-header"><h3>Process Lab Tests for ${t[0].patient_name}</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
      <div class="modal-body">
        <p style="margin-bottom:1rem; color:#64748b;">Mark the tests you are able to perform below and enter results.</p>
        <div style="max-height:60vh; overflow-y:auto; padding-right:1rem;">
          ${t.map(e=>`
            <div style="border:1px solid #e2e8f0; border-radius:8px; padding:1rem; margin-bottom:1rem; background:#f8fafc;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                <strong>${e.test_name}</strong>
                <select id="lstat_${e.id}" style="padding:4px; font-size:0.9rem;">
                  <option value="Pending">Skip (Leave Pending)</option>
                  <option value="Completed">Completed / Performed</option>
                  <option value="Not Performed">Cannot Perform</option>
                </select>
              </div>
              <textarea id="lres_${e.id}" placeholder="Enter test result / findings..." rows="2" style="width:100%; padding:0.5rem; border:1px solid #cbd5e1; border-radius:4px;"></textarea>
            </div>
          `).join(``)}
        </div>
        <button class="btn btn-primary btn-block" style="margin-top:1rem;" onclick="submitLabBatch(this, '${e}')">Save Records & Send to Billing</button>
      </div>
    </div>
  `)},window.submitLabBatch=async function(e,t){let n=window.labPendingData.filter(e=>e.patient_id===t),r=e.innerHTML;e.innerHTML=`<i class="fas fa-spinner fa-spin"></i> Processing...`,e.disabled=!0;try{for(let e of n){let t=document.getElementById(`lstat_${e.id}`).value,n=document.getElementById(`lres_${e.id}`).value;t!==`Pending`&&await c(`/laboratory/${e.id}`,{method:`PATCH`,body:JSON.stringify({status:t,result:n})})}toast(`Lab records updated successfully!`),closeModal(),T(document.getElementById(`mainContent`))}catch(e){toast(e.message)}e.innerHTML=r,e.disabled=!1},window.pharmPendingData=[];function E(e){e.innerHTML=`
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
  `,c(`/pharmacy/prescriptions`).then(e=>{let t=e.filter(e=>!e.is_paid);window.pharmPendingData=t;let n=[...new Set(t.map(e=>e.patient_id))];document.getElementById(`pharmTb`).innerHTML=n.map(e=>{let n=t.filter(t=>t.patient_id===e);return`
      <tr>
        <td>PAT-${e}</td>
        <td>${n[0].patient_name}</td>
        <td><span style="background:#fee2e2; padding:4px 8px; border-radius:12px; font-size:0.8rem; font-weight:600;">${n.length} items</span></td>
        <td><button class="btn btn-sm btn-secondary" onclick="openPharmPatient('${e}')">Process Payment & Dispense</button></td>
      </tr>
      `}).join(``),n.length===0&&(document.getElementById(`pharmTb`).innerHTML=`<tr><td colspan="4" style="text-align:center;">No pending prescriptions.</td></tr>`);let r=e.filter(e=>e.is_paid||e.status===`Dispensed`);document.getElementById(`pharmHistTb`).innerHTML=r.map(e=>`
      <tr>
        <td>${new Date(e.created_at).toLocaleDateString()}</td>
        <td>${e.patient_name}</td>
        <td>${e.drug_name}</td>
        <td>${(e.price||0).toLocaleString()}</td>
        <td><span style="background:#dcfce7; color:#166534; padding:4px 8px; border-radius:12px; font-size:0.8rem; font-weight:600;">Dispensed</span></td>
      </tr>
    `).join(``),r.length===0&&(document.getElementById(`pharmHistTb`).innerHTML=`<tr><td colspan="5" style="text-align:center;">No dispensing history found.</td></tr>`)}),c(`/admin/catalog/pharmacy_inventory`).then(e=>{document.getElementById(`invTb`).innerHTML=e.map(e=>{let t=e.stock<10?`#ef4444`:`#1e293b`,n=e.stock<10?`700`:`400`;return`
      <tr>
        <td>${e.drug_name}</td>
        <td style="text-align:right; color:${t}; font-weight:${n};">${e.stock===void 0?`--`:e.stock}</td>
      </tr>
    `}).join(``),e.length===0&&(document.getElementById(`invTb`).innerHTML=`<tr><td colspan="2" style="text-align:center;">Inventory is empty.</td></tr>`)}).catch(e=>{c(`/pharmacy_inventory`).then(e=>{document.getElementById(`invTb`).innerHTML=e.map(e=>{let t=e.stock<10?`#ef4444`:`#1e293b`,n=e.stock<10?`700`:`400`;return`
          <tr>
            <td>${e.drug_name}</td>
            <td style="text-align:right; color:${t}; font-weight:${n};">${e.stock===void 0?`--`:e.stock}</td>
          </tr>
        `}).join(``)})})}window.openPharmPatient=function(e){let t=window.pharmPendingData.filter(t=>t.patient_id===e);t.length&&showModal(`
    <div class="modal modal-lg">
      <div class="modal-header"><h3>Process Prescriptions for ${t[0].patient_name}</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
      <div class="modal-body">
        <p style="margin-bottom:1rem; color:#64748b;">Select the medications the patient is paying for to dispense them.</p>
        <div style="max-height:50vh; overflow-y:auto; padding-right:1rem;">
          <table style="width:100%; border-collapse:collapse; margin-bottom:1rem;">
            <thead><tr style="border-bottom:2px solid #e2e8f0;"><th style="text-align:left; padding:0.5rem;">Dispense</th><th style="text-align:left;">Drug</th><th style="text-align:right;">Price (Le)</th></tr></thead>
            <tbody>
              ${t.map(e=>`
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:0.5rem;"><input type="checkbox" id="prx_${e.id}" checked></td>
                  <td>${e.drug_name}<br><small style="color:#64748b;">${e.frequency}, ${e.duration}</small></td>
                  <td style="text-align:right;">${(e.price||0).toLocaleString()}</td>
                </tr>
              `).join(``)}
            </tbody>
          </table>
        </div>
        <button class="btn btn-primary btn-block" onclick="submitPharmBatch(this, '${e}')">Mark Paid, Dispense & Print Receipt</button>
      </div>
    </div>
  `)},window.submitPharmBatch=async function(e,t){let n=window.pharmPendingData.filter(e=>e.patient_id===t),r=e.innerHTML;e.innerHTML=`<i class="fas fa-spinner fa-spin"></i> Processing...`,e.disabled=!0;let i=[];try{for(let e of n)document.getElementById(`prx_${e.id}`).checked&&(await c(`/pharmacy/prescriptions/${e.id}`,{method:`PATCH`,body:JSON.stringify({status:`Dispensed`,is_paid:!0})}),i.push(e));toast(`Medications marked paid & dispensed.`),closeModal(),E(document.getElementById(`mainContent`)),i.length>0&&printPharmacyReceipt(i)}catch(e){toast(e.message)}e.innerHTML=r,e.disabled=!1},window.buildPharmacyReceiptHTML=function(e){if(!e.length)return``;let t=e[0].patient_name,n=e.reduce((e,t)=>e+(t.price||0),0),r=s.clinic_name||`Radiance Dermatology & Aesthetic Clinic`,i=s.clinic_address||`123 Health Ave, Freetown`,a=s.clinic_contact||`+232 77 123 456`,o=s.clinic_email||`contact@dcmsclinic.com`,c=s.clinic_logo?`<img src="${s.clinic_logo}" style="max-width:250px; max-height:70px; object-fit:contain; margin-bottom:1rem;">`:``,l=e.map(e=>`<tr><td style="padding:0.5rem; border-bottom:1px solid #e2e8f0;">${e.drug_name}</td><td style="padding:0.5rem; border-bottom:1px solid #e2e8f0;">Le ${Number(e.price||0).toLocaleString()}</td></tr>`).join(``);return`
    <html><head><title>Pharmacy Receipt</title>
    <style>body{font-family:sans-serif; padding:2rem; max-width:600px; margin:auto;} table{width:100%; border-collapse:collapse; margin-top:2rem;} th{text-align:left; padding:0.5rem; border-bottom:2px solid #000;}</style>
    </head><body>
      <div style="text-align:center; border-bottom:2px solid #000; padding-bottom:1rem;">
        ${c}
        <h2>${r.toUpperCase()}</h2>
        <p>${i} | ${a} | ${o}</p>
        <h3 style="margin-top:1rem;">PHARMACY RECEIPT</h3>
      </div>
      <p style="margin-top:2rem;"><strong>Patient Name:</strong> ${t}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <table>
        <thead><tr><th>Item</th><th>Price</th></tr></thead>
        <tbody>${l}</tbody>
      </table>
      <div style="margin-top:2rem; text-align:right; font-size:1.2rem;">
        <strong>Total Paid: Le ${Number(n).toLocaleString()}</strong>
      </div>
      <p style="margin-top:3rem; text-align:center; color:#666;">Thank you for your business!</p>
    </body></html>
  `},window.buildFinalReceiptHTML=function(e){let t=window.allBillsCache.find(t=>String(t.id)===String(e));if(!t)return``;let n=JSON.parse(t.items_json),r=s.clinic_name||`Radiance Dermatology & Aesthetic Clinic`,i=s.clinic_address||`123 Health Ave, Freetown`,a=s.clinic_contact||`+232 77 123 456`,o=s.clinic_email||`contact@dcmsclinic.com`,c=s.clinic_logo?`<img src="${s.clinic_logo}" style="max-width:250px; max-height:70px; object-fit:contain; margin-bottom:1rem;">`:``,l=n.map(e=>`<tr><td style="padding:0.5rem; border-bottom:1px solid #e2e8f0;">${e.name||e.desc||`Item`}</td><td style="padding:0.5rem; border-bottom:1px solid #e2e8f0;">Le ${Number(e.cost||e.price||0).toLocaleString(void 0,{minimumFractionDigits:2})}</td></tr>`).join(``);return`
    <html><head><title>Official Receipt</title>
    <style>body{font-family:sans-serif; padding:2rem; max-width:600px; margin:auto;} table{width:100%; border-collapse:collapse; margin-top:2rem;} th{text-align:left; padding:0.5rem; border-bottom:2px solid #000;}</style>
    </head><body>
      <div style="text-align:center; border-bottom:2px solid #000; padding-bottom:1rem;">
        ${c}
        <h2>${r.toUpperCase()}</h2>
        <p>${i} | ${a} | ${o}</p>
        <h3 style="margin-top:1rem;">OFFICIAL RECEIPT</h3>
      </div>
      <p style="margin-top:2rem;"><strong>Patient Name:</strong> ${t.patient_name}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Receipt #:</strong> ${formatID(t.id,`RCPT`)}</p>
      <table>
        <thead><tr><th>Description</th><th>Amount</th></tr></thead>
        <tbody>${l}</tbody>
      </table>
      <div style="margin-top:2rem; text-align:right; font-size:1.2rem;">
        <strong>Total Amount: Le ${Number(t.total_amount||0).toLocaleString(void 0,{minimumFractionDigits:2})}</strong>
      </div>
      <div style="margin-top:1rem; text-align:right; font-size:1.1rem; color:green;">
        <strong>Status: ${t.status}</strong>
      </div>
    </body></html>
  `},window.printPharmacyReceipt=function(e){if(!e.length)return;let t=e[0].patient_name,n=e.reduce((e,t)=>e+(t.price||0),0),r=s.clinic_name||`Radiance Dermatology & Aesthetic Clinic`,i=s.clinic_address||`123 Health Ave, Freetown`,a=s.clinic_contact||`+232 77 123 456`,o=s.clinic_email||`contact@dcmsclinic.com`,c=s.clinic_logo?`<img src="${s.clinic_logo}" style="max-width:250px; max-height:70px; object-fit:contain; margin-bottom:1rem;">`:``,l=window.open(``,`_blank`);l.document.write(`
    <html><head><title>Pharmacy Receipt</title>
    <style>body{font-family:sans-serif; padding:2rem; max-width:600px; margin:auto;} .header{text-align:center; border-bottom:2px solid #000; padding-bottom:1rem; margin-bottom:2rem;} table{width:100%; border-collapse:collapse; margin-bottom:2rem;} th,td{padding:0.5rem; text-align:left; border-bottom:1px solid #ccc;}</style>
    </head><body>
      <div class="header">
        ${c}
        <h2>${r.toUpperCase()}</h2>
        <p>${i} | ${a} | ${o}</p>
        <h3>PHARMACY RECEIPT</h3>
      </div>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Patient:</strong> ${t}</p>
      <table>
        <thead><tr><th>Item</th><th style="text-align:right;">Amount (Le)</th></tr></thead>
        <tbody>
          ${e.map(e=>`<tr><td>${e.drug_name}</td><td style="text-align:right;">${(e.price||0).toLocaleString()}</td></tr>`).join(``)}
        </tbody>
      </table>
      <h2 style="text-align:right">Total Paid: Le ${n.toLocaleString()}</h2>
      <p style="text-align:center; margin-top:3rem; font-size:12px;">Thank you for your business. (Email dispatched to patient)</p>
    </body></html>
  `),l.document.close(),setTimeout(()=>l.print(),500)};function D(e){e.innerHTML=`
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
  `,c(`/nursing/treatments`).then(e=>{document.getElementById(`nurseTxTb`).innerHTML=e.map(e=>`
      <tr>
        <td>${e.patient_name}</td><td>${e.doctor_name}</td><td>${e.treatment_name}</td>
        <td>${e.status}</td>
        <td><button class="btn btn-sm" onclick="administerTx('${e.id}')">Mark Administered</button></td>
      </tr>
    `).join(``),e.length===0&&(document.getElementById(`nurseTxTb`).innerHTML=`<tr><td colspan="5">No pending treatments</td></tr>`)})}window.administerTx=async function(e){try{await c(`/nursing/treatments/${e}`,{method:`PATCH`}),toast(`Treatment administered.`),D(document.getElementById(`mainContent`))}catch(e){toast(e.message)}};function O(e){e.innerHTML=`
    <div class="page-header">
      <div><div class="page-title">Billing & Final Checkout</div></div>
    </div>
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <h3 style="margin:0;">Invoices & Billing Queue</h3>
        <div style="display:flex; gap:1rem;">
          <input type="text" placeholder="Search bills..." style="padding:0.5rem; border-radius:8px; border:1px solid #cbd5e1; min-width:250px;" oninput="filterTable('billTb', this.value)">
          <button class="btn btn-outline" onclick="exportTableToCSV('billTb', 'billing_records.csv', this)">Export CSV</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Date</th><th>Patient</th><th>Amount (Le)</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="billTb"><tr><td colspan="6">Loading...</td></tr></tbody>
        </table>
      </div>
    </div>
  `,c(`/billing`).then(e=>{window.allBillsCache=e,document.getElementById(`billTb`).innerHTML=e.map(e=>`
      <tr>
        <td>RCPT-${e.id}</td>
        <td>${new Date(e.created_at).toLocaleDateString()}</td>
        <td>${e.patient_name}</td>
        <td>Le ${e.total_amount.toLocaleString()}</td>
        <td><span class="status-badge" style="background:${e.status===`Paid`?`#d1fae5`:`#fee2e2`}; color:${e.status===`Paid`?`#065f46`:`#991b1b`};">${e.status}</span></td>
        <td style="display: flex; gap: 8px; align-items: center; justify-content: flex-start; flex-wrap: wrap;">
            ${e.status===`Paid`?``:`
              <button onclick="markBillPaid('${e.id}')" title="Mark this invoice as Paid" style="background:#10b981; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.75rem; display:flex; align-items:center; gap:6px; transition:all 0.2s; box-shadow:0 2px 4px rgba(16,185,129,0.2);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(16,185,129,0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(16,185,129,0.2)';">
                <i class="fas fa-check-circle"></i> Mark Paid
              </button>
            `}
            
            <button onclick="printFinalReceipt('${e.id}')" title="Print Official Receipt" style="background:#f8fafc; color:#334155; border:1px solid #cbd5e1; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.75rem; display:flex; align-items:center; gap:6px; transition:all 0.2s; box-shadow:0 1px 2px rgba(0,0,0,0.05);" onmouseover="this.style.background='#f1f5f9'; this.style.color='#0f172a'; this.style.borderColor='#94a3b8'; this.style.transform='translateY(-1px)';" onmouseout="this.style.background='#f8fafc'; this.style.color='#334155'; this.style.borderColor='#cbd5e1'; this.style.transform='translateY(0)';">
              <i class="fas fa-print" style="color:#0ea5e9;"></i> Print
            </button>
            
            <button id="emailBtn_${e.id}" onclick="emailFinalReceipt(this, '${e.id}', '${e.patient_id}')" title="Email Receipt to Patient" style="background:#f8fafc; color:#334155; border:1px solid #cbd5e1; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.75rem; display:flex; align-items:center; gap:6px; transition:all 0.2s; box-shadow:0 1px 2px rgba(0,0,0,0.05);" onmouseover="if(!this.disabled){this.style.background='#f1f5f9'; this.style.color='#0f172a'; this.style.borderColor='#94a3b8'; this.style.transform='translateY(-1px)';}" onmouseout="if(!this.disabled){this.style.background='#f8fafc'; this.style.color='#334155'; this.style.borderColor='#cbd5e1'; this.style.transform='translateY(0)';}">
              <i class="fas fa-envelope" style="color:#8b5cf6;"></i> Email
            </button>
          </td>
      </tr>
    `).join(``)}).catch(e=>toast(e.message))}window.markBillPaid=async function(e){try{await c(`/billing/${e}/status`,{method:`PATCH`,body:JSON.stringify({status:`Paid`})}),toast(`Bill marked as Paid`),O(document.getElementById(`mainContent`))}catch(e){toast(e.message)}},window.emailFinalReceipt=async function(e,t,r){typeof e==`string`&&(r=t,t=e,e=document.getElementById(`emailBtn_${t}`)||{style:{}});try{(!n||n.length===0)&&(n=await c(`/patients`));let i=n.find(e=>e.id==r);if(!i||!i.email){toast(`Patient does not have an email address.`);return}e.disabled=!0;let a=e.innerHTML;e.innerHTML=`<i class="fas fa-spinner fa-spin" style="color:#0ea5e9;"></i> Sending...`,e.style.opacity=`0.7`,e.style.cursor=`not-allowed`,e.style.transform=`translateY(0)`,toast(`Generating Official Receipt PDF...`);let o=buildFinalReceiptHTML(t);if(!o){e.disabled=!1,e.innerHTML=a,e.style.opacity=`1`,e.style.cursor=`pointer`;return}await c(`/email/send-pdf`,{method:`POST`,body:JSON.stringify({to:i.email,subject:`Your Official Receipt - `+(window.sysSettings?.clinic_name||`Radiance Derms`),htmlBody:`<p>Thank you. Please find your official receipt attached.</p>`,htmlString:o,filename:`Receipt_${t}.pdf`})}),toast(`Official Receipt emailed successfully!`),e.innerHTML=`<i class="fas fa-check-double" style="color:#10b981;"></i> Sent`,e.style.color=`#10b981`,e.style.borderColor=`#10b981`,e.style.background=`#f0fdf4`,e.title=`Email has already been sent.`,e.style.opacity=`1`}catch(t){toast(t.message),e.disabled=!1,e.innerHTML=`<i class="fas fa-envelope" style="color:#8b5cf6;"></i> Email`,e.style.opacity=`1`,e.style.cursor=`pointer`}},window.printFinalReceipt=function(e){let t=window.allBillsCache.find(t=>t.id===e);if(!t)return;let n=JSON.parse(t.items_json),r=s.clinic_name||`Radiance Dermatology & Aesthetic Clinic`,i=s.clinic_address||`123 Health Ave, Freetown`,a=s.clinic_contact||`+232 77 123 456`,o=s.clinic_email||`contact@dcmsclinic.com`,c=s.clinic_logo?`<img src="${s.clinic_logo}" style="max-width:250px; max-height:70px; object-fit:contain; margin-bottom:1rem;">`:``,l=window.open(``,`_blank`);l.document.write(`
    <html><head><title>Final Receipt - RCPT-${t.id}</title>
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
        ${c}
        <h2>${r.toUpperCase()}</h2>
        <p>${i}<br>Contact: ${a} | Email: ${o}</p>
        <h3>OFFICIAL RECEIPT</h3>
      </div>
      <div class="meta">
        <div><strong>Patient:</strong> ${t.patient_name}<br><strong>Receipt #:</strong> ${formatID(t.id,`RCPT`)}</div>
        <div><strong>Date:</strong> ${new Date(t.created_at).toLocaleDateString()}<br><strong>Status:</strong> ${t.status}</div>
      </div>
      <table>
        <thead><tr><th>Type</th><th>Item Description</th><th style="text-align:right">Cost (Le)</th></tr></thead>
        <tbody>
          ${n.map(e=>`<tr><td>${e.type}</td><td>${e.name}</td><td style="text-align:right">${e.cost.toLocaleString()}</td></tr>`).join(``)}
          <tr class="total-row"><td colspan="2">TOTAL DUE</td><td style="text-align:right">Le ${t.total_amount.toLocaleString()}</td></tr>
        </tbody>
      </table>
      <div class="footer">Thank you for trusting Dermatology Clinic with your care.</div>
    </body></html>
  `),l.document.close(),setTimeout(()=>l.print(),500)},`serviceWorker`in navigator&&navigator.serviceWorker.getRegistrations().then(function(e){for(let t of e)t.unregister()});function k(e){e.innerHTML=`
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
          <option value="audit_logs">Audit Logs (System Activity)</option>
        </select>
        <button class="btn btn-primary" onclick="loadAdminDataTable()">Load Data</button>
        <button class="btn btn-outline" onclick="exportTableToCSV('sysDataBody', 'system_data.csv', this)">Export CSV</button>
        <input type="text" placeholder="Search records..." style="padding:0.5rem; border-radius:8px; border:1px solid #cbd5e1; min-width:250px; margin-left:auto;" oninput="filterTable('sysDataBody', this.value)">
      </div>

      <div class="table-wrap" style="max-height:600px; overflow-y:auto; overflow-x:auto;">
        <table id="sysDataTable" style="min-width: 1000px;">
          <thead id="sysDataHead"><tr><th>Select a table and click Load Data</th></tr></thead>
          <tbody id="sysDataBody"></tbody>
        </table>
      </div>
    </div>
  `}window.loadAdminDataTable=async function(){let e=document.getElementById(`sysDataTableSelect`).value,t=document.getElementById(`sysDataBody`),n=document.getElementById(`sysDataHead`);t.innerHTML=`<tr><td colspan="100%">Loading...</td></tr>`;try{let r=await c(`/admin/db/${e}`);if(r.length===0){n.innerHTML=`<tr><th>No data found</th></tr>`,t.innerHTML=``;return}let i=Object.keys(r[0]);n.innerHTML=`<tr>`+i.map(e=>`<th>${e}</th>`).join(``)+`<th>Actions</th></tr>`,t.innerHTML=r.map(t=>{let n=JSON.stringify(t).replace(/'/g,`&#39;`).replace(/"/g,`&quot;`),r=`<tr>`;return i.forEach(e=>{let n=t[e];n&&typeof n==`string`&&n.length>50&&(n=n.substring(0,50)+`...`),r+=`<td>${n===null?``:n}</td>`}),r+=`<td style="min-width:120px;">
        <button class="btn btn-sm btn-secondary" onclick="editSysData('${e}', '${t.id}', '${n}')">Edit</button>
        <button class="btn btn-sm" style="background:#fee2e2; color:#ef4444; border:none;" onclick="deleteSysData('${e}', '${t.id}')">Del</button>
      </td>`,r+=`</tr>`,r}).join(``)}catch(e){t.innerHTML=`<tr><td colspan="100%" style="color:red;">Error: ${e.message}</td></tr>`}},window.editSysData=function(e,t,n){let r=JSON.parse(n.replace(/&quot;/g,`"`).replace(/&#39;/g,`'`)),i=Object.keys(r),a=``;i.forEach(e=>{e===`id`?a+=`<div class="form-group"><label>${e} (Read-only)</label><input type="text" value="${r[e]}" disabled></div>`:a+=`<div class="form-group"><label>${e}</label><input type="text" id="edit_db_${e}" value="${r[e]===null?``:String(r[e]).replace(/"/g,`&quot;`)}"></div>`}),showModal(`
    <div class="modal modal-lg">
      <div class="modal-header"><h3>Edit Record (${e} #${t})</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
      <div class="modal-body" style="max-height:70vh; overflow-y:auto;">
        <div class="form-grid">${a}</div>
        <div style="margin-top:1.5rem; text-align:right;">
          <button class="btn btn-primary" onclick="saveSysData('${e}', '${t}', '${i.join(`,`)}')">Save Changes</button>
        </div>
      </div>
    </div>
  `)},window.saveSysData=async function(e,t,n){let r=n.split(`,`),i={};r.forEach(e=>{if(e!==`id`){let t=document.getElementById(`edit_db_${e}`);t&&(i[e]=t.value)}});try{await c(`/admin/db/${e}/${t}`,{method:`PATCH`,body:JSON.stringify(i)}),toast(`Record updated!`),closeModal(),loadAdminDataTable()}catch(e){toast(e.message)}},window.deleteSysData=async function(e,t){if(confirm(`DANGER: Are you absolutely sure you want to permanently delete this record? This may break relational integrity!`))try{await c(`/admin/db/${e}/${t}`,{method:`DELETE`}),toast(`Record deleted!`),loadAdminDataTable()}catch(e){toast(e.message)}},window.checkForAppUpdates=function(){let e=document.getElementById(`updateStatusText`),t=document.getElementById(`checkUpdateBtn`);e&&(e.textContent=`Checking for updates...`),t&&(t.disabled=!0,t.innerHTML=`<i class="fas fa-spinner fa-spin" style="margin-right:6px;"></i>Checking...`),window.electronAPI&&window.electronAPI.checkForUpdates?window.electronAPI.checkForUpdates():(e&&(e.textContent=`Updates are only available in the desktop app.`),t&&(t.disabled=!1,t.innerHTML=`<i class="fas fa-sync-alt" style="margin-right:6px;"></i>Check for Updates`))},window.electronAPI&&window.electronAPI.onUpdateStatus&&window.electronAPI.onUpdateStatus(e=>{let t=document.getElementById(`updateStatusText`),n=document.getElementById(`checkUpdateBtn`),r=document.getElementById(`updateProgressContainer`),i=document.getElementById(`updateProgressBar`);t&&(t.textContent=e.message,e.status===`up-to-date`?t.style.color=`#16a34a`:e.status===`available`||e.status===`downloading`?t.style.color=`#2563eb`:e.status===`ready`?t.style.color=`#16a34a`:e.status===`error`?t.style.color=`#dc2626`:t.style.color=`#64748b`),e.status===`checking`?n&&(n.disabled=!0,n.style.opacity=`0.7`,n.style.cursor=`not-allowed`,n.innerHTML=`<i class="fas fa-spinner fa-spin" style="margin-right:6px;"></i>Checking...`):e.status===`available`||e.status===`downloading`?(n&&(n.disabled=!0,n.style.opacity=`0.7`,n.style.cursor=`not-allowed`,n.innerHTML=`<i class="fas fa-download fa-pulse" style="margin-right:6px;"></i>Downloading...`),r&&(r.style.display=`block`),i&&typeof e.percent==`number`&&(i.style.width=Math.min(100,Math.max(0,e.percent))+`%`)):e.status===`ready`?(r&&(r.style.display=`block`),i&&(i.style.width=`100%`),n&&(n.disabled=!1,n.style.opacity=`1`,n.style.cursor=`pointer`,n.style.background=`linear-gradient(135deg, #16a34a, #15803d)`,n.innerHTML=`<i class="fas fa-power-off" style="margin-right:6px;"></i>Install & Restart Now`,n.onclick=function(){n.disabled=!0,n.innerHTML=`<i class="fas fa-spinner fa-spin" style="margin-right:6px;"></i>Installing...`,window.electronAPI&&window.electronAPI.quitAndInstall&&window.electronAPI.quitAndInstall()})):(e.status===`up-to-date`||e.status===`error`)&&(r&&(r.style.display=`none`),n&&(n.disabled=!1,n.style.opacity=`1`,n.style.cursor=`pointer`,n.style.background=`linear-gradient(135deg, #3b82f6, #2563eb)`,n.innerHTML=`<i class="fas fa-sync-alt" style="margin-right:6px;"></i>Check for Updates`,n.onclick=function(){checkForAppUpdates()}))}),window.electronAPI&&window.electronAPI.getAppVersion&&window.electronAPI.getAppVersion().then(e=>{let t=document.getElementById(`appVersionDisplay`);t&&(t.textContent=e)}),window.updateSysSettings=async function(e){let t=e.innerText;e.innerText=`Saving...`,e.disabled=!0;let n=[{key:`clinic_name`,value:document.getElementById(`admClinicName`).value},{key:`clinic_contact`,value:document.getElementById(`admClinicContact`).value},{key:`clinic_email`,value:document.getElementById(`admClinicEmail`).value},{key:`clinic_address`,value:document.getElementById(`admClinicAddress`).value},{key:`about_clinic`,value:document.getElementById(`admAboutClinic`).value},{key:`clinic_logo`,value:window.tempBase64Logo||``},{key:`consultation_fee`,value:document.getElementById(`admConsFee`).value},{key:`om_agent_code`,value:document.getElementById(`admOmAgent`).value},{key:`working_hours_start`,value:document.getElementById(`admStartTime`).value},{key:`working_hours_end`,value:document.getElementById(`admEndTime`).value},{key:`closed_days`,value:document.getElementById(`admClosedDays`).value},{key:`slot_duration`,value:document.getElementById(`admSlotDuration`).value},{key:`clinic_policy`,value:document.getElementById(`admClinicPolicy`).value},{key:`email_approved`,value:document.getElementById(`admEmailApproved`).value},{key:`email_reminder`,value:document.getElementById(`admEmailReminder`).value}];try{for(let e of n)await c(`/settings`,{method:`POST`,body:JSON.stringify(e)}),s[e.key]=e.value;toast(`Settings saved successfully!`)}catch(e){toast(`Failed to save settings: `+e.message)}e.innerText=t,e.disabled=!1,toast(`Settings saved successfully!`),g(document.getElementById(`mainContent`))},window.addUser=function(){showModal(`
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
        
        <button class="btn btn-primary btn-block" style="padding:1rem;" onclick="submitAddUser(this)">Create User Account</button>
      </div>
    </div>
  `)},window.submitAddUser=async function(e){let t=document.getElementById(`addUName`).value,n=document.getElementById(`addUEmail`).value,r=document.getElementById(`addUPass`).value,i=document.getElementById(`addURole`).value,a=e?e.innerHTML:`Create User Account`;e&&(e.innerHTML=`<i class="fas fa-spinner fa-spin"></i> Creating...`,e.disabled=!0);try{await c(`/users`,{method:`POST`,body:JSON.stringify({name:t,email:n,password:r,role:i})}),toast(`User added successfully!`),closeModal(),setAdminTab(`users`)}catch(e){toast(e.message)}finally{e&&(e.innerHTML=a,e.disabled=!1)}},window.updateAppointmentStatus=async function(e,t){if(!((t===`Cancelled`||t===`Rejected`)&&!confirm(`Are you sure you want to mark this appointment as ${t}?`))){toast(`Marking as ${t}...`);try{await c(`/appointments/${e}/status`,{method:`PATCH`,body:JSON.stringify({status:t})}),r=await c(`/appointments`),_(document.getElementById(`mainContent`)),toast(`Appointment ${t}`)}catch(e){toast(e.message)}}},window.openRescheduleModal=function(e,t,n){showModal(`
    <div class="modal" style="max-width:400px;">
      <div class="modal-header"><h3>Reschedule Appointment</h3><button class="close-btn" onclick="closeModal()">&times;</button></div>
      <div class="modal-body">
        <div class="form-group">
          <label>New Date</label>
          <input type="date" id="reschDate" value="${t||``}" style="width:100%; padding:0.75rem; border-radius:8px; border:1px solid #cbd5e1;">
        </div>
        <div class="form-group" style="margin-top:1rem;">
          <label>New Time</label>
          <input type="time" id="reschTime" value="${n||``}" style="width:100%; padding:0.75rem; border-radius:8px; border:1px solid #cbd5e1;">
        </div>
        <button class="btn btn-primary btn-block" style="margin-top:1.5rem;" onclick="submitReschedule('${e}')">Confirm Reschedule</button>
      </div>
    </div>
  `)},window.rescheduleApp=function(e){window.openRescheduleModal(e,``,``)},window.submitReschedule=async function(e){let t=document.getElementById(`reschDate`).value,n=document.getElementById(`reschTime`).value;if(!t||!n)return toast(`Please select both a date and a time.`);toast(`Rescheduling...`);try{await c(`/appointments/${e}/status`,{method:`PATCH`,body:JSON.stringify({status:`Rescheduled`,new_date:t,new_time:n})}),r!==void 0&&(r=await c(`/appointments`)),toast(`Appointment rescheduled successfully!`),closeModal();let i=document.getElementById(`mainContent`);window.route===`admin`?p(i):window.route===`reception`&&_(i)}catch(e){toast(e.message)}},window.handleLogoUpload=function(e){let t=e.target.files[0];if(!t)return;if(t.size>2*1024*1024)return toast(`File is too large! Please select an image under 2MB.`);let n=new FileReader;n.onload=function(e){let t=e.target.result;window.tempBase64Logo=t;let n=document.getElementById(`logoPreview`),r=document.getElementById(`logoPreviewText`);r&&(r.style.display=`none`),n.style.display=`block`,n.src=t},n.readAsDataURL(t)},window.monitorNetworkStatus=function(){let e=document.getElementById(`networkStatus`);if(!e)return;let t=e.querySelector(`span`),n=e.querySelector(`i`);function r(){if(!navigator.onLine){e.style.background=`rgba(239, 68, 68, 0.2)`,e.style.color=`#fca5a5`,n.className=`fas fa-wifi-slash`,t.innerText=`Offline`;return}let r=navigator.connection||navigator.mozConnection||navigator.webkitConnection;r?r.effectiveType===`2g`||r.effectiveType===`slow-2g`||r.downlink<1?(e.style.background=`rgba(245, 158, 11, 0.2)`,e.style.color=`#fcd34d`,n.className=`fas fa-exclamation-triangle`,t.innerText=`Slow Network`):(e.style.background=`rgba(16, 185, 129, 0.2)`,e.style.color=`#6ee7b7`,n.className=`fas fa-wifi`,t.innerText=`Strong Connection`):(e.style.background=`rgba(16, 185, 129, 0.2)`,e.style.color=`#6ee7b7`,n.className=`fas fa-wifi`,t.innerText=`Online`)}r(),window.addEventListener(`online`,r),window.addEventListener(`offline`,r);let i=navigator.connection||navigator.mozConnection||navigator.webkitConnection;i&&i.addEventListener(`change`,r)},window.toggleSidebar=function(){let e=document.querySelector(`.sidebar`);if(e){e.classList.toggle(`collapsed`);let t=document.getElementById(`advancedToggleIcon`),n=document.getElementById(`advancedToggleText`);e.classList.contains(`collapsed`)?(t&&(t.className=`fas fa-indent`),n&&(n.style.display=`block`,n.textContent=`OPEN`),localStorage.setItem(`sidebarCollapsed`,`true`)):(t&&(t.className=`fas fa-outdent`),n&&(n.style.display=`block`,n.textContent=`CLOSE`),localStorage.setItem(`sidebarCollapsed`,`false`))}},window.openPurgeModal=function(){showModal(`
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
  `)},window.submitPurge=async function(){let t=document.getElementById(`purgePassword`).value,n=document.getElementById(`purgePhrase`).value;if(!t)return toast(`Admin password is required.`);if(n.trim().toUpperCase()!==`I CONFIRM PURGE`)return toast(`Invalid authorization phrase. Must match exactly.`);if(confirm(`FINAL WARNING: Are you absolutely sure you want to completely wipe the system? This action is irreversible!`))try{toast(`Executing high-security purge protocol...`);let r=await fetch(`${e}/admin/purge`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${localStorage.getItem(`dcms_token`)}`},body:JSON.stringify({password:t,phrase:n})}),i=await r.json();if(!r.ok)throw Error(i.error||`Purge failed`);closeModal(),toast(`System Purge Complete. Reloading environment...`),setTimeout(()=>{window.location.reload(!0)},2e3)}catch(e){toast(e.message)}},window.startNetworkMonitor=function(){let e=document.getElementById(`networkStatusBadge`),t=document.getElementById(`networkWifiIcon`),n=document.getElementById(`networkStatusText`);if(!e)return;function r(r,i){r===`offline`?(e.style.background=`#f1f5f9`,e.style.color=`#64748b`,e.style.borderColor=`#cbd5e1`,t.className=`fas fa-wifi-slash`,n.innerText=`OFFLINE`,e.title=`No Internet Connection`,toast(`Network Disconnected!`,`error`)):r===`excellent`?(e.style.background=`#ecfdf5`,e.style.color=`#059669`,e.style.borderColor=`#a7f3d0`,t.className=`fas fa-wifi`,n.innerText=`EXCELLENT`,e.title=`Ping: ${i}ms`):r===`fair`?(e.style.background=`#fefce8`,e.style.color=`#ca8a04`,e.style.borderColor=`#fde047`,t.className=`fas fa-signal`,n.innerText=`FAIR SIGNAL`,e.title=`Ping: ${i}ms`):r===`poor`&&(e.style.background=`#fef2f2`,e.style.color=`#dc2626`,e.style.borderColor=`#fca5a5`,t.className=`fas fa-exclamation-triangle`,n.innerText=`POOR SIGNAL`,e.title=`Ping: ${i}ms`)}async function i(){if(!navigator.onLine){r(`offline`);return}let e=Date.now();try{if((await fetch(`/api/ping`)).ok){let t=Date.now()-e;r(t<150?`excellent`:t<400?`fair`:`poor`,t)}else r(`offline`)}catch{r(`offline`)}}window.addEventListener(`online`,i),window.addEventListener(`offline`,()=>r(`offline`)),setInterval(i,1e4),i()},window.exportReportsCSV=function(e){if(!window.reportDataCache){toast(`No data to export`,`error`);return}let t=e?e.innerHTML:``;e&&(e.innerHTML=`<i class="fas fa-spinner fa-spin"></i> Exporting...`,e.disabled=!0),setTimeout(()=>{let{chartData:n,diagnosisData:r}=window.reportDataCache,i=n.labels,a=n.revenue,o=n.labels,s=n.patients,c=r.labels,l=r.data,u=`Report Generated: `+new Date().toLocaleString()+`

`;u+=`REVENUE TRENDS
`,u+=`Month,Revenue (Le)
`;for(let e=0;e<i.length;e++)u+=`${i[e]},${a[e]}\n`;u+=`
PATIENT VISITS
`,u+=`Month,Visits
`;for(let e=0;e<o.length;e++)u+=`${o[e]},${s[e]}\n`;u+=`
TOP DIAGNOSES
`,u+=`Diagnosis,Count
`;for(let e=0;e<c.length;e++)u+=`"${c[e]}",${l[e]}\n`;let d=new Blob([u],{type:`text/csv`}),f=URL.createObjectURL(d),p=document.createElement(`a`);p.href=f,p.download=`Radiance Derms_Analytics_Report.csv`,document.body.appendChild(p),p.click(),document.body.removeChild(p),e&&(e.innerHTML=t,e.disabled=!1)},100)};function A(e){if(!b){e.innerHTML=`<div class="card" style="text-align:center; padding:3rem; color:#64748b;">Please select a patient from the Appointment Queue first.</div>`;return}let t=n.find(e=>e.id==b);e.innerHTML=`<div class="card" style="padding:2rem;">
    <h3 style="color:#0f172a; margin-bottom:1rem;"><i class="fas fa-stream" style="color:#3b82f6;"></i> Comprehensive Medical Timeline: ${t?t.name:`Unknown`}</h3>
    <div id="timelineContent" style="position:relative; padding-left:2rem; border-left:2px solid #e2e8f0; margin-top:2rem;">
      <div style="color:#64748b;">Loading timeline events...</div>
    </div>
  </div>`,c(`/patients/${b}/timeline`).then(e=>{let t=document.getElementById(`timelineContent`);if(!e||e.length===0){t.innerHTML=`<div style="color:#64748b;">No medical history found for this patient.</div>`;return}let n=``;e.forEach(e=>{let t=`fa-notes-medical`,r=`#3b82f6`,i=`Medical Event`,a=``,o=new Date(e.sortDate).toLocaleString();e.type===`appointment`?(t=`fa-calendar-check`,r=`#8b5cf6`,i=`Appointment`,a=`Status: ${e.status} | Reason: ${e.reason}`):e.type===`consultation`?(t=`fa-user-md`,r=`#10b981`,i=`Consultation`,a=`<strong>Working Diagnosis:</strong> ${e.working_diagnosis||`N/A`}<br>
               <strong>Primary Complaint:</strong> ${e.primary_complaint||`None`}<br>
               <div style="margin-top:0.5rem; display:flex; gap:0.5rem;">
                 <button class="btn btn-sm" style="background:#1e3a8a; color:white; border:none; padding:4px 8px; font-size:11px;" onclick="printClinicalRecordCard('${e.id}')">
                   <i class="fas fa-file-medical"></i> Print Record Card
                 </button>
                 <button class="btn btn-sm btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="printPrescription('${e.id}')">
                   Print Rx
                 </button>
               </div>`):e.type===`prescription`?(t=`fa-pills`,r=`#f59e0b`,i=`Prescription Issued`,a=`Status: ${e.status}`):e.type===`lab_order`?(t=`fa-flask`,r=`#ef4444`,i=`Lab Test Ordered`,a=`Status: ${e.status} | Results: ${e.results||`Pending`}`):e.type===`triage`&&(t=`fa-heartbeat`,r=`#ec4899`,i=`Nursing Triage`,a=`BP: ${e.blood_pressure||`--`} | Temp: ${e.temperature||`--`}°C | Weight: ${e.weight||`--`}kg`),n+=`
        <div style="position:relative; margin-bottom:2rem;">
          <div style="position:absolute; left:-2.85rem; top:0; width:40px; height:40px; border-radius:50%; background:white; border:2px solid ${r}; display:flex; align-items:center; justify-content:center; color:${r}; box-shadow:0 2px 4px rgba(0,0,0,0.1);"><i class="fas ${t}"></i></div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:1rem; margin-left:1rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
              <strong style="color:#0f172a;">${i}</strong>
              <span style="color:#64748b; font-size:0.85rem;">${o}</span>
            </div>
            <div style="color:#475569; font-size:0.95rem; line-height:1.4;">${a}</div>
          </div>
        </div>
      `}),t.innerHTML=n}).catch(e=>{document.getElementById(`timelineContent`).innerHTML=`<div style="color:#ef4444;">Failed to load timeline.</div>`})}