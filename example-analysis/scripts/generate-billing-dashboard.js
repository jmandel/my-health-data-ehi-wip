import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the complete billing data
const dataPath = path.join(__dirname, '..', 'complete-billing-data.json');
const billingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('Generating billing dashboard...');

// Process data for visualizations
const dashboardData = {
    // Overall statistics
    totalCharges: 0,
    totalPayments: 0,
    totalAdjustments: 0,
    totalPatientPayments: 0,
    totalInsurancePayments: 0,
    
    // Time to payment analysis
    paymentTimelines: [],
    
    // Payment breakdown by source
    paymentSources: {
        insurance: 0,
        patient: 0,
        unknown: 0
    },
    
    // Monthly trends
    monthlyData: {},
    
    // Department analysis
    departmentStats: {},
    
    // Procedure analysis
    procedureStats: {},
    
    // Payment speed distribution
    paymentSpeedBuckets: {
        'Same Day': 0,
        '1-7 days': 0,
        '8-30 days': 0,
        '31-60 days': 0,
        '61-90 days': 0,
        '90+ days': 0,
        'Unpaid': 0
    },
    
    // Insurance performance
    insuranceStats: {},
    
    // Write-off analysis
    writeOffReasons: {}
};

// Process each encounter
billingData.encounters.forEach(enc => {
    if (!enc.billing.summary.hasAnyBilling) return;
    
    const encounterDate = new Date(enc.clinical.date);
    const monthKey = `${encounterDate.getFullYear()}-${String(encounterDate.getMonth() + 1).padStart(2, '0')}`;
    
    // Initialize monthly data
    if (!dashboardData.monthlyData[monthKey]) {
        dashboardData.monthlyData[monthKey] = {
            charges: 0,
            payments: 0,
            adjustments: 0,
            patientPayments: 0,
            insurancePayments: 0,
            encounters: 0
        };
    }
    
    dashboardData.monthlyData[monthKey].encounters++;
    
    // Process charges
    enc.billing.charges.forEach(charge => {
        dashboardData.totalCharges += charge.amount;
        dashboardData.monthlyData[monthKey].charges += charge.amount;
        
        // Department stats
        const dept = enc.clinical.department;
        if (!dashboardData.departmentStats[dept]) {
            dashboardData.departmentStats[dept] = {
                charges: 0,
                payments: 0,
                adjustments: 0,
                encounters: 0,
                avgDaysToPayment: []
            };
        }
        dashboardData.departmentStats[dept].charges += charge.amount;
        dashboardData.departmentStats[dept].encounters++;
        
        // Procedure stats
        const procName = charge.procedureName || 'Unknown Procedure';
        if (!dashboardData.procedureStats[procName]) {
            dashboardData.procedureStats[procName] = {
                count: 0,
                totalCharged: 0,
                totalPaid: 0,
                totalAdjusted: 0,
                avgCharge: 0
            };
        }
        dashboardData.procedureStats[procName].count++;
        dashboardData.procedureStats[procName].totalCharged += charge.amount;
        
        // Track payment timeline
        let firstPaymentDays = null;
        let totalPaidOnCharge = 0;
        let totalAdjustedOnCharge = 0;
        
        charge.matches.forEach(match => {
            const matchDate = new Date(match.matchDate);
            const daysDiff = Math.floor((matchDate - encounterDate) / (1000 * 60 * 60 * 24));
            
            // Find if this is a payment or adjustment
            const isPayment = enc.billing.payments.some(p => p.txId === match.matchedTxId);
            
            if (isPayment && firstPaymentDays === null) {
                firstPaymentDays = daysDiff;
            }
            
            if (isPayment) {
                totalPaidOnCharge += match.matchAmount;
            } else {
                totalAdjustedOnCharge += match.matchAmount;
            }
        });
        
        // Update procedure stats
        dashboardData.procedureStats[procName].totalPaid += totalPaidOnCharge;
        dashboardData.procedureStats[procName].totalAdjusted += totalAdjustedOnCharge;
        
        // Categorize payment speed
        if (firstPaymentDays !== null) {
            dashboardData.paymentTimelines.push({
                chargeAmount: charge.amount,
                daysToFirstPayment: firstPaymentDays,
                percentPaid: (totalPaidOnCharge / charge.amount) * 100,
                percentAdjusted: (totalAdjustedOnCharge / charge.amount) * 100
            });
            
            if (firstPaymentDays === 0) {
                dashboardData.paymentSpeedBuckets['Same Day']++;
            } else if (firstPaymentDays <= 7) {
                dashboardData.paymentSpeedBuckets['1-7 days']++;
            } else if (firstPaymentDays <= 30) {
                dashboardData.paymentSpeedBuckets['8-30 days']++;
            } else if (firstPaymentDays <= 60) {
                dashboardData.paymentSpeedBuckets['31-60 days']++;
            } else if (firstPaymentDays <= 90) {
                dashboardData.paymentSpeedBuckets['61-90 days']++;
            } else {
                dashboardData.paymentSpeedBuckets['90+ days']++;
            }
            
            if (dept && firstPaymentDays !== null) {
                dashboardData.departmentStats[dept].avgDaysToPayment.push(firstPaymentDays);
            }
        } else if (charge.outstandingAmount > 0) {
            dashboardData.paymentSpeedBuckets['Unpaid']++;
        }
    });
    
    // Process payments
    enc.billing.payments.forEach(payment => {
        dashboardData.totalPayments += payment.amount;
        dashboardData.monthlyData[monthKey].payments += payment.amount;
        
        const dept = enc.clinical.department;
        if (dashboardData.departmentStats[dept]) {
            dashboardData.departmentStats[dept].payments += payment.amount;
        }
        
        // Categorize payment source
        if (payment.isPatientPayment) {
            dashboardData.totalPatientPayments += payment.amount;
            dashboardData.paymentSources.patient += payment.amount;
            dashboardData.monthlyData[monthKey].patientPayments += payment.amount;
        } else if (payment.insuranceName || payment.payorName) {
            dashboardData.totalInsurancePayments += payment.amount;
            dashboardData.paymentSources.insurance += payment.amount;
            dashboardData.monthlyData[monthKey].insurancePayments += payment.amount;
            
            // Track insurance performance
            const insName = payment.insuranceName || payment.payorName || 'Unknown Insurance';
            if (!dashboardData.insuranceStats[insName]) {
                dashboardData.insuranceStats[insName] = {
                    totalPaid: 0,
                    totalCharges: 0,
                    paymentCount: 0,
                    avgDaysToPayment: []
                };
            }
            dashboardData.insuranceStats[insName].totalPaid += payment.amount;
            dashboardData.insuranceStats[insName].paymentCount++;
            
            // Calculate days to payment
            const serviceDate = new Date(payment.serviceDate);
            const postDate = new Date(payment.postDate);
            const daysDiff = Math.floor((postDate - serviceDate) / (1000 * 60 * 60 * 24));
            dashboardData.insuranceStats[insName].avgDaysToPayment.push(daysDiff);
        } else {
            dashboardData.paymentSources.unknown += payment.amount;
        }
    });
    
    // Process adjustments
    enc.billing.adjustments.forEach(adjustment => {
        dashboardData.totalAdjustments += adjustment.amount;
        dashboardData.monthlyData[monthKey].adjustments += adjustment.amount;
        
        const dept = enc.clinical.department;
        if (dashboardData.departmentStats[dept]) {
            dashboardData.departmentStats[dept].adjustments += adjustment.amount;
        }
        
        // Track write-off reasons
        const reason = adjustment.adjustmentReason || 'Unspecified';
        if (!dashboardData.writeOffReasons[reason]) {
            dashboardData.writeOffReasons[reason] = {
                count: 0,
                totalAmount: 0
            };
        }
        dashboardData.writeOffReasons[reason].count++;
        dashboardData.writeOffReasons[reason].totalAmount += adjustment.amount;
    });
});

