# Epic EHI Billing Analysis - Complete Documentation

## Overview

This document provides comprehensive documentation for analyzing Epic EHI Export billing data, including:
- Complete table relationships and data models
- Analysis scripts and their outputs
- Data quality issues and solutions
- Implementation patterns and best practices

## Project Structure

```
example-analysis/
├── billing-notes.md                    # This documentation
├── scripts/
│   ├── generate-complete-billing-analysis.js    # Main analysis script
│   ├── generate-billing-html-with-tooltips.js   # HTML report generator
│   └── generate-billing-dashboard.js            # Interactive dashboard
├── complete-billing-data.json          # Processed billing data
├── billing-summary.json                # Summary statistics
├── complete-billing-analysis.html      # Detailed HTML report
└── billing-dashboard.html              # Interactive dashboard
```

## Analysis Scripts

### 1. generate-complete-billing-analysis.js
**Purpose**: Core script that processes all Epic tables to extract and link billing data

**Key Features**:
- Processes 35+ Epic tables to find billing relationships
- Implements proper CSN linkage via ARPB_VISITS/HAR_ALL
- Extracts ICD-10 codes from CLM_DX tables
- Tracks complete transaction lifecycle with matches
- Generates comprehensive JSON output

**Usage**:
```bash
node scripts/generate-complete-billing-analysis.js
```

**Output**: 
- `complete-billing-data.json` - All encounter and billing details
- `billing-summary.json` - Summary statistics

### 2. generate-billing-html-with-tooltips.js
**Purpose**: Creates detailed HTML report with data lineage tooltips

**Key Features**:
- Interactive tooltips showing data sources and join paths
- Complete billing timeline for each encounter
- Adjustment details with days from service
- Claim line details with meaningful data only
- Color-coded billing status indicators

**Usage**:
```bash
node scripts/generate-billing-html-with-tooltips.js
```

**Output**: `complete-billing-analysis.html`

### 3. generate-billing-dashboard.js
**Purpose**: Creates interactive dashboard with visualizations

**Key Features**:
- Faceting controls (department, year, insurance, procedure)
- Payment velocity curves
- Dense payment timeline histogram
- Collection rate analysis
- Department and insurance performance tables
- Real-time filtering updates all charts

**Usage**:
```bash
node scripts/generate-billing-dashboard.js
```

**Output**: `billing-dashboard.html`

## Key Discoveries and Solutions

### 1. CSN Linkage Solution
**Problem**: Epic doesn't directly link encounters (CSN) to billing transactions
**Solution**: Found proper linkage through ARPB_VISITS table
```javascript
// Correct linkage path:
PAT_ENC.PAT_ENC_CSN_ID → ARPB_VISITS.VISIT_NUMBER → ARPB_VISITS.PB_VISIT_NUM → ARPB_TRANSACTIONS.VISIT_NUMBER
```

### 2. Missing ICD-10 Codes
**Problem**: CLARITY_EDG table didn't contain ICD-10 codes
**Solution**: Retrieved from CLM_DX table via invoice linkage
```javascript
INVOICE.INV_NUM → CLM_VALUES.INV_NUM → CLM_VALUES.RECORD_ID → CLM_DX.RECORD_ID → CLM_DX.CLM_DX
```

### 3. Payment vs Adjustment Identification
**Problem**: Both show as negative amounts in transactions
**Solution**: Check CLARITY_TDL_TRAN for transaction type mapping

### 4. Adjustment Timing Calculations
**Problem**: "0 days after service" showing incorrectly
**Solution**: Calculate from encounter date, not service date on adjustment transaction

## Core Billing Entity Relationships

Understanding how accounts, transactions, invoices, and claims relate is crucial for Epic billing analysis:

### 1. Accounts (ACCOUNT)
- **What it is**: A billing container that groups charges for a patient/guarantor
- **Key concept**: One patient can have multiple accounts (e.g., different insurance periods, guarantors)
- **Real-world analogy**: Like a credit card account - holds all charges and payments
- **Key fields**: 
  - `ACCOUNT_ID`: Unique identifier
  - `TOTAL_BALANCE`, `INSURANCE_BALANCE`, `PATIENT_BALANCE`: Current balances
- **Relationships**:
  - Links to patients via PAT_ACCT_CVG table
  - All transactions (charges/payments) reference an account

