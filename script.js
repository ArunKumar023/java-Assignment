document.addEventListener('DOMContentLoaded', function () {
    // Variables for elements
    const loginForm = document.getElementById('loginForm');
    const customerList = document.getElementById('customerList');
    const customerTableBody = document.getElementById('customerTableBody');
    const logoutButton = document.getElementById('logoutButton');
    
    // Define API endpoints
    const authApiUrl = 'http://localhost:3000/proxy-authentication';
    const customerApiUrl = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp';
    
    let authToken = null; // To store the authentication token
    
    // Event listener for login form submission
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        // Extract login credentials
        const login_id = document.getElementById('login_id').value;
        const password = document.getElementById('password').value;
        
        try {
            // Authenticate user and retrieve the token
            const response = await fetch(authApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login_id,
                    password
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                authToken = data.token;
                // Hide the login screen and show the customer list
                loginScreen.style.display = 'none';
                customerList.style.display = 'block';
                // Load the customer list
                await loadCustomerList();
            } else {
                alert('Authentication failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error during authentication:', error);
        }
    });
    
    // Event listener for logout button
    logoutButton.addEventListener('click', function () {
        // Clear the authentication token
        authToken = null;
        // Hide the customer list and show the login screen
        customerList.style.display = 'none';
        loginScreen.style.display = 'block';
    });
    
    // Function to fetch and display customer list
    async function loadCustomerList() {
        try {
            // Fetch customer list using the authentication token
            const response = await fetch(`${customerApiUrl}?cmd=get_customer_list`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                // Clear previous data
                customerTableBody.innerHTML = '';
                // Populate the customer table
                data.forEach(customer => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${customer.first_name}</td>
                        <td>${customer.last_name}</td>
                        <td>${customer.email}</td>
                    `;
                    customerTableBody.appendChild(row);
                });
            } else {
                alert('Failed to fetch customer list.');
            }
        } catch (error) {
            console.error('Error loading customer list:', error);
        }
    }
    
    // Initial check for authentication token (if already authenticated)
    if (authToken) {
        loginScreen.style.display = 'none';
        customerList.style.display = 'block';
        loadCustomerList();
    }
});
