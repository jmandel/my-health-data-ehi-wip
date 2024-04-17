export {};

/**
 * The items populated at the time a guarantor account is created.
 * pk: ACCT_ID, CONTACT_DATE_REAL
 */
export interface ACCOUNT_CREATION {
    /**
     * The unique identifier for the guarantor record.
     */
    ACCT_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The account creation contact number.
     */
    CONTACT_NUM: number;
    /**
     * Name of user who created a guarantor account
     */
    ACCOUNT_CREATOR: string;
    /**
     * Reference to parent ACCOUNT
     */
    account?: ACCOUNT;
}

/**
 * This table contains one row for each line of the billing address of a guarantor account.
 * pk: ACCOUNT_ID, ADDRESS_LINE
 */
export interface ACCT_ADDR {
    /**
     * The unique identifier for the guarantor record
     */
    ACCOUNT_ID: number;
    /**
     * The line number for the guarantor billing address
     */
    ADDRESS_LINE: number;
    /**
     * This represents the guarantor's street address
     */
    ADDRESS: string;
    /**
     * Reference to parent ACCOUNT
     */
    account?: ACCOUNT;
}

/**
 * This table contains coverage lists for every accounts receivable (EAR) record.
 * pk: ACCOUNT_ID, LINE
 */
export interface ACCT_COVERAGE {
    /**
     * The unique account record ID
     */
    ACCOUNT_ID: number;
    /**
     * Line number to identify the status information within the account.
     */
    LINE: number;
    /**
     * The coverage ID for the guarantor record.
     */
    COVERAGE_ID: number;
    /**
     * Reference to COVERAGE based on COVERAGE_ID
     */
    coverage?: COVERAGE;
    /**
     * Reference to parent ACCOUNT
     */
    account?: ACCOUNT;
}

/**
 * This table contains information about the account guarantor - patient relationship.
 * pk: ACCOUNT_ID, LINE
 */
export interface ACCT_GUAR_PAT_INFO {
    /**
     * The unique ID for the account
     */
    ACCOUNT_ID: number;
    /**
     * Line number to uniquely identify the patient within the guarantor account.
     */
    LINE: number;
    /**
     * The unique ID for the patient related to the guarantor of the account.
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * The relationship of the patient to the guarantor of the account (e.g
     */
    GUAR_REL_TO_PAT_C_NAME: string;
    /**
     * Indicates whether the patient address and the guarantor address are linked.
     */
    PATIENT_ADDR_LINKED_YN: string;
    /**
     * Reference to parent ACCOUNT
     */
    account?: ACCOUNT;
}

/**
 * This table contains the guarantor's home phone history.
 * pk: ACCOUNT_ID, LINE
 */
export interface ACCT_HOME_PHONE_HX {
    /**
     * The unique identifier for the account record.
     */
    ACCOUNT_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The date the home phone number was changed.
     */
    CHANGE_DATE: Date;
    /**
     * The home phone number on the account.
     */
    PHONE_NUMBER: string;
    /**
     * The source of the change of the home phone number.
     */
    CHANGE_SOURCE_C_NAME: string;
    /**
     * Reference to parent ACCOUNT
     */
    account?: ACCOUNT;
}

/**
 * This tables stores the unique IDs of the transaction (ETR) records  for account records.
 * pk: ACCOUNT_ID, LINE
 */
export interface ACCT_TX {
    /**
     * The unique identifier for the guarantor record.
     */
    ACCOUNT_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The unique ID associated with the transaction record for this row
     */
    TX_ID: number;
    /**
     * Reference to ARPB_TRANSACTIONS based on TX_ID
     */
    tx?: ARPB_TRANSACTIONS;
    /**
     * Reference to parent ACCOUNT
     */
    account?: ACCOUNT;
}

/**
 * This table holds all information related to additional evaluation and management (E/M) codes.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface ADDITIONAL_EM_CODE {
    /**
     * A unique serial number for this encounter
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * Procedure codes used in addition to the Level of Service (LOS).
     */
    EM_CODE_ADDL_ID: number;
    /**
     * Reference to CLARITY_EAP based on EM_CODE_ADDL_ID
     */
    em_code_addl?: CLARITY_EAP;
    /**
     * The billing provider for the additional Evaluation and Management (E/M) codes.
     */
    EM_CODE_BILPROV_ID: string;
    /**
     * Reference to CLARITY_SER based on EM_CODE_BILPROV_ID
     */
    em_code_bilprov?: CLARITY_SER;
    /**
     * Unique number associated with each additional E/M code
     */
    EM_CODE_UNIQUE_NUM: string;
}

/**
 * The ALL_EPISODE_CSN_LINKS table contains one row for each master file link added to an episode
 * pk: EPISODE_ID, LINE
 */
export interface ALL_EPISODE_CSN_LINKS {
    /**
     * The unique ID of the episode of care record for this row.
     */
    EPISODE_ID: number;
    /**
     * This identifies the link master file.
     */
    LINE: number;
    /**
     * Reference to parent EPISODE
     */
    episode?: EPISODE;
}

/**
 * This table holds data of whether the patient's allergies were marked as containing no drug allergies.
 * pk: PAT_ID, LINE
 */
export interface ALLERGY_FLAG {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column stores a "Y" if the patient's "No Known Allergies" checkbox is selected and an "N" if the checkbox is not selected.
     */
    ALRGY_FLAG_YN: string;
    /**
     * This item stores the user who updated the patient's No Known Allergies status.
     */
    ALRGY_FLG_UPD_BY_ID: string;
    /**
     * Reference to CLARITY_EMP based on ALRGY_FLG_UPD_BY_ID
     */
    alrgy_flg_upd_by?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ALRGY_FLG_UPD_BY_ID_NAME: string;
    /**
     * This item stores the instant of update for when the patient's No Known Allergies status is changed.
     */
    ALRGY_FLAG_UPD_DTTM: Date;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * The ALLERGY_REACTIONS table contains the category values of the reactions associated with a given allergy
 * pk: ALLERGY_ID, LINE
 */
export interface ALLERGY_REACTIONS {
    /**
     * The unique ID used to identify the allergy record.
     */
    ALLERGY_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The integer category value corresponding to the type of allergy reaction
     */
    REACTION_C_NAME: string;
    /**
     * Reference to parent ALLERGY
     */
    allergy?: ALLERGY;
}

/**
 * The ALLERGY table contains information about the allergies noted in your patients' clinical system records
 * pk: ALLERGY_ID
 */
export interface ALLERGY {
    /**
     * The unique ID used to identify the allergy record.
     */
    ALLERGY_ID: number;
    /**
     * Reference to PROBLEM_LIST_ALL based on ALLERGY_ID
     */
    allergy?: PROBLEM_LIST_ALL;
    /**
     * The unique ID assigned to the allergen (Agent) record.
     */
    ALLERGEN_ID: number;
    /**
     * Reference to CL_ELG based on ALLERGEN_ID
     */
    allergen?: CL_ELG;
    /**
     * The name of the allergen record.
     */
    ALLERGEN_ID_ALLERGEN_NAME: string;
    /**
     * The date the patient made it known that they had experienced an allergic reaction in calendar format.
     */
    DATE_NOTED: Date;
    /**
     * The unique ID of the clinical system user who entered this allergy into the patient�s record
     */
    ENTRY_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on ENTRY_USER_ID
     */
    entry_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ENTRY_USER_ID_NAME: string;
    /**
     * The allergy type category value, describing the nature or character of the allergy (i.e
     */
    SEVERITY_C_NAME: string;
    /**
     * This item stores the severity of an allergy.
     */
    ALLERGY_SEVERITY_C_NAME: string;
    /**
     * The status category number for this allergy record
     */
    ALRGY_STATUS_C_NAME: string;
    /**
     * The date and time the allergy was entered into the patient's record using a calendar format
     */
    ALRGY_ENTERED_DTTM: Date;
    /**
     * The patient contact corresponding to the patient encounter in which this allergy was edited.
     */
    ALLERGY_PAT_CSN: number;
    /**
     * The noted date accuracy of an allergy determines the accuracy of the noted date specified in DATE_NOTED
     */
    ALLERGY_NOTED_DATE_ACCURACY_C_NAME: string;
    /**
     * Collection of ALLERGY_REACTIONS as children
     */
    allergy_reactions?: ALLERGY_REACTIONS[];
}

/**
 * Information about the patient and their contacts selected to receive appointment letters.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface APPT_LETTER_RECIPIENTS {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * A unique contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * A unique ID of the patient contact to indicate if the patient contact should receive appointment letters for a given visit.
     */
    PAT_RELATIONSHIP_ID: number;
    /**
     * Indicates whether a patient or a patient's contact should receive appointment letters for this visit
     */
    SHOULD_RECEIVE_LETTERS_YN: string;
    /**
     * Indicates whether a patient or a patient's contact should attend this visit
     */
    SHOULD_ATTEND_VISIT_YN: string;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * This table stores information about appointment requests.
 * pk: REQUEST_ID
 */
export interface APPT_REQUEST {
    /**
     * The unique identifier (.1 item) for the appointment request record
     */
    REQUEST_ID: number;
    /**
     * Reference to ORDER_PROC based on REQUEST_ID
     */
    request?: ORDER_PROC;
}

/**
 * Stores authorization information for a charge transaction.
 * pk: TX_ID, LINE
 */
export interface ARPB_AUTH_INFO {
    /**
     * The unique identifier for the transaction record.
     */
    TX_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Lists all the coverages on the guarantor account for this transaction.
     */
    OVRD_AUTH_CVG_ID: number;
    /**
     * This stores the last time an authorization was assigned.
     */
    AUTH_UPDATE_DTTM: Date;
    /**
     * Reference to parent ARPB_TRANSACTIONS
     */
    arpb_transactions?: ARPB_TRANSACTIONS;
}

/**
 * The table lists all diagnoses on a charge entry session in which the charge was posted.
 * pk: TX_ID, LINE
 */
export interface ARPB_CHG_ENTRY_DX {
    /**
     * The unique internal ID of the transaction record representing this charge.
     */
    TX_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The diagnosis internal ID (EDG .1) associated with the charge entry session
     */
    DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on DX_ID
     */
    dx?: CLARITY_EDG;
    /**
     * Qualifier for the diagnosis on this line
     */
    DX_QUALIFIER_C_NAME: string;
    /**
     * Reference to parent ARPB_TRANSACTIONS
     */
    arpb_transactions?: ARPB_TRANSACTIONS;
}

/**
 * Denial records associated with this payment for evaluating denial rate metrics.
 * pk: TX_ID, LINE
 */
export interface ARPB_PMT_RELATED_DENIALS {
    /**
     * The unique identifier for the transaction record.
     */
    TX_ID: number;
    /**
     * Reference to ARPB_TRANSACTIONS based on TX_ID
     */
    tx?: ARPB_TRANSACTIONS;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Returns denial records associated with this payment for purposes of denial rate calculations
     */
    RELATED_BDC_ID: number;
    /**
     * Reference to BDC_INFO based on RELATED_BDC_ID
     */
    related_bdc?: BDC_INFO;
}

/**
 * This table contains information about actions performed on professional billing transactions.
 * pk: TX_ID, LINE
 */
export interface ARPB_TX_ACTIONS {
    /**
     * The unique key or identification number for a given transaction.
     */
    TX_ID: number;
    /**
     * This column contains the line count for the information in this table
     */
    LINE: number;
    /**
     * The action type category ID taken on the transaction.
     */
    ACTION_TYPE_C_NAME: string;
    /**
     * The date in which this action is performed.
     */
    ACTION_DATE: Date;
    /**
     * The amount associated with this action.
     */
    ACTION_AMOUNT: number;
    /**
     * The Payor associated with this action.
     */
    PAYOR_ID: number;
    /**
     * The denial code associated with this action.
     */
    DENIAL_CODE: string;
    /**
     * The name of each remittance code.
     */
    DENIAL_CODE_REMIT_CODE_NAME: string;
    /**
     * The date this transaction was posted in calendar format.
     */
    POST_DATE: Date;
    /**
     * The statement date of this transaction.
     */
    STMT_DATE: Date;
    /**
     * Outstanding amount of associated transaction before the action is performed.
     */
    OUT_AMOUNT_BEFORE: number;
    /**
     * Outstanding amount of the associated transaction after the action is performed.
     */
    OUT_AMOUNT_AFTER: number;
    /**
     * Insurance amount of the associated transaction before the action is performed.
     */
    INS_AMOUNT_BEFORE: number;
    /**
     * Insurance amount of the associated transaction after the action is performed.
     */
    INS_AMOUNT_AFTER: number;
    /**
     * The Payor of the associated transaction before the action is performed.
     */
    BEFORE_PAYOR_ID: number;
    /**
     * The Payor of the associated transaction after the action is performed.
     */
    AFTER_PAYOR_ID: number;
    /**
     * The coverage of the associated transaction before the action is performed.
     */
    BEFORE_CVG_ID: number;
    /**
     * The coverage of the associated transaction after the action is performed.
     */
    AFTER_CVG_ID: number;
    /**
     * The unique ID of the user who performed this action.
     */
    ACTION_USER_ID: string;
    /**
     * The name of the user record
     */
    ACTION_USER_ID_NAME: string;
    /**
     * If an adjustment is associated with this action, this column contains the adjustment code of that adjustment.
     */
    ADJ_CODE_ID: number;
    /**
     * The first reason code ID associated with this action.
     */
    RMC_ID: string;
    /**
     * The name of each remittance code.
     */
    RMC_ID_REMIT_CODE_NAME: string;
    /**
     * The Payor of the payment if this action is associated with a payment.
     */
    PMT_PAYOR_ID: number;
    /**
     * Place of Service ID of the transaction.
     */
    POS_ID: number;
    /**
     * Reference to CLARITY_LOC based on POS_ID
     */
    pos?: CLARITY_LOC;
    /**
     * Department ID of this transaction.
     */
    DEPARTMENT_ID: number;
    /**
     * Reference to CLARITY_DEP based on DEPARTMENT_ID
     */
    department?: CLARITY_DEP;
    /**
     * The procedure ID for the transaction record.
     */
    PROC_ID: number;
    /**
     * Reference to CLARITY_EAP based on PROC_ID
     */
    proc?: CLARITY_EAP;
    /**
     * Location Id for this transaction
     */
    LOCATION_ID: number;
    /**
     * Reference to CLARITY_LOC based on LOCATION_ID
     */
    location?: CLARITY_LOC;
    /**
     * Service Area ID for this transaction
     */
    SERVICE_AREA_ID: number;
    /**
     * Reference to CLARITY_SA based on SERVICE_AREA_ID
     */
    service_area?: CLARITY_SA;
    /**
     * The internal ID of the record that maintains the patient's transactions
     */
    ACCOUNT_ID: number;
    /**
     * Reference to ACCOUNT based on ACCOUNT_ID
     */
    account?: ACCOUNT;
    /**
     * Primary Diagnosis code for this charge.
     */
    PRIMARY_DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on PRIMARY_DX_ID
     */
    primary_dx?: CLARITY_EDG;
    /**
     * The first procedure modifier of the associated transaction
     */
    MODIFIER_ONE: string;
    /**
     * This item is a Yes/No flag to determine if the transaction was assigned to insurance before the action on this line for this transaction.
     */
    ASSIGNMENT_BEF_YN: string;
    /**
     * This item is a Yes/No flag to determine if the transaction was assigned to insurance after the action on this line for this transaction.
     */
    ASSIGNMENT_AFTER_YN: string;
    /**
     * This field stores a comma delimited list of external remittance codes for this transaction.
     */
    ACTION_REMIT_CODES: string;
    /**
     * The UTC date and time the action was performed.
     */
    ACTION_DATETIME: Date;
    /**
     * Reference to parent ARPB_TRANSACTIONS
     */
    arpb_transactions?: ARPB_TRANSACTIONS;
}

/**
 * Charge Review History Related Information
 * pk: TX_ID, LINE
 */
export interface ARPB_TX_CHG_REV_HX {
    /**
     * The unique identifier for the transaction record.
     */
    TX_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Charge Review History User ID
     */
    CR_HX_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on CR_HX_USER_ID
     */
    cr_hx_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    CR_HX_USER_ID_NAME: string;
    /**
     * The charge review history date.
     */
    CR_HX_DATE: Date;
    /**
     * Displays the date the recall must be made by.
     */
    CR_HX_TIME: Date;
    /**
     * The charge review history activity category ID for the transaction
     */
    CR_HX_ACTIVITY_C_NAME: string;
    /**
     * Charge Review History Continuation Flag
     */
    CR_HX_CONT_LINE_YN: string;
    /**
     * Reference to parent ARPB_TRANSACTIONS
     */
    arpb_transactions?: ARPB_TRANSACTIONS;
}

/**
 * Matching History Transaction Related Items
 * pk: TX_ID, LINE
 */
export interface ARPB_TX_MATCH_HX {
    /**
     * The unique identifier for the transaction record.
     */
    TX_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This item stores the date that a transaction was matched to this transaction.
     */
    MTCH_TX_HX_DT: Date;
    /**
     * This item stores the transaction that this transaction was matched to
     */
    MTCH_TX_HX_ID: number;
    /**
     * Reference to ARPB_TRANSACTIONS based on MTCH_TX_HX_ID
     */
    mtch_tx_hx?: ARPB_TRANSACTIONS;
    /**
     * This item stores the (insurance+self-pay) amount for which this transaction is matched to the transaction in column MTCH_TX_HX_ID.
     */
    MTCH_TX_HX_AMT: number;
    /**
     * This item stores the insurance amount for which this transaction is matched to the transaction in column MTCH_TX_HX_ID.
     */
    MTCH_TX_HX_INS_AMT: number;
    /**
     * This item stores the self-pay amount for which this transaction is matched to the transaction in column MTCH_TX_HX_ID.
     */
    MTCH_TX_HX_PAT_AMT: number;
    /**
     * This item holds the comment for the matching of this transaction to the transaction in column MTCH_TX_HX_ID
     */
    MTCH_TX_HX_COMMENT: string;
    /**
     * This item holds the date that the transaction was unmatched from the transaction in column MTCH_TX_HX_ID.
     */
    MTCH_TX_HX_UN_DT: Date;
    /**
     * This item stores the coverage ID at the time that the transaction was matched to the transaction in column MTCH_TX_HX_ID.
     */
    MTCH_TX_HX_D_CVG_ID: number;
    /**
     * This item stores the users who matched this transaction to the transaction from column MTCH_TX_HX_ID.
     */
    MTCH_TX_HX_DSUSR_ID: string;
    /**
     * Reference to CLARITY_EMP based on MTCH_TX_HX_DSUSR_ID
     */
    mtch_tx_hx_dsusr?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    MTCH_TX_HX_DSUSR_ID_NAME: string;
    /**
     * This item stores the user that unmatched this transaction from the transaction in the MTCH_TX_HX_ID column.
     */
    MTCH_TX_HX_UDUSR_ID: string;
    /**
     * The name of the user record
     */
    MTCH_TX_HX_UDUSR_ID_NAME: string;
    /**
     * This item stores the invoice associated with the debit transaction in the matching group.
     */
    MTCH_TX_HX_INV_NUM: string;
    /**
     * This is the coverage of the debit transaction at the time of unmatch.
     */
    MTCH_TX_HX_UN_CV_ID: number;
    /**
     * This item stores the corresponding line from the matched transaction.
     */
    MTCH_TX_HX_LINE: number;
    /**
     * The UTC date and time the transaction was matched.
     */
    MTCH_TX_HX_DTTM: Date;
    /**
     * The UTC date and time the transaction was unmatched.
     */
    MTCH_TX_HX_UN_DTTM: Date;
    /**
     * Reference to parent ARPB_TRANSACTIONS
     */
    arpb_transactions?: ARPB_TRANSACTIONS;
}

/**
 * This table contains multiple response information for modifiers associated with A/R (ETR) transactions.
 * pk: ETR_ID, LINE
 */
export interface ARPB_TX_MODIFIERS {
    /**
     * The unique ID of the transaction (ETR) record for this row.
     */
    ETR_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The external ID of the modifier record.
     */
    EXT_MODIFIER: string;
    /**
     * Reference to parent ARPB_TRANSACTIONS
     */
    arpb_transactions?: ARPB_TRANSACTIONS;
}

/**
 * This table contains information about the statement and claim history for professional billing transactions.
 * pk: TX_ID, LINE
 */
export interface ARPB_TX_STMCLAIMHX {
    /**
     * The unique ID of the transaction record
     */
    TX_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * This item stores whether the current line is a bill or claim entry
     */
    BC_HX_TYPE_C_NAME: string;
    /**
     * The date the statement or claim was processed
     */
    BC_HX_DATE: Date;
    /**
     * The unique ID of the coverage that is associated with the bill or claim run
     */
    BC_HX_COVERAGE_ID: number;
    /**
     * Indicates whether or not the coverage is assigned to insurance for this transaction
     */
    BC_HX_ASSIGNED_YN: string;
    /**
     * The amount of the transaction on the bill or claim.
     */
    BC_HX_AMOUNT: number;
    /**
     * The invoice number for the bill or claim.
     */
    BC_HX_INVOICE_NUM: string;
    /**
     * Payment amount for payment associated with this invoice
     */
    BC_HX_PAYMENT_AMT: number;
    /**
     * Payment date for payment associated with this invoice
     */
    BC_HX_PAYMENT_DATE: Date;
    /**
     * The unique ID of the payor for this claim
     */
    BC_HX_PAYOR_ID: number;
    /**
     * Resubmit date for this claim
     */
    BC_HX_RESUBMIT_DATE: Date;
    /**
     * The unique ID of the claim information record for this claim
     */
    BC_HX_CLM_DB_ID: number;
    /**
     * The internal record ID for the procedure billed out on the claim
     */
    BC_HX_BO_PROC_ID: number;
    /**
     * Reference to CLARITY_EAP based on BC_HX_BO_PROC_ID
     */
    bc_hx_bo_proc?: CLARITY_EAP;
    /**
     * Accept date for bill or claim
     */
    BC_HX_ACCEPT_DATE: Date;
    /**
     * This item is set to 0 for accepted claims where all previous lines in the statement-claim history are claims
     */
    BC_HX_FIRST_CLM_FLG: string;
    /**
     * The UTC date and time the statement or claim was accepted.
     */
    BC_HX_ACCEPT_DTTM: Date;
    /**
     * Reference to parent ARPB_TRANSACTIONS
     */
    arpb_transactions?: ARPB_TRANSACTIONS;
}

/**
 * This table stores the statement dates for transactions.
 * pk: TX_ID, LINE
 */
export interface ARPB_TX_STMT_DT {
    /**
     * The unique identifier for the transaction record.
     */
    TX_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The statement dates for the transaction.
     */
    STATEMENT_DATE: Date;
    /**
     * Reference to parent ARPB_TRANSACTIONS
     */
    arpb_transactions?: ARPB_TRANSACTIONS;
}

/**
 * This table contains information on transactions that were either: * Transferred * Voided * Reversed * Retroadjudicated
 * pk: TX_ID
 */
export interface ARPB_TX_VOID {
    /**
     * The unique identifier for the transaction record.
     */
    TX_ID: number;
    /**
     * Reference to ARPB_TRANSACTIONS based on TX_ID
     */
    tx?: ARPB_TRANSACTIONS;
    /**
     * This item holds a pointer for a transaction that was reposted retroactively to the original transaction.
     */
    OLD_ETR_ID: number;
    /**
     * This item stores a pointer to the old transaction in the case of charge correction or repost.
     */
    REPOSTED_ETR_ID: number;
    /**
     * This indicates the type of repost on the source transaction
     */
    REPOST_TYPE_C_NAME: string;
    /**
     * This is the date that the transaction was voided or reversed.
     */
    DEL_REVERSE_DATE: Date;
    /**
     * This item stores the user who voided this transaction.
     */
    DEL_CHARGE_USER_ID: string;
    /**
     * The name of the user record
     */
    DEL_CHARGE_USER_ID_NAME: string;
    /**
     * This item stores the instant that a transaction was voided.
     */
    DEL_CHARGE_INSTANT: Date;
}

/**
 * This table contains Professional Billing visit information stored in the Hospital Accounts Receivable (HAR) master file
 * pk: PB_VISIT_ID
 */
export interface ARPB_VISITS {
    /**
     * The unique identifier for the Professional Billing visit.
     */
    PB_VISIT_ID: number;
    /**
     * Reference to HAR_ALL based on PB_VISIT_ID
     */
    pb_visit?: HAR_ALL;
    /**
     * This column stores the Professional Billing status category ID for the visit.
     */
    PB_BILLING_STATUS_C_NAME: string;
    /**
     * This column indicates whether the Professional Billing filing order has been overridden by a user.
     */
    PB_FO_OVRRD_ST_C_NAME: string;
    /**
     * This column indicates whether the filing order for the Professional Billing visit has been verified by Medicare Secondary Payer Questionnaire logic.
     */
    PB_FO_MSPQ_STATE_C_NAME: string;
    /**
     * This column stores the PB visit number.
     */
    PB_VISIT_NUM: string;
    /**
     * The contact serial number associated with the primary patient contact on the Professional Billing visit.
     */
    PRIM_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PRIM_ENC_CSN_ID
     */
    prim_enc_csn?: PAT_ENC;
    /**
     * Stores the guarantor ID associated with the Professional Billing visit.
     */
    GUARANTOR_ID: number;
    /**
     * The primary coverage on the Professional Billing visit.
     */
    COVERAGE_ID: number;
    /**
     * Indicates whether the Professional Billing visit is self-pay.
     */
    SELF_PAY_YN: string;
    /**
     * Indicates�whether the Professional Billing visit has the Do Not Bill Insurance flag set.
     */
    DO_NOT_BILL_INS_YN: string;
    /**
     * The financial class category ID�for the Professional Billing visit.
     */
    ACCT_FIN_CLASS_C_NAME: string;
    /**
     * The service area of the Professional Billing visit.
     */
    SERV_AREA_ID: number;
    /**
     * Reference to CLARITY_SA based on SERV_AREA_ID
     */
    serv_area?: CLARITY_SA;
    /**
     * The revenue location of the Professional Billing visit.
     */
    REVENUE_LOCATION_ID: number;
    /**
     * The department of the Professional Billing visit.
     */
    DEPARTMENT_ID: number;
    /**
     * Contains the combined total balance of transactions on the PB visit.
     */
    PB_TOTAL_BALANCE: number;
    /**
     * The total charges on the PB visit.
     */
    PB_TOTAL_CHARGES: number;
    /**
     * The total payments on the PB visit.
     */
    PB_TOTAL_PAYMENTS: number;
    /**
     * Contains total adjustments on the PB visit.
     */
    PB_TOTAL_ADJ: number;
    /**
     * Contains insurance balance on the PB visit.
     */
    PB_INS_BALANCE: number;
    /**
     * Contains the self-pay balance on the Professional Billing visit.
     */
    PB_SELFPAY_BALANCE: number;
    /**
     * The user who created the Professional Billing visit record.
     */
    REC_CREATE_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on REC_CREATE_USER_ID
     */
    rec_create_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    REC_CREATE_USER_ID_NAME: string;
    /**
     * Contains the first valid Professional Billing charge on the Professional Billing visit.
     */
    FIRST_PB_CHG_TX_ID: number;
    /**
     * Reference to ARPB_TRANSACTIONS based on FIRST_PB_CHG_TX_ID
     */
    first_pb_chg_tx?: ARPB_TRANSACTIONS;
    /**
     * This item shows whether the balances for this hospital account are in full self-pay.
     */
    BAL_FULL_SELF_PAY_YN: string;
}

/**
 * This table contains information about referrals linked to an appointment.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface ASSOCIATED_REFERRALS {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * A unique contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Stores the IDs of referrals associated with a visit.
     */
    ASSOCIATED_REFERRAL_ID: number;
    /**
     * Reference to REFERRAL based on ASSOCIATED_REFERRAL_ID
     */
    associated_referral?: REFERRAL;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * This table lists the remark codes associated with a Denial/Correspondence (BDC) record.
 * pk: BDC_ID, LINE
 */
export interface BDC_ASSOC_REMARK_CODES {
    /**
     * The unique identifier for the denial/correspondence record.
     */
    BDC_ID: number;
    /**
     * Reference to BDC_INFO based on BDC_ID
     */
    bdc?: BDC_INFO;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Remark codes associated with the denial reason code.
     */
    REMARK_CODE_ID: string;
    /**
     * Reference to CLARITY_RMC based on REMARK_CODE_ID
     */
    remark_code?: CLARITY_RMC;
    /**
     * The name of each remittance code.
     */
    REMARK_CODE_ID_REMIT_CODE_NAME: string;
}

/**
 * This table contains Denial/Remark/Correspondence/Variance information from the Denial/Correspondence (BDC) master file
 * pk: BDC_ID
 */
export interface BDC_INFO {
    /**
     * The unique identifier for the denial/correspondence record.
     */
    BDC_ID: number;
    /**
     * BDC Record Name - Denial/Remark/Correspondence Record Name.
     */
    BDC_NAME: string;
    /**
     * The record type category ID for the Denial/Remark/Correspondence.
     */
    RECORD_TYPE_C_NAME: string;
    /**
     * The status category ID for the Denial/Remark/Correspondence.
     */
    RECORD_STATUS_C_NAME: string;
    /**
     * The source category ID for the Denial/Remark/Correspondence.
     */
    RECORD_SOURCE_C_NAME: string;
    /**
     * The invoice number associated with this denial/correspondence.
     */
    INVOICE_NUMBER: string;
    /**
     * This item holds the group code associated with the reason code in a denial correspondence record.
     */
    GRP_CODE_C_NAME: string;
    /**
     * The unique ID of the remittance code associated with the record.
     */
    REMIT_CODE_ID: string;
    /**
     * Reference to CLARITY_RMC based on REMIT_CODE_ID
     */
    remit_code?: CLARITY_RMC;
    /**
     * The name of each remittance code.
     */
    REMIT_CODE_ID_REMIT_CODE_NAME: string;
    /**
     * The external ID of the remittance code associated with this denial/correspondence.
     */
    EXTERNAL_CODE: string;
    /**
     * Resolution Category for Denial/Remark/Correspondence if it has been resolved.
     */
    RESOLVE_REASON_C_NAME: string;
    /**
     * The date the Denial/Remark/Correspondence was received.
     */
    BDC_RECEIVE_DATE: Date;
    /**
     * The date the Denial/Remark/Correspondence record was completed or voided.
     */
    BDC_COMPLETE_VOID_DATE: Date;
    /**
     * The professional invoice associated with the denial/correspondence record.
     */
    PB_INVOICE_ID: number;
    /**
     * Reference to INVOICE based on PB_INVOICE_ID
     */
    pb_invoice?: INVOICE;
    /**
     * The unique ID of the guarantor associated with the denial/correspondence record.
     */
    GUARANTOR_ID: number;
    /**
     * Reference to ACCOUNT based on GUARANTOR_ID
     */
    guarantor?: ACCOUNT;
    /**
     * Professional Billing payment transaction which led to denial/correspondence record creation.
     */
    SOURCE_PMT_PB_TX_ID: number;
    /**
     * Reference to ARPB_TRANSACTIONS based on SOURCE_PMT_PB_TX_ID
     */
    source_pmt_pb_tx?: ARPB_TRANSACTIONS;
    /**
     * This item stores the initial appeal deadline at the moment the BDC is created.
     */
    APPEAL_DEADLINE_DATE: Date;
    /**
     * Collection of BDC_PB_CHGS as children
     */
    bdc_pb_chgs?: BDC_PB_CHGS[];
    /**
     * Collection of HSP_BDC_DENIAL_DATA as children
     */
    hsp_bdc_denial_data?: HSP_BDC_DENIAL_DATA[];
    /**
     * Collection of HSP_BDC_PAYOR as children
     */
    hsp_bdc_payor?: HSP_BDC_PAYOR[];
}

/**
 * This table stores PB Denial/Correspondence (BDC) denial records and the charge transactions that were denied by that denial record.
 * pk: BDC_ID, LINE
 */
export interface BDC_PB_CHGS {
    /**
     * The unique identifier for the Professional Billing denial record.
     */
    BDC_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Professional charge this denial was posted for
     */
    TX_ID: number;
    /**
     * Reference to ARPB_TRANSACTIONS based on TX_ID
     */
    tx?: ARPB_TRANSACTIONS;
    /**
     * Follow-up record this denial was posted for
     */
    FOL_ID: number;
    /**
     * Reference to parent BDC_INFO
     */
    bdc_info?: BDC_INFO;
}

/**
 * Each record represents a classification of benefits.
 * pk: SERVICE_TYPE_ID
 */
export interface BENEFIT_SVC_TYPE {
    /**
     * The unique identifier for the service type record.
     */
    SERVICE_TYPE_ID: string;
    /**
     * The name of this benefit service type.
     */
    SERVICE_TYPE_NAME: string;
}

/**
 * This table contains the contact information for a Care Integrator record.
 * pk: CARE_INTG_ID, CONTACT_DATE_REAL
 */
export interface CARE_INTEGRATOR {
    /**
     * The unique ID for the care integrator record.
     */
    CARE_INTG_ID: string;
    /**
     * The DTE contact date for the care integrator record.
     */
    CONTACT_DATE_REAL: number;
    /**
     * Reference to parent CAREPLAN_INFO
     */
    careplan_info?: CAREPLAN_INFO;
}

/**
 * Information on care plan contacts and readings.
 * pk: CAREPLAN_ID, CONTACT_DATE_REAL
 */
export interface CAREPLAN_CNCT_INFO {
    /**
     * The unique identifier for the care plan record.
     */
    CAREPLAN_ID: string;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The contact serial number (CSN) of the contact.
     */
    CTCT_SERIAL_NUM: number;
    /**
     * The number of the contact
     */
    CONTACT_NUMBER: string;
    /**
     * Reference to parent CAREPLAN_INFO
     */
    careplan_info?: CAREPLAN_INFO;
}

/**
 * Contains information about care plan template records.
 * pk: CARE_INTG_ID
 */
export interface CAREPLAN_INFO {
    /**
     * The unique identifier for the care plan record.
     */
    CARE_INTG_ID: string;
    /**
     * Reference to CAREPLAN_ENROLLMENT_INFO based on CARE_INTG_ID
     */
    care_intg?: CAREPLAN_ENROLLMENT_INFO;
    /**
     * The category ID of the type of the care plan record (Collaborative or Home Health).
     */
    CAREPLAN_TYPE_C_NAME: string;
    /**
     * The linked unique contact serial number for the patient
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * Links OP care plan (patient-level and episodic) to the associated patient
     */
    PATIENT_ID: string;
    /**
     * Reference to PATIENT based on PATIENT_ID
     */
    patient?: PATIENT;
    /**
     * Indicates whether the outpatient care plan is linked at the patient level or the episode level
     */
    LINKED_PAT_CAREPLAN_YN: string;
    /**
     * The link to the care plan reading Care Plan record.
     */
    READING_CAREPLAN_ID: string;
    /**
     * The date and time when the care plan was last edited
     */
    LAST_EDITED_DTTM: Date;
    /**
     * Collection of CARE_INTEGRATOR as children
     */
    care_integrator?: CARE_INTEGRATOR[];
    /**
     * Collection of CAREPLAN_CNCT_INFO as children
     */
    careplan_cnct_info?: CAREPLAN_CNCT_INFO[];
}

/**
 * The CLARITY_ADT table is the master table for ADT event history information
 * pk: EVENT_ID
 */
export interface CLARITY_ADT {
    /**
     * The unique ID number of the ADT event record.
     */
    EVENT_ID: number;
    /**
     * The category value corresponding to the type of the event record.
     */
    EVENT_TYPE_C_NAME: string;
    /**
     * The category value indicating whether the event record has been changed or deleted.
     */
    EVENT_SUBTYPE_C_NAME: string;
    /**
     * The ID number of the unit of the event record at the effective time.
     */
    DEPARTMENT_ID: number;
    /**
     * Reference to CLARITY_DEP based on DEPARTMENT_ID
     */
    department?: CLARITY_DEP;
    /**
     * The instant when the event was supposed to have happened.
     */
    EFFECTIVE_TIME: Date;
    /**
     * The ID of the patient of the event record at the effective time.
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * This is a numeric representation of the date of this encounter in your system
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * The instant when the event record was actually created.
     */
    EVENT_TIME: Date;
    /**
     * The ID number of the user who created the event record.
     */
    USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on USER_ID
     */
    user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    USER_ID_NAME: string;
    /**
     * The category value corresponding to the classification for the patient of the event record at the effective time.
     */
    PAT_CLASS_C_NAME: string;
    /**
     * The instant when the original subtype record for this event was actually created.
     */
    ORIG_EVENT_TIME: Date;
    /**
     * The instant when the original subtype record for this event was supposed to have happened.
     */
    ORIG_EFF_TIME: Date;
    /**
     * The ID number of the next 'transfer out' or 'discharge' type record for this bed for the patient CSN of these records.
     */
    NEXT_OUT_EVENT_ID: number;
    /**
     * The ID number of the last 'transfer in' or 'admission' type record for this bed for the patient CSN of these records.
     */
    LAST_IN_EVENT_ID: number;
    /**
     * The category value corresponding to the base classification for the patient of the event record at the effective time.
     */
    BASE_PAT_CLASS_C_NAME: string;
    /**
     * This column contains the outgoing event type as it would currently be interpreted
     */
    OUT_EVENT_TYPE_C_NAME: string;
    /**
     * This column contains the base patient class that the patient had prior to this event.
     */
    FROM_BASE_CLASS_C_NAME: string;
    /**
     * This column contains the base patient class that the patient had after this event.
     */
    TO_BASE_CLASS_C_NAME: string;
    /**
     * The unique ID of the original event that this event record replaces
     */
    ORIGINAL_EVENT_ID: number;
}

/**
 * The CLARITY_COMPONENT table contains basic information about the standard result components that can constitute your procedures
 * pk: COMPONENT_ID
 */
export interface CLARITY_COMPONENT {
    /**
     * The unique ID of the component record.
     */
    COMPONENT_ID: number;
    /**
     * The name of the component.
     */
    NAME: string;
}

/**
 * The CLARITY_EDG table contains basic information about diagnoses.
 * pk: DX_ID
 */
export interface CLARITY_EDG {
    /**
     * The unique ID of the diagnosis record in your system.
     */
    DX_ID: number;
    /**
     * The name of the diagnosis.
     */
    DX_NAME: string;
}

/**
 * This table contains information about employer records from the EEP master file.
 * pk: EMPLOYER_ID
 */
export interface CLARITY_EEP {
    /**
     * The unique ID for the employer record.
     */
    EMPLOYER_ID: string;
    /**
     * The name of the employer.
     */
    EMPLOYER_NAME: string;
}

/**
 * This table contains high-level information about user records from the User master file.
 * pk: USER_ID
 */
export interface CLARITY_EMP {
    /**
     * The unique ID assigned to the user record
     */
    USER_ID: string;
    /**
     * The name of the user record
     */
    NAME: string;
}

/**
 * The CLARITY_EPM table contains information about payer records.
 * pk: PAYOR_ID
 */
export interface CLARITY_EPM {
    /**
     * The unique ID assigned to the payor.
     */
    PAYOR_ID: number;
    /**
     * The name of the payor.
     */
    PAYOR_NAME: string;
}

/**
 * The CLARITY_EPP table contains basic information about your benefit plans.
 * pk: BENEFIT_PLAN_ID
 */
export interface CLARITY_EPP {
    /**
     * The unique ID assigned to the benefit plan record in the system.
     */
    BENEFIT_PLAN_ID: number;
    /**
     * The name of the benefit plan record.
     */
    BENEFIT_PLAN_NAME: string;
}

/**
 * This table contains basic information about the fee schedules billing system uses to adjudicate the price of a charge and manage care system AP Claims and Referrals used to price procedures based on the composition of the vendor-network contracts.
 * pk: FEE_SCHEDULE_ID
 */
export interface CLARITY_FSC {
    /**
     * This column stores the unique identifier for the fee schedule record.
     */
    FEE_SCHEDULE_ID: number;
    /**
     * The name of each fee schedule.
     */
    FEE_SCHEDULE_NAME: string;
}

/**
 * The CLARITY_HM_TOPIC table contains the names and IDs of your health maintenance topic records
 * pk: HM_TOPIC_ID
 */
export interface CLARITY_HM_TOPIC {
    /**
     * The unique ID of the health maintenance topic record.
     */
    HM_TOPIC_ID: number;
    /**
     * The name of the health maintenance topic.
     */
    NAME: string;
}

/**
 * The CLARITY_IMMUNZATN table contains high-level information about the immunizations providers can choose on the Immunization Administration window
 * pk: IMMUNZATN_ID
 */
export interface CLARITY_IMMUNZATN {
    /**
     * The unique ID of the immunization record.
     */
    IMMUNZATN_ID: number;
    /**
     * The name of the immunization.
     */
    NAME: string;
}

/**
 * Interface laboratory general information.
 * pk: RESULTING_LAB_ID
 */
export interface CLARITY_LLB {
    /**
     * The unique ID of the interface laboratory record.
     */
    RESULTING_LAB_ID: number;
    /**
     * Interface laboratory name.
     */
    LLB_NAME: string;
}

/**
 * This table contains masterfile information on billing modifiers.
 * pk: MODIFIER_ID
 */
export interface CLARITY_MOD {
    /**
     * The unique id of the modifier record
     */
    MODIFIER_ID: string;
    /**
     * The name of the modifier record.
     */
    MODIFIER_NAME: string;
}

/**
 * This table holds the no add, single response items from the Geographic Area master file (NRG).
 * pk: INTERNAL_ID
 */
export interface CLARITY_NRG {
    /**
     * Unique ID of the geographical region
     */
    INTERNAL_ID: number;
    /**
     * The name of the geograpic region
     */
    AREA_NAME: string;
}

/**
 * The CLARITY_PRC table contains one record for each visit type, panel, agent, and visit type modifier in your system.
 * pk: PRC_ID
 */
export interface CLARITY_PRC {
    /**
     * The unique ID of the visit type record.
     */
    PRC_ID: string;
    /**
     * The name of the visit type.
     */
    PRC_NAME: string;
    /**
     * The visit type name on reports and letters sent to patients.
     */
    EXTERNAL_NAME: string;
}

/**
 * This table contains basic information about the remittance codes that can accompany electronic payments and claim denials.
 * pk: REMIT_CODE_ID
 */
export interface CLARITY_RMC {
    /**
     * This column stores the unique identifier for the remittance code record.
     */
    REMIT_CODE_ID: string;
    /**
     * The name of each remittance code.
     */
    REMIT_CODE_NAME: string;
}

/**
 * The CLARITY_SA table contains information about your service areas
 * pk: SERV_AREA_ID
 */
export interface CLARITY_SA {
    /**
     * The unique ID number assigned to the service area record.
     */
    SERV_AREA_ID: number;
    /**
     * Reference to CLARITY_LOC based on SERV_AREA_ID
     */
    serv_area?: CLARITY_LOC;
    /**
     * The name of the service area.
     */
    SERV_AREA_NAME: string;
    /**
     * The name of the record that appears in billing correspondences such as statements and letters.
     */
    EXTERNAL_NAME: string;
}

/**
 * The CLARITY_SER table contains high-level information about your provider records
 * pk: PROV_ID
 */
export interface CLARITY_SER {
    /**
     * The unique ID assigned to the provider record
     */
    PROV_ID: string;
    /**
     * The name of the service provider
     */
    PROV_NAME: string;
    /**
     * The external name of the provider record.
     */
    EXTERNAL_NAME: string;
}

/**
 * Contains information from the Collection Agencies (KCA) master file.
 * pk: COL_AGNCY_ID
 */
export interface CL_COL_AGNCY {
    /**
     * The ID for the collection agency.
     */
    COL_AGNCY_ID: number;
    /**
     * The name of the collection agency.
     */
    COLL_AGENCY_NAME: string;
}

/**
 * This table contains information on allergens.
 * pk: ALLERGEN_ID
 */
export interface CL_ELG {
    /**
     * The ID of the allergen record.
     */
    ALLERGEN_ID: number;
    /**
     * The name of the allergen record.
     */
    ALLERGEN_NAME: string;
}

/**
 * This table contains all records extracted from the LQH master file (Visit Navigator (VN) History Template Definition)
 * pk: RECORD_ID
 */
export interface CL_LQH {
    /**
     * The unique id of the Visit Navigator (VN) History Template Definition (LQH) record
     */
    RECORD_ID: string;
    /**
     * The name of the Visit Navigator (VN) History Template Definition (LQH) record.
     */
    RECORD_NAME: string;
}

/**
 * All values associated with a claim are stored in the Claim External Value record
 * pk: RECORD_ID, LINE
 */
export interface CLM_DX {
    /**
     * The unique identifier for the Claim Info record.
     */
    RECORD_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * This item holds the qualifier identifying the code set for the claim diagnoses.
     */
    CLM_DX_QUAL: string;
    /**
     * This item holds the diagnoses for the claim
     */
    CLM_DX: string;
    /**
     * Reference to parent CLM_VALUES
     */
    clm_values?: CLM_VALUES;
}

/**
 * This table contains the injury description on the claim.
 * pk: CLAIM_ID, LINE
 */
export interface CLM_INJURY_DESC {
    /**
     * The unique identifier for the Claim Info record.
     */
    CLAIM_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The claim injury description.
     */
    INJURY_DESC: string;
    /**
     * Reference to parent CLM_ALL
     */
    clm_all?: CLM_ALL;
}

/**
 * All values associated with a claim are stored in the Claim External Value record
 * pk: RECORD_ID, LINE
 */
export interface CLM_NOTE {
    /**
     * The unique identifier for the Claim Info record.
     */
    RECORD_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * This item holds claim level notes.
     */
    CLM_NOTE: string;
    /**
     * Reference to parent CLM_VALUES
     */
    clm_values?: CLM_VALUES;
}

/**
 * Other diagnoses on the claim
 * pk: CLAIM_ID, LINE
 */
export interface CLM_OTHER_DXS {
    /**
     * The unique ID for the claim information record.
     */
    CLAIM_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The other diagnosis IDs on the claim.
     */
    OTHER_DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on OTHER_DX_ID
     */
    other_dx?: CLARITY_EDG;
    /**
     * Reference to parent CLM_ALL
     */
    clm_all?: CLM_ALL;
}

/**
 * This table contains information about order template records.
 * pk: OTL_ID
 */
export interface CL_OTL {
    /**
     * The unique ID of the order template record.
     */
    OTL_ID: string;
    /**
     * Description of the procedure.
     */
    ORDER_DESC: string;
}

/**
 * This table contains information about data that will be used when processing claims on the eMedNY 150003 paper claim form for New York Medicaid.
 * pk: CLAIM_PRINT_ID
 */
export interface CLP_NY_MEDICAID_INFO {
    /**
     * The unique identifier for the claim record.
     */
    CLAIM_PRINT_ID: number;
    /**
     * Reference to HSP_CLAIM_DETAIL1 based on CLAIM_PRINT_ID
     */
    claim_print?: HSP_CLAIM_DETAIL1;
}

/**
 * This table extracts the occurrence codes and occurrence dates for each claim.
 * pk: CLAIM_PRINT_ID, LINE
 */
export interface CLP_OCCUR_DATA {
    /**
     * The ID of the claim print record.
     */
    CLAIM_PRINT_ID: number;
    /**
     * The Line Count
     */
    LINE: number;
    /**
     * The occurrence code category list for an institutional claim.
     */
    OCCURRENCE_CODE_C_NAME: string;
    /**
     * Stores Occurrence Date to print on institutional claims
     */
    OCCURRENCE_DT: Date;
    /**
     * Reference to parent HSP_CLAIM_DETAIL1
     */
    hsp_claim_detail1?: HSP_CLAIM_DETAIL1;
}

/**
 * This table extracts the value codes and value amounts printed on institutional claims.
 * pk: CLAIM_PRINT_ID, LINE
 */
export interface CLP_VALUE_DATA {
    /**
     * The ID of the claim print record.
     */
    CLAIM_PRINT_ID: number;
    /**
     * Reference to HSP_CLAIM_DETAIL1 based on CLAIM_PRINT_ID
     */
    claim_print?: HSP_CLAIM_DETAIL1;
    /**
     * The Line Count
     */
    LINE: number;
    /**
     * Stores Value Code to print on institutional claims
     */
    VALUE_CODE_C_NAME: string;
    /**
     * Value Remark to print on institutional claims
     */
    VALUE_AMT: string;
}

/**
 * The CL_QANSWER_OVTM table contains contact-specific information for questionnaire answers.
 * pk: ANSWER_ID, CONTACT_DATE_REAL
 */
export interface CL_QANSWER_OVTM {
    /**
     * The unique ID of the answer record.
     */
    ANSWER_ID: string;
    /**
     * This is a numeric representation of the date of this encounter in your system
     */
    CONTACT_DATE_REAL: number;
    /**
     * The contact date in datetime format.
     */
    CONTACT_DATE: Date;
    /**
     * Reference to parent CL_QANSWER
     */
    cl_qanswer?: CL_QANSWER;
}

/**
 * This table contains general information about questionnaire answer records
 * pk: ANSWER_ID
 */
export interface CL_QANSWER {
    /**
     * The unique ID of the questionnaire answer record.
     */
    ANSWER_ID: string;
    /**
     * The unique ID of the user who created this record.
     */
    REC_CREATE_USER_ID: string;
    /**
     * The name of the user record
     */
    REC_CREATE_USER_ID_NAME: string;
    /**
     * Collection of CL_QANSWER_OVTM as children
     */
    cl_qanswer_ovtm?: CL_QANSWER_OVTM[];
}

/**
 * The CL_QFORM1 table is the second master table for questionnaire forms
 * pk: FORM_ID
 */
export interface CL_QFORM1 {
    /**
     * The unique identifier for the form record.
     */
    FORM_ID: string;
    /**
     * The name of the form associated with the questionnaire.
     */
    FORM_NAME: string;
}

/**
 * The CL_QQUEST_OVTM table contains each contact for questionnaire questions.
 * pk: QUEST_ID, CONTACT_DATE_REAL
 */
export interface CL_QQUEST_OVTM {
    /**
     * The unique ID of the question record.
     */
    QUEST_ID: string;
    /**
     * The contact date in decimal format.
     */
    CONTACT_DATE_REAL: number;
    /**
     * The question that the user sees.
     */
    QUESTION: string;
}

/**
 * Contains claim level date information from the electronic remittance payment
 * pk: IMAGE_ID, LINE
 */
export interface CL_RMT_CLM_DT_INFO {
    /**
     * This is the ID for the remittance image record with related claim date information.
     */
    IMAGE_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The date qualifier code for the claim date information
     */
    CLAIM_DATE_QUAL_C_NAME: string;
    /**
     * Claim related date sent in the remittance file
     */
    CLAIM_DT: Date;
    /**
     * Reference to parent CL_REMIT
     */
    cl_remit?: CL_REMIT;
}

/**
 * Contains identifying information for entities (persons or organizations) from an electronic remittance payment
 * pk: IMAGE_ID, LINE
 */
export interface CL_RMT_CLM_ENTITY {
    /**
     * ID for the remittance image record containing the claim related entity information.
     */
    IMAGE_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The entity identifier code for the claim related entity
     */
    ID_CODE_C_NAME: string;
    /**
     * Code indicating whether this information is for a person or a non-person entity.
     */
    ENT_QUAL_C_NAME: string;
    /**
     * This is the individual last name or organization name.
     */
    LAST_NAME_ORG_NAME: string;
    /**
     * The individual first name.
     */
    FIRST_NAME: string;
    /**
     * The individual middle name or initial.
     */
    MIDDLE_NAME: string;
    /**
     * The identification code qualifier
     */
    IDEN_CODE_QUALF_C_NAME: string;
    /**
     * The ID associated with the specific individual or organization.
     */
    IDEN_CODE: string;
    /**
     * Reference to parent CL_REMIT
     */
    cl_remit?: CL_REMIT;
}

/**
 * Contains health care remark code information from the service line level of an electronic remittance file
 * pk: IMAGE_ID, LINE
 */
export interface CL_RMT_HC_RMK_CODE {
    /**
     * ID for the remittance image record containing the health care remark code information.
     */
    IMAGE_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The service line associated with the health care remark code.
     */
    LQ_SERVICE_LINE: string;
    /**
     * The code list qualifier code
     */
    CODE_LST_QUAL_C_NAME: string;
    /**
     * The specific health care remark code.
     */
    INDUSTRY_CODE: string;
    /**
     * Reference to parent CL_REMIT
     */
    cl_remit?: CL_REMIT;
}

/**
 * This table contains service line amount information for a remittance record.
 * pk: IMAGE_ID, LINE
 */
export interface CL_RMT_SVC_AMT_INF {
    /**
     * This is the ID for the remittance image record with related remit claim references.
     */
    IMAGE_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The service line which this amount information refers to.
     */
    AMT_SVC_LN: string;
    /**
     * The amount qualifier code for the claim supplemental information
     */
    SVC_AMT_QUAL_C_NAME: string;
    /**
     * Monetary amount for the supplemental claim information
     */
    SVC_SUPPL_AMT: number;
    /**
     * Reference to parent CL_REMIT
     */
    cl_remit?: CL_REMIT;
}

/**
 * This table contains the claim adjustment (CAS) level information for a service line of a remittance record.
 * pk: IMAGE_ID, LINE
 */
export interface CL_RMT_SVC_LVL_ADJ {
    /**
     * This is the ID for the remittance image record.
     */
    IMAGE_ID: string;
    /**
     * The line number in the results of a query.
     */
    LINE: number;
    /**
     * This is the service line which this adjustment information refers.
     */
    CAS_SERVICE_LINE: string;
    /**
     * This is the Code identifying the general category of payment adjustment.
     */
    SVC_CAS_GRP_CODE_C_NAME: string;
    /**
     * This is the Code identifying the detailed reason the adjustment was made.
     */
    SVC_ADJ_REASON_CD: string;
    /**
     * This is the amount of the adjustment.
     */
    SVC_ADJ_AMT: number;
    /**
     * This is the units of service being adjusted.
     */
    SVC_ADJ_QTY: number;
    /**
     * Reference to parent CL_REMIT
     */
    cl_remit?: CL_REMIT;
}

/**
 * This table contains basic information for records in the Reason for Visit (HRV) master file.
 * pk: REASON_VISIT_ID
 */
export interface CL_RSN_FOR_VISIT {
    /**
     * The ID of the record associated with the Reason for Visit.
     */
    REASON_VISIT_ID: number;
    /**
     * The name of the Reason for Visit record.
     */
    REASON_VISIT_NAME: string;
    /**
     * This contains the name that displays to a user when viewing the Reason for Visit.
     */
    DISPLAY_TEXT: string;
}

/**
 * The CL_UB_REV_CODE table contains information on UB revenue codes.
 * pk: UB_REV_CODE_ID
 */
export interface CL_UB_REV_CODE {
    /**
     * This column stores the unique identifier for the revenue code record.
     */
    UB_REV_CODE_ID: number;
    /**
     * The name of the revenue code.
     */
    REVENUE_CODE_NAME: string;
}

/**
 * This table holds the combined service lines created by code integration.
 * pk: HSP_ACCOUNT_ID, LINE
 */
export interface CODE_INT_COMB_LN {
    /**
     * The unique identifier (.1 item) for the hosp acct record.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column stores the unique identifier for the revenue code for the combined service line.
     */
    CODE_INT_REV_CODE_ID: number;
    /**
     * Reference to CL_UB_REV_CODE based on CODE_INT_REV_CODE_ID
     */
    code_int_rev_code?: CL_UB_REV_CODE;
    /**
     * The name of the revenue code.
     */
    CODE_INT_REV_CODE_ID_REVENUE_CODE_NAME: string;
    /**
     * This item holds the CPT(R)/HCPCS code for the combined service line.
     */
    CODE_INT_CPT: string;
    /**
     * This column stores the unique identifier for the first modifier for the combined service line.
     */
    CODE_INT_MOD_1_ID: string;
    /**
     * Reference to CLARITY_MOD based on CODE_INT_MOD_1_ID
     */
    code_int_mod_1?: CLARITY_MOD;
    /**
     * The name of the modifier record.
     */
    CODE_INT_MOD_1_ID_MODIFIER_NAME: string;
    /**
     * This item holds the service date for the combined service line.
     */
    CODE_INT_DATE: Date;
    /**
     * This item holds the quantity (number of units) for the combined service line.
     */
    CODE_INT_QTY: number;
    /**
     * This item holds the full charge amount for the combined service line
     */
    CODE_INT_AMT: number;
    /**
     * This item holds the non-covered amount for the combined service line.
     */
    CODE_INT_NONCVRD: number;
    /**
     * This item holds the source for the CPT(R)/HCPCS code and modifiers for the combined service line.
     */
    CODE_INT_LN_SRC_C_NAME: string;
    /**
     * This item identifies lines that are not true service lines but represent coded CPT(R)/HCPCS codes that cannot be used to create actual service lines.
     */
    CODE_INT_UNUSED_YN: string;
    /**
     * This item holds the number of charges associated with the combined service line.
     */
    CODE_INT_CHRG_CNT: number;
    /**
     * Reference to parent HAR_ALL
     */
    har_all?: HAR_ALL;
}

/**
 * This table contains items related to Patient Communication Preferences.
 * pk: PREFERENCES_ID
 */
export interface COMM_PREF_ADDL_ITEMS {
    /**
     * The unique identifier (.1 item) for the subject name record.
     */
    PREFERENCES_ID: number;
    /**
     * Reference to PERSON_PREFERENCES based on PREFERENCES_ID
     */
    preferences?: PERSON_PREFERENCES;
    /**
     * This item stores a Yes No category value indicating whether the patient accepts Cadence Scheduled Appointment Notifications.
     */
    APPT_NOTIF_SCHEDULED_YN: string;
    /**
     * This item stores a Yes No category value indicating whether the patient accepts Cadence Changed Appointment Notifications.
     */
    APPT_NOTIF_CHANGED_YN: string;
    /**
     * This item stores a Yes No category value indicating whether the patient accepts Cadence Cancelled Appointment Notifications.
     */
    APPT_NOTIF_CANCELED_YN: string;
    /**
     * This item stores a Yes No category value indicating whether or not a patient accepts Cadence Missed Appointment Notifications.
     */
    APPT_NOTIF_MISSED_YN: string;
}

/**
 * This table extracts the related multiple response item OYO-104, which contains the media approved for use by a person for a given communication concept.
 * pk: PREFERENCES_ID, GROUP_LINE, VALUE_LINE
 */
export interface COMM_PREFERENCES_APRV {
    /**
     * The internal ID of the preference record.
     */
    PREFERENCES_ID: number;
    /**
     * The line number for the information associated with this record.
     */
    GROUP_LINE: number;
    /**
     * The line number of one of the multiple values associated with a specific group of data within this record.
     */
    VALUE_LINE: number;
    /**
     * The approved communication media for a communication concept.
     */
    APRV_MEDIA_C_NAME: string;
    /**
     * Reference to parent COMMUNICATION_PREFERENCES
     */
    communication_preferences?: COMMUNICATION_PREFERENCES;
}

/**
 * Contains communication concepts and preferred media.
 * pk: PREFERENCES_ID, LINE
 */
export interface COMMUNICATION_PREFERENCES {
    /**
     * The internal ID of the preference record.
     */
    PREFERENCES_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The unique ID of the communication concept (HST) record
     */
    COMMUNICATION_CONCEPT_ID: number;
    /**
     * Reference to REPORT_SETTINGS based on COMMUNICATION_CONCEPT_ID
     */
    communication_concept?: REPORT_SETTINGS;
    /**
     * Setting record name.
     */
    COMMUNICATION_CONCEPT_ID_SETTING_NAME: string;
    /**
     * Collection of COMM_PREFERENCES_APRV as children
     */
    comm_preferences_aprv?: COMM_PREFERENCES_APRV[];
    /**
     * Reference to parent PERSON_PREFERENCES
     */
    person_preferences?: PERSON_PREFERENCES;
}

/**
 * The COVERAGE_BENEFITS table contains coverage-level benefit information for the encounter or estimate to which this benefit record is attached.
 * pk: RECORD_ID, LINE
 */
export interface COVERAGE_BENEFITS {
    /**
     * The unique identifier (.1 item) for the benefit record.
     */
    RECORD_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Each line in this related group contains benefit information for a coverage that is or was in use for this visit.
     */
    CVG_ID: number;
    /**
     * Reference to COVERAGE based on CVG_ID
     */
    cvg?: COVERAGE;
    /**
     * The verification record for visit-specific coverage benefits.
     */
    CVG_BEN_VERIF_ID: number;
    /**
     * Deductible for this coverage.
     */
    DEDUCTIBLE_AMOUNT: number;
    /**
     * The amount of the deductible for this coverage that has yet to be paid.
     */
    DEDUCT_REMAIN_AMT: number;
    /**
     * The maximum out-of-pocket payment for this coverage.
     */
    OUT_OF_POCKET_MAX: number;
    /**
     * The remaining out-of-pocket payment for this coverage.
     */
    OUT_OF_PCKT_REMAIN: number;
    /**
     * This item contains the last instant that data related to this coverage was written to the record
     */
    CVG_UPDATE_DTTM: Date;
    /**
     * This item contains the ID of the user who last saved data related to this coverage to the record, or whose actions caused the system to save that data
     */
    CVG_UPDATE_USER_ID: string;
    /**
     * The name of the user record
     */
    CVG_UPDATE_USER_ID_NAME: string;
    /**
     * The method that was last used to make changes to the general benefits values
     */
    CVG_UPDATE_SRC_C_NAME: string;
    /**
     * Family tier for this line's coverage.
     */
    FAMILY_TIER_C_NAME: string;
    /**
     * Network level for this line's coverage.
     */
    NET_LVL_CVG_C_NAME: string;
    /**
     * Stores the most recently calculated network level for this coverage.
     */
    CALC_NET_LVL_CVG_C_NAME: string;
    /**
     * Stores the source of the most recently calculated network level for this coverage.
     */
    CALC_NET_SRC_CVG_C_NAME: string;
    /**
     * Stores the last deductible amount filed by RTE at the coverage level
     */
    RTE_DEDUCT_AMOUNT: number;
    /**
     * Stores the last deductible remaining amount filed by RTE at the coverage level
     */
    RTE_DEDUCT_REMAIN: number;
    /**
     * Stores the last OOP max amount filed by RTE at the coverage level
     */
    RTE_OOP_MAX: number;
    /**
     * Stores the last OOP remaining amount filed by RTE at the coverage level
     */
    RTE_OOP_REMAIN: number;
    /**
     * Reference to parent BENEFITS
     */
    benefits?: BENEFITS;
}

/**
 * Contains the copay category table (ECD) related group of coverages.
 * pk: COVERAGE_ID, LINE
 */
export interface COVERAGE_COPAY_ECD {
    /**
     * The unique ID of the coverage record for this row
     */
    COVERAGE_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Indicate the copay category specialty for which you want to establish a different copay/coinsurance amount
     */
    ECD_TBL_COPAYCAT_ID: string;
    /**
     * Reference to CLARITY_EMP based on ECD_TBL_COPAYCAT_ID
     */
    ecd_tbl_copaycat?: CLARITY_EMP;
    /**
     * The name of this benefit service type.
     */
    ECD_TBL_COPAYCAT_ID_SERVICE_TYPE_NAME: string;
    /**
     * Reference to parent COVERAGE
     */
    coverage?: COVERAGE;
}

/**
 * The COVERAGE_MEMBER_LIST table contains information about the members associated with each coverage record
 * pk: COVERAGE_ID, LINE
 */
export interface COVERAGE_MEMBER_LIST {
    /**
     * The unique identifier for the coverage record.
     */
    COVERAGE_ID: number;
    /**
     * The line number used to identify each member of a coverage record.
     */
    LINE: number;
    /**
     * The unique ID assigned to the patient record (EPT .1).
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * The member�s covered status for the coverage, such as Y � the coverage is verified and in effect, or N � the coverage was invalidated manually
     */
    MEM_COVERED_YN: string;
    /**
     * Stores the category identifier of the member's relationship to the subscriber
     */
    MEM_REL_TO_SUB_C_NAME: string;
    /**
     * The verification record for the coverage member.
     */
    MEM_VERIFICATION_ID: number;
    /**
     * The identification number assigned to the member for the coverage.
     */
    MEM_NUMBER: string;
    /**
     * The date on which the coverage goes into effect for the member.
     */
    MEM_EFF_FROM_DATE: Date;
    /**
     * If the member is a full time student this column contains the value �Y�
     */
    MEM_STUDENT_YN: string;
    /**
     * Stores the category identifier of member's covered status, such as whether their coverage is currently valid or in question
     */
    MEM_COVERED_C_NAME: string;
    /**
     * Reference to parent COVERAGE
     */
    coverage?: COVERAGE;
}

/**
 * This table contains information about who is sponsoring this coverage for the subscriber, such as current employment
 * pk: CVG_ID, LINE
 */
export interface COVERAGE_SPONSOR {
    /**
     * The unique ID of the coverage record for this row
     */
    CVG_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Covered through (I CVG 206) and Employer Size (I CVG 207) are tracked over time since they can affect filing order and MSP logic
     */
    SPONSR_EFF_FROM_DT: Date;
    /**
     * Covered through current employment, retirement, COBRA, or other
     */
    COVERED_THROUGH_C_NAME: string;
    /**
     * Number of employees for the employer that sponsors this coverage
     */
    EMPLOYER_SIZE_C_NAME: string;
    /**
     * Reference to parent COVERAGE
     */
    coverage?: COVERAGE;
}

/**
 * This table contains the list of guarantor accounts associated with a coverage.
 * pk: CVG_ID, LINE
 */
export interface CVG_ACCT_LIST {
    /**
     * The unique ID of the coverage
     */
    CVG_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The ID of the account sharing coverage
     */
    ACCT_SHARING_CVG_ID: number;
    /**
     * Reference to ACCOUNT based on ACCT_SHARING_CVG_ID
     */
    acct_sharing_cvg?: ACCOUNT;
    /**
     * Reference to parent COVERAGE
     */
    coverage?: COVERAGE;
}

/**
 * This table contains each coverage subscriber's street address.
 * pk: CVG_ID, LINE
 */
export interface CVG_SUBSCR_ADDR {
    /**
     * The unique identifier for the coverage record.
     */
    CVG_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The street address of the subscriber associated with the coverage record.
     */
    SUBSCR_ADDR: string;
    /**
     * Reference to parent COVERAGE
     */
    coverage?: COVERAGE;
}

/**
 * This table contains a list of medications that have been discontinued for a patient during an encounter.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface DISCONTINUED_MEDS {
    /**
     * The unique identifier of the patient encounter
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The Line Count
     */
    LINE: number;
    /**
     * This is a numeric representation of the date of this encounter in your system
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The date on which the patient encounter occurred.
     */
    CONTACT_DATE: Date;
    /**
     * This column contains medications that were discontinued for the patient during the associated patient encounter.
     */
    MEDS_DISCONTINUED: number;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * This table contains references to the document from patient contacts, by contact serial number
 * pk: DOCUMENT_ID, LINE
 */
export interface DOC_CSN_REFS {
    /**
     * The unique identifier for the document record.
     */
    DOCUMENT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This item contains the patient contacts (by contact serial number) that reference this document
     */
    CSN_REFERENCE: number;
    /**
     * Reference to parent DOC_INFORMATION
     */
    doc_information?: DOC_INFORMATION;
}

/**
 * Linked patient contact serial numbers for EHI Export.
 * pk: DOCUMENT_ID, LINE
 */
export interface DOC_LINKED_PAT_CSNS {
    /**
     * The unique identifier (.1 item) for the document record.
     */
    DOCUMENT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The list of patient contact serial numbers that this DCS is associated with for Electronic Health Information (EHI) Export
     */
    LINKED_PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on LINKED_PAT_ENC_CSN_ID
     */
    linked_pat_enc_csn?: PAT_ENC;
    /**
     * Reference to parent DOC_INFORMATION
     */
    doc_information?: DOC_INFORMATION;
}

/**
 * Linked patients for EHI Export.
 * pk: DOCUMENT_ID, LINE
 */
export interface DOC_LINKED_PATS {
    /**
     * The unique identifier (.1 item) for the document record.
     */
    DOCUMENT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The list of patients (EPT) that this DCS is associated with for Electronic Health Information (EHI) Export
     */
    LINKED_PAT_ID: string;
    /**
     * Reference to PATIENT based on LINKED_PAT_ID
     */
    linked_pat?: PATIENT;
    /**
     * Reference to parent DOC_INFORMATION
     */
    doc_information?: DOC_INFORMATION;
}

/**
 * This table links the hospital account to the document (DCS) records relevant to the encounters associated with the hospital account.
 * pk: ACCT_ID, LINE
 */
export interface DOCS_FOR_HOSP_ACCT {
    /**
     * The unique ID of the hospital account (HAR) record for this row.
     */
    ACCT_ID: number;
    /**
     * Reference to HAR_ALL based on ACCT_ID
     */
    acct?: HAR_ALL;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Document (DCS) record ID of the document(s) attached to the hospital account.
     */
    LINKED_DCS_ID: string;
}

/**
 * This table stores allergy reactions received from outside sources.
 * pk: DOCUMENT_ID, CONTACT_DATE_REAL, LINE
 */
export interface DOCS_RCVD_ALG_REAC {
    /**
     * This item stores the Received Document record ID.
     */
    DOCUMENT_ID: number;
    /**
     * This is a numeric representation of the date of this encounter in your system
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * Contact date
     */
    CONTACT_DATE: Date;
    /**
     * This item stores the allergy reference identifier that's associated with the reaction.
     */
    REAC_ALG_REF_ID: string;
    /**
     * This item stores the name of the reaction.
     */
    REAC_NAME: string;
    /**
     * This item stores the reaction category value which maps to the one sent by the external source.
     */
    REAC_ID_C_NAME: string;
    /**
     * This item stores the coded identifier for the reaction.
     */
    REAC_CODE: string;
    /**
     * This item stores the reaction coding system associated with the code that represents the reaction.
     */
    REAC_CODING_SYSTEM: string;
    /**
     * This item stores the reaction severity.
     */
    REAC_SEVERITY: string;
    /**
     * This item stores the mapped reaction severity.
     */
    REAC_SEVERITY_ID_C_NAME: string;
    /**
     * This item stores the type of change associated with the reaction.
     */
    REAC_TYPE_OF_CHNG_C_NAME: string;
}

/**
 * This table stores discrete allergies information received from outside sources.
 * pk: DOCUMENT_ID, CONTACT_DATE_REAL, GROUP_LINE, VALUE_LINE
 */
export interface DOCS_RCVD_ALGS_CMT {
    /**
     * This item stores the Received Document record ID.
     */
    DOCUMENT_ID: number;
    /**
     * This is a numeric representation of the date of this encounter in your system
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact.
     */
    GROUP_LINE: number;
    /**
     * The Value Count
     */
    VALUE_LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * This item stores the allergy comments.
     */
    ALG_COMMENTS: string;
    /**
     * Reference to parent DOCS_RCVD_ALGS
     */
    docs_rcvd_algs?: DOCS_RCVD_ALGS;
}

/**
 * This table stores discrete allergies information received from outside sources.
 * pk: DOCUMENT_ID, CONTACT_DATE_REAL, LINE
 */
export interface DOCS_RCVD_ALGS {
    /**
     * This item stores the Received Document record ID.
     */
    DOCUMENT_ID: number;
    /**
     * This is a numeric representation of the date of this encounter in your system
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * This item stores a unique reference identifier to identify a specific instance of an allergy.
     */
    ALG_REF_ID: string;
    /**
     * This item stores the overall allergy severity.
     */
    ALG_SEVERITY_C_NAME: string;
    /**
     * This item stores the date when the allergy was noted by the external system.
     */
    ALG_DATE_NOTED_DT: Date;
    /**
     * This item stores the source Problem List record identifier.
     */
    ALG_SRC_LPL_ID: number;
    /**
     * This item stores the type of change being performed on the allergy.
     */
    ALG_TYPE_OF_CHNG_C_NAME: string;
    /**
     * This item stores the display name of the allergen as sent by the external source.
     */
    ALGN_NAME: string;
    /**
     * This item stores the Allergen record identifier that maps to the allergen from the external source.
     */
    ALGN_ID: number;
    /**
     * The name of the allergen record.
     */
    ALGN_ID_ALLERGEN_NAME: string;
    /**
     * This item stores the date and time when the allergy was last updated by the external system.
     */
    ALG_LAST_UPD_DTTM: Date;
    /**
     * If this allergy is a patient-entered allergy (i.e
     */
    ALG_PT_SRC_APP_C_NAME: string;
    /**
     * This item stores the text value of the allergy reaction type sent by the external source.
     */
    ALGRX_TYPE: string;
    /**
     * This item stores the value from the statusCode node in a received CDA document
     */
    ALG_STATE_C_NAME: string;
    /**
     * This item stores the value from the status entryRelationship node in a received CDA document
     */
    ALG_STATUS_ENTRY_C_NAME: string;
    /**
     * Stores the Patient Access Accounts ID of the MyChart user who edited the allergy for the contact.
     */
    ALG_SRC_WPR_ID: string;
    /**
     * This item stores the category value for overall allergy criticality.
     */
    ALG_CRITICALITY_C_NAME: string;
    /**
     * This item stores the free text allergy criticality.
     */
    ALG_CRITICALITY_TXT: string;
    /**
     * Collection of DOCS_RCVD_ALGS_CMT as children
     */
    docs_rcvd_algs_cmt?: DOCS_RCVD_ALGS_CMT[];
}

/**
 * Table to maintain information related to assessments and risk scores
 * pk: DOCUMENT_ID, CONTACT_DATE_REAL, LINE
 */
export interface DOCS_RCVD_ASMT {
    /**
     * This item stores the Received Document record ID.
     */
    DOCUMENT_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * This item stores the unique reference identifier associated with the assessment.
     */
    ASMT_REF_ID: string;
    /**
     * This item stores the last update instant of this assessment in UTC.
     */
    ASMT_LAST_UPD_INST_DTTM: Date;
    /**
     * This item stores the assessment name sent by the external source.
     */
    ASMT_NAME: string;
}

/**
 * This table stores procedure information received from outside sources.
 * pk: DOCUMENT_ID, CONTACT_DATE_REAL, LINE
 */
export interface DOCS_RCVD_PROC {
    /**
     * The unique identifier for the document record.
     */
    DOCUMENT_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * This item stores the unique reference ID.
     */
    PROC_REF_ID: string;
    /**
     * This item stores the free text name for the external procedure.
     */
    PROC_TYPE_TXT: string;
    /**
     * This item stores the start date of the external procedure.
     */
    PROC_START_DATE: Date;
    /**
     * This item stores the end date of the external procedure.
     */
    PROC_END_DATE: Date;
    /**
     * Stores the last update instant of the procedure in Coordinated Universal Time (UTC).
     */
    PROC_LST_UPD_INST_DTTM: Date;
}

/**
 * This table contains eCheck-In information for a specific appointment.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface ECHKIN_STEP_INFO {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * A unique contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The step of the eCheck-In workflow.
     */
    INCLUDED_STEP_C_NAME: string;
    /**
     * The status of the specific step mentioned in the eCheck-In workflow.
     */
    ECHKIN_STEP_STAT_C_NAME: string;
    /**
     * Stores the instant (in UTC) the step was completed in the eCheck-In workflow
     */
    STEP_COMPLETED_UTC_DTTM: Date;
    /**
     * Stores the MyChart user ID that did the eCheck-In step.
     */
    MYPT_ID: string;
    /**
     * The category ID for the action taken on an eCheck-In step.
     */
    STEP_ACTION_C_NAME: string;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * This table contains information about the current event records.
 * pk: EVENT_ID, LINE
 */
export interface ED_IEV_EVENT_INFO {
    /**
     * The unique ID of the event record.
     */
    EVENT_ID: string;
    /**
     * The line number for the information associated with this event
     */
    LINE: number;
    /**
     * The instant when the event occurred.
     */
    EVENT_TIME: Date;
    /**
     * The unique ID of the user who initiated the event
     */
    EVENT_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on EVENT_USER_ID
     */
    event_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    EVENT_USER_ID_NAME: string;
}

/**
 * The ED_PAT_STATUS table contains information about ED patients' "patient" status
 * pk: INPATIENT_DATA_ID, LINE
 */
export interface ED_PAT_STATUS {
    /**
     * The unique ID associated with the Inpatient Data Store record for this row
     */
    INPATIENT_DATA_ID: string;
    /**
     * The line number for the information associated with this patient status
     */
    LINE: number;
    /**
     * The category number of the ED patient status for the ED encounter.
     */
    ED_PAT_STATUS_C_NAME: string;
    /**
     * The date and time when the ED patient status was set.
     */
    PAT_STATUS_TIME: Date;
    /**
     * The unique ID of the user who is associated with this status change
     */
    PAT_STATUS_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on PAT_STATUS_USER_ID
     */
    pat_status_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    PAT_STATUS_USER_ID_NAME: string;
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * Reference to parent IP_DATA_STORE
     */
    ip_data_store?: IP_DATA_STORE;
}

/**
 * This table contains information about Episode Definition records.
 * pk: EPISODE_DEF_ID
 */
export interface EPISODE_DEF {
    /**
     * The unique identifier for the block type record.
     */
    EPISODE_DEF_ID: number;
    /**
     * This column displays the episode type.
     */
    EPISODE_TYPE_C_NAME: string;
    /**
     * This column displays the name of the episode / block definition record.
     */
    EPISODE_DEF_NAME: string;
}

/**
 * The EPISODE_OT table contains overtime information on the episodes recorded in clinical system for your patients.
 * pk: SUMMARY_BLOCK_ID, CONTACT_DATE_REAL
 */
export interface EPISODE_OT {
    /**
     * The unique identifier of the episode record.
     */
    SUMMARY_BLOCK_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The unique contact serial number (CSN) of the contact
     */
    CONTACT_SERIAL_NUM: number;
    /**
     * The number for this contact.
     */
    CONTACT_NUM: string;
    /**
     * Reference to parent EPISODE
     */
    episode?: EPISODE;
}

/**
 * All values associated with a claim are stored in the Claim External Value record
 * pk: RECORD_ID, LINE
 */
export interface EXT_CAUSE_INJ_DX {
    /**
     * The unique identifier for the claim record.
     */
    RECORD_ID: number;
    /**
     * Reference to CLM_VALUES based on RECORD_ID
     */
    record?: CLM_VALUES;
    /**
     * The line number of one of the multiple values associated with a specific group of data within this record.
     */
    LINE: number;
    /**
     * This item holds the qualifier identifying the code set for the external cause of injury diagnoses.
     */
    EXT_CAUSE_INJ_QUAL: string;
    /**
     * This item holds the external cause of injury diagnoses for the claim.
     */
    EXT_CAUSE_INJ_DX: string;
}

/**
 * The pharmacy coverage type returned from Surescripts eligibility response.
 * pk: PAT_ENC_CSN_ID, GROUP_LINE, VALUE_LINE
 */
export interface EXT_PHARM_TYPE_COVERED {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact.
     */
    GROUP_LINE: number;
    /**
     * The line number of one of the multiple values associated with a specific group of data within this contact.
     */
    VALUE_LINE: number;
    /**
     * Stores pharmacy coverage type for SureScripts 5010
     */
    COVERED_EXTERNAL_PHARM_TYPE_C_NAME: string;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * Family status relationship table
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface FAMILY_HX_STATUS {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The family status relationship category number for the relationship between the patient and their family member.
     */
    FAM_STAT_REL_C_NAME: string;
    /**
     * The family status category number for the family member, such as 1 for "alive" and 2 for "deceased".
     */
    FAM_STAT_STATUS_C_NAME: string;
    /**
     * The family status source category number for the source of corresponding family status information.
     */
    FAM_STAT_SRC_C_NAME: string;
    /**
     * The Contact Serial Number of the encounter in which the history was created/edited
     */
    HX_LNK_ENC_CSN: number;
    /**
     * The Unique ID for the family member.
     */
    FAM_STAT_ID: number;
    /**
     * Unique ID for the Father
     */
    FAM_STAT_FATHER_ID: number;
    /**
     * Unique ID for the mother.
     */
    FAM_STAT_MOTHER_ID: number;
    /**
     * This item stores the sex of a family member of the patient.
     */
    FAM_STAT_SEX_C_NAME: string;
    /**
     * Gender identity for a family member.
     */
    FAM_STAT_GENDER_IDENTITY_C_NAME: string;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * The FAMILY_HX table contains data recorded in the family history contacts entered in the patient's chart during a clinical system encounter
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface FAMILY_HX {
    /**
     * The line number to identify the family history contact within the patient�s record
     */
    LINE: number;
    /**
     * The category value associated with the Problem documented in the patient�s family history.
     */
    MEDICAL_HX_C_NAME: string;
    /**
     * Free-text comments entered with this problem
     */
    COMMENTS: string;
    /**
     * A unique serial number for this encounter
     */
    PAT_ENC_CSN_ID: number;
    /**
     * This item contains the source of information for a patient's family medical history.
     */
    FAM_HX_SRC_C_NAME: string;
    /**
     * This is the category value associated with the family member who has or had this problem
     */
    RELATION_C_NAME: string;
    /**
     * This item contains the unique ID of the patient's family member relationship for medical history.
     */
    FAM_MED_REL_ID: number;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * This table contains information about the physician who finalized a study and when it was finalized.
 * pk: ORDER_ID, LINE
 */
export interface FINALIZE_PHYSICIAN {
    /**
     * The unique identifier for the order record.
     */
    ORDER_ID: number;
    /**
     * Reference to ORDER_PROC based on ORDER_ID
     */
    order?: ORDER_PROC;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This item stores the physician who finalized a study.
     */
    FINALIZE_PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on FINALIZE_PROV_ID
     */
    finalize_prov?: CLARITY_SER;
    /**
     * This item stores the instant that a study is finalized.
     */
    FINALIZING_INS_DTTM: Date;
    /**
     * CAUTION: This item stores data that must be kept in sync with Order item 52269 - Finalizing Instant UTC, Bucketed
     */
    FINALIZING_INST_UTC_DTTM: Date;
}

/**
 * This table contains data on the last instant of data being filed to a single column template in Doc Flowsheets.
 * pk: FSD_ID, LINE
 */
export interface FLWSHT_SINGL_COL {
    /**
     * The unique identifier for the record.
     */
    FSD_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This item stores the Flowsheet ID of a row that has been documented on a single column template, with Single Column Recorded Instant - Single Rcrd (FSD 5005) holding the most recent time recorded for this row.
     */
    SINGLE_FLO_ID: string;
    /**
     * This item stores the most recent time recorded for a Flowsheet ID in the Single Column FLO ID (related item FSD 5000) that was documented on a single column template
     */
    SINGLE_RCRD_IN_DTTM: Date;
    /**
     * Reference to parent IP_FLWSHT_REC
     */
    ip_flwsht_rec?: IP_FLWSHT_REC;
}

/**
 * This table stores status and update information for screening forms, including form status and last editing user and time.
 * pk: SCREENING_FORM_ID, LINE
 */
export interface FRM_STATUS {
    /**
     * The unique identifier for the screening form record.
     */
    SCREENING_FORM_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The screening form status category ID for the screening form.
     */
    FRM_STATUS_C_NAME: string;
    /**
     * The users who updated or edited the screening form.
     */
    STATUS_AUD_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on STATUS_AUD_USER_ID
     */
    status_aud_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    STATUS_AUD_USER_ID_NAME: string;
    /**
     * The times when the screening form was updated or edited.
     */
    STATUS_AUD_DTTM: Date;
    /**
     * Reference to parent TIMEOUT
     */
    timeout?: TIMEOUT;
}

/**
 * This table stores information about front-end collection actions taken through point of sale (POS) payment posting or refund workflows.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface FRONT_END_PMT_COLL_HX {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The instant that this event occurred.
     */
    COLL_INSTANT_UTC_DTTM: Date;
    /**
     * The workflow in which this event took place.
     */
    COLL_WORKFLOW_TYPE_C_NAME: string;
    /**
     * The unique ID of the department which a user was logged into at the time of this event.
     */
    LOGIN_DEPARTMENT_ID: number;
    /**
     * Reference to CLARITY_DEP based on LOGIN_DEPARTMENT_ID
     */
    login_department?: CLARITY_DEP;
    /**
     * The unique ID of the encounter department associated with this event.
     */
    ENC_DEPARTMENT_ID: number;
    /**
     * Reference to CLARITY_DEP based on ENC_DEPARTMENT_ID
     */
    enc_department?: CLARITY_DEP;
    /**
     * The non-collection reason category ID for this event.
     */
    RSN_NON_COLL_AMT_C_NAME: string;
    /**
     * The free text non-collection comment explaining why some portion of a due amount was not collected.
     */
    RSN_NON_COLL_AMT_COMMENT: string;
    /**
     * The unique ID of the guarantor who is associated with this event.
     */
    GUARANTOR_ACCOUNT_ID: number;
    /**
     * Reference to ACCOUNT based on GUARANTOR_ACCOUNT_ID
     */
    guarantor_account?: ACCOUNT;
    /**
     * The event type category ID that defines the type of payment event data that is stored in this row.
     */
    EVENT_TYPE_C_NAME: string;
    /**
     * The amount of professional billing copay that a user collected during this event.
     */
    PB_COPAY_COLL: number;
    /**
     * The amount of professional billing copay that had already been paid towards an encounter at the time of this event.
     */
    PB_COPAY_PAID: number;
    /**
     * The total amount of professional billing copay that is required for this visit at the time of this event.
     */
    PB_COPAY_DUE: number;
    /**
     * The amount of hospital billing copay that a user collected during this event.
     */
    HB_COPAY_COLL: number;
    /**
     * The amount of hospital billing copay that had already been paid towards an encounter at the time of this event.
     */
    HB_COPAY_PAID: number;
    /**
     * The total amount of hospital billing copay that is required for this visit at the time of this event.
     */
    HB_COPAY_DUE: number;
    /**
     * The amount of professional billing prepayment that a user collected.
     */
    PB_PREPAY_COLL: number;
    /**
     * The amount of professional billing prepayment that had already been paid towards an encounter at the time of this event.
     */
    PB_PREPAY_PAID: number;
    /**
     * The total amount of professional billing prepayment that is required for this visit at the time of this event.
     */
    PB_PREPAY_DUE: number;
    /**
     * The amount of hospital billing prepayment that a user collected during this event.
     */
    HB_PREPAY_COLL: number;
    /**
     * The amount of hospital billing prepayment that had already been paid towards an encounter at the time of this event.
     */
    HB_PREPAY_PAID: number;
    /**
     * The total amount of hospital billing prepayment that is required for this visit at the time of this event.
     */
    HB_PREPAY_DUE: number;
    /**
     * The amount of professional billing previous balance that a user collected during this event.
     */
    PB_PREV_BAL_COLL: number;
    /**
     * The amount of professional billing previous balance that had already been paid towards this guarantor's outstanding balance during the day of this event.
     */
    PB_PREV_BAL_PAID: number;
    /**
     * The amount of self-pay professional billing outstanding balance that a guarantor owed at the time of this event.
     */
    PB_PREV_BAL_DUE: number;
    /**
     * The amount of hospital billing previous balance that a user collected during this event.
     */
    HB_PREV_BAL_COLL: number;
    /**
     * The amount of hospital billing previous balance that had already been paid towards this guarantor's outstanding balance during the day of this event.
     */
    HB_PREV_BAL_PAID: number;
    /**
     * The amount of self-pay hospital billing outstanding balance that a guarantor owed at the time of this event.
     */
    HB_PREV_BAL_DUE: number;
    /**
     * The total amount of the prepay discount that was offered for this visit at the time of this event.
     */
    PREPAY_DISCOUNT_OFFERED: number;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * The GEO_REGION table contains information about geographical regions
 * pk: GEO_REGION_ID
 */
export interface GEO_REGION {
    /**
     * The unique identifier for the geographical region record.
     */
    GEO_REGION_ID: number;
    /**
     * Reference to CLARITY_HM_TOPIC based on GEO_REGION_ID
     */
    geo_region?: CLARITY_HM_TOPIC;
    /**
     * The record name for the geographical region record.
     */
    GEO_REGION_NAME: string;
}

/**
 * This table contains goal template information
 * pk: GOAL_TEMPLATE_ID
 */
export interface GOAL_TEMPLATES {
    /**
     * The unique identifier for the goal template record.
     */
    GOAL_TEMPLATE_ID: number;
    /**
     * The goal template name.
     */
    GOAL_TEMPLATE_NAME: string;
}

/**
 * This table contains statement history information for the guarantor account.
 * pk: ACCOUNT_ID, LINE
 */
export interface GUAR_ACCT_STMT_HX {
    /**
     * The unique identifier for the account record.
     */
    ACCOUNT_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The date on which statement was generated.
     */
    STMT_HX_STMT_DATE: Date;
    /**
     * The invoice number of the invoice that was sent to the guarantor on this date.
     */
    STMT_HX_INVOICE_NUM: string;
    /**
     * The original amount of all new charges on this invoice
     */
    STMT_HX_NEW_CHARGE: number;
    /**
     * The new balance on the statement.
     */
    STMT_HX_NEW_BALANCE: number;
    /**
     * Total amount held on the statement.
     */
    STMT_HX_TTL_AMT_HLD: number;
    /**
     * Total amount voided since last statement.
     */
    STMT_HX_TTL_AMT_VD: number;
    /**
     * The statement delivery method category ID for the guarantor.
     */
    STMT_HX_DVRY_MTHD_C_NAME: string;
    /**
     * Reference to parent ACCOUNT
     */
    account?: ACCOUNT;
}

/**
 * This table holds the Accounts Receivable (EAR) related group 5000 pertaining to Guarantor Address Change History.
 * pk: ACCOUNT_ID, LINE
 */
export interface GUAR_ADDR_HX {
    /**
     * The unique identifier for the account record.
     */
    ACCOUNT_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column specifies the date on which the address change described on the rest of the row was performed.
     */
    ADDR_CHANGE_DATE: Date;
    /**
     * This column contains the first line of a previous guarantor address.
     */
    ADDR_HX_1: string;
    /**
     * This column contains the city for a previous address for this guarantor.
     */
    CITY_HX: string;
    /**
     * This column contains the state for a previous address for this guarantor.
     */
    STATE_HX_C_NAME: string;
    /**
     * This column contains the ZIP code for a previous address for this guarantor.
     */
    ZIP_HX: string;
    /**
     * This column contains the context from which the address change was performed.
     */
    ADDR_CHANGE_SRC_C_NAME: string;
    /**
     * Reference to parent ACCOUNT
     */
    account?: ACCOUNT;
}

/**
 * This table stores PB Guarantor Payment Score history items.
 * pk: ACCOUNT_ID, LINE
 */
export interface GUAR_PMT_SCORE_PB_HX {
    /**
     * The unique identifier for the account record.
     */
    ACCOUNT_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This history item will store the date that the score was calculated.
     */
    SCORE_DATE: Date;
    /**
     * This history item will store self-pay score.
     */
    SCORE: number;
    /**
     * Reference to parent ACCOUNT
     */
    account?: ACCOUNT;
}

/**
 * Generic table that contains every hospital account record regardless of its type
 * pk: ACCT_ID
 */
export interface HAR_ALL {
    /**
     * This column stores the unique identifier for the hospital account.
     */
    ACCT_ID: number;
    /**
     * This column stores the unique identifier for the patient associated with this hospital account.
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * The contact serial number associated with the primary patient contact.
     */
    PRIM_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PRIM_ENC_CSN_ID
     */
    prim_enc_csn?: PAT_ENC;
    /**
     * Collection of CODE_INT_COMB_LN as children
     */
    code_int_comb_ln?: CODE_INT_COMB_LN[];
    /**
     * Collection of HSP_ACCT_CVG_LIST as children
     */
    hsp_acct_cvg_list?: HSP_ACCT_CVG_LIST[];
    /**
     * Collection of HSP_ACCT_OTHR_PROV as children
     */
    hsp_acct_othr_prov?: HSP_ACCT_OTHR_PROV[];
    /**
     * Collection of HSP_ACCT_PRORATION as children
     */
    hsp_acct_proration?: HSP_ACCT_PRORATION[];
}

/**
 * This table contains data related to when the patient was contacted for upcoming or overdue health maintenance topics.
 * pk: PAT_ID, LINE
 */
export interface HM_ENC_DATE {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The HM_LET_PAT_ENC_CSN_ID column stores the CSN for a Health Maintenance letter.
     */
    HM_LET_PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on HM_LET_PAT_ENC_CSN_ID
     */
    hm_let_pat_enc_csn?: PAT_ENC;
}

/**
 * Health Maintenance forecast information for the next completion.
 * pk: PAT_ID, LINE
 */
export interface HM_FORECAST_INFO {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column stores a Health Maintenance topic that has forecast information.
     */
    HM_FORECAST_TOPIC_ID: number;
    /**
     * Reference to CLARITY_HM_TOPIC based on HM_FORECAST_TOPIC_ID
     */
    hm_forecast_topic?: CLARITY_HM_TOPIC;
    /**
     * The name of the health maintenance topic.
     */
    HM_FORECAST_TOPIC_ID_NAME: string;
    /**
     * This column stores the earliest date that the current completion will be considered valid.
     */
    EARLIEST_VALID_DATE: Date;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * Records Health Maintenance status over time.
 * pk: PAT_ID, LINE
 */
export interface HM_HISTORICAL_STATUS {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The Health Maintenance topic that applied to the patient at the time the snapshot was taken.
     */
    HM_TOPIC_ID: number;
    /**
     * Reference to CLARITY_HM_TOPIC based on HM_TOPIC_ID
     */
    hm_topic?: CLARITY_HM_TOPIC;
    /**
     * The name of the health maintenance topic.
     */
    HM_TOPIC_ID_NAME: string;
    /**
     * Indicates the patient's due status for the Health Maintenance topic at the time the snapshot was taken.
     */
    HM_STATUS_C_NAME: string;
    /**
     * The patient's next due date for this Health Maintenance topic at the time the snapshot was taken.
     */
    NEXT_DUE_DATE: Date;
    /**
     * The date this patient last had a completion for the Health Maintenance topic, as of the time the snapshot was taken.
     */
    LAST_COMPLETED_DATE: Date;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * The HM_HISTORY table records information about completed and manually overridden clinical system health maintenance topics that apply to each patient
 * pk: PAT_ID, LINE
 */
export interface HM_HISTORY {
    /**
     * The unique ID assigned to the patient record
     */
    PAT_ID: string;
    /**
     * Identifies the health maintenance topic within the patient�s record.
     */
    LINE: number;
    /**
     * Stores the type of Health Maintenance completion
     */
    HM_COMP_TYPE_C_NAME: string;
    /**
     * Instant of Health Maintenance completion.
     */
    HM_COMP_UTC_DTTM: Date;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table contains data about a Health Maintenance Plan's record ID and name.
 * pk: HM_PLAN_ID
 */
export interface HM_PLAN_INFO {
    /**
     * The unique identifier of the Health Maintenance Plan record.
     */
    HM_PLAN_ID: number;
    /**
     * The name of the Health Maintenance Plan record.
     */
    HM_PLAN_NAME: string;
}

/**
 * Orders that are associated to the note.
 * pk: NOTE_ID, LINE
 */
export interface HNO_ORDERS {
    /**
     * The unique identifier (.1 item) for the note record.
     */
    NOTE_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The order ID associated to the note.
     */
    ORDER_ID: number;
    /**
     * Reference to ORDER_PROC based on ORDER_ID
     */
    order?: ORDER_PROC;
    /**
     * The order DAT associated to the note.
     */
    ORDER_DAT: string;
    /**
     * Reference to parent HNO_INFO
     */
    hno_info?: HNO_INFO;
}

/**
 * This table extracts notes that are stored only in plain text
 * pk: NOTE_CSN_ID, LINE
 */
export interface HNO_PLAIN_TEXT {
    /**
     * The contact serial number (CSN) of the contact.
     */
    NOTE_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The unique identifier (.1 item) for the note record.
     */
    NOTE_ID: string;
    /**
     * Reference to HNO_INFO based on NOTE_ID
     */
    note?: HNO_INFO;
    /**
     * Content of the plain text note.
     */
    NOTE_TEXT: string;
    /**
     * Reference to parent ABN_FOLLOW_UP
     */
    abn_follow_up?: ABN_FOLLOW_UP;
}

/**
 * This table contains adjustment lists for hospital accounts.
 * pk: HSP_ACCOUNT_ID, LINE
 */
export interface HSP_ACCT_ADJ_LIST {
    /**
     * This column stores the unique identifier for the hospital account.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column stores the unique identifier for the adjustment associated with this hospital account.
     */
    ADJ_ID: number;
    /**
     * Reference to HSP_TRANSACTIONS based on ADJ_ID
     */
    adj?: HSP_TRANSACTIONS;
    /**
     * Reference to parent HSP_ACCOUNT
     */
    hsp_account?: HSP_ACCOUNT;
}

/**
 * This table contains hospital account admit diagnoses from the Hospital Accounts Receivable (HAR) master file.
 * pk: HSP_ACCOUNT_ID, LINE
 */
export interface HSP_ACCT_ADMIT_DX {
    /**
     * This column stores the unique identifier for the hospital account.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * This column stores the line number in the results of a query
     */
    LINE: number;
    /**
     * This column stores the unique identifier for admission diagnosis stored in the hospital account.
     */
    ADMIT_DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on ADMIT_DX_ID
     */
    admit_dx?: CLARITY_EDG;
    /**
     * Reference to parent HSP_ACCOUNT
     */
    hsp_account?: HSP_ACCOUNT;
}

/**
 * This table contains hospital account attending provider information from the Hospital Accounts Receivable (HAR) master file.
 * pk: HSP_ACCOUNT_ID, LINE
 */
export interface HSP_ACCT_ATND_PROV {
    /**
     * This column stores the unique identifier for the hospital account.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * This column stores the line number of the attending provider for the patient associated with the hospital account
     */
    LINE: number;
    /**
     * This column stores the unique identifier for the attending provider stored in the hospital account.
     */
    ATTENDING_PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on ATTENDING_PROV_ID
     */
    attending_prov?: CLARITY_SER;
    /**
     * The date on which a provider began to be an attending provider for the patient associated with the hospital account.
     */
    ATTEND_DATE_FROM: Date;
    /**
     * The date on which a provider ceased to be an attending provider for the patient associated with the hospital account.
     */
    ATTEND_DATE_TO: Date;
    /**
     * Reference to parent HSP_ACCOUNT
     */
    hsp_account?: HSP_ACCOUNT;
}

/**
 * This table contains the hospital account charge list, which is the transaction list associated with the account.
 * pk: HSP_ACCOUNT_ID, LINE
 */
export interface HSP_ACCT_CHG_LIST {
    /**
     * This column stores the unique identifier for the hospital account.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * The line count for the hospital account charge list related group.
     */
    LINE: number;
    /**
     * This column stores the unique identifier for the charge in the charge list on this hospital account.
     */
    TX_ID: number;
    /**
     * Reference to HSP_TRANSACTIONS based on TX_ID
     */
    tx?: HSP_TRANSACTIONS;
    /**
     * Reference to parent HSP_ACCOUNT
     */
    hsp_account?: HSP_ACCOUNT;
}

/**
 * This table contains collection agency history information from the Hospital Accounts Receivable (HAR) master file.
 * pk: HSP_ACCOUNT_ID, LINE
 */
export interface HSP_ACCT_CL_AG_HIS {
    /**
     * This column stores the unique identifier for the hospital account with associated collection agency information.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * The line number in the results of a query
     */
    LINE: number;
    /**
     * Date hospital account was either assigned to or withdrawn from the collection agency.
     */
    AGNCY_HST_DT_OF_CH: Date;
    /**
     * Change in the collection agency status
     */
    AGNC_HST_CHG_TP_C_NAME: string;
    /**
     * ID of collection agency hospital account has been assigned to.
     */
    AGNCY_HST_AGNCY_ID: number;
    /**
     * Reference to CL_COL_AGNCY based on AGNCY_HST_AGNCY_ID
     */
    agncy_hst_agncy?: CL_COL_AGNCY;
    /**
     * The name of the collection agency.
     */
    AGNCY_HST_AGNCY_ID_COLL_AGENCY_NAME: string;
    /**
     * This column stores the type of collection action done on the hospital account: 1-Send Letter, 2-Pre-Collect, 3-Bad Debt, 4-Return to Self-Pay, 5-Write Off, 6-Create Billing Note, 7-Change Notification Date, 8-Add to Queue, 10- Outsource Account, 11- Return from Outsource, 12-Change Agency, 13-Set Billing Indicator, or 14-Send SmartText Letter.
     */
    AGN_HST_COL_ACT_C_NAME: string;
    /**
     * Account balance on the hospital account that was sent to collections.
     */
    AGNCY_HST_ACCT_BAL: number;
    /**
     * Reference to parent HSP_ACCOUNT
     */
    hsp_account?: HSP_ACCOUNT;
}

/**
 * This table contains hospital account claims information extracted from hospital account records.
 * pk: ACCT_ID
 */
export interface HSP_ACCT_CLAIM_HAR {
    /**
     * This column stores the unique identifier for the hospital account.
     */
    ACCT_ID: number;
    /**
     * Reference to HSP_ACCOUNT based on ACCT_ID
     */
    acct?: HSP_ACCOUNT;
    /**
     * The admission type category ID for the hospital account.
     */
    ADMISSION_TYPE_C_NAME: string;
    /**
     * The admission source (e.g., Physician Referral, Transfer from a Hospital, Information Not Available) for the patient encounter associated with this hospital account.
     */
    ADMISSION_SOURCE_C_NAME: string;
    /**
     * The patient status for the patient associated with this hospital account (e.g., Alive, Dead, Unknown, Discharged to Home or Self Care, Admitted as an Inpatient to this Hospital).
     */
    PATIENT_STATUS_C_NAME: string;
}

/**
 * This table contains hospital account and PB visit coverage list information from the Hospital Accounts Receivable (HAR) master file.
 * pk: HSP_ACCOUNT_ID, LINE
 */
export interface HSP_ACCT_CVG_LIST {
    /**
     * This column stores the unique identifier for the hospital account.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * This column stores the line number in the results of a query
     */
    LINE: number;
    /**
     * This column stores the unique identifier for the coverage associated with the hospital account.
     */
    COVERAGE_ID: number;
    /**
     * Reference to COVERAGE based on COVERAGE_ID
     */
    coverage?: COVERAGE;
    /**
     * This item stores whether the coverage was ignored for being assigned as primary payer
     */
    CVG_IGNR_PRIM_PAY_YN: string;
    /**
     * Reference to parent HAR_ALL
     */
    har_all?: HAR_ALL;
}

/**
 * This table contains hospital account final diagnosis list information from the Hospital Accounts Receivable (HAR) master file.
 * pk: HSP_ACCOUNT_ID, LINE
 */
export interface HSP_ACCT_DX_LIST {
    /**
     * The ID number of a hospital account.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * The line number in the results of a query
     */
    LINE: number;
    /**
     * The system ID number of a final diagnosis code stored in the hospital account.
     */
    DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on DX_ID
     */
    dx?: CLARITY_EDG;
    /**
     * Reference to parent HSP_ACCOUNT
     */
    hsp_account?: HSP_ACCOUNT;
}

/**
 * Table containing guarantor street address in guarantor demographics of the hospital account for what was the guarantor address at the time of discharge.
 * pk: ACCT_ID, LINE
 */
export interface HSP_ACCT_EARSTADDR {
    /**
     * This column stores the unique identifier for the hospital account.
     */
    ACCT_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column stores the multiple lines of the guarantor street address at time of discharge for a hospital account.
     */
    GUAR_ADDRESS: string;
    /**
     * Reference to parent HSP_ACCOUNT
     */
    hsp_account?: HSP_ACCOUNT;
}

/**
 * This table contains hospital account external injury codes information from the Hospital Accounts Receivable (HAR) master file.
 * pk: HSP_ACCOUNT_ID, LINE
 */
export interface HSP_ACCT_EXTINJ_CD {
    /**
     * This column stores the unique identifier for the hospital account.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * This column stores the line number in the results of a query
     */
    LINE: number;
    /**
     * This column stores the system identifier of a external injury code stored in the hospital account.
     */
    EXT_INJURY_DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on EXT_INJURY_DX_ID
     */
    ext_injury_dx?: CLARITY_EDG;
    /**
     * Reference to parent HSP_ACCOUNT
     */
    hsp_account?: HSP_ACCOUNT;
}

/**
 * This table contains hospital billing letters information from the Notes (HNO) master file.
 * pk: NOTE_ID
 */
export interface HSP_ACCT_LETTERS {
    /**
     * This column stores the unique identifier for the note record.
     */
    NOTE_ID: string;
    /**
     * Reference to HNO_INFO based on NOTE_ID
     */
    note?: HNO_INFO;
    /**
     * The date the letter was sent.
     */
    LETTER_SENT_DATE: Date;
    /**
     * This column stores the unique identifier for the user who created the letter.
     */
    LET_CREATE_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on LET_CREATE_USER_ID
     */
    let_create_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    LET_CREATE_USER_ID_NAME: string;
    /**
     * This column stores the unique identifier for the guarantor account that is associated with this letter
     */
    ACCOUNT_ID: number;
    /**
     * Reference to ACCOUNT based on ACCOUNT_ID
     */
    account?: ACCOUNT;
}

/**
 * This table contains the Occurrence Codes and Occurrence Dates for a Hospital Accounts Receivable (HAR) record.
 * pk: ACCT_ID, LINE
 */
export interface HSP_ACCT_OCUR_HAR {
    /**
     * This column stores the unique identifier for the hospital account.
     */
    ACCT_ID: number;
    /**
     * This column stores the line number in the results of a query
     */
    LINE: number;
    /**
     * An occurrence code stored in the hospital account.
     */
    OCCURRENCE_CODE_C_NAME: string;
    /**
     * The date associated with an occurrence code stored in the hospital account.
     */
    OCCURRENCE_DATE: Date;
    /**
     * Reference to parent HSP_ACCOUNT
     */
    hsp_account?: HSP_ACCOUNT;
}

/**
 * This table contains hospital account other providers information from the Hospital Accounts Receivable (HAR) master file.
 * pk: HSP_ACCOUNT_ID, LINE
 */
export interface HSP_ACCT_OTHR_PROV {
    /**
     * This column stores the unique identifier for the hospital account.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * This column stores the line number in the results of a query
     */
    LINE: number;
    /**
     * This column stores the unique identifier for an "other provider" stored in the hospital account
     */
    OTHER_PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on OTHER_PROV_ID
     */
    other_prov?: CLARITY_SER;
    /**
     * Reference to parent HAR_ALL
     */
    har_all?: HAR_ALL;
}

/**
 * This table contains the Proration related information from the Hospital Accounts Receivable (HAR) master file.
 * pk: HSP_ACCOUNT_ID, LINE
 */
export interface HSP_ACCT_PRORATION {
    /**
     * This column stores the unique identifier for the hospital account.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column stores the unique identifier for the coverage record on the hospital account.
     */
    COVERAGE_ID: number;
    /**
     * Reference to COVERAGE based on COVERAGE_ID
     */
    coverage?: COVERAGE;
    /**
     * Reference to parent HAR_ALL
     */
    har_all?: HAR_ALL;
}

/**
 * This table contains payment lists for hospital accounts.
 * pk: HSP_ACCOUNT_ID, LINE
 */
export interface HSP_ACCT_PYMT_LIST {
    /**
     * This column stores the unique identifier for the hospital account.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column stores the unique identifier for the payment that is associated with this hospital account.
     */
    PMT_ID: number;
    /**
     * Reference to HSP_TRANSACTIONS based on PMT_ID
     */
    pmt?: HSP_TRANSACTIONS;
    /**
     * Reference to parent HSP_ACCOUNT
     */
    hsp_account?: HSP_ACCOUNT;
}

/**
 * The HSP_ADMIT_DIAG table contains information on admission diagnoses
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface HSP_ADMIT_DIAG {
    /**
     * The line number of the admission diagnosis for the patient.
     */
    LINE: number;
    /**
     * Unique Identifier for diagnosis record used to document patient's admission diagnosis.
     */
    DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on DX_ID
     */
    dx?: CLARITY_EDG;
    /**
     * A unique serial number for this encounter
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
}

/**
 * The HSP_ADMIT_PROC table contains information on admission procedures
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface HSP_ADMIT_PROC {
    /**
     * The line number of the admission procedure for this patient.
     */
    LINE: number;
    /**
     * The coded admission procedure for the patient.
     */
    PROC_ID: number;
    /**
     * Reference to CLARITY_EAP based on PROC_ID
     */
    proc?: CLARITY_EAP;
    /**
     * A unique serial number for this encounter
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * Used for ABN checks
     */
    ADM_PXDX_ASSOC: string;
}

/**
 * The HSP_ATND_PROV table contains information on inpatient or outpatient attending providers
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface HSP_ATND_PROV {
    /**
     * The line number of the attending provider for the patient.
     */
    LINE: number;
    /**
     * The date and time the attending provider started for the patient
     */
    ATTEND_FROM_DATE: Date;
    /**
     * The date and time the attending provider ended for the patient
     */
    ATTEND_TO_DATE: Date;
    /**
     * This column stores the unique identifier for the attending provider for the patient
     */
    PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on PROV_ID
     */
    prov?: CLARITY_SER;
    /**
     * A unique serial number for this encounter
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * This table contains denial information stored in the Denial/Remark/Correspondence records in the Denial/Correspondence (BDC) master file
 * pk: BDC_ID, LINE_COUNT
 */
export interface HSP_BDC_DENIAL_DATA {
    /**
     * This column stores the unique identifier for the denial or correspondence record.
     */
    BDC_ID: number;
    /**
     * Line number of denial data
     */
    LINE_COUNT: number;
    /**
     * This column stores the line on explanation of benefits that was denied
     */
    LINE_ON_EOB: number;
    /**
     * Billed amount on the claim line that was denied
     */
    LINE_BILLED_AMOUNT: number;
    /**
     * Allowed amount for claim line that was denied
     */
    LINE_ALLWD_AMT: number;
    /**
     * This column stores the amount paid for the line that was denied
     */
    LINE_PAID_AMT: number;
    /**
     * Denied amount for claim line that was denied
     */
    LINE_DENIED_AMT: number;
    /**
     * This item stores the line-level CPT(R) code for the denial.
     */
    LINE_CPT_CODE: string;
    /**
     * The line level service date of the denial.
     */
    LINE_SERVICE_DATE: Date;
    /**
     * Reference to parent BDC_INFO
     */
    bdc_info?: BDC_INFO;
}

/**
 * Table of payors attached to denial/correspondence records
 * pk: BDC_ID, LINE
 */
export interface HSP_BDC_PAYOR {
    /**
     * This column stores the unique identifier for the denial or correspondence record.
     */
    BDC_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column stores the unique identifier for the payer that is associated with a denial/correspondence record.
     */
    PAYOR_ID: number;
    /**
     * Reference to CLARITY_EPM based on PAYOR_ID
     */
    payor?: CLARITY_EPM;
    /**
     * Reference to parent BDC_INFO
     */
    bdc_info?: BDC_INFO;
}

/**
 * This table contains recovery payment information for Denial/Correspondence (BDC) records.
 * pk: BDC_ID, LINE
 */
export interface HSP_BDC_RECV_TX {
    /**
     * This column stores the unique identifier for the denial/correspondence record.
     */
    BDC_ID: number;
    /**
     * Reference to BDC_INFO based on BDC_ID
     */
    bdc?: BDC_INFO;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The dollar amount, corresponding to a payment transaction, posted onto this denial record.
     */
    RECV_PAYMENT_TX_AMT: number;
    /**
     * This column stores the professional billing payment transactions posted onto this denial record.
     */
    PB_RECV_PMT_TX_ID: number;
    /**
     * Reference to ARPB_TRANSACTIONS based on PB_RECV_PMT_TX_ID
     */
    pb_recv_pmt_tx?: ARPB_TRANSACTIONS;
}

/**
 * Additional Payment Reconciliation Information


This table holds current information sent back by the payor at a later date
 * pk: BUCKET_ID
 */
export interface HSP_BKT_ADDTL_REC {
    /**
     * This column stores the unique identifier for the bucket record.
     */
    BUCKET_ID: number;
    /**
     * This column stores the unique identifier for the hospital account to which the liability bucket is linked.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * Reference to HSP_ACCOUNT based on HSP_ACCOUNT_ID
     */
    hsp_account?: HSP_ACCOUNT;
    /**
     * Collection of HSP_BKT_ADJ_TXS as children
     */
    hsp_bkt_adj_txs?: HSP_BKT_ADJ_TXS[];
    /**
     * Collection of HSP_BKT_NAA_ADJ_HX as children
     */
    hsp_bkt_naa_adj_hx?: HSP_BKT_NAA_ADJ_HX[];
    /**
     * Collection of HSP_BKT_PAYMENT as children
     */
    hsp_bkt_payment?: HSP_BKT_PAYMENT[];
}

/**
 * This table contains the adjustment transactions applied to liability buckets.
 * pk: BUCKET_ID, LINE
 */
export interface HSP_BKT_ADJ_TXS {
    /**
     * This column stores the unique identifier for the bucket record.
     */
    BUCKET_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column stores the unique identifier for the adjustment transaction that is associated with this liability bucket.
     */
    ADJUSTMENT_ID: number;
    /**
     * Reference to HSP_TRANSACTIONS based on ADJUSTMENT_ID
     */
    adjustment?: HSP_TRANSACTIONS;
    /**
     * This column stores the unique identifier for the hospital account to which the liability bucket is linked.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * Reference to HSP_ACCOUNT based on HSP_ACCOUNT_ID
     */
    hsp_account?: HSP_ACCOUNT;
    /**
     * Reference to parent HSP_BKT_ADDTL_REC
     */
    hsp_bkt_addtl_rec?: HSP_BKT_ADDTL_REC;
}

/**
 * This table contains hospital liability bucket invoice numbers information from the Hospital Liability Buckets (HLB) master file.
 * pk: BUCKET_ID, LINE
 */
export interface HSP_BKT_INV_NUM {
    /**
     * This column stores the unique identifier for the bucket record.
     */
    BUCKET_ID: number;
    /**
     * Reference to HSP_BKT_ADDTL_REC based on BUCKET_ID
     */
    bucket?: HSP_BKT_ADDTL_REC;
    /**
     * This column stores the line number in the results of a query
     */
    LINE: number;
    /**
     * An invoice number associated with the liability bucket.
     */
    INVOICE_NUMBER: string;
    /**
     * This column stores the unique identifier for the hospital account to which the liability bucket is linked.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * Reference to HSP_ACCOUNT based on HSP_ACCOUNT_ID
     */
    hsp_account?: HSP_ACCOUNT;
}

/**
 * The HSP_BKT_NAA_ADJ_HX table contains the history of a liability bucket that reflects how contractual adjustment write-offs were posted.
 * pk: BUCKET_ID, LINE
 */
export interface HSP_BKT_NAA_ADJ_HX {
    /**
     * This column stores the unique identifier for the bucket record.
     */
    BUCKET_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The category number for the event that generated this history row
     */
    SOURCE_C_NAME: string;
    /**
     * The bucket billed amount at the time of this contractual adjustment history row.
     */
    HLB_BILLED_AMT: number;
    /**
     * The claim billed amount at the time of this contractual adjustment history row.
     */
    CLAIM_BILLED_AMT: number;
    /**
     * This column stores the total payer-specified billed amount at the time of this contractual adjustment history row.
     */
    PAYOR_BILLED_AMT: number;
    /**
     * The expected reimbursement amount at the time of this contractual adjustment history row.
     */
    EXPECT_ALLOWED_AMT: number;
    /**
     * This column stores the total payer-specified allowed amount at the time of this contractual adjustment history row.
     */
    PAYOR_ALLOWED_AMT: number;
    /**
     * This column stores the total payer paid amount at the time of this contractual adjustment history row.
     */
    PAYOR_PAID_AMT: number;
    /**
     * This column stores the total payer non-covered amount at the time of this contractual adjustment history row.
     */
    NONCVD_AMT: number;
    /**
     * The total copay amount at the time of this contractual adjustment history row.
     */
    COPAY_AMT: number;
    /**
     * The total coinsurance amount at the time of this contractual adjustment history row.
     */
    COINSURANCE_AMT: number;
    /**
     * The total deductible amount at the time of this contractual adjustment history row.
     */
    DEDUCTIBLE_AMT: number;
    /**
     * The total not allowed amount posted on the bucket at the time of this contractual adjustment history row.
     */
    NOT_ALLOWED_AMT: number;
    /**
     * The date and time when the event in this contractual adjustment history row occurred.
     */
    ACTION_INSTANT_DTTM: Date;
    /**
     * This column stores the unique identifier for the user who is associated with this contractual adjustment history row.
     */
    USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on USER_ID
     */
    user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    USER_ID_NAME: string;
    /**
     * The effective date used by the contract for this contractual adjustment history row.
     */
    CONTRACT_EFF_DATE: Date;
    /**
     * The invoice number that is associated with this contractual adjustment history row.
     */
    INVOICE_NUM: string;
    /**
     * This column stores the unique identifier for the payment transaction that was posted for this contractual adjustment history row.
     */
    PAYMENT_ID: number;
    /**
     * The not allowed amount associated with this contractual adjustment history row that is used by a secondary claim before a not allowed adjustment is posted.
     */
    SECONDARY_NAA: number;
    /**
     * This column stores the unique identifier for the hospital account to which the liability bucket is linked.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * Reference to HSP_ACCOUNT based on HSP_ACCOUNT_ID
     */
    hsp_account?: HSP_ACCOUNT;
    /**
     * The historical last post date allowed for charges used for expected reimbursement calculations
     */
    MAX_POST_DATE: Date;
    /**
     * Reference to parent HSP_BKT_ADDTL_REC
     */
    hsp_bkt_addtl_rec?: HSP_BKT_ADDTL_REC;
    /**
     * Collection of HSP_BKT_NAA_HX_HTR as children
     */
    hsp_bkt_naa_hx_htr?: HSP_BKT_NAA_HX_HTR[];
    /**
     * Collection of HSP_BKT_NAA_TX_TYP as children
     */
    hsp_bkt_naa_tx_typ?: HSP_BKT_NAA_TX_TYP[];
}

/**
 * The HSP_BKT_NAA_TX_HTR table contains the not allowed adjustment transactions posted at each line of the table HSP_BKT_NAA_ADJ_HX.
 * pk: BUCKET_ID, GROUP_LINE, VALUE_LINE
 */
export interface HSP_BKT_NAA_HX_HTR {
    /**
     * This column stores the unique identifier for the bucket record.
     */
    BUCKET_ID: number;
    /**
     * The line number for the information associated with this record.
     */
    GROUP_LINE: number;
    /**
     * The line number of one of the multiple values associated with a specific group of data within this record.
     */
    VALUE_LINE: number;
    /**
     * The permanent transaction in the adjustment table of the contractual adjustment history table.
     */
    NAA_ADJ_HX_HTR_ID: number;
    /**
     * Reference to HSP_TRANSACTIONS based on NAA_ADJ_HX_HTR_ID
     */
    naa_adj_hx_htr?: HSP_TRANSACTIONS;
    /**
     * Hospital account associated with the liability bucket
     */
    HSP_ACCOUNT_ID: number;
    /**
     * Reference to HSP_ACCOUNT based on HSP_ACCOUNT_ID
     */
    hsp_account?: HSP_ACCOUNT;
    /**
     * Reference to parent HSP_BKT_NAA_ADJ_HX
     */
    hsp_bkt_naa_adj_hx?: HSP_BKT_NAA_ADJ_HX;
}

/**
 * The HSP_BKT_NAA_TX_TYP table contains information about the types of not allowed adjustment transactions posted at each line of the table HSP_BKT_NAA_ADJ_HX.
 * pk: BUCKET_ID, GROUP_LINE, VALUE_LINE
 */
export interface HSP_BKT_NAA_TX_TYP {
    /**
     * This column stores the unique identifier for the bucket record.
     */
    BUCKET_ID: number;
    /**
     * The line number for the information associated with this record.
     */
    GROUP_LINE: number;
    /**
     * The line number of one of the multiple values associated with a specific group of data within this record.
     */
    VALUE_LINE: number;
    /**
     * The type of a transaction in the transaction table of the contractual adjustment history table.
     */
    NAA_ADJ_HX_TX_TYP_C_NAME: string;
    /**
     * This column stores the unique identifier for the hospital account to which the liability bucket is linked.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * Reference to HSP_ACCOUNT based on HSP_ACCOUNT_ID
     */
    hsp_account?: HSP_ACCOUNT;
    /**
     * Reference to parent HSP_BKT_NAA_ADJ_HX
     */
    hsp_bkt_naa_adj_hx?: HSP_BKT_NAA_ADJ_HX;
}

/**
 * This table contains liability bucket payment transaction information.
 * pk: BUCKET_ID, LINE
 */
export interface HSP_BKT_PAYMENT {
    /**
     * This column stores the unique identifier for the bucket record with associated payment transaction information.
     */
    BUCKET_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column stores the unique identifier for the payment transaction in this liability bucket.
     */
    PAYMENT_ID: number;
    /**
     * Reference to HSP_TRANSACTIONS based on PAYMENT_ID
     */
    payment?: HSP_TRANSACTIONS;
    /**
     * The hospital account ID that the liability bucket belongs to.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * Reference to HSP_ACCOUNT based on HSP_ACCOUNT_ID
     */
    hsp_account?: HSP_ACCOUNT;
    /**
     * Reference to parent HSP_BKT_ADDTL_REC
     */
    hsp_bkt_addtl_rec?: HSP_BKT_ADDTL_REC;
}

/**
 * This table contains claim print record information for claims associated with a given hospital account or liability bucket.
 * pk: CLAIM_PRINT_ID, CONTACT_DATE_REAL
 */
export interface HSP_CLAIM_PRINT {
    /**
     * Stores the claim record ID associated with a single hospital account or liability bucket.
     */
    CLAIM_PRINT_ID: number;
    /**
     * The contact date for the creation of the record in internal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The ID of the hospital account with which this claim record is associated.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * Reference to HSP_ACCOUNT based on HSP_ACCOUNT_ID
     */
    hsp_account?: HSP_ACCOUNT;
    /**
     * Reference to parent HSP_CLAIM_DETAIL1
     */
    hsp_claim_detail1?: HSP_CLAIM_DETAIL1;
    /**
     * Collection of HSP_CLP_REV_CODE as children
     */
    hsp_clp_rev_code?: HSP_CLP_REV_CODE[];
}

/**
 * This table contains the hospital transactions that were used in the creation of CMS claim lines in Hospital Billing.
 * pk: CLAIM_PRINT_ID, LINE, TX_PIECE
 */
export interface HSP_CLP_CMS_TX_PIECES {
    /**
     * The unique identifier for the claim record.
     */
    CLAIM_PRINT_ID: number;
    /**
     * The line number of the claim line in the claim record.
     */
    LINE: number;
    /**
     * The index of the transaction for the claim line.
     */
    TX_PIECE: number;
    /**
     * ID of the hospital transaction used in the creation of this claim line.
     */
    TX_ID: number;
    /**
     * Reference to HSP_TRANSACTIONS based on TX_ID
     */
    tx?: HSP_TRANSACTIONS;
    /**
     * Reference to parent HSP_CLAIM_DETAIL1
     */
    hsp_claim_detail1?: HSP_CLAIM_DETAIL1;
}

/**
 * This table contains diagnosis related information for claim print records associated with the hospital account/liability bucket.
 * pk: CLAIM_PRINT_ID, LINE
 */
export interface HSP_CLP_DIAGNOSIS {
    /**
     * The unique identifier for the claim record.
     */
    CLAIM_PRINT_ID: number;
    /**
     * The line number of one of the multiple values associated with a specific group of data within this record.
     */
    LINE: number;
    /**
     * The diagnoses to print on both institutional and professional claim forms.
     */
    DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on DX_ID
     */
    dx?: CLARITY_EDG;
    /**
     * Reference to parent HSP_CLAIM_DETAIL1
     */
    hsp_claim_detail1?: HSP_CLAIM_DETAIL1;
}

/**
 * This table contains the revenue code list for the claim print records associated with the hospital account/liability bucket.
 * pk: CLAIM_PRINT_ID, CONTACT_DATE_REAL, LINE
 */
export interface HSP_CLP_REV_CODE {
    /**
     * The unique identifier for the claim record associated with a single hospital account or liability bucket.
     */
    CLAIM_PRINT_ID: number;
    /**
     * The contact date for the creation of the record in internal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The minimum service date for the claim print record.
     */
    UB_MIN_SERVICE: Date;
    /**
     * The maximum service date for the claim print record.
     */
    UB_MAX_SERVICE: Date;
    /**
     * The uniform billing charges on the claim
     */
    UB_CHARGES: number;
    /**
     * The modifier for the claim print record.
     */
    UB_MODIFIER: string;
    /**
     * The uniform billing current procedural terminology code on the claim print record.
     */
    UB_CPT_CODE: string;
    /**
     * The unique ID of the hospital account associated with this claim print record.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * Reference to HSP_ACCOUNT based on HSP_ACCOUNT_ID
     */
    hsp_account?: HSP_ACCOUNT;
    /**
     * The external uniform billing revenue code.
     */
    REV_CODE_EXT: string;
    /**
     * The description of the uniform billing line.
     */
    UB_REV_CD_DESC: string;
    /**
     * The uniform billing line quality.
     */
    UB_QTY: string;
    /**
     * The non-covered amount for the uniform billing line.
     */
    UB_NON_CVD_AMT: number;
    /**
     * The uniform billing local coverage determination code.
     */
    UB_LMRP_CD: string;
    /**
     * The uniform billing healthcare common procedure coding system code and modifier or rate.
     */
    UB_HCPCS_RATE: string;
    /**
     * The code type for the uniform billing claim line
     */
    UB_CODE_TYPE_C_NAME: string;
    /**
     * The category of the line source for the uniform billing line.
     */
    UB_LINE_SRC_C_NAME: string;
    /**
     * The service date of the uniform billing service line.
     */
    UB_SVC_DATE: Date;
    /**
     * Reference to parent HSP_CLAIM_PRINT
     */
    hsp_claim_print?: HSP_CLAIM_PRINT;
}

/**
 * This table contains the hospital transactions that were used in the creation of UB claim lines in Hospital Billing.
 * pk: CLAIM_PRINT_ID, LINE, TX_PIECE
 */
export interface HSP_CLP_UB_TX_PIECES {
    /**
     * The unique identifier for the claim print record.
     */
    CLAIM_PRINT_ID: number;
    /**
     * The line number of the claim line in the claim print record.
     */
    LINE: number;
    /**
     * The hospital transaction IDs used for the claim line.
     */
    TX_PIECE: number;
    /**
     * ID of the hospital transaction used in the creation of this claim line.
     */
    TX_ID: number;
    /**
     * Reference to HSP_TRANSACTIONS based on TX_ID
     */
    tx?: HSP_TRANSACTIONS;
    /**
     * The ordinal position of the claim line
     */
    CLAIM_LINE_NUM: number;
    /**
     * Reference to parent HSP_CLAIM_DETAIL1
     */
    hsp_claim_detail1?: HSP_CLAIM_DETAIL1;
}

/**
 * This is a type of summary level of the remittance actions associated with a payment transaction
 * pk: TX_ID, LINE
 */
export interface HSP_PMT_LINE_REMIT {
    /**
     * The unique identifier for the transaction record.
     */
    TX_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Stores the service line number for line level payments.
     */
    LINE_SVCLINE: number;
    /**
     * Stores the group code corresponding to the reason code at the line level.
     */
    LINE_GRP_CODE_C_NAME: string;
    /**
     * Stores the reason code or remark code from the service line.
     */
    LINE_REMIT_CODE_ID: string;
    /**
     * Reference to CLARITY_RMC based on LINE_REMIT_CODE_ID
     */
    line_remit_code?: CLARITY_RMC;
    /**
     * The name of each remittance code.
     */
    LINE_REMIT_CODE_ID_REMIT_CODE_NAME: string;
    /**
     * Stores the external claim level reason code or remark code from the service line.
     */
    LINE_RSN_CODE_EXTL: string;
    /**
     * Stores the amount associated with the reason code at the line level.
     */
    LINE_RMT_AMT: number;
    /**
     * Reference to parent HSP_TRANSACTIONS
     */
    hsp_transactions?: HSP_TRANSACTIONS;
}

/**
 * This is a type of summary level of the remittance actions associated with a payment transaction
 * pk: TX_ID, LINE
 */
export interface HSP_PMT_REMIT_DETAIL {
    /**
     * The unique identifier for the transaction record.
     */
    TX_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column stores the group code for the reason code that is entered in the remittance grid when this batch is opened in payment posting.
     */
    DTL_GRP_CODE_C_NAME: string;
    /**
     * This column stores the remit code that is entered in the remittance grid when this batch is opened in payment posting.
     */
    DTL_REMIT_CODE_ID: string;
    /**
     * Reference to CLARITY_RMC based on DTL_REMIT_CODE_ID
     */
    dtl_remit_code?: CLARITY_RMC;
    /**
     * The name of each remittance code.
     */
    DTL_REMIT_CODE_ID_REMIT_CODE_NAME: string;
    /**
     * This column stores the external reason code that is entered in the remittance grid when this batch is opened in payment posting.
     */
    DTL_RSN_CODE_EXTL: string;
    /**
     * This column stores the amount associated with the reason code that is entered in the remittance grid when this batch is opened in payment posting.
     */
    DTL_REMIT_AMT: number;
    /**
     * This column stores the actions associated with the reason code that is entered in the remittance grid when this batch is opened in payment posting
     */
    DTL_ACTION_STRING: string;
    /**
     * This column stores whether a denial or remark record should be created with the reason code
     */
    DTL_CREATE_BDC_YN: string;
    /**
     * This column stores the service line this reason code was entered in on the remittance grid when this batch was opened in payment posting
     */
    DTL_SERVICE_LINE: number;
    /**
     * Reference to parent HSP_TRANSACTIONS
     */
    hsp_transactions?: HSP_TRANSACTIONS;
}

/**
 * This table contains the authorization information for each hospital transaction.
 * pk: TX_ID, LINE
 */
export interface HSP_TX_AUTH_INFO {
    /**
     * This column stores the unique identifier for the hospital billing transaction.
     */
    TX_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This item is the list of coverages the associated Authorization values are being applied to.
     */
    AUTH_COVERAGE_ID: number;
    /**
     * Reference to COVERAGE based on AUTH_COVERAGE_ID
     */
    auth_coverage?: COVERAGE;
    /**
     * Reference to parent HSP_TRANSACTIONS
     */
    hsp_transactions?: HSP_TRANSACTIONS;
}

/**
 * This table contains hospital account transaction diagnoses from the Hospital Permanent Transactions (HTR) master file.
 * pk: TX_ID, LINE
 */
export interface HSP_TX_DIAG {
    /**
     * This column stores the unique identifier for the hospital billing transaction.
     */
    TX_ID: number;
    /**
     * The line number in the results of a query
     */
    LINE: number;
    /**
     * This column stores the unique identifier for the hospital account associated with the hospital billing transaction.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * Reference to HSP_ACCOUNT based on HSP_ACCOUNT_ID
     */
    hsp_account?: HSP_ACCOUNT;
    /**
     * The post date of a transaction.
     */
    POST_DATE: Date;
    /**
     * The service area with which a transaction is associated.
     */
    SERV_AREA_ID: number;
    /**
     * Reference to CLARITY_SA based on SERV_AREA_ID
     */
    serv_area?: CLARITY_SA;
    /**
     * This column stores the unique identifier for the diagnosis code.
     */
    DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on DX_ID
     */
    dx?: CLARITY_EDG;
    /**
     * A qualifier entered with a diagnosis code in charge entry.
     */
    DX_QUAL_HA_C_NAME: string;
    /**
     * Reference to parent HSP_TRANSACTIONS
     */
    hsp_transactions?: HSP_TRANSACTIONS;
}

/**
 * This table contains Line level transactions information from Hospital Permanent Transactions (HTR).
 * pk: TX_ID, LINE
 */
export interface HSP_TX_LINE_INFO {
    /**
     * This column stores the unique identifier for the hospital billing transaction.
     */
    TX_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column stores the unique identifier for the hospital account.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * Reference to HSP_ACCOUNT based on HSP_ACCOUNT_ID
     */
    hsp_account?: HSP_ACCOUNT;
    /**
     * The post date for the transaction on the hospital account.
     */
    POST_DATE: Date;
    /**
     * This column stores the unique identifier for the service area associated with the hospital billing transaction on the hospital account.
     */
    SERV_AREA_ID: number;
    /**
     * Reference to CLARITY_SA based on SERV_AREA_ID
     */
    serv_area?: CLARITY_SA;
    /**
     * This column stores the line-level revenue code for the hospital billing transaction on the hospital account.
     */
    LL_REV_CODE_ID: number;
    /**
     * Reference to CL_UB_REV_CODE based on LL_REV_CODE_ID
     */
    ll_rev_code?: CL_UB_REV_CODE;
    /**
     * The name of the revenue code.
     */
    LL_REV_CODE_ID_REVENUE_CODE_NAME: string;
    /**
     * This column stores the line-level CPT code for the hospital billing transaction on the hospital account.
     */
    LL_CPT_CODE: string;
    /**
     * This column stores the line-level modifier info for the hospital billing transaction on the hospital account.
     */
    LL_MODIFIER: string;
    /**
     * This column stores the line-level service date for the hospital billing transaction on the hospital account.
     */
    LL_SERVICE_DATE: Date;
    /**
     * This column stores the line-level billed amount for the hospital billing transaction on the hospital account.
     */
    LL_BILLED_AMT: number;
    /**
     * This column stores the line-level allowed amount for the hospital billing transaction on the hospital account.
     */
    LL_ALLOWED_AMT: number;
    /**
     * This column stores the line-level not-allowed amount for the hospital billing transaction on the hospital account.
     */
    LL_NOT_ALLOWED_AMT: number;
    /**
     * This column stores the line-level deductible amount for the hospital billing transaction on the hospital account.
     */
    LL_DED_AMT: number;
    /**
     * This column stores the line-level posted amount for the hospital billing transaction on the hospital account.
     */
    LL_POSTED_AMT: number;
    /**
     * This column stores the line-level reason codes for the hospital billing transaction on the hospital account.
     */
    LL_REASON_CODES: string;
    /**
     * This column stores the line-level action string for the hospital billing transaction on the hospital account.
     */
    LL_ACTIONS: string;
    /**
     * This column stores the line-level quantity from remittance payments.
     */
    LL_QUANTITY: number;
    /**
     * Reference to parent HSP_TRANSACTIONS
     */
    hsp_transactions?: HSP_TRANSACTIONS;
}

/**
 * This table contains the not allowed amount (NAA) calculation details for an insurance payment transaction.
 * pk: TX_ID, LINE
 */
export interface HSP_TX_NAA_DETAIL {
    /**
     * This column stores the unique identifier for the hospital billing transaction.
     */
    TX_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column stores the calculation step to be shown in the not allowed amount calculation detail on the transaction detail form
     */
    NAA_DTL_STEP: string;
    /**
     * This column stores the description of a calculation step to be shown in the not allowed amount calculation detail on the transaction detail form.
     */
    NAA_DTL_DESC: string;
    /**
     * This column stores the value calculated or used in a calculation step to be shown in the not allowed amount calculation detail on the transaction detail form.
     */
    NAA_DTL_VAL: string;
    /**
     * Reference to parent HSP_TRANSACTIONS
     */
    hsp_transactions?: HSP_TRANSACTIONS;
}

/**
 * This table contains remit code lists from the Hospital Permanent Transactions (HTR) master file.
 * pk: TX_ID, LINE
 */
export interface HSP_TX_RMT_CD_LST {
    /**
     * This column stores the unique identifier for the hospital billing transaction with associated remit code lists.
     */
    TX_ID: number;
    /**
     * The line number in the results of a query
     */
    LINE: number;
    /**
     * This column stores the unique identifier for the remittance code used for the hospital billing transaction.
     */
    RMT_CODE_LIST_ID: string;
    /**
     * Reference to CLARITY_RMC based on RMT_CODE_LIST_ID
     */
    rmt_code_list?: CLARITY_RMC;
    /**
     * The name of each remittance code.
     */
    RMT_CODE_LIST_ID_REMIT_CODE_NAME: string;
    /**
     * This column stores the remittance code amount associated with transaction.
     */
    RMT_AMT_LIST: number;
    /**
     * This column stores the external identifier for the remittance code associated with the hospital billing transaction.
     */
    RMT_CODE_EXT: string;
    /**
     * This item holds the reason group code associated with the reason code.
     */
    GRP_CODE_LIST_C_NAME: string;
    /**
     * Reference to parent HSP_TRANSACTIONS
     */
    hsp_transactions?: HSP_TRANSACTIONS;
}

/**
 * Shows information regarding all messages in an HTH thread.
 * pk: THREAD_ID, LINE
 */
export interface IB_MESSAGE_THREAD {
    /**
     * Unique message thread ID
     */
    THREAD_ID: number;
    /**
     * The Line Count
     */
    LINE: number;
    /**
     * In Basket Message (EOW) ID
     */
    MESSAGE_ID: string;
    /**
     * Comments attached to the In Basket message being routed
     */
    ROUTING_COMMENT: string;
}

/**
 * The IDENTITY_ID table contains the system master person index ID numbers for your patients
 * pk: PAT_ID, LINE
 */
export interface IDENTITY_ID {
    /**
     * The unique ID assigned to the patient record internally and links to the patient table
     */
    PAT_ID: string;
    /**
     * The line number of the patient ID within the patient�s record.
     */
    LINE: number;
    /**
     * The identification number associated with the patient
     */
    IDENTITY_ID: string;
    /**
     * The system master person index ID type corresponding to this identification number for the patient
     */
    IDENTITY_TYPE_ID: number;
    /**
     * Reference to IDENTITY_ID_TYPE based on IDENTITY_TYPE_ID
     */
    identity_type?: IDENTITY_ID_TYPE;
    /**
     * The name of the ID Type.
     */
    IDENTITY_TYPE_ID_ID_TYPE_NAME: string;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * The IDENTITY_ID_TYPE table contains the list of ID Types in your system.
 * pk: ID_TYPE
 */
export interface IDENTITY_ID_TYPE {
    /**
     * The master person index ID Type.
     */
    ID_TYPE: number;
    /**
     * The name of the ID Type.
     */
    ID_TYPE_NAME: string;
}

/**
 * The IMM_ADMIN_COMPONENTS table contains information about the components of the immunization administered
 * pk: DOCUMENT_ID, CONTACT_DATE_REAL, LINE
 */
export interface IMM_ADMIN_COMPONENTS {
    /**
     * The unique identifier for the document record.
     */
    DOCUMENT_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The unique identifier for the immunization component.
     */
    IMM_COMP_ID: string;
    /**
     * The unique reference identifier for the specific instance of an immunization that the component is part of.
     */
    IMM_REFERENCE_ID: string;
    /**
     * The unique ID of the vaccine group for an immunization administration received from an external system
     */
    IMM_COMP_GROUP_ID: number;
    /**
     * The name of the immunization.
     */
    IMM_COMP_GROUP_ID_NAME: string;
    /**
     * The free text value for a vaccine group for an immunization administration received from an external system
     */
    IMM_COMP_GROUP_FT: string;
    /**
     * The immunization schedule identifier used for the administered vaccination component.
     */
    IMM_COMP_SCHED_ID_FT: string;
    /**
     * The immunization schedule name used for the administered vaccination component.
     */
    IMM_COMP_SCHED_NAME_FT: string;
    /**
     * The immunization schedule coding system used for the administered vaccination component.
     */
    IMM_COMP_SCHED_CODING_FT: string;
    /**
     * Whether or not the administered component dose was valid for the given schedule
     */
    IMM_COMP_SCHED_VALID_YN: string;
    /**
     * The free text description of why the given administration component is valid or invalid based on its immunization schedule.
     */
    IMM_COMP_VALID_RSN_FT: string;
}

/**
 * Stores free-text data about immunization vaccine group received from external sources.
 * pk: DOCUMENT_ID, CONTACT_DATE_REAL, GROUP_LINE, VALUE_LINE
 */
export interface IMM_ADMIN_GROUPS_FT {
    /**
     * The unique identifier (.1 item) for the document record.
     */
    DOCUMENT_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact.
     */
    GROUP_LINE: number;
    /**
     * The line number of one of the multiple values associated with a specific group of data within this contact.
     */
    VALUE_LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Stores the free text value for a vaccine group for an immunization administration received from an external system
     */
    IMM_GROUPS_FT: string;
    /**
     * Reference to parent IMM_ADMIN
     */
    imm_admin?: IMM_ADMIN;
}

/**
 * This table extracts the related multiple response Vaccine Group (I DXR 4220) item.
 * pk: DOCUMENT_ID, CONTACT_DATE_REAL, GROUP_LINE, VALUE_LINE
 */
export interface IMM_ADMIN_GROUPS {
    /**
     * The unique identifier (.1 item) for the document record.
     */
    DOCUMENT_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact.
     */
    GROUP_LINE: number;
    /**
     * The line number of one of the multiple values associated with a specific group of data within this contact.
     */
    VALUE_LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Stores the discrete value for a vaccine group for an immunization administration received from an external system
     */
    IMM_GROUPS_ID: number;
    /**
     * Reference to CLARITY_IMMUNZATN based on IMM_GROUPS_ID
     */
    imm_groups?: CLARITY_IMMUNZATN;
    /**
     * The name of the immunization.
     */
    IMM_GROUPS_ID_NAME: string;
    /**
     * Reference to parent IMM_ADMIN
     */
    imm_admin?: IMM_ADMIN;
}

/**
 * The IMM_ADMIN table contains information about the immunization administered
 * pk: DOCUMENT_ID, CONTACT_DATE_REAL, LINE
 */
export interface IMM_ADMIN {
    /**
     * The unique identifier for the document record.
     */
    DOCUMENT_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * External immunization type ID.
     */
    IMM_TYPE_ID: number;
    /**
     * Reference to CLARITY_IMMUNZATN based on IMM_TYPE_ID
     */
    imm_type?: CLARITY_IMMUNZATN;
    /**
     * The name of the immunization.
     */
    IMM_TYPE_ID_NAME: string;
    /**
     * The immunization type information for the administered immunization as free text.
     */
    IMM_TYPE_FREE_TEXT: string;
    /**
     * The immunization administration date.
     */
    IMM_DATE: Date;
    /**
     * The immunization administration route category ID.
     */
    IMM_ROUTE_C_NAME: string;
    /**
     * The immunization administration site category ID.
     */
    IMM_SITE_C_NAME: string;
    /**
     * The immunization administered manufacturer category ID.
     */
    IMM_MANUFACTURER_C_NAME: string;
    /**
     * The immunization administered lot number.
     */
    IMM_LOT_NUMBER: string;
    /**
     * The immunization given by information for the administered immunization as free text.
     */
    IMM_GIVEN_BY_FT: string;
    /**
     * Free text immunization notes from the immunization administration.
     */
    IMM_NOTES_RAW_DATA: string;
    /**
     * The immunization administration notes.
     */
    IMM_NOTES: string;
    /**
     * The immunization administration location.
     */
    IMM_LOCATION: string;
    /**
     * Status of the vaccination administration.
     */
    IMM_STATUS_C_NAME: string;
    /**
     * This item stores a unique reference identifier to identify a specific instance of an immunization.
     */
    IMM_REFERENCE_ID: string;
    /**
     * Collection of IMM_ADMIN_GROUPS_FT as children
     */
    imm_admin_groups_ft?: IMM_ADMIN_GROUPS_FT[];
    /**
     * Collection of IMM_ADMIN_GROUPS as children
     */
    imm_admin_groups?: IMM_ADMIN_GROUPS[];
}

/**
 * The IMM_DUE table contains information about when an immunization is due
 * pk: DOCUMENT_ID, CONTACT_DATE_REAL, LINE
 */
export interface IMM_DUE {
    /**
     * The unique identifier for the document record.
     */
    DOCUMENT_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The type ID of immunization that is due
     */
    IMM_DUE_TYPE_ID: number;
    /**
     * The name of the immunization.
     */
    IMM_DUE_TYPE_ID_NAME: string;
    /**
     * The free text description of the type of immunization that is due.
     */
    IMM_DUE_TYPE_FT: string;
    /**
     * The due date for immunization that is due.
     */
    IMM_DUE_DUE_DATE: Date;
    /**
     * The earliest date of immunization that is due.
     */
    IMM_DUE_EARLIEST_DT: Date;
    /**
     * The next dose number of immunization that is due.
     */
    IMM_DUE_NEXT_DOSE: string;
    /**
     * Immunization schedule ID used for the recommended vaccination.
     */
    IMM_DUE_SCHED_ID_FT: string;
    /**
     * Immunization schedule name used for the recommended vaccination.
     */
    IMM_DUE_SCHED_NM_FT: string;
    /**
     * Immunization schedule coding system used for the recommended vaccination.
     */
    IMM_DUE_SCHED_CD_FT: string;
}

/**
 * The IMMUNE_HISTORY table contains the history data for immunizations ordered through the clinical system
 * pk: IMMUNE_ID, LINE
 */
export interface IMMUNE_HISTORY {
    /**
     * The unique ID of the immunization record in your system production system.
     */
    IMMUNE_ID: number;
    /**
     * The Line Count for the line in the table which in combination with the IMMUNE_ID forms the primary key for this table.
     */
    LINE: number;
    /**
     * Stores the unique ID of the immunizations (LIM) master file which is associated with this immunization record
     */
    IMM_TYPE_HIST_ID: number;
    /**
     * Reference to CLARITY_IMMUNZATN based on IMM_TYPE_HIST_ID
     */
    imm_type_hist?: CLARITY_IMMUNZATN;
    /**
     * The name of the immunization.
     */
    IMM_TYPE_HIST_ID_NAME: string;
    /**
     * Stores the product information associated with this immunization
     */
    IMM_HX_PRODUCT: string;
    /**
     * The unique ID of the Medication National Drug Codes (NDC) master file that is associated with this immunization and stores the NDC numbers associated with the administration of this immunization.
     */
    IMM_HX_NDC_NUM_ID: string;
    /**
     * The external code for the National Drug Code (NDC)
     */
    IMM_HX_NDC_NUM_ID_NDC_CODE: string;
    /**
     * The  date when this immunization was administered.
     */
    IMMNZTN_HX_DATE: Date;
    /**
     * The dosage information for this immunization administered.
     */
    IMMNZTN_HX_DOSE: string;
    /**
     * The category number for the route of the immunization, such as oral, intramuscular, or intradermal.
     */
    IMMNZTN_HX_ROUTE_C_NAME: string;
    /**
     * The location of the injection, if appropriate.
     */
    IMMNZTN_HX_SITE_C_NAME: string;
    /**
     * The category number for the manufacturer of this vaccine.
     */
    IMMNZTN_HX_MFG_C_NAME: string;
    /**
     * The LOT number for the immunization administered.
     */
    IMMNZTN_HX_LOT: string;
    /**
     * The date on which the immunization administered expires.
     */
    IMM_HX_EXP_DATE: Date;
    /**
     * The unique ID of the user in the EMP master file that is listed in the clinical system as actually administering the  immunization to the patient.
     */
    IMMNZTN_HX_GIVEN_ID: string;
    /**
     * The name of the user record
     */
    IMMNZTN_HX_GIVEN_ID_NAME: string;
    /**
     * The category number for the source of verification of external administration of immunization.
     */
    IMMNZTN_HX_EXT_AD_C_NAME: string;
    /**
     * The unique ID in the questionnaire answers (HQA) master file that is associated with the immunization administered.
     */
    IMM_HX_ANSWER_ID: string;
    /**
     * The free text date field associated with the immunization where VIS (Vaccine Information Statements) date is stored.
     */
    IMMNZTN_HX_VIS_DATE: string;
    /**
     * The free text comments associated with the immunization administered.
     */
    IMMNZTN_HX_COMMENT: string;
    /**
     * The unique ID of the user  in the EMP masterfile associated with the person who entered the immunization administration information into the clinical system.
     */
    IMMNZTN_HX_ENTRY_ID: string;
    /**
     * Reference to CLARITY_EMP based on IMMNZTN_HX_ENTRY_ID
     */
    immnztn_hx_entry?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    IMMNZTN_HX_ENTRY_ID_NAME: string;
    /**
     * Indicates whether or not an immunization is historical or not.
     */
    IMM_HX_HIST_ADMI_YN: string;
    /**
     * The date on which the immunization was entered into the system.
     */
    IMMNZTN_HX_ENT_DATE: Date;
    /**
     * The category number for the immunization status
     */
    IMMNZTN_HX_STATUS_C_NAME: string;
    /**
     * The unique ID in the Universal Charge Line (UCL) master file that is associated with the immunization administered.
     */
    IMM_CHRG_REC_HX_ID: string;
    /**
     * This column stores the history information of immunization CSN whenever an edit was made on the Immunization.
     */
    IMMNZTN_HX_ENC_CSN: number;
    /**
     * The history of dosage amount for the immunization administered.
     */
    IMMNZTN_HX_DOSE_AMT: number;
    /**
     * The history of dosage unit for the immunization administered.
     */
    IMMNZTN_HX_DOSE_UNIT_C_NAME: string;
    /**
     * Contains the date and time that the data in the row was entered
     */
    IMMZTN_HX_ENTRY_DTTM: Date;
    /**
     * The history of lot(LOT) record Id for the immunization adminstered.
     */
    IMM_HX_LOT_NUM_ID: number;
    /**
     * Reference to parent IMMUNE
     */
    immune?: IMMUNE;
}

/**
 * The IMMUNE table contains data for immunizations ordered through clinical system
 * pk: IMMUNE_ID
 */
export interface IMMUNE {
    /**
     * The unique ID of the immunization record in your system production system.
     */
    IMMUNE_ID: number;
    /**
     * Reference to PROBLEM_LIST_ALL based on IMMUNE_ID
     */
    immune?: PROBLEM_LIST_ALL;
    /**
     * The ID of the immunization record that corresponds to the type of immunization given to this patient.
     */
    IMMUNZATN_ID: number;
    /**
     * Reference to CLARITY_IMMUNZATN based on IMMUNZATN_ID
     */
    immunzatn?: CLARITY_IMMUNZATN;
    /**
     * The name of the immunization.
     */
    IMMUNZATN_ID_NAME: string;
    /**
     * The date the immunization was administered in calendar format.
     */
    IMMUNE_DATE: Date;
    /**
     * The immunization dosage.
     */
    DOSE: string;
    /**
     * The category value associated with the route of the immunization, such as oral, intramuscular, or intradermal.
     */
    ROUTE_C_NAME: string;
    /**
     * The category value associated with the location of the injection, if appropriate
     */
    SITE_C_NAME: string;
    /**
     * The category value associated with the manufacturer of this vaccine.
     */
    MFG_C_NAME: string;
    /**
     * The lot number of the vaccine.
     */
    LOT: string;
    /**
     * The unique ID of the system user who administered the immunization
     */
    GIVEN_BY_USER_ID: string;
    /**
     * The name of the user record
     */
    GIVEN_BY_USER_ID_NAME: string;
    /**
     * The unique ID of the system user who ordered the immunization
     */
    ENTRY_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on ENTRY_USER_ID
     */
    entry_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ENTRY_USER_ID_NAME: string;
    /**
     * The date the immunization was recorded in the patient�s chart in calendar format
     */
    ENTRY_DATE: Date;
    /**
     * Date upon which this immunization expires
     */
    EXPIRATION_DATE: Date;
    /**
     * Category value indicating the source of verification of external administration of immunization, e.g
     */
    EXTERNAL_ADMIN_C_NAME: string;
    /**
     * The date on the vaccine information statement
     */
    VIS_DATE_TEXT: string;
    /**
     * Free text comment regarding the administration of this immunization
     */
    MED_ADMIN_COMMENT: string;
    /**
     * Item which stores the product of the immunization
     */
    IMM_PRODUCT: string;
    /**
     * Store the NDC number ID associated with the administration
     */
    NDC_NUM_ID: string;
    /**
     * The external code for the National Drug Code (NDC)
     */
    NDC_NUM_ID_NDC_CODE: string;
    /**
     * Order ID for immunization ordered.
     */
    ORDER_ID: number;
    /**
     * Stores answers for immunization questions.
     */
    IMM_ANSWER_ID: string;
    /**
     * The category value associated with "Given" if the immunization has been administered, "Deleted" if the immunization has been deleted from the administration history, "Incomplete" if the item has been ordered but not administered and a status of "Deferred" if the immunization has been deferred.
     */
    IMMNZTN_STATUS_C_NAME: string;
    /**
     * This column contains the UCL (Universal Charge Line) record ID for the immunization charge.
     */
    IMM_CHARGE_REC_ID: string;
    /**
     * This column contains the CSN (contact serial number) for the immunization.
     */
    IMM_CSN: number;
    /**
     * Indicates whether the immunization administration is a historical administration.
     */
    IMM_HISTORIC_ADM_YN: string;
    /**
     * Immunization dose amount.
     */
    IMMNZTN_DOSE_AMOUNT: number;
    /**
     * Immunization dose unit.
     */
    IMMNZTN_DOSE_UNIT_C_NAME: string;
    /**
     * Contains the date and time that the immunization administration data was last updated
     */
    ENTRY_DTTM: Date;
    /**
     * This item stores the record ID of the lot(LOT) used for immunization administration.
     */
    IMM_LOT_NUM_ID: number;
    /**
     * Collection of IMMUNE_HISTORY as children
     */
    immune_history?: IMMUNE_HISTORY[];
}

/**
 * This table contains basic invoice information
 * pk: INV_ID, LINE
 */
export interface INV_BASIC_INFO {
    /**
     * The invoice ID.
     */
    INV_ID: number;
    /**
     * The line number for the invoice number associated with the invoice record
     */
    LINE: number;
    /**
     * The specific invoice number for the bill or claim
     */
    INV_NUM: string;
    /**
     * The status for the invoice number.
     */
    INV_STATUS_C_NAME: string;
    /**
     * The coverage record ID.
     */
    CVG_ID: number;
    /**
     * Reference to COVERAGE based on CVG_ID
     */
    cvg?: COVERAGE;
    /**
     * The payer ID.
     */
    EPM_ID: number;
    /**
     * Reference to CLARITY_EPM based on EPM_ID
     */
    epm?: CLARITY_EPM;
    /**
     * The benefit plan ID.
     */
    EPP_ID: number;
    /**
     * Reference to CLARITY_EPP based on EPP_ID
     */
    epp?: CLARITY_EPP;
    /**
     * The from (minimum) service date for the invoice number
     */
    FROM_SVC_DATE: Date;
    /**
     * The to (maximum) service date for the invoice number
     */
    TO_SVC_DATE: Date;
    /**
     * The claim type for the invoice number
     */
    INV_TYPE_C_NAME: string;
    /**
     * Indicates whether the invoice number is a crossover claim
     */
    CROSS_OVER_YN: string;
    /**
     * The bill/statement or claim mailing name for the invoice number.
     */
    MAILING_NAME: string;
    /**
     * The bill/statement or claim mailing street address for the invoice number.
     */
    MAILING_ADDR: string;
    /**
     * The bill/statement or claim mailing city, state, and ZIP Code for the invoice number.
     */
    CITY_STATE_ZIP: string;
    /**
     * The claim information record ID.
     */
    CLM_ID: number;
    /**
     * The referral ID.
     */
    REF_ID: string;
    /**
     * Reference to CLARITY_SER based on REF_ID
     */
    ref?: CLARITY_SER;
    /**
     * The name of the referral source.
     */
    REF_ID_REFERRING_PROV_NAM: string;
    /**
     * The place of service ID.
     */
    EAF_POS_ID: number;
    /**
     * Reference to CLARITY_LOC based on EAF_POS_ID
     */
    eaf_pos?: CLARITY_LOC;
    /**
     * The tax ID/IRS number for the invoice number.
     */
    TAX_ID_NUM: string;
    /**
     * The tax ID/IRS number type for the invoice number.
     */
    TAX_ID_TYPE: string;
    /**
     * Contains a list of all the replaced invoice numbers associated with the invoice record.
     */
    REPLACED_INV: string;
    /**
     * Contains a list of all the claim change reason codes associated with the invoice record.
     */
    CLM_CHANGE_RSN_COD: string;
    /**
     * Contains a list of all the claim change comments associated with the invoice record.
     */
    CLM_CHANGE_COMMENT: string;
    /**
     * The mailing phone number for the invoice number.
     */
    MAIL_PHONE: string;
    /**
     * Identifies if the invoice is for an alternate payer.
     */
    ALTPAYR_INV_YN: string;
    /**
     * Flag to indicate the late replacement claim status of the invoice.
     */
    LATE_REPLACEMENT_C_NAME: string;
    /**
     * The claim reconciliation record ID.
     */
    CRD_ID: string;
    /**
     * Reference to RECONCILE_CLM based on CRD_ID
     */
    crd?: RECONCILE_CLM;
    /**
     * The unique ID associated with the claim external value record for this row
     */
    CLM_EXT_VAL_ID: number;
    /**
     * Reference to CLM_VALUES based on CLM_EXT_VAL_ID
     */
    clm_ext_val?: CLM_VALUES;
    /**
     * The invoice accept date.
     */
    CLM_ACCEPT_DT: Date;
    /**
     * This column holds the filing order position of the claim coverage at the time claims were processed.
     */
    FILING_ORDER_C_NAME: string;
    /**
     * The claim run number.
     */
    CLAIM_RUN_NUM: string;
    /**
     * This column indicates whether the invoice was created in a demand claim run.
     */
    DEMAND_CLAIM_YN: string;
    /**
     * Stores a Yes/No indicator that the associated record represents a request for a predetermination of benefits.
     */
    PREDETERMINATION_YN: string;
    /**
     * The predicted payment response date for a claim based on historical trends for the payer.
     */
    PREDICTED_PAY_DATE: Date;
    /**
     * The suggested initial follow-up date for a claim based on historical trends for the payer.
     */
    SUGGESTED_FOL_UP_DATE: Date;
    /**
     * This item shows the final date all the follow-up records were completed and is based on the last Completed Date (I FOL 122)
     */
    FINAL_FOL_UP_DATE: Date;
    /**
     * Denotes if the claim closed prior to its Suggested Initial Follow-up Date, whereby it was no longer outstanding to insurance
     */
    CLM_CLOSED_TIMELY_YN: string;
    /**
     * Reference to parent INVOICE
     */
    invoice?: INVOICE;
}

/**
 * This table holds information of claim override internal control number (ICN) on A/R Invoice (INV) for Resolute Professional Billing.
 * pk: INVOICE_ID, LINE
 */
export interface INV_CLM_ICN {
    /**
     * The invoice record ID.
     */
    INVOICE_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The override coverage ID for the internal control number for the claim.
     */
    CLM_OVRD_ICN_CVG_ID: number;
    /**
     * Reference to COVERAGE based on CLM_OVRD_ICN_CVG_ID
     */
    clm_ovrd_icn_cvg?: COVERAGE;
    /**
     * The override internal control number for the claim.
     */
    CLM_OVERRIDE_ICN: string;
    /**
     * The override edit time for the internal control number for the claim.
     */
    CLM_OVRD_ICN_T_DTTM: Date;
    /**
     * The override edit user for the internal control number for the claim.
     */
    CLM_OVRD_ICN_USR_ID: string;
    /**
     * Reference to CLARITY_EMP based on CLM_OVRD_ICN_USR_ID
     */
    clm_ovrd_icn_usr?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    CLM_OVRD_ICN_USR_ID_NAME: string;
    /**
     * Whether or not the override for the internal control number for the claim was ignored.
     */
    CLM_OVRD_ICN_IGN_YN: string;
    /**
     * The override comment for the internal control number for the claim.
     */
    CLM_OVRD_ICN_CMNT: string;
    /**
     * Reference to parent INVOICE
     */
    invoice?: INVOICE;
}

/**
 * This table holds additional line-level information about the invoice (INV) specific to a given invoice including any line-level overrides.
 * pk: INVOICE_ID, LINE
 */
export interface INV_CLM_LN_ADDL {
    /**
     * The invoice record ID.
     */
    INVOICE_ID: number;
    /**
     * The line number.
     */
    LINE: number;
    /**
     * The invoice number related to this claim line.
     */
    INVOICE_NUM: string;
    /**
     * The invoice claim line number.
     */
    CLM_LN: number;
    /**
     * This is the procedure revenue code
     */
    PROC_OR_REV_CODE: string;
    /**
     * The place of service type for this claim line
     */
    POS_CODE: string;
    /**
     * The claim line status.
     */
    CLAIM_STATUS_C_NAME: string;
    /**
     * The claim line paid amount.
     */
    CLAIM_PAID_AMT: number;
    /**
     * The service line's explanation of benefits adjustment amount.
     */
    EOB_ALLOWED_AMOUNT: number;
    /**
     * The service line's explanation of benefits non-covered amount.
     */
    EOB_NON_COVRD_AMT: number;
    /**
     * The service line's explanation of benefits coinsurance amount.
     */
    EOB_COINSURANCE: number;
    /**
     * The service line's explanation of benefits deductible.
     */
    EOB_DEDUCTIBLE: number;
    /**
     * The explanation of benefits internal control number for the claim line.
     */
    EOB_ICN: string;
    /**
     * Claim denied code for this claim line on this invoice.
     */
    CLAIM_DENIED_CODE: string;
    /**
     * Remittance code for this claim line on this invoice.
     */
    REMIT_CODE_ID: string;
    /**
     * The charges associated with the invoice
     */
    TRANSACTION_LIST: string;
    /**
     * The date when the service was first performed.
     */
    FROM_SVC_DATE: Date;
    /**
     * The unique ID of the procedure associated with the invoice.
     */
    PROC_ID: number;
    /**
     * Reference to CLARITY_EAP based on PROC_ID
     */
    proc?: CLARITY_EAP;
    /**
     * The first modifier associated with the invoice
     */
    MODIFIER_ONE: string;
    /**
     * The number of units associated with the invoice.
     */
    QUANTITY: number;
    /**
     * The charge amount associated with the claim line.
     */
    CHARGE_AMOUNT: number;
    /**
     * The non-covered amount associated with the invoice.
     */
    NONCVD_AMOUNT: number;
    /**
     * The type of service category value for the claim.
     */
    TYPE_OF_SERVICE_C_NAME: string;
    /**
     * Holds a comma-delimited list of pointers to the claim level diagnosis
     */
    DIAGNOSIS_MAP: string;
    /**
     * First remittance code ID.
     */
    REMITTANCE_RMC1_ID: string;
    /**
     * The name of each remittance code.
     */
    REMITTANCE_RMC1_ID_REMIT_CODE_NAME: string;
    /**
     * Second remittance code ID.
     */
    REMITTANCE_RMC2_ID: string;
    /**
     * The name of each remittance code.
     */
    REMITTANCE_RMC2_ID_REMIT_CODE_NAME: string;
    /**
     * Stores the date the claim line is created.
     */
    CLM_LN_CREAT_DATE: Date;
    /**
     * The invoice line number.
     */
    INV_NUM_GRP100LN: number;
    /**
     * Stores the most recent date the invoice line is paid.
     */
    CLM_LN_PAID_DATE: Date;
    /**
     * Identifies show only lines.
     */
    IS_CODE_ONLY: string;
    /**
     * Reference to parent INVOICE
     */
    invoice?: INVOICE;
}

/**
 * Stores claim-level diagnosis information sent on Resolute Professional Billing claims
 * pk: INVOICE_ID, LINE
 */
export interface INV_DX_INFO {
    /**
     * The unique ID of the invoice.
     */
    INVOICE_ID: number;
    /**
     * The line count value of the invoice related group.
     */
    LINE: number;
    /**
     * The unique ID of the diagnosis that is associated with the claim.
     */
    DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on DX_ID
     */
    dx?: CLARITY_EDG;
    /**
     * The external ID of the invoice that is associated with the claim.
     */
    INV_NUM: string;
    /**
     * Claim line number that the diagnosis entry applies to
     */
    INV_NUM_100_GRP_LN: number;
    /**
     * Reference to parent INVOICE
     */
    invoice?: INVOICE;
}

/**
 * This table holds the National Drug Code (NDC) information for the invoice (INV) record.
 * pk: INVOICE_ID, LINE
 */
export interface INV_NDC_INFO {
    /**
     * The invoice record ID.
     */
    INVOICE_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The national drug code record ID.
     */
    NDC_ID: string;
    /**
     * Reference to RX_NDC based on NDC_ID
     */
    ndc?: RX_NDC;
    /**
     * The external code for the National Drug Code (NDC)
     */
    NDC_ID_NDC_CODE: string;
    /**
     * The national drug code number.
     */
    NDC_NUM: string;
    /**
     * The national drug code quantity.
     */
    NDC_QTY: number;
    /**
     * The billable units for the national drug code.
     */
    NDC_UNITS_C_NAME: string;
    /**
     * The invoice line for the national drug code.
     */
    LINE_PTR: number;
    /**
     * Reference to CLARITY_SA based on LINE_PTR
     */
    line?: CLARITY_SA;
    /**
     * The prescription number.
     */
    RX_NUM: string;
    /**
     * Reference to parent INVOICE
     */
    invoice?: INVOICE;
}

/**
 * Each line in this table corresponds to a transaction (ETR) composing a line on an invoice from item INV 381
 * pk: INV_ID, LINE, TX_PIECE
 */
export interface INV_NUM_TX_PIECES {
    /**
     * This column contains the internal invoice ID.
     */
    INV_ID: number;
    /**
     * This column contains the line number for any multiple-response item.
     */
    LINE: number;
    /**
     * This column contains the position of the transaction ID in the comma-delimited list of ETR ID's for a given line of INV-381
     */
    TX_PIECE: number;
    /**
     * This column contains each individual transaction ID from the list of ETR ID's stored on each line of INV-381
     */
    TX_ID: number;
    /**
     * Reference to ARPB_TRANSACTIONS based on TX_ID
     */
    tx?: ARPB_TRANSACTIONS;
    /**
     * Reference to parent INVOICE
     */
    invoice?: INVOICE;
}

/**
 * This table includes the basic data for the invoice (INV) record
 * pk: INVOICE_ID
 */
export interface INVOICE {
    /**
     * The Invoice ID.
     */
    INVOICE_ID: number;
    /**
     * The patient ID associated with this invoice.
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * The account ID that is associated with this invoice.
     */
    ACCOUNT_ID: number;
    /**
     * Reference to ACCOUNT based on ACCOUNT_ID
     */
    account?: ACCOUNT;
    /**
     * The ID of the service area associated with this invoice.
     */
    SERV_AREA_ID: number;
    /**
     * Reference to CLARITY_SA based on SERV_AREA_ID
     */
    serv_area?: CLARITY_SA;
    /**
     * The ID of the revenue location associated with this invoice.
     */
    LOC_ID: number;
    /**
     * Reference to CLARITY_LOC based on LOC_ID
     */
    loc?: CLARITY_LOC;
    /**
     * The ID of the place of service associated with this invoice.
     */
    POS_ID: number;
    /**
     * Reference to CLARITY_LOC based on POS_ID
     */
    pos?: CLARITY_LOC;
    /**
     * The ID of the department associated with this invoice.
     */
    DEPARTMENT_ID: number;
    /**
     * Reference to CLARITY_DEP based on DEPARTMENT_ID
     */
    department?: CLARITY_DEP;
    /**
     * Stores the ID of the billing provider associated with the invoice.
     */
    PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on PROV_ID
     */
    prov?: CLARITY_SER;
    /**
     * Stores the tax ID associated with the invoice.
     */
    TAX_ID: string;
    /**
     * Stores the type of tax ID associated with the invoice.
     */
    TAX_ID_TYPE: string;
    /**
     * Stores the insurance amount for the invoice.
     */
    INSURANCE_AMT: number;
    /**
     * Stores the initial self-pay amount for the invoice.
     */
    SELF_PAY_AMT: number;
    /**
     * Stores the initial insurance amount for the invoice.
     */
    INIT_INSURANCE_BAL: number;
    /**
     * Stores the initial self-pay amount for the invoice.
     */
    INIT_SELF_PAY_BAL: number;
    /**
     * Stores the bill area associated with the invoice.
     */
    BILL_AREA_ID: number;
    /**
     * Reference to CLARITY_IMMUNZATN based on BILL_AREA_ID
     */
    bill_area?: CLARITY_IMMUNZATN;
    /**
     * The record name of this bill area, financial subdivision, or financial division.
     */
    BILL_AREA_ID_BILL_AREA_NAME: string;
    /**
     * The Professional Billing Hospital Account ID.
     */
    PB_HOSP_ACT_ID: number;
    /**
     * Reference to ARPB_VISITS based on PB_HOSP_ACT_ID
     */
    pb_hosp_act?: ARPB_VISITS;
    /**
     * Collection of INV_BASIC_INFO as children
     */
    inv_basic_info?: INV_BASIC_INFO[];
    /**
     * Collection of INV_CLM_ICN as children
     */
    inv_clm_icn?: INV_CLM_ICN[];
    /**
     * Collection of INV_CLM_LN_ADDL as children
     */
    inv_clm_ln_addl?: INV_CLM_LN_ADDL[];
    /**
     * Collection of INV_DX_INFO as children
     */
    inv_dx_info?: INV_DX_INFO[];
    /**
     * Collection of INV_NDC_INFO as children
     */
    inv_ndc_info?: INV_NDC_INFO[];
    /**
     * Collection of INV_NUM_TX_PIECES as children
     */
    inv_num_tx_pieces?: INV_NUM_TX_PIECES[];
    /**
     * Collection of INV_PMT_RECOUP as children
     */
    inv_pmt_recoup?: INV_PMT_RECOUP[];
    /**
     * Collection of INV_TX_PIECES as children
     */
    inv_tx_pieces?: INV_TX_PIECES[];
}

/**
 * This table holds information on payment recoup adjustments associated with an invoice.
 * pk: INVOICE_ID, LINE
 */
export interface INV_PMT_RECOUP {
    /**
     * The invoice record ID.
     */
    INVOICE_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Transactions associated with payments, recoups, or adjustments.
     */
    TX_ID: number;
    /**
     * Reference to ARPB_TRANSACTIONS based on TX_ID
     */
    tx?: ARPB_TRANSACTIONS;
    /**
     * Reference to parent INVOICE
     */
    invoice?: INVOICE;
}

/**
 * This table contains Professional Billing charge transactions associated with invoice service lines.
 * pk: INV_ID, LINE, TX_PIECE
 */
export interface INV_TX_PIECES {
    /**
     * The unique identifier for the invoice record.
     */
    INV_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The position of the transaction ID in the comma-delimited list of transaction IDs for a given line.
     */
    TX_PIECE: number;
    /**
     * The ID of the transaction associated with the claim line.
     */
    TX_ID: number;
    /**
     * Reference to ARPB_TRANSACTIONS based on TX_ID
     */
    tx?: ARPB_TRANSACTIONS;
    /**
     * Reference to parent INVOICE
     */
    invoice?: INVOICE;
}

/**
 * This table contains generic information related to a patient's inpatient stay, including data on patient education, notes, and other topics.
 * pk: INPATIENT_DATA_ID
 */
export interface IP_DATA_STORE {
    /**
     * The unique ID of the inpatient data store record.
     */
    INPATIENT_DATA_ID: string;
    /**
     * The current status of the Inpatient Data record: active or resolved.
     */
    RECORD_STATUS_C_NAME: string;
    /**
     * Link to Contact Serial Number in EPT for associated encounter.
     */
    EPT_CSN: number;
    /**
     * The date and time this row was last updated (the last time it was extracted or this column was backfilled).
     */
    UPDATE_DATE: Date;
    /**
     * Collection of ED_PAT_STATUS as children
     */
    ed_pat_status?: ED_PAT_STATUS[];
    /**
     * Collection of IP_FLOW_DATERNG as children
     */
    ip_flow_daterng?: IP_FLOW_DATERNG[];
    /**
     * Collection of IP_FLOWSHEET_ROWS as children
     */
    ip_flowsheet_rows?: IP_FLOWSHEET_ROWS[];
    /**
     * Collection of IP_ORD_UNACK_PLAC as children
     */
    ip_ord_unack_plac?: IP_ORD_UNACK_PLAC[];
}

/**
 * This table contains generic information about flowsheet groups/rows.
 * pk: FLO_MEAS_ID
 */
export interface IP_FLO_GP_DATA {
    /**
     * The unique ID of the flowsheet group/row.
     */
    FLO_MEAS_ID: string;
    /**
     * The display name given to the flowsheet group/row.
     */
    DISP_NAME: string;
}

/**
 * Tracks the dates during which a flowsheet template was used on a given patient stay.
 * pk: INPATIENT_DATA_ID, LINE
 */
export interface IP_FLOW_DATERNG {
    /**
     * The unique ID of the inpatient data store record.
     */
    INPATIENT_DATA_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Stores the flowsheet template (FLT) ID related to the first and last instants documented.
     */
    FLOWSHEET_DATE_ID: string;
    /**
     * Reference to IP_FLT_DATA based on FLOWSHEET_DATE_ID
     */
    flowsheet_date?: IP_FLT_DATA;
    /**
     * The display name associated with this template.
     */
    FLOWSHEET_DATE_ID_DISPLAY_NAME: string;
    /**
     * Reference to parent IP_DATA_STORE
     */
    ip_data_store?: IP_DATA_STORE;
}

/**
 * This table contains flowsheet row (FLO) data for an encounter
 * pk: INPATIENT_DATA_ID, LINE
 */
export interface IP_FLOWSHEET_ROWS {
    /**
     * The unique ID of the inpatient data store record.
     */
    INPATIENT_DATA_ID: string;
    /**
     * The line count for the item.
     */
    LINE: number;
    /**
     * The unique ID of the flowsheet group/row.
     */
    FLO_MEAS_ID: string;
    /**
     * Reference to IP_FLO_GP_DATA based on FLO_MEAS_ID
     */
    flo_meas?: IP_FLO_GP_DATA;
    /**
     * The display name given to the flowsheet group/row.
     */
    FLO_MEAS_ID_DISP_NAME: string;
    /**
     * Stores the Lines/Drains/Airways (LDA) ID for the flowsheet group.
     */
    IP_LDA_ID: string;
    /**
     * The flowsheet row variance.
     */
    ROW_VARIANCE_C_NAME: string;
    /**
     * Reference to parent IP_DATA_STORE
     */
    ip_data_store?: IP_DATA_STORE;
}

/**
 * This table contains information related to defined flowsheet templates.
 * pk: TEMPLATE_ID
 */
export interface IP_FLT_DATA {
    /**
     * The unique ID for the flowsheet template.
     */
    TEMPLATE_ID: string;
    /**
     * The display name associated with this template.
     */
    DISPLAY_NAME: string;
}

/**
 * This table contains the previous values from edited flowsheet records.
 * pk: FSD_ID, LINE
 */
export interface IP_FLWSHT_EDITED {
    /**
     * The unique ID for the flowsheet data record.
     */
    FSD_ID: string;
    /**
     * The line count for the item.
     */
    LINE: number;
    /**
     * The line number of the reading that replaced this flowsheet reading.
     */
    LINE_NUM: number;
    /**
     * The instant the reading was taken.
     */
    RECORDED_TIME: Date;
    /**
     * The instant the reading was entered.
     */
    ENTRY_TIME: Date;
    /**
     * The unique ID of the user taking the flowsheet readings.
     */
    TAKEN_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on TAKEN_USER_ID
     */
    taken_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    TAKEN_USER_ID_NAME: string;
    /**
     * The unique ID of the user entering the readings.
     */
    ENTRY_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on ENTRY_USER_ID
     */
    entry_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ENTRY_USER_ID_NAME: string;
    /**
     * Determines if this flowsheet record has been accepted.
     */
    ACCEPTED_YN: string;
    /**
     * Indicates whether a value needing a co-sign is stored for the audit record for the flowsheet data record
     */
    AUDIT_NEED_COSIG_YN: string;
    /**
     * The unique ID of the flowsheet template (FLT) which was used to enter this data into the cell.
     */
    EDITED_FLT_ID: string;
    /**
     * Reference to IP_FLT_DATA based on EDITED_FLT_ID
     */
    edited_flt?: IP_FLT_DATA;
    /**
     * The display name associated with this template.
     */
    EDITED_FLT_ID_DISPLAY_NAME: string;
    /**
     * If the contact date (DAT) used to define data for a flowsheet group or row (see column FLO_DAT_USED) is changed, this column stores the prior value.
     */
    EDT_FLO_DAT_USED: number;
    /**
     * This column converts the contact date (DAT) of the flowsheet group or row to DTE, based on the value in column FLO_DAT_USED.
     */
    FLO_CNCT_DATE_REAL: number;
    /**
     * Reference to parent IP_FLWSHT_REC
     */
    ip_flwsht_rec?: IP_FLWSHT_REC;
}

/**
 * This table contains the patient-specific measurements from flowsheets.
 * pk: FSD_ID, LINE
 */
export interface IP_FLWSHT_MEAS {
    /**
     * The unique ID for the flowsheet data record.
     */
    FSD_ID: string;
    /**
     * The line count for the item.
     */
    LINE: number;
    /**
     * If the flowsheet group/row appears multiple times, this will distinguish the occurrence.
     */
    OCCURANCE: number;
    /**
     * The instant the reading was taken.
     */
    RECORDED_TIME: Date;
    /**
     * The instant the reading was entered.
     */
    ENTRY_TIME: Date;
    /**
     * The unique ID of the user taking the flowsheet readings.
     */
    TAKEN_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on TAKEN_USER_ID
     */
    taken_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    TAKEN_USER_ID_NAME: string;
    /**
     * The unique ID of the user entering the readings.
     */
    ENTRY_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on ENTRY_USER_ID
     */
    entry_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ENTRY_USER_ID_NAME: string;
    /**
     * The line number of the previous value of an edited record.
     */
    EDITED_LINE: number;
    /**
     * Determines if this flowsheet record has been accepted.
     */
    ISACCEPTED_YN: string;
    /**
     * If this item is blank or 0 (No), then this flowsheet data does not need a cosign
     */
    NEEDS_COSIGN_C_NAME: string;
    /**
     * The unique ID of the flowsheet template (FLT) which was used to enter the data in this cell.
     */
    FLT_ID: string;
    /**
     * Reference to IP_FLT_DATA based on FLT_ID
     */
    flt?: IP_FLT_DATA;
    /**
     * The display name associated with this template.
     */
    FLT_ID_DISPLAY_NAME: string;
    /**
     * This column stores the contact date (DAT) of the flowsheet row or group that is used to define the data.
     */
    FLO_DAT_USED: number;
    /**
     * This column converts the contact date (DAT) of the flowsheet group or row to DTE, based on the value in column FLO_DAT_USED.
     */
    FLO_CNCT_DATE_REAL: number;
    /**
     * User ID of the user who pended this flowsheet value.
     */
    USER_PENDED_BY_ID: string;
    /**
     * The name of the user record
     */
    USER_PENDED_BY_ID_NAME: string;
    /**
     * Date/time at which a flowsheet value is pended.
     */
    INSTANT_PENDED_DTTM: Date;
    /**
     * Stores whether or not the value is abnormal
     */
    ABNORMAL_C_NAME: string;
    /**
     * Indicates if the data was directly entered by the patient or a patient proxy and whether the data has been validated by a clinician
     */
    PAT_REPORTED_STATUS_C_NAME: string;
    /**
     * The MyChart account from which the data was entered.
     */
    MYPT_ID: string;
    /**
     * This column stores metadata for abnormal flowsheet values
     */
    ABNORMAL_TYPE_C_NAME: string;
    /**
     * The INI to which the value for this row is associated.
     */
    FLO_NETWORKED_INI: string;
    /**
     * Reference to parent IP_FLWSHT_REC
     */
    ip_flwsht_rec?: IP_FLWSHT_REC;
}

/**
 * This table contains linking information associated with flowsheet records.
 * pk: FSD_ID
 */
export interface IP_FLWSHT_REC {
    /**
     * The unique ID for the flowsheet data record.
     */
    FSD_ID: string;
    /**
     * The unique ID of the inpatient record associated with this flowsheet reading.
     */
    INPATIENT_DATA_ID: string;
    /**
     * Reference to IP_DATA_STORE based on INPATIENT_DATA_ID
     */
    inpatient_data?: IP_DATA_STORE;
    /**
     * The date these flowsheet readings were taken.
     */
    RECORD_DATE: Date;
    /**
     * The unique ID of the patient.
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * Collection of FLWSHT_SINGL_COL as children
     */
    flwsht_singl_col?: FLWSHT_SINGL_COL[];
    /**
     * Collection of IP_FLWSHT_EDITED as children
     */
    ip_flwsht_edited?: IP_FLWSHT_EDITED[];
    /**
     * Collection of IP_FLWSHT_MEAS as children
     */
    ip_flwsht_meas?: IP_FLWSHT_MEAS[];
}

/**
 * This table contains data on discrete frequency (EFQ) records.
 * pk: FREQ_ID
 */
export interface IP_FREQUENCY {
    /**
     * The unique ID for the frequency record.
     */
    FREQ_ID: string;
    /**
     * The name of the frequency record.
     */
    FREQ_NAME: string;
}

/**
 * This table stores the Inpatient Data (INP) records that have been charted upon for this LDA.
 * pk: IP_LDA_ID, LINE
 */
export interface IP_LDA_INPS_USED {
    /**
     * Line/Drain/Airway ID
     */
    IP_LDA_ID: string;
    /**
     * Reference to IP_LDA_NOADDSINGLE based on IP_LDA_ID
     */
    ip_lda?: IP_LDA_NOADDSINGLE;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column stores the inpatient data (INP) records on which the LDA has been documented.
     */
    INP_ID: string;
    /**
     * Reference to IP_DATA_STORE based on INP_ID
     */
    inp?: IP_DATA_STORE;
}

/**
 * This table stores LDA information for a patient
 * pk: IP_LDA_ID
 */
export interface IP_LDA_NOADDSINGLE {
    /**
     * The internal ID of the Lines/Drains/Airways (LDA) record.
     */
    IP_LDA_ID: string;
    /**
     * This item stores the ID of the patient to which this line record was added.
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * This item stores the contact serial number of the encounter in which the record was created.
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * This item stores the Flowsheet ID that defines the structure of this record
     */
    FLO_MEAS_ID: string;
    /**
     * Reference to IP_FLO_GP_DATA based on FLO_MEAS_ID
     */
    flo_meas?: IP_FLO_GP_DATA;
    /**
     * The display name given to the flowsheet group/row.
     */
    FLO_MEAS_ID_DISP_NAME: string;
    /**
     * This item stores the flowsheet data (FSD) ID of the record that has information about the properties of the line/drain/airway (LDA).
     */
    FSD_ID: string;
    /**
     * Reference to IP_FLWSHT_REC based on FSD_ID
     */
    fsd?: IP_FLWSHT_REC;
    /**
     * This item stores the name/description of the line/drain.
     */
    DESCRIPTION: string;
    /**
     * Stores the properties display string to be displayed in Doc Flowsheets and Reports.
     */
    PROPERTIES_DISPLAY: string;
    /**
     * This column stores the contact date real of the Line/Drain/Airway (LDA) Group contact that created this LDA
     */
    LDA_GROUP_CDR: number;
    /**
     * Represents where the patient traveled for this trip
     */
    TRIP_REGION_ID: number;
    /**
     * Reference to GEO_REGION based on TRIP_REGION_ID
     */
    trip_region?: GEO_REGION;
    /**
     * The record name for the geographical region record.
     */
    TRIP_REGION_ID_GEO_REGION_NAME: string;
    /**
     * Represents when a patient began their trip
     */
    TRIP_BEGIN_DATE: Date;
    /**
     * Represents the end of this patient trip
     */
    TRIP_END_DATE: Date;
    /**
     * Whether the dates for this trip are exact or approximate
     */
    TRIP_DATE_APPROX_C_NAME: string;
    /**
     * The recorded time used in IP_FLWSHT_MEAS for storing the property data for this LDA.
     */
    RECORDED_DTTM: Date;
}

/**
 * This table contains Inpatient order reconciliation information.
 * pk: EVENT_ID, LINE
 */
export interface IP_ORDER_REC {
    /**
     * The unique ID of the event record.
     */
    EVENT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
}

/**
 * This table displays unacknowledged orders associated with Inpatient (INP) records.
 * pk: INPATIENT_DATA_ID, LINE
 */
export interface IP_ORD_UNACK_PLAC {
    /**
     * The unique identifier for the inpatient record
     */
    INPATIENT_DATA_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Orders unacknowledged after being placed.
     */
    ORD_UNACK_PLACE_ID: number;
    /**
     * Reference to ORD_PRFLST_TRK based on ORD_UNACK_PLACE_ID
     */
    ord_unack_place?: ORD_PRFLST_TRK;
    /**
     * Reference to parent IP_DATA_STORE
     */
    ip_data_store?: IP_DATA_STORE;
}

/**
 * List of questionnaires assigned to a patient appointment to be asked in the Welcome kiosk application.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface KIOSK_QUESTIONNAIR {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * A unique contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The unique ID of the questionnaire assigned to the encounter, which will be presented to the patient at the Welcome kiosk.
     */
    KIOSK_QUEST_ID: string;
    /**
     * Reference to CL_QFORM1 based on KIOSK_QUEST_ID
     */
    kiosk_quest?: CL_QFORM1;
    /**
     * The name of the form associated with the questionnaire.
     */
    KIOSK_QUEST_ID_FORM_NAME: string;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * This table displays Lines/Drains/Airways information for patients that have had the invasive group added.
 * pk: PAT_ID, LINE
 */
export interface LINES_DRAINS_LIST {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column stores the Line/Drain/Airway (LDA) IDs of all of the LDAs attached to this patient across all their encounters.
     */
    IP_LDA_ID: string;
    /**
     * Reference to IP_LDA_NOADDSINGLE based on IP_LDA_ID
     */
    ip_lda?: IP_LDA_NOADDSINGLE;
}

/**
 * This is the primary table for Logical Observation Identifiers Names and Codes (LOINC�) information.
 * pk: RECORD_ID
 */
export interface LNC_DB_MAIN {
    /**
     * The unique identifier for the Logical Observation Identifiers Names and Codes (LOINC�) code.
     */
    RECORD_ID: number;
    /**
     * The unique code for the Logical Observation Identifiers Names and Codes (LOINC�) code.
     */
    LNC_CODE: string;
    /**
     * The more readable format than the fully specified name in Logical Observation Identifiers Names and Codes (LOINC�) code.
     */
    LNC_LONG_NAME: string;
}

/**
 * The MDL_HISTORY table enables you to report on Medication Problem List history information over time.
 * pk: MED_PRBLM_LIST_ID, CONTACT_DATE_REAL
 */
export interface MDL_HISTORY {
    /**
     * The unique identifier for the med problem list record.
     */
    MED_PRBLM_LIST_ID: number;
    /**
     * This is a numeric representation of the date of this contact in your system
     */
    CONTACT_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Reference to parent MDL_MD_PRBLM_LIST
     */
    mdl_md_prblm_list?: MDL_MD_PRBLM_LIST;
}

/**
 * The MDL_MD_PRBLM_LIST table enables you to report on Medication Problem List information.
 * pk: MED_PRBLM_LIST_ID
 */
export interface MDL_MD_PRBLM_LIST {
    /**
     * The unique identifier (.1 item) for the med problem list record.
     */
    MED_PRBLM_LIST_ID: number;
    /**
     * The Patient ID (EPT) with which this medication problem list (MDL) record is associated.
     */
    PATIENT_ID: string;
    /**
     * Reference to PATIENT based on PATIENT_ID
     */
    patient?: PATIENT;
    /**
     * This item stores the most recently calculated medication adherence score for this simple generic
     */
    MED_ADHER_SCORE: number;
    /**
     * Our confidence that the dispense data used to calculate the medication adherence score is a comprehensive list of dispenses.
     */
    MED_ADHER_CONF_C_NAME: string;
    /**
     * This item stores the instant that the current score is considered accurate
     */
    MED_ADHER_ACC_DTTM: Date;
    /**
     * This item stores the number of days a patient is supposed to take medications related to this simple generic
     */
    MED_ADHER_DAYSOWNED: number;
    /**
     * This item stores the number of days that are covered by a patient's supply
     */
    MED_ADHER_COVERED: number;
    /**
     * This item stores the calculation instant of the current adherence score.
     */
    MED_ADHER_INST_DTTM: Date;
    /**
     * This item sets the start date of the Medication adherence score measurement period
     */
    MED_ADHER_STRT_DATE: Date;
    /**
     * Collection of MDL_HISTORY as children
     */
    mdl_history?: MDL_HISTORY[];
}

/**
 * This table holds information about alternatives for medication coverages.
 * pk: MED_ESTIMATE_ID, CONTACT_DATE_REAL, LINE
 */
export interface MED_CVG_ALTERNATIVES {
    /**
     * The unique identifier (.1 item) for the medication estimate record.
     */
    MED_ESTIMATE_ID: number;
    /**
     * Reference to MED_CVG_INFO based on MED_ESTIMATE_ID
     */
    med_estimate?: MED_CVG_INFO;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Holds the ID of the medication (ERX) record that the payer suggested as an alternative.
     */
    ALT_ERX_ID: number;
    /**
     * Reference to CLARITY_MEDICATION based on ALT_ERX_ID
     */
    alt_erx?: CLARITY_MEDICATION;
    /**
     * Holds the ID of the medication estimate (LME) record that has coverage details for the payer-suggested alternative.
     */
    ALT_CVG_ID: number;
    /**
     * Reference to MED_CVG_INFO based on ALT_CVG_ID
     */
    alt_cvg?: MED_CVG_INFO;
}

/**
 * This table holds details about medication coverages.
 * pk: MED_ESTIMATE_ID, CONTACT_DATE_REAL, LINE
 */
export interface MED_CVG_DETAILS {
    /**
     * The unique identifier (.1 item) for the medication estimate record.
     */
    MED_ESTIMATE_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Holds the category value indicating the pharmacy type that is covered.
     */
    PHR_TYPE_C_NAME: string;
    /**
     * Holds the category value of the drug coverage status.
     */
    DRUG_STATUS_C_NAME: string;
    /**
     * Holds the quantity priced.
     */
    QTY_PRICED: number;
    /**
     * Holds the category value indicating the unit for the quantity priced.
     */
    QTY_PRICED_UNIT_C_NAME: string;
    /**
     * Holds the days supply priced.
     */
    DAYS_SUPPLY: number;
    /**
     * Holds the estimated patient pay amount.
     */
    PAT_PAY_AMT: number;
    /**
     * Holds the category value indicating whether prior authorization is required for this medication.
     */
    PA_REQ_C_NAME: string;
    /**
     * This item holds a pointer to the pharmacy (PHR) that was used for generating this estimate.
     */
    PHARMACY_ID: number;
    /**
     * The name of the pharmacy.
     */
    PHARMACY_ID_PHARMACY_NAME: string;
    /**
     * Reference to parent MED_CVG_INFO
     */
    med_cvg_info?: MED_CVG_INFO;
    /**
     * Collection of MED_CVG_STATUS_DETAILS as children
     */
    med_cvg_status_details?: MED_CVG_STATUS_DETAILS[];
}

/**
 * This table extracts the diagnosis codes associated with a medication estimate.
 * pk: MED_ESTIMATE_ID, CONTACT_DATE_REAL, GROUP_LINE, VALUE_LINE
 */
export interface MED_CVG_DX_VALUE {
    /**
     * The unique identifier (.1 item) for the medication estimate record.
     */
    MED_ESTIMATE_ID: number;
    /**
     * Reference to MED_CVG_INFO based on MED_ESTIMATE_ID
     */
    med_estimate?: MED_CVG_INFO;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact.
     */
    GROUP_LINE: number;
    /**
     * The line number of one of the multiple values associated with a specific group of data within this contact.
     */
    VALUE_LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Pointer to the diagnosis record associated with the medication estimate.
     */
    DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on DX_ID
     */
    dx?: CLARITY_EDG;
}

/**
 * This table holds information about medication coverage records.
 * pk: MED_ESTIMATE_ID
 */
export interface MED_CVG_INFO {
    /**
     * The unique identifier (.1 item) for the medication estimate record.
     */
    MED_ESTIMATE_ID: number;
    /**
     * Stores the date the record was created.
     */
    RECORD_CREATION_DATE: Date;
    /**
     * Stores the record type for this medication estimate.
     */
    CNCT_TYPE_C_NAME: string;
    /**
     * This holds the member ID associated with this medication estimate.
     */
    CVG_MEMBER_ID: string;
    /**
     * The unique ID of the patient record for this row (EPT ID)
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * Encounter contact serial number of the patient encounter record for this row (EPT CSN)
     */
    ENC_CSN: number;
    /**
     * The identifier of the e-prescribing network (DXO) record used for real-time prescription benefits (RTPB) for this estimate.
     */
    EPRESCRIBING_NET_ID: number;
    /**
     * Reference to ORG_DETAILS based on EPRESCRIBING_NET_ID
     */
    eprescribing_net?: ORG_DETAILS;
    /**
     * Organization's external name used as the display name on forms and user interfaces.
     */
    EPRESCRIBING_NET_ID_EXTERNAL_NAME: string;
    /**
     * This holds the external ID of the payer associated with this estimate.
     */
    CVG_PAYER_IDNT: string;
    /**
     * This item holds the record ID of the order (ORD) this medication estimate is linked to
     */
    ORDER_ID: number;
    /**
     * Reference to ORDER_MED based on ORDER_ID
     */
    order?: ORDER_MED;
    /**
     * Collection of MED_CVG_DETAILS as children
     */
    med_cvg_details?: MED_CVG_DETAILS[];
    /**
     * Collection of MED_CVG_RESP_RSLT_DETAIL as children
     */
    med_cvg_resp_rslt_detail?: MED_CVG_RESP_RSLT_DETAIL[];
    /**
     * Collection of MED_CVG_ESTIMATE_VALS as children
     */
    med_cvg_estimate_vals?: MED_CVG_ESTIMATE_VALS[];
}

/**
 * This table extracts the free-text details associated with medication coverage responses.
 * pk: MED_ESTIMATE_ID, CONTACT_DATE_REAL, LINE
 */
export interface MED_CVG_RESP_RSLT_DETAIL {
    /**
     * The unique identifier (.1 item) for the medication estimate record.
     */
    MED_ESTIMATE_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Holds free-text details about the response result.
     */
    RESULT_DETAILS: string;
    /**
     * Reference to parent MED_CVG_INFO
     */
    med_cvg_info?: MED_CVG_INFO;
}

/**
 * This table extracts the free-text coverage status for a medication estimate.
 * pk: MED_ESTIMATE_ID, CONTACT_DATE_REAL, GROUP_LINE, VALUE_LINE
 */
export interface MED_CVG_STATUS_DETAILS {
    /**
     * The unique identifier (.1 item) for the medication estimate record.
     */
    MED_ESTIMATE_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact.
     */
    GROUP_LINE: number;
    /**
     * The line number of one of the multiple values associated with a specific group of data within this contact.
     */
    VALUE_LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Holds text with details about the coverage status.
     */
    DRUG_STATUS_DETAILS: string;
    /**
     * Reference to parent MED_CVG_DETAILS
     */
    med_cvg_details?: MED_CVG_DETAILS;
}

/**
 * This table holds information about user actions taken on Patient Estimates.
 * pk: MED_ESTIMATE_ID, CONTACT_DATE_REAL, LINE
 */
export interface MED_CVG_USERACTION {
    /**
     * The unique identifier (.1 item) for the medication estimate record.
     */
    MED_ESTIMATE_ID: number;
    /**
     * Reference to MED_CVG_INFO based on MED_ESTIMATE_ID
     */
    med_estimate?: MED_CVG_INFO;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * This item stores the user (EMP) record ID of the user who either selects a medication alternative or keeps the original one in Patient Estimates.
     */
    UAC_EMP_ID: string;
    /**
     * Reference to CLARITY_EMP based on UAC_EMP_ID
     */
    uac_emp?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    UAC_EMP_ID_NAME: string;
    /**
     * Store whether user selects alternative medication from this LME.
     */
    UAC_SEL_ALT_YN: string;
    /**
     * Stores the instant (date and time in UTC) a user selected an alternative medication from this LME.
     */
    UAC_INS_UTC_DTTM: Date;
}

/**
 * This table holds the sig for an external medication dispense.
 * pk: DOCUMENT_ID, CONTACT_DATE_REAL, GROUP_LINE, VALUE_LINE
 */
export interface MED_DISPENSE_SIG {
    /**
     * The unique identifier (.1 item) for the document record.
     */
    DOCUMENT_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact.
     */
    GROUP_LINE: number;
    /**
     * The line number of one of the multiple values associated with a specific group of data within this contact.
     */
    VALUE_LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * This stores the sig for an external dispense.
     */
    EXT_MED_SIG: string;
}

/**
 * This table contains basic no-add information about medical conditions.
 * pk: MEDICAL_COND_ID
 */
export interface MEDICAL_COND_INFO {
    /**
     * The unique identifier for the medical condition record.
     */
    MEDICAL_COND_ID: number;
    /**
     * This contains the name of the medical condition.
     */
    MEDICAL_COND_NAME: string;
}

/**
 * The MEDICAL_HX table contains data from medical history contacts entered in clinical system patient encounters
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface MEDICAL_HX {
    /**
     * The line number of the medical history contact within the encounter
     */
    LINE: number;
    /**
     * The unique ID of the diagnosis record associated with the medical history contact
     */
    DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on DX_ID
     */
    dx?: CLARITY_EDG;
    /**
     * A unique serial number for this encounter
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * The MEDICATION_COST_ESTIMATES table contains information linking an order to medication cost estimate records.
 * pk: ORDER_ID, LINE
 */
export interface MEDICATION_COST_ESTIMATES {
    /**
     * The unique identifier (.1 item) for the order record.
     */
    ORDER_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The unique identifier for a medication estimate (LME) record, which stores estimated patient cost information for the associated medication order.
     */
    MEDICATION_ESTIMATE_ID: number;
    /**
     * Reference to MED_CVG_INFO based on MEDICATION_ESTIMATE_ID
     */
    medication_estimate?: MED_CVG_INFO;
    /**
     * Reference to parent ORDER_MED
     */
    order_med?: ORDER_MED;
}

/**
 * Information on the approval status of medication orders pended in a telephone encounter.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface MED_PEND_APRV_STAT {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * A unique contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * A flag indicating the status of medications pended for approval in a telephone encounter.
     */
    MED_PEND_APRV_FLG_C_NAME: string;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * This table lists all of the times that a user reviewed a patient's medication list
 * pk: PAT_ID, LINE_COUNT
 */
export interface MEDS_REV_HX {
    /**
     * The unique ID of the patient record for this row.
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE_COUNT: number;
    /**
     * The date and time that the patient's medication list was marked as reviewed.
     */
    MEDS_HX_REV_INSTANT: Date;
    /**
     * The unique ID associated with the user that marked the patient's medication list as reviewed.
     */
    MEDS_HX_REV_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on MEDS_HX_REV_USER_ID
     */
    meds_hx_rev_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    MEDS_HX_REV_USER_ID_NAME: string;
    /**
     * The unique contact serial number of the contact in which the patient's medication list was reviewed
     */
    MEDS_HX_REV_CSN: number;
    /**
     * Count of how many meds are found in the medication history review list (I EPT 17229).
     */
    MEDS_HX_REV_COUNT: number;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table lists the patient's current medications from the last time a user reviewed the patient's medications.





Reviewing user and other information about the most recent review of medications is in the PATIENT table in columns MEDS_LAST_REV_TM, MEDS_LST_REV_USR_ID, and MEDS_LAST_REV_CSN.





The list of medications current at each review instance is in the MEDS_REV_HX_LIST table.





Reviewing user and other information about each medication's review instance is in the MEDS_REV_HX table.
 * pk: PAT_ID, LINE_COUNT
 */
export interface MEDS_REV_LAST_LIST {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * The line number for the information associated with this record
     */
    LINE_COUNT: number;
    /**
     * The unique ID of one of the patient's current medication orders at the most recent time of review.
     */
    MEDICATION_ORDER_ID: number;
    /**
     * Reference to ORDER_MED based on MEDICATION_ORDER_ID
     */
    medication_order?: ORDER_MED;
    /**
     * Indicates whether the associated medication order was marked as taking at the most recent time of review.
     */
    TAKING_YN: string;
}

/**
 * This table contains the text of MyChart messages.
 * pk: MESSAGE_ID, LINE
 */
export interface MSG_TXT {
    /**
     * The unique identifier for the message record.
     */
    MESSAGE_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Stores the body text in the message.
     */
    MSG_TXT: string;
    /**
     * Reference to parent MYC_MESG
     */
    myc_mesg?: MYC_MESG;
}

/**
 * Table to store the general questionnaire attached to upcoming appointment.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface MYC_APPT_QNR_DATA {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * A unique contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Stores the ID of a questionnaire assigned to an upcoming appointment.
     */
    MYC_APPT_QUESR_ID: string;
    /**
     * Reference to CL_QFORM1 based on MYC_APPT_QUESR_ID
     */
    myc_appt_quesr?: CL_QFORM1;
    /**
     * The name of the form associated with the questionnaire.
     */
    MYC_APPT_QUESR_ID_FORM_NAME: string;
    /**
     * Stores the start date of when a questionnaire can be shown for an upcoming appointment,
     */
    MYC_QUESR_START_DT: Date;
    /**
     * The status of the patient-entered appointment questionnaire.
     */
    PAT_APPT_QNR_STAT_C_NAME: string;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * Customer service topics associated with the MyChart message conversation.
 * pk: THREAD_ID, LINE
 */
export interface MYC_CONVO_ABT_CUST_SVC {
    /**
     * The unique identifier (.1 item) for the thread record.
     */
    THREAD_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Contains the category value of the customer service topic associated with the conversation
     */
    NCS_TOPIC_C_NAME: string;
    /**
     * Reference to parent MYC_CONVO
     */
    myc_convo?: MYC_CONVO;
}

/**
 * Medical advice topic associated with the MyChart message conversation.
 * pk: THREAD_ID, LINE
 */
export interface MYC_CONVO_ABT_MED_ADVICE {
    /**
     * The unique identifier (.1 item) for the thread record.
     */
    THREAD_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Contains the category value of the medical advice topic that was selected for this conversation
     */
    MED_ADV_TOPIC_C_NAME: string;
    /**
     * Contains the name of the topic that was presented to the user when the conversation was created.
     */
    TOPIC_DISPLAY_NAME: string;
    /**
     * Reference to parent MYC_CONVO
     */
    myc_convo?: MYC_CONVO;
}

/**
 * MyChart conversation audience.
 * pk: THREAD_ID, LINE
 */
export interface MYC_CONVO_AUDIENCE {
    /**
     * The unique identifier (.1 item) for the thread record.
     */
    THREAD_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * MyChart conversation audiences are where the messages that patients send go
     */
    AUDIENCE_USER_ID: string;
    /**
     * The name of the user record
     */
    AUDIENCE_USER_ID_NAME: string;
    /**
     * MyChart conversation audiences are where the messages that patients send go
     */
    AUDIENCE_DISPLAY_NAME: string;
    /**
     * MyChart conversation audiences are where the messages that patients send go
     */
    AUDIENCE_PROV_ID: string;
    /**
     * Reference to parent MYC_CONVO
     */
    myc_convo?: MYC_CONVO;
}

/**
 * Contains the list of encounters that this message is directly connected to; the encounters created from sending a message
 * pk: THREAD_ID, LINE
 */
export interface MYC_CONVO_ENCS {
    /**
     * The unique identifier (.1 item) for the thread record.
     */
    THREAD_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Contains the list of encounters that this conversation is attached to.
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * Reference to parent MYC_CONVO
     */
    myc_convo?: MYC_CONVO;
}

/**
 * MyChart Conversation viewable messages.
 * pk: THREAD_ID, LINE
 */
export interface MYC_CONVO_MSGS {
    /**
     * The unique identifier (.1 item) for the thread record.
     */
    THREAD_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This is the list of messages for this MyChart conversation
     */
    MESSAGE_ID: string;
    /**
     * Reference to MYC_MESG based on MESSAGE_ID
     */
    message?: MYC_MESG;
    /**
     * This is when the corresponding MyChart message was sent
     */
    SENT_UTC_DTTM: Date;
    /**
     * Reference to parent MYC_CONVO
     */
    myc_convo?: MYC_CONVO;
}

/**
 * MyChart conversations.
 * pk: THREAD_ID
 */
export interface MYC_CONVO {
    /**
     * The unique identifier (.1 item) for the thread record.
     */
    THREAD_ID: number;
    /**
     * The patient this conversation is about
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * Subject of the conversation.
     */
    SUBJECT: string;
    /**
     * The MyChart message type of this conversation
     */
    MYC_MSG_TYP_C_NAME: string;
    /**
     * Collection of MYC_CONVO_ABT_CUST_SVC as children
     */
    myc_convo_abt_cust_svc?: MYC_CONVO_ABT_CUST_SVC[];
    /**
     * Collection of MYC_CONVO_ABT_MED_ADVICE as children
     */
    myc_convo_abt_med_advice?: MYC_CONVO_ABT_MED_ADVICE[];
    /**
     * Collection of MYC_CONVO_AUDIENCE as children
     */
    myc_convo_audience?: MYC_CONVO_AUDIENCE[];
    /**
     * Collection of MYC_CONVO_ENCS as children
     */
    myc_convo_encs?: MYC_CONVO_ENCS[];
    /**
     * Collection of MYC_CONVO_MSGS as children
     */
    myc_convo_msgs?: MYC_CONVO_MSGS[];
    /**
     * Collection of MYC_CONVO_USERS as children
     */
    myc_convo_users?: MYC_CONVO_USERS[];
    /**
     * Collection of MYC_CONVO_VIEWERS as children
     */
    myc_convo_viewers?: MYC_CONVO_VIEWERS[];
}

/**
 * MyChart conversation users.
 * pk: THREAD_ID, LINE
 */
export interface MYC_CONVO_USERS {
    /**
     * The unique identifier (.1 item) for the thread record.
     */
    THREAD_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This is the list of all the users who have sent messages on this conversation
     */
    USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on USER_ID
     */
    user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    USER_ID_NAME: string;
    /**
     * Display names for messaging users
     */
    USER_DISPLAY_NAME: string;
    /**
     * Reference to parent MYC_CONVO
     */
    myc_convo?: MYC_CONVO;
}

/**
 * MyChart conversation viewers.
 * pk: THREAD_ID, LINE
 */
export interface MYC_CONVO_VIEWERS {
    /**
     * The unique identifier (.1 item) for the thread record.
     */
    THREAD_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This is a list of MyChart accounts who can see this thread.
     */
    MYPT_ID: string;
    /**
     * Reference to MYC_PATIENT based on MYPT_ID
     */
    mypt?: MYC_PATIENT;
    /**
     * Reference to parent MYC_CONVO
     */
    myc_convo?: MYC_CONVO;
}

/**
 * The MYC_MESG_CHILD table contains information about the child message of Secure Patient Message records
 * pk: MESSAGE_ID, LINE
 */
export interface MYC_MESG_CHILD {
    /**
     * The unique identifier for the message record.
     */
    MESSAGE_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The child messages for the web based chart system message record
     */
    CHILD_MSG_ID: string;
    /**
     * Reference to MYC_MESG based on CHILD_MSG_ID
     */
    child_msg?: MYC_MESG;
    /**
     * Reference to parent MYC_MESG
     */
    myc_mesg?: MYC_MESG;
}

/**
 * The MYC_MESG_CNCL_RSN table contains information about Secure Patient Message records sent to request the cancellation of an appointment
 * pk: MESSAGE_ID, LINE
 */
export interface MYC_MESG_CNCL_RSN {
    /**
     * The unique identifier for the message record.
     */
    MESSAGE_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The reason the patient is requesting cancellation of an appointment
     */
    CANCEL_REASON: string;
    /**
     * Reference to parent MYC_MESG
     */
    myc_mesg?: MYC_MESG;
}

/**
 * Holds a list of order IDs that are used in renewal request messaging.
 * pk: MESSAGE_ID, LINE
 */
export interface MYC_MESG_ORD_ITEMS {
    /**
     * The ID of the web-based chart system message record.
     */
    MESSAGE_ID: string;
    /**
     * Line number for the current order ID.
     */
    LINE: number;
    /**
     * The order ID of the medication being requested for renewal.
     */
    REN_REQ_ORDER_ID: number;
    /**
     * Reference to ORDER_MED based on REN_REQ_ORDER_ID
     */
    ren_req_order?: ORDER_MED;
    /**
     * Stores the source for the refill request
     */
    REN_REQ_FILL_SOURCE_C_NAME: string;
    /**
     * Reference to parent MYC_MESG
     */
    myc_mesg?: MYC_MESG;
}

/**
 * This table stores information on questionnaire answers that have been attached to web based chart system (WMG) messages
 * pk: MESSAGE_ID, LINE
 */
export interface MYC_MESG_QUESR_ANS {
    /**
     * The unique ID used to identify a web based chart system message record.
     */
    MESSAGE_ID: string;
    /**
     * The line number used to identify each row of read data associated with an individual web based chart system message record.
     */
    LINE: number;
    /**
     * This stores the IDs of the questionnaire answers associated with this message.
     */
    QUESR_ANS_ID: string;
    /**
     * Reference to CL_QANSWER based on QUESR_ANS_ID
     */
    quesr_ans?: CL_QANSWER;
    /**
     * Reference to parent MYC_MESG
     */
    myc_mesg?: MYC_MESG;
}

/**
 * Patient message content, in RTF format
 * pk: MESSAGE_ID, LINE
 */
export interface MYC_MESG_RTF_TEXT {
    /**
     * The unique identifier for the message record.
     */
    MESSAGE_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The text of a message, in RTF format.
     */
    RTF_TXT: string;
    /**
     * Reference to parent MYC_MESG
     */
    myc_mesg?: MYC_MESG;
}

/**
 * This table contains information on messages sent to and from web-based chart system patients.
 * pk: MESSAGE_ID
 */
export interface MYC_MESG {
    /**
     * The unique ID used to identify a web-based chart system message record
     */
    MESSAGE_ID: string;
    /**
     * The date and time the web-based chart system message record was created in local time.
     */
    CREATED_TIME: Date;
    /**
     * The unique ID of the original message in a chain of web-based chart system messages between patients and system users.
     */
    PARENT_MESSAGE_ID: string;
    /**
     * The unique ID of the system message associated with the web-based chart system message
     */
    INBASKET_MSG_ID: string;
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * A unique, internal contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The unique ID of the system user who sent a web-based chart system message to a patient.
     */
    FROM_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on FROM_USER_ID
     */
    from_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    FROM_USER_ID_NAME: string;
    /**
     * The unique ID of the system user who was sent a web-based chart system message from a patient.
     */
    TO_USER_ID: string;
    /**
     * The name of the user record
     */
    TO_USER_ID_NAME: string;
    /**
     * The message direction category number for the web-based chart system message
     */
    TOFROM_PAT_C_NAME: string;
    /**
     * If a message sent from a web-based chart system patient is re-routed from its intended destination, then the ID of the original recipient is stored in the field
     */
    ORIGINAL_TO: string;
    /**
     * The date and time that this web-based chart system message record was pulled into enterprise reporting.
     */
    UPDATE_DATE: Date;
    /**
     * This field is only used for medical advice request messages and indicates the subject selected by the patient from the drop down list.
     */
    REQUEST_SUBJECT: string;
    /**
     * The provider that was used in routing the patient access message
     */
    PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on PROV_ID
     */
    prov?: CLARITY_SER;
    /**
     * The department used in routing the patient access message
     */
    DEPARTMENT_ID: number;
    /**
     * The subject line of the web-based chart system message.
     */
    SUBJECT: string;
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * The read status category number for the web-based chart system message.
     */
    EOW_READ_STATUS_C_NAME: string;
    /**
     * The unique ID of the web-based chart system patient who owns this message.
     */
    WPR_OWNER_WPR_ID: string;
    /**
     * This item stores the request source of a medication renewal request
     */
    RENEWAL_REQ_SRC_C_NAME: string;
    /**
     * Collection of MSG_TXT as children
     */
    msg_txt?: MSG_TXT[];
    /**
     * Collection of MYC_MESG_CHILD as children
     */
    myc_mesg_child?: MYC_MESG_CHILD[];
    /**
     * Collection of MYC_MESG_CNCL_RSN as children
     */
    myc_mesg_cncl_rsn?: MYC_MESG_CNCL_RSN[];
    /**
     * Collection of MYC_MESG_ORD_ITEMS as children
     */
    myc_mesg_ord_items?: MYC_MESG_ORD_ITEMS[];
    /**
     * Collection of MYC_MESG_QUESR_ANS as children
     */
    myc_mesg_quesr_ans?: MYC_MESG_QUESR_ANS[];
    /**
     * Collection of MYC_MESG_RTF_TEXT as children
     */
    myc_mesg_rtf_text?: MYC_MESG_RTF_TEXT[];
}

/**
 * The MYC_PATIENT table contains one row for each web-based chart system account
 * pk: MYPT_ID
 */
export interface MYC_PATIENT {
    /**
     * The unique ID of the patient's web-based chart system account record.
     */
    MYPT_ID: string;
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
}

/**
 * This table contains discrete information pertaining to the type of content contained within the note text of a clinical note.
 * pk: NOTE_CSN_ID, LINE
 */
export interface NOTE_CONTENT_INFO {
    /**
     * The contact serial number (CSN) of the contact.
     */
    NOTE_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The unique identifier for the note record.
     */
    NOTE_ID: string;
    /**
     * Reference to HNO_INFO based on NOTE_ID
     */
    note?: HNO_INFO;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Reference to parent ABN_FOLLOW_UP
     */
    abn_follow_up?: ABN_FOLLOW_UP;
}

/**
 * This table contains summary information for billing system account notepad notes attached to accounts.
 * pk: NOTE_ID
 */
export interface NOTES_ACCT {
    /**
     * The unique ID of the Account Notepad note record.
     */
    NOTE_ID: string;
    /**
     * Reference to HNO_INFO based on NOTE_ID
     */
    note?: HNO_INFO;
    /**
     * This column stores the unique identifier for the guarantor associated with the note
     */
    ACCOUNT_ID: number;
    /**
     * Reference to ACCOUNT based on ACCOUNT_ID
     */
    account?: ACCOUNT;
    /**
     * The status of the note: active or inactive.
     */
    ACTIVE_STATUS: string;
    /**
     * The ID of the user who manually created the note
     */
    ENTRY_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on ENTRY_USER_ID
     */
    entry_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ENTRY_USER_ID_NAME: string;
    /**
     * The invoice number associated with this note.
     */
    INVOICE_NUMBER: string;
    /**
     * The date and time the account note was created.
     */
    NOTE_ENTRY_DTTM: Date;
}

/**
 * Orders linked to/from the HNO (notes) master file by order based transcriptions.
 * pk: NOTE_ID, LINE
 */
export interface NOTES_LINK_ORD_TXN {
    /**
     * The unique ID associated with the note record for this row.
     */
    NOTE_ID: string;
    /**
     * Reference to HNO_INFO based on NOTE_ID
     */
    note?: HNO_INFO;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Orders linked to/from the note records by order based transcriptions.
     */
    LINKED_ORD_ID: number;
    /**
     * Reference to ORDER_PROC based on LINKED_ORD_ID
     */
    linked_ord?: ORDER_PROC;
}

/**
 * This table contains transcription authorization info.
 * pk: NOTE_CSN_ID, LINE
 */
export interface NOTES_TRANS_AUTH {
    /**
     * The contact serial number (CSN) of the contact.
     */
    NOTE_CSN_ID: number;
    /**
     * Reference to ABN_FOLLOW_UP based on NOTE_CSN_ID
     */
    note_csn?: ABN_FOLLOW_UP;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * Date and time the transcription was authenticated
     */
    AUTH_DTTM: Date;
    /**
     * This is the dictation date and time in datetime format
     */
    DICTATION_TIME: Date;
    /**
     * The date and time in which the transcription character count was recorded.
     */
    CHR_CNT_DTTM: Date;
}

/**
 * Methods used to perform component test in lab.
 * pk: ORDER_ID, CONTACT_DATE_REAL, LINE
 */
export interface OBS_MTHD_ID {
    /**
     * The unique identifier for the order record.
     */
    ORDER_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Reference to parent ORDER_STATUS
     */
    order_status?: ORDER_STATUS;
}

/**
 * All values associated with a claim are stored in the Claim External Value record
 * pk: RECORD_ID, LINE
 */
export interface OCC_CD {
    /**
     * The unique identifier for the claim record.
     */
    RECORD_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * This item holds the occurrence codes that apply to the claim.
     */
    OCC_CD: string;
    /**
     * This item holds the date corresponding to the occurrence code.
     */
    OCC_DT: Date;
    /**
     * Reference to parent CLM_VALUES
     */
    clm_values?: CLM_VALUES;
}

/**
 * The Clinical Indications (reason for exam) and associated comments.
 * pk: ORDER_ID, LINE
 */
export interface ORD_CLIN_IND {
    /**
     * The unique ID of the order record.
     */
    ORDER_ID: number;
    /**
     * The line count for this table as determined by the number of users who reviewed this order.
     */
    LINE: number;
    /**
     * Clinical indications (reason for exam) free text answer to an order-specific question for this order.
     */
    CLIN_IND_TEXT: string;
    /**
     * Clinical indications (reason for exam) free text comment to an order-specific question for this order.
     */
    CLIN_IND_CMT_TEXT: string;
    /**
     * Reference to parent ORD_PRFLST_TRK
     */
    ord_prflst_trk?: ORD_PRFLST_TRK;
}

/**
 * This table stores the anatomical regions of this order.
 * pk: ORDER_ID, LINE
 */
export interface ORDER_ANATOMICAL_REGION {
    /**
     * The unique identifier (.1 item) for the order record.
     */
    ORDER_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Stores the Anatomical Region category IDs associated to this procedure.
     */
    ANATOMICAL_REGION_C_NAME: string;
    /**
     * Reference to parent ORDER_PROC
     */
    order_proc?: ORDER_PROC;
}

/**
 * The ORDER_COMMENT table allows you to report on comments for non-medication orders.
 * pk: ORDER_ID, LINE
 */
export interface ORDER_COMMENT {
    /**
     * The unique identifier for the non-medication order.
     */
    ORDER_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * Free text comment for non-medication orders.
     */
    ORDERING_COMMENT: string;
    /**
     * Reference to parent ORDER_PROC
     */
    order_proc?: ORDER_PROC;
}

/**
 * This table contains the DCS records attached to an order on a contact level such as scanned hard copy prescriptions, Lab Scans and Lab Reports.
 * pk: ORDER_ID, CONTACT_DATE_REAL, LINE
 */
export interface ORDER_DOCUMENTS {
    /**
     * The unique identifier (.1 item) for the order record.
     */
    ORDER_ID: number;
    /**
     * Reference to ORDER_PROC based on ORDER_ID
     */
    order?: ORDER_PROC;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
}

/**
 * The ORDER_DX_MED table enables you to report on the diagnoses associated with medications ordered in clinical system (prescriptions)
 * pk: ORDER_MED_ID, LINE
 */
export interface ORDER_DX_MED {
    /**
     * The unique ID of the medication order (prescription) record.
     */
    ORDER_MED_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * A unique, internal contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * The unique ID of the diagnosis record associated with the medication order.
     */
    DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on DX_ID
     */
    dx?: CLARITY_EDG;
    /**
     * Indicates whether the associated diagnosis is chronic.
     */
    DX_CHRONIC_YN: string;
    /**
     * Reference to parent ORDER_MED
     */
    order_med?: ORDER_MED;
}

/**
 * The ORDER_DX_PROC table enables you to report on the diagnoses associated with procedures ordered in clinical system
 * pk: ORDER_PROC_ID, LINE
 */
export interface ORDER_DX_PROC {
    /**
     * The unique ID of the procedure order record.
     */
    ORDER_PROC_ID: number;
    /**
     * The line number for the information associated with this procedure record
     */
    LINE: number;
    /**
     * A unique contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * The unique ID of the diagnosis record associated with the procedure order.
     */
    DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on DX_ID
     */
    dx?: CLARITY_EDG;
    /**
     * Indicates whether the diagnosis associated with this order record was marked as chronic during the ordering process
     */
    DX_CHRONIC_YN: string;
    /**
     * Reference to parent ORDER_PROC
     */
    order_proc?: ORDER_PROC;
}

/**
 * This table has, for this imaging order, the image availability information for each of the image archives from which you receive Image Availability Notifications.
 * pk: ORDER_ID, LINE
 */
export interface ORDER_IMAGE_AVAIL_INFO {
    /**
     * The unique identifier (.1 item) for the order record.
     */
    ORDER_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Indicates whether images are available at this location
     */
    IMG_AVAIL_YN: string;
    /**
     * The updated date and time of the image availability information for the related image storage location.
     */
    IMG_AVAIL_DTTM: Date;
    /**
     * Reference to parent ORDER_MED
     */
    order_med?: ORDER_MED;
}

/**
 * This table stores impression information for a procedure.
 * pk: ORDER_PROC_ID, ORD_DATE_REAL, LINE
 */
export interface ORDER_IMPRESSION {
    /**
     * The unique ID of the procedure order record.
     */
    ORDER_PROC_ID: number;
    /**
     * The line count for the reading physician's impression.
     */
    LINE: number;
    /**
     * The reading physician's impression for this procedure.
     */
    IMPRESSION: string;
    /**
     * This is a numeric representation of the date each order was placed in your system
     */
    ORD_DATE_REAL: number;
    /**
     * The calendar date that the order was placed.
     */
    CONTACT_DATE: Date;
    /**
     * Reference to parent ORDER_STATUS
     */
    order_status?: ORDER_STATUS;
}

/**
 * This table contains a list of orders that have been instantiated.
 * pk: ORDER_ID, LINE
 */
export interface ORDER_INSTANTIATED {
    /**
     * The unique ID of the order record.
     */
    ORDER_ID: number;
    /**
     * The line count for this table as determined by the number of instantiated orders.
     */
    LINE: number;
    /**
     * The ID for the instantiated order, the child
     */
    INSTNTD_ORDER_ID: number;
    /**
     * Reference to ORDER_PROC based on INSTNTD_ORDER_ID
     */
    instntd_order?: ORDER_PROC;
    /**
     * Reference to parent ORDER_PROC
     */
    order_proc?: ORDER_PROC;
}

/**
 * This table stores the anatomical regions of this order.
 * pk: ORDER_ID, LINE
 */
export interface ORDER_MODALITY_TYPE {
    /**
     * The unique identifier (.1 item) for the order record.
     */
    ORDER_ID: number;
    /**
     * Reference to ORDER_PROC based on ORDER_ID
     */
    order?: ORDER_PROC;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Stores the Modality Type category ID of the modality of this procedure.
     */
    MODALITY_TYPE_C_NAME: string;
}

/**
 * When sharing a lab result with a web-based chart system patient, the clinician may choose to attach a Result Comment
 * pk: ORDER_PROC_ID
 */
export interface ORDER_MYC_INFO {
    /**
     * The unique ID of the procedure order record that is being released/unreleased.
     */
    ORDER_PROC_ID: number;
    /**
     * Reference to ORDER_PROC based on ORDER_PROC_ID
     */
    order_proc?: ORDER_PROC;
    /**
     * Whether a result is released to a patient on MyChart.
     */
    RELEASED_YN: string;
}

/**
 * When a clinician (or interface) releases/unreleases a lab result to/from a web based chart system patient, tracking data for that action is stored in this table.
 * pk: ORDER_PROC_ID, LINE
 */
export interface ORDER_MYC_RELEASE {
    /**
     * The unique ID of the procedure order record that is released/unreleased.
     */
    ORDER_PROC_ID: number;
    /**
     * Since an order can be released/unreleased multiple times, the line number identifies a particular release instance.
     */
    LINE: number;
    /**
     * The ID of the Hyperspace user who released/unreleased the lab result to the web based chart system patient.
     */
    RELEASE_USER_ID: string;
    /**
     * The name of the user record
     */
    RELEASE_USER_ID_NAME: string;
    /**
     * This item indicates the action taken on the lab result
     */
    RELEASE_ACTION_C_NAME: string;
    /**
     * Contains the instant when a result was released to MyChart in UTC.
     */
    MYC_REL_UTC_DTTM: Date;
    /**
     * Reference to parent ORDER_PROC
     */
    order_proc?: ORDER_PROC;
}

/**
 * This table stores the narrative information resulting from a procedure.
 * pk: ORDER_PROC_ID, ORD_DATE_REAL, LINE
 */
export interface ORDER_NARRATIVE {
    /**
     * The unique ID of the procedure order record.
     */
    ORDER_PROC_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Stores the narrative information for this order.
     */
    NARRATIVE: string;
    /**
     * This is a numeric representation of the date each order was placed in your system
     */
    ORD_DATE_REAL: number;
    /**
     * The calendar date that the order was placed.
     */
    CONTACT_DATE: Date;
    /**
     * Indicates whether the order narrative is archived
     */
    IS_ARCHIVED_YN: string;
    /**
     * Reference to parent ORDER_STATUS
     */
    order_status?: ORDER_STATUS;
}

/**
 * This table will hold procedure order data where it is sometimes necessary to obtain the information from the parent (or possibly grandparent) order if it exists
 * pk: ORDER_ID
 */
export interface ORDER_PARENT_INFO {
    /**
     * The unique identifier that consists of the order ID
     */
    ORDER_ID: number;
    /**
     * Reference to ORDER_PROC based on ORDER_ID
     */
    order?: ORDER_PROC;
    /**
     * If the ID in the ORDER_ID column is a child order, then this column will hold the original order ID that instantiated the child (possibly a parent or possibly a grandparent order)
     */
    PARENT_ORDER_ID: number;
    /**
     * Reference to ORDER_PROC based on PARENT_ORDER_ID
     */
    parent_order?: ORDER_PROC;
    /**
     * This is the original ordering date and time of the order record in the PARENT_ORDER_ID column
     */
    ORDERING_DTTM: Date;
    /**
     * This is the original login department of the order record in the PARENT_ORDER_ID column
     */
    ORD_LOGIN_DEP_ID: number;
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * This is the patient contact department of the order record in the PARENT_ORDER_ID column.
     */
    PAT_CONTACT_DEP_ID: number;
    /**
     * Reference to CLARITY_DEP based on PAT_CONTACT_DEP_ID
     */
    pat_contact_dep?: CLARITY_DEP;
}

/**
 * This table contains information on pending orders.
 * pk: ORDER_ID, LINE
 */
export interface ORDER_PENDING {
    /**
     * The unique identifier for the pended order record.
     */
    ORDER_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The unique ID of the user pending the order.
     */
    USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on USER_ID
     */
    user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    USER_ID_NAME: string;
    /**
     * The time an order was pended.
     */
    PENDED_TIME: Date;
    /**
     * The unique ID of the user releasing a pended medication.
     */
    RELEASED_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on RELEASED_USER_ID
     */
    released_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    RELEASED_USER_ID_NAME: string;
    /**
     * The unique identifier of the ordering provider for a signed and held order.
     */
    SH_ORDR_PROV_ID: string;
    /**
     * The unique identifier of the authorizing provider for this signed and held order record
     */
    SH_AUTH_PROV_ID: string;
    /**
     * Reference to parent ORD_PRFLST_TRK
     */
    ord_prflst_trk?: ORD_PRFLST_TRK;
}

/**
 * This stores the accession numbers associated with the order.
 * pk: ORDER_PROC_ID, LINE
 */
export interface ORDER_RAD_ACC_NUM {
    /**
     * The unique ID of the procedure order record.
     */
    ORDER_PROC_ID: number;
    /**
     * The line count for this table as determined by the number of accession numbers associated with an order.
     */
    LINE: number;
    /**
     * The accession number associated with an order.
     */
    ACC_NUM: string;
    /**
     * The specimen application ID number associated with an order.
     */
    SPECIMEN_APP_IDN: string;
    /**
     * Reference to parent ORDER_PROC
     */
    order_proc?: ORDER_PROC;
}

/**
 * This table stores reading physician information for imaging procedures.
 * pk: ORDER_PROC_ID, LINE
 */
export interface ORDER_RAD_READING {
    /**
     * The unique ID of the procedure order record.
     */
    ORDER_PROC_ID: number;
    /**
     * Reference to ORDER_PROC based on ORDER_PROC_ID
     */
    order_proc?: ORDER_PROC;
    /**
     * The line count for this table as determined by the number of reading radiologists for an order.
     */
    LINE: number;
    /**
     * The reading radiologist for the order.
     */
    PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on PROV_ID
     */
    prov?: CLARITY_SER;
    /**
     * The date and time in UTC format when the reading physician made a change to the study.
     */
    READ_UTC_DTTM: Date;
}

/**
 * This table is used to store information from the overtime-related Orders items used for the result read/acknowledgment tracking feature
 * pk: ORDER_ID, CONTACT_DATE_REAL, LINE
 */
export interface ORDER_READ_ACK {
    /**
     * The unique identifier for the order record.
     */
    ORDER_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for when and who viewed the results associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * This item stores when the result was actually viewed by an end user.
     */
    READ_ACK_ACTUAL_UTC_DTTM: Date;
    /**
     * This item stores which user viewed this result.
     */
    WHO_READ_ACK_EMP_ID: string;
    /**
     * Reference to CLARITY_EMP based on WHO_READ_ACK_EMP_ID
     */
    who_read_ack_emp?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    WHO_READ_ACK_EMP_ID_NAME: string;
    /**
     * Reference to parent ORDER_STATUS
     */
    order_status?: ORDER_STATUS;
}

/**
 * This table contains result component comments for orders that are populated by the Incoming Results Interface
 * pk: ORDER_ID, CONTACT_DATE_REAL, LINE, LINE_COMMENT
 */
export interface ORDER_RES_COMMENT {
    /**
     * The internal order ID for this procedure.
     */
    ORDER_ID: number;
    /**
     * This is a numeric representation of the date of this encounter in your system
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line count associated with the result component
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The result component comments for this order record which are populated by the Incoming Results Interface
     */
    RESULTS_CMT: string;
    /**
     * The unique ID of each result component for each result
     */
    COMPONENT_ID: number;
    /**
     * Reference to CLARITY_COMPONENT based on COMPONENT_ID
     */
    component?: CLARITY_COMPONENT;
    /**
     * The name of the component.
     */
    COMPONENT_ID_NAME: string;
    /**
     * The line count associated with each line of the result component comments
     */
    LINE_COMMENT: number;
    /**
     * Reference to parent ORDER_RESULTS
     */
    order_results?: ORDER_RESULTS;
}

/**
 * This table contains information on results from clinical system orders
 * pk: ORDER_PROC_ID, ORD_DATE_REAL, LINE
 */
export interface ORDER_RESULTS {
    /**
     * The unique ID of the procedure order record.
     */
    ORDER_PROC_ID: number;
    /**
     * The line number of each result component within each ordered procedure.
     */
    LINE: number;
    /**
     * This is a numeric representation of the date each order was placed in your system
     */
    ORD_DATE_REAL: number;
    /**
     * This is a numeric representation of the end date for each order in your system
     */
    ORD_END_DATE_REAL: number;
    /**
     * The date the technician ran the tests for each order in calendar format.
     */
    RESULT_DATE: Date;
    /**
     * The unique ID of each result component for each result.
     */
    COMPONENT_ID: number;
    /**
     * Reference to CLARITY_COMPONENT based on COMPONENT_ID
     */
    component?: CLARITY_COMPONENT;
    /**
     * The name of the component.
     */
    COMPONENT_ID_NAME: string;
    /**
     * A unique serial number for the associated patient encounter
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * The value returned for each result component, in short free text format
     */
    ORD_VALUE: string;
    /**
     * A numeric representation of the value returned for each component where applicable
     */
    ORD_NUM_VALUE: number;
    /**
     * The category value associated with a standard HL7 flag code to mark each component result as abnormal
     */
    RESULT_FLAG_C_NAME: string;
    /**
     * The lowest acceptable value for each result component
     */
    REFERENCE_LOW: string;
    /**
     * The highest acceptable value for each result component
     */
    REFERENCE_HIGH: string;
    /**
     * The units for each result component value.
     */
    REFERENCE_UNIT: string;
    /**
     * The category value corresponding to the status of each result record, such as 2-Preliminary, 3-Final, 4-Corrected, 5-Incomplete.
     */
    RESULT_STATUS_C_NAME: string;
    /**
     * This item is populated with the unique organism identifier (OVR 700 or interface) when the component of an order result is an organism and can be joined to ORDER_SENSITIVITY.SENS_ORGANISM_SID to identify details about this organism.
     */
    RESULT_SUB_IDN: string;
    /**
     * The category value associated with the status of each result, such as 1-In Progress, 2-Preliminary, 3-Final, 4-Edited.
     */
    LAB_STATUS_C_NAME: string;
    /**
     * This Yes/No flag identifies whether each order was resulted through an interface
     */
    INTERFACE_YN: string;
    /**
     * The Unique ID of the Lab running the test.
     */
    RESULTING_LAB_ID: number;
    /**
     * Interface laboratory name.
     */
    RESULTING_LAB_ID_LLB_NAME: string;
    /**
     * Contains the comments associated with a order COMPONENT_ID, i.e
     */
    COMPONENT_COMMENT: string;
    /**
     * A Yes/No category value to indicate whether a result has been verified to be within its reference range
     */
    RESULT_IN_RANGE_YN: string;
    /**
     * This is a free-text item which allows you to enter a reference range without tying it to a "low" or "high" value
     */
    REF_NORMAL_VALS: string;
    /**
     * ID of the Resulting Lab Technician.
     */
    COMP_RES_TECHNICIA: string;
    /**
     * Will contain the structured numeric result value in a delimited structured numeric format
     */
    VALUE_NORMALIZED: string;
    /**
     * Timestamp to track per non-micro result component when it was collected/observed.
     */
    COMP_OBS_INST_TM: Date;
    /**
     * Timestamp to track per non-micro result component when it was analyzed in lab.
     */
    COMP_ANL_INST_TM: Date;
    /**
     * For multi-line results holds the starting line number of RESULTS_CMT column from ORDER_RES_COMMENT table, where the result values begin
     */
    RESULT_CMT_START_LN: number;
    /**
     * For multi-line results holds the ending line number of RESULTS_CMT column from ORDER_RES_COMMENT table, where the result values begin
     */
    RESULT_CMT_END_LN: number;
    /**
     * Logical Observation Identifiers Names and Codes (LOINC) ID of the component.
     */
    COMPON_LNC_ID: number;
    /**
     * Reference to LNC_DB_MAIN based on COMPON_LNC_ID
     */
    compon_lnc?: LNC_DB_MAIN;
    /**
     * Source of the component Logical Observation Identifiers Names and Codes (LOINC) ID.
     */
    COMPON_LNC_SRC_C_NAME: string;
    /**
     * Source of the Systemized Nomenclature of Medicine � Clinical Terms (SNOMED) code (reported vs inferred).
     */
    COMP_SNOMED_SRC_C_NAME: string;
    /**
     * This is used to indicate the performing organization information for the component
     */
    PERFORMING_ORG_INFO_LINE: number;
    /**
     * Collection of ORDER_RES_COMMENT as children
     */
    order_res_comment?: ORDER_RES_COMMENT[];
    /**
     * Reference to parent ORDER_STATUS
     */
    order_status?: ORDER_STATUS;
    /**
     * Collection of ORD_RSLT_COMPON_ID as children
     */
    ord_rslt_compon_id?: ORD_RSLT_COMPON_ID[];
}

/**
 * This table contains a history of sig-related data for prescriptions, both what the provider initially prescribed and what the patient later reported taking
 * pk: ORDER_ID, LINE
 */
export interface ORDER_RPTD_SIG_HX {
    /**
     * The unique identifier for the order record.
     */
    ORDER_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * The unique identifier of the user who entered the medication instructions.
     */
    ENTRY_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on ENTRY_USER_ID
     */
    entry_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ENTRY_USER_ID_NAME: string;
    /**
     * The date and time when these medication instructions were entered.
     */
    ENTRY_DTTM: Date;
    /**
     * The action represented by this sig - e.g
     */
    ACTION_C_NAME: string;
    /**
     * The location from which this sig was entered.
     */
    SOURCE_C_NAME: string;
    /**
     * The lower bound of the ranged dose for this medication's instructions.
     */
    DOSE_MIN: number;
    /**
     * The med & dose unit category ID for the dose of this medication's instructions.
     */
    DOSE_UNIT_C_NAME: string;
    /**
     * The unique identifier of the frequency record used in the medication instructions.
     */
    FREQUENCY_ID: string;
    /**
     * The name of the frequency record.
     */
    FREQUENCY_ID_FREQ_NAME: string;
    /**
     * The route for this medication instructions.
     */
    ROUTE_C_NAME: string;
    /**
     * Reference to parent ORDER_MED
     */
    order_med?: ORDER_MED;
    /**
     * Collection of ORDER_RPTD_SIG_INSTR as children
     */
    order_rptd_sig_instr?: ORDER_RPTD_SIG_INSTR[];
}

/**
 * For each row in ORDER_RPTD_SIG_HX, this table contains the free-text instructions that were entered, if any.
 * pk: ORDER_ID, GROUP_LINE, VALUE_LINE
 */
export interface ORDER_RPTD_SIG_INSTR {
    /**
     * The unique identifier for the order record.
     */
    ORDER_ID: number;
    /**
     * The line number for the information associated with the instructions for this medication.
     */
    GROUP_LINE: number;
    /**
     * The line number of one of the multiple values associated with a specific group of instructions within this record.
     */
    VALUE_LINE: number;
    /**
     * The additional instructions included with the medication instructions.
     */
    INSTRUCTIONS: string;
    /**
     * Reference to parent ORDER_RPTD_SIG_HX
     */
    order_rptd_sig_hx?: ORDER_RPTD_SIG_HX;
}

/**
 * For each row in ORDER_RPTD_SIG_HX, this table contains the complete sig for the data represented by that row
 * pk: ORDER_ID, GROUP_LINE, VALUE_LINE
 */
export interface ORDER_RPTD_SIG_TEXT {
    /**
     * The unique identifier for the order record.
     */
    ORDER_ID: number;
    /**
     * The line number for the information associated with the text of the sig of this medication.
     */
    GROUP_LINE: number;
    /**
     * The line number of one of the multiple values associated with a specific group of text of a sig within this record.
     */
    VALUE_LINE: number;
    /**
     * The text of the medication instructions for the order record.
     */
    SIG_TEXT: string;
    /**
     * Reference to parent ORDER_SUMMARY
     */
    order_summary?: ORDER_SUMMARY;
}

/**
 * This table contains the users, providers, and messages related to procedure verbal orders and cosign orders.
 * pk: ORDER_PROC_ID, LINE
 */
export interface ORDER_SIGNED_PROC {
    /**
     * The unique ID for the procedure order record.
     */
    ORDER_PROC_ID: number;
    /**
     * The line count for the table.
     */
    LINE: number;
    /**
     * Indicates the type of order signing the row represents
     */
    SIGNED_TYPE_C_NAME: string;
    /**
     * The unique provider record ID for the provider communicating the verbal order.
     */
    VERB_COMM_PROV_ID: string;
    /**
     * The unique user record ID for the user signing the verbal order.
     */
    VERB_SGNER_USER_ID: string;
    /**
     * The name of the user record
     */
    VERB_SGNER_USER_ID_NAME: string;
    /**
     * The date and time the verbal order was signed.
     */
    VERB_SIGNED_TIME: Date;
    /**
     * The mode associated with the verbal order.
     */
    VERBAL_MODE_C_NAME: string;
    /**
     * The unique provider record ID for the ordering provider.
     */
    ORDER_PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on ORDER_PROV_ID
     */
    order_prov?: CLARITY_SER;
    /**
     * The unique provider record ID for the authorizing provider.
     */
    AUTH_PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on AUTH_PROV_ID
     */
    auth_prov?: CLARITY_SER;
    /**
     * Indicates if the order was by a hospitalist.
     */
    IS_HOSPITALIST_YN: string;
    /**
     * When the cosign requirement was created (UTC Time).
     */
    CSGN_CREATE_DTTM: Date;
    /**
     * This item stores whether or not an order requires a cosign based on when a new line is added to the verbal order category type (I ORD 34800).
     */
    CSGN_RQRD_C_NAME: string;
    /**
     * If the order signature requirement was manually created, this item stores the ID of the user who created the requirement.
     */
    SIG_REQ_CRT_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on SIG_REQ_CRT_USER_ID
     */
    sig_req_crt_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    SIG_REQ_CRT_USER_ID_NAME: string;
    /**
     * This column is the creation source for order signature requirements.
     */
    SIG_REQ_CRT_SRC_C_NAME: string;
    /**
     * Reference to parent ORDER_PROC
     */
    order_proc?: ORDER_PROC;
}

/**
 * The ORDER_STATUS table contains overtime single response orders information.
 * pk: ORDER_ID, ORD_DATE_REAL
 */
export interface ORDER_STATUS {
    /**
     * Unique ID for this order record
     */
    ORDER_ID: number;
    /**
     * This is a numeric representation of the date of this encounter in your system
     */
    ORD_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The contact number of the orders record.
     */
    CONTACT_NUMBER: number;
    /**
     * The category value for the contact type, such as "1" for "Ordered" or "2" for "Resulted"
     */
    CONTACT_TYPE_C_NAME: string;
    /**
     * This Y/N flag reports Y if a result component in the order is reported as abnormal or N if the order is normal.
     */
    ABNORMAL_YN: string;
    /**
     * The unique ID of the person creating the order.
     */
    ORDER_CREATOR_ID: string;
    /**
     * Reference to CLARITY_EMP based on ORDER_CREATOR_ID
     */
    order_creator?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ORDER_CREATOR_ID_NAME: string;
    /**
     * The unique ID of the lab running the test.
     */
    RESULTING_LAB_ID: number;
    /**
     * Interface laboratory name.
     */
    RESULTING_LAB_ID_LLB_NAME: string;
    /**
     * The instant the record was last entered.
     */
    INSTANT_OF_ENTRY: Date;
    /**
     * The category value of the outcome of results routing for each resulting contact of order associated with this row.
     */
    ROUTING_OUTCOME_C_NAME: string;
    /**
     * The line of the results routing scheme that was executed to determine recipients for this result
     */
    ROUTING_SCHEME_LINE: string;
    /**
     * The date and time the order was resulted and routed.
     */
    ROUTING_INST_TM: Date;
    /**
     * The unique ID of the user the result was routed to for this row.
     */
    ROUTING_USER_ID: string;
    /**
     * The name of the user record
     */
    ROUTING_USER_ID_NAME: string;
    /**
     * This item stores the current routing status for a resulting contact.
     */
    ROUTING_CURSTATUS_C_NAME: string;
    /**
     * Indicates the lab status value associated with each order contact.
     */
    LAB_STATUS_C_NAME: string;
    /**
     * The instant in which a result contact is modified/filed to the system
     */
    RSLT_CNCT_INSTANT_DTTM: Date;
    /**
     * The user filing the result contact
     */
    RSLT_CNCT_USER_ID: string;
    /**
     * The name of the user record
     */
    RSLT_CNCT_USER_ID_NAME: string;
    /**
     * Stores which entry point modified the result contact.
     */
    RSLT_CNCT_SOURCE_C_NAME: string;
    /**
     * The date and time the technician ran the tests for each order in calendar format
     */
    RESULT_DTTM: Date;
    /**
     * This item stores the line number of the performing organization related group (ORD 1220) and acts as a pointer to the performing organization information of narrative of the result.
     */
    NARRATIVE_PERF_ORG_INFO: number;
    /**
     * This item stores the line number of the preforming organization related group (ORD 1220) and acts as a pointer to the performing organization information of impression of the result.
     */
    IMPRESSION_PERF_ORG_INFO: number;
    /**
     * Collection of OBS_MTHD_ID as children
     */
    obs_mthd_id?: OBS_MTHD_ID[];
    /**
     * Collection of ORDER_IMPRESSION as children
     */
    order_impression?: ORDER_IMPRESSION[];
    /**
     * Collection of ORDER_NARRATIVE as children
     */
    order_narrative?: ORDER_NARRATIVE[];
    /**
     * Collection of ORDER_READ_ACK as children
     */
    order_read_ack?: ORDER_READ_ACK[];
    /**
     * Collection of ORDER_RESULTS as children
     */
    order_results?: ORDER_RESULTS[];
    /**
     * Reference to parent ORD_PRFLST_TRK
     */
    ord_prflst_trk?: ORD_PRFLST_TRK;
}

/**
 * Contains the summary for an order that has been signed.
 * pk: ORDER_ID, LINE
 */
export interface ORDER_SUMMARY {
    /**
     * The unique identifier for the order record.
     */
    ORDER_ID: number;
    /**
     * Line number of each line in multiple responses in a signed order summary.
     */
    LINE: number;
    /**
     * The summary sentence for the order.
     */
    ORD_SUMMARY: string;
    /**
     * Collection of ORDER_RPTD_SIG_TEXT as children
     */
    order_rptd_sig_text?: ORDER_RPTD_SIG_TEXT[];
    /**
     * Reference to parent ORD_PRFLST_TRK
     */
    ord_prflst_trk?: ORD_PRFLST_TRK;
}

/**
 * This table stores the indications of use selected for a medication record.
 * pk: ORDER_ID, LINE
 */
export interface ORD_INDICATIONS {
    /**
     * The unique ID of the order record.
     */
    ORDER_ID: number;
    /**
     * The line count of associated changes in Indication(s) of Use for the order record.
     */
    LINE: number;
    /**
     * The indications of use selected for a medication order.
     */
    INDICATIONS_ID: number;
    /**
     * Reference to MEDICAL_COND_INFO based on INDICATIONS_ID
     */
    indications?: MEDICAL_COND_INFO;
    /**
     * This contains the name of the medical condition.
     */
    INDICATIONS_ID_MEDICAL_COND_NAME: string;
    /**
     * Reference to parent ORD_PRFLST_TRK
     */
    ord_prflst_trk?: ORD_PRFLST_TRK;
}

/**
 * This table is to show administration instruction information for each order
 * pk: ORDER_MED_ID, LINE
 */
export interface ORD_MED_ADMININSTR {
    /**
     * The unique ID of the medication order (prescription) record
     */
    ORDER_MED_ID: number;
    /**
     * The line number for each administration instruction line.
     */
    LINE: number;
    /**
     * The context for administration instruction converted to plain text.
     */
    MED_ADMIN_INSTR: string;
    /**
     * The date the order was placed in calendar format.
     */
    ORDERING_DATE: Date;
    /**
     * Reference to parent ORD_PRFLST_TRK
     */
    ord_prflst_trk?: ORD_PRFLST_TRK;
}

/**
 * This table contains user-entered administration instructions
 * pk: ORDER_ID, LINE
 */
export interface ORD_MED_USER_ADMIN {
    /**
     * The unique ID of the medication order (prescription) record
     */
    ORDER_ID: number;
    /**
     * The line number for each user-entered administration instruction line.
     */
    LINE: number;
    /**
     * User-entered admin instructions converted to plain text
     */
    MED_USER_ADMN_INSTR: string;
    /**
     * The date the order was placed in calendar format.
     */
    ORDERING_DATE: Date;
    /**
     * Reference to parent ORD_PRFLST_TRK
     */
    ord_prflst_trk?: ORD_PRFLST_TRK;
}

/**
 * This table contains information about order-specific procedure process instructions clinicians see in Order Composer when they sign the order
 * pk: ORDER_ID, LINE
 */
export interface ORD_PROC_INSTR {
    /**
     * The unique identifier for the order record.
     */
    ORDER_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Process Instructions displayed to end user in the order editing window when signing the order.
     */
    ORDER_PROC_INSTR: string;
    /**
     * Reference to parent ORD_PRFLST_TRK
     */
    ord_prflst_trk?: ORD_PRFLST_TRK;
}

/**
 * This table contains component-level SNOMED codes from the related multiple response Component SNOMED Code (I ORD 2510) item.
 * pk: ORDER_ID, CONTACT_DATE_REAL, GROUP_LINE, VALUE_LINE
 */
export interface ORD_RSLT_COMPON_ID {
    /**
     * The unique identifier for the order record.
     */
    ORDER_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact.
     */
    GROUP_LINE: number;
    /**
     * The line number of one of the multiple values associated with a specific group of data within this contact.
     */
    VALUE_LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Systematized Nomenclature of Medicine (SNOMED) code associated w/ the component from an Order record.
     */
    COMPON_SNOMED_CT: string;
    /**
     * Reference to parent ORDER_RESULTS
     */
    order_results?: ORDER_RESULTS;
}

/**
 * This table contains order specific questions and their responses.
 * pk: ORDER_ID, LINE
 */
export interface ORD_SPEC_QUEST {
    /**
     * The unique identifier for the order record.
     */
    ORDER_ID: number;
    /**
     * The line item for this record determined by the order specific question ID
     */
    LINE: number;
    /**
     * The identification number of the question for this order.
     */
    ORD_QUEST_ID: string;
    /**
     * The date of the question for this order.
     */
    ORD_QUEST_DATE: Date;
    /**
     * Indicates whether or not this question was answered by the procedure
     */
    IS_ANSWR_BYPROC_YN: string;
    /**
     * The response to the question for this order.
     */
    ORD_QUEST_RESP: string;
    /**
     * Reference to parent ORD_PRFLST_TRK
     */
    ord_prflst_trk?: ORD_PRFLST_TRK;
}

/**
 * Details about the organization
 * pk: ORGANIZATION_ID
 */
export interface ORG_DETAILS {
    /**
     * The unique ID associated with the organization for this row.
     */
    ORGANIZATION_ID: number;
    /**
     * Organization's external name used as the display name on forms and user interfaces.
     */
    EXTERNAL_NAME: string;
}

/**
 * This table stores miscellaneous communication devices that can be used to reach the patient
 * pk: PAT_ID, LINE
 */
export interface OTHER_COMMUNCTN {
    /**
     * The unique identifier for the patient record.
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Other communication devices such as: 1) MOBILE: Mobile 2) PAGER: Pager 3) HOME FAX: Home Fax 4) OTH FAX: Other Fax 5) ASTNT: Assistant 6) TTY/TDP: TTY/TDP 7) HOME PH: Home Phone 8) WORK PH: Work Phone
     */
    OTHER_COMMUNIC_C_NAME: string;
    /**
     * Different kinds of communication numbers such as Home Phone, Work Phone, Fax, Pager, etc, that correspond to the type of device stored in OTHER_COMMUNIC_C.
     */
    OTHER_COMMUNIC_NUM: string;
    /**
     * Priorities are numbers, and are used to set a calling preference for phone numbers
     */
    CONTACT_PRIORITY: number;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * The PAT_ACCT_CVG table contains information about a patient�s accounts and coverages
 * pk: PAT_ID, LINE
 */
export interface PAT_ACCT_CVG {
    /**
     * The unique ID assigned to the patient record
     */
    PAT_ID: string;
    /**
     * The line number
     */
    LINE: number;
    /**
     * The unique account record ID for an account associated with this patient
     */
    ACCOUNT_ID: number;
    /**
     * Reference to ACCOUNT based on ACCOUNT_ID
     */
    account?: ACCOUNT;
    /**
     * Category value associated with the type of account, such as Personal/Family, Worker�s Comp, etc.
     */
    ACCOUNT_TYPE_C_NAME: string;
    /**
     * Is the account active at the time of the extract: Y or N.
     */
    ACCOUNT_ACTIVE_YN: string;
    /**
     * The financial class category number for the patient's primary coverage on the account
     */
    FIN_CLASS_NAME: string;
    /**
     * Relation between the guarantor and patient.
     */
    GUAR_PAT_REL_NAME: string;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table contains the encounter addendum information from the Addendum Added Date (I EPT 18123) and Addendum Added User (I EPT 18129) items.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_ADDENDUM_INFO {
    /**
     * A unique contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * A unique serial number for this encounter
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The line count for the items.
     */
    LINE: number;
    /**
     * The date and time when the addendum of the patient encounter is created.
     */
    ADDENDUM_DATE_TIME: Date;
    /**
     * The unique ID of the system user who has created the addendum for the patient encounter.
     */
    ADDENDUM_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on ADDENDUM_USER_ID
     */
    addendum_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ADDENDUM_USER_ID_NAME: string;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * Additional Patient Address Information.
 * pk: PAT_ID, LINE
 */
export interface PAT_ADDL_ADDR_INFO {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The type of additional address data (floor, unit, building name, etc.) stored in the related field (I EPT 66).
     */
    ADDL_ADDR_FIELD_C_NAME: string;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table keeps track of changes in the patient's address.
 * pk: PAT_ID, LINE
 */
export interface PAT_ADDR_CHNG_HX {
    /**
     * Patient ID for whom address is changed.
     */
    PAT_ID: string;
    /**
     * Line count in the address change history.
     */
    LINE: number;
    /**
     * First line of patient's home address, current between dates recorded in columns EFF_START_DATE and EFF_END_DATE.
     */
    ADDR_HX_LINE1: string;
    /**
     * Patient's home city, current between dates recorded in columns EFF_START_DATE and EFF_END_DATE.
     */
    CITY_HX: string;
    /**
     * Patient's home county, current between dates recorded in columns EFF_START_DATE and EFF_END_DATE.
     */
    COUNTY_HX_C_NAME: string;
    /**
     * Patient's home ZIP, current between dates recorded in columns EFF_START_DATE and EFF_END_DATE.
     */
    ZIP_HX: string;
    /**
     * Source of address changes.
     */
    ADDR_CHNG_SOURCE_C_NAME: string;
    /**
     * Effective start date of changed address (date when address was changed).
     */
    EFF_START_DATE: Date;
    /**
     * Effective end date of changed address (date of the next address change or NULL if this is the last address change).
     */
    EFF_END_DATE: Date;
    /**
     * Audit trail item used to store whether the address change should be considered significant when a new address is entered or if the current primary address is edited.
     */
    SIGNIFICANT_CHANGE_YN: string;
    /**
     * Audit trail item used to store the previous country when a new country is entered or if the current primary address is edited.
     */
    COUNTRY_C_NAME: string;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table contains each patient's permanent address (I EPT 50)
 * pk: PAT_ID, LINE
 */
export interface PAT_ADDRESS {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column contains the patient's permanent address
     */
    ADDRESS: string;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * The allergies that are associated with a patient are stored on this table
 * pk: PAT_ID, LINE
 */
export interface PAT_ALLERGIES {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column contains the allergies that are associated with the patient
     */
    ALLERGY_RECORD_ID: number;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * Table contains the information about cancel procedures in the generic patient database.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_CANCEL_PROC {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * ID of the cancelled procedure.
     */
    CAN_PRCD_C_ID: string;
    /**
     * Reference to CLARITY_PRC based on CAN_PRCD_C_ID
     */
    can_prcd_c?: CLARITY_PRC;
}

/**
 * The PAT_CVG_FILE_ORDER table contains information about the filing order of each member's coverages
 * pk: PAT_ID, LINE
 */
export interface PAT_CVG_FILE_ORDER {
    /**
     * The unique ID assigned to the patient record
     */
    PAT_ID: string;
    /**
     * The line number used to identify each line of filing order information for the patient.
     */
    LINE: number;
    /**
     * The unique ID assigned to the coverage record
     */
    COVERAGE_ID: number;
    /**
     * Reference to COVERAGE based on COVERAGE_ID
     */
    coverage?: COVERAGE;
    /**
     * The coverage filing order, as determined manually by a user or automatically using the automatic filing order rules.
     */
    FILING_ORDER: number;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table stores the patient's email addresses.
 * pk: PAT_ID, LINE
 */
export interface PAT_EMAILADDRESS {
    /**
     * Internal ID of the patient (.1 record ID)
     */
    PAT_ID: string;
    /**
     * The Line Count
     */
    LINE: number;
    /**
     * Email address for this patient.
     */
    EMAIL_ADDRESS: string;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This tables stores previous instances in which the admission diagnosis was populated or deleted for an encounter.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_ENC_ADMIT_DX_AUDIT {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * Stores the instant that a change to the Inpatient Admission Diagnosis (I EPT 10150/10151) was made.
     */
    ADMISSION_DX_EDIT_UTC_DTTM: Date;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * The PAT_ENC_APPT table contains basic information about the appointment records in your system
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_ENC_APPT {
    /**
     * The unique serial number for this encounter
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Used to identify the provider within one appointment.
     */
    LINE: number;
    /**
     * The date on which the encounter took place.
     */
    CONTACT_DATE: Date;
    /**
     * The unique ID of the department in which the appointment will take place.
     */
    DEPARTMENT_ID: number;
    /**
     * Reference to CLARITY_DEP based on DEPARTMENT_ID
     */
    department?: CLARITY_DEP;
    /**
     * The date and time that the appointment is scheduled to begin with this provider, such as 01/10/2000 14:45.
     */
    PROV_START_TIME: Date;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * The PAT_ENC_CURR_MEDS table enables you to report on current (as well as active) medications per encounter as listed in clinical system.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_ENC_CURR_MEDS {
    /**
     * This is a numeric representation of the date of this encounter in your system
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The current medication order ID for the encounter.
     */
    CURRENT_MED_ID: number;
    /**
     * Reference to ORDER_MED based on CURRENT_MED_ID
     */
    current_med?: ORDER_MED;
    /**
     * A Yes/No flag indicating patient is taking the medication or not.
     */
    IS_ACTIVE_YN: string;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * The PAT_ENC_DISP table contains information from the Follow-up action on the Visit Navigator tab for the ambulatory clinical system
 * pk: PAT_ENC_CSN_ID
 */
export interface PAT_ENC_DISP {
    /**
     * A unique, internal contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * The category number that indicates whether the Level of Service was dropped for this encounter
     */
    LOS_DROPPED_C_NAME: string;
    /**
     * The category number that indicates whether the patient is a new (first time being seen) or established patient.
     */
    LOS_NEW_OR_EST_C_NAME: string;
    /**
     * The reason that a charge was not triggered for a level of service
     */
    LOS_NO_CHG_RSN_C_NAME: string;
}

/**
 * The PAT_ENC_DOCS table contains information about each document that is attached to a patient encounter, including scanned and electronically signed documents.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_ENC_DOCS {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * A unique, internal contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The ID of the document for this patient encounter.
     */
    DOC_INFO_ID: string;
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * States whether or not the document is attached to an Admission, Discharge, Transfer, or Leave of Absence (ADT) Contact.
     */
    ADT_CONTACT_YN: string;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * The patient encounter diagnosis table contains one record for each diagnosis associated with each encounter level of service
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_ENC_DX {
    /**
     * This is a numeric representation of the date of this encounter in your system
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The line number of the diagnosis within the encounter
     */
    LINE: number;
    /**
     * The contact date of the encounter associated with this diagnosis
     */
    CONTACT_DATE: Date;
    /**
     * A unique serial number for this encounter
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The unique ID of the diagnosis record associated with the patient encounter
     */
    DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on DX_ID
     */
    dx?: CLARITY_EDG;
    /**
     * This is a one character field that indicates whether this diagnosis was the primary diagnosis for the encounter
     */
    PRIMARY_DX_YN: string;
    /**
     * Stores the chronic flag for a diagnosis.
     */
    DX_CHRONIC_YN: string;
    /**
     * Unique identifier given when a diagnosis is added to the encounter diagnosis list.
     */
    DX_UNIQUE: string;
    /**
     * Definitively identifies an encounter diagnosis (I EDG 18400) as being an ED clinical impression
     */
    DX_ED_YN: string;
    /**
     * Stores the problem ID of the linked problem.
     */
    DX_LINK_PROB_ID: number;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * This table holds information about actions taken on a patient's pharmacy benefit eligibility information.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_ENC_ELIG_HISTORY {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * A unique contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * This item holds the action performed on the patient's eligibility.
     */
    ELIG_ACTION_C_NAME: string;
    /**
     * This item indicates which eligibility plan the action was taken on
     */
    ELIG_PLAN_INDEX: number;
    /**
     * This item holds the user who performed the action on the patient's eligibility information.
     */
    ELIG_HX_USER_ID: string;
    /**
     * The name of the user record
     */
    ELIG_HX_USER_ID_NAME: string;
    /**
     * This item holds the instant that the eligibility action was performed.
     */
    ELIG_HX_INST_UTC_DTTM: Date;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * The patient encounter letters table contains information about letters associated with encounters.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_ENC_LETTERS {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line count used to identify different letters associated with an encounter.
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The category value associated with the status of each letter,  such as 1- Open, 2- Deleted, 3- Sent, 4- Voided, 5-Sent by batch.
     */
    LTR_STATUS_C_NAME: string;
    /**
     * The date that the letter was created.
     */
    LETTER_CREAT_DT: Date;
    /**
     * The note (HNO) record that hold the letter text.
     */
    LETTER_HNO_ID: string;
    /**
     * Reference to HNO_INFO based on LETTER_HNO_ID
     */
    letter_hno?: HNO_INFO;
    /**
     * The user ID of the user entered as the "from" user in the letter activity.
     */
    LETTER_FROM_ID: string;
    /**
     * Reference to CLARITY_EMP based on LETTER_FROM_ID
     */
    letter_from?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    LETTER_FROM_ID_NAME: string;
    /**
     * The category value associated with the reason for the letter.
     */
    LETTER_REASON_C_NAME: string;
    /**
     * The instant (date and time) the status of the letter was created or changed.
     */
    LTR_STATUS_CHG_TM: Date;
    /**
     * The user that changed or created the letter status.
     */
    LTR_STAT_CH_USR_ID: string;
    /**
     * Reference to CLARITY_EMP based on LTR_STAT_CH_USR_ID
     */
    ltr_stat_ch_usr?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    LTR_STAT_CH_USR_ID_NAME: string;
    /**
     * The number of work days (excluding weekends and holidays) from the date of the letter's encounter to the date the letter was sent.
     */
    LETTER_WORKINGDAYS: number;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * The PAT_ENC_QNRS_ANS table contains the Answer ID numbers for the Answers to all Appointment Questionnaires
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_ENC_QNRS_ANS {
    /**
     * This is the Contact Serial Number
     */
    PAT_ENC_CSN_ID: number;
    /**
     * This item stores the line number of each Questionnaire Answer record that exists for this record.
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * The PAT_ENC_RSN_VISIT contains the data entered as the Reason for Visit for a clinical system encounter
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_ENC_RSN_VISIT {
    /**
     * A unique serial number for this encounter
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number of the reason for visit within the encounter.
     */
    LINE: number;
    /**
     * The ID of the record associated with the Reason for Visit entered in an encounter.
     */
    ENC_REASON_ID: number;
    /**
     * Reference to CL_RSN_FOR_VISIT based on ENC_REASON_ID
     */
    enc_reason?: CL_RSN_FOR_VISIT;
    /**
     * The comments associated with the reason for visit entered in a clinical system exam encounter.
     */
    COMMENTS: string;
    /**
     * The onset date for reason for call/visit stored on this line
     */
    RFV_ONSET_DT: Date;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * Contains the list of selected pharmacies for an encounter.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_ENC_SEL_PHARMACIES {
    /**
     * The unique contact serial number (CSN) for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * A unique contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Contains the pharmacies that have been selected for the encounter
     */
    PAT_ENC_PHARM_ID: number;
    /**
     * Reference to RX_PHR based on PAT_ENC_PHARM_ID
     */
    pat_enc_pharm?: RX_PHR;
    /**
     * The name of the pharmacy.
     */
    PAT_ENC_PHARM_ID_PHARMACY_NAME: string;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * The PAT_EPISODE table links patient ID numbers to Episodes of Care records
 * pk: PAT_ID, LINE
 */
export interface PAT_EPISODE {
    /**
     * The unique ID assigned to the patient record
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The unique ID number associated with an Episode of Care.
     */
    EPISODE_ID: number;
    /**
     * Reference to EPISODE based on EPISODE_ID
     */
    episode?: EPISODE;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * Health Maintenance Plans used during patient's last health maintenance update.
 * pk: PAT_ID, LINE
 */
export interface PAT_HM_CUR_GUIDE {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Current Health Maintenance Plans the patient is a part of.
     */
    HM_CURRENT_GUIDE_ID: number;
    /**
     * Reference to HM_PLAN_INFO based on HM_CURRENT_GUIDE_ID
     */
    hm_current_guide?: HM_PLAN_INFO;
    /**
     * The name of the Health Maintenance Plan record.
     */
    HM_CURRENT_GUIDE_ID_HM_PLAN_NAME: string;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * List of Health Maintenance letters with corresponding topic, type and due date.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_HM_LETTER {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The Health Maintenance Topic corresponding with the letter.
     */
    HM_LET_TOPIC_LST_ID: number;
    /**
     * Reference to CLARITY_HM_TOPIC based on HM_LET_TOPIC_LST_ID
     */
    hm_let_topic_lst?: CLARITY_HM_TOPIC;
    /**
     * The name of the health maintenance topic.
     */
    HM_LET_TOPIC_LST_ID_NAME: string;
}

/**
 * This table contains information about when a patient's history was reviewed and by whom.





More detailed information on what kinds of history were reviewed is in the PAT_HX_REV_TYPE and PAT_HX_REV_TOPIC tables.
 * pk: PAT_ENC_CSN_ID, LINE_COUNT
 */
export interface PAT_HX_REVIEW {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE_COUNT: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The unique ID of the user who reviewed history for the patient.
     */
    HX_REVIEWED_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on HX_REVIEWED_USER_ID
     */
    hx_reviewed_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    HX_REVIEWED_USER_ID_NAME: string;
    /**
     * The date history was reviewed for this patient.
     */
    HX_REVIEWED_DATE: Date;
    /**
     * The date and time history was reviewed for this patient.
     */
    HX_REVIEWED_INSTANT: Date;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * The PATIENT_ALG_UPD_HX table contains one record for each update of a patient's allergy information.
 * pk: PAT_ID, LINE
 */
export interface PATIENT_ALG_UPD_HX {
    /**
     * The unique ID assigned to the patient record.
     */
    PAT_ID: string;
    /**
     * The line number of a specific allergy update in the patient's allergy update history
     */
    LINE: number;
    /**
     * The date on which the patient's allergy history was updated.
     */
    ALRG_UPDT_DATE: Date;
    /**
     * The user who last updated the patient's allergy history.
     */
    ALRG_UPDT_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on ALRG_UPDT_USER_ID
     */
    alrg_updt_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ALRG_UPDT_USER_ID_NAME: string;
    /**
     * The time at which the patient's allergy history was updated.
     */
    ALRG_UPDT_TIME: Date;
    /**
     * This item stores the history of the status of the review of allergies.
     */
    ALRG_HX_REV_STAT_C_NAME: string;
    /**
     * The date and time at which the patient's allergy history was updated.
     */
    ALRG_UPDT_DTTM: Date;
    /**
     * This column contains historical entries for the source encounter where allergies were reviewed
     */
    ALRG_HX_REV_EPT_CSN: number;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * The PATIENT_ALIAS table contains the aliases and soundex data for your patients
 * pk: PAT_ID, LINE
 */
export interface PATIENT_ALIAS {
    /**
     * The unique ID number assigned to the patient record.
     */
    PAT_ID: string;
    /**
     * The line number associated with the alias information associated with this row
     */
    LINE: number;
    /**
     * The alias on the patient record.
     */
    ALIAS: string;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * The PATIENT_DOCS table contains information about each document that is attached to a patient record, including scanned and electronically signed documents.
 * pk: PAT_ID, LINE
 */
export interface PATIENT_DOCS {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The unique ID of the patient with this document.
     */
    LINE: number;
    /**
     * The ID of the document for this patient.
     */
    DOC_INFO_ID: string;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * The list of goals (IGO) record IDs for this patient.
 * pk: PAT_ID, LINE
 */
export interface PATIENT_GOALS {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The unique ID of the Discrete Goal for this patient.
     */
    GOAL_ID: string;
    /**
     * Reference to GOAL based on GOAL_ID
     */
    goal?: GOAL;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table contains information on the due status of health maintenance topics.
 * pk: PAT_ID, LINE
 */
export interface PATIENT_HMT_STATUS {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The Line Count
     */
    LINE: number;
    /**
     * The date when the patient's qualified Health Maintenance topic due status was last updated.
     */
    HMT_LAST_UPDATE_DT: Date;
    /**
     * Stores the Health Maintenance plan that is currently active for the topic
     */
    ACTIVE_HM_PLAN_ID: number;
    /**
     * Reference to HM_PLAN_INFO based on ACTIVE_HM_PLAN_ID
     */
    active_hm_plan?: HM_PLAN_INFO;
    /**
     * The name of the Health Maintenance Plan record.
     */
    ACTIVE_HM_PLAN_ID_HM_PLAN_NAME: string;
    /**
     * Stores the active immunization series the patient is currently on.
     */
    HM_ACTIVE_SERIES_C_NAME: string;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table contains information on a patient's race.
 * pk: PAT_ID, LINE
 */
export interface PATIENT_RACE {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The race of the patient.
     */
    PATIENT_RACE_C_NAME: string;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table stores a list of patients' immunizations that can be linked to the immunizations (LPL) table, IMMUNE.
 * pk: PAT_ID, LINE
 */
export interface PAT_IMMUNIZATIONS {
    /**
     * The unique system identifier of the patient record.
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The unique ID of the immunization record.
     */
    IMMUNE_ID: number;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table extracts the medication history for patient (EPT) records.
 * pk: PAT_ID, LINE
 */
export interface PAT_MEDS_HX {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The ID of the medication order for the patient.
     */
    MEDS_HX_ID: number;
    /**
     * Reference to ORDER_MED based on MEDS_HX_ID
     */
    meds_hx?: ORDER_MED;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table contains a link to the MyChart message for a patient encounter.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_MYC_MESG {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This is a numeric representation of the date of this encounter in your system
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The unique ID of the MyChart message for an encounter.
     */
    MYCHART_MESSAGE_ID: string;
    /**
     * Reference to MYC_MESG based on MYCHART_MESSAGE_ID
     */
    mychart_message?: MYC_MESG;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * This table contains the Primary Care Provider (PCP) information for your patients over time
 * pk: PAT_ID, LINE
 */
export interface PAT_PCP {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The unique ID associated with the provider record for this row
     */
    PCP_PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on PCP_PROV_ID
     */
    pcp_prov?: CLARITY_SER;
    /**
     * The date from which the provider is in effect as the member�s PCP.
     */
    EFF_DATE: Date;
    /**
     * The last date for which the provider was the member�s PCP.
     */
    TERM_DATE: Date;
    /**
     * The category value associated with the type of the PCP
     */
    PCP_TYPE_C_NAME: string;
    /**
     * The specialty category ID for the patient care team member.
     */
    SPECIALTY_C_NAME: string;
    /**
     * The results to receive category ID for the patient care team member.
     */
    RESULTS_C_NAME: string;
    /**
     * The unique ID of the address in the provider record that should be used to contact the patient's PCP
     */
    PCP_ADDRESS_ID: string;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table contains information on a patient's pharmacy preferences.
 * pk: PAT_ID, LINE
 */
export interface PAT_PREF_PHARMACY {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number associated with the list of preferred pharmacy selected
     */
    LINE: number;
    /**
     * The preferred pharmacy ID
     */
    PREF_PHARMACY_ID: number;
    /**
     * Reference to RX_PHR based on PREF_PHARMACY_ID
     */
    pref_pharmacy?: RX_PHR;
    /**
     * The name of the pharmacy.
     */
    PREF_PHARMACY_ID_PHARMACY_NAME: string;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * The PAT_PRIM_LOC table contains the Primary Location information for your patients over time.
 * pk: PAT_ID, LINE
 */
export interface PAT_PRIM_LOC {
    /**
     * The unique ID assigned to the patient record
     */
    PAT_ID: string;
    /**
     * The line number used to identify each line of Primary Location information for the patient.
     */
    LINE: number;
    /**
     * The unique ID of the location record for the Primary Location.
     */
    LOC_ID: number;
    /**
     * Reference to CLARITY_LOC based on LOC_ID
     */
    loc?: CLARITY_LOC;
    /**
     * The date from which the location is in effect as the member�s Primary Location.
     */
    EFF_DATE: Date;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table contains information about the problem list of a patient
 * pk: PAT_ID, LINE
 */
export interface PAT_PROBLEM_LIST {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The unique ID of the problem(s) listed for the patient record of this row.
     */
    PROBLEM_LIST_ID: number;
    /**
     * Reference to PROBLEM_LIST based on PROBLEM_LIST_ID
     */
    problem_list?: PROBLEM_LIST;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table extracts a patient's most recently selected pharmacies.
 * pk: PAT_ID, LINE
 */
export interface PAT_RCNT_USD_PHRMS {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Patient's recent selected pharmacy
     */
    RECENT_PHARM_ID: number;
    /**
     * Reference to RX_PHR based on RECENT_PHARM_ID
     */
    recent_pharm?: RX_PHR;
    /**
     * The name of the pharmacy.
     */
    RECENT_PHARM_ID_PHARMACY_NAME: string;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table extracts the related multiple-response item Pat Rel Address (I EPT 1701) item, which stores the addresses of each emergency contact for a given patient
 * pk: PAT_ID, GROUP_LINE, VALUE_LINE
 */
export interface PAT_REL_ADDR {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record.
     */
    GROUP_LINE: number;
    /**
     * The line number of one of the multiple values associated with a specific group of data within this record.
     */
    VALUE_LINE: number;
    /**
     * Patient emergency contact's address
     */
    PAT_REL_ADDRESS: string;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table contains information about the patient contacts' addresses
 * pk: PAT_RELATIONSHIP_ID, LINE
 */
export interface PAT_RELATIONSHIP_ADDR {
    /**
     * The unique identifier for the patient contact record.
     */
    PAT_RELATIONSHIP_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The patient contact's address.
     */
    ADDRESS: string;
    /**
     * Reference to parent PAT_RELATIONSHIP_LIST
     */
    pat_relationship_list?: PAT_RELATIONSHIP_LIST;
}

/**
 * This table contains historical information about patient relationships
 * pk: RELATIONSHIP_ID, LINE
 */
export interface PAT_RELATIONSHIP_LIST_HX {
    /**
     * The unique identifier for the patient contact record.
     */
    RELATIONSHIP_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The relationship to patient category ID for the patient contact.
     */
    RELATION_TO_PAT_C_NAME: string;
    /**
     * The date the patient contact's relation to the patient ended.
     */
    RELATIONSHIP_END_DATE: Date;
    /**
     * Reference to parent PAT_RELATIONSHIP_LIST
     */
    pat_relationship_list?: PAT_RELATIONSHIP_LIST;
}

/**
 * This table includes the majority of patient contact demographic info, general relationship info, and patient-level relationship info
 * pk: PAT_RELATIONSHIP_ID
 */
export interface PAT_RELATIONSHIP_LIST {
    /**
     * The unique identifier for the patient contact record.
     */
    PAT_RELATIONSHIP_ID: number;
    /**
     * The unique ID of the patient this patient contact is added to.
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * Indicates whether the patient contact should be displayed at the patient level.
     */
    PAT_LEVEL_RELATIONSHIP_YN: string;
    /**
     * Patient contact's name
     */
    NAME: string;
    /**
     * Patient contact's city of residence.
     */
    CITY: string;
    /**
     * The state category ID for the patient contact's residence.
     */
    STATE_C_NAME: string;
    /**
     * Patient contact's postal code.
     */
    ZIP_CODE: string;
    /**
     * The county category ID for the patient contact.
     */
    COUNTY_C_NAME: string;
    /**
     * The country category ID for the patient contact.
     */
    COUNTRY_C_NAME: string;
    /**
     * The date when the patient contact was created.
     */
    RECORD_CREATION_DATE: Date;
    /**
     * Stores the order in which patient-level contacts display.
     */
    DISPLAY_SEQUENCE: number;
    /**
     * The name of the patient contact record
     */
    PAT_RELATIONSHIP_RECORD_NAME: string;
    /**
     * The phone number of a patient contact
     */
    PRIMARY_OR_FIRST_PHONE: string;
    /**
     * Collection of PAT_RELATIONSHIP_ADDR as children
     */
    pat_relationship_addr?: PAT_RELATIONSHIP_ADDR[];
    /**
     * Collection of PAT_RELATIONSHIP_LIST_HX as children
     */
    pat_relationship_list_hx?: PAT_RELATIONSHIP_LIST_HX[];
    /**
     * Collection of PAT_REL_CONTEXT as children
     */
    pat_rel_context?: PAT_REL_CONTEXT[];
    /**
     * Collection of PAT_REL_EMAIL_ADDR as children
     */
    pat_rel_email_addr?: PAT_REL_EMAIL_ADDR[];
    /**
     * Collection of PAT_REL_LANGUAGES as children
     */
    pat_rel_languages?: PAT_REL_LANGUAGES[];
    /**
     * Collection of PAT_REL_PHONE_NUM as children
     */
    pat_rel_phone_num?: PAT_REL_PHONE_NUM[];
}

/**
 * Demographic information for patient contacts.
 * pk: PAT_ID, LINE
 */
export interface PAT_RELATIONSHIPS {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The name of the patient's contact.
     */
    PAT_REL_NAME: string;
    /**
     * Contact's city of residence
     */
    PAT_REL_CITY: string;
    /**
     * The ZIP code of the patient's contact.
     */
    PAT_REL_ZIP: string;
    /**
     * Contact's county of residence
     */
    PAT_REL_COUNTY_C_NAME: string;
    /**
     * Contact's country of residence
     */
    PAT_REL_COUNTRY_C_NAME: string;
    /**
     * Contact's mobile phone
     */
    PAT_REL_MOBILE_PHNE: string;
    /**
     * Contact's relation to patient
     */
    PAT_REL_RELATION_C_NAME: string;
    /**
     * Which of the contact's phone numbers should be considered primary
     */
    PAT_REL_PRIM_PH_C_NAME: string;
    /**
     * Links this patient contact to the associated Patient Relationships (RLA) patient relationship record.
     */
    PAT_REL_RLA_ID: number;
    /**
     * Reference to PAT_RELATIONSHIP_LIST based on PAT_REL_RLA_ID
     */
    pat_rel_rla?: PAT_RELATIONSHIP_LIST;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table contains information about the contexts in which your patient relationship records are relevant
 * pk: PAT_RELATIONSHIP_ID, LINE
 */
export interface PAT_REL_CONTEXT {
    /**
     * The unique identifier for the patient contact record.
     */
    PAT_RELATIONSHIP_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The context category IDs for contexts in which the patient contact is relevant.
     */
    CONTEXT_C_NAME: string;
    /**
     * Reference to parent PAT_RELATIONSHIP_LIST
     */
    pat_relationship_list?: PAT_RELATIONSHIP_LIST;
}

/**
 * This table contains information about the patient contacts' email addresses
 * pk: PAT_RELATIONSHIP_ID, LINE
 */
export interface PAT_REL_EMAIL_ADDR {
    /**
     * The unique identifier for the patient contact record.
     */
    PAT_RELATIONSHIP_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Indicates whether the email address for this patient contact is the primary email address
     */
    PRIMARY_EMAIL_YN: string;
    /**
     * Reference to parent PAT_RELATIONSHIP_LIST
     */
    pat_relationship_list?: PAT_RELATIONSHIP_LIST;
}

/**
 * This table contains information about the patient contacts' languages
 * pk: PAT_RELATIONSHIP_ID, LINE
 */
export interface PAT_REL_LANGUAGES {
    /**
     * The unique identifier for the patient contact record.
     */
    PAT_RELATIONSHIP_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The language type category ID for the patient contact.
     */
    LANGUAGE_TYPE_C_NAME: string;
    /**
     * Reference to parent PAT_RELATIONSHIP_LIST
     */
    pat_relationship_list?: PAT_RELATIONSHIP_LIST;
}

/**
 * This table contains information about the patient contacts' phone numbers
 * pk: PAT_RELATIONSHIP_ID, LINE
 */
export interface PAT_REL_PHONE_NUM {
    /**
     * The unique identifier for the patient contact record.
     */
    PAT_RELATIONSHIP_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Patient contact's phone number.
     */
    PHONE_NUM: string;
    /**
     * The phone number type category ID for the patient contact's phone number.
     */
    PHONE_NUM_TYPE_C_NAME: string;
    /**
     * Indicates whether the phone number for this patient contact is the primary email address
     */
    PRIMARY_PHONE_YN: string;
    /**
     * Reference to parent PAT_RELATIONSHIP_LIST
     */
    pat_relationship_list?: PAT_RELATIONSHIP_LIST;
}

/**
 * This table contains information about the patient contacts' special needs
 * pk: PAT_RELATIONSHIP_ID, LINE
 */
export interface PAT_REL_SPEC_NEEDS {
    /**
     * The unique identifier for the patient contact record.
     */
    PAT_RELATIONSHIP_ID: number;
    /**
     * Reference to PAT_RELATIONSHIP_LIST based on PAT_RELATIONSHIP_ID
     */
    pat_relationship?: PAT_RELATIONSHIP_LIST;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
}

/**
 * Table contains patient entered clinical allergy data review from Welcome Kiosk and MyChart.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_REVIEW_ALLERGI {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * A unique, internal contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Patient allergies reviewed by patient.
     */
    PAT_REVIEW_ELG_ID: number;
    /**
     * The name of the allergen record.
     */
    PAT_REVIEW_ELG_ID_ALLERGEN_NAME: string;
    /**
     * Patient allergies reviewed by patient response.
     */
    PAT_REVIEW_ELG_R_YN: string;
    /**
     * Patient allergies reviewed by the patient, entered in a free text format.
     */
    PAT_REVIEW_EXTERNAL: string;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * Table contains patient entered clinical problem data review from Welcome Kiosk and MyChart.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_REVIEW_PROBLEM {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * A unique, internal contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Patient problem reviewed by patient.
     */
    PAT_REVIEW_LPL_ID: number;
    /**
     * Patient problem reviewed by patient response.
     */
    PAT_REVIEW_LPL_R_YN: string;
    /**
     * Patient problems reviewed by the patient, entered in a free text format.
     */
    PAT_REV_LPL_EXTERN: string;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * All values associated with a claim are stored in the Claim External Value record
 * pk: RECORD_ID, LINE
 */
export interface PAT_RSN_VISIT_DX {
    /**
     * The unique identifier for the claim record.
     */
    RECORD_ID: number;
    /**
     * Reference to CLM_VALUES based on RECORD_ID
     */
    record?: CLM_VALUES;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * This item holds the qualifier identifying the code set for the patient reason for visit diagnoses.
     */
    PAT_RSN_VISIT_QUAL: string;
    /**
     * This item holds the diagnoses representing the patient's reason for the visit.
     */
    PAT_RSN_VISIT_DX: string;
}

/**
 * This table contains the history documentation related to your patients for an encounter
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_SOCIAL_HX_DOC {
    /**
     * The unique identifier of the patient encounter
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Contents of the Social Documentation section of  the patient's History activity.
     */
    HX_SOCIAL_DOC: string;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * Contain if the patient's notes are converted for UCN.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_UCN_CONVERT {
    /**
     * The contact serial number (CSN) for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * A unique contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Contains the IDs of the notes linked to this patient encounter.
     */
    LINKED_UCN_NOTES_ID: string;
    /**
     * Reference to HNO_INFO based on LINKED_UCN_NOTES_ID
     */
    linked_ucn_notes?: HNO_INFO;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * Stores the performing organization information.
 * pk: ORDER_ID, LINE
 */
export interface PERFORMING_ORG_INFO {
    /**
     * The unique identifier for the order record.
     */
    ORDER_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The name of the performing organization
     */
    PERFORMING_ORG_NAME: string;
    /**
     * The name of the medical director of the performing organization.
     */
    PERFORMING_ORG_DIRECTOR: string;
    /**
     * The city where the performing organization is located.
     */
    PERFORMING_ORG_CITY: string;
    /**
     * The state where the performing organization is located.
     */
    PERFORMING_ORG_STATE_C_NAME: string;
    /**
     * The zip code of the performing organization.
     */
    PERFORMING_ORG_ZIP_CODE: string;
    /**
     * Phone number of the performing organization.
     */
    PERFORMING_ORG_PHONE_NUM: string;
    /**
     * The Clinical Laboratory Improvement Amendment (CLIA) number of the performing organization
     */
    PERFORMING_ORG_CLIA_NUM: string;
    /**
     * This item represents the format in which the performing organization medical director name is stored.
     */
    PERFORMING_ORG_FORMAT_C_NAME: string;
    /**
     * Reference to parent ORDER_PROC
     */
    order_proc?: ORDER_PROC;
}

/**
 * This table contains items related to Person Preferences
 * pk: PERSON_PREFERENCE_ID
 */
export interface PERSON_PREFERENCES {
    /**
     * The unique identifier (.1 item) for the subject name record.
     */
    PERSON_PREFERENCE_ID: number;
    /**
     * Reference to COMM_PREF_ADDL_ITEMS based on PERSON_PREFERENCE_ID
     */
    person_preference?: COMM_PREF_ADDL_ITEMS;
    /**
     * Collection of COMMUNICATION_PREFERENCES as children
     */
    communication_preferences?: COMMUNICATION_PREFERENCES[];
}

/**
 * The PL_SYSTEMS table contains body system data from patients' problem lists in the clinical system.
 * pk: PROBLEM_LIST_ID
 */
export interface PL_SYSTEMS {
    /**
     * The unique identifier for the problem record.
     */
    PROBLEM_LIST_ID: number;
    /**
     * Reference to PROBLEM_LIST_ALL based on PROBLEM_LIST_ID
     */
    problem_list?: PROBLEM_LIST_ALL;
    /**
     * This item is a link to the System category associated with the Problem List System record.
     */
    PROB_LIST_SYSTEM_C_NAME: string;
}

/**
 * The PMT_EOB_INFO_II table contains the Explanation of Benefits information given a transaction ID
 * pk: TX_ID, LINE
 */
export interface PMT_EOB_INFO_II {
    /**
     * The transaction ID.
     */
    TX_ID: number;
    /**
     * The line number of one EOB code which is different from EOB line number in PMT_EOB_INFO_I.
     */
    LINE: number;
    /**
     * The Explanation of Benefits amount for a transaction.
     */
    AMOUNT: number;
    /**
     * The EOB Code for this transaction.
     */
    EOB_CODES: string;
    /**
     * The write-off adjustment code associated with the remittance code.
     */
    ADJ_PROC_ID: number;
    /**
     * The action category ID for the payment Explanation of Benefits (EOB)�action in this table
     */
    ACTIONS: string;
    /**
     * The comment put into the systems for this transaction.
     */
    SYSTEM_COMMENT: string;
    /**
     * The winning remittance code ID from the remittance code.
     */
    WINNINGRMC_ID: string;
    /**
     * Reference to CLARITY_RMC based on WINNINGRMC_ID
     */
    winningrmc?: CLARITY_RMC;
    /**
     * The name of each remittance code.
     */
    WINNINGRMC_ID_REMIT_CODE_NAME: string;
    /**
     * The date when the charge was matched to the payment.
     */
    TX_MATCH_DATE: Date;
    /**
     * The remittance code specified by the payer in its Explanation of Benefits (EOB)
     */
    PEOB_EOB_RMC_IDS: string;
    /**
     * The not allowed amount associated with the Remittance Codes that the payor specifies in its Explanation of Benefit (EOB).
     */
    PEOB_EOB_AMOUNT: number;
    /**
     * The Explanation Of Benefits group code category ID for the transaction�from insurance payment posting.
     */
    PEOB_EOB_GRPCODE_C_NAME: string;
    /**
     * Reference to parent ARPB_TRANSACTIONS
     */
    arpb_transactions?: ARPB_TRANSACTIONS;
}

/**
 * The PMT_EOB_INFO_I table contains the Explanation of Benefits information given a transaction ID
 * pk: TX_ID, LINE
 */
export interface PMT_EOB_INFO_I {
    /**
     * The unique identifier associated with the transaction for this row.
     */
    TX_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The covered amount for that transaction.
     */
    CVD_AMT: number;
    /**
     * The non-covered amount for that transaction.
     */
    NONCVD_AMT: number;
    /**
     * The deducted amount for that transaction.
     */
    DED_AMT: number;
    /**
     * The coinsurance amount for that transaction.
     */
    COINS_AMT: number;
    /**
     * The paid amount for that transaction.
     */
    PAID_AMT: number;
    /**
     * The internal control number for that transaction.
     */
    ICN: string;
    /**
     * The denial code for the transaction.
     */
    DENIAL_CODES: string;
    /**
     * The Explanation Of Benefits action category ID for�the transaction.
     */
    PEOB_ACTION_NAME_C_NAME: string;
    /**
     * The action amount for this transaction.
     */
    ACTION_AMT: number;
    /**
     * The Account Id of the transfer to self-pay action or next responsible party to self-pay action performed in insurance payment posting.
     */
    ACCOUNT_ID: number;
    /**
     * The action assignment category ID for the transaction.
     */
    ACTION_ASN_NAME_C_NAME: string;
    /**
     * The comments associated the Explanation of Benefits for a transaction.
     */
    COMMENTS: string;
    /**
     * The info lines in PMT_EOB_INFO_II.
     */
    INFO_LINES: string;
    /**
     * The Explanation of Benefits code for actions (next responsible party or resubmit) in payment posting associated with the transaction.
     */
    ACTION_EOB: string;
    /**
     * The invoice number for the transaction.
     */
    INVOICE_NUM: string;
    /**
     * The date when the charge was matched to the payment.
     */
    TX_MATCH_DATE: Date;
    /**
     * Indicates whether the system determines this payment transaction as a non-primary payment at the time of payment posting based on crossover information, invoice information, and previous payments information.�Y indicates the system determines this payment transaction as a non-primary payment at the time of payment posting based on crossover information, invoice information, and previous payments information.�A null value indicates the system does not determine this payment transaction as a non-primary payment at the time of payment posting based on crossover information, invoice information, and previous payments information.
     */
    NON_PRIMARY_SYS_YN: string;
    /**
     * Indicates whether the user determines this payment transaction as a non-primary payment at the time of payment posting
     */
    NON_PRIMARY_USR_YN: string;
    /**
     * Indicates the Next Responsible Party, Resubmit Insurance or Transfer to Self-Pay action taken on the charge.
     */
    PEOB_ACTION_C_NAME: string;
    /**
     * Invoice ID that is associated with one payment Explanation  of Benefits line
     */
    INV_ID: number;
    /**
     * Reference to INVOICE based on INV_ID
     */
    inv?: INVOICE;
    /**
     * Line count of one invoice record for internal calculation use
     */
    INV_LINE: number;
    /**
     * This column is set to Y when all charges associated with this EOB line have been unmatched from the payment.
     */
    NO_MATCHED_CHGS_YN: string;
    /**
     * The ID of the guarantor on the invoice associated with the payment
     */
    PEOB_ACCOUNT_ID: number;
    /**
     * Reference to ACCOUNT based on PEOB_ACCOUNT_ID
     */
    peob_account?: ACCOUNT;
    /**
     * The ID of the revenue location on the invoice associated with the payment
     */
    PEOB_LOC_ID: number;
    /**
     * Reference to CLARITY_LOC based on PEOB_LOC_ID
     */
    peob_loc?: CLARITY_LOC;
    /**
     * The ID of the Place of Service on the invoice associated with the payment
     */
    PEOB_POS_ID: number;
    /**
     * Reference to CLARITY_LOC based on PEOB_POS_ID
     */
    peob_pos?: CLARITY_LOC;
    /**
     * The ID of the department on the invoice associated with the payment
     */
    PEOB_DEPT_ID: number;
    /**
     * Reference to CLARITY_DEP based on PEOB_DEPT_ID
     */
    peob_dept?: CLARITY_DEP;
    /**
     * The ID of the billing provider on the invoice associated with the payment
     */
    PEOB_BILL_PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on PEOB_BILL_PROV_ID
     */
    peob_bill_prov?: CLARITY_SER;
    /**
     * The ID of the benefit plan on the invoice associated with the payment
     */
    PEOB_PLAN_ID: number;
    /**
     * Reference to CLARITY_EPP based on PEOB_PLAN_ID
     */
    peob_plan?: CLARITY_EPP;
    /**
     * The ID of the procedure on the invoice associated with the payment
     */
    PEOB_PROC_ID: number;
    /**
     * Reference to CLARITY_EAP based on PEOB_PROC_ID
     */
    peob_proc?: CLARITY_EAP;
    /**
     * The ID of the first matching charge transaction on the invoice associated with the payment
     */
    PEOB_MTCH_CHG_TX_ID: number;
    /**
     * Reference to ARPB_TRANSACTIONS based on PEOB_MTCH_CHG_TX_ID
     */
    peob_mtch_chg_tx?: ARPB_TRANSACTIONS;
    /**
     * Reference to parent ARPB_TRANSACTIONS
     */
    arpb_transactions?: ARPB_TRANSACTIONS;
}

/**
 * This table contains the prescription ID of an order that is populated by an interface.
 * pk: ORDER_ID, LINE
 */
export interface PRESC_ID {
    /**
     * The unique ID for the Order record for the prescription.
     */
    ORDER_ID: number;
    /**
     * Reference to ORDER_MED based on ORDER_ID
     */
    order?: ORDER_MED;
    /**
     * The line number for the prescription ID
     */
    LINE: number;
    /**
     * The prescription ID of the order populated by an interface.
     */
    PRESC_ID: string;
}

/**
 * This is a generic table that contains every Problem List (LPL) record regardless of its type
 * pk: PROBLEM_LIST_ID
 */
export interface PROBLEM_LIST_ALL {
    /**
     * The unique identifier for the problem record.
     */
    PROBLEM_LIST_ID: number;
    /**
     * The unique ID of the patient record associated with this problem list.
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * Indicates the type of information stored in this record, such as Problem List, Allergy, Immunization, etc.
     */
    RECORD_TYPE_C_NAME: string;
    /**
     * Collection of PROB_UPDATES as children
     */
    prob_updates?: PROB_UPDATES[];
}

/**
 * This table contains data relating to the history of problems from patients' problem lists in the clinical system.
 * pk: PROBLEM_LIST_ID, LINE
 */
export interface PROBLEM_LIST_HX {
    /**
     * The unique ID of this Problem List entry.
     */
    PROBLEM_LIST_ID: number;
    /**
     * Used to identify the particular problem within the historical problems
     */
    LINE: number;
    /**
     * ID of the diagnosis associated with this historical problem
     */
    HX_PROBLEM_ID: number;
    /**
     * Reference to CLARITY_EDG based on HX_PROBLEM_ID
     */
    hx_problem?: CLARITY_EDG;
    /**
     * Represents the historical value of the first possible date that a problem could have been noted/onset on
     */
    HX_DATE_NOTED: Date;
    /**
     * The date that the problem was added to or updated on the patient's Problem List in calendar format.
     */
    HX_DATE_OF_ENTRY: Date;
    /**
     * The ID of the user who edited this problem on the patient's Problem List
     */
    HX_ENTRY_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on HX_ENTRY_USER_ID
     */
    hx_entry_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    HX_ENTRY_USER_ID_NAME: string;
    /**
     * Indicates this problem was visible on web based chart system when this historical action was recorded.
     */
    HX_MYCHART_YN: string;
    /**
     * This column indicates whether or not this problem was flagged as chronic as of this historical event.
     */
    HX_CHRONIC_YN: string;
    /**
     * This column indicates whether or not this problem was flagged as the principal problem as of this historical event.
     */
    HX_PRINCIPAL_YN: string;
    /**
     * This column indicates whether or not this problem was flagged as a hospital problem as of this historical event.
     */
    HX_IS_HOSP_YN: string;
    /**
     * Contact Serial Number (CSN) of the patient encounter where this historical problem list was documented.
     */
    HX_PROBLEM_EPT_CSN: number;
    /**
     * The category value associated with the problem's state: Active, Resolved, or Deleted as of this historical event.
     */
    HX_STATUS_C_NAME: string;
    /**
     * The date and time when the problem was updated on the patient's problem list.
     */
    HX_ENTRY_INST: Date;
    /**
     * Represents the historical value of the last possible date that a problem could have been noted/onset on
     */
    HX_NOTED_END_DATE: Date;
    /**
     * Reference to parent PROBLEM_LIST
     */
    problem_list?: PROBLEM_LIST;
}

/**
 * The PROBLEM_LIST table contains data from patients' problem lists in the clinical system
 * pk: PROBLEM_LIST_ID
 */
export interface PROBLEM_LIST {
    /**
     * The unique ID of this Problem List entry.
     */
    PROBLEM_LIST_ID: number;
    /**
     * Reference to PROBLEM_LIST_ALL based on PROBLEM_LIST_ID
     */
    problem_list?: PROBLEM_LIST_ALL;
    /**
     * The unique ID of the diagnosis record associated with the entry in the patient�s Problem List
     */
    DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on DX_ID
     */
    dx?: CLARITY_EDG;
    /**
     * Represents the first possible date that a problem could have been noted/onset on
     */
    NOTED_DATE: Date;
    /**
     * This is the date the specific problem was last edited (i.e., a change was made, either in status, priority, etc.).
     */
    DATE_OF_ENTRY: Date;
    /**
     * The unique ID of the system user who last edited the problem in the patient�s Problem List
     */
    ENTRY_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on ENTRY_USER_ID
     */
    entry_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ENTRY_USER_ID_NAME: string;
    /**
     * This column indicates whether or not this problem is flagged as chronic.
     */
    CHRONIC_YN: string;
    /**
     * Indicates whether this problem will be displayed in Epic's Patient Portal, MyChart.
     */
    SHOW_IN_MYC_YN: string;
    /**
     * The category value associated with the problem�s current state: Active, Resolved, or Deleted
     */
    PROBLEM_STATUS_C_NAME: string;
    /**
     * Represents the last possible date that a problem could have been noted/onset on
     */
    NOTED_END_DATE: Date;
    /**
     * Collection of PROBLEM_LIST_HX as children
     */
    problem_list_hx?: PROBLEM_LIST_HX[];
}

/**
 * This table contains all the historical entries (dates/times/users/related contacts) for when the patient's problem list was marked as reviewed.
 * pk: PAT_ID, LINE
 */
export interface PROB_LIST_REV_HX {
    /**
     * The unique ID assigned to the patient record
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * All the historical dates the patient's problem list was reviewed
     */
    PROB_LIST_REV_HX_DT: Date;
    /**
     * All the historical times the patient's problem list was reviewed
     */
    PROB_LIST_REV_HX_TM: Date;
    /**
     * All the users that have reviewed the patient's Problem List.
     */
    PRBLST_REVUSRHX_ID: string;
    /**
     * Reference to CLARITY_EMP based on PRBLST_REVUSRHX_ID
     */
    prblst_revusrhx?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    PRBLST_REVUSRHX_ID_NAME: string;
    /**
     * The unique contact serial number for the patient encounter in which the problem list was reviewed within an encounter context
     */
    PROB_LIST_REV_CSNHX: number;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table includes over-time single-response items from the Problem List (LPL) master file, such as the contact serial number (CSN), contact time, and contact user.
 * pk: PROBLEM_LIST_ID, CONTACT_DATE_REAL
 */
export interface PROB_UPDATES {
    /**
     * The unique identifier for the problem record.
     */
    PROBLEM_LIST_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The date and time of this contact.
     */
    CONTACT_DATE: Date;
    /**
     * The contact serial number (CSN) of the contact, which is a unique contact identifier.
     */
    CONTACT_SERIAL_NUM: number;
    /**
     * The user ID of the user who made the change.
     */
    EDIT_USER_ID: string;
    /**
     * The name of the user record
     */
    EDIT_USER_ID_NAME: string;
    /**
     * Reference to parent PROBLEM_LIST_ALL
     */
    problem_list_all?: PROBLEM_LIST_ALL;
}

/**
 * This table stores information about the most recent patient questionnaire submission
 * pk: PAT_ID, LINE
 */
export interface QUESR_LST_ANS_INFO {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This column stores recently answered questionnaire IDs
     */
    QUESR_ANS_FORM_ID: string;
    /**
     * Reference to CL_QFORM1 based on QUESR_ANS_FORM_ID
     */
    quesr_ans_form?: CL_QFORM1;
    /**
     * The name of the form associated with the questionnaire.
     */
    QUESR_ANS_FORM_ID_FORM_NAME: string;
    /**
     * This column stores the encounter contact serial number (CSN) for the most recent questionnaire submissions
     */
    QUESR_ANS_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on QUESR_ANS_CSN_ID
     */
    quesr_ans_csn?: PAT_ENC;
    /**
     * This column stores the last instant of submission for questionnaires
     */
    QUESR_ANS_DATETIME: Date;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * The QUESR_TEMP_ANSWERS table stores information about patient questionnaire answers which have not been submitted
 * pk: PAT_ID, LINE
 */
export interface QUESR_TEMP_ANSWERS {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The unique ID of the answer set for this row.
     */
    QUESR_TMP_ANSWER_ID: string;
    /**
     * Reference to CL_QANSWER based on QUESR_TMP_ANSWER_ID
     */
    quesr_tmp_answer?: CL_QANSWER;
    /**
     * The unique ID of the patient account for this row.
     */
    QUESR_TMP_MYPT_ID: string;
    /**
     * Reference to MYC_PATIENT based on QUESR_TMP_MYPT_ID
     */
    quesr_tmp_mypt?: MYC_PATIENT;
    /**
     * Stores the root questionnaire (LQF) record ID for each questionnaire that has not yet been submitted.
     */
    QUESR_TMP_ROOT_ID: string;
    /**
     * Reference to CL_QFORM1 based on QUESR_TMP_ROOT_ID
     */
    quesr_tmp_root?: CL_QFORM1;
    /**
     * The name of the form associated with the questionnaire.
     */
    QUESR_TMP_ROOT_ID_FORM_NAME: string;
    /**
     * If the TEMP_QUESR_SRC_WRKFLW_C is a value of 1, this stores the contact serial number of the patient contact that serves as the appointment context for this temporary questionnaire answer.
     */
    CTX_PAT_ENC_CSN_ID: number;
    /**
     * Reference to parent PATIENT
     */
    patient?: PATIENT;
}

/**
 * This table contains claim-level status code information for claims reconciliation.
 * pk: CLAIM_RECON_ID, CONTACT_DATE_REAL, LINE
 */
export interface RECONCILE_CLAIM_STATUS {
    /**
     * The unique identifier for the claim reconciliation record.
     */
    CLAIM_RECON_ID: string;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Claim level status code received in a reconciliation file if value matches codes in the current claim status code category.
     */
    CLM_STAT_CODE_C_NAME: string;
    /**
     * Claim level category code received in a reconciliation file if value matches codes in the claim status category code category.
     */
    CLM_CAT_CODE_C_NAME: string;
    /**
     * Mapped action for the status code.
     */
    CLM_MAPPED_ACT_C_NAME: string;
    /**
     * Claim level action code received in a reconciliation file if value matches codes in the claim action category.
     */
    CLM_ACT_CODE_C_NAME: string;
    /**
     * Claim level status message received in a reconciliation file.
     */
    CLM_STATUS_MSG: string;
    /**
     * Reference to parent RECONCILE_CLM
     */
    reconcile_clm?: RECONCILE_CLM;
}

/**
 * This table contains over time single information for claim reconciliation records.
 * pk: CLAIM_REC_ID, CONTACT_DATE_REAL
 */
export interface RECONCILE_CLM_OT {
    /**
     * The unique ID of the claim reconciliation record.
     */
    CLAIM_REC_ID: string;
    /**
     * The contact date of the claim, in external format.
     */
    CONTACT_DATE: Date;
    /**
     * The contact date of the claim, in internal format.
     */
    CONTACT_DATE_REAL: number;
    /**
     * The amount submitted by the payer on this claim.
     */
    PAYR_CLM_AMT_SUBMT: number;
    /**
     * The payer name of the payer on the claim.
     */
    PAYOR_NAME: string;
    /**
     * This is the claim's clearinghouse reference number.
     */
    CH_REF_NUM: string;
    /**
     * This is the claim's clearinghouse name.
     */
    CH_NAME: string;
    /**
     * The status date of the claim.
     */
    STATUS_DATE: Date;
    /**
     * This is the filename associated with this claim.
     */
    FILE_NAME: string;
    /**
     * The category value for the reason the claim was closed
     */
    CLM_CLOSED_REASON_C_NAME: string;
    /**
     * Stores the date that the claim was sent out of the clearinghouse.
     */
    CH_SENT_DATE: Date;
    /**
     * Stores the date that the payer received the claim.
     */
    PAYOR_RECV_DATE: Date;
    /**
     * Stores the action that was selected to be performed on the invoice.
     */
    CLAIM_SEL_ACT_C_NAME: string;
    /**
     * Will store the action that was performed on the invoice.
     */
    PERFORM_ACT_C_NAME: string;
    /**
     * Stores the reason for the action that was performed on the invoice.
     */
    PERFORM_ACT_RSN: string;
    /**
     * Stores the group control number (GS-06) value for an American National Standards Institute (ANSI) electronic claim file.
     */
    GROUP_CONTROL_NUM: number;
    /**
     * The claim actions supported by the interface profile at the time a claim status update is received from an external entity.
     */
    SUPPORTED_ACTIONS_C_NAME: string;
    /**
     * Reference to parent RECONCILE_CLM
     */
    reconcile_clm?: RECONCILE_CLM;
}

/**
 * This table contains basic information for claim reconciliation records.
 * pk: CLAIM_REC_ID
 */
export interface RECONCILE_CLM {
    /**
     * The unique ID of the claim reconciliation record.
     */
    CLAIM_REC_ID: string;
    /**
     * The invoice number of the claim.
     */
    CLAIM_INVOICE_NUM: string;
    /**
     * This is the system status of the claim: opened or closed.
     */
    CUR_EPIC_STATUS_C_NAME: string;
    /**
     * This is the payer ID for the payer on the claim.
     */
    PAYOR_ID: number;
    /**
     * Reference to CLARITY_EPM based on PAYOR_ID
     */
    payor?: CLARITY_EPM;
    /**
     * This is the benefit plan ID for the benefit plan on the claim.
     */
    BENEFIT_PLAN_ID: number;
    /**
     * Reference to CLARITY_EPP based on BENEFIT_PLAN_ID
     */
    benefit_plan?: CLARITY_EPP;
    /**
     * This is the location ID for the location of the claim.
     */
    LOC_ID: number;
    /**
     * Reference to CLARITY_LOC based on LOC_ID
     */
    loc?: CLARITY_LOC;
    /**
     * This is the department ID for the department of the claim.
     */
    DEPARTMENT_ID: number;
    /**
     * The hospital liability bucket ID for the claim
     */
    BUCKET_ID: number;
    /**
     * The hospital account ID for the claim
     */
    HSP_ACCOUNT_ID: number;
    /**
     * This column stores the service area ID from the claim that created the reconciliation record.
     */
    SERVICE_AREA_ID: number;
    /**
     * Reference to CLARITY_SA based on SERVICE_AREA_ID
     */
    service_area?: CLARITY_SA;
    /**
     * This column stores the status of the claim that created the reconciliation record
     */
    EPIC_CLM_STS_C_NAME: string;
    /**
     * This column stores the claim run ID for the reconciliation record
     */
    CLAIM_RUN_ID: string;
    /**
     * This column stores the billed amount for the reconciliation record.
     */
    TOTAL_BILLED: number;
    /**
     * This column indicates whether at least one external status update has been received for the reconciliation record.
     */
    EXT_STS_RCV_YN: string;
    /**
     * Indicates whether the associated claim is a crossover claim.
     */
    CROSSOVER_CLAIM_YN: string;
    /**
     * This item indicates whether the record is Interchange Control Header (ISA), Transaction Set Header (ST), or Claim data.
     */
    RECORD_TYPE_C_NAME: string;
    /**
     * This item indicates whether at least one external status update has been received on or after either four days post claim acceptance or the predicted payment response date if earlier
     */
    POST_ACK_STATUS_YN: string;
    /**
     * This item holds the contact date the CRD was marked closed.
     */
    CLAIM_CLOSED_DATE: Date;
    /**
     * Collection of RECONCILE_CLAIM_STATUS as children
     */
    reconcile_claim_status?: RECONCILE_CLAIM_STATUS[];
    /**
     * Collection of RECONCILE_CLM_OT as children
     */
    reconcile_clm_ot?: RECONCILE_CLM_OT[];
}

/**
 * This table contains information about referral appointments.
 * pk: REFERRAL_ID, LINE_COUNT
 */
export interface REFERRAL_APT {
    /**
     * The referral ID for the referral record.
     */
    REFERRAL_ID: number;
    /**
     * A line number that is used to group information about contacts that have counted towards the referral.
     */
    LINE_COUNT: number;
    /**
     * The date of the service (date of the appointment, claim, charge, or admission date) that is associated with the referral
     */
    SERVICE_DATE: Date;
    /**
     * The type of service that has been counted as a contact toward the total of completed contacts for this referral.
     */
    SERVICE_TYPE_C_NAME: string;
    /**
     * The ID number of the contact, if the source is either "Visit" or "Admission"
     */
    SERIAL_NUMBER: number;
    /**
     * The number of completed contacts that have been counted for this source.
     */
    TABLE_COUNT: number;
    /**
     * Reference to parent REFERRAL
     */
    referral?: REFERRAL;
}

/**
 * This table contains cross-organization referral information.
 * pk: REFERRAL_ID, LINE
 */
export interface REFERRAL_CROSS_ORG {
    /**
     * The unique identifier (.1 item) for the referral record.
     */
    REFERRAL_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Track the status of a cross-organization referral.
     */
    CROSS_ORG_RFL_STATUS_C_NAME: string;
    /**
     * Store the organization for a cross-organization referral.
     */
    CROSS_ORG_RFL_ORGANIZATION_ID: number;
    /**
     * Reference to ORG_DETAILS based on CROSS_ORG_RFL_ORGANIZATION_ID
     */
    cross_org_rfl_organization?: ORG_DETAILS;
    /**
     * Organization's external name used as the display name on forms and user interfaces.
     */
    CROSS_ORG_RFL_ORGANIZATION_ID_EXTERNAL_NAME: string;
    /**
     * Store the unique ID of a cross-organization referral.
     */
    CROSS_ORG_RFL_UNIQUE_IDENT: string;
    /**
     * Store the assigning authority OID of a cross-organization referral.
     */
    CROSS_ORG_RFL_ASGN_AUTH_OID: string;
    /**
     * Instant the cross-organization status was last updated.
     */
    CROSS_ORG_RFL_INST_UPDATE_DTTM: Date;
    /**
     * Reference to parent REFERRAL
     */
    referral?: REFERRAL;
}

/**
 * The REFERRAL_CVG_AUTH contains coverage auth/cert information for referrals.
 * pk: REFERRAL_ID, LINE
 */
export interface REFERRAL_CVG_AUTH {
    /**
     * The referral ID for the referral record.
     */
    REFERRAL_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * Coverage ID for Auth/Cert information
     */
    AUTH_CERT_CVG_ID: number;
    /**
     * Reference to COVERAGE based on AUTH_CERT_CVG_ID
     */
    auth_cert_cvg?: COVERAGE;
    /**
     * The unique ID of the note containing pre-certification comments entered on the referral.
     */
    PRECERT_CMT_NOTE_ID: string;
    /**
     * Reference to HNO_INFO based on PRECERT_CMT_NOTE_ID
     */
    precert_cmt_note?: HNO_INFO;
    /**
     * The unique ID of the note containing benefits information entered on the referral.
     */
    PRECERT_BEN_NOTE_ID: string;
    /**
     * Reference to parent REFERRAL
     */
    referral?: REFERRAL;
}

/**
 * The REFERRAL_DX table contains diagnosis information stored with referrals.
 * pk: REFERRAL_ID, LINE
 */
export interface REFERRAL_DX {
    /**
     * The referral ID for the referral record.
     */
    REFERRAL_ID: number;
    /**
     * The line number of the diagnosis associated with the referral
     */
    LINE: number;
    /**
     * The ID number of the diagnosis associated with the referral
     */
    DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on DX_ID
     */
    dx?: CLARITY_EDG;
    /**
     * Reference to parent REFERRAL
     */
    referral?: REFERRAL;
}

/**
 * The REFERRAL_HIST table contains information on changes to referrals stored in system.
 * pk: REFERRAL_ID, LINE
 */
export interface REFERRAL_HIST {
    /**
     * The referral ID for the referral record.
     */
    REFERRAL_ID: number;
    /**
     * The line number of the change to the referral
     */
    LINE: number;
    /**
     * The date of the change to the referral.
     */
    CHANGE_DATE: Date;
    /**
     * The category value indicating the type of referral change.
     */
    CHANGE_TYPE_C_NAME: string;
    /**
     * The ID number of the user who made the change to the referral.
     */
    CHANGE_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on CHANGE_USER_ID
     */
    change_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    CHANGE_USER_ID_NAME: string;
    /**
     * Some of the information on the referral is tracked when it changes
     */
    PREVIOUS_VALUE: string;
    /**
     * The date and time of the change to the referral.
     */
    CHANGE_DATETIME: Date;
    /**
     * The event no of the authorization history
     */
    AUTH_HX_EVENT_NO: string;
    /**
     * Referral audit trail item to store note Id
     */
    AUTH_HX_NOTE_ID: string;
    /**
     * The authorization date and time as an instant in the local time zone
     */
    CHANGE_LOCAL_DTTM: Date;
    /**
     * If the item being changed is Referral Status (I RFL 50), this item stores the new value for that item.
     */
    NEW_RFL_STATUS_C_NAME: string;
    /**
     * If the item being changed is Reason Pending (I RFL 18003), this item stores the new value for that item.
     */
    NEW_PEND_RSN_C_NAME: string;
    /**
     * Reference to parent REFERRAL
     */
    referral?: REFERRAL;
}

/**
 * Notes attached to the referral record.
 * pk: REFERRAL_ID, LINE
 */
export interface REFERRAL_NOTES {
    /**
     * The unique identifier for the referral record.
     */
    REFERRAL_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The unique identifier for the note record.
     */
    NOTE_ID: string;
    /**
     * Reference to HNO_INFO based on NOTE_ID
     */
    note?: HNO_INFO;
    /**
     * User who created the note.
     */
    NOTE_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on NOTE_USER_ID
     */
    note_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    NOTE_USER_ID_NAME: string;
    /**
     * The instant of creation of the note.
     */
    NOTE_DATETIME: Date;
    /**
     * Reference to parent REFERRAL
     */
    referral?: REFERRAL;
}

/**
 * Contains the reasons for each referral.
 * pk: REFERRAL_ID, LINE
 */
export interface REFERRAL_REASONS {
    /**
     * The unique ID of the referral.
     */
    REFERRAL_ID: number;
    /**
     * The line number of the referral reason.
     */
    LINE: number;
    /**
     * The reason category value.
     */
    REFERRAL_REASON_C_NAME: string;
    /**
     * Reference to parent REFERRAL
     */
    referral?: REFERRAL;
}

/**
 * The REFERRAL_SOURCE table contains information about referral sources
 * pk: REFERRING_PROV_ID
 */
export interface REFERRAL_SOURCE {
    /**
     * The referral ID for the referral record.
     */
    REFERRING_PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on REFERRING_PROV_ID
     */
    referring_prov?: CLARITY_SER;
    /**
     * The name of the referral source.
     */
    REFERRING_PROV_NAM: string;
}

/**
 * All values associated with a claim are stored in the Claim External Value record
 * pk: RECORD_ID, LINE
 */
export interface REL_CAUSE_CD {
    /**
     * The unique identifier for the claim record.
     */
    RECORD_ID: number;
    /**
     * Reference to CLM_VALUES based on RECORD_ID
     */
    record?: CLM_VALUES;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * This item holds the codes to identify if the claim is related to employment or to an accident.
     */
    REL_CAUSE_CD: string;
}

/**
 * The REPORT_SETTINGS table contains information about your HST settings.
 * pk: SETTING_ID
 */
export interface REPORT_SETTINGS {
    /**
     * The unique identifier (.1 item) for the setting record.
     */
    SETTING_ID: number;
    /**
     * Setting record name.
     */
    SETTING_NAME: string;
}

/**
 * This table contains the list of results that were followed up during this particular encounter, such as a telephone encounter.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface RESULT_FOLLOW_UP {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The unique identifier of the result (ORD) that was followed up on during this encounter.
     */
    RESULT_ID: number;
    /**
     * Reference to ORDER_PROC based on RESULT_ID
     */
    result?: ORDER_PROC;
}

/**
 * This table holds the list of geographical areas for referred to geographical steering in Referral and Order Entry
 * pk: REFERRAL_ID, LINE
 */
export interface RFL_REF_TO_REGIONS {
    /**
     * The unique ID of the referral.
     */
    REFERRAL_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The unique ID of the geographical area record that was used for referred to geographical steering for this referral
     */
    REF_TO_AREAS_ID: number;
    /**
     * Reference to CLARITY_NRG based on REF_TO_AREAS_ID
     */
    ref_to_areas?: CLARITY_NRG;
    /**
     * Reference to parent REFERRAL
     */
    referral?: REFERRAL;
}

/**
 * This table contains the physicians/radiologists that signed off on an imaging order and dates/times that the study was signed.
 * pk: ORDER_PROC_ID, LINE
 */
export interface RIS_SGND_INFO {
    /**
     * The unique ID of the procedure order record.
     */
    ORDER_PROC_ID: number;
    /**
     * Reference to ORDER_PROC based on ORDER_PROC_ID
     */
    order_proc?: ORDER_PROC;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The unique ID of the provider record indicated as the signing physician of an imaging study.
     */
    SIGNED_PROV_ID: string;
    /**
     * Reference to REFERRAL_SOURCE based on SIGNED_PROV_ID
     */
    signed_prov?: REFERRAL_SOURCE;
    /**
     * The date and time that an imaging order is signed by a physician/radiologist, and is stored in the Universal Time Coordinated (UTC) format.
     */
    SIGNED_UTC_DTTM: Date;
}

/**
 * This table contains the National Drug Code (NDC) information.
 * pk: NDC_ID
 */
export interface RX_NDC {
    /**
     * The unique ID for the NDC (National Drug Code)
     */
    NDC_ID: string;
    /**
     * The external code for the National Drug Code (NDC)
     */
    NDC_CODE: string;
}

/**
 * This table contains pharmacy information
 * pk: PHARMACY_ID
 */
export interface RX_PHR {
    /**
     * The unique ID for this pharmacy.
     */
    PHARMACY_ID: number;
    /**
     * The name of the pharmacy.
     */
    PHARMACY_NAME: string;
}

/**
 * This table stores basic info about Social Determinant entries
 * pk: SDOH_DATA_ID, CONTACT_DATE_REAL, LINE
 */
export interface SDD_ENTRIES {
    /**
     * The unique identifier (.1 item) for the social determinant data record.
     */
    SDOH_DATA_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Stores the source SDC that this entry contains data for.
     */
    ENTRY_DOM_CONFIG_ID: number;
    /**
     * Reference to SDOH_DOM_CONFIG_INFO based on ENTRY_DOM_CONFIG_ID
     */
    entry_dom_config?: SDOH_DOM_CONFIG_INFO;
    /**
     * Stores the instant at which an entry in SDD was considered active.
     */
    ENTRY_EFFECTIVE_UTC_DTTM: Date;
    /**
     * Stores the level of concern for this entry on a scale of low, medium, or high (or unknown).
     */
    ENTRY_CONCERN_LVL_C_NAME: string;
}

/**
 * This table stores the social determinant domain configuration display information for domains configured for use in social determinants of health workflows.
 * pk: DOM_CONFIG_ID
 */
export interface SDOH_DOM_CONFIG_INFO {
    /**
     * The unique identifier (.1 item) for the domain configuration record.
     */
    DOM_CONFIG_ID: number;
    /**
     * The name of the social determinant domain configuration record.
     */
    RECORD_NAME: string;
    /**
     * The display name of the social determinant domain configuration record.
     */
    DISPLAY_NAME: string;
}

/**
 * The SERVICE_BENEFITS table contains service-level benefit information about the coverages for the encounter or estimate to which this benefit record is attached.
 * pk: RECORD_ID, LINE
 */
export interface SERVICE_BENEFITS {
    /**
     * The unique identifier for the benefit record.
     */
    RECORD_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * This related group contains benefit information specific to a coverage and service type.
     */
    CVG_FOR_SVC_TYPE_ID: number;
    /**
     * Reference to COVERAGE based on CVG_FOR_SVC_TYPE_ID
     */
    cvg_for_svc_type?: COVERAGE;
    /**
     * The service type for which the listed insurance benefits apply.
     */
    CVG_SVC_TYPE_ID: string;
    /**
     * Reference to BENEFIT_SVC_TYPE based on CVG_SVC_TYPE_ID
     */
    cvg_svc_type?: BENEFIT_SVC_TYPE;
    /**
     * The name of this benefit service type.
     */
    CVG_SVC_TYPE_ID_SERVICE_TYPE_NAME: string;
    /**
     * The copay for this coverage and service type.
     */
    COPAY_AMOUNT: number;
    /**
     * Deductible for this coverage and service type.
     */
    DEDUCTIBLE_AMOUNT: number;
    /**
     * The coinsurance percentage for this coverage and service type.
     */
    COINS_PERCENT: number;
    /**
     * Family tier for this line's coverage and service type.
     */
    FAMILY_TIER_SVC_C_NAME: string;
    /**
     * Network level of this line's coverage and service type.
     */
    NET_LVL_SVC_C_NAME: string;
    /**
     * Stores the last copay value filed by RTE at the service level
     */
    RTE_COPAY_AMOUNT: number;
    /**
     * Stores the last deductible amount filed by RTE at the service level
     */
    RTE_DEDUCT_AMOUNT: number;
    /**
     * Stores the last coinsurance percent filed by RTE at the service level
     */
    RTE_COINS_PERCENT: number;
    /**
     * Reference to parent BENEFITS
     */
    benefits?: BENEFITS;
}

/**
 * This table contains information relating to SmartText records
 * pk: SMARTTEXT_ID
 */
export interface SMARTTEXT {
    /**
     * The ID of the SmartText record.
     */
    SMARTTEXT_ID: string;
    /**
     * The name of the SmartText record.
     */
    SMARTTEXT_NAME: string;
}

/**
 * This table contains data recorded in the activities of daily living section of social history contacts entered in the patient's chart during a clinical system encounter
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface SOCIAL_ADL_HX {
    /**
     * A unique serial number for this encounter
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * Stores the link to the unique ID of the ADL question.
     */
    HX_ADL_QUESTION_ID: string;
    /**
     * Reference to CL_LQH based on HX_ADL_QUESTION_ID
     */
    hx_adl_question?: CL_LQH;
    /**
     * The name of the Visit Navigator (VN) History Template Definition (LQH) record.
     */
    HX_ADL_QUESTION_ID_RECORD_NAME: string;
    /**
     * This column stores the category value (1, 2 or 3) of the response to ADL questions.
     */
    HX_ADL_RESPONSE_C_NAME: string;
    /**
     * Reference to parent SOCIAL_HX
     */
    social_hx?: SOCIAL_HX;
}

/**
 * This table contains the SNOMED codes for the specimen type.
 * pk: ORDER_ID, LINE
 */
export interface SPEC_SOURCE_SNOMED {
    /**
     * The unique identifier for the order record.
     */
    ORDER_ID: number;
    /**
     * Reference to ORDER_PROC based on ORDER_ID
     */
    order?: ORDER_PROC;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * SNOMED code associated w/ the specimen source
     */
    SOURCE_SNOMED_CT: string;
}

/**
 * This table contains the SNOMED codes for the specimen type.
 * pk: ORDER_ID, LINE
 */
export interface SPEC_TYPE_SNOMED {
    /**
     * The unique identifier for the order record.
     */
    ORDER_ID: number;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * SNOMED code associated w/ the specimen type
     */
    TYPE_SNOMED_CT: string;
    /**
     * Reference to parent ORDER_PROC
     */
    order_proc?: ORDER_PROC;
}

/**
 * The SURGICAL_HX table contains data from medical history contacts entered in clinical system patient encounters
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface SURGICAL_HX {
    /**
     * This is a numeric representation of the date of this encounter in your system
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The line number of the surgical history contact within the encounter.
     */
    LINE: number;
    /**
     * The unique ID of the procedure record associated with the surgical history contact
     */
    PROC_ID: number;
    /**
     * Reference to CLARITY_EAP based on PROC_ID
     */
    proc?: CLARITY_EAP;
    /**
     * The contact date of the encounter associated with this surgical history contact
     */
    CONTACT_DATE: Date;
    /**
     * A unique serial number for this encounter
     */
    PAT_ENC_CSN_ID: number;
    /**
     * This category number represents the source of entry, the person providing the information, for the surgical history data.
     */
    SURGICAL_HX_SRC_C_NAME: string;
    /**
     * The Contact Serial Number of the encounter in which the history was created/edited
     */
    HX_LNK_ENC_CSN: number;
    /**
     * Reference to parent SOCIAL_HX
     */
    social_hx?: SOCIAL_HX;
}

/**
 * The SVC_PMT_HISTORY table contains line level history for how a payment was processed.
 * pk: TX_ID, GROUP_LINE, VALUE_LINE
 */
export interface SVC_PMT_HISTORY {
    /**
     * The unique identifier for the transaction Record.
     */
    TX_ID: number;
    /**
     * Reference to ARPB_TRANSACTIONS based on TX_ID
     */
    tx?: ARPB_TRANSACTIONS;
    /**
     * The line number for the information associated with this record.
     */
    GROUP_LINE: number;
    /**
     * The line number of one of the multiple values associated with a specific group of data within this record.
     */
    VALUE_LINE: number;
    /**
     * Contains a line level action that was taken for the payment.
     */
    SVC_PMT_HISTORY_C_NAME: string;
}

/**
 * This table displays general information about the Task Templates (LTT) record.
 * pk: RECORD_ID
 */
export interface TASK_INFO {
    /**
     * The unique identifier for the task template record.
     */
    RECORD_ID: string;
    /**
     * This column displays the name of the task template record.
     */
    RECORD_NAME: string;
}

/**
 * This table stores basic information about the timeout or Procedure Pass.


For timeouts: The answers to the timeout questions, comments, procedure info, verification info and staff info can be found in tables that start with the TIMEOUT_ prefix.


For Procedure Passes: the task information, review status, checkpoints, and other information can be found in tables that start with the PXPASS_ prefix.
 * pk: TIMEOUT_ID
 */
export interface TIMEOUT {
    /**
     * The unique identifier for the timeout record for this row.
     */
    TIMEOUT_ID: number;
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * A serial number for the encounter in which the alert was fired
     */
    PAT_CSN: number;
    /**
     * Stores the date the record was created.
     */
    RECORD_CREATION_DT: Date;
    /**
     * The type of verification data this record will have.
     */
    VERIF_CLASS_C_NAME: string;
    /**
     * Collection of FRM_STATUS as children
     */
    frm_status?: FRM_STATUS[];
    /**
     * Collection of TIMEOUT_ANSWERS as children
     */
    timeout_answers?: TIMEOUT_ANSWERS[];
}

/**
 * This table stores information about patient treatment teams such as relationship, specialty, department, and start/end time
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface TREATMENT_TEAM {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The category value corresponding to the specialty of the treatment team member to the patient.
     */
    TR_TEAM_SPEC_C_NAME: string;
    /**
     * The unique ID of the treatment team provider record.
     */
    TR_TEAM_ID: string;
    /**
     * Reference to CLARITY_SER based on TR_TEAM_ID
     */
    tr_team?: CLARITY_SER;
    /**
     * The category value corresponding to the relationship of the treatment team member to the patient.
     */
    TR_TEAM_REL_C_NAME: string;
    /**
     * The date and time the treatment team member started for the patient.
     */
    TR_TEAM_BEG_DTTM: Date;
    /**
     * The date and time the treatment team member ended for the patient.
     */
    TR_TEAM_END_DTTM: Date;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * This table contains all orders for each patient encounter.
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface TREATMENT {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * A unique contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The unique ID of the order record.
     */
    TREATMENTS_ID: number;
    /**
     * Reference to ORD_PRFLST_TRK based on TREATMENTS_ID
     */
    treatments?: ORD_PRFLST_TRK;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * This table contains information about the diagnoses associated with transactions
 * pk: TX_ID, LINE
 */
export interface TX_DIAG {
    /**
     * The unique accounts receivable transaction record ID.
     */
    TX_ID: number;
    /**
     * Line number to identify each row of diagnosis data associated with an individual transaction
     */
    LINE: number;
    /**
     * The post date of the charge transaction
     */
    POST_DATE: Date;
    /**
     * The ID of the service area associated with the transaction identified by TX_ID.
     */
    SERV_AREA_ID: number;
    /**
     * Reference to CLARITY_SA based on SERV_AREA_ID
     */
    serv_area?: CLARITY_SA;
    /**
     * The diagnosis associated with the charge transaction
     */
    DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on DX_ID
     */
    dx?: CLARITY_EDG;
    /**
     * Diagnosis Qualifier for the diagnosis associated with this charge
     */
    DX_QUALIFIER_C_NAME: string;
    /**
     * Reference to parent ARPB_TRANSACTIONS
     */
    arpb_transactions?: ARPB_TRANSACTIONS;
}

/**
 * This table contains Medical National Drug Code (NDC) information
 * pk: TX_ID, LINE
 */
export interface TX_NDC_INFORMATION {
    /**
     * The unique accounts receivable transaction record ID.
     */
    TX_ID: number;
    /**
     * Reference to ARPB_TRANSACTIONS based on TX_ID
     */
    tx?: ARPB_TRANSACTIONS;
    /**
     * Line number to identify each row of�Medical National Drug Code (NDC) data associated with an individual transaction.
     */
    LINE: number;
    /**
     * The ID of the Medical National Drug Code (NDC) associated with a transaction.
     */
    NDC_CODES_ID: string;
    /**
     * Reference to RX_NDC based on NDC_CODES_ID
     */
    ndc_codes?: RX_NDC;
    /**
     * The external code for the National Drug Code (NDC)
     */
    NDC_CODES_ID_NDC_CODE: string;
    /**
     * The NDC amount associated with this charge.
     */
    NDC_CODES_ADMIN_AMT: number;
    /**
     * The Medical National Drug Code (NDC) unit associated with the charge.
     */
    NDC_CODES_UNIT_C_NAME: string;
}

/**
 * The UCL_NDC_CODES table contains information about NDC codes for universal charge records.
 * pk: UCL_ID, LINE
 */
export interface UCL_NDC_CODES {
    /**
     * The unique ID associated with the charge record.
     */
    UCL_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The medication national drug codes associated with the charge.
     */
    NDC_CODE_ID: string;
    /**
     * Reference to RX_NDC based on NDC_CODE_ID
     */
    ndc_code?: RX_NDC;
    /**
     * The external code for the National Drug Code (NDC)
     */
    NDC_CODE_ID_NDC_CODE: string;
    /**
     * Administered amount for associated national drug code.
     */
    NDC_CODE_ADMIN_AMT: number;
    /**
     * Unit associated with NDC administered amount.
     */
    NDC_CODE_UNIT_C_NAME: string;
}

/**
 * This table contains diagnosis information for one charge in the Universal Charge Line (UCL) masterfile.
 * pk: UCL_ID, LINE
 */
export interface UNIV_CHG_LN_DX {
    /**
     * The unique ID associated with the charge record.
     */
    UCL_ID: string;
    /**
     * Each charge line�(UCL) can have multiple diagnoses associated with it
     */
    LINE: number;
    /**
     * The list of diagnoses associated with this charge.
     */
    DIAGNOSIS_ID: number;
    /**
     * Reference to CLARITY_EDG based on DIAGNOSIS_ID
     */
    diagnosis?: CLARITY_EDG;
    /**
     * The qualifier for the diagnosis.
     */
    DIAGNOSIS_QUAL_C_NAME: string;
}

/**
 * This table contains modifier information for charges in the Universal Charge Line (UCL) master file.
 * pk: UCL_ID, LINE
 */
export interface UNIV_CHG_LN_MOD {
    /**
     * The unique ID assigned to the�charge line�record.
     */
    UCL_ID: string;
    /**
     * Each Universal Charge Line can have multiple modifiers associated with it
     */
    LINE: number;
    /**
     * The modifier associated with the Universal Charge Line.
     */
    MODIFIER_ID: string;
    /**
     * Reference to CLARITY_MOD based on MODIFIER_ID
     */
    modifier?: CLARITY_MOD;
    /**
     * The name of the modifier record.
     */
    MODIFIER_ID_MODIFIER_NAME: string;
}

/**
 * This table contains update history for the Universal Charge Line (UCL) masterfile
 * pk: UCL_ID, LINE
 */
export interface UNIV_CHG_LN_MSG_HX {
    /**
     * The unique ID assigned to the UCL record (UCL .1).
     */
    UCL_ID: string;
    /**
     * Each charge line�(UCL) can have multiple messages (UCM) associated with it
     */
    LINE: number;
    /**
     * A history of Universal Charge Messages (UCM) that have updated this charge.
     */
    MESSAGE_ID: number;
}

/**
 * This view contains all bill area records in the system, regardless of record type.
 * pk: BILL_AREA_ID
 */
export interface V_BIL_ALL {
    /**
     * The unique identifier for the bill area, financial subdivision, or financial division.
     */
    BILL_AREA_ID: number;
    /**
     * Reference to CLARITY_IMMUNZATN based on BILL_AREA_ID
     */
    bill_area?: CLARITY_IMMUNZATN;
    /**
     * The record name of this bill area, financial subdivision, or financial division.
     */
    BILL_AREA_NAME: string;
}

/**
 * Placeholder view for HNO EHI data that needs to be marked as both static and dynamic.
 * pk: NOTE_ID, LINE
 */
export interface V_EHI_HNO_LINKED_PATS {
    /**
     * The unique identifier (.1 item) for the note record.
     */
    NOTE_ID: string;
    /**
     * The line number for the information associated with this record
     */
    LINE: number;
    /**
     * The list of patients (EPT) that this HNO is associated with for Electronic Health Information (EHI) Export
     */
    LINKED_PAT_ID: string;
    /**
     * Reference to PATIENT based on LINKED_PAT_ID
     */
    linked_pat?: PATIENT;
    /**
     * Reference to parent HNO_INFO
     */
    hno_info?: HNO_INFO;
}

/**
 * The CLM_ALL table contains information about claim and claim information records from all workflows.
 * pk: CLAIM_ID
 */
export interface CLM_ALL {
    /**
     * The unique identifier of the claim or claim information record.
     */
    CLAIM_ID: number;
    /**
     * The patient or member associated with the claim or claim information record.
     */
    PATIENT_OR_MEMBER_ID: string;
    /**
     * Reference to PATIENT based on PATIENT_OR_MEMBER_ID
     */
    patient_or_member?: PATIENT;
    /**
     * The description of the claim record.
     */
    CLAIM_NAME: string;
    /**
     * The date on which this claim was entered into the system.
     */
    ENTRY_DATE: Date;
    /**
     * The category type identifying the claim as resulting from illness, injury or pregnancy (e.g., illness, accident (injury), pregnancy (last menstrual period, or LMP)).
     */
    ILL_INJ_LMP_C_NAME: string;
    /**
     * The date and time on which the injury resulting in the claim occurred.
     */
    INJURY_DATETIME: Date;
    /**
     * The accident type for the injury resulting in the claim (e.g., Workers' Compensation, Automobile).
     */
    ACCIDENT_TYPE_C_NAME: string;
    /**
     * The user's login service area at the time of the creation of the claim information record.
     */
    CLM_LOGIN_SA_ID: number;
    /**
     * Reference to CLARITY_SA based on CLM_LOGIN_SA_ID
     */
    clm_login_sa?: CLARITY_SA;
    /**
     * The date of the onset of illness, the occurrence of the injury, or the patient's last menstrual period (related to pregnancy).
     */
    ILL_INJ_LMP_DT: Date;
    /**
     * Auto accident State.
     */
    AUTO_ACDNT_STATE_C_NAME: string;
    /**
     * Principal diagnosis.
     */
    PRINCIPAL_DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on PRINCIPAL_DX_ID
     */
    principal_dx?: CLARITY_EDG;
    /**
     * The affected body part.
     */
    BODY_PART_DISABLD_C_NAME: string;
    /**
     * Place of injury.
     */
    PLACE_OF_INJURY_C_NAME: string;
    /**
     * The patient or member associated with the claim or claim information record.
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * Collection of CLM_INJURY_DESC as children
     */
    clm_injury_desc?: CLM_INJURY_DESC[];
    /**
     * Collection of CLM_OTHER_DXS as children
     */
    clm_other_dxs?: CLM_OTHER_DXS[];
}

/**
 * All values associated with a claim are stored in the Claim External Value record
 * pk: RECORD_ID
 */
export interface CLM_VALUES {
    /**
     * This column stores the unique identifier for the claim record.
     */
    RECORD_ID: number;
    /**
     * The value indicating whether the billing provider on the claim is a person or a non-person.
     */
    BIL_PROV_TYP_QUAL: string;
    /**
     * The billing provider's last name (if a person) or the organization name (if a non-person).
     */
    BIL_PROV_NAM_LAST: string;
    /**
     * The billing provider's National Provider Identifier (NPI).
     */
    BIL_PROV_NPI: string;
    /**
     * The billing provider's taxonomy code.
     */
    BIL_PROV_TAXONOMY: string;
    /**
     * The qualifier for the billing provider's tax ID defining the type of ID reported as the tax ID.
     */
    BIL_PROV_TAXID_QUAL: string;
    /**
     * The billing provider's tax ID
     */
    BIL_PROV_TAXID: string;
    /**
     * The first line of the billing provider's street address.
     */
    BIL_PROV_ADDR_1: string;
    /**
     * The billing provider's city.
     */
    BIL_PROV_CITY: string;
    /**
     * The billing provider's state.
     */
    BIL_PROV_STATE: string;
    /**
     * The billing provider's ZIP Code.
     */
    BIL_PROV_ZIP: string;
    /**
     * The code identifying the filing order for the claim (e.g., primary, secondary, tertiary).
     */
    CLM_CVG_SEQ_CD: string;
    /**
     * The payer name.
     */
    CLM_CVG_PYR_NAM: string;
    /**
     * The group number entered in the coverage record.
     */
    CLM_CVG_GRP_NUM: string;
    /**
     * The group name entered in the coverage record.
     */
    CLM_CVG_GRP_NAM: string;
    /**
     * The indicator identifying the type of claim.
     */
    CLM_CVG_FILING_IND: string;
    /**
     * The qualifier that describes the type of ID used to identify the payer.
     */
    CLM_CVG_PYR_ID_TYP: string;
    /**
     * The primary ID for the payer.
     */
    CLM_CVG_PYR_ID: string;
    /**
     * The indicator that the provider accepts assignment from the payer.
     */
    CLM_CVG_ACPT_ASGN: string;
    /**
     * The indicator that the insured assigns benefits to the provider.
     */
    CLM_CVG_AUTH_PMT: string;
    /**
     * The indicator that the insured has authorized the release of information to the payer.
     */
    CLM_CVG_REL_INFO: string;
    /**
     * The first line of the payer's street address.
     */
    PYR_ADDR_1: string;
    /**
     * The payer's city.
     */
    PYR_CITY: string;
    /**
     * The payer's state.
     */
    PYR_STATE: string;
    /**
     * The payer's ZIP Code.
     */
    PYR_ZIP: string;
    /**
     * The patient's last name.
     */
    PAT_NAM_LAST: string;
    /**
     * The patient's first name.
     */
    PAT_NAM_FIRST: string;
    /**
     * The patient's middle name.
     */
    PAT_NAM_MID: string;
    /**
     * The patient's medical record number.
     */
    PAT_MRN: string;
    /**
     * The patient's relationship to the coverage subscriber.
     */
    PAT_REL_TO_INS: string;
    /**
     * The patient's birthdate.
     */
    PAT_BIRTH_DATE: Date;
    /**
     * The patient's gender.
     */
    PAT_SEX: string;
    /**
     * The indicator that the patient has signed the necessary release forms and the forms are on file at the provider.
     */
    PAT_SIG_ON_FILE: string;
    /**
     * The patient's marital status.
     */
    PAT_MAR_STAT: string;
    /**
     * The patient's employment status.
     */
    PAT_EMPY_STAT: string;
    /**
     * The patient's phone number.
     */
    PAT_PH: string;
    /**
     * The first line of the patient's street address.
     */
    PAT_ADDR_1: string;
    /**
     * The patient's city.
     */
    PAT_CITY: string;
    /**
     * The patient's state.
     */
    PAT_STATE: string;
    /**
     * The patient's ZIP Code.
     */
    PAT_ZIP: string;
    /**
     * The invoice number that uniquely identifies the claim in the billing system.
     */
    INV_NUM: string;
    /**
     * The payer's internal control number (ICN) that uniquely identifies the claim in the payer's system.
     */
    ICN: string;
    /**
     * The total charge amount for the claim.
     */
    TTL_CHG_AMT: number;
    /**
     * The facility code portion of the bill type (first and second digits).
     */
    BILL_TYP_FAC_CD: string;
    /**
     * The frequency code portion of the bill type (third digit).
     */
    BILL_TYP_FREQ_CD: string;
    /**
     * The admission type for the claim.
     */
    ADMSN_TYP: string;
    /**
     * The admission source for the claim.
     */
    ADMSN_SRC: string;
    /**
     * The patient's discharge status, also referred to as the discharge disposition.
     */
    DISCHRG_DISP: string;
    /**
     * The Clinical Laboratory Improvement Amendment (CLIA) number when the claim contains lab services.
     */
    CLIA_NUM: string;
    /**
     * The indicator that the claim includes purchased services rendered by an independent provider.
     */
    OUTSIDE_LAB: string;
    /**
     * The price of the purchased services.
     */
    OUTSIDE_LAB_CHG: number;
    /**
     * The earliest date represented on the claim
     */
    CLM_FROM_DT: Date;
    /**
     * The latest date represented on the claim
     */
    CLM_TO_DT: Date;
    /**
     * The date the automobile accident occurred.
     */
    ACDNT_DT: Date;
    /**
     * The attending provider's last name.
     */
    ATT_PROV_NAM_LAST: string;
    /**
     * The attending provider's first name.
     */
    ATT_PROV_NAM_FIRST: string;
    /**
     * The attending provider's middle name.
     */
    ATT_PROV_NAM_MID: string;
    /**
     * The attending provider's National Provider Identifier (NPI).
     */
    ATT_PROV_NPI: string;
    /**
     * The attending provider's taxonomy code.
     */
    ATT_PROV_TAXONOMY: string;
    /**
     * The rendering provider on the claim is a person or a non-person.
     */
    REND_PROV_TYP: string;
    /**
     * The rendering provider's last name (if a person) or the organization name (if a non-person).
     */
    REND_PROV_NAM_LAST: string;
    /**
     * The rendering provider's first name
     */
    REND_PROV_NAM_FIRST: string;
    /**
     * The rendering provider's middle name
     */
    REND_PROV_NAM_MID: string;
    /**
     * The suffix to the rendering provider's name (e.g., Jr, III)
     */
    REND_PROV_NAM_SUF: string;
    /**
     * The rendering provider's National Provider Identifier (NPI).
     */
    REND_PROV_NPI: string;
    /**
     * The rendering provider's taxonomy code.
     */
    REND_PROV_TAXONOMY: string;
    /**
     * The referring provider's last name.
     */
    REF_PROV_NAM_LAST: string;
    /**
     * The referring provider's first name.
     */
    REF_PROV_NAM_FIRST: string;
    /**
     * The referring provider's middle name.
     */
    REF_PROV_NAM_MID: string;
    /**
     * The referring provider's National Provider Identifier (NPI).
     */
    REF_PROV_NPI: string;
    /**
     * The referring provider's taxonomy code.
     */
    REF_PROV_TAXONOMY: string;
    /**
     * The name of the external location where the services were performed.
     */
    SVC_FAC_NAM: string;
    /**
     * The NPI of the external location where the services were performed.
     */
    SVC_FAC_NPI: string;
    /**
     * The contact phone number for the external location.
     */
    SVC_FAC_CNCT_PH: string;
    /**
     * The first line of the external location street address.
     */
    SVC_FAC_ADDR_1: string;
    /**
     * The external location's city.
     */
    SVC_FAC_CITY: string;
    /**
     * The external location's state.
     */
    SVC_FAC_STATE: string;
    /**
     * The external location's ZIP code.
     */
    SVC_FAC_ZIP: string;
    /**
     * The date the claim was created
     */
    CREATE_DT: Date;
    /**
     * The amount already paid by the payer of the current coverage.
     */
    CLM_CVG_AMT_PAID: number;
    /**
     * The amount due by the payer of the current coverage.
     */
    CLM_CVG_AMT_DUE: number;
    /**
     * The date on which the insured authorized the release of information to the payer.
     */
    CLM_CVG_REL_INFO_DT: Date;
    /**
     * The date the record was created.
     */
    RECORD_CREATION_DT: Date;
    /**
     * The type of claim values stored in the record
     */
    CLM_TYP_C_NAME: string;
    /**
     * The type of form used during processing.
     */
    FORM_TYP_C_NAME: string;
    /**
     * The service area for the claim values record.
     */
    SERV_AREA_ID: number;
    /**
     * Reference to CLARITY_SA based on SERV_AREA_ID
     */
    serv_area?: CLARITY_SA;
    /**
     * Collection of CLM_DX as children
     */
    clm_dx?: CLM_DX[];
    /**
     * Collection of CLM_NOTE as children
     */
    clm_note?: CLM_NOTE[];
    /**
     * Collection of OCC_CD as children
     */
    occ_cd?: OCC_CD[];
    /**
     * Collection of SVC_LN_INFO as children
     */
    svc_ln_info?: SVC_LN_INFO[];
}

/**
 * The COVERAGE table contains high-level information on both managed care and indemnity coverage records in your system.
 * pk: COVERAGE_ID
 */
export interface COVERAGE {
    /**
     * The unique ID assigned to the coverage record
     */
    COVERAGE_ID: number;
    /**
     * The category value that indicates whether a coverage is managed care or indemnity; 1 � Indemnity, 2 � Managed Care.
     */
    COVERAGE_TYPE_C_NAME: string;
    /**
     * This column is only populated for indemnity coverages (COVERAGE_TYPE_C equal to 1)
     */
    PAYOR_ID: number;
    /**
     * Reference to CLARITY_EPM based on PAYOR_ID
     */
    payor?: CLARITY_EPM;
    /**
     * This column is only populated for indemnity coverages (COVERAGE_TYPE_C equal to 1)
     */
    PLAN_ID: number;
    /**
     * Reference to CLARITY_EPP based on PLAN_ID
     */
    plan?: CLARITY_EPP;
    /**
     * The unique ID of the coverage record
     */
    EPIC_CVG_ID: number;
    /**
     * The name of the coverage group.
     */
    GROUP_NAME: string;
    /**
     * The identification number assigned to this subscriber's employer/plan group by the payor
     */
    GROUP_NUM: string;
    /**
     * The category value associated with where to send the claim on a coverage (i.e
     */
    CLAIM_MAIL_CODE_C_NAME: string;
    /**
     * If the subscriber is the same person as a patient, this item contains the patient ID.
     */
    PAT_REC_OF_SUBS_ID: string;
    /**
     * Reference to PATIENT based on PAT_REC_OF_SUBS_ID
     */
    pat_rec_of_subs?: PATIENT;
    /**
     * This item contains the subscriber patient Id of a coverage and will be used to associate patients with linked premium billing accounts for EHI.
     */
    SUBSCR_OR_SELF_MEM_PAT_ID: string;
    /**
     * Reference to PATIENT based on SUBSCR_OR_SELF_MEM_PAT_ID
     */
    subscr_or_self_mem_pat?: PATIENT;
    /**
     * The unique identifier for the coverage record.
     */
    CVG_ID: number;
    /**
     * The coverage payor's name.
     */
    PAYOR_NAME: string;
    /**
     * Collection of COVERAGE_COPAY_ECD as children
     */
    coverage_copay_ecd?: COVERAGE_COPAY_ECD[];
    /**
     * Collection of COVERAGE_MEMBER_LIST as children
     */
    coverage_member_list?: COVERAGE_MEMBER_LIST[];
    /**
     * Collection of COVERAGE_SPONSOR as children
     */
    coverage_sponsor?: COVERAGE_SPONSOR[];
    /**
     * Collection of CVG_ACCT_LIST as children
     */
    cvg_acct_list?: CVG_ACCT_LIST[];
    /**
     * Collection of CVG_SUBSCR_ADDR as children
     */
    cvg_subscr_addr?: CVG_SUBSCR_ADDR[];
}

/**
 * The REFERRAL table is the primary table for referral information stored in system.
 * pk: REFERRAL_ID
 */
export interface REFERRAL {
    /**
     * The unique ID of the referral in database
     */
    REFERRAL_ID: number;
    /**
     * The external identification number used on the referral.
     */
    EXTERNAL_ID_NUM: string;
    /**
     * The ID of the patient associated with the referral.
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * The unique ID of the patient's primary care provider at the time the referral was created.
     */
    PCP_PROV_ID: string;
    /**
     * Reference to REFERRAL_SOURCE based on PCP_PROV_ID
     */
    pcp_prov?: REFERRAL_SOURCE;
    /**
     * The date the referral was entered.
     */
    ENTRY_DATE: Date;
    /**
     * The category value representing the status of the referral (I.e
     */
    RFL_STATUS_C_NAME: string;
    /**
     * The unique ID of the referral source (REF) record of the provider who made the referral
     */
    REFERRING_PROV_ID: string;
    /**
     * Reference to REFERRAL_SOURCE based on REFERRING_PROV_ID
     */
    referring_prov?: REFERRAL_SOURCE;
    /**
     * The name of the referral source.
     */
    REFERRING_PROV_ID_REFERRING_PROV_NAM: string;
    /**
     * The category value indicating the provider specialty being referred to.
     */
    PROV_SPEC_C_NAME: string;
    /**
     * The category value indicating the type of referral.
     */
    RFL_TYPE_C_NAME: string;
    /**
     * The category value indicating the main (first) reason for the referral
     */
    RSN_FOR_RFL_C_NAME: string;
    /**
     * The category value indicating the class of the referral.
     */
    RFL_CLASS_C_NAME: string;
    /**
     * The number of visits authorized for this referral.
     */
    AUTH_NUM_OF_VISITS: number;
    /**
     * The start date of the referral.
     */
    START_DATE: Date;
    /**
     * The expiration date of the referral.
     */
    EXP_DATE: Date;
    /**
     * The ID number of the service area associated with the referral.
     */
    SERV_AREA_ID: number;
    /**
     * Reference to CLARITY_SA based on SERV_AREA_ID
     */
    serv_area?: CLARITY_SA;
    /**
     * The unique ID of the coverage associated with the referral.
     */
    COVERAGE_ID: number;
    /**
     * Reference to COVERAGE based on COVERAGE_ID
     */
    coverage?: COVERAGE;
    /**
     * The number of procedures associated with the referral.
     */
    NUM_PROC: number;
    /**
     * If available, this column is populated by the authorized start date (I RFL 85)
     */
    SVC_DATE_REAL: number;
    /**
     * The ID number of the payor associated with the referral.
     */
    PAYOR_ID: number;
    /**
     * Reference to CLARITY_EPM based on PAYOR_ID
     */
    payor?: CLARITY_EPM;
    /**
     * The ID number of the plan associated with the referral.
     */
    PLAN_ID: number;
    /**
     * Reference to CLARITY_EPP based on PLAN_ID
     */
    plan?: CLARITY_EPP;
    /**
     * This column is populated by the authorized start date (I RFL 85) if available
     */
    SERV_DATE: Date;
    /**
     * The category value used to mark a referral as being "Retro" entered.
     */
    RETRO_FLAG_YN: string;
    /**
     * The date on which the referral was approved automatically by the system.
     */
    AUTO_APPROVED_DATE: Date;
    /**
     * The category value indicating the authorization reason associated with the referral.
     */
    AUTH_RSN_C_NAME: string;
    /**
     * The ID number of the place of service the referral was referred from.
     */
    REFD_BY_LOC_POS_ID: number;
    /**
     * Reference to CLARITY_LOC based on REFD_BY_LOC_POS_ID
     */
    refd_by_loc_pos?: CLARITY_LOC;
    /**
     * The ID number of the place of service the referral was referred to.
     */
    REFD_TO_LOC_POS_ID: number;
    /**
     * The ID number of the department the referral was referred to.
     */
    REFD_TO_DEPT_ID: number;
    /**
     * The category value indicating the specialty the department was referred to.
     */
    REFD_TO_SPEC_C_NAME: string;
    /**
     * The category value indicating the priority of the referral.
     */
    PRIORITY_C_NAME: string;
    /**
     * The date up to which your facility will pay claims for the procedures approved on this referral.
     */
    IBNR_PAY_UNTIL_DT: Date;
    /**
     * The unique ID of the member's primary location at the time the referral was entered.
     */
    PRIM_LOC_ID: number;
    /**
     * Reference to CLARITY_LOC based on PRIM_LOC_ID
     */
    prim_loc?: CLARITY_LOC;
    /**
     * The actual number of completed visits for this referral.
     */
    ACTUAL_NUM_VISITS: number;
    /**
     * The number of visits scheduled for this referral.
     */
    SCHED_NUM_VISITS: number;
    /**
     * The number of visits requested for this referral.
     */
    REQUEST_NUM_VISITS: number;
    /**
     * Whether the referral was accepted ("appointed") or refused ("denied") by the referred-to provider, department or facility.
     */
    DISP_VAL_C_NAME: string;
    /**
     * The ID number of the department the referral was referred by.
     */
    REFD_BY_DEPT_ID: number;
    /**
     * Reference to CLARITY_DEP based on REFD_BY_DEPT_ID
     */
    refd_by_dept?: CLARITY_DEP;
    /**
     * For closed referrals, the category value indicating the reason for closing.
     */
    CLOSE_RSN_C_NAME: string;
    /**
     * Scheduling status of the referral to keep track of internally schedulable referrals
     */
    SCHED_STATUS_C_NAME: string;
    /**
     * Indicates deadline to schedule a referral.
     */
    SCHED_BY_DATE: Date;
    /**
     * For referrals created from an order, indicates if a preauthorization number must be collected before scheduling.
     */
    PREAUTH_REQ_C_NAME: string;
    /**
     * The unique ID of the user who last changed the preauthorization data.
     */
    PREAUTH_CHG_EMP_ID: string;
    /**
     * The name of the user record
     */
    PREAUTH_CHG_EMP_ID_NAME: string;
    /**
     * Date/time stamp for last time the preauthorization data was changed.
     */
    PREAUTH_CHNGD_DTTM: Date;
    /**
     * This is the external referring date.
     */
    EXT_REF_DATE: Date;
    /**
     * Date on which the referral's current status was assigned.
     */
    DECISION_DATE: Date;
    /**
     * The reason category number describing why the referral status was changed.
     */
    RFL_STATCHG_RSN_C_NAME: string;
    /**
     * The calculated number of service level authorizations counts, based on the service level authorizations collected.
     */
    CALC_SVC_LVL_CNTS: number;
    /**
     * The referral direction, as calculated by logic for transitions of care
     */
    RFL_DIRECTION_C_NAME: string;
    /**
     * Is the referred to provider an EpicCare Link provider
     */
    REFD_TO_LINK_PROV_YN: string;
    /**
     * Is the referred to location an EpicCare Link location
     */
    REFD_TO_LINK_LOC_YN: string;
    /**
     * Holds whether the referral is considered leaked
     */
    IS_LEAKED_YN: string;
    /**
     * This item holds the most recent non-empty authorization reason for the referral
     */
    RECENT_AUTH_RSN_C_NAME: string;
    /**
     * The initial request type for the referral.
     */
    INITIAL_REQUEST_TYPE_C_NAME: string;
    /**
     * The contracted status of referred-by entities on the referral as of the last decision or the current contracted status if the referral is pending.
     */
    REF_BY_CNTRCT_AT_AUTH_YN: string;
    /**
     * The contracted status of referred-to entities on the referral as of the last decision or the current contracted status if the referral is pending.
     */
    REF_TO_CNTRCT_AT_AUTH_YN: string;
    /**
     * The contracted status of referred-by provider on the referral as of the last decision or the current contracted status if the referral is pending.
     */
    REF_BY_SER_CNTRCT_AT_AUTH_YN: string;
    /**
     * The contracted status of referred-by location on the referral as of the last decision or the current contracted status if the referral is pending.
     */
    REF_BY_EAF_CNTRCT_AT_AUTH_YN: string;
    /**
     * The contracted status of referred-to location on the referral as of the last decision or the current contracted status if the referral is pending.
     */
    REF_TO_EAF_CNTRCT_AT_AUTH_YN: string;
    /**
     * The contracted status of referred-by entities on the referral as of the last decision.
     */
    REF_BY_CNTRCT_AT_DEC_YN: string;
    /**
     * The contracted status of referred-to entities on the referral as of the last decision.
     */
    REF_TO_CNTRCT_AT_DEC_YN: string;
    /**
     * The contracted status of referred-by provider on the referral as of the last decision.
     */
    REF_BY_SER_CNTRCT_AT_DEC_YN: string;
    /**
     * The contracted status of referred-by location on the referral as of the last decision.
     */
    REF_BY_LOC_CNTRCT_AT_DEC_YN: string;
    /**
     * The contracted status of referred-to location on the referral as of the last decision.
     */
    REF_TO_LOC_CNTRCT_AT_DEC_YN: string;
    /**
     * Collection of REFERRAL_APT as children
     */
    referral_apt?: REFERRAL_APT[];
    /**
     * Collection of REFERRAL_CROSS_ORG as children
     */
    referral_cross_org?: REFERRAL_CROSS_ORG[];
    /**
     * Collection of REFERRAL_CVG_AUTH as children
     */
    referral_cvg_auth?: REFERRAL_CVG_AUTH[];
    /**
     * Collection of REFERRAL_DX as children
     */
    referral_dx?: REFERRAL_DX[];
    /**
     * Collection of REFERRAL_HIST as children
     */
    referral_hist?: REFERRAL_HIST[];
    /**
     * Collection of REFERRAL_NOTES as children
     */
    referral_notes?: REFERRAL_NOTES[];
    /**
     * Collection of REFERRAL_REASONS as children
     */
    referral_reasons?: REFERRAL_REASONS[];
    /**
     * Collection of RFL_REF_TO_REGIONS as children
     */
    rfl_ref_to_regions?: RFL_REF_TO_REGIONS[];
    /**
     * Collection of REFERRAL_PX as children
     */
    referral_px?: REFERRAL_PX[];
}

/**
 * This table contains common information from General Use Notes items
 * pk: NOTE_ID
 */
export interface HNO_INFO {
    /**
     * The unique ID of the note record.
     */
    NOTE_ID: string;
    /**
     * This virtual item is populated with a category value from Note - Type No-Add (I HNO 51) according to the following logic: * if Note - Type No-Add (I HNO 51) is populated, use the value directly * if Note - Type No-Add (I HNO 51) is null and the note is not ambulatory, return null * if Note - Type No-Add (I HNO 51) is null and the note has an ambulatory encounter context, obtain a category from the UCN note type (I HNO 34033) and map that value to an equivalent category from Note - Type No Add (I HNO 51), if possible
     */
    NOTE_TYPE_NOADD_C_NAME: string;
    /**
     * The unique contact serial number for the patient encounter to which the note is attached
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * The unique ID of the user who created this note
     */
    ENTRY_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on ENTRY_USER_ID
     */
    entry_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ENTRY_USER_ID_NAME: string;
    /**
     * The note type associated with this note.
     */
    IP_NOTE_TYPE_C_NAME: string;
    /**
     * Stores the Type of Message (I EOW 30) In Basket folder to be used by the Transcription interface to generate In Basket messages
     */
    TX_IB_FOLDER_C_NAME: number;
    /**
     * The note's create instant.
     */
    CREATE_INSTANT_DTTM: Date;
    /**
     * The note's date of service.
     */
    DATE_OF_SERVIC_DTTM: Date;
    /**
     * The instant the note was last edited.
     */
    LST_FILED_INST_DTTM: Date;
    /**
     * The date and time when this row was created or last updated in Clarity.
     */
    UPDATE_DATE: Date;
    /**
     * This item stores the current author of the note for indexing purposes.
     */
    CURRENT_AUTHOR_ID: string;
    /**
     * Reference to CLARITY_EMP based on CURRENT_AUTHOR_ID
     */
    current_author?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    CURRENT_AUTHOR_ID_NAME: string;
    /**
     * Professional billing visit number attached to this note.
     */
    VISIT_NUM: string;
    /**
     * This is a virtual item that gets the create instant (I HNO 17105), in local time format.
     */
    CRT_INST_LOCAL_DTTM: Date;
    /**
     * This is a virtual item that displays the note purpose
     */
    NOTE_PURPOSE_C_NAME: string;
    /**
     * The priority of the note (Yes = High, No = Routine).
     */
    PRIORITY_YN: string;
    /**
     * The record for the message that was also filed as a note
     */
    CONVERSATION_MSG_ID: string;
    /**
     * Record type.
     */
    HNO_RECORD_TYPE_C_NAME: string;
    /**
     * Whether the note is active
     */
    ACTIVE_C_NAME: string;
    /**
     * Collection of HNO_ORDERS as children
     */
    hno_orders?: HNO_ORDERS[];
    /**
     * Collection of V_EHI_HNO_LINKED_PATS as children
     */
    v_ehi_hno_linked_pats?: V_EHI_HNO_LINKED_PATS[];
}

/**
 * The ORDER_PROC table enables you to report on the procedures ordered in the clinical system
 * pk: ORDER_PROC_ID
 */
export interface ORDER_PROC {
    /**
     * The unique ID of the order record associated with this procedure order.
     */
    ORDER_PROC_ID: number;
    /**
     * Reference to ORDER_PARENT_INFO based on ORDER_PROC_ID
     */
    order_proc?: ORDER_PARENT_INFO;
    /**
     * The unique ID of the patient record for this order
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * A unique, internal contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * The unique ID of the lab or other resulting agency, such as radiology, that provided the order results.
     */
    RESULT_LAB_ID: number;
    /**
     * Interface laboratory name.
     */
    RESULT_LAB_ID_LLB_NAME: string;
    /**
     * The date when the procedure order was placed.
     */
    ORDERING_DATE: Date;
    /**
     * The order type category number for the procedure order.
     */
    ORDER_TYPE_C_NAME: string;
    /**
     * The unique ID of the  procedure record corresponding to this order
     */
    PROC_ID: number;
    /**
     * Reference to CLARITY_EAP based on PROC_ID
     */
    proc?: CLARITY_EAP;
    /**
     * A brief summary of the procedure order.
     */
    DESCRIPTION: string;
    /**
     * The order class category number of the procedure order.
     */
    ORDER_CLASS_C_NAME: string;
    /**
     * The unique ID of the provider prescribing or authorizing the order.
     */
    AUTHRZING_PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on AUTHRZING_PROV_ID
     */
    authrzing_prov?: CLARITY_SER;
    /**
     * Indicates whether or not this order contains abnormal results
     */
    ABNORMAL_YN: string;
    /**
     * The unique ID of the provider under whose name this order should be billed
     */
    BILLING_PROV_ID: string;
    /**
     * The unique identifier of the user who signed the order, or the last person who performed a sign and hold or release action for a signed and held order.
     */
    ORD_CREATR_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on ORD_CREATR_USER_ID
     */
    ord_creatr_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ORD_CREATR_USER_ID_NAME: string;
    /**
     * The category number for the status of results for an order, as of the date and time the record was extracted.
     */
    LAB_STATUS_C_NAME: string;
    /**
     * The order status category number of the procedure order.
     */
    ORDER_STATUS_C_NAME: string;
    /**
     * The number of procedures authorized for this order.
     */
    QUANTITY: number;
    /**
     * The reason for cancellation category number for the procedure order.
     */
    REASON_FOR_CANC_C_NAME: string;
    /**
     * This column indicates whether an order is a future (F) or standing (S) order.
     */
    FUTURE_OR_STAND: string;
    /**
     * The date when a recurring procedure order expires.
     */
    STANDING_EXP_DATE: Date;
    /**
     * The date by which each future procedure order should be completed
     */
    FUT_EXPECT_COMP_DT: Date;
    /**
     * The total number of occurrences that a recurring order was authorized for.
     */
    STAND_ORIG_OCCUR: number;
    /**
     * The unique ID of the provider who has referred this order, i.e
     */
    REFERRING_PROV_ID: string;
    /**
     * The name of the referral source.
     */
    REFERRING_PROV_ID_REFERRING_PROV_NAM: string;
    /**
     * The unique ID of the location record to which this patient was referred.
     */
    REFD_TO_LOC_ID: number;
    /**
     * The medical specialty category number of the provider to which the patient was referred for the procedure order.
     */
    REQUESTED_SPEC_C_NAME: string;
    /**
     * The referral class category number for the procedure order.
     */
    RFL_CLASS_C_NAME: string;
    /**
     * The referral type category number for the procedure order.
     */
    RFL_TYPE_C_NAME: string;
    /**
     * The reason for referral category number for the procedure order.
     */
    RSN_FOR_RFL_C_NAME: string;
    /**
     * The number of visits this referral order is authorized for.
     */
    RFL_NUM_VIS: number;
    /**
     * The category ID for the imaging study status (e.g
     */
    RADIOLOGY_STATUS_C_NAME: string;
    /**
     * The date and time when the procedure order (exam) is to begin.
     */
    PROC_BGN_TIME: Date;
    /**
     * The instant when the order was created.
     */
    ORDER_INST: Date;
    /**
     * The name of the order as it appears in the patient's record.
     */
    DISPLAY_NAME: string;
    /**
     * Indicates whether or not this order was placed by a hospitalist
     */
    HV_HOSPITALIST_YN: string;
    /**
     * The overall priority category number for the procedure order.
     */
    ORDER_PRIORITY_C_NAME: string;
    /**
     * The date and time of instantiation when a child order is generated from a standing or future order.
     */
    INSTANTIATED_TIME: Date;
    /**
     * The unique ID of the user who instantiated the order.
     */
    INSTNTOR_USER_ID: string;
    /**
     * The name of the user record
     */
    INSTNTOR_USER_ID_NAME: string;
    /**
     * The unique ID of the department to which this order is referred.
     */
    DEPT_REF_PROV_ID: number;
    /**
     * The category value for the requested medical specialty of the department to which the patient is referred.
     */
    SPECIALTY_DEP_C_NAME: string;
    /**
     * The specimen type category number for the procedure order.
     */
    SPECIMEN_TYPE_C_NAME: string;
    /**
     * The date and time when the procedure order was placed.
     */
    ORDER_TIME: Date;
    /**
     * The most recent date and time when the procedure order was resulted.
     */
    RESULT_TIME: Date;
    /**
     * Indicates whether or not the order has a pending status
     */
    IS_PENDING_ORD_YN: string;
    /**
     * The date and time when the procedure order is to start.
     */
    PROC_START_TIME: Date;
    /**
     * The unique ID of the problem list record that is associated with this order
     */
    PROBLEM_LIST_ID: number;
    /**
     * The date and time when the procedure order is to end.
     */
    PROC_ENDING_TIME: Date;
    /**
     * The unique key associated with the order at the time of signing
     */
    SESSION_KEY: string;
    /**
     * This column stores the unique identifier for an instance of a DICOM imaging study.
     */
    STUDY_INSTANCE: string;
    /**
     * The unique identifier of the department where the patient is located at the time this order was signed,
     */
    PAT_LOC_ID: number;
    /**
     * Reference to CLARITY_DEP based on PAT_LOC_ID
     */
    pat_loc?: CLARITY_DEP;
    /**
     * The active order category ID, which indicates information about the order status.
     */
    ACT_ORDER_C_NAME: string;
    /**
     * The order source category ID of the order, indicating where in the EHR the order was entered.
     */
    ORDER_SOURCE_C_NAME: string;
    /**
     * The date the specimen was taken.
     */
    SPECIMN_TAKEN_DATE: Date;
    /**
     * The time the specimen was taken.
     */
    SPECIMN_TAKEN_TIME: Date;
    /**
     * This free text item is used to store comments about the specimen source.
     */
    SPECIMEN_COMMENTS: string;
    /**
     * This item stores the date that the specimen was received
     */
    SPECIMEN_RECV_DATE: Date;
    /**
     * This item stores the time the specimen was received
     */
    SPECIMEN_RECV_TIME: Date;
    /**
     * The name of the user who collected the specimen for the order.
     */
    COLLECTOR_IDN: string;
    /**
     * Indicates whether there is an approximate future expected date for this order
     */
    FUTURE_APPROX_DT_YN: string;
    /**
     * The date on which a standing order was last performed.
     */
    LAST_STAND_PERF_DT: Date;
    /**
     * The time at which a standing order was last performed.
     */
    LAST_STAND_PERF_TM: Date;
    /**
     * Stores the external order ID for the order.
     */
    EXTERNAL_ORD_ID: string;
    /**
     * Stores the link to the general notes record containing the result remarks
     */
    REMARKS_HNO_ID: string;
    /**
     * Stores the referring provider address ID for referral orders
     */
    SER_ADDRESSID: string;
    /**
     * Stores the referring facility for referral orders
     */
    REFG_FACILITY_ID: number;
    /**
     * Reference to CLARITY_LOC based on REFG_FACILITY_ID
     */
    refg_facility?: CLARITY_LOC;
    /**
     * Stores the associated referral ID for referral orders
     */
    REFERRAL_ID: number;
    /**
     * The date and time of the last result date
     */
    LAST_RESULT_UPD_TM: Date;
    /**
     * The unique identifier for the login department used by the user signing the order.
     */
    LOGIN_DEP_ID: number;
    /**
     * The date an unscheduled order was placed, or the appointment date for a scheduled order which requires a protocol.
     */
    PROTCL_STAT_DT: Date;
    /**
     * The scheduling status for an order which requires a protocol
     */
    PROTCL_STATE_C_NAME: string;
    /**
     * Indicates whether this order was resulted through an interface or not
     */
    INTERFACE_YN: string;
    /**
     * The source of prioritized date category ID for the order record
     */
    SOURCE_OF_PRI_INS_C_NAME: string;
    /**
     * The time and date that is used as the prioritized date.
     */
    PRIORITIZED_INST_TM: Date;
    /**
     * The list of question records associated with this order.
     */
    ORDER_QUESN_LIST: string;
    /**
     * The unique identifier for the order record.
     */
    ORDER_ID: number;
    /**
     * Reference to ORDER_PARENT_INFO based on ORDER_ID
     */
    order?: ORDER_PARENT_INFO;
    /**
     * This indicates whether an order is an inpatient or outpatient order
     */
    ORDERING_MODE_C_NAME: string;
    /**
     * The provider status category number for the order at the time of the extract
     */
    PROV_STATUS_C_NAME: string;
    /**
     * The result type category number for the order, if noted
     */
    RESULT_TYPE_C_NAME: string;
    /**
     * The priority level category number of a referral order, which is used to specify whether a referral order is routine, urgent, emergency or elective
     */
    RFL_PRIORITY_C_NAME: string;
    /**
     * Sign action for pended order.
     */
    SIGN_ACTION_PEND_C_NAME: string;
    /**
     * Holds the ID number of the Standing Status In Basket message associated with this Order
     */
    STAND_EOW_ID: string;
    /**
     * This item indicates whether child instances of a standing order should be automatically released for inpatient orders.
     */
    INPAT_AUTO_RLSE_YN: string;
    /**
     * The number of units requested for the service.
     */
    UNITS_REQUESTED: number;
    /**
     * The number of units approved for the service.
     */
    UNITS_APPROVED: number;
    /**
     * This column contains the a Condition Flag if this is an order created from certain condition.
     */
    ORD_CONDITION_FLAG: number;
    /**
     * This column returns whether the order is an external result that should not drop charges
     */
    NOCHRG_EXT_RSLT_YN: string;
    /**
     * Contains the current status of the order's protocols
     */
    PROTOCOL_STATUS_C_NAME: string;
    /**
     * LOINC ID associated with the procedure.
     */
    PROC_LNC_ID: number;
    /**
     * Indicates whether the most recent result is abnormal
     */
    ABNORMAL_NOADD_YN: string;
    /**
     * The unique ID of the screening form linked to the order.
     */
    SCREENING_FORM_ID: number;
    /**
     * Indicates if the No restriction checkbox is checked for scheduling tolerance before the expected treatment date for a schedulable procedure
     */
    SCHED_TOL_NO_RESTR_BEF_YN: string;
    /**
     * Indicates if the No restriction checkbox is checked for scheduling tolerance after the expected treatment date for a schedulable procedure
     */
    SCHED_TOL_NO_RESTR_AFTR_YN: string;
    /**
     * Holds a category value for the expected completion date
     */
    FUTURE_RELATIVE_EXPECTED_DT_C_NAME: string;
    /**
     * The instant when the order was created in UTC.
     */
    ORDER_INST_UTC_DTTM: Date;
    /**
     * The instant in local time at which the imaging result was made public, as defined by the order's study status (e.g
     */
    IMG_PUBLIC_RSLT_DTTM: Date;
    /**
     * This item holds the category type of the active procedure order
     */
    ACTIVE_PROC_TYPE_C_NAME: string;
    /**
     * The date and time an order's exam is ended in the Universal Time Coordinated (UTC) format.
     */
    RAD_EXAM_END_UTC_DTTM: Date;
    /**
     * The age of the patient (in years) as of the date of the exam
     */
    PAT_AGE_AT_EXAM: number;
    /**
     * Stores the prioritized instant for the result in UTC
     */
    PRIORITIZED_UTC_DTTM: Date;
    /**
     * Stores the last update instant for a result in UTC
     */
    RESULT_UPDATE_UTC_DTTM: Date;
    /**
     * Stores whether the imaging exam was performed in isolation.
     */
    PERFORMED_IN_ISO_YN: string;
    /**
     * Indicates whether the order or any of the linked performable orders have a lab specimen
     */
    HAS_LAB_SPEC_YN: string;
    /**
     * Indicates whether the order has a resulted contact
     */
    HAS_RSLT_CNCT_YN: string;
    /**
     * Indicates whether the order has a correction
     */
    HAS_CORR_YN: string;
    /**
     * The unique ID of the resulting lab from the last contact where the procedure result status is not null.
     */
    LAST_RSLT_LAB_ID: number;
    /**
     * Interface laboratory name.
     */
    LAST_RSLT_LAB_ID_LLB_NAME: string;
    /**
     * The unique ID of the user who first made results available on the chart.
     */
    FIRST_CHART_USER_ID: string;
    /**
     * The name of the user record
     */
    FIRST_CHART_USER_ID_NAME: string;
    /**
     * The date and time results were first made available on the chart.
     */
    FIRST_CHART_UTC_DTTM: Date;
    /**
     * The unique ID of the user who last made results available on the chart.
     */
    LAST_CHART_USER_ID: string;
    /**
     * The name of the user record
     */
    LAST_CHART_USER_ID_NAME: string;
    /**
     * The date and time results were last made available on the chart.
     */
    LAST_CHART_UTC_DTTM: Date;
    /**
     * The unique ID of the user who first made final results available on the chart.
     */
    FIRST_FINAL_USER_ID: string;
    /**
     * The name of the user record
     */
    FIRST_FINAL_USER_ID_NAME: string;
    /**
     * The date and time final results were first made available on the chart.
     */
    FIRST_FINAL_UTC_DTTM: Date;
    /**
     * The unique ID of the user who last made final results available on the chart.
     */
    LAST_FINAL_USER_ID: string;
    /**
     * The name of the user record
     */
    LAST_FINAL_USER_ID_NAME: string;
    /**
     * The date and time final results were last made available on the chart.
     */
    LAST_FINAL_UTC_DTTM: Date;
    /**
     * This item stores the prioritized instant (date and time) for an order in local time zone
     */
    PRIORITIZED_INST_DTTM: Date;
    /**
     * This item stores the prioritized instant (date and time) for an order in UTC time zone
     */
    PRIORITIZED_INST_UTC_DTTM: Date;
    /**
     * Stores the last update instant for a result in UTC
     */
    RSLT_UPD_UTC_DTTM: Date;
    /**
     * This item holds the free-text for the received authorizing provider's name
     */
    RECEIVED_EXT_AUTH_PROV: string;
    /**
     * Stores the last time an imaging order had a status change of "SAVED" or higher.
     */
    STUDY_READ_DATE: Date;
    /**
     * This column stores when the addendum is updated in Epic (addendum sign date if using an Epic workflow, otherwise whenever received over the interface)
     */
    IMG_ADDEND_IN_EPIC_DATE: Date;
    /**
     * Unbuffered perform-by date used in automatic order cancellation batch job.
     */
    PERFORM_BY_DATE: Date;
    /**
     * The instant the order was discontinued or canceled in the local timezone.
     */
    DISCON_LOC_DTTM: Date;
    /**
     * The instant final results were first made available on the chart
     */
    FIRST_FINAL_LOC_DTTM: Date;
    /**
     * Determines how the patient associated with this order is to be transported.
     */
    TRANSPORT_C_NAME: string;
    /**
     * The provider ID of the ordering provider.
     */
    ORD_PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on ORD_PROV_ID
     */
    ord_prov?: CLARITY_SER;
    /**
     * The day and time the order record was last updated.
     */
    INST_OF_UPDATE_TM: Date;
    /**
     * Collection of ORDER_ANATOMICAL_REGION as children
     */
    order_anatomical_region?: ORDER_ANATOMICAL_REGION[];
    /**
     * Collection of ORDER_COMMENT as children
     */
    order_comment?: ORDER_COMMENT[];
    /**
     * Collection of ORDER_DX_PROC as children
     */
    order_dx_proc?: ORDER_DX_PROC[];
    /**
     * Collection of ORDER_INSTANTIATED as children
     */
    order_instantiated?: ORDER_INSTANTIATED[];
    /**
     * Collection of ORDER_MYC_RELEASE as children
     */
    order_myc_release?: ORDER_MYC_RELEASE[];
    /**
     * Collection of ORDER_RAD_ACC_NUM as children
     */
    order_rad_acc_num?: ORDER_RAD_ACC_NUM[];
    /**
     * Collection of ORDER_SIGNED_PROC as children
     */
    order_signed_proc?: ORDER_SIGNED_PROC[];
    /**
     * Collection of PERFORMING_ORG_INFO as children
     */
    performing_org_info?: PERFORMING_ORG_INFO[];
    /**
     * Collection of SPEC_TYPE_SNOMED as children
     */
    spec_type_snomed?: SPEC_TYPE_SNOMED[];
    /**
     * Collection of ORDER_REVIEW as children
     */
    order_review?: ORDER_REVIEW[];
}

/**
 * The CLARITY_MEDICATION table contains high-level information from all the medications for use in your facility.
 * pk: MEDICATION_ID
 */
export interface CLARITY_MEDICATION {
    /**
     * The unique ID of the medication record.
     */
    MEDICATION_ID: number;
    /**
     * The first line of the generic, non-proprietary name for this medication.
     */
    GENERIC_NAME: string;
    /**
     * The default display name that will be used for this medication in the preference list display in order entry.
     */
    ORDER_DISPLAY_NAME: string;
}

/**
 * The CLARITY_DEP table contains high-level information about departments.
 * pk: DEPARTMENT_ID
 */
export interface CLARITY_DEP {
    /**
     * The unique ID number assigned to the department record.
     */
    DEPARTMENT_ID: number;
    /**
     * The name of the department.
     */
    DEPARTMENT_NAME: string;
    /**
     * The external name of the department record
     */
    EXTERNAL_NAME: string;
}

/**
 * The CLARITY_EAP table contains basic information about the procedure records in your system
 * pk: PROC_ID
 */
export interface CLARITY_EAP {
    /**
     * The unique ID of each procedure record in your system
     */
    PROC_ID: number;
    /**
     * The name of each procedure.
     */
    PROC_NAME: string;
    /**
     * The patient friendly procedure name for use in MyChart.
     */
    PT_FRIENDLY_NAME: string;
}

/**
 * This table contains information about your location records
 * pk: LOC_ID
 */
export interface CLARITY_LOC {
    /**
     * The unique ID number assigned to the location record.
     */
    LOC_ID: number;
    /**
     * The name of the revenue location.
     */
    LOC_NAME: string;
    /**
     * External name for the record
     */
    EXTERNAL_NAME: string;
}

/**
 * This table contains most of the information about the lot number records in the Lot Number (LOT) master file.
 * pk: LOT_NUM_ID
 */
export interface CLARITY_LOT {
    /**
     * The internal ID of the lot number record.
     */
    LOT_NUM_ID: number;
    /**
     * The lot number on the vial for a given medication or immunization.
     */
    LOT_NUM: string;
    /**
     * Stores the lot number/name.
     */
    LOT_NUM_NM: string;
}

/**
 * The CLARITY_LWS table contains basic information about workstations used in your system.
 * pk: WORKSTATION_ID
 */
export interface CLARITY_LWS {
    /**
     * This is the unique internal ID of the workstation.
     */
    WORKSTATION_ID: string;
    /**
     * The unique identifier for the workstation record.
     */
    WORK_STATION_2_ID: string;
}

/**
 * This table contains high-level information on the episodes recorded in the clinical system for your patients
 * pk: EPISODE_ID
 */
export interface EPISODE {
    /**
     * The unique ID of the episode of care record.
     */
    EPISODE_ID: number;
    /**
     * Reference to CARE_PATH based on EPISODE_ID
     */
    episode?: CARE_PATH;
    /**
     * The name of the episode.
     */
    NAME: string;
    /**
     * The episode type.
     */
    SUM_BLK_TYPE_ID: number;
    /**
     * Reference to EPISODE_DEF based on SUM_BLK_TYPE_ID
     */
    sum_blk_type?: EPISODE_DEF;
    /**
     * The date the episode was initiated.
     */
    START_DATE: Date;
    /**
     * The date the episode was resolved in calendar format
     */
    END_DATE: Date;
    /**
     * The status category number for the episode.
     */
    STATUS_C_NAME: string;
    /**
     * The ID of the last user that updated the episode of care record.
     */
    L_UPDATE_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on L_UPDATE_USER_ID
     */
    l_update_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    L_UPDATE_USER_ID_NAME: string;
    /**
     * The unique ID of the episode's service area
     */
    SERV_AREA_ID: number;
    /**
     * Reference to CLARITY_SA based on SERV_AREA_ID
     */
    serv_area?: CLARITY_SA;
    /**
     * The name of the episode.
     */
    EPISODE_NAME: string;
    /**
     * The unique ID of the patient associated with the episode.
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * Collection of ALL_EPISODE_CSN_LINKS as children
     */
    all_episode_csn_links?: ALL_EPISODE_CSN_LINKS[];
    /**
     * Collection of EPISODE_OT as children
     */
    episode_ot?: EPISODE_OT[];
}

/**
 * This table contains hospital account information from the Hospital Account (HAR) and Claim (CLM) master files
 * pk: HSP_ACCOUNT_ID
 */
export interface HSP_ACCOUNT {
    /**
     * This column stores the unique identifier for the hospital account.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * Reference to HSP_ACCT_CLAIM_HAR based on HSP_ACCOUNT_ID
     */
    hsp_account?: HSP_ACCT_CLAIM_HAR;
    /**
     * The name of the patient associated with the hospital account.
     */
    HSP_ACCOUNT_NAME: string;
    /**
     * The hospital account's account class.
     */
    ACCT_CLASS_HA_C_NAME: string;
    /**
     * The hospital account's financial class.
     */
    ACCT_FIN_CLASS_C_NAME: string;
    /**
     * The hospital account's self-pay status.
     */
    ACCT_SLFPYST_HA_C_NAME: string;
    /**
     * This column stores the status of the hospital account
     */
    ACCT_BILLSTS_HA_C_NAME: string;
    /**
     * This column stores the date the hospital account went to a zero balance
     */
    ACCT_ZERO_BAL_DT: Date;
    /**
     * This column stores the admission date and time associated with the hospital account
     */
    ADM_DATE_TIME: Date;
    /**
     * The department of the account's admission event.
     */
    ADM_DEPARMENT_ID: number;
    /**
     * The location of the account's admission event.
     */
    ADM_LOC_ID: number;
    /**
     * This column stores the unique identifier for the attending provider stored on the hospital account
     */
    ATTENDING_PROV_ID: string;
    /**
     * The date and time when abstracting was completed for the hospital account.
     */
    COMPLETION_DT_TM: Date;
    /**
     * Denotes whether coverages have been put on the hospital account.
     */
    CVG_LIST_SELECT_YN: string;
    /**
     * This column stores the discharge date and time associated with the hospital account
     */
    DISCH_DATE_TIME: Date;
    /**
     * This column stores the unique identifier for the discharge department on the hospital account.
     */
    DISCH_DEPT_ID: number;
    /**
     * The discharge location stored in the hospital account.
     */
    DISCH_LOC_ID: number;
    /**
     * The first line of the street address of the guarantor for the hospital account at time of discharge.
     */
    GUAR_ADDR_1: string;
    /**
     * The name of the guarantor for the hospital account at time of discharge.
     */
    GUAR_NAME: string;
    /**
     * The ZIP Code of the guarantor for the hospital account at time of discharge.
     */
    GUAR_ZIP: string;
    /**
     * The city portion of the address of the patient for the hospital account at time of discharge.
     */
    PAT_CITY: string;
    /**
     * The date of birth of the patient for the hospital account at time of discharge.
     */
    PAT_DOB: Date;
    /**
     * The home phone number of the patient for the hospital account at time of discharge.
     */
    PAT_HOME_PHONE: string;
    /**
     * The social security number of the patient for the hospital account at time of discharge.
     */
    PAT_SSN: string;
    /**
     * The ZIP Code of the patient for the hospital account at time of discharge.
     */
    PAT_ZIP: string;
    /**
     * This column stores the unique identifier for the hospital account's prebilled bucket.
     */
    PREBILL_BUCKET_ID: number;
    /**
     * Reference to HSP_BKT_ADDTL_REC based on PREBILL_BUCKET_ID
     */
    prebill_bucket?: HSP_BKT_ADDTL_REC;
    /**
     * This column stores the unique identifier for the hospital account's self-pay bucket.
     */
    SELF_PAY_BUCKET_ID: number;
    /**
     * Reference to HSP_BKT_ADDTL_REC based on SELF_PAY_BUCKET_ID
     */
    self_pay_bucket?: HSP_BKT_ADDTL_REC;
    /**
     * This column stores the unique identifier for the service area stored on the hospital account.
     */
    SERV_AREA_ID: number;
    /**
     * Reference to CLARITY_SA based on SERV_AREA_ID
     */
    serv_area?: CLARITY_SA;
    /**
     * The total of all adjustments on the hospital account.
     */
    TOT_ADJ: number;
    /**
     * The total of all charges on the hospital account.
     */
    TOT_CHGS: number;
    /**
     * This column stores the unique identifier for a hospital account's undistributed bucket.
     */
    UNDISTRB_BUCKET_ID: number;
    /**
     * Reference to HSP_BKT_ADDTL_REC based on UNDISTRB_BUCKET_ID
     */
    undistrb_bucket?: HSP_BKT_ADDTL_REC;
    /**
     * The patient status (discharge disposition) category ID for the hospital account.
     */
    PATIENT_STATUS_C_NAME: string;
    /**
     * The point of origin category ID (admission source) for the hospital account.
     */
    ADMISSION_SOURCE_C_NAME: string;
    /**
     * The admission type category ID for the hospital account.
     */
    ADMISSION_TYPE_C_NAME: string;
    /**
     * This column stores the unique identifier for the primary payer associated with the hospital account.
     */
    PRIMARY_PAYOR_ID: number;
    /**
     * This column stores the unique identifier for the primary benefit plan associated with the hospital account.
     */
    PRIMARY_PLAN_ID: number;
    /**
     * The total number of charge transactions posted to the hospital account
     */
    NUM_OF_CHARGES: number;
    /**
     * The coding status category ID for the hospital account.
     */
    CODING_STATUS_C_NAME: string;
    /**
     * This column stores the unique identifier for the user when the coding status for the hospital account last changed.
     */
    CODING_STS_USER_ID: string;
    /**
     * The name of the user record
     */
    CODING_STS_USER_ID_NAME: string;
    /**
     * The date and time that the coding status for the hospital account was last changed.
     */
    CODING_DATETIME: Date;
    /**
     * This column stores the unique identifier for the user who last changed the abstracting status of the hospital account.
     */
    ABSTRACT_USER_ID: string;
    /**
     * The name of the user record
     */
    ABSTRACT_USER_ID_NAME: string;
    /**
     * This column stores the date when the account moved to the billed state for the first time.
     */
    FIRST_BILLED_DATE: Date;
    /**
     * The base invoice number for this row.
     */
    BASE_INV_NUM: string;
    /**
     * The invoice number sequence counter for the hospital account.
     */
    INV_NUM_SEQ_CTR: number;
    /**
     * Contains the combined total balance of Hospital Billing (HB)�and Professional Billing (PB) transactions on the hospital account, including charges, payments and adjustments in all statuses (single billing office (SBO)�mode only).
     */
    SBO_TOT_BALANCE: number;
    /**
     * Combined Hospital Billing (HB)�and Professional Billing (PB) charges on the hospital account in all statuses (single billing office (SBO)�mode only).
     */
    SBO_TOTAL_CHARGES: number;
    /**
     * Combined Hospital Billing (HB)�and Professional Billing (PB) payments on the hospital account in all statuses (single billing office (SBO)�mode only).
     */
    SBO_TOTAL_PAYMENTS: number;
    /**
     * Contains combined Hospital Billing (HB)�and Professional Billing (PB) adjustments on the hospital account in all statuses (single billing office (SBO)�mode only).
     */
    SBO_TOTAL_ADJ: number;
    /**
     * Contains combined Hospital Billing (HB)�and Professional Billing (PB) prebilled balances including charges, payments and adjustments (single billing office (SBO)�mode only).
     */
    SBO_PREBILL_BALANC: number;
    /**
     * Contains combined Hospital Billing (HB)�and Professional Billing (PB) insurance balances including charges, payments and adjustments (single billing office (SBO)�mode only).
     */
    SBO_INS_BALANCE: number;
    /**
     * Contains combined Hospital Billing (HB)�and Professional Billing (PB) self pay balances including charges, payments and adjustments (single billing office (SBO)�mode only).
     */
    SBO_SP_BAL: number;
    /**
     * This column stores whether the hospital account has an open denial record.
     */
    OPEN_DENIAL_BDC_YN: string;
    /**
     * This column stores whether the hospital account has an open remark record.
     */
    OPEN_RMK_BDC_YN: string;
    /**
     * This column stores whether the hospital account has an open correspondence record.
     */
    OPEN_COR_BDC_YN: string;
    /**
     * This column stores the unique identifier for the user who created the hospital account.
     */
    REC_CREATE_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on REC_CREATE_USER_ID
     */
    rec_create_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    REC_CREATE_USER_ID_NAME: string;
    /**
     * This column stores the unique identifier for the user who last changed the coding status of the hospital account
     */
    CODING_USER: string;
    /**
     * The name of the user record
     */
    CODING_USER_NAME: string;
    /**
     * This field contains the date of the first self-pay balance for this account.
     */
    FIRST_SELF_PAY_DT: Date;
    /**
     * This field contains the first date when the self-pay balance equaled the full account balance for this account.
     */
    FIRST_FULL_SP_DT: Date;
    /**
     * This column stores the primary contact date (DAT) of the hospital account
     */
    PRIMARY_CONTACT: string;
    /**
     * Admit type as stored on patient record.
     */
    ADMIT_TYPE_EPT_C_NAME: string;
    /**
     * Patient Status as stored on patient record.
     */
    PAT_STS_EPT_C_NAME: string;
    /**
     * Indicates whether the hospital account has open overpayment records.
     */
    HAS_OPEN_OVRP_BD_YN: string;
    /**
     * Indicates whether this hospital account is self-pay.
     */
    SELF_PAY_YN: string;
    /**
     * For all insurance buckets of the last coverage in the filing order, the total copay specified by insurance on payments.
     */
    ACTUAL_COPAY_AMT: number;
    /**
     * For all insurance buckets of the last coverage in the filing order, the total coinsurance specified by insurance on payments.
     */
    ACTUAL_COINS_AMT: number;
    /**
     * For all insurance buckets of the last coverage in the filing order, the total deductible specified by insurance on payments.
     */
    ACTUAL_DED_AMT: number;
    /**
     * The total amount of insurance payments posted to this account, not including refunds.
     */
    TOT_INS_PMT: number;
    /**
     * The total amount of insurance adjustments posted to this account, not including refunds.
     */
    TOT_INS_ADJ: number;
    /**
     * The total amount of self-pay payments posted to this account, not including refunds.
     */
    TOT_SP_PMT: number;
    /**
     * The total amount of active AR insurance payments posted to this account, not including refunds.
     */
    TOT_AR_INS_PMT: number;
    /**
     * The total amount of active AR insurance allowance adjustments posted to this account.
     */
    TOT_AR_INS_ALLOWANCES: number;
    /**
     * The total amount of active AR self-pay payments posted to this account, not including refunds.
     */
    TOT_AR_SP_PMT: number;
    /**
     * The total insurance payment amount posted to the account, less any refunded amount.
     */
    TOT_INS_PMTS_AND_RFNDS: number;
    /**
     * The total self-pay payment amount posted to the account, less any refunded amount.
     */
    TOT_SP_PMTS_AND_RFNDS: number;
    /**
     * The total payment amount posted to the account, less any refunded amount.
     */
    TOT_PMTS_AND_RFNDS: number;
    /**
     * The total adjustment amount posted to the account, not including refund adjustments.
     */
    TOT_ADJ_EXCL_RFNDS: number;
    /**
     * The balance transferred to self-pay after insurance is taken into account
     */
    SP_RESP_AFTER_INS: number;
    /**
     * The self-pay responsibility after any self-pay or financial assistance discounts are posted on the self-pay bucket.
     */
    SP_RESP_LESS_DISCOUNT: number;
    /**
     * This column indicates whether the balances for this hospital account are entirely in self-pay
     */
    BAL_IN_FULL_SELF_PAY_YN: string;
    /**
     * This column is the original post date for the very first transaction that filed to this hospital account, even if that transaction has been reposted, transferred, or reversed.
     */
    FIRST_TX_POST_DATE: Date;
    /**
     * Collection of HSP_ACCT_ADJ_LIST as children
     */
    hsp_acct_adj_list?: HSP_ACCT_ADJ_LIST[];
    /**
     * Collection of HSP_ACCT_ADMIT_DX as children
     */
    hsp_acct_admit_dx?: HSP_ACCT_ADMIT_DX[];
    /**
     * Collection of HSP_ACCT_ATND_PROV as children
     */
    hsp_acct_atnd_prov?: HSP_ACCT_ATND_PROV[];
    /**
     * Collection of HSP_ACCT_CHG_LIST as children
     */
    hsp_acct_chg_list?: HSP_ACCT_CHG_LIST[];
    /**
     * Collection of HSP_ACCT_CL_AG_HIS as children
     */
    hsp_acct_cl_ag_his?: HSP_ACCT_CL_AG_HIS[];
    /**
     * Collection of HSP_ACCT_DX_LIST as children
     */
    hsp_acct_dx_list?: HSP_ACCT_DX_LIST[];
    /**
     * Collection of HSP_ACCT_EARSTADDR as children
     */
    hsp_acct_earstaddr?: HSP_ACCT_EARSTADDR[];
    /**
     * Collection of HSP_ACCT_EXTINJ_CD as children
     */
    hsp_acct_extinj_cd?: HSP_ACCT_EXTINJ_CD[];
    /**
     * Collection of HSP_ACCT_OCUR_HAR as children
     */
    hsp_acct_ocur_har?: HSP_ACCT_OCUR_HAR[];
    /**
     * Collection of HSP_ACCT_PYMT_LIST as children
     */
    hsp_acct_pymt_list?: HSP_ACCT_PYMT_LIST[];
}

/**
 * The ORDER_MED table enables you to report on medications ordered in EpicCare (prescriptions)
 * pk: ORDER_MED_ID
 */
export interface ORDER_MED {
    /**
     * The unique ID of the order record associated with this medication order
     */
    ORDER_MED_ID: number;
    /**
     * Reference to ORD_PRFLST_TRK based on ORDER_MED_ID
     */
    order_med?: ORD_PRFLST_TRK;
    /**
     * The unique ID of the patient record for this line
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * A unique, internal contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The unique contact serial number (CSN) for the patient contact associated with this medication order
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * The date when the medication order was placed.
     */
    ORDERING_DATE: Date;
    /**
     * The category number for the order class
     */
    ORDER_CLASS_C_NAME: string;
    /**
     * The unique ID of the pharmacy record that is associated with this medication order
     */
    PHARMACY_ID: number;
    /**
     * Reference to RX_PHR based on PHARMACY_ID
     */
    pharmacy?: RX_PHR;
    /**
     * The name of the pharmacy.
     */
    PHARMACY_ID_PHARMACY_NAME: string;
    /**
     * The EMP ID (.1) of the user who signed the order (for a non-signed and held order) or the last person who performed a sign and hold or release action for a signed and held order.
     */
    ORD_CREATR_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on ORD_CREATR_USER_ID
     */
    ord_creatr_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ORD_CREATR_USER_ID_NAME: string;
    /**
     * The unique ID of the medication record that is associated with this order
     */
    MEDICATION_ID: number;
    /**
     * Reference to CLARITY_MEDICATION based on MEDICATION_ID
     */
    medication?: CLARITY_MEDICATION;
    /**
     * The description of the order
     */
    DESCRIPTION: string;
    /**
     * The quantity of the prescription being dispensed as entered by the user.
     */
    QUANTITY: string;
    /**
     * The number of refills allowed for this prescription as entered by the user.
     */
    REFILLS: string;
    /**
     * The date when the medication order started
     */
    START_DATE: Date;
    /**
     * The date when the medication order is to end.
     */
    END_DATE: Date;
    /**
     * Indicates whether or not the prescription should be dispensed as written for this medication.
     */
    DISP_AS_WRITTEN_YN: string;
    /**
     * The category number for the reason a prescription has been discontinued
     */
    RSN_FOR_DISCON_C_NAME: string;
    /**
     * The unique ID of the provider who has prescribed or authorized the medication order
     */
    MED_PRESC_PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on MED_PRESC_PROV_ID
     */
    med_presc_prov?: CLARITY_SER;
    /**
     * The date and time when this row was created or last updated in Clarity.
     */
    UPDATE_DATE: Date;
    /**
     * The date and time the order was placed
     */
    ORDER_INST: Date;
    /**
     * The name of the medication as it appears on the medication record itself.
     */
    DISPLAY_NAME: string;
    /**
     * Indicates whether  this is a hospitalist order
     */
    HV_HOSPITALIST_YN: string;
    /**
     * The category number for the priority assigned to an order.
     */
    ORDER_PRIORITY_C_NAME: string;
    /**
     * The category number for the route of administration of a medication.
     */
    MED_ROUTE_C_NAME: string;
    /**
     * The unique ID of the user who discontinued the order.
     */
    DISCON_USER_ID: string;
    /**
     * The name of the user record
     */
    DISCON_USER_ID_NAME: string;
    /**
     * The date and time when the medication order was discontinued
     */
    DISCON_TIME: Date;
    /**
     * The unique ID of the changed or reordered medication order that this order replaced
     */
    CHNG_ORDER_MED_ID: number;
    /**
     * The unique ID of the user who approved a pended order.
     */
    PEND_APPR_USER_ID: string;
    /**
     * The name of the user record
     */
    PEND_APPR_USER_ID_NAME: string;
    /**
     * The unique ID of the discrete frequency record associated with this medication order
     */
    HV_DISCR_FREQ_ID: string;
    /**
     * The name of the frequency record.
     */
    HV_DISCR_FREQ_ID_FREQ_NAME: string;
    /**
     * The discrete dose for a medication as entered by the user in the orders activity.
     */
    HV_DISCRETE_DOSE: string;
    /**
     * The category number for the dosage unit of a medication.
     */
    HV_DOSE_UNIT_C_NAME: string;
    /**
     * The date and time when the medication order is to start
     */
    ORDER_START_TIME: Date;
    /**
     * The date and time when the medication order is scheduled to end
     */
    ORDER_END_TIME: Date;
    /**
     * The category number for the current status of an order.
     */
    ORDER_STATUS_C_NAME: string;
    /**
     * The unique ID of the provider who has prescribed or authorized the medication order
     */
    AUTHRZING_PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on AUTHRZING_PROV_ID
     */
    authrzing_prov?: CLARITY_SER;
    /**
     * The unique ID of the provider listed as the ordering provider.
     */
    ORD_PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on ORD_PROV_ID
     */
    ord_prov?: CLARITY_SER;
    /**
     * The minimum ordered dose amount for the medication as specified by the user in the orders activity.
     */
    MIN_DISCRETE_DOSE: number;
    /**
     * The category number for the dose unit of a medication.
     */
    DOSE_UNIT_C_NAME: string;
    /**
     * The medication provider type category number for the order
     */
    PROVIDER_TYPE_C_NAME: string;
    /**
     * The category number for the flag that both indicates and distinguishes whether an order was reordered or modified.
     */
    MODIFY_TRACK_C_NAME: string;
    /**
     * The category number indicating additional information about an order's status--Active, Completed, Discontinued, or Cancelled
     */
    ACT_ORDER_C_NAME: string;
    /**
     * The unique ID of the orderable medication that is evaluated for Intelligent Medication Selection (IMS)
     */
    USER_SEL_MED_ID: number;
    /**
     * The date that the medication record was actually selected by the user
     */
    USER_SEL_ERX_DAT: Date;
    /**
     * The unique ID of the medication problem list record that is associated with this medication order
     */
    MDL_ID: number;
    /**
     * Reference to MDL_MD_PRBLM_LIST based on MDL_ID
     */
    mdl?: MDL_MD_PRBLM_LIST;
    /**
     * Comments for the last administered dose of a medication entered in the medication documentation navigator section.
     */
    LASTDOSE: string;
    /**
     * The name of the ambulatory medication.
     */
    AMB_MED_DISP_NAME: string;
    /**
     * Indicates whether the dose for this medication order is based on the patient's weight.
     */
    WEIGHT_BASED_YN: string;
    /**
     * The number of refills remaining in the medication.
     */
    REFILLS_REMAINING: number;
    /**
     * The unique ID of the provider who authorized the medication refill order.
     */
    MED_REFILL_PROV_ID: string;
    /**
     * The category number for the ordering mode of the order (i.e
     */
    ORDERING_MODE_C_NAME: string;
    /**
     * The pending medication approval status category number for the order.
     */
    PEND_APPROVE_FLAG_C_NAME: string;
    /**
     * External eligibility source ID
     */
    EXT_ELG_SOURCE_ID: string;
    /**
     * External eligibility member ID
     */
    EXT_ELG_MEMBER_ID: string;
    /**
     * External formulary ID
     */
    EXT_FORMULARY_ID: string;
    /**
     * External coverage ID
     */
    EXT_COVERAGE_ID: string;
    /**
     * External pharmacy type
     */
    EXT_PHARMACY_TYPE_C_NAME: string;
    /**
     * External Formulary Status
     */
    EXT_FORMULARY_STAT: string;
    /**
     * External coverage age limits
     */
    EXT_COV_AGE_LMT_YN: string;
    /**
     * External coverage product coverage exclusion
     */
    EXT_COV_EXCLUS_YN: string;
    /**
     * External coverage gender limits
     */
    EXT_COV_SEX_LMT_YN: string;
    /**
     * External coverage medical necessity
     */
    EXT_COV_MED_NCST_YN: string;
    /**
     * External coverage prior authorization
     */
    EXT_COV_PRI_AUTH_YN: string;
    /**
     * External coverage quantity limits
     */
    EXT_COV_QNTY_LMT_YN: string;
    /**
     * External coverage resource link drug
     */
    EXT_COV_LNK_DRUG_YN: string;
    /**
     * External coverage resource link summary
     */
    EXT_COV_LNK_SMRY_YN: string;
    /**
     * External coverage step medication
     */
    EXT_COV_STEP_MED_YN: string;
    /**
     * External coverage step therapy
     */
    EXT_COV_STEP_THR_YN: string;
    /**
     * This item stores whether the product to use with IMS was selected by the user or chosen automatically
     */
    USR_SEL_IMS_YN: string;
    /**
     * The day and time the order record was last updated.
     */
    INST_OF_UPDATE_TM: Date;
    /**
     * The manner in which the medication was reordered, such as reorder from order review or reorder from the medications activity.
     */
    PEND_ACTION_C_NAME: string;
    /**
     * This item stores the discrete dispense quantity when discrete dispense is enabled.
     */
    MED_DIS_DISP_QTY: number;
    /**
     * This item stores the discrete dispense unit when discrete dispense is enabled.
     */
    MED_DIS_DISP_UNIT_C_NAME: string;
    /**
     * Indicates whether the dose for this medication order is based on the patient's body surface area (BSA).
     */
    BSA_BASED_YN: string;
    /**
     * The linked procedure ID for the medication
     */
    MED_LINKED_PROC_ID: number;
    /**
     * Reference to CLARITY_EAP based on MED_LINKED_PROC_ID
     */
    med_linked_proc?: CLARITY_EAP;
    /**
     * The real medication contact date (DAT) used in this order.
     */
    MED_CNCT_DAT_REAL: number;
    /**
     * Indicate if the volume is calculated
     */
    CALC_VOLUME_YN: string;
    /**
     * The minimum calculated administer dose.
     */
    CALC_MIN_DOSE: number;
    /**
     * The dose unit for calculated administer dose.
     */
    CALC_DOSE_UNIT_C_NAME: string;
    /**
     * The minimum administer dose.
     */
    ADMIN_MIN_DOSE: number;
    /**
     * The dose unit for administer dose.
     */
    ADMIN_DOSE_UNIT_C_NAME: string;
    /**
     * Where in the system the order was placed from.
     */
    ORDER_SOURCE_C_NAME: string;
    /**
     * A flag to indicate if this order should default discrete ambulatory medication frequency information.
     */
    DFLT_DISCRETE_FREQ_NAME: string;
    /**
     * A flag to indicate if this order should default discrete ambulatory medication dose information.
     */
    DFLT_DISCRETE_DOSE_NAME: string;
    /**
     * This is the order contact date in human readable form.
     */
    MED_CONTACT_DT: Date;
    /**
     * A flag to indicate if this order�should default discrete ambulatory medication information.
     */
    DFLT_DISCRETE_C_NAME: string;
    /**
     * The unique identifier of the SmartText record used to generate medication instructions for the patient based on order details
     */
    PT_SIG_SMARTTEXT_ID: string;
    /**
     * Reference to SMARTTEXT based on PT_SIG_SMARTTEXT_ID
     */
    pt_sig_smarttext?: SMARTTEXT;
    /**
     * The name of the SmartText record.
     */
    PT_SIG_SMARTTEXT_ID_SMARTTEXT_NAME: string;
    /**
     * This is the unique ID of the medication that is the order's dispensable product
     */
    DISPENSABLE_MED_ID: number;
    /**
     * Reference to CLARITY_MEDICATION based on DISPENSABLE_MED_ID
     */
    dispensable_med?: CLARITY_MEDICATION;
    /**
     * Indicates whether the order is a one-step medication, a medication whose administration is documented in one step.
     */
    ONE_STEP_MED_YN: string;
    /**
     * The unique ID of the order record associated with this medication order
     */
    ORDER_ID: number;
    /**
     * Reference to ORD_PRFLST_TRK based on ORDER_ID
     */
    order?: ORD_PRFLST_TRK;
    /**
     * Store the prescription written date, which is the date the prescription was entered into the system through EpicCare, or the date the prescription was written to the paper prescription.
     */
    RX_WRITTEN_DATE: Date;
    /**
     * *** Deprecated *** The data in this column does not correctly link to PAT_ENC.PAT_ENC_DATE_REAL
     */
    MED_DISCONT_ENC: number;
    /**
     * The time and date that is used as the prioritized date.
     */
    PRIORITIZED_INST_TM: Date;
    /**
     * Medication display name received from an external pharmacy.
     */
    EXT_PHARM_MED_NAME: string;
    /**
     * A flag to determine if this is an active pending medication or not.
     */
    PEND_MED_ACTIVE_YN: string;
    /**
     * The previous order ID for the pending medication
     */
    PEND_PREV_ORD_ID: string;
    /**
     * This item holds the method of transmission for a given order
     */
    ORD_TRANS_METHOD_C_NAME: string;
    /**
     * This item specifies whether the medication order is intended to be filled by the pharmacy immediately or should be filled later when requested by the patient
     */
    PROFILE_ONLY_RX_YN: string;
    /**
     * Stores the remaining authorized quantity (in Written Dispense Quantity unit) that the pharmacist can dispense
     */
    DISP_QTY_REM: number;
    /**
     * If the frequency is unscheduled, this column will store a 1
     */
    FREQ_UNSCHEDULED_C_NAME: string;
    /**
     * Sign action for pended order.
     */
    SIGN_ACTION_PEND_C_NAME: string;
    /**
     * Original prescription column; contains the medication order medication ID.
     */
    ORIG_MED_ID: number;
    /**
     * Original prescription column; contains the medication order discrete dispense quantity.
     */
    ORIG_DIS_DISP_QTY: number;
    /**
     * Original prescription column; contains the medication order discrete dispense unit.
     */
    ORIG_DISP_UNIT_C_NAME: string;
    /**
     * Original prescription column; contains the medication order 'dispense as written?' flag and is either yes or no.
     */
    ORIG_DAW_YN: string;
    /**
     * Saves the discrete medication refills information for the order.
     */
    MED_DISC_REFILLS: number;
    /**
     * Stores the prioritized instant for the result in UTC
     */
    PRIORITIZED_UTC_DTTM: Date;
    /**
     * Original prescription column; contains the medication order quantity.
     */
    ORIG_RX_QUANTITY: string;
    /**
     * Original prescription column; contains the medication directions.
     */
    ORIG_RX_DIRECTIONS: string;
    /**
     * Original prescription column; contains the medication order prescriber ID.
     */
    ORIG_RX_PRE_PROV_ID: string;
    /**
     * Contains the expiration date for the prescription.
     */
    PRESCRIP_EXP_DATE: Date;
    /**
     * Original prescription column; contains the pharmacy
     */
    ORIG_RX_PHRM_ID: number;
    /**
     * The name of the pharmacy.
     */
    ORIG_RX_PHRM_ID_PHARMACY_NAME: string;
    /**
     * Indicates whether to print a copy of this order
     */
    PRINT_LOCAL_COPY_YN: string;
    /**
     * The date and time when the medication order was placed.
     */
    ORDER_TIME: Date;
    /**
     * This column contains the user's response to the sig-related questions for previous sig reorder workflows
     */
    PAT_SIG_REPLY_C_NAME: string;
    /**
     * Holds the user ID of the user who reviewed the patient sig for accuracy
     */
    SIG_REVIEW_USER_ID: string;
    /**
     * The name of the user record
     */
    SIG_REVIEW_USER_ID_NAME: string;
    /**
     * Holds the instant that the user took action on the patient sig in previous sig workflows
     */
    SIG_REVIEW_INS_DTTM: Date;
    /**
     * Indicates the destination of e-prescribing order
     */
    EPRES_DEST_C_NAME: string;
    /**
     * This column stores the ID of the interface status of the order.
     */
    INTERFACE_STAT_C_NAME: string;
    /**
     * Indicates whether the medication order was compared to a formulary during signing
     */
    WAS_FMLY_CHECKED_YN: string;
    /**
     * The unrounded dose of this order
     */
    UNROUNDED_DOSE_MIN: number;
    /**
     * The med & dose unit category ID for the unrounded dose of this order record.
     */
    UNROUND_DOSE_UNIT_C_NAME: string;
    /**
     * Indicates whether a prior authorization request should be sent for a medication order when it is signed
     */
    SEND_PA_REQ_YN: string;
    /**
     * This item stores the instant in the patient's local time zone that an order was discontinued.
     */
    DISCON_LOCAL_TIME: Date;
    /**
     * The prescription request type category ID for the order record
     */
    RX_REQUEST_TYPE_C_NAME: string;
    /**
     * The name of an order that was electronically prescribed.
     */
    ERX_ORD_NAME: string;
    /**
     * Stores whether or not there is a pain agreement with the patient effective at the time the order was placed.
     */
    PAIN_AGREEMENT_YN: string;
    /**
     * The date and time the order was placed in UTC
     */
    ORDER_INST_UTC_DTTM: Date;
    /**
     * The calculated minimum days supply of the medication ordered
     */
    ORDERED_DAYS_SUPPLY_PER_FILL: number;
    /**
     * The encounter or visit in which the medication was discontinued.
     */
    DISCON_PAT_ENC_DATE_REAL: number;
    /**
     * Order identifier that is unique for all deployments
     */
    UNIQUE_ORDER_IDENTIFIER: string;
    /**
     * This item stores the prioritized instant (date and time) for an order in UTC time zone
     */
    PRIORITIZED_INST_UTC_DTTM: Date;
    /**
     * This item stores the prioritized instant (date and time) for an order in local time zone
     */
    PRIORITIZED_INST_DTTM: Date;
    /**
     * Indicates whether Indications of Use are present in the patient sig
     */
    ORD_SIG_HAS_IOU_YN: string;
    /**
     * The UTC instant of when the prescription was written
     */
    RX_WRITTEN_UTC_DTTM: Date;
    /**
     * Patient instructions for the prescription as entered by the user.
     */
    SIG_TEXT: string;
    /**
     * The patient's recorded weight in kilograms at the time the order was released.
     */
    WEIGHT_AT_RELEASE: number;
    /**
     * The source category ID for the patient's recorded weight at the time the order was released.
     */
    WEIGHT_REL_SOURCE_C_NAME: string;
    /**
     * The patient's recorded height in centimeters at the time the order was released.
     */
    HEIGHT_AT_RELEASE: number;
    /**
     * The source category ID for the patient's recorded height at the time the order was released.
     */
    HEIGHT_REL_SOURCE_C_NAME: string;
    /**
     * The patient's calculated body surface area (BSA) in meters squared at the time the order was released.
     */
    BSA_AT_RELEASE: number;
    /**
     * The source category ID for the patient's recorded body surface area (BSA) at the time the order was released.
     */
    BSA_REL_SOURCE_C_NAME: string;
    /**
     * Collection of MEDICATION_COST_ESTIMATES as children
     */
    medication_cost_estimates?: MEDICATION_COST_ESTIMATES[];
    /**
     * Collection of ORDER_DX_MED as children
     */
    order_dx_med?: ORDER_DX_MED[];
    /**
     * Collection of ORDER_IMAGE_AVAIL_INFO as children
     */
    order_image_avail_info?: ORDER_IMAGE_AVAIL_INFO[];
    /**
     * Collection of ORDER_RPTD_SIG_HX as children
     */
    order_rptd_sig_hx?: ORDER_RPTD_SIG_HX[];
    /**
     * Collection of ORDER_DISP_INFO as children
     */
    order_disp_info?: ORDER_DISP_INFO[];
}

/**
 * The PATIENT table contains one record for each patient in your system
 * pk: PAT_ID
 */
export interface PATIENT {
    /**
     * The unique ID of the patient record for this row
     */
    PAT_ID: string;
    /**
     * The patient�s name in the format Lastname, Firstname MI.
     */
    PAT_NAME: string;
    /**
     * The city in which the patient lives.
     */
    CITY: string;
    /**
     * The category value corresponding to the state in which the patient lives.
     */
    STATE_C_NAME: string;
    /**
     * The category value corresponding to the county in which the patient lives.
     */
    COUNTY_C_NAME: string;
    /**
     * The category value corresponding to the country in which the patient lives.
     */
    COUNTRY_C_NAME: string;
    /**
     * The ZIP Code area in which the patient lives.
     */
    ZIP: string;
    /**
     * The patient�s home phone number.
     */
    HOME_PHONE: string;
    /**
     * The patient�s e-mail address.
     */
    EMAIL_ADDRESS: string;
    /**
     * The date on which the patient was born.
     */
    BIRTH_DATE: Date;
    /**
     * The category value associated with the patient�s ethnic background.
     */
    ETHNIC_GROUP_C_NAME: string;
    /**
     * The category value associated with the patient�s religion.
     */
    RELIGION_C_NAME: string;
    /**
     * The category value associated with the patient�s language.
     */
    LANGUAGE_C_NAME: string;
    /**
     * The patient�s Social Security Number
     */
    SSN: string;
    /**
     * This column contains the value �Y� if the patient has a signed living will on file with your facility indicating how they want their health chare to be handled in the event of an incapacitating emergency
     */
    ADV_DIRECTIVE_YN: string;
    /**
     * The unique ID of the provider record for the patient�s current General Primary Care Provider as of the enterprise reporting extract
     */
    CUR_PCP_PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on CUR_PCP_PROV_ID
     */
    cur_pcp_prov?: CLARITY_SER;
    /**
     * The unique ID of the location record for the patient�s Primary Location as of the time of the enterprise reporting extract
     */
    CUR_PRIM_LOC_ID: number;
    /**
     * Reference to CLARITY_LOC based on CUR_PRIM_LOC_ID
     */
    cur_prim_loc?: CLARITY_LOC;
    /**
     * The unique ID of the system user who entered this patient�s record
     */
    CREATE_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on CREATE_USER_ID
     */
    create_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    CREATE_USER_ID_NAME: string;
    /**
     * The patient's medical record number (MRN), of the type associated with the patient's current primary location.
     */
    PAT_MRN_ID: string;
    /**
     * The unique ID of the system user who created this patient�s record
     */
    REC_CREATE_PAT_ID: string;
    /**
     * Reference to CLARITY_EMP based on REC_CREATE_PAT_ID
     */
    rec_create_pat?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    REC_CREATE_PAT_ID_NAME: string;
    /**
     * The last name of the patient.
     */
    PAT_LAST_NAME: string;
    /**
     * The first name of the patient.
     */
    PAT_FIRST_NAME: string;
    /**
     * The middle name of the patient.
     */
    PAT_MIDDLE_NAME: string;
    /**
     * This is the unique ID of the patient's employer if the item linking the patient to an employer (I EAF 6410) is set to 1
     */
    EMPLOYER_ID: string;
    /**
     * Reference to CLARITY_EEP based on EMPLOYER_ID
     */
    employer?: CLARITY_EEP;
    /**
     * The name of the employer.
     */
    EMPLOYER_ID_EMPLOYER_NAME: string;
    /**
     * The employee's employment status (e.g
     */
    EMPY_STATUS_C_NAME: string;
    /**
     * Indicates whether the patient needs an interpreter.
     */
    INTRPTR_NEEDED_YN: string;
    /**
     * Stores the last time the encounter medications list was reviewed.
     */
    MEDS_LAST_REV_TM: Date;
    /**
     * Stores the last user to review the encounter medications list.
     */
    MEDS_LST_REV_USR_ID: string;
    /**
     * Reference to CLARITY_EMP based on MEDS_LST_REV_USR_ID
     */
    meds_lst_rev_usr?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    MEDS_LST_REV_USR_ID_NAME: string;
    /**
     * Most recent date patient marked their emergency contact information as verified.
     */
    SELF_EC_VERIF_DATE: Date;
    /**
     * A free text comment that can be entered when the value that is considered to be "Other" is selected as the employer
     */
    EMPR_ID_CMT: string;
    /**
     * The category value of the patient status
     */
    PAT_STATUS_C_NAME: string;
    /**
     * Stores the contact serial number of the encounter in which the patient's current medications list was last reviewed.
     */
    MEDS_LAST_REV_CSN: number;
    /**
     * The category number corresponding to the patient's sex.
     */
    SEX_C_NAME: string;
    /**
     * Capture if patient is adopted or not.
     */
    IS_ADOPTED_YN: string;
    /**
     * The PATIENT table extracts the last date on which the patient's allergy information was verified
     */
    ALRGY_UPD_INST: Date;
    /**
     * The networked item that points to the patient's name record (EAN).
     */
    PAT_NAME_RECORD_ID: string;
    /**
     * Reference to NAMES based on PAT_NAME_RECORD_ID
     */
    pat_name_record?: NAMES;
    /**
     * Column to hold the category value of Preferred Communication Method (I EPT 89) for the Patient_2 table.
     */
    COMM_METHOD_C_ZC_COMM_METHOD_NAME: string;
    /**
     * Stores the address that will be used by default by the pharmacy when determining where to mail prescriptions
     */
    DEF_ADDRESS_C_NAME: string;
    /**
     * The category number for the country of the patient's employer.
     */
    EMPR_COUNTRY_C_NAME: string;
    /**
     * Verification record for this patient
     */
    PAT_VERIFICATION_ID: number;
    /**
     * This item stores the status of the review of allergies.
     */
    ALRGY_REV_STAT_C_NAME: string;
    /**
     * Used to store reverse National Identifier in an indexed item for patient search of partial National Identifier.
     */
    REVERSE_NATL_ID: string;
    /**
     * The latest instant in which allergies were updated.
     */
    ALRG_LAST_UPDA_DTTM: Date;
    /**
     * The preferred name for the patient.
     */
    PREFERRED_NAME: string;
    /**
     * Indicates if the patient is a transplant patient.
     */
    TXP_PAT_YN: string;
    /**
     * This column contains the source encounter where allergies were most recently reviewed
     */
    ALRGY_REV_EPT_CSN: number;
    /**
     * This column uses information from the chart to determine if the patient represents a real patient
     */
    PAT_LIVING_STAT_C_NAME: string;
    /**
     * The patient's gender identity.
     */
    GENDER_IDENTITY_C_NAME: string;
    /**
     * The ID number of the communication preferences record for the patient.
     */
    PREFERENCES_ID: number;
    /**
     * Reference to PERSON_PREFERENCES based on PREFERENCES_ID
     */
    preferences?: PERSON_PREFERENCES;
    /**
     * The user who initiated the linked address changes.
     */
    ADDR_CHG_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on ADDR_CHG_USER_ID
     */
    addr_chg_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ADDR_CHG_USER_ID_NAME: string;
    /**
     * The instant that the linked address changes were initiated.
     */
    ADDR_CHG_INSTANT_DTTM: Date;
    /**
     * The source record that initiated the linked address changes.
     */
    ADDR_CHG_SOURCE: string;
    /**
     * Denotes whether a patient is a resident of a congregate care setting such as a group home, residential treatment facility, or maternity home.
     */
    CONGREGATE_CARE_RESIDENT_YN: string;
    /**
     * Indicates whether the patient has seen the alert in MyChart or Welcome warning them that they can now enter trips that they've taken inside of the United States.
     */
    SEEN_DOMESTIC_TRAVEL_ALERT_YN: string;
    /**
     * Stores the type for the patient's preferred name.
     */
    PREFERRED_NAME_TYPE_C_NAME: string;
    /**
     * The access code status category number for the patient
     */
    PAT_ACCESS_STAT_C_NAME: string;
    /**
     * The web-based chart system status category number for the patient.
     */
    MYCHART_STATUS_C_NAME: string;
    /**
     * The unique ID of the web-based chart system patient account.
     */
    MYPT_ID: string;
    /**
     * Reference to MYC_PATIENT based on MYPT_ID
     */
    mypt?: MYC_PATIENT;
    /**
     * Date of last demographics verification by patient or his/her proxy from MyChart.
     */
    DEM_VERIF_DT: Date;
    /**
     * Date of last insurance verification by patient or his/her proxy from MyChart
     */
    INS_VERIF_DT: Date;
    /**
     * The date when race, ethnicity, and language information was last verified by the patient online using the patient portal.
     */
    R_E_L_PAT_VERIF_DT: Date;
    /**
     * This is the date the problem list was last reviewed.
     */
    PROB_LIST_REV_DATE: Date;
    /**
     * This is the time the problem list was last reviewed.
     */
    PROB_LIST_REV_TIME: Date;
    /**
     * This is the user who last reviewed the Problem List.
     */
    PROB_LIST_REVUSR_ID: string;
    /**
     * Reference to CLARITY_EMP based on PROB_LIST_REVUSR_ID
     */
    prob_list_revusr?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    PROB_LIST_REVUSR_ID_NAME: string;
    /**
     * The unique contact serial number for the patient encounter in which the problem list was last reviewed within an encounter context
     */
    PROB_REV_EPT_CSN: number;
    /**
     * Instant that external allergies were last marked as reviewed.
     */
    EXTALG_D_UTC_DTTM: Date;
    /**
     * User who last marked external allergies as reviewed.
     */
    EXTALG_D_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on EXTALG_D_USER_ID
     */
    extalg_d_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    EXTALG_D_USER_ID_NAME: string;
    /**
     * Instant that external medications were last marked as reviewed.
     */
    EXTMED_D_UTC_DTTM: Date;
    /**
     * User who last marked external medications as reviewed.
     */
    EXTMED_D_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on EXTMED_D_USER_ID
     */
    extmed_d_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    EXTMED_D_USER_ID_NAME: string;
    /**
     * Instant that external problems were last marked as reviewed.
     */
    EXTPRB_D_UTC_DTTM: Date;
    /**
     * User who last marked external problems as reviewed.
     */
    EXTPRB_D_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on EXTPRB_D_USER_ID
     */
    extprb_d_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    EXTPRB_D_USER_ID_NAME: string;
    /**
     * Instant that external immunizations were last marked as reviewed.
     */
    EXTIMM_D_UTC_DTTM: Date;
    /**
     * User who last marked external immunizations as reviewed.
     */
    EXTIMM_D_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on EXTIMM_D_USER_ID
     */
    extimm_d_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    EXTIMM_D_USER_ID_NAME: string;
    /**
     * Collection of ALLERGY_FLAG as children
     */
    allergy_flag?: ALLERGY_FLAG[];
    /**
     * Collection of HM_FORECAST_INFO as children
     */
    hm_forecast_info?: HM_FORECAST_INFO[];
    /**
     * Collection of HM_HISTORICAL_STATUS as children
     */
    hm_historical_status?: HM_HISTORICAL_STATUS[];
    /**
     * Collection of HM_HISTORY as children
     */
    hm_history?: HM_HISTORY[];
    /**
     * Collection of IDENTITY_ID as children
     */
    identity_id?: IDENTITY_ID[];
    /**
     * Collection of MEDS_REV_HX as children
     */
    meds_rev_hx?: MEDS_REV_HX[];
    /**
     * Collection of OTHER_COMMUNCTN as children
     */
    other_communctn?: OTHER_COMMUNCTN[];
    /**
     * Collection of PAT_ACCT_CVG as children
     */
    pat_acct_cvg?: PAT_ACCT_CVG[];
    /**
     * Collection of PAT_ADDL_ADDR_INFO as children
     */
    pat_addl_addr_info?: PAT_ADDL_ADDR_INFO[];
    /**
     * Collection of PAT_ADDR_CHNG_HX as children
     */
    pat_addr_chng_hx?: PAT_ADDR_CHNG_HX[];
    /**
     * Collection of PAT_ADDRESS as children
     */
    pat_address?: PAT_ADDRESS[];
    /**
     * Collection of PAT_ALLERGIES as children
     */
    pat_allergies?: PAT_ALLERGIES[];
    /**
     * Collection of PAT_CVG_FILE_ORDER as children
     */
    pat_cvg_file_order?: PAT_CVG_FILE_ORDER[];
    /**
     * Collection of PAT_EMAILADDRESS as children
     */
    pat_emailaddress?: PAT_EMAILADDRESS[];
    /**
     * Collection of PAT_EPISODE as children
     */
    pat_episode?: PAT_EPISODE[];
    /**
     * Collection of PAT_HM_CUR_GUIDE as children
     */
    pat_hm_cur_guide?: PAT_HM_CUR_GUIDE[];
    /**
     * Collection of PATIENT_ALG_UPD_HX as children
     */
    patient_alg_upd_hx?: PATIENT_ALG_UPD_HX[];
    /**
     * Collection of PATIENT_ALIAS as children
     */
    patient_alias?: PATIENT_ALIAS[];
    /**
     * Collection of PATIENT_DOCS as children
     */
    patient_docs?: PATIENT_DOCS[];
    /**
     * Collection of PATIENT_GOALS as children
     */
    patient_goals?: PATIENT_GOALS[];
    /**
     * Collection of PATIENT_HMT_STATUS as children
     */
    patient_hmt_status?: PATIENT_HMT_STATUS[];
    /**
     * Collection of PATIENT_RACE as children
     */
    patient_race?: PATIENT_RACE[];
    /**
     * Collection of PAT_IMMUNIZATIONS as children
     */
    pat_immunizations?: PAT_IMMUNIZATIONS[];
    /**
     * Collection of PAT_MEDS_HX as children
     */
    pat_meds_hx?: PAT_MEDS_HX[];
    /**
     * Collection of PAT_PCP as children
     */
    pat_pcp?: PAT_PCP[];
    /**
     * Collection of PAT_PREF_PHARMACY as children
     */
    pat_pref_pharmacy?: PAT_PREF_PHARMACY[];
    /**
     * Collection of PAT_PRIM_LOC as children
     */
    pat_prim_loc?: PAT_PRIM_LOC[];
    /**
     * Collection of PAT_PROBLEM_LIST as children
     */
    pat_problem_list?: PAT_PROBLEM_LIST[];
    /**
     * Collection of PAT_RCNT_USD_PHRMS as children
     */
    pat_rcnt_usd_phrms?: PAT_RCNT_USD_PHRMS[];
    /**
     * Collection of PAT_REL_ADDR as children
     */
    pat_rel_addr?: PAT_REL_ADDR[];
    /**
     * Collection of PAT_RELATIONSHIPS as children
     */
    pat_relationships?: PAT_RELATIONSHIPS[];
    /**
     * Collection of PROB_LIST_REV_HX as children
     */
    prob_list_rev_hx?: PROB_LIST_REV_HX[];
    /**
     * Collection of QUESR_LST_ANS_INFO as children
     */
    quesr_lst_ans_info?: QUESR_LST_ANS_INFO[];
    /**
     * Collection of QUESR_TEMP_ANSWERS as children
     */
    quesr_temp_answers?: QUESR_TEMP_ANSWERS[];
}

/**
 * This table is the primary table for hospital encounter information
 * pk: PAT_ENC_CSN_ID
 */
export interface PAT_ENC_HSP {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * The category value corresponding to the patient classification for this patient contact.
     */
    ADT_PAT_CLASS_C_NAME: string;
    /**
     * The category value corresponding to the patient status for this patient contact.
     */
    ADT_PATIENT_STAT_C_NAME: string;
    /**
     * The date and time of the expected admission for this patient contact.
     */
    EXP_ADMISSION_TIME: Date;
    /**
     * The category value corresponding to the admission source for this patient contact.
     */
    ADMIT_SOURCE_C_NAME: string;
    /**
     * The date and time that the patient was first admitted to the facility, bedded in the ED, or confirmed for an HOV for this contact, regardless of patient's base patient class.
     */
    HOSP_ADMSN_TIME: Date;
    /**
     * The category value corresponding to the (admission) confirmation status for this patient contact.
     */
    ADMIT_CONF_STAT_C_NAME: string;
    /**
     * The hospital discharge date and time for this patient contact.
     */
    HOSP_DISCH_TIME: Date;
    /**
     * The category value corresponding to the admission type for the patient contact.
     */
    HOSP_ADMSN_TYPE_C_NAME: string;
    /**
     * The category value corresponding to the discharge disposition for this patient contact.
     */
    DISCH_DISP_C_NAME: string;
    /**
     * The unique ID of the Inpatient Data Store record.
     */
    INPATIENT_DATA_ID: string;
    /**
     * Reference to IP_DATA_STORE based on INPATIENT_DATA_ID
     */
    inpatient_data?: IP_DATA_STORE;
    /**
     * The date and time during the hospital encounter when the patient first received a base patient class of outpatient.
     */
    OP_ADM_DATE: Date;
    /**
     * The event record for the hospital encounter where the patient first received a base patient class of outpatient.
     */
    OP_ADM_EVENT_ID: number;
    /**
     * Reference to CLARITY_ADT based on OP_ADM_EVENT_ID
     */
    op_adm_event?: CLARITY_ADT;
    /**
     * This field identifies the hospital area associated with the hospital unit in this patient contact.
     */
    HOSPITAL_AREA_ID: number;
    /**
     * Reference to CLARITY_LOC based on HOSPITAL_AREA_ID
     */
    hospital_area?: CLARITY_LOC;
    /**
     * A unique contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The date that the encounter was closed or completed.
     */
    ENC_CLOSED_OR_COMPLETED_DATE: Date;
    /**
     * The hospital discharge date and time in UTC.
     */
    HOSP_DISCH_UTC_DTTM: Date;
    /**
     * The hospital admission date and time in UTC.
     */
    HOSP_ADMSN_UTC_DTTM: Date;
}

/**
 * The patient encounter table contains one record for each patient encounter in your system
 * pk: PAT_ENC_CSN_ID
 */
export interface PAT_ENC {
    /**
     * The unique ID assigned to the patient record
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * A unique contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * A unique serial number for this encounter
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The unique ID of the provider record for the patient�s General Primary Care Provider as of the date of the encounter
     */
    PCP_PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on PCP_PROV_ID
     */
    pcp_prov?: CLARITY_SER;
    /**
     * The unique ID for the visit provider associated with this encounter
     */
    VISIT_PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on VISIT_PROV_ID
     */
    visit_prov?: CLARITY_SER;
    /**
     * The visit provider�s provider title (SER 5)
     */
    VISIT_PROV_TITLE_NAME: string;
    /**
     * The ID of the department for the encounter
     */
    DEPARTMENT_ID: number;
    /**
     * A flag that signifies if this encounter is closed as of the time of the enterprise reporting extract
     */
    ENC_CLOSED_YN: string;
    /**
     * The unique ID of the system user who closed the patient encounter
     */
    ENC_CLOSED_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on ENC_CLOSED_USER_ID
     */
    enc_closed_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ENC_CLOSED_USER_ID_NAME: string;
    /**
     * The date on which the patient encounter was closed.
     */
    ENC_CLOSE_DATE: Date;
    /**
     * The category value associated with the appointment status of the encounter as of the most recent enterprise reporting extract, such as 1 � Scheduled, 2 � Completed, 3 � Canceled, etc.
     */
    APPT_STATUS_C_NAME: string;
    /**
     * The unique ID of the user who canceled the appointment.
     */
    APPT_CANC_USER_ID: string;
    /**
     * The name of the user record
     */
    APPT_CANC_USER_ID_NAME: string;
    /**
     * The unique ID of the system user who checked in the patient for this encounter
     */
    CHECKIN_USER_ID: string;
    /**
     * The name of the user record
     */
    CHECKIN_USER_ID_NAME: string;
    /**
     * The date and time that the patient was first admitted to the facility, bedded in the ED, or confirmed for an HOV for this contact, regardless of patient's base patient class.
     */
    HOSP_ADMSN_TIME: Date;
    /**
     * The hospital discharge date and time for this patient contact.
     */
    HOSP_DISCHRG_TIME: Date;
    /**
     * The category value for the type of admission for this encounter.
     */
    HOSP_ADMSN_TYPE_C_NAME: string;
    /**
     * A flag used to indicate whether the appointment is scheduled in a service not covered by the patient's coverage benefits
     */
    NONCVRED_SERVICE_YN: string;
    /**
     * A flag used to indicate whether an appointment requires a referral as determined by the visit coverage
     */
    REFERRAL_REQ_YN: string;
    /**
     * The unique ID of the referral record linked to this appointment.
     */
    REFERRAL_ID: number;
    /**
     * The ID number of the guarantor account assigned to the visit at the time it is scheduled or when it is checked in
     */
    ACCOUNT_ID: number;
    /**
     * The ID number of the coverage record assigned to the visit at the time it is scheduled or when it is checked in
     */
    COVERAGE_ID: number;
    /**
     * The unique ID of the patient�s primary location as of the contact date of the encounter
     */
    PRIMARY_LOC_ID: number;
    /**
     * Reference to CLARITY_LOC based on PRIMARY_LOC_ID
     */
    primary_loc?: CLARITY_LOC;
    /**
     * The encounter form number or charge slip number assigned to this encounter
     */
    CHARGE_SLIP_NUMBER: string;
    /**
     * The dollar amount shown in the Copay Due field of the scheduling system's Check In Patient activity
     */
    COPAY_DUE: number;
    /**
     * The time this patient encounter was pulled into enterprise reporting.
     */
    UPDATE_DATE: Date;
    /**
     * The ID number of the hospital billing account assigned to the encounter.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * The ID number of the record used to determine how inpatient data is stored for the encounter.
     */
    INPATIENT_DATA_ID: string;
    /**
     * Reference to IP_DATA_STORE based on INPATIENT_DATA_ID
     */
    inpatient_data?: IP_DATA_STORE;
    /**
     * The ID number of the inpatient episode of care
     */
    IP_EPISODE_ID: number;
    /**
     * Comments entered by the provider for the contact.
     */
    CONTACT_COMMENT: string;
    /**
     * Indicates whether a call associated with a telephone encounter was initiated by the patient or by the clinic / hospital
     */
    OUTGOING_CALL_YN: string;
    /**
     * The referral ID number of the referring physician
     */
    REFERRAL_SOURCE_ID: string;
    /**
     * The name of the referral source.
     */
    REFERRAL_SOURCE_ID_REFERRING_PROV_NAM: string;
    /**
     * This is the patient's Body Mass Index, which is calculated based on the recorded height and weight.
     */
    BMI: number;
    /**
     * This is the patient's Body Surface Area, which is calculated based on the recorded height and weight.
     */
    BSA: number;
    /**
     * The instant that the After Visit Summary (AVS) was printed for this encounter.
     */
    AVS_PRINT_TM: Date;
    /**
     * Unique ID of the user who first prints out the After Visit Summary (AVS) for the encounter.
     */
    AVS_FIRST_USER_ID: string;
    /**
     * The name of the user record
     */
    AVS_FIRST_USER_ID_NAME: string;
    /**
     * The encounter medication freeze reason's category value.
     */
    ENC_MED_FRZ_RSN_C_NAME: string;
    /**
     * The date of the encounter
     */
    EFFECTIVE_DATE_DT: Date;
    /**
     * The discharge date for the encounter.
     */
    DISCHARGE_DATE_DT: Date;
    /**
     * Stores the adjudicated self-pay amount (the amount required to be paid by the patient) when determining the copay amount for the visit.
     */
    BEN_ENG_SP_AMT: number;
    /**
     * Stores the adjudicated copy amount for the visit according to the patient's coverage benefits.
     */
    BEN_ADJ_COPAY_AMT: number;
    /**
     * Flag to indicate if and how the adjudicated copay was overridden
     */
    BEN_ADJ_METHOD_C_NAME: string;
    /**
     * The ID number of the user who create the patient or encounter record.
     */
    ENC_CREATE_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on ENC_CREATE_USER_ID
     */
    enc_create_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ENC_CREATE_USER_ID_NAME: string;
    /**
     * The instant an encounter was created
     */
    ENC_INSTANT: Date;
    /**
     * The start date and time of an encounter
     */
    EFFECTIVE_DATE_DTTM: Date;
    /**
     * A status flag used to  determine whether to include data from the encounter in the SlicerDicer reporting application
     */
    CALCULATED_ENC_STAT_C_NAME: string;
    /**
     * This column links to the type of canceled appointment letter sent for this patient encounter
     */
    CAN_LET_C_NAME: number;
    /**
     * This column links to information about the Type of Supervising provider.
     */
    SUP_PROV_C_NAME: string;
    /**
     * This column contains the date and time when the supervising provider submitted his or her review
     */
    SUP_PROV_REV_TM: Date;
    /**
     * The pharmacy identifier from which the medications were requested.
     */
    MEDS_REQUEST_PHR_ID: number;
    /**
     * The name of the pharmacy.
     */
    MEDS_REQUEST_PHR_ID_PHARMACY_NAME: string;
    /**
     * This contains the patient's blood pressure that was entered during the patient encounter.
     */
    PHYS_BP: string;
    /**
     * Holds the time the vitals were taken
     */
    VITALS_TAKEN_TM: Date;
    /**
     * Stores the source of entry for the history documentation
     */
    DOC_HX_SOURCE_C_NAME: string;
    /**
     * This column links to the type of appointment letter that was sent to this patient for this patient encounter
     */
    APPT_LET_C_NAME: number;
    /**
     * If an appointment letter has been printed for this patient encounter, this column will list the date and time it was printed
     */
    APPTMT_LET_INST: Date;
    /**
     * The category value corresponding to the Admission/Discharge/Transfer (ADT) patient classification for this patient contact.
     */
    ADT_PAT_CLASS_C_NAME: string;
    /**
     * Stores "Other" Summary Blocks (non-IP, ED, OpTime)
     */
    OTHER_BLOCK_ID: number;
    /**
     * Indicates the specific type of the episode summary, whose ID is stored in I EPT 1970.
     */
    OTHER_BLOCK_TYPE_C_NAME: string;
    /**
     * If the Hospital Account Advisor is turned on, this item records the date and time that the advisor's recommendation was accepted or rejected.
     */
    HSP_ACCT_ADV_DTTM: Date;
    /**
     * Free-text field containing user entered information regarding a telephone encounter message.
     */
    TEL_ENC_MSG_RGRDING: string;
    /**
     * Indicates the priority of the routed message.
     */
    MSG_PRIORITY_C_NAME: string;
    /**
     * The name of the caller who left this message
     */
    MSG_CALLER_NAME: string;
    /**
     * Records the instant the After Visit Summary was last printed
     */
    AVS_LAST_PRINT_DTTM: Date;
    /**
     * If a patient's prescriptions or Facility-Administered Medications (FAMs) are updated (signed, modified, or discontinued; or other med reconciliation actions are changed) after the After Visit Summary (AVS) has been printed, this item is updated to hold a timestamp indicating the last time that such updates were made
     */
    MED_LIST_UPDATE_DTTM: Date;
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN: number;
    /**
     * The unique ID number of the user who completed the check out process for the patient for this encounter
     */
    CHKOUT_USER_ID: string;
    /**
     * The name of the user record
     */
    CHKOUT_USER_ID_NAME: string;
    /**
     * The bill area which should be assigned to charges created from this encounter
     */
    ENC_BILL_AREA_ID: number;
    /**
     * The record name of this bill area, financial subdivision, or financial division.
     */
    ENC_BILL_AREA_ID_BILL_AREA_NAME: string;
    /**
     * The number of unique diagnoses associated with this patient encounter
     */
    DX_UNIQUE_COUNTER: string;
    /**
     * The unique user ID of the sender of the automatically generated communications.
     */
    COMMAUTO_SENDER_ID: string;
    /**
     * The name of the user record
     */
    COMMAUTO_SENDER_ID_NAME: string;
    /**
     * The benefit record used to store discrete information about the patient's insurance benefits for this encounter.
     */
    BENEFIT_ID: number;
    /**
     * Reference to BENEFITS based on BENEFIT_ID
     */
    benefit?: BENEFITS;
    /**
     * Indicates if a visit is marked as Do Not Bill Insurance.
     */
    DO_NOT_BILL_INS_YN: string;
    /**
     * Indicates whether a visit is self-pay.
     */
    SELF_PAY_VISIT_YN: string;
    /**
     * Indicates whether the user has overridden the copay amount for this encounter.
     */
    COPAY_OVERRIDDEN_YN: string;
    /**
     * The visit number for the given contact.
     */
    VISIT_NUMBER: string;
    /**
     * The receipt number of the copay collected.
     */
    COPAY_RECEIPT_NUM: string;
    /**
     * The adjudicated coinsurance amount for the visit calculated by the benefits engine.
     */
    BEN_ADJ_COINS_AMT: number;
    /**
     * This column indicates whether the patient's tobacco usage has been verified
     */
    TOBACCO_USE_VRFY_YN: string;
    /**
     * The status of the eCheck-In for this appointment.
     */
    ECHKIN_STATUS_C_NAME: string;
    /**
     * The hospital account record used by the Professional Billing system for a given contact.
     */
    PB_VISIT_HAR_ID: number;
    /**
     * Reference to ARPB_VISITS based on PB_VISIT_HAR_ID
     */
    pb_visit_har?: ARPB_VISITS;
    /**
     * The unique ID of the department that is associated with the encounter.
     */
    ATTR_DEPARTMENT_ID: number;
    /**
     * This item indicates if an eligibility plan is currently selected for this encounter.
     */
    ELIG_PLAN_SELECT_YN: string;
    /**
     * The authorization status of an appointment based on the information stored in any authorization records linked to an appointment (EPT-23025).
     */
    APPT_AUTH_STATUS_C_NAME: string;
    /**
     * Contains the CSN of the primary interface contact for this encounter.
     */
    INTF_PRIMARY_PAT_ENC_CSN_ID: number;
    /**
     * The system-assigned number used to uniquely identify each of a given patient's encounters.
     */
    CONTACT_NUM: number;
    /**
     * The reason for no inc
     */
    RSN_FOR_NO_INC_MSG_C_NAME: string;
    /**
     * The unique ID of the thread for a telephone encounter that was sent to another user.
     */
    THREAD_ID: number;
    /**
     * The patient's response to the "are these allergies correct?" question in Welcome.
     */
    PAT_ALG_RVW_INFO_C_NAME: string;
    /**
     * The patient's response to the "are these problems correct?" question in Welcome.
     */
    PAT_PROB_RVW_INFO_C_NAME: string;
    /**
     * Collection of APPT_LETTER_RECIPIENTS as children
     */
    appt_letter_recipients?: APPT_LETTER_RECIPIENTS[];
    /**
     * Collection of ASSOCIATED_REFERRALS as children
     */
    associated_referrals?: ASSOCIATED_REFERRALS[];
    /**
     * Collection of DISCONTINUED_MEDS as children
     */
    discontinued_meds?: DISCONTINUED_MEDS[];
    /**
     * Collection of ECHKIN_STEP_INFO as children
     */
    echkin_step_info?: ECHKIN_STEP_INFO[];
    /**
     * Collection of EXT_PHARM_TYPE_COVERED as children
     */
    ext_pharm_type_covered?: EXT_PHARM_TYPE_COVERED[];
    /**
     * Collection of FAMILY_HX_STATUS as children
     */
    family_hx_status?: FAMILY_HX_STATUS[];
    /**
     * Collection of FAMILY_HX as children
     */
    family_hx?: FAMILY_HX[];
    /**
     * Collection of FRONT_END_PMT_COLL_HX as children
     */
    front_end_pmt_coll_hx?: FRONT_END_PMT_COLL_HX[];
    /**
     * Collection of HSP_ATND_PROV as children
     */
    hsp_atnd_prov?: HSP_ATND_PROV[];
    /**
     * Collection of KIOSK_QUESTIONNAIR as children
     */
    kiosk_questionnair?: KIOSK_QUESTIONNAIR[];
    /**
     * Collection of MEDICAL_HX as children
     */
    medical_hx?: MEDICAL_HX[];
    /**
     * Collection of MED_PEND_APRV_STAT as children
     */
    med_pend_aprv_stat?: MED_PEND_APRV_STAT[];
    /**
     * Collection of MYC_APPT_QNR_DATA as children
     */
    myc_appt_qnr_data?: MYC_APPT_QNR_DATA[];
    /**
     * Collection of PAT_ADDENDUM_INFO as children
     */
    pat_addendum_info?: PAT_ADDENDUM_INFO[];
    /**
     * Collection of PAT_ENC_ADMIT_DX_AUDIT as children
     */
    pat_enc_admit_dx_audit?: PAT_ENC_ADMIT_DX_AUDIT[];
    /**
     * Collection of PAT_ENC_APPT as children
     */
    pat_enc_appt?: PAT_ENC_APPT[];
    /**
     * Collection of PAT_ENC_CURR_MEDS as children
     */
    pat_enc_curr_meds?: PAT_ENC_CURR_MEDS[];
    /**
     * Collection of PAT_ENC_DOCS as children
     */
    pat_enc_docs?: PAT_ENC_DOCS[];
    /**
     * Collection of PAT_ENC_DX as children
     */
    pat_enc_dx?: PAT_ENC_DX[];
    /**
     * Collection of PAT_ENC_ELIG_HISTORY as children
     */
    pat_enc_elig_history?: PAT_ENC_ELIG_HISTORY[];
    /**
     * Collection of PAT_ENC_LETTERS as children
     */
    pat_enc_letters?: PAT_ENC_LETTERS[];
    /**
     * Collection of PAT_ENC_QNRS_ANS as children
     */
    pat_enc_qnrs_ans?: PAT_ENC_QNRS_ANS[];
    /**
     * Collection of PAT_ENC_RSN_VISIT as children
     */
    pat_enc_rsn_visit?: PAT_ENC_RSN_VISIT[];
    /**
     * Collection of PAT_ENC_SEL_PHARMACIES as children
     */
    pat_enc_sel_pharmacies?: PAT_ENC_SEL_PHARMACIES[];
    /**
     * Collection of PAT_HX_REVIEW as children
     */
    pat_hx_review?: PAT_HX_REVIEW[];
    /**
     * Collection of PAT_MYC_MESG as children
     */
    pat_myc_mesg?: PAT_MYC_MESG[];
    /**
     * Collection of PAT_REVIEW_ALLERGI as children
     */
    pat_review_allergi?: PAT_REVIEW_ALLERGI[];
    /**
     * Collection of PAT_REVIEW_PROBLEM as children
     */
    pat_review_problem?: PAT_REVIEW_PROBLEM[];
    /**
     * Collection of PAT_SOCIAL_HX_DOC as children
     */
    pat_social_hx_doc?: PAT_SOCIAL_HX_DOC[];
    /**
     * Collection of PAT_UCN_CONVERT as children
     */
    pat_ucn_convert?: PAT_UCN_CONVERT[];
    /**
     * Collection of TREATMENT_TEAM as children
     */
    treatment_team?: TREATMENT_TEAM[];
    /**
     * Collection of TREATMENT as children
     */
    treatment?: TREATMENT[];
    /**
     * Collection of PAT_ENC_LOS_DX as children
     */
    pat_enc_los_dx?: PAT_ENC_LOS_DX[];
    /**
     * Collection of PAT_HX_REV_TYPE as children
     */
    pat_hx_rev_type?: PAT_HX_REV_TYPE[];
}

/**
 * All values associated with a claim are stored in the Claim External Value record
 * pk: RECORD_ID, LINE
 */
export interface SVC_LN_INFO {
    /**
     * The unique identifier for the claim record.
     */
    RECORD_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * This item holds the earliest service date represented on the line.
     */
    LN_FROM_DT: Date;
    /**
     * This item holds a code identifying the type of procedure code reported on the line.
     */
    LN_PROC_QUAL: string;
    /**
     * This item holds the procedure code for the line.
     */
    LN_PROC_CD: string;
    /**
     * This item holds a comma delimited list of modifiers for the procedure on the line.
     */
    LN_PROC_MOD: string;
    /**
     * This item holds a code identifying the unit in which the quantity is reported.
     */
    LN_QTY_QUAL: string;
    /**
     * This item holds the quantity for the service line.
     */
    LN_QTY: number;
    /**
     * This item holds the billed amount for the line
     */
    LN_AMT: number;
    /**
     * This item holds the revenue code for the service line.
     */
    LN_REV_CD: string;
    /**
     * This item holds a revenue code specific description for the line.
     */
    LN_REV_CD_DESC: string;
    /**
     * This item holds the non-covered amount for the line.
     */
    LN_NON_CVD_AMT: number;
    /**
     * This item holds the place of service code identifying where the service on the line was performed.
     */
    LN_POS_CD: string;
    /**
     * This item holds a comma delimited list of diagnosis pointers
     */
    LN_DX_PTR: string;
    /**
     * This item holds the National Drug Code (NDC) for the service line.
     */
    LN_NDC: string;
    /**
     * This item holds the quantity associated with the National Drug Code (NDC), in terms of the units reported with the NDC.
     */
    LN_NDC_UNIT_QTY: number;
    /**
     * This item holds the units associated with the National Drug Code (NDC).
     */
    LN_NDC_UNIT: string;
    /**
     * This item indicates whether the rendering provider on the line is a person or a non-person.
     */
    LN_REND_PROV_TYP: string;
    /**
     * This item holds the rendering provider's last name (if a person) or the organization name (if a non-person).
     */
    LN_REND_NAM_LAST: string;
    /**
     * This item holds the rendering provider's first name
     */
    LN_REND_NAM_FIRST: string;
    /**
     * This item holds the rendering provider's middle name
     */
    LN_REND_NAM_MID: string;
    /**
     * This item holds the rendering provider's National Provider Identifier (NPI).
     */
    LN_REND_NPI: string;
    /**
     * This item holds the rendering provider's taxonomy code.
     */
    LN_REND_TAXONOMY: string;
    /**
     * This item holds a qualifier to distinguish between a single date (when the from and to dates are the same) and a date range (when the from and to dates are different).
     */
    LN_DATE_QUAL: string;
    /**
     * This item holds the total amount paid for the line by all payers
     */
    LN_TTL_AMT_PAID: number;
    /**
     * Reference to parent CLM_VALUES
     */
    clm_values?: CLM_VALUES;
}

/**
 * This table contains contact specific data for the IGO (Discrete Goals) master file.
 * pk: GOAL_ID, CONTACT_DATE_REAL
 */
export interface GOAL_CONTACT {
    /**
     * The unique ID for the goal record.
     */
    GOAL_ID: string;
    /**
     * The DTE contact date for the goal record.
     */
    CONTACT_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * This item holds edited user ID information.
     */
    EDIT_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on EDIT_USER_ID
     */
    edit_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    EDIT_USER_ID_NAME: string;
    /**
     * Patient CSN (contact serial number I.E
     */
    PAT_CSN: number;
    /**
     * Current status of the goal record
     */
    STATUS_C_NAME: string;
    /**
     * Instant of edit for this contact.
     */
    INSTNT_OF_EDIT_DTTM: Date;
    /**
     * Display name for the goal
     */
    DISPLAY_NAME_OT: string;
    /**
     * Indicates whether or not a goal is patient-stated.
     */
    PT_STATED_YN: string;
    /**
     * Reference to parent GOAL
     */
    goal?: GOAL;
}

/**
 * This table contains a list of all the users that have reviewed the order and whether that review was accepted or not.
 * pk: ORDER_ID, LINE
 */
export interface ORDER_REVIEW {
    /**
     * The unique identifier for the order record.
     */
    ORDER_ID: number;
    /**
     * The line count for this table is determined by the number of users who reviewed this order.
     */
    LINE: number;
    /**
     * The user that reviewed the order.
     */
    REVIEW_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on REVIEW_USER_ID
     */
    review_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    REVIEW_USER_ID_NAME: string;
    /**
     * The date and time when the order was reviewed.
     */
    REVIEWED_TIME: Date;
    /**
     * This column contains Y/N to determine if the reviewer accepted the order.
     */
    REVIEW_ACCEPTED_YN: string;
    /**
     * Reference to parent ORDER_PROC
     */
    order_proc?: ORDER_PROC;
}

/**
 * This table stores the data related to the follow up done on an Advanced Beneficiary Notice (ABN).
 * pk: NOTE_CSN_ID
 */
export interface ABN_FOLLOW_UP {
    /**
     * The contact serial number (CSN) of the contact.
     */
    NOTE_CSN_ID: number;
    /**
     * The unique ID of the note (HNO) record that contains the Advance Beneficiary Notice (ABN) information.
     */
    NOTE_ID: string;
    /**
     * Reference to HNO_INFO based on NOTE_ID
     */
    note?: HNO_INFO;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The number of this contact.
     */
    CONTACT_NUM: string;
    /**
     * The contact serial number (CSN) of the contact.
     */
    CONTACT_SERIAL_NUM: number;
    /**
     * The cosign requirement for the current note contact.
     */
    COSIGN_REQUIRED_C_NAME: string;
    /**
     * The author's linked provider record.
     */
    AUTH_LNKED_PROV_ID: string;
    /**
     * Reference to CLARITY_SER based on AUTH_LNKED_PROV_ID
     */
    auth_lnked_prov?: CLARITY_SER;
    /**
     * UTC formatted instant of entry for a note.
     */
    ENTRY_INSTANT_DTTM: Date;
    /**
     * UTC instant of update by a specific user.
     */
    UPD_AUTHOR_INS_DTTM: Date;
    /**
     * The note's specified date paired with the specified time.
     */
    SPEC_NOTE_TIME_DTTM: Date;
    /**
     * UTC formatted instant of when a note is filed.
     */
    NOTE_FILE_TIME_DTTM: Date;
    /**
     * Author's provider type on a specific contact.
     */
    AUTHOR_PRVD_TYPE_C_NAME: string;
    /**
     * The status of the note.
     */
    NOTE_STATUS_C_NAME: string;
    /**
     * The id of the user who updated this contact of the note.
     */
    UPDATE_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on UPDATE_USER_ID
     */
    update_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    UPDATE_USER_ID_NAME: string;
    /**
     * The availability status of the transcription.
     */
    TRN_DOC_AVAIL_STA_C_NAME: string;
    /**
     * The document type of the transcription.
     */
    TRN_DOC_TYPE_C_NAME: string;
    /**
     * Sensitive status of a note.
     */
    SENSITIVE_STAT_C_NAME: string;
    /**
     * The unique ID associated with the user who is the author of the note.
     */
    AUTHOR_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on AUTHOR_USER_ID
     */
    author_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    AUTHOR_USER_ID_NAME: string;
    /**
     * The format of the note text like Plain Text, Rich Text, HTML etc.
     */
    NOTE_FORMAT_C_NAME: string;
    /**
     * The instant when the note is updated by the author.
     */
    UPD_BY_AUTH_DTTM: Date;
    /**
     * The authentication status category number for this activity if this note is a transcription
     */
    AUTH_STAT_C_NAME: string;
    /**
     * Update by author instant in local format.
     */
    UPD_AUT_LOCAL_DTTM: Date;
    /**
     * Note entry instant in local format.
     */
    ENT_INST_LOCAL_DTTM: Date;
    /**
     * Note specified instant in local format.
     */
    SPEC_TIME_LOC_DTTM: Date;
    /**
     * Note file time in local format.
     */
    NOT_FILETM_LOC_DTTM: Date;
    /**
     * Contains the name of the multi-part document.
     */
    DOCUMENT_NAME: string;
    /**
     * This virtual item is populated with a category value from the note type (I HNO 50) according to the following logic:   * if the note type (I HNO 50) is populated, use the value directly * if the note type (I HNO 50) is null and the note is not ambulatory, return null   * if the note type (I HNO 50) is null and the note has an ambulatory encounter context, obtain a category from the UCN note type (I HNO 34033) and map that value to an equivalent category from the note type (I HNO 50), if possible
     */
    PRE_UCN_NOTE_TYPE_C_NAME: string;
    /**
     * Was this note contact marked as eligible for sharing with the patient when it was last saved?  Notes will only be displayed in MyChart if their most recent contact is marked for sharing
     */
    NOTE_SHARED_W_PAT_HX_YN: string;
    /**
     * Identifies what type of note this record is.
     */
    NOTE_TYPE_C_NAME: string;
    /**
     * This indicates whether or not the note is currently a pre-charted note (in appointment encounter).
     */
    IS_PRECHARTED_YN: string;
    /**
     * Collection of HNO_PLAIN_TEXT as children
     */
    hno_plain_text?: HNO_PLAIN_TEXT[];
    /**
     * Collection of NOTE_CONTENT_INFO as children
     */
    note_content_info?: NOTE_CONTENT_INFO[];
}

/**
 * This table contains data on discrete goals (IGO) records associated with a patient.
 * pk: GOAL_ID
 */
export interface GOAL {
    /**
     * The unique ID for the goal record.
     */
    GOAL_ID: string;
    /**
     * This column stores the goal template used to create this record.
     */
    GOAL_TEMPLATE_ID: number;
    /**
     * Reference to GOAL_TEMPLATES based on GOAL_TEMPLATE_ID
     */
    goal_template?: GOAL_TEMPLATES;
    /**
     * The goal template name.
     */
    GOAL_TEMPLATE_ID_GOAL_TEMPLATE_NAME: string;
    /**
     * This column stores contact date real of the goal template contact associated with this goal, stored in Epic's DTE format.
     */
    GOAL_TEMPLATE_CDR: number;
    /**
     * The user ID of the person who entered this goal.
     */
    USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on USER_ID
     */
    user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    USER_ID_NAME: string;
    /**
     * Stores the Goal Template Contact
     */
    GOAL_TEMPLATE_DAT: number;
    /**
     * The unique ID of the patient who is associated with this goal.
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * The instant this goal was created.
     */
    CREATE_INST_DTTM: Date;
    /**
     * Context in which the goal is used.
     */
    GOAL_USAGE_C_NAME: string;
    /**
     * Contains a category value denoting whether or not the most recent compliance value is compliant
     */
    REC_VAL_COMPLIAN_YN: string;
    /**
     * Contains the most recent compliance value for the goal
     */
    MOST_RECENT_VALUE: string;
    /**
     * The instant that the most recent compliance value was recorded
     */
    RECENT_VALUE_I_DTTM: Date;
    /**
     * The instant that this goal was checked to determine its most recent compliance value
     */
    REC_VALUE_CHEC_DTTM: Date;
    /**
     * Ambulatory goal type category (for example, Blood Pressure, Diet, etc.).
     */
    AMB_GOAL_TYPE_C_NAME: string;
    /**
     * The current status of the goal.
     */
    GOAL_STATUS_C_NAME: string;
    /**
     * Collection of GOAL_CONTACT as children
     */
    goal_contact?: GOAL_CONTACT[];
}

/**
 * The DOC_INFORMATION table contains information about documents, including scanned and electronically signed documents.
 * pk: DOC_INFO_ID
 */
export interface DOC_INFORMATION {
    /**
     * The unique ID of the document information record.
     */
    DOC_INFO_ID: string;
    /**
     * The type of document described by this document information.
     */
    DOC_INFO_TYPE_C_NAME: string;
    /**
     * The current status of the document described by this document information.
     */
    DOC_STAT_C_NAME: string;
    /**
     * A short free text description of the document described by this document information.
     */
    DOC_DESCR: string;
    /**
     * The date and time the document described by this document information was received.
     */
    DOC_RECV_TIME: Date;
    /**
     * The employee who received the document described by this document information
     */
    RECV_BY_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on RECV_BY_USER_ID
     */
    recv_by_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    RECV_BY_USER_ID_NAME: string;
    /**
     * Specifies whether there is a scanned image version of the document described by this document information.
     */
    IS_SCANNED_YN: string;
    /**
     * The date and time the document described by this document information was scanned.
     */
    SCAN_TIME: Date;
    /**
     * The employee who scanned the document described by this document information
     */
    SCAN_BY_USER_ID: string;
    /**
     * The name of the user record
     */
    SCAN_BY_USER_ID_NAME: string;
    /**
     * The department where the document described by this document information was scanned.
     */
    SCAN_DEP_ID: number;
    /**
     * The file name of the scanned image version of the document described by this document information.
     */
    SCAN_FILE: string;
    /**
     * The unique ID of the patient associated with the document record.
     */
    DOC_PT_ID: string;
    /**
     * Reference to PATIENT based on DOC_PT_ID
     */
    doc_pt?: PATIENT;
    /**
     * This stores the contact serial number of the encounter that this record is attached to, if applicable.
     */
    DOC_CSN: number;
    /**
     * The unique ID of the note record associated with this document.
     */
    DOC_HNO_ID: string;
    /**
     * This item stores the id of the workstation where the document was scanned.
     */
    SCAN_LWS_ID: string;
    /**
     * The service date and time of the document.
     */
    DOC_SRVC_DTTM: Date;
    /**
     * This item stores the most clinically relevant date for the document
     */
    SCAN_INST_DTTM: Date;
    /**
     * The level at which the document is attached to the patient's record
     */
    DOC_STORAGE_LVL_C_NAME: string;
    /**
     * The department where this document was created.
     */
    DOC_CREAT_DEPT_ID: number;
    /**
     * This item stores the desktop integration (FDI) record that was used for scanning the document.
     */
    DOC_SRVR_NAME_C_NAME: string;
    /**
     * Determines the source of the document rather than the document's type.
     */
    DOC_SOURCE_INFO_C_NAME: string;
    /**
     * The unique identifier (.1 item) for the document record.
     */
    DOCUMENT_ID: string;
    /**
     * The blob category for the document.
     */
    BLOB_CATEGORY_C_NAME: string;
    /**
     * Stores the timestamp in HL7 format of when the file was created on the blob or DMS server.
     */
    FILE_CREATION_TIME: string;
    /**
     * Timestamp in HL7 format of when the image was last updated.
     */
    FILE_LAST_UPD_TIME: string;
    /**
     * Mime type of the image/document.
     */
    FILE_TYPE: string;
    /**
     * Collection of DOC_CSN_REFS as children
     */
    doc_csn_refs?: DOC_CSN_REFS[];
    /**
     * Collection of DOC_LINKED_PAT_CSNS as children
     */
    doc_linked_pat_csns?: DOC_LINKED_PAT_CSNS[];
    /**
     * Collection of DOC_LINKED_PATS as children
     */
    doc_linked_pats?: DOC_LINKED_PATS[];
}

/**
 * Tracking info for orders coming from a preference list or order template
 * pk: ORDER_ID
 */
export interface ORD_PRFLST_TRK {
    /**
     * The unique identifier for the order record.
     */
    ORDER_ID: number;
    /**
     * OTL ID (order template)
     */
    ORDER_TMPLTE_OTL_I: string;
    /**
     * Flag whether this order is modified from its order template.
     */
    MOD_FROM_OTL_YN: string;
    /**
     * Weight used for dosing
     */
    ORD_DOSING_WEIGHT: number;
    /**
     * The instant at which the weight was recorded.
     */
    ORD_DW_REC_DTTM: Date;
    /**
     * This column contains the source of the patient weight used for dosing patient-controlled analgesia (PCA) medication.
     */
    ORD_WT_SOURCE_C_NAME: string;
    /**
     * Generated comment for dosing weight.
     */
    ORD_WT_COMMENTS: string;
    /**
     * This column contains the patient height used for dosing PCA medication
     */
    ORD_DOSING_HEIGHT: number;
    /**
     * The instant at which the height was recorded.
     */
    ORD_HT_REC_DTTM: Date;
    /**
     * This column contains the source of the patient height used for dosing patient-controlled analgesia (PCA) medication.
     */
    ORD_HT_SOURCE_C_NAME: string;
    /**
     * Generated comment for dosing height.
     */
    ORD_HT_COMMENTS: string;
    /**
     * The body surface area used for dosing.
     */
    ORD_DOSING_BSA: number;
    /**
     * This column contains the source of the body surface area used for dosing patient-controlled analgesia (PCA) medication.
     */
    ORD_BSA_SRC_C_NAME: string;
    /**
     * The dosing body surface area calculation details with weight, height and recorded instants.
     */
    ORD_BSA_CALC_DTL: string;
    /**
     * The original (uncapped) BSA of an order
     */
    ORD_DOSING_BSA_ORIG: number;
    /**
     * Collection of ORD_CLIN_IND as children
     */
    ord_clin_ind?: ORD_CLIN_IND[];
    /**
     * Collection of ORDER_PENDING as children
     */
    order_pending?: ORDER_PENDING[];
    /**
     * Collection of ORDER_STATUS as children
     */
    order_status?: ORDER_STATUS[];
    /**
     * Collection of ORDER_SUMMARY as children
     */
    order_summary?: ORDER_SUMMARY[];
    /**
     * Collection of ORD_INDICATIONS as children
     */
    ord_indications?: ORD_INDICATIONS[];
    /**
     * Collection of ORD_MED_ADMININSTR as children
     */
    ord_med_admininstr?: ORD_MED_ADMININSTR[];
    /**
     * Collection of ORD_MED_USER_ADMIN as children
     */
    ord_med_user_admin?: ORD_MED_USER_ADMIN[];
    /**
     * Collection of ORD_PROC_INSTR as children
     */
    ord_proc_instr?: ORD_PROC_INSTR[];
    /**
     * Collection of ORD_SPEC_QUEST as children
     */
    ord_spec_quest?: ORD_SPEC_QUEST[];
}

/**
 * The PAT_ENC_LOS_DX table enables you to report on the diagnoses associated with the level of service (LOS) entered for a patient encounter
 * pk: PAT_ENC_CSN_ID, LINE
 */
export interface PAT_ENC_LOS_DX {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number for the information associated with this contact
     */
    LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The unique identifier of the diagnosis associated with the Level of Service (LOS)
     */
    DX_UNIQUE: string;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * This table contains information on procedures associated with referrals
 * pk: REFERRAL_ID, LINE
 */
export interface REFERRAL_PX {
    /**
     * The unique ID of the referral in database.
     */
    REFERRAL_ID: number;
    /**
     * The line number of the procedure associated with the referral
     */
    LINE: number;
    /**
     * The unique ID of the procedure associated with the referral
     */
    PX_ID: number;
    /**
     * Reference to CLARITY_EAP based on PX_ID
     */
    px?: CLARITY_EAP;
    /**
     * The number of units of this procedure that were requested
     */
    UNITS_REQUESTED: number;
    /**
     * The number of units of this procedure that were approved
     */
    UNITS_APPROVED: number;
    /**
     * The ID of a coverage that is valid for the referral.
     */
    CVG_ID: number;
    /**
     * Reference to COVERAGE based on CVG_ID
     */
    cvg?: COVERAGE;
    /**
     * A yes/no flag that indicates whether or not the coverage should be considered available for the referral use in non-UM (utilization management) workflows
     */
    CVG_USED_YN: string;
    /**
     * The carrier authorization number or comment, indicating that authorization was received.
     */
    CARRIER_AUTH_CMT: string;
    /**
     * Flag to specify if the referral & coverage are using charge counting.
     */
    USE_CHARGE_COUNT_YN: string;
    /**
     * Reference to parent REFERRAL
     */
    referral?: REFERRAL;
}

/**
 * This table contains the information recorded in billing system account contact for each account
 * pk: ACCOUNT_ID, LINE
 */
export interface ACCOUNT_CONTACT {
    /**
     * The unique ID for the account record
     */
    ACCOUNT_ID: number;
    /**
     * Line number to identify the account contact information within the account.
     */
    LINE: number;
    /**
     * The date the contact was recorded.
     */
    CONTACT_DATE: Date;
    /**
     * The ID of the system user who recorded the contact
     */
    USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on USER_ID
     */
    user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    USER_ID_NAME: string;
    /**
     * The category value associated with the activity performed by collections staff on the account, such as No Contact, Check Mailed, Promised Payment, etc.
     */
    CONTACT_STATUS_C_NAME: string;
    /**
     * Follow-up current insurance balance.
     */
    FOL_UP_CUR_INS_BAL: number;
    /**
     * Follow-up current patient balance.
     */
    FOL_UP_CUR_PAT_BAL: number;
    /**
     * The letter status category ID for the guarantor, for example "queued" or "sent".
     */
    LETTER_STATUS_C_NAME: string;
    /**
     * The ID of the note associated with this contact.
     */
    NOTE_ID: string;
    /**
     * Each guarantor account may have a follow-up note posted to it per contact
     */
    FOL_UP_NOTE: string;
    /**
     * The name of the letter.
     */
    LETTER_NAME: string;
    /**
     * The unique ID for the account record
     */
    ACCT_ID: number;
    /**
     * Reference to ACCOUNT based on ACCT_ID
     */
    acct?: ACCOUNT;
    /**
     * The source workflow category ID that set up the payment plan for the guarantor.
     */
    PAY_PLAN_SOURCE_C_NAME: string;
    /**
     * Reference to parent ACCOUNT
     */
    account?: ACCOUNT;
}

/**
 * This table stores information for each Image Database (IMD) record
 * pk: IMAGE_ID
 */
export interface CL_REMIT {
    /**
     * This is the ID for the remittance image record
     */
    IMAGE_ID: string;
    /**
     * The date when the remittance image record was created (i.e., when the electronic file was loaded and created).
     */
    CREATION_DATE: Date;
    /**
     * The service area of the invoice to which this remittance payment was posted.
     */
    SERVICE_AREA_ID: number;
    /**
     * Reference to CLARITY_SA based on SERVICE_AREA_ID
     */
    service_area?: CLARITY_SA;
    /**
     * The posting method by which this remittance record was created (manual or through electronic remittance).
     */
    PAYMENT_METHOD_C_NAME: string;
    /**
     * The payment type for this remittance record (self-pay or insurance).
     */
    PAYMENT_TYPE_C_NAME: string;
    /**
     * Reference remittance record for general remittance file information
     */
    REF_IMG_ID: string;
    /**
     * The patient from the invoice to which the payment in the remittance image record is posted.
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * The starting date of the claim that was sent out to the payer.
     */
    CLM_START_DATE: Date;
    /**
     * The ending date of the claim that was sent out to the payer.
     */
    CLM_END_DATE: Date;
    /**
     * Internal ID of the claim record (for Hospital Billing only).
     */
    CLP_ID: number;
    /**
     * Specifies the type of Remittance Image
     */
    IMD_TYPE_C_NAME: string;
    /**
     * The invoice number for the remittance image.
     */
    INV_NO: string;
    /**
     * This is the code identifying the status of an entire claim.
     */
    CLM_STAT_CD_C_NAME: string;
    /**
     * This is the amount for submitted charges on this claim.
     */
    CLAIM_CHRG_AMT: number;
    /**
     * This is the amount paid on the claim.
     */
    CLAIM_PAID_AMT: number;
    /**
     * This is the patient responsibility amount for the claim.
     */
    PAT_RESP_AMT: number;
    /**
     * This is a code identifying the type of claim.
     */
    CLM_FILING_CODE_C_NAME: string;
    /**
     * This is the payer's internal control number for the claim.
     */
    ICN_NO: string;
    /**
     * This is the facility code used when the submitted code has been modified through adjudication.
     */
    FAC_CODE_VAL: string;
    /**
     * This is the frequency code of the claim.
     */
    CLAIM_FREQ_C_NAME: string;
    /**
     * The diagnosis related group weight.
     */
    DRG_WGT: number;
    /**
     * Contains the actual invoice number that came in the file.
     */
    FILE_INV_NUM: string;
    /**
     * Collection of CL_RMT_CLM_DT_INFO as children
     */
    cl_rmt_clm_dt_info?: CL_RMT_CLM_DT_INFO[];
    /**
     * Collection of CL_RMT_CLM_ENTITY as children
     */
    cl_rmt_clm_entity?: CL_RMT_CLM_ENTITY[];
    /**
     * Collection of CL_RMT_HC_RMK_CODE as children
     */
    cl_rmt_hc_rmk_code?: CL_RMT_HC_RMK_CODE[];
    /**
     * Collection of CL_RMT_SVC_AMT_INF as children
     */
    cl_rmt_svc_amt_inf?: CL_RMT_SVC_AMT_INF[];
    /**
     * Collection of CL_RMT_SVC_LVL_ADJ as children
     */
    cl_rmt_svc_lvl_adj?: CL_RMT_SVC_LVL_ADJ[];
    /**
     * Collection of CL_RMT_SVCE_LN_INF as children
     */
    cl_rmt_svce_ln_inf?: CL_RMT_SVCE_LN_INF[];
}

/**
 * The SOCIAL_HX table contains social history data for each history encounter stored in your system
 * pk: PAT_ENC_CSN_ID
 */
export interface SOCIAL_HX {
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * Y if the patient uses cigarettes
     */
    CIGARETTES_YN: string;
    /**
     * Y if the patient smokes a pipe
     */
    PIPES_YN: string;
    /**
     * Y if the patient uses cigars
     */
    CIGARS_YN: string;
    /**
     * Y if the patient uses snuff
     */
    SNUFF_YN: string;
    /**
     * Y if the patient uses chewing tobacco
     */
    CHEW_YN: string;
    /**
     * Free-text comments regarding the patient�s use of alcohol.
     */
    ALCOHOL_COMMENT: string;
    /**
     * Y if the patient is an IV drug user
     */
    IV_DRUG_USER_YN: string;
    /**
     * Free-text comments regarding the patient�s use of illicit drugs.
     */
    ILLICIT_DRUG_CMT: string;
    /**
     * Y if the patient has a female sexual partner
     */
    FEMALE_PARTNER_YN: string;
    /**
     * Y if the patient has a male sexual partner
     */
    MALE_PARTNER_YN: string;
    /**
     * Y if the patient uses a condom during sexual activity
     */
    CONDOM_YN: string;
    /**
     * Y if the patient uses birth control pills
     */
    PILL_YN: string;
    /**
     * Y if the patient uses a diaphragm
     */
    DIAPHRAGM_YN: string;
    /**
     * Y if the patient uses an IUD
     */
    IUD_YN: string;
    /**
     * Y if the patient uses a surgical method of birth control such as hysterectomy, vasectomy, or tubal-ligation
     */
    SURGICAL_YN: string;
    /**
     * Y if the patient uses spermicide
     */
    SPERMICIDE_YN: string;
    /**
     * Y if the patient uses an implant as a form of birth control
     */
    IMPLANT_YN: string;
    /**
     * Y if the patient uses the rhythm method as a form of birth control
     */
    RHYTHM_YN: string;
    /**
     * Y if the patient uses an injection as a form of birth control
     */
    INJECTION_YN: string;
    /**
     * Y if the patient uses a sponge as a form of birth control
     */
    SPONGE_YN: string;
    /**
     * Y if the patient uses inserts as a form of birth control
     */
    INSERTS_YN: string;
    /**
     * Y if the patient practices abstinence
     */
    ABSTINENCE_YN: string;
    /**
     * A unique serial number for this encounter
     */
    PAT_ENC_CSN_ID: number;
    /**
     * Reference to PAT_ENC based on PAT_ENC_CSN_ID
     */
    pat_enc_csn?: PAT_ENC;
    /**
     * Source for Tobacco History
     */
    TOB_SRC_C_NAME: string;
    /**
     * This columns stores the person (e.g
     */
    ALCOHOL_SRC_C_NAME: string;
    /**
     * This columns stores the person (e.g
     */
    DRUG_SRC_C_NAME: string;
    /**
     * This columns stores the person (e.g
     */
    SEX_SRC_C_NAME: string;
    /**
     * The Contact Serial Number of the encounter in which the history was created/edited
     */
    HX_LNK_ENC_CSN: number;
    /**
     * The category value associated with the patient's alcohol use
     */
    ALCOHOL_USE_C_NAME: string;
    /**
     * The category value associated with the patient's use of illicit drugs
     */
    ILL_DRUG_USER_C_NAME: string;
    /**
     * The category value associated with the patient's sexual activity
     */
    SEXUALLY_ACTIVE_C_NAME: string;
    /**
     * The category value associated with the patient's tobacco use
     */
    TOBACCO_USER_C_NAME: string;
    /**
     * Stores the patient's usage of smokeless tobacco
     */
    SMOKELESS_TOB_USE_C: number;
    /**
     * Stores the patient's usage of smoking tobacco
     */
    SMOKING_TOB_USE_C: number;
    /**
     * Y if the patient's family history is unknown by the patient
     */
    UNKNOWN_FAM_HX_YN: string;
    /**
     * A unique contact date in decimal format
     */
    PAT_ENC_DATE_REAL: number;
    /**
     * Collection of SOCIAL_ADL_HX as children
     */
    social_adl_hx?: SOCIAL_ADL_HX[];
    /**
     * Collection of SURGICAL_HX as children
     */
    surgical_hx?: SURGICAL_HX[];
}

/**
 * This table contains dispense information for orders.
 * pk: ORDER_MED_ID, CONTACT_DATE_REAL
 */
export interface ORDER_DISP_INFO {
    /**
     * The unique ID of the order that these actions were taken on.
     */
    ORDER_MED_ID: number;
    /**
     * A unique, internal contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The unique identifier (.1 item) for the order record.
     */
    ORDER_ID: number;
    /**
     * Reference to ORDER_MED based on ORDER_ID
     */
    order?: ORDER_MED;
    /**
     * Reference to parent ORDER_MED
     */
    order_med?: ORDER_MED;
}

/**
 * This table contains information types of history that were reviewed for a patient, such as Medical, Surgical, Socioeconomic, Alcohol, Tobacco, etc.





Where in the application a type of history was reviewed is in the PAT_HX_REV_TOPIC table.





Additional information about when a patient's history was reviewed and by whom is found in the PAT_HX_REVIEW table.
 * pk: PAT_ENC_CSN_ID, GROUP_LINE, VALUE_LINE
 */
export interface PAT_HX_REV_TYPE {
    /**
     * The unique contact serial number for this contact
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The line number of the associated instance of history review in this encounter
     */
    GROUP_LINE: number;
    /**
     * The line number of one of the multiple history types that were reviewed for the associated instance of review and encounter from the PAT_HX_REVIEW table.
     */
    VALUE_LINE: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The category value associated with the type of History Visit Navigator topic that was reviewed, such as Medical, Surgical, Socioeconomic, etc.
     */
    HX_REVIEWED_TYPE_C_NAME: string;
    /**
     * The header (a short title or description) and possibly, depending where in the application the history was reviewed, a unique record ID that describe where the history was reviewed.
     */
    HX_REVIEWED_HEADER: string;
    /**
     * Reference to parent PAT_ENC
     */
    pat_enc?: PAT_ENC;
}

/**
 * This table stores the answers to the timeout questions.
 * pk: RECORD_ID, CONTACT_DATE_REAL
 */
export interface TIMEOUT_ANSWERS {
    /**
     * The unique identifier for the timeout record.
     */
    RECORD_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The contact serial number (CSN) of the contact.
     */
    CONTACT_SERIAL_NUM: number;
    /**
     * This stores the contact number for the contact.
     */
    CONTACT_NUM: number;
    /**
     * Stores the instant of entry when a record is edited
     */
    INSTANT_OF_ENT_DTTM: Date;
    /**
     * Reference to parent TIMEOUT
     */
    timeout?: TIMEOUT;
}

/**
 * This table contains information about professional billing transactions.
 * pk: TX_ID
 */
export interface ARPB_TRANSACTIONS {
    /**
     * A transaction's unique internal identification number
     */
    TX_ID: number;
    /**
     * The date when a transaction is entered into the billing system
     */
    POST_DATE: Date;
    /**
     * The date a medical service is performed.
     */
    SERVICE_DATE: Date;
    /**
     * The type of this transaction: Charge, payment or adjustment.
     */
    TX_TYPE_C_NAME: string;
    /**
     * The internal ID of the record that maintains the patient's transactions
     */
    ACCOUNT_ID: number;
    /**
     * Reference to ACCOUNT based on ACCOUNT_ID
     */
    account?: ACCOUNT;
    /**
     * This column contains a 1 if the transaction is a debit and a -1 if the transaction is a credit
     */
    DEBIT_CREDIT_FLAG_NAME: string;
    /**
     * The internal identifier of the provider who performed the medical services on the patient.
     */
    SERV_PROVIDER_ID: string;
    /**
     * The billing provider associated with the transaction.
     */
    BILLING_PROV_ID: string;
    /**
     * The department ID of the department associated with the transaction.
     */
    DEPARTMENT_ID: number;
    /**
     * Reference to CLARITY_DEP based on DEPARTMENT_ID
     */
    department?: CLARITY_DEP;
    /**
     * The place of service ID of the place of service associated with the transaction
     */
    POS_ID: number;
    /**
     * The location ID of the location associated with the transaction.
     */
    LOC_ID: number;
    /**
     * Reference to CLARITY_LOC based on LOC_ID
     */
    loc?: CLARITY_LOC;
    /**
     * The service area ID of the service area associated with the transaction.
     */
    SERVICE_AREA_ID: number;
    /**
     * Reference to CLARITY_SA based on SERVICE_AREA_ID
     */
    service_area?: CLARITY_SA;
    /**
     * The first procedure modifier associated with this transaction
     */
    MODIFIER_ONE: string;
    /**
     * The primary diagnosis ID associated with the transaction.
     */
    PRIMARY_DX_ID: number;
    /**
     * The second diagnosis ID associated with the transaction.
     */
    DX_TWO_ID: number;
    /**
     * The third diagnosis ID associated with the transaction.
     */
    DX_THREE_ID: number;
    /**
     * The fourth diagnosis ID associated with the transaction.
     */
    DX_FOUR_ID: number;
    /**
     * The quantity as entered in Charge Entry for the procedure of this transaction (TX_ID)
     */
    PROCEDURE_QUANTITY: number;
    /**
     * The original amount of this transaction.
     */
    AMOUNT: number;
    /**
     * The outstanding amount of the transaction.
     */
    OUTSTANDING_AMT: number;
    /**
     * The insurance portion of the transaction.
     */
    INSURANCE_AMT: number;
    /**
     * The patient or self-pay portion of the transaction.
     */
    PATIENT_AMT: number;
    /**
     * If this transaction is voided, this column will have the date in which this transaction is voided.
     */
    VOID_DATE: Date;
    /**
     * This column contains the most recent date when an action is performed on this transaction.
     */
    LAST_ACTION_DATE: Date;
    /**
     * This column contains the provider specialty of the provider associated with the transaction
     */
    PROV_SPECIALTY_C_NAME: string;
    /**
     * The Procedure ID of the procedure associated with the transaction.
     */
    PROC_ID: number;
    /**
     * Reference to CLARITY_EAP based on PROC_ID
     */
    proc?: CLARITY_EAP;
    /**
     * This column contains the total amount matched to the transaction, including adjustments.
     */
    TOTAL_MATCH_AMT: number;
    /**
     * This column contains the total insurance amount matched to the transaction, including adjustments.
     */
    TOTAL_MTCH_INS_AMT: number;
    /**
     * This column contains the total adjustment amount matched to the transaction.
     */
    TOTAL_MTCH_ADJ: number;
    /**
     * This column contains the total insurance adjustment amount matched to the transaction.
     */
    TOTAL_MTCH_INS_ADJ: number;
    /**
     * This is the repost source transaction.
     */
    REPOST_ETR_ID: number;
    /**
     * The repost type category ID for the transaction.
     */
    REPOST_TYPE_C_NAME: string;
    /**
     * The encounter form number corresponding to the charge transaction
     */
    ENC_FORM_NUM: string;
    /**
     * Stores the adjudicated self-pay amount calculated by the benefits engine
     */
    BEN_SELF_PAY_AMT: number;
    /**
     * Stores the copay part of the adjudicated self-pay amount calculated by the benefits engine
     */
    BEN_ADJ_COPAY_AMT: number;
    /**
     * This item stores the visit number for this transaction.
     */
    VISIT_NUMBER: string;
    /**
     * This item stores the original payor (EPM) ID for this transaction.
     */
    ORIGINAL_EPM_ID: number;
    /**
     * This item stores the original financial class for this transaction.
     */
    ORIGINAL_FC_C_NAME: string;
    /**
     * This item stores the original coverage (CVG) ID for this transaction.
     */
    ORIGINAL_CVG_ID: number;
    /**
     * This item stores the current payor (EPM) ID for this transaction.
     */
    PAYOR_ID: number;
    /**
     * This item stores the current coverage (CVG) ID for this transaction.
     */
    COVERAGE_ID: number;
    /**
     * This item stores the assignment flag for a coverage
     */
    ASGN_YN: string;
    /**
     * This item stores the facility (EAF) ID for this transaction.
     */
    FACILITY_ID: number;
    /**
     * Reference to CLARITY_SA based on FACILITY_ID
     */
    facility?: CLARITY_SA;
    /**
     * This item stores the payment source for credit transactions
     */
    PAYMENT_SOURCE_C_NAME: string;
    /**
     * This item stores the user who posted the transaction.
     */
    USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on USER_ID
     */
    user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    USER_ID_NAME: string;
    /**
     * Indicates whether the transaction is marked for do not bill insurance.
     */
    NOT_BILL_INS_YN: string;
    /**
     * This item stores the universal charge line (UCL) ID for this transaction.
     */
    CHG_ROUTER_SRC_ID: string;
    /**
     * Networked to BIL: the Bill Area for this transaction.
     */
    BILL_AREA_ID: number;
    /**
     * The record name of this bill area, financial subdivision, or financial division.
     */
    BILL_AREA_ID_BILL_AREA_NAME: string;
    /**
     * The module that creates a payment or credit adjustment
     */
    CREDIT_SRC_MODULE_C_NAME: string;
    /**
     * The date that this row was last updated.
     */
    UPDATE_DATE: Date;
    /**
     * The most recent date that this transaction has been on an accepted claim run.
     */
    CLAIM_DATE: Date;
    /**
     * This item stores the original invoice number that user posts to in GUI payment posting or remittance.
     */
    IPP_INV_NUMBER: string;
    /**
     * This item stores the original invoice ID that user posts to in�graphical user interface�(GUI) payment posting or remittance.
     */
    IPP_INV_ID: number;
    /**
     * Reference to INVOICE based on IPP_INV_ID
     */
    ipp_inv?: INVOICE;
    /**
     * Displays the enterprise payment total amount.
     */
    EB_PMT_TOTAL_AMT: number;
    /**
     * This item indicates whether the visit has been marked as do not bill insurance.
     */
    VST_DO_NOT_BIL_I_YN: string;
    /**
     * The transaction entered instant (date and time in UTC) for manually posted payments
     */
    TX_ENTERED_INSTANT_DTTM: Date;
    /**
     * This column contains the coverage plan associated with the invoice number stamped on an insurance payment or credit adjustment.
     */
    CVG_PLAN_ON_PMT_ID: number;
    /**
     * The most recent date on which the transaction was held from the Professional Billing statement processing.
     */
    STMT_HOLD_DT: Date;
    /**
     * The reason why the transaction was held in PB statement processing.
     */
    STMT_HOLD_REASON_C_NAME: string;
    /**
     * If this transaction was reposted from another, this contains the category value of the reason the transaction was reposted.
     */
    REPOST_REASON_C_NAME: string;
    /**
     * The status of an outstanding claim that is attached to a transaction.
     */
    OUTST_CLM_STAT_C_NAME: string;
    /**
     * Place of service type for a charge transaction.
     */
    POS_TYPE_C_NAME: string;
    /**
     * This column returns the type of an inactive transaction
     */
    INACTIVE_TYPE_C_NAME: string;
    /**
     * The total amount owed from insurance at the time a charge was voided
     */
    VOIDED_INS_AMT: number;
    /**
     * Basic indicator of whether a provider was in or out of network on the service date of a transaction
     */
    PROV_NETWORK_STAT_C_NAME: string;
    /**
     * The provider's level of network involvement category ID for the transaction.
     */
    NETWORK_LEVEL_C_NAME: string;
    /**
     * Stores the adjustment category of the associated adjustment code when the credit adjustment is posted.
     */
    ADJUSTMENT_CAT_C_NAME: string;
    /**
     * The reason a credit adjustment was posted
     */
    WRITE_OFF_RSN_C_NAME: string;
    /**
     * Permanent transaction indicator used during repost/correct/retro to determine if the charge's price was originally overridden.
     */
    MANUAL_PRICE_OVRIDE_YN: string;
    /**
     * Indicates whether or not this is a pre-service payment, such as a co-pay
     */
    IS_PRE_SERVICE_PMT_YN: string;
    /**
     * Stores the transaction ID of the first transaction in a chain of transactions
     */
    FIRST_ETR_TX_ID: number;
    /**
     * The department where the transaction was posted.
     */
    POSTING_DEPARTMENT_ID: number;
    /**
     * Reference to CLARITY_DEP based on POSTING_DEPARTMENT_ID
     */
    posting_department?: CLARITY_DEP;
    /**
     * The item stores how the reimbursement amount was calculated for the charge.
     */
    EXP_REIMB_SRC_C_NAME: string;
    /**
     * The free text information related to the reason why the transaction was held in Professional Billing statement processing.
     */
    STMT_HOLD_RSN_TEXT: string;
    /**
     * The Enterprise payment hospital temporary transaction ID.
     */
    EB_PMT_HTT_ID: number;
    /**
     * The primary timely filing deadline date.
     */
    PRIM_TIMELY_FILE_DEADLINE_DATE: Date;
    /**
     * This column contains the workflow category ID performed to collect a patient payment from the point of view of the user
     */
    PAT_PMT_COLL_WKFL_C_NAME: string;
    /**
     * This column stores the enterprise posting module for the transaction
     */
    EB_TX_SOURCE_C_NAME: string;
    /**
     * This item holds the originating temporary transaction�ID for this transaction
     */
    ORIGINATING_TAR_ID: number;
    /**
     * This item holds the source temporary transaction ID for this transaction
     */
    SOURCE_TAR_ID: number;
    /**
     * Indicates the temporary transaction charge line this transaction originated from.
     */
    SRC_TAR_CHG_LINE: number;
    /**
     * Aging date used for self-pay aged A/R
     */
    PAT_AGING_DATE: Date;
    /**
     * Aging date used for insurance aged A/R
     */
    INS_AGING_DATE: Date;
    /**
     * This item stores the hospital account record ID for the transaction.
     */
    HOSP_ACCT_ID: number;
    /**
     * Reference to ARPB_VISITS based on HOSP_ACCT_ID
     */
    hosp_acct?: ARPB_VISITS;
    /**
     * The unique ID of the order record that triggered this transaction
     */
    ORDER_ID: number;
    /**
     * This item stores the reference number (check number) for a payment transaction.
     */
    REFERENCE_NUM: string;
    /**
     * This item stores the receipt number for a payment transaction.
     */
    PMT_RECEIPT_NUM: string;
    /**
     * This stores this transaction's referral provider
     */
    REFERRAL_PROV_ID: string;
    /**
     * The name of the referral source.
     */
    REFERRAL_PROV_ID_REFERRING_PROV_NAM: string;
    /**
     * This item stores the insurance amount that has been paid on a charge transaction.
     */
    INSURANCE_AMT_PAID: number;
    /**
     * The Yes-No write-off category number for a charge transaction
     */
    WRITEOFF_EXCEPT_C_NAME: string;
    /**
     * This item stores the original price of the transaction if the price was changed during charge entry.
     */
    ORIG_PRICE: number;
    /**
     * The Plan (EPP) ID that is associated with this transaction.
     */
    COVERAGE_PLAN_ID: number;
    /**
     * This item stores the original copay amount for the transaction.
     */
    ORIGINAL_AMT_COPAY: number;
    /**
     * Indicates whether the charges is written off to bad debt.
     */
    BAD_DEBT_CHG_YN: string;
    /**
     * This items stores the date when a charge first goes to self-pay.
     */
    FIRST_SELFPAY_DATE: Date;
    /**
     * The claim record for the transaction.
     */
    CLAIM_ID: number;
    /**
     * Date in which the Explanation of�Benefits for this transaction was last updated.
     */
    EOB_UPDATED_DT: Date;
    /**
     * Start time of a timed procedure.
     */
    START_TIME: Date;
    /**
     * Time when service is performed.
     */
    SERVICE_TIME: Date;
    /**
     * The type of service category number associated with the transaction.
     */
    TYPE_OF_SERVICE_C_NAME: string;
    /**
     * This item stores the primary diagnosis codeset for the transaction.
     */
    DX_PRIM_CODESET_C_NAME: string;
    /**
     * This item stores the alternate diagnosis codeset for the transaction.
     */
    DX_ALT_CODESET_C_NAME: string;
    /**
     * The date on which a service is started.
     */
    START_DATE: Date;
    /**
     * Collection of ARPB_AUTH_INFO as children
     */
    arpb_auth_info?: ARPB_AUTH_INFO[];
    /**
     * Collection of ARPB_CHG_ENTRY_DX as children
     */
    arpb_chg_entry_dx?: ARPB_CHG_ENTRY_DX[];
    /**
     * Collection of ARPB_TX_ACTIONS as children
     */
    arpb_tx_actions?: ARPB_TX_ACTIONS[];
    /**
     * Collection of ARPB_TX_CHG_REV_HX as children
     */
    arpb_tx_chg_rev_hx?: ARPB_TX_CHG_REV_HX[];
    /**
     * Collection of ARPB_TX_MATCH_HX as children
     */
    arpb_tx_match_hx?: ARPB_TX_MATCH_HX[];
    /**
     * Collection of ARPB_TX_MODIFIERS as children
     */
    arpb_tx_modifiers?: ARPB_TX_MODIFIERS[];
    /**
     * Collection of ARPB_TX_STMCLAIMHX as children
     */
    arpb_tx_stmclaimhx?: ARPB_TX_STMCLAIMHX[];
    /**
     * Collection of ARPB_TX_STMT_DT as children
     */
    arpb_tx_stmt_dt?: ARPB_TX_STMT_DT[];
    /**
     * Collection of PMT_EOB_INFO_II as children
     */
    pmt_eob_info_ii?: PMT_EOB_INFO_II[];
    /**
     * Collection of PMT_EOB_INFO_I as children
     */
    pmt_eob_info_i?: PMT_EOB_INFO_I[];
    /**
     * Collection of TX_DIAG as children
     */
    tx_diag?: TX_DIAG[];
}

/**
 * This table contains claim line information for claims associated with the hospital account/liability bucket
 * pk: CLAIM_PRINT_ID, LINE
 */
export interface HSP_CLP_CMS_LINE {
    /**
     * The ID of the claim record associated with a single hospital account or liability bucket.
     */
    CLAIM_PRINT_ID: number;
    /**
     * The line number of one of the multiple values associated with a specific group of data within this record.
     */
    LINE: number;
    /**
     * Stores the from date for a claim line
     */
    FROM_SERV_DT: Date;
    /**
     * Stores the place of service type per transaction.
     */
    POS_TYPE_PER_TX: string;
    /**
     * Stores the internal procedure ID.
     */
    PROC_ID: number;
    /**
     * Reference to CLARITY_EAP based on PROC_ID
     */
    proc?: CLARITY_EAP;
    /**
     * Stores the procedure description.
     */
    PROC_DESC: string;
    /**
     * Stores the Healthcare Common Procedure Coding System code for the claim line.
     */
    HCPCS_CODES: string;
    /**
     * Comma-delimited list of diagnosis pointers for the claim line.
     */
    DX_MAP: string;
    /**
     * Stores the quantity associated with the claim line.
     */
    QUANTITY: number;
    /**
     * Stores the override revenue code.
     */
    OVRD_REV_CODE_ID: number;
    /**
     * Reference to CL_UB_REV_CODE based on OVRD_REV_CODE_ID
     */
    ovrd_rev_code?: CL_UB_REV_CODE;
    /**
     * The name of the revenue code.
     */
    OVRD_REV_CODE_ID_REVENUE_CODE_NAME: string;
    /**
     * Stores the charge amount for the claim line.
     */
    CHARGE_AMT: number;
    /**
     * Stores the payment amount for the claim line.
     */
    PAYMENT_AMT: number;
    /**
     * This controls procedure description printing for professional claims.
     */
    PRINT_DESCRIPTIO_YN: string;
    /**
     * Revenue location for the line.
     */
    REV_LOCATION_ID: number;
    /**
     * Reference to CLARITY_LOC based on REV_LOCATION_ID
     */
    rev_location?: CLARITY_LOC;
    /**
     * Department of service for the line.
     */
    DEPT_ID: number;
    /**
     * Reference to CLARITY_DEP based on DEPT_ID
     */
    dept?: CLARITY_DEP;
    /**
     * Place of service ID.
     */
    LINE_POS_ID: number;
    /**
     * Reference to CLARITY_LOC based on LINE_POS_ID
     */
    line_pos?: CLARITY_LOC;
    /**
     * Stores the code type for the transaction level Healthcare Common Procedure Coding System code override
     */
    CMS_CODE_TYPE_C_NAME: string;
    /**
     * The group line number on the invoice record that corresponds to the data in INVOICE_CLM_LN.
     */
    INVOICE_GRP_LN: string;
    /**
     * Stores charges that are active on the current claim.
     */
    NON_GROUP_HTR_ID: number;
    /**
     * Reference to HSP_TRANSACTIONS based on NON_GROUP_HTR_ID
     */
    non_group_htr?: HSP_TRANSACTIONS;
    /**
     * Reference to parent HSP_CLAIM_DETAIL1
     */
    hsp_claim_detail1?: HSP_CLAIM_DETAIL1;
}

/**
 * This table contains hospital account transaction detail from the Hospital Permanent Transactions (HTR) master file.
 * pk: TX_ID
 */
export interface HSP_TRANSACTIONS {
    /**
     * This column stores the unique identifier for the hospital billing transaction.
     */
    TX_ID: number;
    /**
     * This column stores the unique identifier for the hospital account associated with the hospital billing transaction.
     */
    HSP_ACCOUNT_ID: number;
    /**
     * Reference to HSP_ACCOUNT based on HSP_ACCOUNT_ID
     */
    hsp_account?: HSP_ACCOUNT;
    /**
     * Holds the account class of the account when the transaction filed
     */
    ACCT_CLASS_HA_C_NAME: string;
    /**
     * A comma-delimited list of one or more numbers stored in a payment transaction that correspond to actions entered in payment posting
     */
    ACTION_STRING: string;
    /**
     * An allowed amount stored in a payment transaction.
     */
    ALLOWED_AMOUNT: number;
    /**
     * A billed amount stored in a payment transaction.
     */
    BILLED_AMOUNT: number;
    /**
     * This column stores the unique identifier for the billing provider stored in the hospital billing transaction.
     */
    BILLING_PROV_ID: string;
    /**
     * This column stores the unique identifier for the liability bucket on which the transaction is currently active
     */
    BUCKET_ID: number;
    /**
     * A coinsurance amount stored in a payment transaction
     */
    COINSURANCE_AMOUNT: number;
    /**
     * A copay amount stored in a payment transaction
     */
    COPAY_AMOUNT: number;
    /**
     * A deductible amount stored in a payment transaction
     */
    DEDUCTIBLE_AMOUNT: number;
    /**
     * This column stores the unique identifier for the department associated with the hospital billing transaction.
     */
    DEPARTMENT: number;
    /**
     * The default revenue code from the procedure master file for a charge transaction.
     */
    DFLT_UB_REV_CD_ID: number;
    /**
     * The name of the revenue code.
     */
    DFLT_UB_REV_CD_ID_REVENUE_CODE_NAME: string;
    /**
     * This column stores the category ID of the financial class stored in a hospital billing transaction
     */
    FIN_CLASS_C_NAME: string;
    /**
     * The internal control number stored in a payment transaction.
     */
    INT_CONTROL_NUMBER: string;
    /**
     * Denotes whether an adjustment was the result of moving balances between liability buckets or between collection statuses.
     */
    IS_SYSTEM_ADJ_YN: string;
    /**
     * Denotes whether a charge is a late charge.
     */
    IS_LATE_CHARGE_YN: string;
    /**
     * Denotes the price that was determined for a charge based on fee schedules.
     */
    ORIG_PRICE: number;
    /**
     * For a charge dropped via ADT's bed charge billing function or a payment collected at the point-of-service, the contact serial number of the patient contact that triggered the bed charge or led to the collection of the payment.
     */
    PAT_ENC_CSN_ID: number;
    /**
     * The payment source stored in a payment transaction, i.e
     */
    PAYMENT_SRC_HA_C_NAME: string;
    /**
     * This column stores the unique identifier for the payer associated with each payment or adjustment
     */
    PAYOR_ID: number;
    /**
     * This column stores the unique identifier for the performing provider associated with a charge transaction.
     */
    PERFORMING_PROV_ID: string;
    /**
     * For adjustment transactions that move liability from one bucket to another, the total monetary amount of previous credits on the former bucket.
     */
    PREV_CREDITS_ACT: number;
    /**
     * This column stores the unique identifier for the primary fee schedule used to price a charge transaction.
     */
    PRIM_FEE_SCHED_ID: number;
    /**
     * The name of each fee schedule.
     */
    PRIM_FEE_SCHED_ID_FEE_SCHEDULE_NAME: string;
    /**
     * This column stores the value manually entered for the procedure description at the time of charge entry
     */
    PROCEDURE_DESC: string;
    /**
     * This column stores the unique identifier for the procedure associated with the hospital billing transaction.
     */
    PROC_ID: number;
    /**
     * Reference to CLARITY_EAP based on PROC_ID
     */
    proc?: CLARITY_EAP;
    /**
     * For charge transactions, the quantity.
     */
    QUANTITY: number;
    /**
     * The payment posting reference number associated with a transaction.
     */
    REFERENCE_NUM: string;
    /**
     * The revenue code associated with a charge transaction
     */
    UB_REV_CODE_ID: number;
    /**
     * The name of the revenue code.
     */
    UB_REV_CODE_ID_REVENUE_CODE_NAME: string;
    /**
     * This column stores the unique identifier for the revenue location stored in the hospital billing transaction
     */
    REVENUE_LOC_ID: number;
    /**
     * Reference to CLARITY_LOC based on REVENUE_LOC_ID
     */
    revenue_loc?: CLARITY_LOC;
    /**
     * This column stores the unique identifier for the service area associated with the hospital billing transaction.
     */
    SERV_AREA_ID: number;
    /**
     * Reference to CLARITY_SA based on SERV_AREA_ID
     */
    serv_area?: CLARITY_SA;
    /**
     * The service date of a charge, the deposit date of a payment, or the creation date of an adjustment.
     */
    SERVICE_DATE: Date;
    /**
     * The ID number of the temporary transaction (HTT record) associated with the transaction in question.
     */
    TEMP_TX_ID: number;
    /**
     * For adjustment transactions that move liability from one bucket to another, the total monetary amount of charges on the latter bucket.
     */
    TOTAL_CHARGES_ACT: number;
    /**
     * The monetary amount of a transaction.
     */
    TX_AMOUNT: number;
    /**
     * A comment associated with a transaction.
     */
    TX_COMMENT: string;
    /**
     * The date and time when a transaction was filed on a hospital account.
     */
    TX_FILED_TIME: Date;
    /**
     * A number denoting in what order the transaction filed on the hospital account
     */
    TX_NUM_IN_HOSPACCT: number;
    /**
     * The date on which the transaction was posted.
     */
    TX_POST_DATE: Date;
    /**
     * The source of the transaction, i.e
     */
    TX_SOURCE_HA_C_NAME: string;
    /**
     * The transaction type, i.e
     */
    TX_TYPE_HA_C_NAME: string;
    /**
     * This column stores the unique identifier for the user who posted the hospital billing transaction.
     */
    USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on USER_ID
     */
    user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    USER_ID_NAME: string;
    /**
     * Y/N flag indicating if there is an allowance adjustment.
     */
    ALLOWANCE_ADJ_YN: string;
    /**
     * This column stores the unique identifier for the place of service associated with the hospital billing transaction.
     */
    PLACE_OF_SVC_ID: number;
    /**
     * Indicates whether the transaction is expected to be a non-covered charge.
     */
    NON_COVERED_YN: string;
    /**
     * The non-covered amount associated with the transaction.
     */
    NON_COVERED_AMT: number;
    /**
     * Denotes whether this is a Refund Adjustment.
     */
    IS_REFUND_ADJ_YN: string;
    /**
     * The invoice number for the transaction.
     */
    INVOICE_NUM: string;
    /**
     * This column stores the unique identifier for the collection agency that the hospital billing transaction has been sent to for collections.
     */
    COLLECTION_AGENCY: number;
    /**
     * The name of the collection agency.
     */
    COLLECTION_AGENCY_COLL_AGENCY_NAME: string;
    /**
     * Holds the primary plan of the account when the transaction filed
     */
    PRIMARY_PLAN_ID: number;
    /**
     * Reference to CLARITY_EPP based on PRIMARY_PLAN_ID
     */
    primary_plan?: CLARITY_EPP;
    /**
     * Reconciliation number from a remittance run.
     */
    RECONCILIATION_NUM: string;
    /**
     * Item to represent the date when the first attempt to file the transaction was made.
     */
    INI_FILE_ATTEMPT_DT: Date;
    /**
     * This column stores the unique identifier for the image associated with this hospital billing transaction.
     */
    IMD_ID: string;
    /**
     * Indicates whether hospital account restrictions are used.
     */
    EB_PMT_HAR_RES_YN: string;
    /**
     * The hospital account restriction discharge to date.
     */
    PMT_HAR_DIS_TO_DT: Date;
    /**
     * This column contains the not-allowed amount on the payment transaction.
     */
    PAYMENT_NOT_ALLOWED: number;
    /**
     * This column contains the original payment amount
     */
    EB_PMT_TOTAL_AMOUNT: string;
    /**
     * The type category number of the post type used to post the enterprise payment.
     */
    EB_PMT_POST_TYPE_C_NAME: string;
    /**
     * The charge amount source flag category number for the charge transaction.
     */
    CHRG_AMT_SRC_FLG_C_NAME: string;
    /**
     * This column stores the first account that a hospital billing transaction attempted to post to prior to combine accounts or combined account redirection
     */
    ORIG_ACCT_COMB_ID: number;
    /**
     * Reference to HSP_ACCOUNT based on ORIG_ACCT_COMB_ID
     */
    orig_acct_comb?: HSP_ACCOUNT;
    /**
     * The primary diagnosis code set configured in the facility for the service date of the transaction.
     */
    DX_PRIM_CODE_SET_C_NAME: string;
    /**
     * The alternate diagnosis code set configured in the facility for the service date of the transaction.
     */
    DX_ALT_CODE_SET_C_NAME: string;
    /**
     * This column stores the post date of the first transaction across hospital billing and professional billing in a chain of transfers, reposts, and reversals.
     */
    FIRST_TX_POST_DATE: Date;
    /**
     * Holds the financial class of the account when the transaction filed
     */
    ACCT_FIN_CLASS_C_NAME: string;
    /**
     * This column stores the primary payer of the account when the transaction filed
     */
    PRIMARY_PAYOR_ID: number;
    /**
     * Reference to CLARITY_EPM based on PRIMARY_PAYOR_ID
     */
    primary_payor?: CLARITY_EPM;
    /**
     * Holds the primary coverage of the account when the transaction filed
     */
    PRIMARY_COVERAGE_ID: number;
    /**
     * Reference to COVERAGE based on PRIMARY_COVERAGE_ID
     */
    primary_coverage?: COVERAGE;
    /**
     * This column stores the post date of the first hospital billing transaction on the hospital account in a chain of reposts and reversals.
     */
    HAR_FIRST_POST_DATE: Date;
    /**
     * This column stores the source from which the payment is posted in the system
     */
    POST_SOURCE_C_NAME: string;
    /**
     * The adjustment category of the adjustment procedure at the time of posting.
     */
    ADJUSTMENT_CAT_C_NAME: string;
    /**
     * The mapped write-off reason for the adjustment.
     */
    WRITE_OFF_RSN_C_NAME: string;
    /**
     * Indicates whether or not this is a pre-service payment, such as a co-pay
     */
    IS_PRE_SERVICE_PMT_YN: string;
    /**
     * This column stores the unique identifier for the first hospital billing transaction in a chain of transactions
     */
    FIRST_HTR_TX_ID: number;
    /**
     * The department where the transaction was posted.
     */
    POSTING_DEPARTMENT_ID: number;
    /**
     * Indicates if this transaction an advance bill transfer system adjustment
     */
    IS_ADV_BILL_TRANS_YN: string;
    /**
     * The payment's claim print ID with a matching invoice number.
     */
    CLAIM_PRINT_ID: number;
    /**
     * This column contains the workflow category ID performed to collect a patient payment from the point of view of the user
     */
    PAT_PMT_COLL_WKFL_C_NAME: string;
    /**
     * This column stores the enterprise posting module for the transaction
     */
    EB_TX_SOURCE_C_NAME: string;
    /**
     * Collection of HSP_PMT_LINE_REMIT as children
     */
    hsp_pmt_line_remit?: HSP_PMT_LINE_REMIT[];
    /**
     * Collection of HSP_PMT_REMIT_DETAIL as children
     */
    hsp_pmt_remit_detail?: HSP_PMT_REMIT_DETAIL[];
    /**
     * Collection of HSP_TX_AUTH_INFO as children
     */
    hsp_tx_auth_info?: HSP_TX_AUTH_INFO[];
    /**
     * Collection of HSP_TX_DIAG as children
     */
    hsp_tx_diag?: HSP_TX_DIAG[];
    /**
     * Collection of HSP_TX_LINE_INFO as children
     */
    hsp_tx_line_info?: HSP_TX_LINE_INFO[];
    /**
     * Collection of HSP_TX_NAA_DETAIL as children
     */
    hsp_tx_naa_detail?: HSP_TX_NAA_DETAIL[];
    /**
     * Collection of HSP_TX_RMT_CD_LST as children
     */
    hsp_tx_rmt_cd_lst?: HSP_TX_RMT_CD_LST[];
}

/**
 * Care Path information.
 * pk: SUMMARY_BLOCK_ID
 */
export interface CARE_PATH {
    /**
     * The unique identifier (.1 item) for the summary block record.
     */
    SUMMARY_BLOCK_ID: number;
    /**
     * Reference to EPISODE based on SUMMARY_BLOCK_ID
     */
    summary_block?: EPISODE;
}

/**
 * This table contains claim print record information for claims associated with a given hospital account or liability bucket.
 * pk: CLAIM_PRINT_ID
 */
export interface HSP_CLAIM_DETAIL1 {
    /**
     * Stores the claim record ID associated with a single hospital account.
     */
    CLAIM_PRINT_ID: number;
    /**
     * The mailing name for this claim.
     */
    MAIL_NAME: string;
    /**
     * The mailing city, state, and ZIP code for this claim.
     */
    MAIL_CITY_STATE_ZIP: string;
    /**
     * The mailing phone number for this claim.
     */
    MAIL_PHONE: string;
    /**
     * The source of the mailing address for this claim.
     */
    SRC_OF_ADDR_C_NAME: string;
    /**
     * The source claim record for resubmit and demand claims.
     */
    LINE_SOURCE_CLP_ID: string;
    /**
     * Indicates whether the claim is a partial resubmit.
     */
    PARTIAL_CLAIM_YN: string;
    /**
     * Claim level expected reimbursement.
     */
    EXPECTED_PYMT: number;
    /**
     * Billed amount determined from reimbursement information for Diagnosis Related Group priced claims.
     */
    CLAIM_BILLED_AMOUNT: number;
    /**
     * Contractual amount determined from reimbursement information for Diagnosis Related Group priced claims.
     */
    CLM_CONTRACTUAL: number;
    /**
     * Expected amount determined from reimbursement information for Diagnosis Related Group priced claims.
     */
    CLM_EXPECTED_PRICE: number;
    /**
     * Insurance portion of the expected amount
     */
    CLAIM_INS_PORTION: number;
    /**
     * Portion of the expected amount the patient is responsible for
     */
    CLM_PATIENT_PORTION: number;
    /**
     * A text description of the method used to price the claim
     */
    CLAIM_MTHD_DESC: string;
    /**
     * A numerical representation of the contact date for the contract used in this claim
     */
    CONTRACT_DATE_REAL: number;
    /**
     * First line of the mailing address for a given claim record.
     */
    MAIL_ADDR1: string;
    /**
     * The cost threshold of this claim's outlier data
     */
    REIMB_COST_THRESH: number;
    /**
     * The cost outlier of this claim's outlier data
     */
    REIMB_COST_OUT: number;
    /**
     * This column holds the service area for the claim.
     */
    SA_ID: number;
    /**
     * Reference to CLARITY_SA based on SA_ID
     */
    sa?: CLARITY_SA;
    /**
     * This column has a value of yes when the claim is inactive.
     */
    INACTV_CLP_YN: string;
    /**
     * This column holds the instant the claim was accepted.
     */
    CLAIM_ACCEPT_DTTM: Date;
    /**
     * The payer ID for this claim.
     */
    SG_PAYOR_ID: number;
    /**
     * Reference to CLARITY_EPM based on SG_PAYOR_ID
     */
    sg_payor?: CLARITY_EPM;
    /**
     * The plan ID for this claim.
     */
    SG_PLAN_ID: number;
    /**
     * Reference to CLARITY_EPP based on SG_PLAN_ID
     */
    sg_plan?: CLARITY_EPP;
    /**
     * The coverage ID for this claim.
     */
    SG_CVG_ID: number;
    /**
     * Reference to COVERAGE based on SG_CVG_ID
     */
    sg_cvg?: COVERAGE;
    /**
     * The invoice number for this claim.
     */
    INVOICE_NUM: string;
    /**
     * The guarantor account ID for this claim.
     */
    SG_GR_ACCT_ID: number;
    /**
     * Reference to ACCOUNT based on SG_GR_ACCT_ID
     */
    sg_gr_acct?: ACCOUNT;
    /**
     * The hospital account ID for this claim.
     */
    HOSPITAL_ACCT_ID: number;
    /**
     * Reference to HSP_ACCOUNT based on HOSPITAL_ACCT_ID
     */
    hospital_acct?: HSP_ACCOUNT;
    /**
     * The liability bucket ID for this claim.
     */
    HLB_ID: number;
    /**
     * The billing provider ID for this claim.
     */
    SG_PROV_ID: string;
    /**
     * The location for this claim.
     */
    SG_LOC_ID: number;
    /**
     * Reference to CLARITY_LOC based on SG_LOC_ID
     */
    sg_loc?: CLARITY_LOC;
    /**
     * The place of service ID for this claim.
     */
    SG_POS_ID: number;
    /**
     * Reference to CLARITY_LOC based on SG_POS_ID
     */
    sg_pos?: CLARITY_LOC;
    /**
     * The account class used to evaluate this claim.
     */
    CLAIM_CLASS_C_NAME: string;
    /**
     * The base account class used to evaluate this claim.
     */
    CLAIM_BASE_CLASS_C_NAME: string;
    /**
     * The minimum service date for this claim.
     */
    MIN_SERVICE_DT: Date;
    /**
     * The maximum service date for this claim.
     */
    MAX_SERVICE_DT: Date;
    /**
     * The uniform billing claim from date.
     */
    UB_FROM_DT: Date;
    /**
     * The uniform billing claim through date.
     */
    UB_THROUGH_DT: Date;
    /**
     * The claim type.
     */
    CLAIM_TYPE_C_NAME: string;
    /**
     * The form type
     */
    CLAIM_FRM_TYPE_C_NAME: string;
    /**
     * Total charges amount.
     */
    TTL_CHRGS_AMT: number;
    /**
     * Total due amount.
     */
    TTL_DUE_AMT: string;
    /**
     * Total non-covered amount.
     */
    TTL_NONCVD_AMT: number;
    /**
     * Total payment amount.
     */
    TTL_PMT_AMT: number;
    /**
     * Type of bill.
     */
    UB_BILL_TYPE: string;
    /**
     * Covered days.
     */
    UB_CVD_DAYS: number;
    /**
     * Coinsurance days.
     */
    UB_COINS_DAYS: number;
    /**
     * Non-covered days.
     */
    UB_NON_CVD_DAYS: number;
    /**
     * Principal diagnosis.
     */
    UB_PRINC_DX_ID: number;
    /**
     * Reference to CLARITY_EDG based on UB_PRINC_DX_ID
     */
    ub_princ_dx?: CLARITY_EDG;
    /**
     * Flag used to indicate that claim is for alternate payer.
     */
    SG_ALTPYR_CLM_YN: string;
    /**
     * This column holds the filing order position of the claim coverage at the time claims were processed.
     */
    FILING_ORDER_C_NAME: string;
    /**
     * The ID of the claim record.
     */
    CLM_EXT_VAL_ID: number;
    /**
     * This column stores the reason why we sent the claim again to payer
     */
    CLM_REBILL_REASON_C_NAME: string;
    /**
     * Collection of CLP_OCCUR_DATA as children
     */
    clp_occur_data?: CLP_OCCUR_DATA[];
    /**
     * Collection of HSP_CLAIM_PRINT as children
     */
    hsp_claim_print?: HSP_CLAIM_PRINT[];
    /**
     * Collection of HSP_CLP_CMS_TX_PIECES as children
     */
    hsp_clp_cms_tx_pieces?: HSP_CLP_CMS_TX_PIECES[];
    /**
     * Collection of HSP_CLP_DIAGNOSIS as children
     */
    hsp_clp_diagnosis?: HSP_CLP_DIAGNOSIS[];
    /**
     * Collection of HSP_CLP_UB_TX_PIECES as children
     */
    hsp_clp_ub_tx_pieces?: HSP_CLP_UB_TX_PIECES[];
    /**
     * Collection of HSP_CLP_CMS_LINE as children
     */
    hsp_clp_cms_line?: HSP_CLP_CMS_LINE[];
}

/**
 * This table contains service line information from the remittance image.
 * pk: IMAGE_ID, LINE
 */
export interface CL_RMT_SVCE_LN_INF {
    /**
     * This is the ID for the remittance image record with remittance service line information.
     */
    IMAGE_ID: string;
    /**
     * The line number in the results of a query
     */
    LINE: number;
    /**
     * Service line information for claim remittance.
     */
    SERVICE_LINE: string;
    /**
     * The composite medical procedure identifier to identify a medical procedure by its standardized codes for service line information.
     */
    PROC_IDENTIFIER: string;
    /**
     * Monetary amount for submitted service line item charge.
     */
    LINE_ITEM_CHG_AMT: number;
    /**
     * Monetary amount for the service line item provider payment amount.
     */
    PROV_PAYMENT_AMT: number;
    /**
     * National uniform billing committee revenue code for service line information.
     */
    NUBC_REV_CD: string;
    /**
     * Count of the Units of Service Paid for service line information.
     */
    UNITS_PAID_CNT: number;
    /**
     * Original units of service count for service line information.
     */
    ORIG_UNITS_CNT: number;
    /**
     * ID for professional billing service line charge.
     */
    SVC_LINE_CHG_PB_ID: number;
    /**
     * Reference to ARPB_TRANSACTIONS based on SVC_LINE_CHG_PB_ID
     */
    svc_line_chg_pb?: ARPB_TRANSACTIONS;
    /**
     * This is the Code specifying type of service date.
     */
    SVC_DATE_QUAL_C_NAME: string;
    /**
     * This is the service date.
     */
    SERVICE_DATE: Date;
    /**
     * This is the service line for which service date is specified
     */
    SERVICE_LN: string;
    /**
     * This is the service line for reference segment.
     */
    REF_SVC_LN: string;
    /**
     * This is the service line level reference segment ID qualifier.
     */
    SVC_REF_ID_QUAL_C_NAME: string;
    /**
     * This is the service line level reference segment Identifier.
     */
    SVC_REF_IDENTIFIER: string;
    /**
     * Reference to parent CL_REMIT
     */
    cl_remit?: CL_REMIT;
}

/**
 * This table cotains the enrollment information for a care plan.
 * pk: CAREPLAN_ID
 */
export interface CAREPLAN_ENROLLMENT_INFO {
    /**
     * The unique identifier (.1 item) for the care plan record.
     */
    CAREPLAN_ID: string;
    /**
     * Reference to CAREPLAN_INFO based on CAREPLAN_ID
     */
    careplan?: CAREPLAN_INFO;
}

/**
 * This table holds information about values sent to the payer when generating a medication estimate.
 * pk: MED_ESTIMATE_ID, CONTACT_DATE_REAL
 */
export interface MED_CVG_ESTIMATE_VALS {
    /**
     * The unique identifier (.1 item) for the medication estimate record.
     */
    MED_ESTIMATE_ID: number;
    /**
     * A unique contact date in decimal format
     */
    CONTACT_DATE_REAL: number;
    /**
     * The date of this contact in calendar format.
     */
    CONTACT_DATE: Date;
    /**
     * The contact serial number (CSN) of the contact.
     */
    CONTACT_SERIAL_NUM: number;
    /**
     * Stores contact number.
     */
    CONTACT_NUM: number;
    /**
     * Category value indicating the coverage query response result.
     */
    RESP_RESULT_C_NAME: string;
    /**
     * This item points to the medication (ERX) record that was used to generate this estimate.
     */
    EST_ERX_ID: number;
    /**
     * This item holds the category value indicating the unit of the dispense quantity used when generating this estimate.
     */
    EST_QTY_UNIT_C_NAME: string;
    /**
     * This item holds the days supply used when generating this estimate.
     */
    EST_DAYS_SUPPLY: number;
    /**
     * This item points to the authorizing provider (SER) record used for generating this estimate.
     */
    EST_AUTH_PROV_ID: string;
    /**
     * This item points to the pharmacy (PHR) record used for generating this estimate.
     */
    EST_PHARM_ID: number;
    /**
     * The name of the pharmacy.
     */
    EST_PHARM_ID_PHARMACY_NAME: string;
    /**
     * This category indicates why a prescription benefit query was triggered.
     */
    EST_QUERY_REASON_C_NAME: string;
    /**
     * This item holds the dispense quantity used when generating this estimate.
     */
    EST_QUANTITY: number;
    /**
     * Stores the instant of entry when a record is edited.
     */
    INSTANT_OF_ENTRY_DTTM: Date;
    /**
     * Holds the instant when the interface message was triggered.
     */
    TRIG_UTC_DTTM: Date;
    /**
     * Holds the instant an interface response was received.
     */
    RESP_UTC_DTTM: Date;
    /**
     * Holds the category value indicating the interface message status.
     */
    STATUS_C_NAME: string;
    /**
     * Holds the message ID of the response interface message.
     */
    RESP_MSG_ID: string;
    /**
     * This item records if the payer sent back coverage information that exactly matched the order details that were sent in the Real-Time Prescription Benefit request.
     */
    RESP_EXACT_MATCH_YN: string;
    /**
     * Reference to parent MED_CVG_INFO
     */
    med_cvg_info?: MED_CVG_INFO;
}

/**
 * The table extracts data from the Person Name (EAN) master file
 * pk: RECORD_ID
 */
export interface NAMES {
    /**
     * The is the internal ID of the record
     */
    RECORD_ID: string;
    /**
     * This is the name of the record
     */
    RECORD_NAME: string;
    /**
     * Stores the person's last name.
     */
    LAST_NAME: string;
    /**
     * Stores the person's first name.
     */
    FIRST_NAME: string;
    /**
     * Stores the person's middle name.
     */
    MIDDLE_NAME: string;
    /**
     * Stores the name the person prefers to be called.
     */
    PREFERRED_NAME: string;
}

/**
 * The BENEFITS table contains information specific to benefits collection (BEN) record.
 * pk: RECORD_ID
 */
export interface BENEFITS {
    /**
     * The unique identifier (.1 item) for the benefit record.
     */
    RECORD_ID: number;
    /**
     * The date the record was created.
     */
    RECORD_CREATION_DT: Date;
    /**
     * Patient ID
     */
    PAT_ID: string;
    /**
     * Reference to PATIENT based on PAT_ID
     */
    pat?: PATIENT;
    /**
     * Collection of COVERAGE_BENEFITS as children
     */
    coverage_benefits?: COVERAGE_BENEFITS[];
    /**
     * Collection of SERVICE_BENEFITS as children
     */
    service_benefits?: SERVICE_BENEFITS[];
}

/**
 * Accounts contain information about billing for services, while coverages contain information about insurance payors, benefits, subscribers, and members
 * pk: ACCOUNT_ID
 */
export interface ACCOUNT {
    /**
     * This column stores the unique identifier for the guarantor record
     */
    ACCOUNT_ID: number;
    /**
     * This column stores the name for the guarantor record
     */
    ACCOUNT_NAME: string;
    /**
     * The name of the person to contact for questions regarding the guarantor
     */
    CONTACT_PERSON: string;
    /**
     * The guarantor's date of birth.
     */
    BIRTHDATE: Date;
    /**
     * The sex of the guarantor
     */
    SEX: string;
    /**
     * This column indicates whether the guarantor was active at the time of the extract.
     */
    IS_ACTIVE: string;
    /**
     * The city in which the guarantor lives.
     */
    CITY: string;
    /**
     * The category value of the state in which the guarantor lives.
     */
    STATE_C_NAME: string;
    /**
     * The ZIP Code area in which the guarantor lives.
     */
    ZIP: string;
    /**
     * The guarantor�s home phone number (may contain dashes).
     */
    HOME_PHONE: string;
    /**
     * Category value associated with the type of account, such as Personal/Family, Worker�s Comp, etc.
     */
    ACCOUNT_TYPE_C_NAME: string;
    /**
     * The ID of the service area (EAF .1) to which this account belongs.
     */
    SERV_AREA_ID: number;
    /**
     * Reference to CLARITY_SA based on SERV_AREA_ID
     */
    serv_area?: CLARITY_SA;
    /**
     * The category value of the primary financial class of the guarantor (i.e
     */
    FIN_CLASS_C_NAME: string;
    /**
     * The total outstanding balance on the account as of the time of the extract.
     */
    TOTAL_BALANCE: number;
    /**
     * The amount of the insurance balance on the guarantor as of the time of the extract.
     */
    INSURANCE_BALANCE: number;
    /**
     * The amount of the self-pay balance on the account as of the time of the extract.
     */
    PATIENT_BALANCE: number;
    /**
     * The date the most recent insurance payment was received for this account before the enterprise reporting extract.
     */
    LAST_INS_PMT_DATE: Date;
    /**
     * The date the most recent patient payment was received for this account before the enterprise reporting extract.
     */
    LAST_PAT_PMT_DATE: Date;
    /**
     * The amount of the most recent patient payment received for this account before the enterprise reporting extract.
     */
    LAST_PAT_PMT_AMT: number;
    /**
     * The date the most recent patient statement was sent for the account.
     */
    LAST_STMT_DATE: Date;
    /**
     * This column stores the unique identifier for the guarantor record
     */
    EPIC_ACCT_ID: number;
    /**
     * This column indicates whether the guarantor should be extracted
     */
    HOM_CLARITY_FLG_YN: string;
    /**
     * This value is the Hospital Billing balance on the guarantor.
     */
    HB_BALANCE: number;
    /**
     * This value is the Hospital Billing prebilled balance on the account.
     */
    HB_PREBILL_BALANCE: number;
    /**
     * This value is the Hospital Billing insurance balance on the guarantor, but excludes hospital accounts in external AR or bad debt.
     */
    HB_INSURANCE_BALAN: number;
    /**
     * This value is the Hospital Billing self-pay balance on the account, but excludes hospital accounts in external AR, bad debt or that have not yet been billed to self-pay.
     */
    HB_SELFPAY_BALANCE: number;
    /**
     * This value is the Hospital Billing bad debt balance on the guarantor.
     */
    HB_BADDEBT_BALANCE: number;
    /**
     * This value is the Hospital Billing undistributed balance on the account, but excludes hospital accounts in external AR or bad debt.
     */
    HB_UNDISTRIB_BAL: number;
    /**
     * This column stores the last hospital billing insurance payment date.
     */
    HB_LAST_INS_PMT_DT: Date;
    /**
     * This column stores the last hospital billing self-pay payment date.
     */
    HB_LAST_SP_PMT_DT: Date;
    /**
     * This column stores the unique identifier for the default hospital account of the guarantor
     */
    SBO_HSP_ACCOUNT_ID: number;
    /**
     * Reference to HAR_ALL based on SBO_HSP_ACCOUNT_ID
     */
    sbo_hsp_account?: HAR_ALL;
    /**
     * A free text comment that can be entered when the value that is considered to be "Other" is selected as the employer
     */
    EMPR_ID_CMT: string;
    /**
     * If the guarantor is the same person as a patient, this item contains the patient ID.
     */
    PAT_REC_OF_GUAR_ID: string;
    /**
     * Reference to PATIENT based on PAT_REC_OF_GUAR_ID
     */
    pat_rec_of_guar?: PATIENT;
    /**
     * Self-pay balance of accounts in bad debt that have been billed to self-pay.
     */
    HB_BD_SELFPAY_BAL: number;
    /**
     * This column stores the total of all insurance buckets for this guarantor's hospital accounts that are in bad debt when using account-based bad debt.
     */
    HB_BD_INSURANCE_BAL: number;
    /**
     * This column stores the total of all undistributed buckets for this guarantor's hospital accounts that are in bad debt when using account-based bad debt.
     */
    HB_BD_UNDISTRIB_BAL: number;
    /**
     * The category number for the county of the guarantor's billing address.
     */
    COUNTY_C_NAME: string;
    /**
     * The category number for the country of the guarantor's billing address.
     */
    COUNTRY_C_NAME: string;
    /**
     * The category number for the guarantor's employment status.
     */
    EMPY_STAT_C_NAME: string;
    /**
     * The category number for the country of the guarantor's employer.
     */
    GUAR_EMP_CNTRY_C_NAME: string;
    /**
     * The verification record of the guarantor.
     */
    GUAR_VERIF_ID: number;
    /**
     * The unique identifier for the account record.
     */
    ACCT_ID: number;
    /**
     * Last statement's billed amount
     */
    LAST_BILLED_AMT: number;
    /**
     * Last statement's insurance amount
     */
    LAST_INS_BAL: number;
    /**
     * Last date the claim was produced
     */
    LAST_CLAIM_DATE: Date;
    /**
     * Date the last follow-up letter was sent.
     */
    FOL_UP_LAST_LET_DT: Date;
    /**
     * Total account undistributed credit balance
     */
    UNDIST_CREDIT_BAL: number;
    /**
     * Account undistributed credit balance - insurance credits only.
     */
    UNDIST_INS_CR_BAL: number;
    /**
     * Account undistributed credit balance - self-pay credits only.
     */
    UNDIST_SP_CR_BAL: number;
    /**
     * Number of undistributed credits that are marked as for later distribution in this account.
     */
    DIST_LATER_COUNT: number;
    /**
     * The most recent date on which the account was held from the Professional Billing (PB) statement processing.
     */
    STMT_HOLD_DT: Date;
    /**
     * Mobile phone for guarantor accounts.
     */
    MOBILE_PHONE: string;
    /**
     * This is the sum of delinquent payment plan payments.
     */
    PMT_PLAN_DLQ_AMT: number;
    /**
     * This includes both the delinquent amount and the amount due for the current month.
     */
    PMT_PLAN_DUE_AMT: number;
    /**
     * This is the total amount of the payment plan payments.
     */
    PMT_PLAN_PAID_AMT: number;
    /**
     * This is the remaining amount of the payment plan.
     */
    PMT_PLAN_REMAIN_AMT: number;
    /**
     * This item stores the Hospital Billing (HB) external Accounts Receivable (AR) self-pay balance for the account.
     */
    HB_EXT_AR_SELF_PAY_BAL: number;
    /**
     * This item stores the Hospital Billing (HB) external Accounts Receivable (AR) insurance balance for the account.
     */
    HB_EXT_AR_INS_BAL: number;
    /**
     * This item stores the Hospital Billing (HB) external Accounts Receivable (AR) undistributed balance for the account.
     */
    HB_EXT_AR_UNDIST_BAL: number;
    /**
     * The user who initiated the linked address changes.
     */
    ADDR_CHG_USER_ID: string;
    /**
     * Reference to CLARITY_EMP based on ADDR_CHG_USER_ID
     */
    addr_chg_user?: CLARITY_EMP;
    /**
     * The name of the user record
     */
    ADDR_CHG_USER_ID_NAME: string;
    /**
     * The instant that the linked address change was initiated.
     */
    ADDR_CHG_INSTANT_DTTM: Date;
    /**
     * The source record that initiated the linked address changes.
     */
    ADDR_CHG_SOURCE: string;
    /**
     * This is updated based on changes to patient balance.
     */
    PB_SELF_PAY_BAL_UPDATE_DATE: Date;
    /**
     * This is updated based on changes to Hospital Billing (HB) self-pay balance (I EAR 20003).
     */
    HB_SELF_PAY_BAL_UPDATE_DATE: Date;
    /**
     * Collection of ACCOUNT_CREATION as children
     */
    account_creation?: ACCOUNT_CREATION[];
    /**
     * Collection of ACCT_ADDR as children
     */
    acct_addr?: ACCT_ADDR[];
    /**
     * Collection of ACCT_COVERAGE as children
     */
    acct_coverage?: ACCT_COVERAGE[];
    /**
     * Collection of ACCT_GUAR_PAT_INFO as children
     */
    acct_guar_pat_info?: ACCT_GUAR_PAT_INFO[];
    /**
     * Collection of ACCT_HOME_PHONE_HX as children
     */
    acct_home_phone_hx?: ACCT_HOME_PHONE_HX[];
    /**
     * Collection of ACCT_TX as children
     */
    acct_tx?: ACCT_TX[];
    /**
     * Collection of GUAR_ACCT_STMT_HX as children
     */
    guar_acct_stmt_hx?: GUAR_ACCT_STMT_HX[];
    /**
     * Collection of GUAR_ADDR_HX as children
     */
    guar_addr_hx?: GUAR_ADDR_HX[];
    /**
     * Collection of GUAR_PMT_SCORE_PB_HX as children
     */
    guar_pmt_score_pb_hx?: GUAR_PMT_SCORE_PB_HX[];
    /**
     * Collection of ACCOUNT_CONTACT as children
     */
    account_contact?: ACCOUNT_CONTACT[];
}


