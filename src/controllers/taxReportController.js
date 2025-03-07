export const getTaxReport = async (req, res, next) => {
    try {
        res.status(200).json({
            message: "National Tax Report",
            totalTaxCollected: NATIONAL_REVENUE_ACCOUNT.balance
        });
    } catch (error) {
        next(error);
    }
};

