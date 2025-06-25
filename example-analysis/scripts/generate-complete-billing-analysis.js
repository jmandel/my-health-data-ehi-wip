import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadTable(tableName) {
    const filePath = path.join(__dirname, '..', 'json', `${tableName}.json`);
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return data[tableName] || [];
    } catch (e) {
        console.error(`Failed to load ${tableName}: ${e.message}`);
        return [];
    }
}

console.log('Loading all Epic EHI tables for complete billing analysis...');

// Load all tables
const tables = {
    // Clinical tables
    encounters: loadTable('PAT_ENC'),
    patients: loadTable('PATIENT'),
    patEncDx: loadTable('PAT_ENC_DX'),
    patEncRsnVisit: loadTable('PAT_ENC_RSN_VISIT'),
    orderProc: loadTable('ORDER_PROC'),
    patEncHsp: loadTable('PAT_ENC_HSP'),
    
    // Account tables
    accounts: loadTable('ACCOUNT'),
    patAcctCvg: loadTable('PAT_ACCT_CVG'),
    
    // Professional billing tables
    arpbTransactions: loadTable('ARPB_TRANSACTIONS'),
    arpbTxActions: loadTable('ARPB_TX_ACTIONS'),
    arpbTxMatch: loadTable('ARPB_TX_MATCH_HX'),
    arpbTxStmClaim: loadTable('ARPB_TX_STMCLAIMHX'),
    arpbTxVoid: loadTable('ARPB_TX_VOID'),
    arpbVisits: loadTable('ARPB_VISITS'),
    
    // Hospital billing tables
    hspAccount: loadTable('HSP_ACCOUNT'),
    hspTransactions: loadTable('HSP_TRANSACTIONS'),
    harAll: loadTable('HAR_ALL'),
    
    // Invoice and claim tables
    invoice: loadTable('INVOICE'),
    invClmLnAddl: loadTable('INV_CLM_LN_ADDL'),
    invTxPieces: loadTable('INV_TX_PIECES'),
    clmDx: loadTable('CLM_DX'),
    clmValues: loadTable('CLM_VALUES'),
    
    // Payment and EOB tables
    pmtEobI: loadTable('PMT_EOB_INFO_I'),
    pmtEobII: loadTable('PMT_EOB_INFO_II'),
    clRemit: loadTable('CL_REMIT'),
    
    // Front-end collections
    frontEndPmt: loadTable('FRONT_END_PMT_COLL_HX'),
    
    // Lookup tables
    clarityDep: loadTable('CLARITY_DEP'),
    claritySer: loadTable('CLARITY_SER'),
    clarityEdg: loadTable('CLARITY_EDG'),
    clarityEap: loadTable('CLARITY_EAP'),
    clRsnForVisit: loadTable('CL_RSN_FOR_VISIT'),
    clarityEpm: loadTable('CLARITY_EPM'),
    clarityEpp: loadTable('CLARITY_EPP'),
    clarityRmc: loadTable('CLARITY_RMC'),
    clarityMod: loadTable('CLARITY_MOD')
};

// Build comprehensive lookups
const lookups = {
    department: {},
    provider: {},
    diagnosis: {},
    procedure: {},
    reason: {},
    account: {},
    patientAccount: {},
    patient: {},
    txMatches: {},
    invoiceToClaimMap: {},
    claimDxMap: {},
    ordersByCSN: {},
    frontEndByCSN: {},
    payor: {},
    benefitPlan: {},
    remitCode: {},
    modifier: {},
    harByCSN: {},
    arpbVisitsByCSN: {},
    hspTxByCSN: {}
};

// Populate lookups
console.log('Building lookup tables...');

tables.clarityDep.forEach(d => {
    lookups.department[d.DEPARTMENT_ID] = d.DEPARTMENT_NAME;
});

tables.claritySer.forEach(p => {
    lookups.provider[p.PROV_ID] = p.PROV_NAME;
});

tables.clarityEdg.forEach(d => {
    lookups.diagnosis[d.DX_ID] = {
        name: d.DX_NAME,
        icd10: d.ICD10_CODE || d.CURRENT_ICD10_LIST || null
    };
});

tables.clarityEap.forEach(p => {
    lookups.procedure[p.PROC_ID] = {
        name: p.PROC_NAME,
        cpt: p.CPT_CODE || null
    };
});

tables.clRsnForVisit.forEach(r => {
    lookups.reason[r.REASON_VISIT_ID] = r.REASON_VISIT_NAME;
});

tables.accounts.forEach(a => {
    lookups.account[a.ACCOUNT_ID] = a;
});