### 2. Transactions (ARPB_TRANSACTIONS)
- **What it is**: Individual financial events - charges, payments, or adjustments
- **Key concept**: Every billable service creates a charge transaction; payments and adjustments are separate transactions
- **Real-world analogy**: Like individual line items on a credit card statement
- **Transaction Types**:
  - **Charge**: Positive amount, created when service rendered
  - **Payment**: Negative amount, money received from insurance or patient
  - **Adjustment**: Negative amount, contractual write-offs or corrections
- **Key fields**:
  - `TX_ID`: Unique transaction identifier
  - `TX_TYPE_C_NAME`: Type of transaction
  - `SERVICE_DATE`: When service was provided (preserved across lifecycle)
  - `POST_DATE`: When transaction was entered
  - `ACCOUNT_ID`: Which account this belongs to
- **Relationships**:
  - Belongs to one account
  - Can be matched to other transactions (payments match to charges)
  - Has modification history in ARPB_TX_ACTIONS

### 3. Invoices (INVOICE)
- **What it is**: A billing statement grouping related charges for submission
- **Key concept**: Invoices group transactions for billing purposes (to insurance or patient)
- **Real-world analogy**: Like a bill you receive - groups multiple services together
- **Key fields**:
  - `INVOICE_ID`: Unique identifier
  - `ACCOUNT_ID`: Which account this invoice belongs to
  - `INIT_INSURANCE_BAL`, `INIT_SELF_PAY_BAL`: Starting balances
- **Relationships**:
  - Groups multiple transactions from an account
  - Links to claim details when submitted to insurance
  - Transactions can appear on multiple invoices over time

### 4. Claims (CLM_VALUES, CLM_DX)
- **What it is**: Insurance submission with required medical coding
- **Key concept**: Claims are invoices formatted for insurance with diagnoses and procedures
- **Real-world analogy**: Like an insurance form - invoice plus medical justification
- **Key tables**:
  - `CLM_VALUES`: Claim header with provider/payer info
  - `CLM_DX`: Diagnosis codes (ICD-10) for the claim
  - `INV_CLM_LN_ADDL`: Detailed procedure lines with modifiers
- **Relationships**:
  - Based on an invoice
  - Contains ICD-10 codes not stored elsewhere
  - Results in EOB data when processed

### Visual Relationship Flow

```
PATIENT (PAT_ENC) 
    ↓ (via PAT_ACCT_CVG)
ACCOUNT (billing container)
    ↓
TRANSACTIONS (individual charges/payments)
    ↓ (grouped for billing)
INVOICE (statement to insurance/patient)
    ↓ (formatted with codes)
CLAIM (insurance submission)
    ↓ (insurance processes)
EOB + PAYMENT TRANSACTION
    ↓ (matched back via ARPB_TX_MATCH_HX)
Original CHARGE TRANSACTION (balance updated)
```

### Key Insights

1. **Accounts are containers**: Think of accounts like buckets that hold all financial transactions for a patient/guarantor combination

2. **Transactions are events**: Each service, payment, and adjustment is a separate transaction record

3. **Invoices group transactions**: When it's time to bill, transactions are grouped into invoices

4. **Claims add medical coding**: Invoices sent to insurance become claims with ICD-10 and CPT codes

5. **Everything links back**: Payments and adjustments link back to original charges via ARPB_TX_MATCH_HX

### Common Confusions Clarified

- **One encounter, many transactions**: A single visit can generate multiple charge transactions (lab, procedure, E&M)
- **SERVICE_DATE vs POST_DATE**: SERVICE_DATE stays constant (when service happened), POST_DATE changes (when entered/paid)
- **Negative amounts**: Payments and adjustments are negative; charges are positive
- **No direct CSN link**: Encounters (clinical) don't directly link to transactions (financial) - must match via date/account

## Table Categories and Relationships

### 1. Core Transaction Tables

#### ARPB_TRANSACTIONS
- **Purpose**: Core billing ledger containing all charges, payments, and adjustments
- **Key Fields**:
  - `TX_ID`: Unique transaction identifier
  - `TX_TYPE_C_NAME`: Type (Charge, Payment, Adjustment)
  - `SERVICE_DATE`: Original service date (preserved through lifecycle)
  - `POST_DATE`: Date transaction was posted
  - `AMOUNT`: Transaction amount (negative for payments/adjustments)
  - `OUTSTANDING_AMT`: Balance remaining on transaction
  - `ACCOUNT_ID`: Links to patient account
  - `DEPARTMENT_ID`: Service department
  - `PROC_ID`: Procedure code identifier
