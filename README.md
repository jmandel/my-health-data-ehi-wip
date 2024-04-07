# EHI Data Exploration

Welcome to the EHI Data Exploration repository! This project is an individual exploration by Josh Mandel, aimed at creating components that others can try and learn from in the context of electronic health information (EHI) data. It focused on processing EHI Export data from Epic, which users can request from their health care provider.

## Project Overview

The goal of this project is to provide a starting point for exploring and working with EHI data. It includes various scripts and utilities to assist in tasks such as data redaction, JSON conversion, merging related tables, code generation, and SQLite database creation.

Please note that this project is still in its early stages and is primarily intended for educational purposes and experimentation.

## Contents

This repository contains the following files:

- `00-redact.js`: A script for redacting sensitive information from TSV files. It generates redaction regexes based on provided terms and applies them to the TSV files in the specified directory.
- `01-make-json.js`: A script for converting TSV data into JSON format. It reads the TSV files, validates and parses the data based on the provided schema, and generates a single JSON file containing the structured data.
- `02-merge-related-tables.ts`: A script for inferring relationships and merging related tables. It merges tables base on a same-logical-table heuristic, and annotates tables with child-table and foreign-key relationships.
- `03-split-files.ts`: A script for splitting data into separate JSON files for each table. It ensures that the rows in each table are sorted by the primary key columns.
- `04-codegen.ts`: A script for generating TypeScript code based on the metadata. It creates interfaces, classes, and proxy objects to facilitate working with the data in a type-safe manner.
- `05-sqlite.ts`: A script for creating an SQLite database from the JSON files. It generates the SQL schema, creates tables, and inserts data into the corresponding tables based on the JSON files.

## Data Model Overview

The EHI data model consists of various domains and key tables. Here's a high-level overview of the main concepts:

- **Patient Demographics**: Core information about patients, including main demographics (`PATIENT`), insurance coverage (`COVERAGE`).
- **Encounters**: Records of patient visits and interactions, with key tables such as `PAT_ENC` (main encounters), `APPT` (appointments), `HSP_ACCOUNT` (hospital accounts), and `COVERAGE_PAYOR_PLAN` (payer/plan for encounters).
- **Clinical Documentation**: Notes, forms, and other clinical writings, including `HNO_INFO` (notes), and `IP_FLWSHT` tables (flowsheets).
- **Problem Lists**: Patient medical issues over time, with key tables like `PROBLEM_LIST` (current problems) and `PROBLEM_LIST_HX` (problem history).
- **Diagnoses**: Detailed diagnosis information, including `PAT_ENC_DX` (encounter diagnoses), and `PROBLEM_LIST` (problem-linked diagnoses).
- **Orders**: Requests for medication, procedures, labs, imaging, etc., with tables such as `ORDER_PROC` (procedure orders), `ORDER_MED` (medication orders), and `ORDER_RESULTS` (results).
- **Medications**: Detailed drug information, including `ORDER_MED` (orders), `CLARITY_MEDICATION` (medication records), and `RX_PHR` (pharmacies).


## Getting Started

To get started with this project, follow these steps:

1. Clone the repository to your local machine.
2. Install the necessary dependencies by running `bun install`.
3. Unzip your EHI data in TSV format and place it in the `tsv` directory.
4. Run the scripts in the following order:
  - `bun 00-redact.js` to redact sensitive information from the TSV files.
  - `bun 01-make-json.js` to convert the TSV data into JSON format.
  - `bun 02-merge-related-tables.ts` to merge related tables.
  - `bun 03-split-files.ts` to split the merged JSON data into separate files.
  - `bun 04-codegen.ts` to generate TypeScript code based on the database metadata.
  - `bun 05-sqlite.ts` to create an SQLite database from the JSON files.
5. Explore the generated files and the SQLite database to gain insights into the EHI data.

Please refer to the individual script files for more detailed information on their usage and functionality.

## Contributing

Contributions to this project are welcome! If you have suggestions, improvements, or insights to share, feel free to reach out on [chat.fhir.org](https://chat.fhir.org) or Twitter [@JoshCMandel](https://twitter.com/JoshCMandel). You can also submit an issue or pull request on GitHub.

## License

This project is licensed under the [MIT License](LICENSE).
