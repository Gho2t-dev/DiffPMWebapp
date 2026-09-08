
//notiert start zeit und datum
document.addEventListener("DOMContentLoaded", () => {
    const openTime = new Date();

    document.getElementById("startTime").textContent =
        openTime.toLocaleString();
});