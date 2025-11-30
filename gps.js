async function trackOrder(orderId) {
    let res = await fetch(`http://localhost:5000/gps/${orderId}`);
    let data = await res.json();

    document.getElementById("order-container").innerHTML =
        `<h3>Order ${orderId} Location:</h3>
         <p>Latitude: ${data.lat}</p>
         <p>Longitude: ${data.lng}</p>`;
}