tables.patients.forEach(p => {
    lookups.patient[p.PAT_ID] = p;
});

// Build payor lookups
tables.clarityEpm.forEach(p => {
    lookups.payor[p.PAYOR_ID] = p.PAYOR_NAME;
});

// Build benefit plan lookups
tables.clarityEpp.forEach(p => {
    lookups.benefitPlan[p.BENEFIT_PLAN_ID] = p.BENEFIT_PLAN_NAME;
});

// Build remit code lookups
tables.clarityRmc.forEach(r => {
    lookups.remitCode[r.REMIT_CODE_ID] = {
        name: r.REMIT_CODE_NAME,
        category: r.RMT_CODE_CAT_C_NAME
    };
});

// Build modifier lookups
tables.clarityMod.forEach(m => {
    lookups.modifier[m.MODIFIER_ID] = {
        name: m.MODIFIER_NAME,
        description: m.MODIFIER_DESCRIPTION
    };
});

// Build patient-account mapping
tables.patAcctCvg.forEach(pac => {
    if (pac.ACCOUNT_ACTIVE_YN === 'Y') {
        if (!lookups.patientAccount[pac.PAT_ID]) {
            lookups.patientAccount[pac.PAT_ID] = [];
        }
        lookups.patientAccount[pac.PAT_ID].push(pac.ACCOUNT_ID);
    }
});

// Build transaction matching map
tables.arpbTxMatch.forEach(match => {
    if (!lookups.txMatches[match.TX_ID]) {
        lookups.txMatches[match.TX_ID] = [];
    }
    lookups.txMatches[match.TX_ID].push(match);
});

// Build ICD-10 lookups
tables.clmValues.forEach(clm => {
    if (clm.INV_NUM) {
        lookups.invoiceToClaimMap[clm.INV_NUM] = clm.RECORD_ID;
    }
});

tables.clmDx.forEach(dx => {
    if (!lookups.claimDxMap[dx.RECORD_ID]) {
        lookups.claimDxMap[dx.RECORD_ID] = [];
    }
    lookups.claimDxMap[dx.RECORD_ID].push({
        code: dx.CLM_DX,
        qualifier: dx.CLM_DX_QUAL,
        line: dx.LINE
    });
});

// Build CSN linkage maps
tables.orderProc.forEach(order => {
    const csn = order.PAT_ENC_CSN_ID;
    if (!lookups.ordersByCSN[csn]) {
        lookups.ordersByCSN[csn] = [];
    }
    lookups.ordersByCSN[csn].push(order);
});

tables.frontEndPmt.forEach(pmt => {
    const csn = pmt.PAT_ENC_CSN_ID;
    if (!lookups.frontEndByCSN[csn]) {
        lookups.frontEndByCSN[csn] = [];
    }
    lookups.frontEndByCSN[csn].push(pmt);
});

// Build HAR CSN mapping
tables.harAll.forEach(har => {
    const csn = har.PRIM_ENC_CSN_ID;
    if (csn) {
        if (!lookups.harByCSN[csn]) {
            lookups.harByCSN[csn] = [];
        }
        lookups.harByCSN[csn].push(har);
    }
});

// Build ARPB_VISITS CSN mapping
tables.arpbVisits.forEach(visit => {
    const csn = visit.PRIM_ENC_CSN_ID;
    if (csn) {
        if (!lookups.arpbVisitsByCSN[csn]) {
            lookups.arpbVisitsByCSN[csn] = [];
        }
        lookups.arpbVisitsByCSN[csn].push(visit);
    }
});

// Build HSP_TRANSACTIONS CSN mapping
tables.hspTransactions.forEach(tx => {
    const csn = tx.PAT_ENC_CSN_ID;
    if (csn) {
        if (!lookups.hspTxByCSN[csn]) {
            lookups.hspTxByCSN[csn] = [];
        }
        lookups.hspTxByCSN[csn].push(tx);
    }
});

// Process all encounters
console.log('Processing all encounters across all dates...');

const allEncounters = tables.encounters.filter(enc => enc.DEPARTMENT_ID);