// Calculate averages
Object.values(dashboardData.departmentStats).forEach(dept => {
    if (dept.avgDaysToPayment.length > 0) {
        const sum = dept.avgDaysToPayment.reduce((a, b) => a + b, 0);
        dept.avgDaysToPayment = Math.round(sum / dept.avgDaysToPayment.length);
    } else {
        dept.avgDaysToPayment = null;
    }
});

Object.values(dashboardData.insuranceStats).forEach(ins => {
    if (ins.avgDaysToPayment.length > 0) {
        const sum = ins.avgDaysToPayment.reduce((a, b) => a + b, 0);
        ins.avgDaysToPayment = Math.round(sum / ins.avgDaysToPayment.length);
    } else {
        ins.avgDaysToPayment = null;
    }
});

Object.values(dashboardData.procedureStats).forEach(proc => {
    if (proc.count > 0) {
        proc.avgCharge = proc.totalCharged / proc.count;
    }
});

// Calculate payment velocity data
const paymentVelocityData = [];
for (let day = 0; day <= 180; day++) {
    const chargesWithPaymentByDay = dashboardData.paymentTimelines.filter(t => 
        t.daysToFirstPayment !== null && t.daysToFirstPayment <= day
    );
    const totalChargeAmount = dashboardData.paymentTimelines.reduce((sum, t) => sum + t.chargeAmount, 0);
    const paidAmount = chargesWithPaymentByDay.reduce((sum, t) => sum + (t.chargeAmount * t.percentPaid / 100), 0);
    
    paymentVelocityData.push({
        day: day,
        percentOfChargesPaid: totalChargeAmount > 0 ? (paidAmount / totalChargeAmount) * 100 : 0,
        countPaid: chargesWithPaymentByDay.length,
        totalCount: dashboardData.paymentTimelines.length
    });
}

// Extract unique filter values
const filterOptions = {
    departments: [...new Set(billingData.encounters
        .filter(e => e.billing.summary.hasAnyBilling)
        .map(e => e.clinical.department))].sort(),
    years: [...new Set(billingData.encounters
        .filter(e => e.billing.summary.hasAnyBilling)
        .map(e => new Date(e.clinical.date).getFullYear()))].sort(),
    insurances: [...new Set(Object.keys(dashboardData.insuranceStats))].sort(),
    procedures: [...new Set(Object.keys(dashboardData.procedureStats))]
        .sort((a, b) => dashboardData.procedureStats[b].count - dashboardData.procedureStats[a].count)
        .slice(0, 20) // Top 20 procedures
};

