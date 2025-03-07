// Define tax calculation function using 'let'
let calculateTax = function(amount, transactionType) {
    // Define tax rates for different transaction types
    let TAX_RATES = {
        deposit: 0.02,         // 2% tax on deposits
        withdrawal: 0.03,      // 3% tax on withdrawals
        transfer: 0.01,        // 1% tax on transfers
        business_payment: 0.05 // 5% tax on business transactions
    };

    // Get the tax rate based on transaction type, defaulting to 0 if not found
    let taxRate = TAX_RATES[transactionType] || 0;

    // Calculate tax and net amount
    let taxAmount = amount * taxRate;
    let netAmount = amount - taxAmount;

    return {
        taxAmount: parseFloat(taxAmount.toFixed(2)), // Ensure two decimal places
        netAmount: parseFloat(netAmount.toFixed(2))  // Ensure two decimal places
    };
};

// Export the function
export { calculateTax };

