// Data Storage menggunakan localStorage
class DataStorage {
    constructor() {
        this.key = 'kerusakanJalanData';
        this.initData();
    }

    initData() {
        if (!localStorage.getItem(this.key)) {
            const sampleData = [
                {
                    id: 1,
                    lokasi: 'Jl. Merdeka No. 123',
                    tingkat: 'sedang',
                    deskripsi: 'Lubang dengan diameter 30cm dan kedalaman 15cm',
                    koordinat: '-6.2088, 106.8456',
                    tanggalLapor: '2024-01-15',
                    status: 'dilaporkan'
                },
                {
                    id: 2,
                    lokasi: 'Jl. Sudirman No. 45',
                    tingkat: 'berat',
                    deskripsi: 'Retakan memanjang sepanjang 50 meter',
                    koordinat: '-6.2297, 106.8220',
                    tanggalLapor: '2024-01-10',
                    status: 'dalam_perbaikan'
                },
                {
                    id: 3,
                    lokasi: 'Jl. Thamrin No. 78',
                    tingkat: 'ringan',
                    deskripsi: 'Permukaan jalan bergelombang ringan',
                    koordinat: '-6.1865, 106.8342',
                    tanggalLapor: '2024-01-20',
                    status: 'selesai'
                }
            ];
            this.saveData(sampleData);
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.key)) || [];
    }

    saveData(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    addData(newData) {
        const data = this.getData();
        const newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
        newData.id = newId;
        newData.tanggalLapor = new Date().toISOString().split('T')[0];
        data.push(newData);
        this.saveData(data);
        return newData;
    }

    updateData(updatedData) {
        const data = this.getData();
        const index = data.findIndex(item => item.id === updatedData.id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updatedData };
            this.saveData(data);
            return true;
        }
        return false;
    }

    deleteData(id) {
        const data = this.getData();
        const filteredData = data.filter(item => item.id !== id);
        this.saveData(filteredData);
        return filteredData.length !== data.length;
    }
}

// Inisialisasi storage
const dataStorage = new DataStorage();

// Authentication
class Auth {
    constructor() {
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    }

    login(username, password) {
        // Simple authentication - in real app, this would be server-side
        if (username === 'admin' && password === 'admin123') {
            this.isLoggedIn = true;
            localStorage.setItem('isLoggedIn', 'true');
            return true;
        }
        return false;
    }

    logout() {
        this.isLoggedIn = false;
        localStorage.removeItem('isLoggedIn');
    }

    checkAuth() {
        return this.isLoggedIn;
    }
}

const auth = new Auth();

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function getStatusText(status) {
    const statusMap = {
        'dilaporkan': 'Dilaporkan',
        'dalam_perbaikan': 'Dalam Perbaikan',
        'selesai': 'Selesai'
    };
    return statusMap[status] || status;
}

function getTingkatText(tingkat) {
    const tingkatMap = {
        'ringan': 'Ringan',
        'sedang': 'Sedang',
        'berat': 'Berat'
    };
    return tingkatMap[tingkat] || tingkat;
}

// Page Specific Functions

// Home Page
function updateHomeStats() {
    const data = dataStorage.getData();
    const total = data.length;
    const sedangDiperbaiki = data.filter(item => item.status === 'dalam_perbaikan').length;
    const selesaiDiperbaiki = data.filter(item => item.status === 'selesai').length;

    document.getElementById('total-kerusakan').textContent = total;
    document.getElementById('sedang-diperbaiki').textContent = sedangDiperbaiki;
    document.getElementById('selesai-diperbaiki').textContent = selesaiDiperbaiki;
}

// Login Page
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (auth.login(username, password)) {
                window.location.href = 'dashboard.html';
            } else {
                alert('Username atau password salah!');
            }
        });
    }
}

// Dashboard Page
function updateDashboardStats() {
    const data = dataStorage.getData();
    const total = data.length;
    const ringan = data.filter(item => item.tingkat === 'ringan').length;
    const sedang = data.filter(item => item.tingkat === 'sedang').length;
    const berat = data.filter(item => item.tingkat === 'berat').length;

    document.getElementById('dashboard-total').textContent = total;
    document.getElementById('dashboard-ringan').textContent = ringan;
    document.getElementById('dashboard-sedang').textContent = sedang;
    document.getElementById('dashboard-berat').textContent = berat;
}