// Generate HTML dashboard
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Epic EHI Billing Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f5f6fa;
            color: #2c3e50;
            line-height: 1.6;
        }
        
        .header {
            background: #2c3e50;
            color: white;
            padding: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .header h1 {
            margin: 0;
            font-size: 1.5rem;
        }
        
        .header p {
            margin: 5px 0 0 0;
            opacity: 0.9;
        }
        
        .container {
            max-width: 100%;
            margin: 0 auto;
            padding: 10px;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .metric-card {
            background: white;
            padding: 15px;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .metric-card h3 {
            font-size: 14px;
            color: #7f8c8d;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 3px;
        }
        
        .metric-subtitle {
            font-size: 14px;
            color: #95a5a6;
        }
        
        .chart-section {
            background: white;
            padding: 15px;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 10px;
        }
        
        .chart-section h2 {
            margin-bottom: 10px;
            color: #2c3e50;
            font-size: 1.2rem;
        }
        
        .chart-container {
            position: relative;
            height: 250px;
            margin-bottom: 10px;
        }
        
        .chart-container.small {
            height: 200px;
        }
        
        .chart-container.large {
            height: 300px;
        }
        
        .main-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .chart-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        th {
            background: #34495e;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 500;
        }
        
        td {
            padding: 12px;
            border-bottom: 1px solid #ecf0f1;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .amount {
            text-align: right;
            font-family: monospace;
        }
        
        .percentage {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .percentage.high {
            background: #d4edda;
            color: #155724;
        }
        
        .percentage.medium {
            background: #fff3cd;
            color: #856404;
        }
        
        .percentage.low {
            background: #f8d7da;
            color: #721c24;
        }
        
        .legend {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 10px;
            flex-wrap: wrap;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .legend-color {
            width: 20px;
            height: 20px;
            border-radius: 4px;
        }
        
        /* Filter Controls */
        .filter-section {
            background: white;
            padding: 15px;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 15px;
        }
        
        .filter-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .filter-item {
            display: flex;
            flex-direction: column;
        }
        
        .filter-item label {
            font-size: 12px;
            color: #7f8c8d;
            text-transform: uppercase;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .filter-item select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            background: white;
            cursor: pointer;
        }
        
        .filter-item select:focus {
            outline: none;
            border-color: #3498db;
        }
        
        @media (max-width: 768px) {
            .chart-grid {
                grid-template-columns: 1fr;
            }
            
            .metrics-grid {
                grid-template-columns: 1fr;
            }
            
            .filter-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>Epic EHI Billing Dashboard</h1>
            <p>Comprehensive analysis of charges, payments, and adjustments</p>
        </div>
    </div>
    
    <div class="container">
        <!-- Filter Controls -->
        <div class="filter-section">
            <h2>Filter Data</h2>
            <div class="filter-grid">
                <div class="filter-item">
                    <label for="departmentFilter">Department</label>
                    <select id="departmentFilter">
                        <option value="">All Departments</option>
                        ${filterOptions.departments.map(dept => 
                            `<option value="${dept}">${dept}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="filter-item">
                    <label for="yearFilter">Year</label>
                    <select id="yearFilter">
                        <option value="">All Years</option>
                        ${filterOptions.years.map(year => 
                            `<option value="${year}">${year}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="filter-item">
                    <label for="insuranceFilter">Insurance</label>
                    <select id="insuranceFilter">
                        <option value="">All Insurance</option>
                        ${filterOptions.insurances.map(ins => 
                            `<option value="${ins}">${ins}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="filter-item">
                    <label for="procedureFilter">Procedure</label>
                    <select id="procedureFilter">
                        <option value="">All Procedures</option>
                        ${filterOptions.procedures.map(proc => 
                            `<option value="${proc}">${proc}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
        </div>
        
        <!-- Key Metrics -->
        <div class="metrics-grid">
            <div class="metric-card">
                <h3>Total Charges</h3>
                <div class="metric-value">$${dashboardData.totalCharges.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                <div class="metric-subtitle">${billingData.statistics.encountersWithBilling} encounters</div>
            </div>
            
            <div class="metric-card">
                <h3>Total Collected</h3>
                <div class="metric-value">$${dashboardData.totalPayments.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                <div class="metric-subtitle">${((dashboardData.totalPayments / dashboardData.totalCharges) * 100).toFixed(1)}% of charges</div>
            </div>
            
            <div class="metric-card">
                <h3>Total Written Off</h3>
                <div class="metric-value">$${dashboardData.totalAdjustments.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                <div class="metric-subtitle">${((dashboardData.totalAdjustments / dashboardData.totalCharges) * 100).toFixed(1)}% of charges</div>
            </div>
            
            <div class="metric-card">
                <h3>Insurance Payments</h3>
                <div class="metric-value">$${dashboardData.totalInsurancePayments.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                <div class="metric-subtitle">${((dashboardData.totalInsurancePayments / dashboardData.totalPayments) * 100).toFixed(1)}% of payments</div>
            </div>
            
            <div class="metric-card">
                <h3>Patient Payments</h3>
                <div class="metric-value">$${dashboardData.totalPatientPayments.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                <div class="metric-subtitle">${((dashboardData.totalPatientPayments / dashboardData.totalPayments) * 100).toFixed(1)}% of payments</div>
            </div>
            
            <div class="metric-card">
                <h3>Outstanding Balance</h3>
                <div class="metric-value">$${(dashboardData.totalCharges - dashboardData.totalPayments - dashboardData.totalAdjustments).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                <div class="metric-subtitle">${(((dashboardData.totalCharges - dashboardData.totalPayments - dashboardData.totalAdjustments) / dashboardData.totalCharges) * 100).toFixed(1)}% of charges</div>
            </div>
        </div>
        
        <!-- Main Grid for Large Charts -->
        <div class="chart-grid">
            <!-- Payment Velocity Chart -->
            <div class="chart-section">
                <h2>Payment Collection Velocity</h2>
                <p style="color: #7f8c8d; margin-bottom: 10px; font-size: 12px;">Percentage of charges collected over time</p>
                <div class="chart-container small">
                    <canvas id="paymentVelocityChart"></canvas>
                </div>
            </div>
            
            <!-- Dense Payment Timeline Histogram -->
            <div class="chart-section">
                <h2>Days to First Payment Distribution</h2>
                <p style="color: #7f8c8d; margin-bottom: 10px; font-size: 12px;">
                    Daily histogram • 
                    <span style="color: #2c3e50; font-weight: 500;">Median: <span id="medianDays">-</span> days</span> • 
                    25th %ile: <span id="p25Days">-</span> days • 
                    75th %ile: <span id="p75Days">-</span> days
                </p>
                <div class="chart-container small">
                    <canvas id="paymentTimelineHistogram"></canvas>
                </div>
            </div>
            
            <!-- Monthly Trends -->
            <div class="chart-section">
                <h2>Monthly Billing Trends</h2>
                <div class="chart-container small">
                    <canvas id="monthlyTrendsChart"></canvas>
                </div>
            </div>
        </div>
        
        <!-- Chart Grid for Small Charts -->
        <div class="chart-grid">
            <!-- Payment Source Breakdown -->
            <div class="chart-section">
                <h2>Payment Sources</h2>
                <div class="chart-container small">
                    <canvas id="paymentSourceChart"></canvas>
                </div>
            </div>
            
            <!-- Collection Rate by Days Outstanding -->
            <div class="chart-section">
                <h2>Collection Rate by Age</h2>
                <div class="chart-container small">
                    <canvas id="collectionRateChart"></canvas>
                </div>
            </div>
            
            <!-- Denial Rate Trends -->
            <div class="chart-section">
                <h2>Payment vs Adjustment Ratio</h2>
                <div class="chart-container small">
                    <canvas id="paymentAdjustmentChart"></canvas>
                </div>
            </div>
        </div>
        
        <!-- Department Performance -->
        <div class="chart-section">
            <h2>Department Performance</h2>
            <table>
                <thead>
                    <tr>
                        <th>Department</th>
                        <th class="amount">Charges</th>
                        <th class="amount">Collected</th>
                        <th class="amount">Written Off</th>
                        <th>Collection Rate</th>
                        <th>Avg Days to Payment</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(dashboardData.departmentStats)
                        .sort((a, b) => b[1].charges - a[1].charges)
                        .slice(0, 10)
                        .map(([dept, stats]) => {
                            const collectionRate = (stats.payments / stats.charges) * 100;
                            const rateClass = collectionRate >= 60 ? 'high' : collectionRate >= 40 ? 'medium' : 'low';
                            
                            return `
                                <tr>
                                    <td>${dept}</td>
                                    <td class="amount">$${stats.charges.toFixed(2)}</td>
                                    <td class="amount">$${stats.payments.toFixed(2)}</td>
                                    <td class="amount">$${stats.adjustments.toFixed(2)}</td>
                                    <td><span class="percentage ${rateClass}">${collectionRate.toFixed(1)}%</span></td>
                                    <td>${stats.avgDaysToPayment !== null ? stats.avgDaysToPayment + ' days' : 'N/A'}</td>
                                </tr>
                            `;
                        }).join('')}
                </tbody>
            </table>
        </div>
        
        <!-- Insurance Performance -->
        <div class="chart-section">
            <h2>Insurance Company Performance</h2>
            <table>
                <thead>
                    <tr>
                        <th>Insurance</th>
                        <th class="amount">Total Paid</th>
                        <th>Payment Count</th>
                        <th>Avg Days to Payment</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(dashboardData.insuranceStats)
                        .sort((a, b) => b[1].totalPaid - a[1].totalPaid)
                        .map(([insurance, stats]) => `
                            <tr>
                                <td>${insurance}</td>
                                <td class="amount">$${stats.totalPaid.toFixed(2)}</td>
                                <td>${stats.paymentCount}</td>
                                <td>${stats.avgDaysToPayment !== null ? stats.avgDaysToPayment + ' days' : 'N/A'}</td>
                            </tr>
                        `).join('')}
                </tbody>
            </table>
        </div>
        
        <!-- Top Procedures -->
        <div class="chart-section">
            <h2>Top Procedures by Volume</h2>
            <table>
                <thead>
                    <tr>
                        <th>Procedure</th>
                        <th>Count</th>
                        <th class="amount">Avg Charge</th>
                        <th class="amount">Total Charged</th>
                        <th class="amount">Total Collected</th>
                        <th>Collection Rate</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(dashboardData.procedureStats)
                        .sort((a, b) => b[1].count - a[1].count)
                        .slice(0, 15)
                        .map(([proc, stats]) => {
                            const collectionRate = (stats.totalPaid / stats.totalCharged) * 100;
                            const rateClass = collectionRate >= 60 ? 'high' : collectionRate >= 40 ? 'medium' : 'low';
                            
                            return `
                                <tr>
                                    <td>${proc}</td>
                                    <td>${stats.count}</td>
                                    <td class="amount">$${stats.avgCharge.toFixed(2)}</td>
                                    <td class="amount">$${stats.totalCharged.toFixed(2)}</td>
                                    <td class="amount">$${stats.totalPaid.toFixed(2)}</td>
                                    <td><span class="percentage ${rateClass}">${collectionRate.toFixed(1)}%</span></td>
                                </tr>
                            `;
                        }).join('')}
                </tbody>
            </table>
        </div>
        
        <!-- Write-off Reasons -->
        <div class="chart-section">
            <h2>Adjustment Reasons</h2>
            <table>
                <thead>
                    <tr>
                        <th>Reason</th>
                        <th>Count</th>
                        <th class="amount">Total Amount</th>
                        <th class="amount">Average</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(dashboardData.writeOffReasons)
                        .sort((a, b) => b[1].totalAmount - a[1].totalAmount)
                        .map(([reason, stats]) => `
                            <tr>
                                <td>${reason}</td>
                                <td>${stats.count}</td>
                                <td class="amount">$${stats.totalAmount.toFixed(2)}</td>
                                <td class="amount">$${(stats.totalAmount / stats.count).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                </tbody>
            </table>
        </div>
    </div>
    
    <script>
        // Chart.js configuration
        Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        
        // Store original data for filtering
        const originalData = {
            billingData: ${JSON.stringify(billingData)},
            dashboardData: ${JSON.stringify(dashboardData)},
            paymentVelocityData: ${JSON.stringify(paymentVelocityData)}
        };
        
        // Extract all data from originalData first
        const dashboardData = originalData.dashboardData;
        const billingData = originalData.billingData;
        const paymentVelocityData = originalData.paymentVelocityData;
        
        // Payment Velocity Chart
        const paymentVelocityCtx = document.getElementById('paymentVelocityChart').getContext('2d');
        const paymentVelocityChart = new Chart(paymentVelocityCtx, {
            type: 'line',
            data: {
                labels: paymentVelocityData.filter((_, i) => i % 5 === 0).map(d => d.day + ' days'),
                datasets: [{
                    label: 'Percent of Charges Collected',
                    data: paymentVelocityData.filter((_, i) => i % 5 === 0).map(d => d.percentOfChargesPaid),
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.1,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const dayIndex = context.dataIndex * 5;
                                const data = paymentVelocityData[dayIndex];
                                return [
                                    'Collected: ' + context.parsed.y.toFixed(1) + '%',
                                    'Charges paid: ' + data.countPaid + ' of ' + data.totalCount
                                ];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Percentage Collected'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Days Since Service'
                        }
                    }
                }
            }
        });
        
        // Calculate detailed payment timing data
        const paymentDays = dashboardData.paymentTimelines
            .filter(t => t.daysToFirstPayment !== null)
            .map(t => t.daysToFirstPayment)
            .sort((a, b) => a - b);
        
        // Calculate percentiles
        const percentile = (arr, p) => {
            if (arr.length === 0) return 0;
            const index = Math.ceil(arr.length * p) - 1;
            return arr[index];
        };
        
        const p25 = percentile(paymentDays, 0.25);
        const p50 = percentile(paymentDays, 0.50);
        const p75 = percentile(paymentDays, 0.75);
        const p90 = percentile(paymentDays, 0.90);
        
        // Update percentile displays
        document.getElementById('medianDays').textContent = p50;
        document.getElementById('p25Days').textContent = p25;
        document.getElementById('p75Days').textContent = p75;
        
        // Create histogram data (daily buckets for first 120 days)
        const histogramData = Array(120).fill(0);
        const histogramAmounts = Array(120).fill(0);
        
        dashboardData.paymentTimelines.forEach(timeline => {
            if (timeline.daysToFirstPayment !== null && timeline.daysToFirstPayment < 120) {
                const day = Math.floor(timeline.daysToFirstPayment);
                histogramData[day]++;
                histogramAmounts[day] += timeline.chargeAmount;
            }
        });
        
        // Create dense histogram
        const paymentHistogramCtx = document.getElementById('paymentTimelineHistogram').getContext('2d');
        const paymentHistogramChart = new Chart(paymentHistogramCtx, {
            type: 'bar',
            data: {
                labels: Array.from({length: 120}, (_, i) => i),
                datasets: [{
                    label: 'Number of Payments',
                    data: histogramData,
                    backgroundColor: (context) => {
                        const day = context.dataIndex;
                        if (day <= 7) return '#27ae60';
                        if (day <= 30) return '#3498db';
                        if (day <= 60) return '#f39c12';
                        return '#e74c3c';
                    },
                    borderWidth: 0,
                    barPercentage: 1.0,
                    categoryPercentage: 1.0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                const day = context[0].dataIndex;
                                return 'Day ' + day;
                            },
                            label: function(context) {
                                const count = context.parsed.y;
                                const amount = histogramAmounts[context.dataIndex];
                                return [
                                    count + ' payments',
                                    'Total: $' + amount.toFixed(2)
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Days to First Payment'
                        },
                        ticks: {
                            callback: function(value) {
                                if (value % 10 === 0) return value;
                                return '';
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Charges'
                        }
                    }
                }
            }
        });
        
        // Payment Source Chart
        const paymentSourceCtx = document.getElementById('paymentSourceChart').getContext('2d');
        const paymentSourceChart = new Chart(paymentSourceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Insurance', 'Patient', 'Unknown'],
                datasets: [{
                    data: [
                        ${dashboardData.paymentSources.insurance.toFixed(2)},
                        ${dashboardData.paymentSources.patient.toFixed(2)},
                        ${dashboardData.paymentSources.unknown.toFixed(2)}
                    ],
                    backgroundColor: ['#3498db', '#27ae60', '#95a5a6'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = '$' + context.parsed.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                                const percentage = ((context.parsed / ${dashboardData.totalPayments}) * 100).toFixed(1);
                                return label + ': ' + value + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
        
        // Monthly Trends Chart
        const monthlyLabels = ${JSON.stringify(Object.keys(dashboardData.monthlyData).sort())};
        const monthlyData = ${JSON.stringify(dashboardData.monthlyData)};
        
        const monthlyTrendsCtx = document.getElementById('monthlyTrendsChart').getContext('2d');
        const monthlyTrendsChart = new Chart(monthlyTrendsCtx, {
            type: 'line',
            data: {
                labels: monthlyLabels,
                datasets: [
                    {
                        label: 'Charges',
                        data: monthlyLabels.map(month => monthlyData[month]?.charges || 0),
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.1,
                        borderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Payments',
                        data: monthlyLabels.map(month => monthlyData[month]?.payments || 0),
                        borderColor: '#27ae60',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        tension: 0.1,
                        borderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Adjustments',
                        data: monthlyLabels.map(month => monthlyData[month]?.adjustments || 0),
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        tension: 0.1,
                        borderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += '$' + context.parsed.y.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
        
        
        // Collection Rate by Age Chart
        const collectionRateData = {
            '0-30 days': { charges: 0, collected: 0 },
            '31-60 days': { charges: 0, collected: 0 },
            '61-90 days': { charges: 0, collected: 0 },
            '91-120 days': { charges: 0, collected: 0 },
            '120+ days': { charges: 0, collected: 0 }
        };
        
        dashboardData.paymentTimelines.forEach(timeline => {
            const days = timeline.daysToFirstPayment || 999;
            const bucket = days <= 30 ? '0-30 days' :
                          days <= 60 ? '31-60 days' :
                          days <= 90 ? '61-90 days' :
                          days <= 120 ? '91-120 days' : '120+ days';
            
            collectionRateData[bucket].charges += timeline.chargeAmount;
            collectionRateData[bucket].collected += timeline.chargeAmount * timeline.percentPaid / 100;
        });
        
        const collectionRateCtx = document.getElementById('collectionRateChart').getContext('2d');
        const collectionRateChart = new Chart(collectionRateCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(collectionRateData),
                datasets: [{
                    label: 'Collection Rate',
                    data: Object.values(collectionRateData).map(d => 
                        d.charges > 0 ? (d.collected / d.charges) * 100 : 0
                    ),
                    backgroundColor: [
                        '#27ae60',
                        '#3498db',
                        '#f39c12',
                        '#e74c3c',
                        '#c0392b'
                    ],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const bucket = collectionRateData[context.label];
                                return [
                                    'Collection Rate: ' + context.parsed.y.toFixed(1) + '%',
                                    'Total Charges: $' + bucket.charges.toFixed(2),
                                    'Collected: $' + bucket.collected.toFixed(2)
                                ];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
        
        // Payment vs Adjustment Ratio Chart
        const paymentAdjustmentCtx = document.getElementById('paymentAdjustmentChart').getContext('2d');
        const paymentAdjustmentChart = new Chart(paymentAdjustmentCtx, {
            type: 'bar',
            data: {
                labels: ['Payments', 'Adjustments', 'Outstanding'],
                datasets: [{
                    label: 'Amount',
                    data: [
                        dashboardData.totalPayments,
                        dashboardData.totalAdjustments,
                        dashboardData.totalCharges - dashboardData.totalPayments - dashboardData.totalAdjustments
                    ],
                    backgroundColor: ['#27ae60', '#e74c3c', '#f39c12'],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                const percent = (value / dashboardData.totalCharges * 100).toFixed(1);
                                return [
                                    context.label + ': $' + value.toFixed(2),
                                    percent + '% of total charges'
                                ];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
        
        // Filter functionality
        const filters = {
            department: document.getElementById('departmentFilter'),
            year: document.getElementById('yearFilter'),
            insurance: document.getElementById('insuranceFilter'),
            procedure: document.getElementById('procedureFilter')
        };
        
        function applyFilters() {
            const filterValues = {
                department: filters.department.value,
                year: filters.year.value,
                insurance: filters.insurance.value,
                procedure: filters.procedure.value
            };
            
            console.log('Filters applied:', filterValues);
            
            // Filter encounters based on selections
            let filteredEncounters = originalData.billingData.encounters.filter(enc => {
                if (!enc.billing.summary.hasAnyBilling) return false;
                
                // Department filter
                if (filterValues.department && enc.clinical.department !== filterValues.department) {
                    return false;
                }
                
                // Year filter
                if (filterValues.year) {
                    const encYear = new Date(enc.clinical.date).getFullYear().toString();
                    if (encYear !== filterValues.year) return false;
                }
                
                // Insurance filter
                if (filterValues.insurance) {
                    const hasInsurance = enc.billing.payments.some(p => 
                        (p.insuranceName === filterValues.insurance || p.payorName === filterValues.insurance)
                    );
                    if (!hasInsurance) return false;
                }
                
                // Procedure filter
                if (filterValues.procedure) {
                    const hasProcedure = enc.billing.charges.some(c => 
                        c.procedureName === filterValues.procedure
                    );
                    if (!hasProcedure) return false;
                }
                
                return true;
            });
            
            // Recalculate all metrics
            const newDashboardData = recalculateMetrics(filteredEncounters);
            
            // Update all displays
            updateMetricsDisplay(newDashboardData);
            updateCharts(newDashboardData);
            updateTables(newDashboardData);
        }
        
        // Helper function to recalculate metrics
        function recalculateMetrics(encounters) {
            const data = {
                totalCharges: 0,
                totalPayments: 0,
                totalAdjustments: 0,
                totalPatientPayments: 0,
                totalInsurancePayments: 0,
                paymentTimelines: [],
                paymentSources: { insurance: 0, patient: 0, unknown: 0 },
                monthlyData: {},
                departmentStats: {},
                procedureStats: {},
                paymentSpeedBuckets: {
                    'Same Day': 0, '1-7 days': 0, '8-30 days': 0,
                    '31-60 days': 0, '61-90 days': 0, '90+ days': 0, 'Unpaid': 0
                },
                insuranceStats: {},
                writeOffReasons: {}
            };
            
            // Process each encounter (similar to original processing)
            encounters.forEach(enc => {
                const encounterDate = new Date(enc.clinical.date);
                const monthKey = encounterDate.getFullYear() + '-' + String(encounterDate.getMonth() + 1).padStart(2, '0');
                
                if (!data.monthlyData[monthKey]) {
                    data.monthlyData[monthKey] = {
                        charges: 0, payments: 0, adjustments: 0,
                        patientPayments: 0, insurancePayments: 0, encounters: 0
                    };
                }
                data.monthlyData[monthKey].encounters++;
                
                // Process charges
                enc.billing.charges.forEach(charge => {
                    data.totalCharges += charge.amount;
                    data.monthlyData[monthKey].charges += charge.amount;
                    
                    // Department stats
                    const dept = enc.clinical.department;
                    if (!data.departmentStats[dept]) {
                        data.departmentStats[dept] = {
                            charges: 0, payments: 0, adjustments: 0,
                            encounters: 0, avgDaysToPayment: []
                        };
                    }
                    data.departmentStats[dept].charges += charge.amount;
                    data.departmentStats[dept].encounters++;
                    
                    // Procedure stats
                    const procName = charge.procedureName || 'Unknown Procedure';
                    if (!data.procedureStats[procName]) {
                        data.procedureStats[procName] = {
                            count: 0,
                            totalCharged: 0,
                            totalPaid: 0,
                            totalAdjusted: 0,
                            avgCharge: 0
                        };
                    }
                    data.procedureStats[procName].count++;
                    data.procedureStats[procName].totalCharged += charge.amount;
                    
                    // Track payment timeline
                    let firstPaymentDays = null;
                    let totalPaidOnCharge = 0;
                    let totalAdjustedOnCharge = 0;
                    
                    charge.matches.forEach(match => {
                        const matchDate = new Date(match.matchDate);
                        const daysDiff = Math.floor((matchDate - encounterDate) / (1000 * 60 * 60 * 24));
                        const isPayment = enc.billing.payments.some(p => p.txId === match.matchedTxId);
                        
                        if (isPayment && firstPaymentDays === null) {
                            firstPaymentDays = daysDiff;
                        }
                        
                        if (isPayment) {
                            totalPaidOnCharge += match.matchAmount;
                        } else {
                            totalAdjustedOnCharge += match.matchAmount;
                        }
                    });
                    
                    // Update procedure stats with paid/adjusted amounts
                    data.procedureStats[procName].totalPaid += totalPaidOnCharge;
                    data.procedureStats[procName].totalAdjusted += totalAdjustedOnCharge;
                    
                    if (firstPaymentDays !== null) {
                        data.paymentTimelines.push({
                            chargeAmount: charge.amount,
                            daysToFirstPayment: firstPaymentDays,
                            percentPaid: (totalPaidOnCharge / charge.amount) * 100,
                            percentAdjusted: (totalAdjustedOnCharge / charge.amount) * 100
                        });
                        
                        if (dept && firstPaymentDays !== null) {
                            data.departmentStats[dept].avgDaysToPayment.push(firstPaymentDays);
                        }
                    }
                });
                
                // Process payments and adjustments
                enc.billing.payments.forEach(payment => {
                    data.totalPayments += payment.amount;
                    data.monthlyData[monthKey].payments += payment.amount;
                    
                    const dept = enc.clinical.department;
                    if (data.departmentStats[dept]) {
                        data.departmentStats[dept].payments += payment.amount;
                    }
                    
                    if (payment.isPatientPayment) {
                        data.totalPatientPayments += payment.amount;
                        data.paymentSources.patient += payment.amount;
                    } else if (payment.insuranceName || payment.payorName) {
                        data.totalInsurancePayments += payment.amount;
                        data.paymentSources.insurance += payment.amount;
                        
                        // Track insurance performance
                        const insName = payment.insuranceName || payment.payorName || 'Unknown Insurance';
                        if (!data.insuranceStats[insName]) {
                            data.insuranceStats[insName] = {
                                totalPaid: 0,
                                totalCharges: 0,
                                paymentCount: 0,
                                avgDaysToPayment: []
                            };
                        }
                        data.insuranceStats[insName].totalPaid += payment.amount;
                        data.insuranceStats[insName].paymentCount++;
                        
                        // Calculate days to payment
                        const serviceDate = new Date(payment.serviceDate);
                        const postDate = new Date(payment.postDate);
                        const daysDiff = Math.floor((postDate - serviceDate) / (1000 * 60 * 60 * 24));
                        data.insuranceStats[insName].avgDaysToPayment.push(daysDiff);
                    } else {
                        data.paymentSources.unknown += payment.amount;
                    }
                });
                
                enc.billing.adjustments.forEach(adjustment => {
                    data.totalAdjustments += adjustment.amount;
                    data.monthlyData[monthKey].adjustments += adjustment.amount;
                    
                    const dept = enc.clinical.department;
                    if (data.departmentStats[dept]) {
                        data.departmentStats[dept].adjustments += adjustment.amount;
                    }
                    
                    // Track write-off reasons
                    const reason = adjustment.adjustmentReason || 'Unspecified';
                    if (!data.writeOffReasons[reason]) {
                        data.writeOffReasons[reason] = {
                            count: 0,
                            totalAmount: 0
                        };
                    }
                    data.writeOffReasons[reason].count++;
                    data.writeOffReasons[reason].totalAmount += adjustment.amount;
                });
            });
            
            // Calculate averages
            Object.values(data.departmentStats).forEach(dept => {
                if (dept.avgDaysToPayment.length > 0) {
                    const sum = dept.avgDaysToPayment.reduce((a, b) => a + b, 0);
                    dept.avgDaysToPayment = Math.round(sum / dept.avgDaysToPayment.length);
                } else {
                    dept.avgDaysToPayment = null;
                }
            });
            
            Object.values(data.insuranceStats).forEach(ins => {
                if (ins.avgDaysToPayment.length > 0) {
                    const sum = ins.avgDaysToPayment.reduce((a, b) => a + b, 0);
                    ins.avgDaysToPayment = Math.round(sum / ins.avgDaysToPayment.length);
                } else {
                    ins.avgDaysToPayment = null;
                }
            });
            
            Object.values(data.procedureStats).forEach(proc => {
                if (proc.count > 0) {
                    proc.avgCharge = proc.totalCharged / proc.count;
                }
            });
            
            return data;
        }
        
        // Function to update metrics display
        function updateMetricsDisplay(data) {
            // Update metric cards
            document.querySelector('.metric-value').textContent = 
                '$' + data.totalCharges.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            
            const metricCards = document.querySelectorAll('.metric-card');
            metricCards[1].querySelector('.metric-value').textContent = 
                '$' + data.totalPayments.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            metricCards[1].querySelector('.metric-subtitle').textContent = 
                ((data.totalPayments / data.totalCharges) * 100).toFixed(1) + '% of charges';
            
            metricCards[2].querySelector('.metric-value').textContent = 
                '$' + data.totalAdjustments.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            metricCards[2].querySelector('.metric-subtitle').textContent = 
                ((data.totalAdjustments / data.totalCharges) * 100).toFixed(1) + '% of charges';
                
            metricCards[3].querySelector('.metric-value').textContent = 
                '$' + data.totalInsurancePayments.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            metricCards[3].querySelector('.metric-subtitle').textContent = 
                ((data.totalInsurancePayments / data.totalPayments) * 100).toFixed(1) + '% of payments';
                
            metricCards[4].querySelector('.metric-value').textContent = 
                '$' + data.totalPatientPayments.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            metricCards[4].querySelector('.metric-subtitle').textContent = 
                ((data.totalPatientPayments / data.totalPayments) * 100).toFixed(1) + '% of payments';
        }
        
        // Store chart instances globally
        const charts = {
            paymentVelocity: paymentVelocityChart,
            paymentHistogram: paymentHistogramChart,
            paymentSource: paymentSourceChart,
            monthlyTrends: monthlyTrendsChart,
            collectionRate: collectionRateChart,
            paymentAdjustment: paymentAdjustmentChart
        };
        
        // Function to update charts
        function updateCharts(data) {
            // Recalculate payment velocity data
            const newPaymentVelocityData = [];
            for (let day = 0; day <= 180; day++) {
                const chargesWithPaymentByDay = data.paymentTimelines.filter(t => 
                    t.daysToFirstPayment !== null && t.daysToFirstPayment <= day
                );
                const totalChargeAmount = data.paymentTimelines.reduce((sum, t) => sum + t.chargeAmount, 0);
                const paidAmount = chargesWithPaymentByDay.reduce((sum, t) => sum + (t.chargeAmount * t.percentPaid / 100), 0);
                
                newPaymentVelocityData.push({
                    day: day,
                    percentOfChargesPaid: totalChargeAmount > 0 ? (paidAmount / totalChargeAmount) * 100 : 0,
                    countPaid: chargesWithPaymentByDay.length,
                    totalCount: data.paymentTimelines.length
                });
            }
            
            // Update payment velocity chart
            charts.paymentVelocity.data.datasets[0].data = newPaymentVelocityData.filter((_, i) => i % 5 === 0).map(d => d.percentOfChargesPaid);
            charts.paymentVelocity.update();
            
            // Recalculate payment timeline buckets
            const newPaymentSpeedBuckets = {
                'Same Day': 0, '1-7 days': 0, '8-30 days': 0,
                '31-60 days': 0, '61-90 days': 0, '90+ days': 0, 'Unpaid': 0
            };
            
            data.paymentTimelines.forEach(timeline => {
                const days = timeline.daysToFirstPayment;
                if (days === null) {
                    newPaymentSpeedBuckets['Unpaid']++;
                } else if (days === 0) {
                    newPaymentSpeedBuckets['Same Day']++;
                } else if (days <= 7) {
                    newPaymentSpeedBuckets['1-7 days']++;
                } else if (days <= 30) {
                    newPaymentSpeedBuckets['8-30 days']++;
                } else if (days <= 60) {
                    newPaymentSpeedBuckets['31-60 days']++;
                } else if (days <= 90) {
                    newPaymentSpeedBuckets['61-90 days']++;
                } else {
                    newPaymentSpeedBuckets['90+ days']++;
                }
            });
            
            // Recalculate histogram data
            const newHistogramData = Array(120).fill(0);
            const newHistogramAmounts = Array(120).fill(0);
            
            data.paymentTimelines.forEach(timeline => {
                if (timeline.daysToFirstPayment !== null && timeline.daysToFirstPayment < 120) {
                    const day = Math.floor(timeline.daysToFirstPayment);
                    newHistogramData[day]++;
                    newHistogramAmounts[day] += timeline.chargeAmount;
                }
            });
            
            // Update payment histogram
            charts.paymentHistogram.data.datasets[0].data = newHistogramData;
            charts.paymentHistogram.update();
            
            // Recalculate collection rate by age
            const newCollectionRateData = {
                '0-30 days': { charges: 0, collected: 0 },
                '31-60 days': { charges: 0, collected: 0 },
                '61-90 days': { charges: 0, collected: 0 },
                '91-120 days': { charges: 0, collected: 0 },
                '120+ days': { charges: 0, collected: 0 }
            };
            
            data.paymentTimelines.forEach(timeline => {
                const days = timeline.daysToFirstPayment || 999;
                const bucket = days <= 30 ? '0-30 days' :
                              days <= 60 ? '31-60 days' :
                              days <= 90 ? '61-90 days' :
                              days <= 120 ? '91-120 days' : '120+ days';
                
                newCollectionRateData[bucket].charges += timeline.chargeAmount;
                newCollectionRateData[bucket].collected += timeline.chargeAmount * timeline.percentPaid / 100;
            });
            
            // Update collection rate chart
            charts.collectionRate.data.datasets[0].data = Object.values(newCollectionRateData).map(d => 
                d.charges > 0 ? (d.collected / d.charges) * 100 : 0
            );
            charts.collectionRate.update();
            
            // Update payment source chart
            charts.paymentSource.data.datasets[0].data = [
                data.paymentSources.insurance,
                data.paymentSources.patient,
                data.paymentSources.unknown
            ];
            charts.paymentSource.update();
            
            // Update monthly trends
            const monthlyLabels = Object.keys(data.monthlyData).sort();
            charts.monthlyTrends.data.labels = monthlyLabels;
            charts.monthlyTrends.data.datasets[0].data = monthlyLabels.map(m => data.monthlyData[m]?.charges || 0);
            charts.monthlyTrends.data.datasets[1].data = monthlyLabels.map(m => data.monthlyData[m]?.payments || 0);
            charts.monthlyTrends.data.datasets[2].data = monthlyLabels.map(m => data.monthlyData[m]?.adjustments || 0);
            charts.monthlyTrends.update();
            
            // Update payment/adjustment ratio
            charts.paymentAdjustment.data.datasets[0].data = [
                data.totalPayments,
                data.totalAdjustments,
                data.totalCharges - data.totalPayments - data.totalAdjustments
            ];
            charts.paymentAdjustment.update();
        }
        
        // Function to update tables
        function updateTables(data) {
            // Since tables are server-rendered, we need to rebuild them
            // This is a simplified approach - in production, you'd use a proper table library
            
            // For now, just log that tables need updating
            console.log('Tables would be updated with new data:', {
                departments: Object.keys(data.departmentStats).length,
                procedures: Object.keys(data.procedureStats).length,
                insurances: Object.keys(data.insuranceStats).length,
                writeOffReasons: Object.keys(data.writeOffReasons).length
            });
            
            // In a full implementation, you would:
            // 1. Clear existing table bodies
            // 2. Re-render rows with filtered data
            // 3. Update sorting and pagination
        }
        
        // Add event listeners to filters
        Object.values(filters).forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });
    </script>
</body>
</html>`;

// Write dashboard HTML
const dashboardPath = path.join(__dirname, '..', 'billing-dashboard.html');
fs.writeFileSync(dashboardPath, html);

console.log(`\nBilling dashboard generated: ${dashboardPath}`);
console.log('\nDashboard includes:');
console.log('- Faceting controls for department, year, insurance, and procedure');
console.log('- Payment collection velocity chart (% collected over time)');
console.log('- Granular time to first payment distribution');
console.log('- Collection rate by age buckets');
console.log('- Payment vs adjustment ratio visualization');
console.log('- Payment source breakdown');
console.log('- Monthly billing trends');
console.log('- Department performance analysis');
console.log('- Insurance company payment speeds');
console.log('- Top procedures by volume and collection rate');
console.log('- Adjustment reason analysis');