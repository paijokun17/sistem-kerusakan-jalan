// ===== SISTEM AUTHENTIKASI MASYARAKAT =====

class AuthMasyarakat {
    constructor() {
        this.key = 'usersMasyarakat';
        this.currentUserKey = 'currentMasyarakatUser';
        this.initUsers();
    }

    initUsers() {
        if (!localStorage.getItem(this.key)) {
            const sampleUsers = [
                {
                    id: 1,
                    namaLengkap: "Budi Santoso",
                    email: "budi@email.com",
                    telepon: "081234567890",
                    alamat: "Jl. Contoh No. 123, Jakarta",
                    username: "budi",
                    password: "budi123",
                    tanggalDaftar: "2024-01-01"
                }
            ];
            this.saveUsers(sampleUsers);
        }
    }

    getUsers() {
        return JSON.parse(localStorage.getItem(this.key)) || [];
    }

    saveUsers(users) {
        localStorage.setItem(this.key, JSON.stringify(users));
    }

    register(userData) {
        const users = this.getUsers();
        
        // Check if username or email already exists
        if (users.find(u => u.username === userData.username)) {
            return { success: false, message: 'Username sudah digunakan' };
        }
        
        if (users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Email sudah terdaftar' };
        }

        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            ...userData,
            tanggalDaftar: new Date().toISOString().split('T')[0]
        };

        users.push(newUser);
        this.saveUsers(users);
        
        return { success: true, message: 'Registrasi berhasil!', user: newUser };
    }

    login(username, password) {
        const users = this.getUsers();
        const user = users.find(u => 
            (u.username === username || u.email === username) && 
            u.password === password
        );

        if (user) {
            localStorage.setItem(this.currentUserKey, JSON.stringify(user));
            return { success: true, user };
        } else {
            return { success: false, message: 'Username/email atau password salah' };
        }
    }

    logout() {
        localStorage.removeItem(this.currentUserKey);
    }

    getCurrentUser() {
        const user = localStorage.getItem(this.currentUserKey);
        return user ? JSON.parse(user) : null;
    }

    updateUser(updatedUser) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedUser };
            this.saveUsers(users);
            localStorage.setItem(this.currentUserKey, JSON.stringify(users[index]));
            return true;
        }
        return false;
    }
}

const authMasyarakat = new AuthMasyarakat();

// ===== FITUR REGISTRASI =====
function setupRegisterForm() {
    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                namaLengkap: document.getElementById('namaLengkap').value,
                email: document.getElementById('email').value,
                telepon: document.getElementById('telepon').value,
                alamat: document.getElementById('alamat').value,
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            };

            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validasi
            if (formData.password !== confirmPassword) {
                alert('Konfirmasi password tidak sesuai');
                return;
            }

            if (formData.password.length < 6) {
                alert('Password minimal 6 karakter');
                return;
            }

            if (formData.username.length < 5) {
                alert('Username minimal 5 karakter');
                return;
            }

            const result = authMasyarakat.register(formData);
            
            if (result.success) {
                alert('Registrasi berhasil! Silakan login.');
                window.location.href = 'login-masyarakat.html';
            } else {
                alert(result.message);
            }
        });
    }
}

// ===== FITUR LOGIN MASYARAKAT =====
function setupLoginMasyarakatForm() {
    const form = document.getElementById('loginMasyarakatForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const result = authMasyarakat.login(username, password);
            
            if (result.success) {
                window.location.href = 'profil-masyarakat.html';
            } else {
                alert(result.message);
            }
        });
    }
}

// ===== FITUR PROFIL MASYARAKAT =====
function loadProfilePage() {
    const currentUser = authMasyarakat.getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login-masyarakat.html';
        return;
    }

    // Update user info
    document.getElementById('userName').textContent = currentUser.namaLengkap;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userInitial').textContent = currentUser.namaLengkap.charAt(0).toUpperCase();
    document.getElementById('joinDate').textContent = currentUser.tanggalDaftar;

    // Update profile details
    document.getElementById('detailNama').textContent = currentUser.namaLengkap;
    document.getElementById('detailEmail').textContent = currentUser.email;
    document.getElementById('detailTelepon').textContent = currentUser.telepon;
    document.getElementById('detailAlamat').textContent = currentUser.alamat || '-';
    document.getElementById('detailUsername').textContent = currentUser.username;

    // Load user's reports
    loadUserReports(currentUser.id);
}

function loadUserReports(userId) {
    const laporanData = laporanStorage.getData();
    const userReports = laporanData.filter(laporan => 
        laporan.emailPelapor === authMasyarakat.getCurrentUser().email
    );

    // Update stats
    document.getElementById('totalLaporan').textContent = userReports.length;
    document.getElementById('laporanDiproses').textContent = userReports.filter(r => r.status === 'dalam_perbaikan').length;
    document.getElementById('laporanSelesai').textContent = userReports.filter(r => r.status === 'selesai').length;

    // Update table
    const tableBody = document.getElementById('myReportsBody');
    tableBody.innerHTML = userReports.map(report => `
        <tr>
            <td>${report.nomorLaporan}</td>
            <td>${report.lokasi}</td>
            <td>${report.jenisKerusakan}</td>
            <td>${formatDate(report.tanggalLapor)}</td>
            <td><span class="status-badge status-${report.status}">${getStatusText(report.status)}</span></td>
            <td>
                <button class="btn" onclick="viewReportDetail(${report.id})">Detail</button>
            </td>
        </tr>
    `).join('');
}

function editProfile() {
    const currentUser = authMasyarakat.getCurrentUser();
    
    document.getElementById('editNama').value = currentUser.namaLengkap;
    document.getElementById('editEmail').value = currentUser.email;
    document.getElementById('editTelepon').value = currentUser.telepon;
    document.getElementById('editAlamat').value = currentUser.alamat || '';
    
    document.getElementById('editProfileModal').style.display = 'block';
}

function setupEditProfileForm() {
    const form = document.getElementById('editProfileForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const updatedData = {
                namaLengkap: document.getElementById('editNama').value,
                email: document.getElementById('editEmail').value,
                telepon: document.getElementById('editTelepon').value,
                alamat: document.getElementById('editAlamat').value
            };

            const currentUser = authMasyarakat.getCurrentUser();
            if (authMasyarakat.updateUser({ ...currentUser, ...updatedData })) {
                alert('Profil berhasil diupdate!');
                document.getElementById('editProfileModal').style.display = 'none';
                loadProfilePage(); // Reload data
            }
        });
    }
}

// ===== NAVIGATION PROFILE =====
function setupProfileNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// ===== UPDATE LAPORAN MASYARAKAT =====
function setupLaporanMasyarakatWithAuth() {
    const currentUser = authMasyarakat.getCurrentUser();
    const form = document.getElementById('laporanForm');
    
    if (form && currentUser) {
        // Auto-fill user data if logged in
        document.getElementById('namaPelapor').value = currentUser.namaLengkap;
        document.getElementById('emailPelapor').value = currentUser.email;
        document.getElementById('teleponPelapor').value = currentUser.telepon;
    }
}

// ===== UPDATE MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Setup auth masyarakat
    setupRegisterForm();
    setupLoginMasyarakatForm();
    
    // Setup profile page
    if (window.location.pathname.includes('profil-masyarakat.html')) {
        loadProfilePage();
        setupEditProfileForm();
        setupProfileNavigation();
    }
    
    // Setup laporan dengan auth
    setupLaporanMasyarakatWithAuth();
    
    // Logout handler masyarakat
    const logoutBtn = document.getElementById('logoutMasyarakatBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            authMasyarakat.logout();
            window.location.href = 'index.html';
        });
    }
});
