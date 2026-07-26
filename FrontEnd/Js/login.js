const API_URL = "https://warehouse-management-system-production-eb5b.up.railway.app";

document
.getElementById("loginForm")
.addEventListener("submit", login);

async function login(e){

    e.preventDefault();

    const username =
    document.getElementById("username").value;

    const password =
    document.getElementById("password").value;

    try{

        const response =
        await fetch(`${API_URL}/login`,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                username,
                password
            })

        });

        const result =
        await response.json();

        if(result.success){

            localStorage.setItem(
                "role",
                result.role
            );

            localStorage.setItem(
                "username",
                result.username
            );

            if(result.role === "Admin"){

                window.location.href = "admin-dashboard.html";

            }
            else{

                window.location.href = "index.html";

            }

        }
        else{

            document.getElementById(
                "error-message"
            ).innerText =
            "Invalid Username or Password";

        }

    }
    catch(error){

        document.getElementById(
            "error-message"
        ).innerText =
        "Server Not Available";

    }

}