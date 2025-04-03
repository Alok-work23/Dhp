document.addEventListener("DOMContentLoaded", function () {
    const toggleGraphBtn = document.getElementById("toggleGraphBtn");
    const chartContainer = document.getElementById("chartContainer");
    const heading = document.getElementById("mainHeading");
    const container = document.querySelector(".container");
    const loadingIndicator = document.getElementById("loadingIndicator");

    let chartInstance = null; // Store the chart instance to destroy it if needed

    toggleGraphBtn.addEventListener("click", function () {
        if (!chartContainer.classList.contains("show")) {
            chartContainer.classList.add("show");
            container.classList.add("expanded");
            toggleGraphBtn.innerHTML = "Back to Home &#x2190;";
            toggleGraphBtn.classList.add("back-btn");
            heading.textContent = "Line Graph of Tags";
            heading.classList.add("small-heading");

            // Show loading indicator
            loadingIndicator.style.display = "block";

            // Load data only when opening the graph
            loadGraphData();
        } else {
            chartContainer.classList.remove("show");
            container.classList.remove("expanded");
            toggleGraphBtn.innerHTML = "Show Graph";
            toggleGraphBtn.classList.remove("back-btn");
            heading.textContent = "Stack Overflow Tags Over the Years";
            heading.classList.remove("small-heading");

            // Hide the graph when going back
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null;
            }
        }
    });

    function loadGraphData() {
        fetch("https://alokraj261201.pythonanywhere.com/data")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched Data:", data);

                // Hide loading indicator
                loadingIndicator.style.display = "none";

                const years = Object.keys(data);
                const tags = Object.keys(data[years[0]]);

                const datasets = tags.map((tag, index) => ({
                    label: tag,
                    data: years.map(year => data[year][tag] || 0),
                    borderColor: getDistinctColor(index),
                    backgroundColor: getDistinctColor(index, 0.3),
                    borderWidth: 3,
                    tension: 0.3
                }));

                const ctx = document.getElementById("lineChart").getContext("2d");

                // Destroy previous chart instance if exists
                if (chartInstance) {
                    chartInstance.destroy();
                }

                chartInstance = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: years,
                        datasets: datasets
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: "top",
                                labels: {
                                    font: { size: 14, weight: "bold" },
                                    color: "#333"
                                }
                            },
                            title: {
                                display: true,
                                text: "Top 10 Tags Over the Years",
                                font: { size: 18, weight: "bold" },
                                color: "#333"
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: "Percentage (%)",
                                    font: { size: 14, weight: "bold" },
                                    color: "#333"
                                },
                                grid: { color: "rgba(0, 0, 0, 0.1)" },
                                ticks: { font: { size: 12 }, color: "#333" }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: "Year",
                                    font: { size: 14, weight: "bold" },
                                    color: "#333"
                                },
                                grid: { color: "rgba(0, 0, 0, 0.1)" },
                                ticks: { font: { size: 12 }, color: "#333" }
                            }
                        }
                    }
                });
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                loadingIndicator.style.display = "none";
                chartContainer.innerHTML = "<p style='color:red; font-size: 1.2rem;'>Error loading data. Please try again.</p>";
            });
    }

    function getDistinctColor(index, opacity = 1) {
        const colors = [
            "rgba(255, 99, 132, OPACITY)",
            "rgba(54, 162, 235, OPACITY)",
            "rgba(255, 206, 86, OPACITY)",
            "rgba(75, 192, 192, OPACITY)",
            "rgba(153, 102, 255, OPACITY)",
            "rgba(255, 159, 64, OPACITY)",
            "rgba(0, 128, 0, OPACITY)",
            "rgba(128, 0, 128, OPACITY)",
            "rgba(220, 20, 60, OPACITY)",
            "rgba(0, 0, 128, OPACITY)"
        ];
        return colors[index % colors.length].replace("OPACITY", opacity);
    }
});
