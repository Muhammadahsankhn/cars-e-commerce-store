function submitOrder() {
    // Get all input values
    let email = document.getElementById("email").value.trim();
    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let address = document.getElementById("address").value.trim();
    let city = document.getElementById("city").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let cod = document.getElementById("cod").checked;
    let bank = document.getElementById("bank").checked;

    // Check if all required fields are filled
    if (email === "" || firstName === "" || lastName === "" || address === "" || city === "" || phone === "" || (!cod && !bank)) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill out all the required fields!"
        });
        return;
    }

    // Show success message
    Swal.fire({
        icon: "success",
        title: "Order Submitted!",
        text: "Thank you for your order. We will contact you soon!",
        confirmButtonText: "OK"
    });

    // Clear all fields
    document.getElementById("email").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("address").value = "";
    document.getElementById("apartment").value = "";
    document.getElementById("city").value = "";
    document.getElementById("postalCode").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("cod").checked = false;
    document.getElementById("bank").checked = false;
}