// Build comprehensive encounter data
const encounterData = allEncounters.map(enc => {
    const csn = enc.PAT_ENC_CSN_ID;
    const patient = lookups.patient[enc.PAT_ID] || {};
    const accountIds = lookups.patientAccount[enc.PAT_ID] || [];
    
    // Initialize encounter structure
    const encounter = {
        clinical: {
            csn: csn,
            date: enc.CONTACT_DATE,
            department: lookups.department[enc.DEPARTMENT_ID] || `Unknown Dept ${enc.DEPARTMENT_ID}`,
            departmentId: enc.DEPARTMENT_ID,
            provider: lookups.provider[enc.VISIT_PROV_ID] || 'Unknown Provider',
            providerId: enc.VISIT_PROV_ID,
            encounterType: enc.ENC_TYPE_C_NAME || enc.ENC_TYPE_TITLE || 'Unknown Type',
            status: enc.APPT_STATUS_C_NAME || 'Unknown Status',
            diagnoses: [],
            reasons: [],
            orders: []
        },
        patient: {
            id: enc.PAT_ID,
            name: patient.PAT_NAME || 'Unknown Patient',
            mrn: patient.PAT_MRN_ID || 'Unknown MRN',
            birthDate: patient.BIRTH_DATE,
            accountIds: accountIds
        },
        billing: {
            charges: [],
            payments: [],
            adjustments: [],
            actions: [],
            statementHistory: [],
            eobData: [],
            invoices: [],
            frontEndCollections: []
        },
        linkage: {
            method: 'No billing data',
            hasDirectCSNLink: false,
            warnings: []
        },
        metadata: {
            sourceTable: 'PAT_ENC',
            recordLocation: `PAT_ENC.json where PAT_ENC_CSN_ID = ${csn}`
        }
    };
    
    // Get clinical data
    const encounterDx = tables.patEncDx.filter(dx => dx.PAT_ENC_CSN_ID === csn);
    encounter.clinical.diagnoses = encounterDx.map(dx => ({
        name: lookups.diagnosis[dx.DX_ID]?.name || `Unknown Diagnosis ${dx.DX_ID}`,
        dxId: dx.DX_ID,
        isPrimary: dx.PRIMARY_DX_YN === 'Y',
        sourceTable: 'PAT_ENC_DX',
        joinPath: `PAT_ENC_DX.PAT_ENC_CSN_ID = ${csn} → CLARITY_EDG.DX_ID = ${dx.DX_ID}`
    }));
    
    const reasons = tables.patEncRsnVisit.filter(r => r.PAT_ENC_CSN_ID === csn);
    encounter.clinical.reasons = reasons.map(r => ({
        reason: lookups.reason[r.ENC_REASON_ID] || `Unknown Reason ${r.ENC_REASON_ID}`,
        reasonId: r.ENC_REASON_ID,
        comments: r.COMMENTS,
        sourceTable: 'PAT_ENC_RSN_VISIT',
        joinPath: `PAT_ENC_RSN_VISIT.PAT_ENC_CSN_ID = ${csn} → CL_RSN_FOR_VISIT.REASON_VISIT_ID = ${r.ENC_REASON_ID}`
    }));
    
    // Get orders - key for CSN linkage
    const orders = lookups.ordersByCSN[csn] || [];
    encounter.clinical.orders = orders.map(o => ({
        orderType: o.ORDER_TYPE_C_NAME,
        description: o.DESCRIPTION,
        procedureId: o.PROC_ID,
        procedureName: lookups.procedure[o.PROC_ID]?.name,
        orderDate: o.ORDERING_DATE,
        resultDate: o.RESULT_DATE,
        sourceTable: 'ORDER_PROC',
        joinPath: `ORDER_PROC.PAT_ENC_CSN_ID = ${csn} → CLARITY_EAP.PROC_ID = ${o.PROC_ID}`
    }));
    
    // Determine billing linkage method
    let billingCharges = [];
    let hasDirectCSNLink = false;
    
    // Method 1: Check ARPB_VISITS for direct CSN linkage
    const arpbVisits = lookups.arpbVisitsByCSN[csn] || [];
    if (arpbVisits.length > 0) {
        // Get all charges for these visits
        const visitNumbers = arpbVisits.map(v => v.PB_VISIT_NUM).filter(Boolean);
        const visitCharges = tables.arpbTransactions.filter(tx => 
            visitNumbers.includes(tx.VISIT_NUMBER) &&
            tx.TX_TYPE_C_NAME === 'Charge'
        );
        
        if (visitCharges.length > 0) {
            billingCharges = visitCharges;
            encounter.linkage.method = 'Direct CSN linkage via ARPB_VISITS';
            encounter.linkage.hasDirectCSNLink = true;
            encounter.linkage.joinPath = `ARPB_VISITS.PRIM_ENC_CSN_ID = ${csn} → ARPB_VISITS.VISIT_NUMBER → ARPB_TRANSACTIONS.VISIT_NUMBER`;
            hasDirectCSNLink = true;
        }
    }
    
    // Method 2: Check HSP_TRANSACTIONS for direct CSN linkage
    const hspTx = lookups.hspTxByCSN[csn] || [];
    if (hspTx.length > 0 && billingCharges.length === 0) {
        // HSP_TRANSACTIONS are already charges with direct CSN
        billingCharges = hspTx.filter(tx => tx.TX_TYPE_C_NAME === 'Charge');
        if (billingCharges.length > 0) {
            encounter.linkage.method = 'Direct CSN linkage via HSP_TRANSACTIONS';
            encounter.linkage.hasDirectCSNLink = true;
            encounter.linkage.joinPath = `HSP_TRANSACTIONS.PAT_ENC_CSN_ID = ${csn}`;
            hasDirectCSNLink = true;
        }
    }
    
    // Method 3: Check HAR_ALL for CSN linkage to hospital accounts
    const harRecords = lookups.harByCSN[csn] || [];
    if (harRecords.length > 0 && billingCharges.length === 0) {
        // Get charges via hospital account
        const hspAccountIds = harRecords.map(h => h.HSP_ACCOUNT_ID).filter(Boolean);
        if (hspAccountIds.length > 0) {
            const hspCharges = tables.hspTransactions.filter(tx => 
                hspAccountIds.includes(tx.HSP_ACCOUNT_ID) &&
                tx.TX_TYPE_C_NAME === 'Charge'
            );
            
            if (hspCharges.length > 0) {
                billingCharges = hspCharges;
                encounter.linkage.method = 'Direct CSN linkage via HAR_ALL → HSP_ACCOUNT';
                encounter.linkage.hasDirectCSNLink = true;
                encounter.linkage.joinPath = `HAR_ALL.PRIM_ENC_CSN_ID = ${csn} → HAR_ALL.HSP_ACCOUNT_ID → HSP_TRANSACTIONS`;
                hasDirectCSNLink = true;
            }
        }
    }
    
    // Method 4: Fallback to indirect Date/Department/Account matching
    if (billingCharges.length === 0 && accountIds.length > 0) {
        const dateAcctCharges = tables.arpbTransactions.filter(tx => 
            tx.SERVICE_DATE === enc.CONTACT_DATE &&
            accountIds.includes(tx.ACCOUNT_ID) &&
            tx.TX_TYPE_C_NAME === 'Charge'
        );
        
        const dateDeptCharges = tables.arpbTransactions.filter(tx => 
            tx.SERVICE_DATE === enc.CONTACT_DATE &&
            tx.DEPARTMENT_ID === enc.DEPARTMENT_ID &&
            tx.TX_TYPE_C_NAME === 'Charge'
        );
        
        // Combine and deduplicate
        const allCharges = [...dateAcctCharges];
        dateDeptCharges.forEach(charge => {
            if (!allCharges.find(c => c.TX_ID === charge.TX_ID)) {
                allCharges.push(charge);
            }
        });
        
        if (allCharges.length > 0) {
            billingCharges = allCharges;
            encounter.linkage.method = 'Indirect matching via Date/Department/Account';
            encounter.linkage.hasDirectCSNLink = false;
            encounter.linkage.warnings.push('No direct CSN linkage - billing matched by date/department/account');
            encounter.linkage.warnings.push('May include charges from other encounters on same date');
            encounter.linkage.joinPath = `PAT_ENC.CONTACT_DATE = ARPB_TRANSACTIONS.SERVICE_DATE AND (DEPARTMENT_ID match OR ACCOUNT_ID via PAT_ACCT_CVG)`;
        }
    }
    
    // Process charges and build complete billing picture
    billingCharges.forEach(charge => {
        const chargeData = {
            txId: charge.TX_ID,
            serviceDate: charge.SERVICE_DATE,
            postDate: charge.POST_DATE,
            procedureId: charge.PROC_ID,
            procedureName: lookups.procedure[charge.PROC_ID]?.name || charge.PROC_NAME,
            cpt: lookups.procedure[charge.PROC_ID]?.cpt,
            amount: parseFloat(charge.AMOUNT || 0),
            outstandingAmount: parseFloat(charge.OUTSTANDING_AMT || 0),
            modifiers: [charge.MODIFIER_ONE, charge.MODIFIER_TWO, charge.MODIFIER_THREE, charge.MODIFIER_FOUR].filter(Boolean),
            providerId: charge.BILLING_PROV_ID,
            providerName: lookups.provider[charge.BILLING_PROV_ID]?.name,
            departmentId: charge.DEPARTMENT_ID,
            insuranceName: charge.INSURANCE_NAME,
            sourceTable: 'ARPB_TRANSACTIONS',
            recordLocation: `ARPB_TRANSACTIONS.TX_ID = ${charge.TX_ID}`,
            actions: [],
            matches: [],
            statementHistory: [],
            invoiceDetails: null
        };
        
        // Get transaction actions
        const actions = tables.arpbTxActions.filter(a => a.TX_ID === charge.TX_ID);
        chargeData.actions = actions.map(a => ({
            actionType: a.ACTION_TYPE_C_NAME,
            actionDate: a.ACTION_DATE,
            actionAmount: a.ACTION_AMOUNT,
            remitCode: a.RMC_ID,
            remitDescription: lookups.remitCode[a.RMC_ID]?.name || a.RMC_ID_REMIT_CODE_NAME,
            denialCode: a.DENIAL_CODE,
            denialDescription: lookups.remitCode[a.DENIAL_CODE]?.name || a.DENIAL_CODE_REMIT_CODE_NAME,
            outstandingBefore: a.OUT_AMOUNT_BEFORE,
            outstandingAfter: a.OUT_AMOUNT_AFTER,
            userId: a.ACTION_USER_ID,
            userName: a.ACTION_USER_ID_NAME,
            sourceTable: 'ARPB_TX_ACTIONS',
            joinPath: `ARPB_TX_ACTIONS.TX_ID = ${charge.TX_ID}`
        }));
        
        // Get statement/claim history
        const stmHistory = tables.arpbTxStmClaim.filter(s => s.TX_ID === charge.TX_ID);
        chargeData.statementHistory = stmHistory.map(s => ({
            type: s.BC_HX_TYPE_C_NAME,
            date: s.BC_HX_DATE,
            invoiceNum: s.BC_HX_INVOICE_NUM,
            amount: s.BC_HX_AMOUNT,
            coverageId: s.BC_HX_COVERAGE_ID,
            sourceTable: 'ARPB_TX_STMCLAIMHX',
            joinPath: `ARPB_TX_STMCLAIMHX.TX_ID = ${charge.TX_ID}`
        }));
        
        // Get matches to payments/adjustments
        const matches = lookups.txMatches[charge.TX_ID] || [];
        chargeData.matches = matches.map(m => ({
            matchDate: m.MTCH_TX_HX_DT,
            matchedTxId: m.MTCH_TX_HX_ID,
            matchAmount: m.MTCH_TX_HX_AMT,
            insuranceAmount: m.MTCH_TX_HX_INS_AMT,
            userId: m.MTCH_TX_HX_DSUSR_ID,
            userName: m.MTCH_TX_HX_DSUSR_ID_NAME,
            sourceTable: 'ARPB_TX_MATCH_HX',
            joinPath: `ARPB_TX_MATCH_HX.TX_ID = ${charge.TX_ID} → ARPB_TX_MATCH_HX.MTCH_TX_HX_ID = ${m.MTCH_TX_HX_ID}`
        }));
        
        // Try to find invoice details
        const invoice = tables.invoice.find(inv => 
            inv.ACCOUNT_ID === charge.ACCOUNT_ID &&
            inv.DEPARTMENT_ID === charge.DEPARTMENT_ID
        );
        
        if (invoice) {
            const claimLines = tables.invClmLnAddl.filter(cl => 
                cl.INVOICE_ID === invoice.INVOICE_ID &&
                cl.PROC_ID === charge.PROC_ID
            );
            
            if (claimLines.length > 0) {
                chargeData.invoiceDetails = {
                    invoiceId: invoice.INVOICE_ID,
                    invoiceNum: invoice.INV_NUM || claimLines[0]?.INVOICE_NUM,
                    claimLines: claimLines.map(cl => ({
                        lineNumber: cl.CLM_LN,
                        quantity: cl.PROC_QUANTITY,
                        modifiers: [cl.PROC_MOD_1, cl.PROC_MOD_2, cl.PROC_MOD_3, cl.PROC_MOD_4].filter(Boolean),
                        claimStatus: cl.CLAIM_STATUS_C_NAME,
                        paidAmount: cl.CLAIM_PAID_AMT,
                        sourceTable: 'INV_CLM_LN_ADDL',
                        joinPath: `INVOICE.ACCOUNT_ID = ${charge.ACCOUNT_ID} → INV_CLM_LN_ADDL.INVOICE_ID = ${invoice.INVOICE_ID}`
                    }))
                };
            }
        }
        
        encounter.billing.charges.push(chargeData);
    });
    
    // Get all matched transactions (payments and adjustments)
    const allMatchedTxIds = new Set();
    encounter.billing.charges.forEach(charge => {
        charge.matches.forEach(match => {
            allMatchedTxIds.add(match.matchedTxId);
        });
    });
    
    // Also get transactions on same service date for this account
    if (accountIds.length > 0) {
        const sameDateTx = tables.arpbTransactions.filter(tx => 
            tx.SERVICE_DATE === enc.CONTACT_DATE &&
            accountIds.includes(tx.ACCOUNT_ID) &&
            tx.TX_TYPE_C_NAME !== 'Charge'
        );
        sameDateTx.forEach(tx => allMatchedTxIds.add(tx.TX_ID));
    }
    
    // Process payments
    const payments = tables.arpbTransactions.filter(tx => 
        allMatchedTxIds.has(tx.TX_ID) && tx.TX_TYPE_C_NAME === 'Payment'
    );
    
    encounter.billing.payments = payments.map(pmt => {
        const pmtData = {
            txId: pmt.TX_ID,
            serviceDate: pmt.SERVICE_DATE,
            postDate: pmt.POST_DATE,
            amount: Math.abs(parseFloat(pmt.AMOUNT || 0)),
            insuranceName: pmt.INSURANCE_NAME,
            payorId: pmt.PAYOR_ID,
            payorName: lookups.payor[pmt.PAYOR_ID] || null,
            isPatientPayment: !pmt.INSURANCE_NAME && !pmt.PAYOR_ID,
            checkNumber: pmt.CHK_NUM,
            procedureId: pmt.PROC_ID,
            procedureName: lookups.procedure[pmt.PROC_ID]?.name || pmt.PROC_NAME,
            sourceTable: 'ARPB_TRANSACTIONS',
            recordLocation: `ARPB_TRANSACTIONS.TX_ID = ${pmt.TX_ID}`,
            eobData: [],
            // Track which charges this payment applies to
            appliedToCharges: []
        };
        
        // Get EOB data
        const eobI = tables.pmtEobI.filter(e => e.TX_ID === pmt.TX_ID);
        const eobII = tables.pmtEobII.filter(e => e.TX_ID === pmt.TX_ID);
        
        pmtData.eobData = eobI.map(e => ({
            type: 'Primary EOB',
            coveredAmount: e.CVD_AMT,
            nonCoveredAmount: e.NONCVD_AMT,
            paidAmount: e.PAID_AMT,
            icn: e.ICN,
            actionAssignment: e.ACTION_ASN_NAME_C_NAME,
            sourceTable: 'PMT_EOB_INFO_I',
            joinPath: `PMT_EOB_INFO_I.TX_ID = ${pmt.TX_ID}`
        })).concat(eobII.map(e => ({
            type: 'Secondary EOB',
            amount: e.AMOUNT,
            eobCodes: e.EOB_CODES,
            adjProcId: e.ADJ_PROC_ID,
            remitCode: e.WINNINGRMC_ID,
            remitDescription: lookups.remitCode[e.WINNINGRMC_ID]?.name || e.WINNINGRMC_ID_REMIT_CODE_NAME,
            sourceTable: 'PMT_EOB_INFO_II',
            joinPath: `PMT_EOB_INFO_II.TX_ID = ${pmt.TX_ID}`
        })));
        
        // Find which charges this payment applies to
        encounter.billing.charges.forEach(charge => {
            const matchesToThisPayment = charge.matches.filter(m => m.matchedTxId === pmt.TX_ID);
            if (matchesToThisPayment.length > 0) {
                pmtData.appliedToCharges.push({
                    chargeTxId: charge.txId,
                    chargeAmount: charge.amount,
                    amountApplied: matchesToThisPayment.reduce((sum, m) => sum + m.matchAmount, 0),
                    procedureName: charge.procedureName
                });
            }
        });
        
        return pmtData;
    });
    
    // Process adjustments
    const adjustments = tables.arpbTransactions.filter(tx => 
        allMatchedTxIds.has(tx.TX_ID) && tx.TX_TYPE_C_NAME === 'Adjustment'
    );
    
    encounter.billing.adjustments = adjustments.map(adj => ({
        txId: adj.TX_ID,
        serviceDate: adj.SERVICE_DATE,
        postDate: adj.POST_DATE,
        amount: Math.abs(parseFloat(adj.AMOUNT || 0)),
        adjustmentReason: adj.ADJUSTMENT_REASON_C_NAME,
        procedureId: adj.PROC_ID,
        procedureName: lookups.procedure[adj.PROC_ID]?.name || adj.PROC_NAME,
        sourceTable: 'ARPB_TRANSACTIONS',
        recordLocation: `ARPB_TRANSACTIONS.TX_ID = ${adj.TX_ID}`
    }));
    
    // Get front-end collections
    const frontEndCollections = lookups.frontEndByCSN[csn] || [];
    encounter.billing.frontEndCollections = frontEndCollections.map(coll => ({
        date: coll.CONTACT_DATE,
        workflowType: coll.COLL_WORKFLOW_TYPE_C_NAME,
        eventType: coll.EVENT_TYPE_C_NAME,
        copayDue: parseFloat(coll.PB_COPAY_DUE || 0),
        copayCollected: parseFloat(coll.PB_COPAY_COLL || 0),
        totalCollected: parseFloat(coll.TOTAL_COLLECTED || 0),
        prevBalDue: parseFloat(coll.PB_PREV_BAL_DUE || 0),
        prevBalCollected: parseFloat(coll.PB_PREV_BAL_COLL || 0),
        sourceTable: 'FRONT_END_PMT_COLL_HX',
        joinPath: `FRONT_END_PMT_COLL_HX.PAT_ENC_CSN_ID = ${csn}`
    }));
    
    // Get account balance information
    if (accountIds.length > 0) {
        const primaryAccount = lookups.account[accountIds[0]];
        if (primaryAccount) {
            encounter.billing.accountBalances = {
                accountId: primaryAccount.ACCOUNT_ID,
                accountName: primaryAccount.ACCOUNT_NAME,
                totalBalance: primaryAccount.TOTAL_BALANCE,
                insuranceBalance: primaryAccount.INSURANCE_BALANCE,
                patientBalance: primaryAccount.PATIENT_BALANCE,
                lastInsPaymentDate: primaryAccount.LAST_INS_PMT_DATE,
                lastInsPaymentAmount: primaryAccount.LAST_INS_PMT_AMT,
                lastPatPaymentDate: primaryAccount.LAST_PAT_PMT_DATE,
                lastPatPaymentAmount: primaryAccount.LAST_PAT_PMT_AMT,
                lastStatementDate: primaryAccount.LAST_STMT_DATE,
                sourceTable: 'ACCOUNT',
                joinPath: `PAT_ACCT_CVG.PAT_ID = ${enc.PAT_ID} → PAT_ACCT_CVG.ACCOUNT_ID = ${primaryAccount.ACCOUNT_ID} → ACCOUNT`
            };
        }
    }
    
    // Try to get ICD-10 codes from claims
    if (encounter.billing.charges.length > 0) {
        const invoiceNums = new Set();
        encounter.billing.charges.forEach(charge => {
            charge.statementHistory.forEach(hist => {
                if (hist.invoiceNum) invoiceNums.add(hist.invoiceNum);
            });
        });
        
        const icd10Codes = [];
        invoiceNums.forEach(invNum => {
            const claimId = lookups.invoiceToClaimMap[invNum];
            if (claimId && lookups.claimDxMap[claimId]) {
                lookups.claimDxMap[claimId].forEach(dx => {
                    icd10Codes.push({
                        code: dx.code,
                        qualifier: dx.qualifier,
                        isPrimary: dx.qualifier === 'ABK',
                        sourceTable: 'CLM_DX',
                        joinPath: `Invoice ${invNum} → CLM_VALUES.RECORD_ID = ${claimId} → CLM_DX`
                    });
                });
            }
        });
        
        if (icd10Codes.length > 0) {
            encounter.billing.icd10Codes = icd10Codes;
        }
    }
    
    // Calculate summary
    const totalCharges = encounter.billing.charges.reduce((sum, c) => sum + c.amount, 0);
    const totalPayments = encounter.billing.payments.reduce((sum, p) => sum + p.amount, 0);
    const totalAdjustments = encounter.billing.adjustments.reduce((sum, a) => sum + a.amount, 0);
    
    encounter.billing.summary = {
        totalCharges,
        totalPayments,
        totalAdjustments,
        calculatedBalance: totalCharges - totalPayments - totalAdjustments,
        hasAnyBilling: encounter.billing.charges.length > 0 || 
                       encounter.billing.payments.length > 0 || 
                       encounter.billing.adjustments.length > 0
    };
    
    return encounter;
});

