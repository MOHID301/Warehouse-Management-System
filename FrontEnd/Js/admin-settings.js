const API_URL = "http://127.0.0.1:8000";

document
.getElementById("passwordForm")
.addEventListener("submit", changePassword);

async function changePassword(e){

    e.preventDefault();

    const username = localStorage.getItem("username");

    const currentPassword =
    document.getElementById("currentPassword").value;

    const newPassword =
    document.getElementById("newPassword").value;

    const confirmPassword =
    document.getElementById("confirmPassword").value;

    if(newPassword !== confirmPassword){

        alert("New passwords do not match.");
        return;

    }

    try{

        const response =
        await fetch(`${API_URL}/change-password`,{

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                username: username,
                current_password: currentPassword,
                new_password: newPassword

            })

        });

        const result = await response.json();

        alert(result.message);

        if(result.success){

            document.getElementById("passwordForm").reset();

        }

    }
    catch(error){

        console.error(error);
        alert("Server Not Available");

    }

}