- **Linkage**: No direct CSN link; must use date/department/account matching

#### ARPB_TX_ACTIONS
- **Purpose**: Tracks all modifications to transactions (adjustments, denials, write-offs)
- **Key Fields**:
  - `TX_ID`: Links to ARPB_TRANSACTIONS
  - `ACTION_TYPE_C_NAME`: Type of action taken
  - `ACTION_AMOUNT`: Amount of the action
  - `RMC_ID`: Remit code
  - `RMC_ID_REMIT_CODE_NAME`: Remit code description
  - `OUT_AMOUNT_BEFORE/AFTER`: Outstanding balance change
  - `ACTION_USER_ID_NAME`: User who performed action
- **Critical Finding**: Contains remit codes explaining why adjustments were made

#### ARPB_TX_MATCH_HX
- **Purpose**: Links payments and adjustments to original charges
- **Key Fields**:
  - `TX_ID`: Transaction being matched
  - `MTCH_TX_HX_ID`: Matched transaction ID
  - `MTCH_TX_HX_AMT`: Amount matched
  - `MTCH_TX_HX_DT`: Date of matching
- **Usage**: Essential for tracing which payments/adjustments apply to which charges

#### ARPB_TX_STMCLAIMHX
- **Purpose**: Statement and claim submission history
- **Key Fields**:
  - `TX_ID`: Transaction ID
  - `BC_HX_TYPE_C_NAME`: Type (Statement/Claim)
  - `BC_HX_DATE`: Submission date
  - `BC_HX_INVOICE_NUM`: Invoice number
- **Usage**: Shows when claims were sent to insurance and statements to patients

### 2. Account and Balance Tables

#### ACCOUNT
- **Purpose**: Master account record with real-time balances
- **Key Balance Fields**:
  - `TOTAL_BALANCE`: Current total balance
  - `INSURANCE_BALANCE`: Amount owed by insurance
  - `PATIENT_BALANCE`: Amount owed by patient
  - `LAST_INS_PMT_DATE`: Last insurance payment date
  - `LAST_PAT_PMT_DATE`: Last patient payment date
  - `LAST_STMT_DATE`: Last statement sent date
- **Critical**: Use these fields instead of calculating balances

#### PAT_ACCT_CVG
- **Purpose**: Links patients to accounts by coverage
- **Key Fields**:
  - `PAT_ID`: Patient identifier
  - `ACCOUNT_ID`: Account identifier
  - `ACCOUNT_ACTIVE_YN`: Active flag
- **Usage**: Required to link PAT_ENC to billing accounts

### 3. Invoice and Claim Details

#### INVOICE
- **Purpose**: Invoice headers with initial balances
- **Key Fields**:
  - `INVOICE_ID`: Unique invoice identifier
  - `ACCOUNT_ID`: Links to account
  - `DEPARTMENT_ID`: Service department
  - `INIT_INSURANCE_BAL`: Initial insurance balance
  - `INIT_SELF_PAY_BAL`: Initial patient balance

#### INV_CLM_LN_ADDL
- **Purpose**: Detailed claim line information
- **Key Fields**:
  - `INVOICE_ID`: Links to INVOICE
  - `PROC_ID`: Procedure code
  - `PROC_QUANTITY`: Units
  - `PROC_MOD_1/2/3/4`: CPT modifiers
  - `CLAIM_STATUS_C_NAME`: Claim status
  - `CLAIM_PAID_AMT`: Amount paid on line
- **Usage**: Contains units, modifiers, NDC codes missing from ARPB_TRANSACTIONS

#### CLM_DX
- **Purpose**: Contains actual ICD-10 diagnosis codes
- **Key Fields**:
  - `RECORD_ID`: Links to CLM_VALUES
  - `CLM_DX`: ICD-10 code (e.g., "Z00.00")
  - `CLM_DX_QUAL`: Qualifier (ABK = primary)
- **Critical**: This is where actual ICD-10 codes live, not CLARITY_EDG

### 4. Clinical Linkage Tables

#### ORDER_PROC
- **Purpose**: Clinical orders with CSN linkage
- **Key Fields**:
  - `PAT_ENC_CSN_ID`: Direct CSN link!
  - `PROC_ID`: Procedure ordered
  - `ORDERING_DATE`: When ordered