// Filter to encounters with any data
const encountersWithData = encounterData.filter(enc => 
    enc.clinical.diagnoses.length > 0 ||
    enc.clinical.reasons.length > 0 ||
    enc.clinical.orders.length > 0 ||
    enc.billing.summary.hasAnyBilling ||
    enc.billing.frontEndCollections.length > 0
);

// Sort by date descending, then by data completeness
encountersWithData.sort((a, b) => {
    const dateA = new Date(a.clinical.date);
    const dateB = new Date(b.clinical.date);
    if (dateB - dateA !== 0) return dateB - dateA;
    
    // Sort by data completeness
    const scoreA = (a.clinical.diagnoses.length > 0 ? 1 : 0) +
                   (a.clinical.orders.length > 0 ? 1 : 0) +
                   (a.billing.charges.length > 0 ? 1 : 0) +
                   (a.linkage.hasDirectCSNLink ? 1 : 0);
    const scoreB = (b.clinical.diagnoses.length > 0 ? 1 : 0) +
                   (b.clinical.orders.length > 0 ? 1 : 0) +
                   (b.billing.charges.length > 0 ? 1 : 0) +
                   (b.linkage.hasDirectCSNLink ? 1 : 0);
    
    return scoreB - scoreA;
});

// Generate statistics
const stats = {
    totalEncounters: allEncounters.length,
    encountersWithData: encountersWithData.length,
    encountersWithBilling: encountersWithData.filter(e => e.billing.summary.hasAnyBilling).length,
    encountersWithDirectCSNLink: encountersWithData.filter(e => e.linkage.hasDirectCSNLink).length,
    encountersWithoutDirectCSNLink: encountersWithData.filter(e => e.billing.summary.hasAnyBilling && !e.linkage.hasDirectCSNLink).length,
    totalCharges: encountersWithData.reduce((sum, e) => sum + e.billing.summary.totalCharges, 0),
    totalPayments: encountersWithData.reduce((sum, e) => sum + e.billing.summary.totalPayments, 0),
    totalAdjustments: encountersWithData.reduce((sum, e) => sum + e.billing.summary.totalAdjustments, 0),
    encountersByYear: {}
};