function loadRecentData() {
    const data = dataStorage.getData().slice(-5).reverse(); // Get last 5 entries
    const tableBody = document.getElementById('recentTableBody');
    
    tableBody.innerHTML = data.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.lokasi}</td>
            <td><span class="tingkat-${item.tingkat}">${getTingkatText(item.tingkat)}</span></td>
            <td>${formatDate(item.tanggalLapor)}</td>
            <td><span class="status-badge status-${item.status}">${getStatusText(item.status)}</span></td>
            <td>
                <button class="btn" onclick="editData(${item.id})">Edit</button>
                <button class="btn btn-secondary" onclick="deleteData(${item.id})">Hapus</button>
            </td>
        </tr>
    `).join('');
}

// Data Kerusakan Page
function loadAllData() {
    const data = dataStorage.getData();
    const tableBody = document.getElementById('dataTableBody');
    
    tableBody.innerHTML = data.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.lokasi}</td>
            <td><span class="tingkat-${item.tingkat}">${getTingkatText(item.tingkat)}</span></td>
            <td>${item.deskripsi}</td>
            <td>${formatDate(item.tanggalLapor)}</td>
            <td><span class="status-badge status-${item.status}">${getStatusText(item.status)}</span></td>
            <td>
                <button class="btn" onclick="editData(${item.id})">Edit</button>
                <button class="btn btn-secondary" onclick="deleteData(${item.id})">Hapus</button>
            </td>
        </tr>
    `).join('');
}