- **Critical**: Provides unique CSN-to-billing linkage

#### PAT_ENC_DX
- **Purpose**: Encounter diagnoses
- **Key Fields**:
  - `PAT_ENC_CSN_ID`: Encounter CSN
  - `DX_ID`: Diagnosis identifier
  - `PRIMARY_DX_YN`: Primary diagnosis flag

### 5. EOB and Payment Details

#### PMT_EOB_INFO_I
- **Purpose**: Primary EOB information
- **Key Fields**:
  - `TX_ID`: Links to payment transaction
  - `CVD_AMT`: Covered amount
  - `NONCVD_AMT`: Non-covered amount
  - `PAID_AMT`: Amount paid
  - `ICN`: Insurance claim number

#### PMT_EOB_INFO_II
- **Purpose**: Secondary EOB details with adjustment codes
- **Key Fields**:
  - `TX_ID`: Links to payment transaction
  - `AMOUNT`: Adjustment amount
  - `EOB_CODES`: Explanation codes
  - `WINNINGRMC_ID_REMIT_CODE_NAME`: Remit code description

## Linkage Methods

### 1. CSN to Billing Linkage (Best to Worst)

#### Method 1: Direct CSN Linkage via ORDER_PROC (BEST)
```
PAT_ENC.PAT_ENC_CSN_ID → ORDER_PROC.PAT_ENC_CSN_ID → ORDER_PROC.PROC_ID → ARPB_TRANSACTIONS.PROC_ID
```
- Provides direct CSN-to-billing linkage (encounter-specific)
- Only available when orders exist for the encounter
- Most accurate - guarantees billing belongs to this specific encounter

#### Method 2: Direct CSN Linkage via Front-End Collections
```
PAT_ENC.PAT_ENC_CSN_ID → FRONT_END_PMT_COLL_HX.PAT_ENC_CSN_ID
```
- Direct CSN link but only for copay collections
- Limited to front-desk payment tracking

#### Method 3: Indirect Matching via Date/Department/Account (WEAKEST)
```
PAT_ENC.CONTACT_DATE + DEPARTMENT_ID → ARPB_TRANSACTIONS.SERVICE_DATE + DEPARTMENT_ID
Plus: PAT_ENC.PAT_ID → PAT_ACCT_CVG.PAT_ID → PAT_ACCT_CVG.ACCOUNT_ID → ARPB_TRANSACTIONS.ACCOUNT_ID
```
- No direct CSN linkage - matches by circumstantial evidence
- Prone to including charges from other encounters on same day/dept
- Most common method but least accurate

### 2. ICD-10 Code Retrieval

```
INVOICE.INV_NUM → CLM_VALUES.INV_NUM → CLM_VALUES.RECORD_ID → CLM_DX.RECORD_ID → CLM_DX.CLM_DX
```
- CLARITY_EDG may not have ICD-10 codes populated
- CLM_DX contains actual submitted codes

### 3. Transaction Matching

```
ARPB_TRANSACTIONS(Charge).TX_ID → ARPB_TX_MATCH_HX.TX_ID → ARPB_TX_MATCH_HX.MTCH_TX_HX_ID → ARPB_TRANSACTIONS(Payment/Adjustment).TX_ID
```
- Essential for linking payments to charges
- One payment can match multiple charges

## Data Quality Issues and Solutions

### Issue 1: No Direct CSN in Billing Tables
- **Problem**: ARPB_TRANSACTIONS lacks PAT_ENC_CSN_ID
- **Solution**: Use ORDER_PROC for CSN linkage when available
- **Fallback**: Date/department matching with warnings

### Issue 2: Missing ICD-10 Codes
- **Problem**: CLARITY_EDG doesn't contain ICD-10 codes in sample
- **Solution**: Use CLM_DX table linked through invoices
- **Fallback**: Show "N/A" with explanation

### Issue 3: Balance Discrepancies
- **Problem**: Calculated balance doesn't match ACCOUNT.TOTAL_BALANCE
- **Solution**: Always show both calculated and actual balances
- **Reason**: Timing differences or transactions outside date range

### Issue 4: Duplicate Encounters Same Day/Department
- **Problem**: Multiple encounters on same date in same department
- **Solution**: Prioritize ORDER_PROC linkage, warn when using date/dept matching

## Complete Billing Workflow