// Group by year
encountersWithData.forEach(enc => {
    const year = enc.clinical.date?.substring(0, 4) || 'Unknown';
    if (!stats.encountersByYear[year]) {
        stats.encountersByYear[year] = 0;
    }
    stats.encountersByYear[year]++;
});

// Write JSON data
console.log('Writing comprehensive billing data to JSON...');
const jsonPath = path.join(__dirname, '..', 'complete-billing-data.json');
fs.writeFileSync(jsonPath, JSON.stringify({
    metadata: {
        generatedAt: new Date().toISOString(),
        tableCount: Object.keys(tables).length,
        encounterCount: encountersWithData.length,
        dataSource: 'Epic EHI Export'
    },
    statistics: stats,
    encounters: encountersWithData
}, null, 2));

console.log(`JSON data written to: ${jsonPath}`);
console.log(`\nStatistics:`);
console.log(`- Total encounters processed: ${stats.totalEncounters}`);
console.log(`- Encounters with data: ${stats.encountersWithData}`);
console.log(`- Encounters with billing: ${stats.encountersWithBilling}`);
console.log(`- Encounters with direct CSN linkage: ${stats.encountersWithDirectCSNLink}`);
console.log(`- Encounters using indirect matching: ${stats.encountersWithoutDirectCSNLink}`);
console.log(`- Total charges: $${stats.totalCharges.toFixed(2)}`);
console.log(`- Total payments: $${stats.totalPayments.toFixed(2)}`);
console.log(`- Total adjustments: $${stats.totalAdjustments.toFixed(2)}`);

// Generate summary for HTML
const summary = {
    stats,
    topIssues: [
        {
            issue: 'No Direct CSN Linkage',
            count: encountersWithData.filter(e => !e.linkage.hasDirectCSNLink && e.billing.summary.hasAnyBilling).length,
            description: 'Billing linked only by date/department matching - may include other encounters'
        },
        {
            issue: 'Missing ICD-10 Codes',
            count: encountersWithData.filter(e => e.clinical.diagnoses.length > 0 && !e.billing.icd10Codes).length,
            description: 'Diagnoses present but no ICD-10 codes found in claims'
        },
        {
            issue: 'Unmatched Charges',
            count: encountersWithData.reduce((sum, e) => 
                sum + e.billing.charges.filter(c => c.matches.length === 0).length, 0),
            description: 'Charges with no linked payments or adjustments'
        }
    ]
};

// Write summary for HTML generation
const summaryPath = path.join(__dirname, '..', 'billing-summary.json');
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

console.log('\nData generation complete. Ready for HTML report generation.');