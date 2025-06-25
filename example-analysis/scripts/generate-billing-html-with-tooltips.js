import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the generated JSON data
const jsonPath = path.join(__dirname, '..', 'complete-billing-data.json');
const billingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const summaryPath = path.join(__dirname, '..', 'billing-summary.json');
const summaryData = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

console.log('Generating comprehensive HTML report with tooltips...');

// Helper function to create tooltip HTML
function createTooltip(content, sourceInfo) {
    const tooltipText = `Source: ${sourceInfo.sourceTable || 'Unknown'}
${sourceInfo.joinPath || sourceInfo.recordLocation || 'Direct lookup'}`;
    
    return `<span class="has-tooltip" title="${tooltipText.replace(/"/g, '&quot;')}">${content}</span>`;
}

// Helper to format currency
function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

// Helper to format date
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return dateStr.split(' ')[0];
}

// Generate HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete Epic EHI Billing Analysis</title>
    <style>
        :root {
            --primary-color: #2c3e50;
            --secondary-color: #3498db;
            --success-color: #27ae60;
            --warning-color: #f39c12;
            --danger-color: #e74c3c;
            --info-color: #16a085;
            --light-bg: #ecf0f1;
            --white: #ffffff;
            --text-dark: #2c3e50;
            --text-light: #7f8c8d;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text-dark);
            background-color: #f5f6fa;
        }
        
        .container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 20px;
        }
        
        h1 {
            color: var(--primary-color);
            margin-bottom: 10px;
            font-size: 2.5rem;
        }
        
        .subtitle {
            color: var(--text-light);
            margin-bottom: 30px;
        }
        
        /* Tooltip Styles */
        .has-tooltip {
            position: relative;
            cursor: help;
            border-bottom: 1px dotted var(--secondary-color);
            color: var(--secondary-color);
        }
        
        .has-tooltip:hover::after {
            content: attr(title);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(44, 62, 80, 0.95);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            white-space: pre-line;
            z-index: 1000;
            min-width: 200px;
            max-width: 400px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .has-tooltip:hover::before {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 5px solid transparent;
            border-top-color: rgba(44, 62, 80, 0.95);
            margin-bottom: -10px;
            z-index: 1001;
        }
        
        /* Summary Cards */
        .summary-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .summary-card {
            background: var(--white);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-left: 4px solid var(--secondary-color);
        }
        
        .summary-card.warning {
            border-left-color: var(--warning-color);
        }
        
        .summary-card.success {
            border-left-color: var(--success-color);
        }
        
        .summary-card h3 {
            font-size: 14px;
            color: var(--text-light);
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .summary-value {
            font-size: 28px;
            font-weight: bold;
            color: var(--primary-color);
        }
        
        .summary-detail {
            font-size: 12px;
            color: var(--text-light);
            margin-top: 5px;
        }
        
        /* Issues Section */
        .issues-section {
            background: var(--white);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        
        .issues-section h2 {
            color: var(--primary-color);
            margin-bottom: 15px;
            font-size: 1.5rem;
        }
        
        .issue-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid var(--light-bg);
        }
        
        .issue-item:last-child {
            border-bottom: none;
        }
        
        .issue-name {
            font-weight: 500;
        }
        
        .issue-count {
            background: var(--danger-color);
            color: white;
            padding: 2px 10px;
            border-radius: 12px;
            font-size: 14px;
        }
        
        /* Filters */
        .filters-section {
            background: var(--white);
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            align-items: center;
        }
        
        .filter-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .filter-group label {
            font-weight: 500;
            color: var(--text-dark);
        }
        
        .filter-group select,
        .filter-group input {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        
        /* Encounter Cards */
        .encounter-card {
            background: var(--white);
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            overflow: hidden;
            transition: box-shadow 0.3s;
        }
        
        .encounter-card.direct-csn-link {
            border: 2px solid var(--success-color);
        }
        
        .encounter-card:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .encounter-header {
            background: #f8f9fa;
            padding: 20px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .encounter-header:hover {
            background: #e9ecef;
        }
        
        .encounter-info h3 {
            margin-bottom: 5px;
            color: var(--primary-color);
        }
        
        .encounter-meta {
            color: var(--text-light);
            font-size: 14px;
        }
        
        .encounter-badges {
            display: flex;
            gap: 8px;
            margin-top: 8px;
        }
        
        .badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .badge.direct-csn {
            background: var(--success-color);
            color: white;
        }
        
        .badge.indirect-match {
            background: var(--warning-color);
            color: white;
        }
        
        .badge.date-match {
            background: var(--warning-color);
            color: white;
        }
        
        .badge.no-billing {
            background: var(--light-bg);
            color: var(--text-dark);
        }
        
        .encounter-summary {
            text-align: right;
        }
        
        .balance-amount {
            font-size: 24px;
            font-weight: bold;
        }
        
        .balance-positive {
            color: var(--success-color);
        }
        
        .balance-negative {
            color: var(--danger-color);
        }
        
        .expand-icon {
            transition: transform 0.3s;
            margin-left: 10px;
        }
        
        .encounter-card.expanded .expand-icon {
            transform: rotate(90deg);
        }
        
        .encounter-content {
            display: none;
            padding: 20px;
            border-top: 1px solid var(--light-bg);
        }
        
        .encounter-card.expanded .encounter-content {
            display: block;
        }
        
        /* Sections within encounter */
        .content-section {
            margin-bottom: 30px;
        }
        
        .content-section h4 {
            color: var(--primary-color);
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--light-bg);
        }
        
        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        th {
            background: var(--primary-color);
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 500;
            font-size: 14px;
        }
        
        td {
            padding: 12px;
            border-bottom: 1px solid var(--light-bg);
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .amount {
            text-align: right;
            font-family: 'Consolas', 'Monaco', monospace;
        }
        
        .positive {
            color: var(--success-color);
        }
        
        .negative {
            color: var(--danger-color);
        }
        
        /* Transaction Details */
        .transaction-detail {
            background: #f8f9fa;
            border-left: 3px solid var(--info-color);
            padding: 15px;
            margin: 10px 0;
            border-radius: 4px;
        }
        
        .transaction-detail h5 {
            color: var(--info-color);
            margin-bottom: 10px;
        }
        
        .detail-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .detail-item {
            display: flex;
            flex-direction: column;
        }
        
        .detail-label {
            font-size: 12px;
            color: var(--text-light);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .detail-value {
            font-weight: 500;
            margin-top: 2px;
        }
        
        /* Action History */
        .action-history {
            margin-top: 15px;
        }
        
        .action-item {
            background: white;
            border: 1px solid var(--light-bg);
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 4px;
        }
        
        .action-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        
        .action-type {
            font-weight: 500;
            color: var(--primary-color);
        }
        
        .action-date {
            color: var(--text-light);
            font-size: 14px;
        }
        
        .remit-code {
            background: var(--light-bg);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-family: monospace;
            margin-top: 5px;
            display: inline-block;
        }
        
        /* Info boxes */
        .info-box {
            background: #e3f2fd;
            border-left: 4px solid var(--info-color);
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
        
        .info-box.warning {
            background: #fff3cd;
            border-left-color: var(--warning-color);
        }
        
        .info-box.error {
            background: #ffebee;
            border-left-color: var(--danger-color);
        }
        
        /* Legend */
        .legend {
            background: var(--white);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-top: 30px;
        }
        
        .legend h3 {
            color: var(--primary-color);
            margin-bottom: 15px;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .legend-color {
            width: 20px;
            height: 20px;
            border-radius: 4px;
            margin-right: 10px;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .summary-section {
                grid-template-columns: 1fr;
            }
            
            .encounter-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .encounter-summary {
                text-align: left;
                margin-top: 10px;
            }
            
            table {
                font-size: 14px;
            }
            
            th, td {
                padding: 8px;
            }
        }
        
        /* Print styles */
        @media print {
            .filters-section {
                display: none;
            }
            
            .encounter-card {
                page-break-inside: avoid;
            }
            
            .encounter-content {
                display: block !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Complete Epic EHI Billing Analysis</h1>
        <p class="subtitle">Generated: ${new Date().toLocaleDateString()} | Data Source: Epic EHI Export</p>
        
        <!-- Summary Section -->
        <div class="summary-section">
            <div class="summary-card">
                <h3>Total Encounters</h3>
                <div class="summary-value">${summaryData.stats.encountersWithData}</div>
                <div class="summary-detail">of ${summaryData.stats.totalEncounters} processed</div>
            </div>
            
            <div class="summary-card success">
                <h3>Total Charges</h3>
                <div class="summary-value">${formatCurrency(summaryData.stats.totalCharges)}</div>
                <div class="summary-detail">${summaryData.stats.encountersWithBilling} encounters with billing</div>
            </div>
            
            <div class="summary-card">
                <h3>Total Payments</h3>
                <div class="summary-value">${formatCurrency(summaryData.stats.totalPayments)}</div>
                <div class="summary-detail">${(summaryData.stats.totalPayments / summaryData.stats.totalCharges * 100).toFixed(1)}% of charges</div>
            </div>
            
            <div class="summary-card">
                <h3>Total Adjustments</h3>
                <div class="summary-value">${formatCurrency(summaryData.stats.totalAdjustments)}</div>
                <div class="summary-detail">${(summaryData.stats.totalAdjustments / summaryData.stats.totalCharges * 100).toFixed(1)}% of charges</div>
            </div>
            
            <div class="summary-card warning">
                <h3>Outstanding Balance</h3>
                <div class="summary-value">${formatCurrency(summaryData.stats.totalCharges - summaryData.stats.totalPayments - summaryData.stats.totalAdjustments)}</div>
                <div class="summary-detail">Calculated from transactions</div>
            </div>
            
            <div class="summary-card">
                <h3>Direct CSN Linkage</h3>
                <div class="summary-value">${summaryData.stats.encountersWithDirectCSNLink}</div>
                <div class="summary-detail">via ORDER_PROC table</div>
            </div>
            
            <div class="summary-card warning">
                <h3>Indirect Matching</h3>
                <div class="summary-value">${summaryData.stats.encountersWithoutDirectCSNLink}</div>
                <div class="summary-detail">via date/dept matching</div>
            </div>
        </div>
        
        <!-- Data Quality Issues -->
        <div class="issues-section">
            <h2>Data Quality Issues</h2>
            ${summaryData.topIssues.map(issue => `
                <div class="issue-item">
                    <div>
                        <div class="issue-name">${issue.issue}</div>
                        <div class="summary-detail">${issue.description}</div>
                    </div>
                    <div class="issue-count">${issue.count}</div>
                </div>
            `).join('')}
        </div>
        
        <!-- Filters -->
        <div class="filters-section">
            <div class="filter-group">
                <label>Year:</label>
                <select id="yearFilter" onchange="filterEncounters()">
                    <option value="">All Years</option>
                    ${Object.keys(summaryData.stats.encountersByYear).sort().reverse().map(year => 
                        `<option value="${year}">${year} (${summaryData.stats.encountersByYear[year]})</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="filter-group">
                <label>Billing Status:</label>
                <select id="billingFilter" onchange="filterEncounters()">
                    <option value="">All Encounters</option>
                    <option value="with-billing">With Billing Only</option>
                    <option value="no-billing">No Billing Only</option>
                    <option value="direct-csn">Direct CSN Link Only</option>
                    <option value="indirect-match">Indirect Match Only</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label>Search:</label>
                <input type="text" id="searchFilter" placeholder="CSN, Patient, Provider..." onkeyup="filterEncounters()">
            </div>
        </div>
        
        <!-- Encounters -->
        <div id="encountersContainer">
            ${billingData.encounters.map((enc, index) => {
                const balance = enc.billing.summary.calculatedBalance;
                const balanceClass = balance > 0 ? 'balance-negative' : 'balance-positive';
                const hasBilling = enc.billing.summary.hasAnyBilling;
                const hasDirectCSN = enc.linkage.hasDirectCSNLink;
                
                return `
                <div class="encounter-card ${hasDirectCSN ? 'direct-csn-link' : ''}" 
                     id="encounter-${index}"
                     data-year="${enc.clinical.date?.substring(0, 4)}"
                     data-has-billing="${hasBilling}"
                     data-direct-csn="${hasDirectCSN}"
                     data-search="${enc.clinical.csn} ${enc.patient.name} ${enc.clinical.provider}">
                    
                    <div class="encounter-header" onclick="toggleEncounter(${index})">
                        <div class="encounter-info">
                            <h3>${createTooltip(`CSN: ${enc.clinical.csn}`, enc.metadata)}</h3>
                            <div class="encounter-meta">
                                ${formatDate(enc.clinical.date)} | 
                                ${createTooltip(enc.clinical.department, {sourceTable: 'CLARITY_DEP', joinPath: `CLARITY_DEP.DEPARTMENT_ID = ${enc.clinical.departmentId}`})} | 
                                ${createTooltip(enc.patient.name, {sourceTable: 'PATIENT', joinPath: `PATIENT.PAT_ID = ${enc.patient.id}`})}
                            </div>
                            <div class="encounter-badges">
                                ${hasDirectCSN ? '<span class="badge direct-csn">Direct CSN Link</span>' : ''}
                                ${!hasDirectCSN && hasBilling ? '<span class="badge indirect-match">Indirect Match</span>' : ''}
                                ${!hasBilling ? '<span class="badge no-billing">No Billing</span>' : ''}
                            </div>
                        </div>
                        
                        <div class="encounter-summary">
                            ${hasBilling ? `
                                <div class="balance-amount ${balanceClass}">${formatCurrency(balance)}</div>
                                <div class="summary-detail">
                                    ${enc.billing.charges.length} charges, 
                                    ${enc.billing.payments.length} payments
                                </div>
                            ` : '<div class="summary-detail">Clinical data only</div>'}
                            <span class="expand-icon">▶</span>
                        </div>
                    </div>
                    
                    <div class="encounter-content">
                        <!-- Linkage Information -->
                        ${enc.linkage.warnings.length > 0 ? `
                            <div class="info-box warning">
                                <strong>Data Linkage Warning:</strong><br>
                                ${enc.linkage.warnings.join('<br>')}
                                <br><br>
                                <strong>Linkage Method:</strong> ${enc.linkage.method}<br>
                                <strong>Join Path:</strong> ${enc.linkage.joinPath || 'N/A'}
                            </div>
                        ` : ''}
                        
                        <!-- Clinical Information -->
                        <div class="content-section">
                            <h4>Clinical Information</h4>
                            
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <span class="detail-label">Encounter Type</span>
                                    <span class="detail-value">${enc.clinical.encounterType}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Provider</span>
                                    <span class="detail-value">
                                        ${createTooltip(enc.clinical.provider, {
                                            sourceTable: 'CLARITY_SER',
                                            joinPath: `CLARITY_SER.PROV_ID = ${enc.clinical.providerId}`
                                        })}
                                    </span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Status</span>
                                    <span class="detail-value">${enc.clinical.status}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">MRN</span>
                                    <span class="detail-value">${enc.patient.mrn}</span>
                                </div>
                            </div>
                            
                            ${enc.clinical.reasons.length > 0 ? `
                                <h5 style="margin-top: 20px;">Reasons for Visit</h5>
                                <ul>
                                    ${enc.clinical.reasons.map(r => `
                                        <li>${createTooltip(r.reason, r)}${r.comments ? ` - ${r.comments}` : ''}</li>
                                    `).join('')}
                                </ul>
                            ` : ''}
                            
                            ${enc.clinical.diagnoses.length > 0 ? `
                                <h5 style="margin-top: 20px;">Diagnoses</h5>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Diagnosis</th>
                                            <th>Type</th>
                                            <th>Source</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${enc.clinical.diagnoses.map(dx => `
                                            <tr>
                                                <td>${createTooltip(dx.name, dx)}</td>
                                                <td>${dx.isPrimary ? '<strong>Primary</strong>' : 'Secondary'}</td>
                                                <td class="detail-label">${dx.sourceTable}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            ` : ''}
                            
                            ${enc.clinical.orders.length > 0 ? `
                                <h5 style="margin-top: 20px;">Orders (CSN Linkage)</h5>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Order Type</th>
                                            <th>Description</th>
                                            <th>Procedure</th>
                                            <th>Order Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${enc.clinical.orders.map(order => `
                                            <tr>
                                                <td>${order.orderType}</td>
                                                <td>${order.description}</td>
                                                <td>
                                                    ${order.procedureName ? 
                                                        createTooltip(`${order.procedureName} (${order.procedureId})`, order) :
                                                        order.procedureId || 'N/A'
                                                    }
                                                </td>
                                                <td>${formatDate(order.orderDate)}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            ` : ''}
                        </div>
                        
                        <!-- Billing Information -->
                        ${enc.billing.summary.hasAnyBilling ? `
                            <div class="content-section">
                                <h4>Billing Information</h4>
                                
                                ${enc.billing.accountBalances ? `
                                    <div class="info-box">
                                        <strong>Account Balance Information:</strong><br>
                                        ${createTooltip(`Account: ${enc.billing.accountBalances.accountName} (${enc.billing.accountBalances.accountId})`, enc.billing.accountBalances)}<br>
                                        Current Total Balance: <strong>${formatCurrency(enc.billing.accountBalances.totalBalance)}</strong><br>
                                        Insurance Balance: ${formatCurrency(enc.billing.accountBalances.insuranceBalance)}<br>
                                        Patient Balance: ${formatCurrency(enc.billing.accountBalances.patientBalance)}<br>
                                        Last Statement: ${formatDate(enc.billing.accountBalances.lastStatementDate)}
                                    </div>
                                ` : ''}
                                
                                <!-- Charges -->
                                ${enc.billing.charges.length > 0 ? `
                                    <h5>Charges</h5>
                                    ${enc.billing.charges.map((charge, chargeIndex) => `
                                        <div class="transaction-detail">
                                            <h5>Charge ${chargeIndex + 1}: ${charge.procedureName || 'Unknown Procedure'}</h5>
                                            
                                            <div class="detail-grid">
                                                <div class="detail-item">
                                                    <span class="detail-label">Transaction ID</span>
                                                    <span class="detail-value">
                                                        ${createTooltip(charge.txId, charge)}
                                                    </span>
                                                </div>
                                                <div class="detail-item">
                                                    <span class="detail-label">Service Date</span>
                                                    <span class="detail-value">${formatDate(charge.serviceDate)}</span>
                                                </div>
                                                <div class="detail-item">
                                                    <span class="detail-label">Post Date</span>
                                                    <span class="detail-value">${formatDate(charge.postDate)}</span>
                                                </div>
                                                <div class="detail-item">
                                                    <span class="detail-label">Amount</span>
                                                    <span class="detail-value">${formatCurrency(charge.amount)}</span>
                                                </div>
                                                <div class="detail-item">
                                                    <span class="detail-label">Outstanding</span>
                                                    <span class="detail-value ${charge.outstandingAmount > 0 ? 'negative' : 'positive'}">
                                                        ${formatCurrency(charge.outstandingAmount)}
                                                    </span>
                                                </div>
                                                <div class="detail-item">
                                                    <span class="detail-label">CPT/Modifiers</span>
                                                    <span class="detail-value">
                                                        ${charge.cpt || 'N/A'}
                                                        ${charge.modifiers.length > 0 ? ` (${charge.modifiers.join(', ')})` : ''}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            ${charge.invoiceDetails && charge.invoiceDetails.claimLines.some(line => 
                                                line.quantity > 1 || line.modifiers.length > 0 || line.paidAmount > 0
                                            ) ? `
                                                <div style="margin-top: 15px;">
                                                    <strong>Claim Line Details:</strong>
                                                    <table style="margin-top: 10px; font-size: 13px;">
                                                        <thead>
                                                            <tr>
                                                                <th>Line</th>
                                                                <th>Units</th>
                                                                <th>Modifiers</th>
                                                                <th>Status</th>
                                                                <th>Paid</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            ${charge.invoiceDetails.claimLines.map(line => `
                                                                <tr>
                                                                    <td>${line.lineNumber}</td>
                                                                    <td>${line.quantity || 1}</td>
                                                                    <td>${line.modifiers.join(', ') || '-'}</td>
                                                                    <td>${line.claimStatus || 'Pending'}</td>
                                                                    <td>${formatCurrency(line.paidAmount || 0)}</td>
                                                                </tr>
                                                            `).join('')}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ` : ''}
                                            
                                            ${charge.statementHistory.length > 0 ? `
                                                <div style="margin-top: 15px;">
                                                    <strong>Statement/Claim History:</strong>
                                                    <table style="margin-top: 10px;">
                                                        <thead>
                                                            <tr>
                                                                <th>Type</th>
                                                                <th>Date</th>
                                                                <th>Invoice</th>
                                                                <th>Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            ${charge.statementHistory.map(hist => `
                                                                <tr>
                                                                    <td>${createTooltip(hist.type, hist)}</td>
                                                                    <td>${formatDate(hist.date)}</td>
                                                                    <td>${hist.invoiceNum || 'N/A'}</td>
                                                                    <td class="amount">${formatCurrency(hist.amount)}</td>
                                                                </tr>
                                                            `).join('')}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ` : ''}
                                            
                                            ${(charge.actions.length > 0 || charge.matches.length > 0) ? `
                                                <div class="action-history">
                                                    <strong>Complete Transaction Timeline:</strong>
                                                    <div style="margin-top: 10px; padding-left: 20px; border-left: 3px solid #3498db;">
                                                        <!-- Original Charge -->
                                                        <div class="action-item" style="margin-bottom: 10px;">
                                                            <div class="action-header">
                                                                <span class="action-type"><strong>Original Charge</strong></span>
                                                                <span class="action-date">${formatDate(charge.serviceDate)}</span>
                                                            </div>
                                                            <div>
                                                                Amount: <strong>${formatCurrency(charge.amount)}</strong><br>
                                                                Outstanding: <strong>${formatCurrency(charge.amount)}</strong>
                                                            </div>
                                                        </div>
                                                        
                                                        <!-- Build complete timeline of payments and actions -->
                                                        ${(() => {
                                                            // Combine matches and actions into a timeline
                                                            const timeline = [];
                                                            
                                                            // Add payments/adjustments from matches
                                                            charge.matches.forEach(match => {
                                                                const matchedPayment = enc.billing.payments.find(p => p.txId === match.matchedTxId);
                                                                const matchedAdjustment = enc.billing.adjustments.find(a => a.txId === match.matchedTxId);
                                                                
                                                                timeline.push({
                                                                    date: match.matchDate,
                                                                    type: matchedPayment ? 'Payment' : 'Adjustment',
                                                                    amount: match.matchAmount,
                                                                    description: matchedPayment ? 
                                                                        `Payment from ${matchedPayment.insuranceName || matchedPayment.payorName || (matchedPayment.isPatientPayment ? 'Patient' : 'Unknown Source')}` :
                                                                        `Adjustment - ${matchedAdjustment?.adjustmentReason || 'Contractual'}`,
                                                                    user: match.userName,
                                                                    isPayment: !!matchedPayment
                                                                });
                                                            });
                                                            
                                                            // Add actions (these show the outstanding changes)
                                                            charge.actions.forEach(action => {
                                                                const existingItem = timeline.find(t => 
                                                                    t.date === action.actionDate && 
                                                                    Math.abs(t.amount - action.actionAmount) < 0.01
                                                                );
                                                                
                                                                if (existingItem) {
                                                                    // Enhance existing item with action details
                                                                    existingItem.outstandingBefore = action.outstandingBefore;
                                                                    existingItem.outstandingAfter = action.outstandingAfter;
                                                                    existingItem.remitCode = action.remitCode;
                                                                    existingItem.remitDescription = action.remitDescription;
                                                                } else {
                                                                    // Add as new timeline item
                                                                    timeline.push({
                                                                        date: action.actionDate,
                                                                        type: action.actionType,
                                                                        amount: action.actionAmount,
                                                                        description: action.actionType,
                                                                        outstandingBefore: action.outstandingBefore,
                                                                        outstandingAfter: action.outstandingAfter,
                                                                        remitCode: action.remitCode,
                                                                        remitDescription: action.remitDescription,
                                                                        user: action.userName
                                                                    });
                                                                }
                                                            });
                                                            
                                                            // Sort timeline by date
                                                            timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
                                                            
                                                            // Calculate running balance
                                                            let runningBalance = charge.amount;
                                                            
                                                            return timeline.map((item, idx) => {
                                                                const prevBalance = runningBalance;
                                                                if (item.isPayment || item.type.includes('Adjustment')) {
                                                                    runningBalance -= item.amount;
                                                                }
                                                                
                                                                return `
                                                                    <div class="action-item" style="margin-bottom: 10px;">
                                                                        <div class="action-header">
                                                                            <span class="action-type ${item.isPayment ? 'positive' : 'neutral'}">
                                                                                <strong>${item.type}</strong>
                                                                            </span>
                                                                            <span class="action-date">${formatDate(item.date)}</span>
                                                                        </div>
                                                                        <div>
                                                                            ${item.description}<br>
                                                                            Amount: <strong>${formatCurrency(item.amount)}</strong><br>
                                                                            Outstanding: <strong>${formatCurrency(prevBalance)} → ${formatCurrency(runningBalance)}</strong>
                                                                            ${item.remitCode ? `<br>
                                                                                <span class="remit-code">
                                                                                    Remit ${item.remitCode}: ${item.remitDescription}
                                                                                </span>
                                                                            ` : ''}
                                                                            <br>
                                                                            <small>By: ${item.user}</small>
                                                                        </div>
                                                                    </div>
                                                                `;
                                                            }).join('');
                                                        })()}
                                                        
                                                        <!-- Final Status -->
                                                        <div class="action-item" style="margin-top: 15px; background: #f0f8ff; padding: 10px; border-radius: 4px;">
                                                            <strong>Final Status:</strong><br>
                                                            Original Charge: ${formatCurrency(charge.amount)}<br>
                                                            Total Payments: ${formatCurrency(charge.matches.filter(m => enc.billing.payments.some(p => p.txId === m.matchedTxId)).reduce((sum, m) => sum + m.matchAmount, 0))}<br>
                                                            Total Adjustments: ${formatCurrency(charge.matches.filter(m => enc.billing.adjustments.some(a => a.txId === m.matchedTxId)).reduce((sum, m) => sum + m.matchAmount, 0))}<br>
                                                            <strong>Final Outstanding: ${formatCurrency(charge.outstandingAmount)}</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            ` : ''}
                                            
                                            ${charge.matches.length > 0 ? `
                                                <div style="margin-top: 15px;">
                                                    <strong>Transaction Matching Details:</strong>
                                                    <div class="info-box" style="margin: 10px 0;">
                                                        <small>This table shows how payments/adjustments are linked to this charge via ARPB_TX_MATCH_HX. 
                                                        One payment can be split across multiple charges.</small>
                                                    </div>
                                                    <table style="margin-top: 10px;">
                                                        <thead>
                                                            <tr>
                                                                <th>Match Date</th>
                                                                <th>Type</th>
                                                                <th>Transaction ID</th>
                                                                <th>Payer/Source</th>
                                                                <th>Amount Applied to THIS Charge</th>
                                                                <th>Applied By</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            ${charge.matches.map(match => {
                                                                // Find the matched transaction to determine type
                                                                const matchedPayment = billingData.encounters[index].billing.payments.find(p => p.txId === match.matchedTxId);
                                                                const matchedAdjustment = billingData.encounters[index].billing.adjustments.find(a => a.txId === match.matchedTxId);
                                                                const isPayment = !!matchedPayment;
                                                                const txType = isPayment ? 'Payment' : 'Adjustment';
                                                                const typeClass = isPayment ? 'positive' : 'neutral';
                                                                
                                                                let payerInfo = '';
                                                                if (matchedPayment) {
                                                                    if (matchedPayment.insuranceName) {
                                                                        payerInfo = matchedPayment.insuranceName;
                                                                    } else if (matchedPayment.payorName) {
                                                                        payerInfo = matchedPayment.payorName;
                                                                    } else if (matchedPayment.isPatientPayment) {
                                                                        payerInfo = 'Patient';
                                                                    } else if (matchedPayment.payorId) {
                                                                        payerInfo = `Payor ID: ${matchedPayment.payorId}`;
                                                                    } else {
                                                                        payerInfo = 'Unknown Source';
                                                                    }
                                                                    
                                                                    // Show if this payment was split
                                                                    if (matchedPayment.appliedToCharges && matchedPayment.appliedToCharges.length > 1) {
                                                                        payerInfo += `<br><small>Split across ${matchedPayment.appliedToCharges.length} charges</small>`;
                                                                    }
                                                                } else if (matchedAdjustment) {
                                                                    payerInfo = matchedAdjustment.adjustmentReason || 'Contractual';
                                                                }
                                                                
                                                                return `
                                                                <tr>
                                                                    <td>${formatDate(match.matchDate)}</td>
                                                                    <td class="${typeClass}"><strong>${txType}</strong></td>
                                                                    <td>
                                                                        ${createTooltip(match.matchedTxId, match)}
                                                                        ${isPayment && matchedPayment.amount !== match.matchAmount ? 
                                                                            `<br><small>Total payment: ${formatCurrency(matchedPayment.amount)}</small>` : 
                                                                            ''
                                                                        }
                                                                    </td>
                                                                    <td>${payerInfo}</td>
                                                                    <td class="amount"><strong>${formatCurrency(match.matchAmount)}</strong></td>
                                                                    <td>${match.userName}</td>
                                                                </tr>
                                                                `;
                                                            }).join('')}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ` : ''}
                                        </div>
                                    `).join('')}
                                ` : ''}
                                
                                <!-- Payments -->
                                ${enc.billing.payments.length > 0 ? `
                                    <h5 style="margin-top: 30px;">Payments Received</h5>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Post Date</th>
                                                <th>Days After Service</th>
                                                <th>Payer</th>
                                                <th>Check/Reference</th>
                                                <th class="amount">Amount Paid</th>
                                                <th>EOB Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${enc.billing.payments.map(pmt => {
                                                const serviceDate = new Date(pmt.serviceDate);
                                                const postDate = new Date(pmt.postDate);
                                                const daysDiff = Math.floor((postDate - serviceDate) / (1000 * 60 * 60 * 24));
                                                const isPatientPayment = pmt.isPatientPayment;
                                                
                                                return `
                                                <tr>
                                                    <td>${formatDate(pmt.postDate)}</td>
                                                    <td>${daysDiff} days</td>
                                                    <td>
                                                        ${isPatientPayment ? 
                                                            '<strong>Patient Payment</strong>' : 
                                                            pmt.insuranceName ? 
                                                                `<strong>${createTooltip(pmt.insuranceName, pmt)}</strong>` :
                                                                pmt.payorName ?
                                                                    `<strong>${createTooltip(pmt.payorName, pmt)}</strong>` :
                                                                    `<strong>${createTooltip(`Unknown Payor${pmt.payorId ? ` (ID: ${pmt.payorId})` : ''}`, pmt)}</strong>`
                                                        }
                                                        ${pmt.appliedToCharges && pmt.appliedToCharges.length > 1 ? 
                                                            `<br><small>Split across ${pmt.appliedToCharges.length} charges: 
                                                            ${pmt.appliedToCharges.map(c => `$${c.amountApplied.toFixed(2)}`).join(', ')}</small>` : 
                                                            ''
                                                        }
                                                    </td>
                                                    <td>${pmt.checkNumber || 'N/A'}</td>
                                                    <td class="amount positive"><strong>${formatCurrency(pmt.amount)}</strong></td>
                                                    <td>
                                                        ${pmt.eobData.length > 0 ? 
                                                            pmt.eobData.map(eob => {
                                                                if (eob.type === 'Primary EOB') {
                                                                    return `
                                                                        <div style="font-size: 12px;">
                                                                            ${createTooltip(
                                                                                `Covered: ${formatCurrency(eob.coveredAmount || 0)}, 
                                                                                Non-Covered: ${formatCurrency(eob.nonCoveredAmount || 0)}, 
                                                                                Paid: ${formatCurrency(eob.paidAmount || 0)}`,
                                                                                eob
                                                                            )}
                                                                            ${eob.icn ? `<br>ICN: ${eob.icn}` : ''}
                                                                        </div>
                                                                    `;
                                                                } else {
                                                                    return `<div style="font-size: 12px;">${eob.remitDescription || 'Secondary EOB'}</div>`;
                                                                }
                                                            }).join('') : 
                                                            isPatientPayment ? 'Direct patient payment' : 'No EOB data'
                                                        }
                                                    </td>
                                                </tr>
                                                `;
                                            }).join('')}
                                        </tbody>
                                    </table>
                                ` : ''}
                                
                                <!-- Adjustments -->
                                ${enc.billing.adjustments.length > 0 ? `
                                    <h5 style="margin-top: 30px;">Adjustments (Write-offs)</h5>
                                    <div class="info-box" style="margin-bottom: 15px;">
                                        <strong>Understanding Adjustments:</strong> These are amounts written off, typically due to insurance contracts. 
                                        "Contractual" adjustments mean the insurance negotiated rate is lower than the billed amount.
                                    </div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Post Date</th>
                                                <th>Days After Service</th>
                                                <th>Type/Reason</th>
                                                <th>Procedure</th>
                                                <th class="amount">Amount Written Off</th>
                                                <th>Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${enc.billing.adjustments.map(adj => {
                                                const encounterDate = new Date(enc.clinical.date);
                                                const postDate = new Date(adj.postDate);
                                                const daysDiff = Math.floor((postDate - encounterDate) / (1000 * 60 * 60 * 24));
                                                
                                                // Look for related transaction actions for more details
                                                const relatedCharge = enc.billing.charges.find(c => 
                                                    c.procedureId === adj.procedureId && 
                                                    c.serviceDate === adj.serviceDate
                                                );
                                                
                                                const relatedAction = relatedCharge?.actions.find(a => 
                                                    a.actionType.includes('Adjustment') && 
                                                    Math.abs(a.actionAmount - adj.amount) < 0.01
                                                );
                                                
                                                return `
                                                <tr>
                                                    <td>${formatDate(adj.postDate)}</td>
                                                    <td>${daysDiff} days</td>
                                                    <td>
                                                        <strong>${createTooltip(adj.adjustmentReason || 'Contractual', adj)}</strong>
                                                        ${relatedAction?.remitCode ? 
                                                            `<br><span class="remit-code" style="margin-top: 5px;">
                                                                Remit ${relatedAction.remitCode}: ${relatedAction.remitDescription}
                                                            </span>` : ''
                                                        }
                                                    </td>
                                                    <td>${adj.procedureName || 'N/A'}</td>
                                                    <td class="amount neutral"><strong>${formatCurrency(adj.amount)}</strong></td>
                                                    <td>
                                                        ${relatedAction ? 
                                                            `Outstanding went from ${formatCurrency(relatedAction.outstandingBefore)} 
                                                             to ${formatCurrency(relatedAction.outstandingAfter)}` : 
                                                            'Insurance negotiated discount'
                                                        }
                                                    </td>
                                                </tr>
                                                `;
                                            }).join('')}
                                        </tbody>
                                    </table>
                                    
                                    <!-- Insurance Negotiation Summary -->
                                    ${(() => {
                                        const totalCharges = enc.billing.charges.reduce((sum, c) => sum + c.amount, 0);
                                        const totalPayments = enc.billing.payments.reduce((sum, p) => sum + p.amount, 0);
                                        const totalAdjustments = enc.billing.adjustments.reduce((sum, a) => sum + a.amount, 0);
                                        const insurancePayments = enc.billing.payments.filter(p => p.insuranceName && p.insuranceName !== 'Patient Payment');
                                        const patientPayments = enc.billing.payments.filter(p => !p.insuranceName || p.insuranceName === 'Patient Payment');
                                        
                                        if (insurancePayments.length > 0) {
                                            return `
                                                <div class="info-box" style="margin-top: 20px; background: #e8f5e9;">
                                                    <strong>Insurance Negotiation Results:</strong><br>
                                                    Original Charges: ${formatCurrency(totalCharges)}<br>
                                                    Insurance Paid: ${formatCurrency(insurancePayments.reduce((sum, p) => sum + p.amount, 0))}<br>
                                                    Contractual Write-offs: ${formatCurrency(totalAdjustments)}<br>
                                                    Patient Responsibility: ${formatCurrency(totalCharges - totalPayments - totalAdjustments)}<br>
                                                    ${patientPayments.length > 0 ? 
                                                        `Patient Paid: ${formatCurrency(patientPayments.reduce((sum, p) => sum + p.amount, 0))}<br>` : 
                                                        ''
                                                    }
                                                    <strong>Insurance saved patient: ${formatCurrency(totalAdjustments)} 
                                                    (${((totalAdjustments / totalCharges) * 100).toFixed(1)}% discount)</strong>
                                                </div>
                                            `;
                                        }
                                        return '';
                                    })()}
                                ` : ''}
                                
                                <!-- Front-End Collections -->
                                ${enc.billing.frontEndCollections.length > 0 ? `
                                    <h5 style="margin-top: 30px;">Front-End Collections</h5>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Event Type</th>
                                                <th>Copay Due</th>
                                                <th>Copay Collected</th>
                                                <th>Total Collected</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${enc.billing.frontEndCollections.map(coll => `
                                                <tr>
                                                    <td>${formatDate(coll.date)}</td>
                                                    <td>${createTooltip(coll.eventType, coll)}</td>
                                                    <td class="amount">${formatCurrency(coll.copayDue)}</td>
                                                    <td class="amount">${formatCurrency(coll.copayCollected)}</td>
                                                    <td class="amount">${formatCurrency(coll.totalCollected)}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                ` : ''}
                                
                                <!-- ICD-10 Codes -->
                                ${enc.billing.icd10Codes && enc.billing.icd10Codes.length > 0 ? `
                                    <h5 style="margin-top: 30px;">Submitted ICD-10 Codes</h5>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Code</th>
                                                <th>Type</th>
                                                <th>Source</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${enc.billing.icd10Codes.map(icd => `
                                                <tr>
                                                    <td><strong>${createTooltip(icd.code, icd)}</strong></td>
                                                    <td>${icd.isPrimary ? 'Primary' : 'Secondary'}</td>
                                                    <td class="detail-label">${icd.sourceTable}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                ` : ''}
                                
                                <!-- Billing Summary -->
                                <div class="info-box" style="margin-top: 30px;">
                                    <strong>Billing Summary:</strong><br>
                                    Total Charges: ${formatCurrency(enc.billing.summary.totalCharges)}<br>
                                    Total Payments: ${formatCurrency(enc.billing.summary.totalPayments)}<br>
                                    Total Adjustments: ${formatCurrency(enc.billing.summary.totalAdjustments)}<br>
                                    <strong>Calculated Balance: ${formatCurrency(enc.billing.summary.calculatedBalance)}</strong>
                                </div>
                            </div>
                        ` : '<div class="content-section"><h4>No Billing Data</h4><p>No charges, payments, or adjustments found for this encounter.</p></div>'}
                    </div>
                </div>
                `;
            }).join('')}
        </div>
        
        <!-- Legend -->
        <div class="legend">
            <h3>Data Source Legend</h3>
            <p style="margin-bottom: 15px;">Hover over any <span class="has-tooltip">blue underlined value</span> to see its data source and join path.</p>
            
            <div class="legend-item">
                <div class="legend-color" style="background: var(--success-color);"></div>
                <span><strong>Direct CSN Linkage:</strong> Billing definitively linked to this specific encounter via ORDER_PROC table</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: var(--warning-color);"></div>
                <span><strong>Indirect Matching:</strong> No direct CSN link - billing matched by date/department/account (may include charges from other encounters)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: var(--info-color);"></div>
                <span><strong>Transaction Details:</strong> Expandable sections showing charge modifications and history</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: var(--light-bg);"></div>
                <span><strong>Remit Codes:</strong> Insurance adjustment reasons from ARPB_TX_ACTIONS</span>
            </div>
        </div>
    </div>
    
    <script>
        // Toggle encounter expansion
        function toggleEncounter(index) {
            const card = document.getElementById('encounter-' + index);
            card.classList.toggle('expanded');
        }
        
        // Filter encounters
        function filterEncounters() {
            const yearFilter = document.getElementById('yearFilter').value;
            const billingFilter = document.getElementById('billingFilter').value;
            const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
            
            const cards = document.querySelectorAll('.encounter-card');
            
            cards.forEach(card => {
                let show = true;
                
                // Year filter
                if (yearFilter && card.dataset.year !== yearFilter) {
                    show = false;
                }
                
                // Billing filter
                if (billingFilter === 'with-billing' && card.dataset.hasBilling !== 'true') {
                    show = false;
                } else if (billingFilter === 'no-billing' && card.dataset.hasBilling === 'true') {
                    show = false;
                } else if (billingFilter === 'direct-csn' && card.dataset.directCsn !== 'true') {
                    show = false;
                } else if (billingFilter === 'indirect-match' && (card.dataset.hasBilling !== 'true' || card.dataset.directCsn === 'true')) {
                    show = false;
                }
                
                // Search filter
                if (searchFilter && !card.dataset.search.toLowerCase().includes(searchFilter)) {
                    show = false;
                }
                
                card.style.display = show ? 'block' : 'none';
            });
        }
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            // Focus search box when clicking on it
            document.getElementById('searchFilter').addEventListener('click', function() {
                this.select();
            });
        });
    </script>
</body>
</html>`;

// Write HTML file
const htmlPath = path.join(__dirname, '..', 'complete-billing-analysis.html');
fs.writeFileSync(htmlPath, html);

console.log(`\nHTML report generated: ${htmlPath}`);
console.log('\nReport includes:');
console.log('- Comprehensive tooltips showing data source and join paths');
console.log('- Complete transaction history with actions and remit codes');
console.log('- Statement/claim submission tracking');
console.log('- EOB details for all payments');
console.log('- Account balance information');
console.log('- Data quality warnings and linkage methods');
console.log('- Filterable by year, billing status, and searchable');
console.log('\nOpen the HTML file in a browser to explore the interactive report.');