### 1. Clinical Encounter
- Patient arrives, encounter created (PAT_ENC)
- Diagnoses recorded (PAT_ENC_DX)
- Orders placed (ORDER_PROC) - creates CSN linkage

### 2. Charge Generation
- Charges posted to ARPB_TRANSACTIONS
- SERVICE_DATE = encounter date (preserved)
- POST_DATE = when entered (may be days later)
- OUTSTANDING_AMT = full charge amount

### 3. Claim Submission
- Invoice created (INVOICE)
- Claim details added (INV_CLM_LN_ADDL)
- ICD-10 codes submitted (CLM_DX)
- Submission tracked (ARPB_TX_STMCLAIMHX)

### 4. Insurance Processing (30-90 days later)
- EOB received (PMT_EOB_INFO_I/II)
- Payment posted (ARPB_TRANSACTIONS with TX_TYPE='Payment')
- Payment matched to charges (ARPB_TX_MATCH_HX)
- Contractual adjustment posted (ARPB_TRANSACTIONS with TX_TYPE='Adjustment')
- Adjustment actions recorded (ARPB_TX_ACTIONS) with remit codes

### 5. Balance Resolution
- OUTSTANDING_AMT updated on charges
- ACCOUNT balances updated in real-time
- Patient statements sent (ARPB_TX_STMCLAIMHX)
- Patient payments posted

## Key Insights

1. **SERVICE_DATE Preservation**: All transactions maintain original service date even when posted months later

2. **Transaction Actions Critical**: ARPB_TX_ACTIONS explains WHY adjustments were made via remit codes

3. **Real vs Calculated Balances**: Always use ACCOUNT balance fields as source of truth

4. **Payment Lag Normal**: 30-90 day delay between service and payment is standard

5. **One-to-Many Relationships**: One payment often applies to multiple charges

6. **Modifiers and Units**: Found in INV_CLM_LN_ADDL, not in ARPB_TRANSACTIONS

7. **Statement History**: ARPB_TX_STMCLAIMHX shows when bills sent to patients/insurance

## SQL-Like Query Patterns

### Get all billing for an encounter:
```sql
-- Step 1: Get procedures from orders
SELECT PROC_ID FROM ORDER_PROC WHERE PAT_ENC_CSN_ID = {csn}

-- Step 2: Get charges
SELECT * FROM ARPB_TRANSACTIONS 
WHERE PROC_ID IN ({procedure_ids}) 
AND SERVICE_DATE = {encounter_date}
AND TX_TYPE_C_NAME = 'Charge'

-- Step 3: Get transaction history
SELECT * FROM ARPB_TX_ACTIONS WHERE TX_ID IN ({charge_ids})

-- Step 4: Get matches
SELECT * FROM ARPB_TX_MATCH_HX WHERE TX_ID IN ({charge_ids})

-- Step 5: Get matched payments/adjustments
SELECT * FROM ARPB_TRANSACTIONS WHERE TX_ID IN ({matched_tx_ids})
```

### Get ICD-10 codes for encounter:
```sql
-- Via invoice linkage
SELECT cd.CLM_DX, cd.CLM_DX_QUAL
FROM CLM_DX cd
JOIN CLM_VALUES cv ON cd.RECORD_ID = cv.RECORD_ID
JOIN INVOICE i ON cv.INV_NUM = i.INV_NUM
WHERE i.ACCOUNT_ID = {account_id}
AND i.DEPARTMENT_ID = {department_id}
```

### Get current balance:
```sql
SELECT TOTAL_BALANCE, INSURANCE_BALANCE, PATIENT_BALANCE
FROM ACCOUNT
WHERE ACCOUNT_ID = {account_id}
```

## Implementation Checklist

When building billing reports:
- [ ] Use ORDER_PROC for CSN linkage first
- [ ] Include ARPB_TX_ACTIONS for complete history
- [ ] Show both calculated and ACCOUNT balances
- [ ] Include ARPB_TX_STMCLAIMHX for submission dates
- [ ] Get ICD-10 from CLM_DX not CLARITY_EDG
- [ ] Include INV_CLM_LN_ADDL for modifiers/units
- [ ] Use ARPB_TX_MATCH_HX to link payments to charges
- [ ] Show remit codes from TX_ACTIONS
- [ ] Include data quality warnings
- [ ] Preserve SERVICE_DATE for all transactions