function filterData() {
    const statusFilter = document.getElementById('filterStatus').value;
    const tingkatFilter = document.getElementById('filterTingkat').value;
    
    let data = dataStorage.getData();
    
    if (statusFilter) {
        data = data.filter(item => item.status === statusFilter);
    }
    
    if (tingkatFilter) {
        data = data.filter(item => item.tingkat === tingkatFilter);
    }
    
    const tableBody = document.getElementById('dataTableBody');
    tableBody.innerHTML = data.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.lokasi}</td>
            <td><span class="tingkat-${item.tingkat}">${getTingkatText(item.tingkat)}</span></td>
            <td>${item.deskripsi}</td>
            <td>${formatDate(item.tanggalLapor)}</td>
            <td><span class="status-badge status-${item.status}">${getStatusText(item.status)}</span></td>
            <td>
                <button class="btn" onclick="editData(${item.id})">Edit</button>
                <button class="btn btn-secondary" onclick="deleteData(${item.id})">Hapus</button>
            </td>
        </tr>
    `).join('');
}

function resetFilter() {
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterTingkat').value = '';
    loadAllData();
}

// Modal Functions
function tambahData() {
    const modal = document.getElementById('tambahModal');
    modal.style.display = 'block';
}

function editData(id) {
    const data = dataStorage.getData();
    const item = data.find(item => item.id === id);
    
    if (item) {
        document.getElementById('editId').value = item.id;
        document.getElementById('editLokasi').value = item.lokasi;
        document.getElementById('editTingkat').value = item.tingkat;
        document.getElementById('editDeskripsi').value = item.deskripsi;
        document.getElementById('editKoordinat').value = item.koordinat || '';
        document.getElementById('editStatus').value = item.status;
        
        const modal = document.getElementById('editModal');
        modal.style.display = 'block';
    }
}

function deleteData(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        if (dataStorage.deleteData(id)) {
            alert('Data berhasil dihapus');
            if (window.location.pathname.includes('dashboard.html')) {
                loadRecentData();
                updateDashboardStats();
            } else if (window.location.pathname.includes('data-kerusakan.html')) {
                loadAllData();
            }
        } else {
            alert('Gagal menghapus data');
        }
    }
}

// Form Handlers
function setupTambahForm() {
    const form = document.getElementById('tambahForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                lokasi: document.getElementById('lokasi').value,
                tingkat: document.getElementById('tingkat').value,
                deskripsi: document.getElementById('deskripsi').value,
                koordinat: document.getElementById('koordinat').value,
                status: 'dilaporkan'
            };
            
            dataStorage.addData(formData);
            alert('Data berhasil ditambahkan');
            
            // Reset form and close modal
            form.reset();
            document.getElementById('tambahModal').style.display = 'none';
            
            // Reload data
            if (window.location.pathname.includes('dashboard.html')) {
                loadRecentData();
                updateDashboardStats();
            }
        });
    }
}

function setupEditForm() {
    const form = document.getElementById('editForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                id: parseInt(document.getElementById('editId').value),
                lokasi: document.getElementById('editLokasi').value,
                tingkat: document.getElementById('editTingkat').value,
                deskripsi: document.getElementById('editDeskripsi').value,
                koordinat: document.getElementById('editKoordinat').value,
                status: document.getElementById('editStatus').value
            };
            
            if (dataStorage.updateData(formData)) {
                alert('Data berhasil diupdate');
                
                // Close modal
                document.getElementById('editModal').style.display = 'none';
                
                // Reload data
                if (window.location.pathname.includes('dashboard.html')) {
                    loadRecentData();
                    updateDashboardStats();
                } else if (window.location.pathname.includes('data-kerusakan.html')) {
                    loadAllData();
                }
            } else {
                alert('Gagal mengupdate data');
            }
        });
    }
}

// Laporan Functions
function generateReport() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const reportType = document.getElementById('reportType').value;
    
    let data = dataStorage.getData();
    
    // Filter by date
    if (startDate && endDate) {
        data = data.filter(item => {
            const itemDate = new Date(item.tanggalLapor);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return itemDate >= start && itemDate <= end;
        });
    }
    
    // Filter by type
    if (reportType !== 'semua') {
        data = data.filter(item => item.tingkat === reportType);
    }
    
    displayReportResults(data);
}

function displayReportResults(data) {
    const resultsDiv = document.getElementById('reportResults');
    
    if (data.length === 0) {
        resultsDiv.innerHTML = '<div class="no-data"><p>Tidak ada data yang sesuai dengan kriteria</p></div>';
        return;
    }
    
    const ringan = data.filter(item => item.tingkat === 'ringan').length;
    const sedang = data.filter(item => item.tingkat === 'sedang').length;
    const berat = data.filter(item => item.tingkat === 'berat').length;
    
    const dilaporkan = data.filter(item => item.status === 'dilaporkan').length;
    const dalamPerbaikan = data.filter(item => item.status === 'dalam_perbaikan').length;
    const selesai = data.filter(item => item.status === 'selesai').length;
    
    resultsDiv.innerHTML = `
        <div class="report-summary">
            <h3>Ringkasan Laporan</h3>
            <div class="summary-grid">
                <div class="summary-item">
                    <h4>Total Data</h4>
                    <span class="summary-value">${data.length}</span>
                </div>
                <div class="summary-item">
                    <h4>Kerusakan Ringan</h4>
                    <span class="summary-value">${ringan}</span>
                </div>
                <div class="summary-item">
                    <h4>Kerusakan Sedang</h4>
                    <span class="summary-value">${sedang}</span>
                </div>
                <div class="summary-item">
                    <h4>Kerusakan Berat</h4>
                    <span class="summary-value">${berat}</span>
                </div>
            </div>
            
            <div class="summary-grid">
                <div class="summary-item">
                    <h4>Dilaporkan</h4>
                    <span class="summary-value">${dilaporkan}</span>
                </div>
                <div class="summary-item">
                    <h4>Dalam Perbaikan</h4>
                    <span class="summary-value">${dalamPerbaikan}</span>
                </div>
                <div class="summary-item">
                    <h4>Selesai</h4>
                    <span class="summary-value">${selesai}</span>
                </div>
            </div>
        </div>
        
        <div class="report-details">
            <h3>Detail Data</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Lokasi</th>
                            <th>Tingkat</th>
                            <th>Deskripsi</th>
                            <th>Tanggal</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${item.lokasi}</td>
                                <td><span class="tingkat-${item.tingkat}">${getTingkatText(item.tingkat)}</span></td>
                                <td>${item.deskripsi}</td>
                                <td>${formatDate(item.tanggalLapor)}</td>
                                <td><span class="status-badge status-${item.status}">${getStatusText(item.status)}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function exportToPDF() {
    alert('Fitur export PDF akan diimplementasikan dengan library seperti jsPDF');
    // Implementation would use jsPDF library to generate PDF
}

// Modal Close Handlers
function setupModalHandlers() {
    // Close modal when clicking on X
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Logout Handler
function setupLogout() {
    const logoutButtons = document.querySelectorAll('#logoutBtn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            auth.logout();
            window.location.href = 'index.html';
        });
    });
}

// Auth Protection
function checkAuthForPages() {
    const protectedPages = ['dashboard.html', 'data-kerusakan.html', 'laporan.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !auth.checkAuth()) {
        window.location.href = 'login.html';
    }
}

// Initialize Page
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication for protected pages
    checkAuthForPages();
    
    // Setup common handlers
    setupModalHandlers();
    setupLogout();
    setupLoginForm();
    setupTambahForm();
    setupEditForm();
    
    // Page-specific initialization
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        updateHomeStats();
    }
    
    if (window.location.pathname.includes('dashboard.html')) {
        updateDashboardStats();
        loadRecentData();
    }
    
    if (window.location.pathname.includes('data-kerusakan.html')) {
        loadAllData();
    }
});
