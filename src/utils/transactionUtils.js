export const calculateFees = (amount) => {
    const serviceCharge = amount * 0.02; // 2% service charge
    const agentCommission = amount * 0.015; // 1.5% agent commission
    return { serviceCharge, agentCommission };
};

