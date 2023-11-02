document.addEventListener("DOMContentLoaded", function() {
    const salesGoalInput = document.getElementById("salesGoal");
    const salesAmountInput = document.getElementById("salesAmount");
    const addSaleButton = document.getElementById("addSale");
    const totalExpensesSpan = document.getElementById("totalExpenses");
    const remainingBalanceSpan = document.getElementById("remainingBalance");
    const expenseDetailsList = document.getElementById("expenseDetails");
    const salesDetailsList = document.getElementById("salesDetails");
    const salesGoalChartCanvas = document.getElementById("salesGoalChart").getContext("2d");
    const salesChartCanvas = document.getElementById("salesChart").getContext("2d");

    let expenses = [];
    let totalExpenses = 0;
    let remainingBalance = 0;
    let salesAchieved = 0;
    let salesGoal = 0;
    let salesGoalChart = null;
    let salesChart = null;
    let goalAchieved = false;

    function updateSummary() {
        salesGoal = parseFloat(salesGoalInput.value) || 0;
        totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
        salesAchieved = expenses.reduce((total, expense) => total + expense.amount, 0);
        remainingBalance = salesGoal - totalExpenses;

        totalExpensesSpan.textContent = `R$${totalExpenses.toFixed(2)}`;
        remainingBalanceSpan.textContent = `R$${remainingBalance.toFixed(2)}`;

        updateSalesGoalChart();
        updateExpenseDetails();
        updateSalesDetails();
        updateSalesChart();

        // Verifica se a meta foi alcançada
        if (remainingBalance <= 0 && !goalAchieved) {
            congratulateOnAchievingGoal();
            goalAchieved = true; 
        }
    }

    function updateSalesGoalChart() {
        if (salesGoalChart) {
            salesGoalChart.destroy();
        }

        const salesData = [salesAchieved, salesGoal - salesAchieved];

        salesGoalChart = new Chart(salesGoalChartCanvas, {
            type: "bar",
            data: {
                labels: ["Vendas Realizadas", "Meta de Vendas Diárias"],
                datasets: [{
                    label: "Vendas Realizadas vs. Meta de Vendas Diárias",
                    data: salesData,
                    backgroundColor: ["rgba(75, 192, 75, 0.5)", "rgba(255, 0, 0, 0.5)"]
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function updateSalesChart() {
        if (salesChart) {
            salesChart.destroy();
        }

        const salesDataLabels = expenses.map((expense, index) => `Venda ${index + 1}`);
        const salesDataValues = expenses.map(expense => expense.amount);

        salesChart = new Chart(salesChartCanvas, {
            type: "bar",
            data: {
                labels: salesDataLabels,
                datasets: [{
                    label: "Vendas Realizadas",
                    data: salesDataValues,
                    backgroundColor: "rgba(75, 192, 75, 0.5)"
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    addSaleButton.addEventListener("click", function() {
        const amount = parseFloat(salesAmountInput.value);

        if (!isNaN(amount)) {
            const sale = {
                amount
            };

            expenses.push(sale);

            salesAmountInput.value = "";

            updateSummary();
        }
    });

    function updateExpenseDetails() {
        expenseDetailsList.innerHTML = "";

        expenses.forEach(expense => {
            const listItem = document.createElement("li");
            listItem.textContent = `Venda: R$${expense.amount.toFixed(2)}`;
            expenseDetailsList.appendChild(listItem);
        });
    }

    function updateSalesDetails() {
        salesDetailsList.innerHTML = "";

        const goalItem = document.createElement("li");
        goalItem.textContent = `Meta Diária de Vendas: R$${salesGoal.toFixed(2)}`;
        salesDetailsList.appendChild(goalItem);
    }

    function congratulateOnAchievingGoal() {
        const congratsMessage = "Parabéns! Sua meta foi alcançada com sucesso!";
        alert(congratsMessage);
    }
});
